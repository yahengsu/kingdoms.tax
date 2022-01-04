import { fromUnixTime } from 'date-fns';
import { format } from 'date-fns-tz';
import React from 'react';

import {
  addrs_to_token,
  decimals,
  LP_PAIRS,
  OTHER_LP_PAIRS,
  OTHER_ADDRESSES,
  QUEST_TOKEN_ADDRESSES,
} from '../constants/constants';

type Direction = 'IN' | 'OUT';
type Token = 'ERC20' | 'ERC721';

type CardProps = {
  direction: Direction;
  netAmount: string; // Hex String
  timestamp: number;
  tokenAddr: string; // Hex String
  tokenId: string; // Hex String
  tokenType: Token;
  txnHash: string; // Hex String
  counterparty: string; // Hex String
  price: number;
};

const TransactionCard: React.FC<CardProps> = ({ ...props }) => {
  const { direction, netAmount, timestamp, tokenAddr, tokenId, tokenType, txnHash, counterparty, price } = props;
  let netAmt = '1';
  let amount = 0;
  if (tokenType === 'ERC20') {
    const weiAmt = parseFloat(parseInt(netAmount, 16).toString());
    amount = weiAmt / Math.pow(10, decimals[tokenAddr]);
    netAmt = amount.toFixed(Math.min(4, decimals[tokenAddr]));
  }

  if (direction === 'IN') {
    netAmt = '+ ' + netAmt;
  } else {
    netAmt = '- ' + netAmt;
  }

  const eventType = () => {
    if (
      // minted from quest
      direction === 'IN' &&
      counterparty === OTHER_ADDRESSES.NULL_ADDRESS &&
      QUEST_TOKEN_ADDRESSES.includes(tokenAddr)
    ) {
      return 'QUEST';
    } else if (
      // selling to gold vendor
      direction === 'OUT' &&
      counterparty === OTHER_ADDRESSES.NULL_ADDRESS &&
      QUEST_TOKEN_ADDRESSES.includes(tokenAddr) &&
      tokenAddr !== OTHER_ADDRESSES.DFK_SHVAS_ADDRESS
    ) {
      return 'VENDOR';
    } else if (
      // receiving gold from gold vendor
      direction === 'IN' &&
      counterparty === OTHER_ADDRESSES.NULL_ADDRESS &&
      tokenAddr === OTHER_ADDRESSES.DFK_GOLD_ADDRESS
    ) {
      return 'VENDOR';
    } else if (
      // burning shvas to level
      direction === 'OUT' &&
      counterparty === OTHER_ADDRESSES.NULL_ADDRESS &&
      tokenAddr === OTHER_ADDRESSES.DFK_SHVAS_ADDRESS
    ) {
      return 'LEVEL';
    } else if (LP_PAIRS.includes(counterparty) || OTHER_LP_PAIRS.includes(counterparty)) {
      // sending/receiving from an LP address -> DEX Swap
      return 'DEX';
    } else if (counterparty === OTHER_ADDRESSES.BANK_ADDRESS && tokenAddr === OTHER_ADDRESSES.JEWEL_ADDRESS) {
      // sending/receiving JEWEL from BANK
      return 'BANK';
    } else if (counterparty === OTHER_ADDRESSES.NULL_ADDRESS && tokenAddr === OTHER_ADDRESSES.XJEWEL_ADDRESS) {
      // sending/receiving xJEWEL from BANK
      return 'BANK';
    } else if (tokenType === 'ERC721') {
      // ERC721 means HERO txn
      return 'HERO';
    }
    // if unknown return TRANSFER
    return 'TRANSFER';
  };

  const directionDefaultClasses = 'px-3 col-span-1 rounded-lg font-medium w-1rem justify-self-center text-center';
  const directionClasses =
    direction === 'IN'
      ? directionDefaultClasses + ' text-green-500 bg-green-200'
      : directionDefaultClasses + ' text-red-500 bg-red-200';

  const txnDate = fromUnixTime(timestamp);
  const dateString = format(txnDate, 'd MMM yyyy');
  const timeString = format(txnDate, 'hh:mm:ss a z');

  return (
    <div className="grid grid-cols-12 rounded-lg py-5 drop-shadow-lg hover:drop-shadow-2xl bg-white w-2/3 text-lg items-center">
      <a
        target="_blank"
        rel="noreferrer"
        href={'https://explorer.harmony.one/tx/' + txnHash}
        className="px-5 col-span-1 font-semibold hover:text-blue-500 transition duration-200 ease-in-out"
      >
        {txnHash.substr(0, 8)}
      </a>
      <span className="px-5 col-span-2">
        {dateString}
        <br />
        {timeString}
      </span>
      <div className={directionClasses}>{direction}</div>
      <div className="px-5 col-span-1">
        <img
          className="w-14 transition duration-150"
          alt={addrs_to_token[tokenAddr]}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={addrs_to_token[tokenAddr]}
          src={'/' + addrs_to_token[tokenAddr] + '.png'}
        />
      </div>
      <span className="px-5 col-span-2">{netAmt}</span>
      <span className="px-5 col-span-2 rounded-lg font-medium w-1rem justify-self-center text-center bg-cyan-200">
        {eventType()}
      </span>
      <span className="px-5 col-span-1 justify-self-center">{tokenId ? parseInt(tokenId, 16) : 'N/A'} </span>
      <span className="px-5 col-span-2">{`\$${(price * amount).toFixed(2)}`}</span>
    </div>
  );
};

export default TransactionCard;
