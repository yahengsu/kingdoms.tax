import { ethers } from 'ethers';
import React from 'react';

import { token_to_addrs, addrs_to_token, QUEST_TOKEN_ADDRESSES, decimals } from '../constants/constants';
import StatsCard from './StatsCard';
import ReactLoading from 'react-loading';

type InventoryBalance = {
  token_addr: string;
  count: string;
};

type InventoryProps = {
  address: string;
};

const abi = ['function balanceOf(address) view returns (uint)'];

const InventoryCard: React.FC<InventoryProps> = ({ ...props }) => {
  const [inventory, setInventory] = React.useState<Array<InventoryBalance> | []>([]);
  const [doneLoading, setDoneLoading] = React.useState<Boolean>(false);
  const provider = new ethers.providers.JsonRpcProvider('https://api.s0.t.hmny.io');
  const { address } = props;
  const getQuestCounts = async (address: string) => {
    let inv: Array<InventoryBalance> = [];
    for (const addr of QUEST_TOKEN_ADDRESSES) {
      const tokenContract = new ethers.Contract(addr, abi, provider);
      const balance = await tokenContract.balanceOf(address);
      const balanceNum = ethers.utils.formatUnits(balance, decimals[addr]);
      const invBalance: InventoryBalance = {
        token_addr: addr,
        count: balanceNum,
      };
      if (parseInt(balanceNum, 10) !== 0) {
        inv.push(invBalance);
      }
    }
    setInventory(inv);
    setDoneLoading(true);
    console.log(inv);
    return inv;
  };

  React.useEffect(() => {
    if (address) {
      getQuestCounts(address);
    }
  }, [address]);

  // Manually filter out non-quest items (oops they're also minted from zero addr)
  const items = inventory
    .filter((item) => {
      if (item.token_addr === token_to_addrs['xJewel'] || item.token_addr === token_to_addrs['Hero']) {
        return false;
      }
      return true;
    })
    .map((item) => (
      <div className="grid grid-cols-2 col-span-1 text-center items-center" key={item.token_addr}>
        <img
          className="w-12 transition duration-150"
          alt={addrs_to_token[item.token_addr]}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={addrs_to_token[item.token_addr]}
          src={'/' + addrs_to_token[item.token_addr] + '.png'}
        ></img>
        <p>x{item.count}</p>
      </div>
    ));

  return doneLoading ? (
    <StatsCard>
      <p className="mb-5 font-semibold text-xl justify-self-start">Current Inventory</p>
      <div className="grid grid-cols-6 grid-rows-4 justify-items-center items-center place-content-around">{items}</div>
    </StatsCard>
  ) : (
    <StatsCard>
      <p className="mb-5 font-semibold text-xl justify-self-start">Current Inventory</p>
      <div className="m-16">
        <ReactLoading type={'spin'} color={'#22d3ee'} height={'60px'} width={'60px'} />
      </div>
    </StatsCard>
  );
};

export default InventoryCard;
