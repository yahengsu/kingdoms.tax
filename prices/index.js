require("dotenv").config();
const { Client } = require("pg");
const axios = require("axios");
var fs = require("fs");
const constants = require("./constants");

const LP_PAIRS = Object.entries(constants.lp.JEWEL);
const JEWEL_USDC_PAIR_ADDRESS = "0xa1221a5bbea699f507cc00bdedea05b5d2e32eba";
const JEWEL_ADDRESS = "0x72cb10c6bfa5624dd07ef608027e366bd690048f";
let totalNumTickData = 0;
let totalNumAddedToDB = 0;

async function getPairData(pair) {
  const tokenName = pair[0];
  const pairAddress = pair[1].address;
  const inversed = pair[1].inverse;
  let skip = 0;

  var cleanedData = [];

  while (true) {
    const query = `
    {
      pairHourDatas(first: 1000 skip: ${skip} where: {pair: "${pairAddress.toLowerCase()}"}) {
        hourStartUnix
        reserve0
        reserve1
      }
    }
  `;
    const res = await axios({
      url: "http://graph3.defikingdoms.com/subgraphs/name/defikingdoms/dex",
      method: "POST",
      data: {
        query: query,
        variables: { skip },
      },
    });

    const data = await res.data.data.pairHourDatas;
    if (data.length == 0) {
      break;
    }
    skip += data.length;

    for (pairHourData of data) {
      const reserve0 = Number.parseFloat(pairHourData.reserve0);
      const reserve1 = Number.parseFloat(pairHourData.reserve1);
      // JEWEL / token
      const ratio = reserve0 / reserve1;
      let jewelPrice;
      let tokenPrice;

      if (inversed) {
        jewelPrice = 1 / ratio;
        tokenPrice = ratio;
      } else {
        jewelPrice = ratio;
        tokenPrice = 1 / ratio;
      }
      cleanedData.push({
        timestamp: pairHourData.hourStartUnix,
        JEWEL: jewelPrice,
        [`${tokenName}`]: tokenPrice,
      });
    }
  }
  totalNumTickData += cleanedData.length;
  fs.writeFileSync(
    `JEWEL-${tokenName}.json`,
    JSON.stringify(cleanedData, null, 2),
    { encoding: "utf-8", flag: "w" }
  );
}

async function getJewelUsdPrices() {
  // get data every two days
  const STEP = 86400 * 2;
  const START_TIMESTAMP = 1629769481;
  const COINGECKO_START_TIMESTAMP = 1632452603;
  const END_TIMESTAMP = (new Date().getTime() / 1000).toFixed(0);

  const query = `
    {
      pairHourDatas(where: {pair: "${JEWEL_USDC_PAIR_ADDRESS.toLowerCase()}", hourStartUnix_lt: 1632452603}) {
        hourStartUnix
        reserve0
        reserve1
      }
    }
  `;

  const res = await axios({
    url: "http://graph3.defikingdoms.com/subgraphs/name/defikingdoms/dex",
    method: "POST",
    data: {
      query: query,
    },
  });

  const dfkData = await res.data.data.pairHourDatas;
  let jewelPrices = [];
  let numCalls = 0;
  for (pairHourData of dfkData) {
    const timestamp = pairHourData.hourStartUnix;
    if (timestamp > COINGECKO_START_TIMESTAMP) {
      break;
    }
    const reserve0 = Number.parseFloat(pairHourData.reserve0);
    const reserve1 = Number.parseFloat(pairHourData.reserve1);
    const ratio = reserve0 / reserve1;
    jewelPrices.push({
      timestamp: timestamp,
      JEWEL: ratio,
      USD: 1 / ratio,
    });
  }

  let CURRENT_TIMESTAMP = START_TIMESTAMP;
  let STEP_TIMESTAMP = START_TIMESTAMP + STEP;
  while (CURRENT_TIMESTAMP < END_TIMESTAMP) {
    const url = `https://api.coingecko.com/api/v3/coins/harmony-shard-0/contract/0x72Cb10C6bfA5624dD07Ef608027E366bd690048F/market_chart/range?vs_currency=USD&from=${CURRENT_TIMESTAMP}&to=${STEP_TIMESTAMP}`;

    const res = await axios.get(url);
    const data = res.data;
    if (data.prices.length) {
      for (price of data.prices) {
        jewelPrices.push({
          timestamp: Math.trunc(price[0] / 1000),
          JEWEL: 1 / price[1],
          USD: price[1],
        });
      }
    }
    CURRENT_TIMESTAMP = STEP_TIMESTAMP;
    STEP_TIMESTAMP += STEP;
    numCalls += 1;
    await new Promise((resolve) => setTimeout(resolve, 700));
  }
  console.log(`Made ${numCalls} calls to coingecko api`);
  totalNumTickData += jewelPrices.length;
  fs.writeFileSync(`JEWEL-USD.json`, JSON.stringify(jewelPrices, null, 2), {
    encoding: "utf-8",
    flag: "w",
  });
}

// update token jsons with usd prices
function updateTokenUSDPrices(pair) {
  const tokenName = pair[0];
  var JEWEL_USD_PRICES = JSON.parse(fs.readFileSync(`JEWEL-USD.json`, "utf-8"));
  try {
    var TOKEN_JEWEL_PRICES = JSON.parse(
      fs.readFileSync(`JEWEL-${tokenName}.json`, "utf-8")
    );
  } catch (error) {
    console.log(
      `Error when opening JEWEL-${tokenName}.json for token ${tokenName} in updateTokenUSDPrices`,
      error
    );
    return;
  }

  let usd_prices_index = 0;

  for (let i = 0; i < TOKEN_JEWEL_PRICES.length; i++) {
    const timestamp = TOKEN_JEWEL_PRICES[i].timestamp;
    let otherTimestamp = JEWEL_USD_PRICES[usd_prices_index].timestamp;
    while (otherTimestamp < timestamp) {
      usd_prices_index += 1;
      otherTimestamp = JEWEL_USD_PRICES[usd_prices_index].timestamp;
    }
    const jewelUSDPrice = JEWEL_USD_PRICES[usd_prices_index].USD;
    const tokenUSDPrice = jewelUSDPrice * TOKEN_JEWEL_PRICES[i].JEWEL;

    TOKEN_JEWEL_PRICES[i].USD = tokenUSDPrice;
  }

  fs.writeFileSync(
    `JEWEL-${tokenName}.json`,
    JSON.stringify(TOKEN_JEWEL_PRICES, null, 2),
    { encoding: "utf-8", flag: "w" }
  );
}

async function addPairDataToDB(tokenName, tokenAddress, client) {
  try {
    var pairData = JSON.parse(
      fs.readFileSync(`JEWEL-${tokenName}.json`, "utf-8")
    );
  } catch (error) {
    console.log(
      `Error when parsing TOKEN_JEWEL_PRICES for token ${tokenName} in addPairDatatoDB`
    );
    return;
  }
  let addedRows = 0;
  for (tick of pairData) {
    const timestamp = tick.timestamp;
    const usdPrice = tick.USD;
    const query = {
      text: "INSERT INTO Price (timestamp, token, price) VALUES($1, $2, $3) ON CONFLICT (timestamp, token) DO NOTHING",
      values: [timestamp, tokenAddress.toLowerCase(), usdPrice],
    };
    try {
      const resp = await client.query(query);
      totalNumAddedToDB += resp.rowCount;
    } catch (error) {
      console.log(error.stack);
    }
  }
}

// RUN OCCASIONALLY TO UPDATE DATA
async function run() {
  // get JEWEL USD Prices from grqphql API + coingecko
  console.log("Getting JEWEL USD Prices");
  await getJewelUsdPrices();

  // get pair data from graphql API
  for (pair of LP_PAIRS) {
    console.log(`Getting JEWEL-${pair[0]} prices`);
    await getPairData(pair);
  }

  // append item usd prices
  for (pair of LP_PAIRS) {
    console.log(`Updating ${pair[0]} USD prices`);
    await updateTokenUSDPrices(pair);
  }

  console.log(`Expecting ${totalNumTickData} rows in DB`);
  const pgClient = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_URL,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
  });
  console.log("Connecting to postgres db");
  await pgClient.connect();
  console.log("Connected to postgres db");
  // add rows to database
  console.log("Adding JEWEL to db");
  await addPairDataToDB("USD", JEWEL_ADDRESS, pgClient);
  console.log("Finished adding JEWEL to db");

  console.log("Adding pair usd data to db");
  for (pair of LP_PAIRS) {
    const name = pair[0];
    const address = pair[1].token;
    console.log(`Adding ${name} to db`);
    await addPairDataToDB(name, address, pgClient);
    console.log(`Finished adding ${name} to db`);
  }
  console.log("Finished adding pair usd data to db");
  console.log(`Added ${totalNumAddedToDB} rows to db`);
  console.log("Finished running all tasks");
}

// update feeds every 2 hours
const TIMEOUT = 1000 * 60 * 60 * 2;
console.log(`Running price feed script at time ${Date.now()}`);
run();
setInterval(() => {
  console.log(`Running price feed script at time ${Date.now()}`);
  run();
}, TIMEOUT);
