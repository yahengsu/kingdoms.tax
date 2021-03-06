import React from 'react';

import { addrs_to_token, token_to_addrs } from '../constants/constants';
import StatsCard from './StatsCard';

type QuestReward = {
  token_addr: string;
  count: number;
};

type QuestTxnResponse = {
  questsCounts: Array<QuestReward>;
};

type QuestProps = {
  address: string;
  startTime: string;
  endTime: string;
};

const QuestRewardCard: React.FC<QuestProps> = ({ ...props }) => {
  const [rewards, setRewards] = React.useState<Array<QuestReward> | []>([]);

  const { address, startTime, endTime } = props;
  const getQuestCounts = async (reqParams: QuestProps) => {
    const searchParams = new URLSearchParams(reqParams);
    const url = 'https://backend-jtcrtmomna-uc.a.run.app/questcounts?' + searchParams.toString();
    const res = await fetch(url);
    const json: QuestTxnResponse = await res.json();
    console.log(json);
    console.log(json.questsCounts);
    setRewards(json.questsCounts);
    return json;
  };

  React.useEffect(() => {
    if (address) {
      const reqParams: QuestProps = {
        address,
        startTime,
        endTime,
      };
      getQuestCounts(reqParams);
    }
  }, [address, startTime, endTime]);

  // Manually filter out non-quest items (oops they're also minted from zero addr)
  const items = rewards
    ? rewards
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
        ))
    : [];

  return (
    <StatsCard>
      <p className="mb-5 font-semibold text-xl justify-self-start">Quest Rewards</p>
      <div className="grid grid-cols-6 grid-rows-4 justify-items-center items-center place-content-around">{items}</div>
    </StatsCard>
  );
};

export default QuestRewardCard;
