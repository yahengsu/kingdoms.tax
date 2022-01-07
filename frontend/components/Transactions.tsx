import React, { useEffect } from 'react';
import TransactionCard from './TransactionCard';
import TransactionHeader from './TransactionsHeader';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactLoading from 'react-loading';
import QuestRewardCard from './QuestRewardCard';
import StatsCard from './StatsCard';

type Direction = 'IN' | 'OUT';
type Token = 'ERC20' | 'ERC721';

type TransactionsProps = {
  address: string;
  startTime: string;
  endTime: string;
};

export type TxnRequestParams = {
  address: string;
  startTime: string;
  endTime: string;
  page: string;
  count: string;
};

export type TxnResponse = {
  transactions: Array<Transaction>;
  total: number;
  has_more: boolean;
};

export type Transaction = {
  account: string;
  counterparty: string;
  block_number: number;
  direction: Direction;
  net_amount: string;
  timestamp: number;
  token_addr: string;
  token_id: string;
  token_type: Token;
  txn_hash: string;
  log_index: string;
  price: number;
};

export const requestTxns = async (requestParams: TxnRequestParams): Promise<TxnResponse> => {
  const searchParams = new URLSearchParams(requestParams);
  const url = 'https://backend-jtcrtmomna-uc.a.run.app/transactions?' + searchParams.toString();
  const res = await fetch(url);
  const json = await res.json();
  return json;
};

const Transactions: React.FC<TransactionsProps> = ({ ...props }) => {
  const { address, startTime, endTime } = props;
  const numToFetch = '25';
  const [hasMore, setHasMore] = React.useState(true);
  const [userTransactions, setUserTransactions] = React.useState<Array<Transaction>>([]);
  const [page, setPage] = React.useState(0);
  const [doneLoading, setDoneLoading] = React.useState(false);
  const [reset, setReset] = React.useState(false);

  const getTxns = async () => {
    try {
      if (address) {
        const paramsObj: TxnRequestParams = {
          address: address,
          startTime: startTime,
          endTime: endTime,
          page: page.toString(),
          count: numToFetch,
        };
        const json = await requestTxns(paramsObj);
        const txns = json.transactions;
        if (txns !== null) {
          setUserTransactions(userTransactions.concat(txns));
          setHasMore(json.has_more);
          setPage(page + 1);
        } else {
          setUserTransactions([]);
          setHasMore(false);
        }
        setDoneLoading(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const spinLoader = (
    <div className={'flex justify-center items-center mt-6'}>
      <ReactLoading type={'spin'} color={'#22d3ee'} height={'60px'} width={'60px'} />
    </div>
  );

  useEffect(() => {
    // Reset on inputs change
    setUserTransactions([]);
    setPage(0);
    setHasMore(true);
    setDoneLoading(false);
    setReset(true);
  }, [address, startTime, endTime]);

  useEffect(() => {
    if (reset) {
      getTxns();
      setReset(false);
    }
  }, [reset]);

  return userTransactions.length === 0 ? (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <TransactionHeader />
      {doneLoading ? (
        <h1 className="mt-16 text-center w-full h-full font-semibold text-3xl">No transactions to display.</h1>
      ) : (
        <div className="mt-16">
          <ReactLoading type={'spin'} color={'#22d3ee'} height={'60px'} width={'60px'} />
        </div>
      )}
    </div>
  ) : (
    <InfiniteScroll
      className="flex flex-col justify-center items-center w-screen h-full"
      next={getTxns}
      hasMore={hasMore}
      loader={spinLoader}
      dataLength={userTransactions.length}
    >
      <div className="flex flex-row w-5/6 2xl:w-2/3 space-x-5">
        <QuestRewardCard address={address} startTime={startTime} endTime={endTime} />
        <StatsCard>
          <p className="text-center place-self-center font-medium align-middle">Coming soon!</p>
        </StatsCard>
      </div>
      <TransactionHeader />
      {userTransactions.map((txn) => (
        <div className="flex flex-row justify-center py-2 w-full" key={txn.txn_hash + txn.direction + txn.log_index}>
          <TransactionCard
            direction={txn.direction}
            netAmount={txn.net_amount}
            timestamp={txn.timestamp}
            tokenAddr={txn.token_addr}
            tokenId={txn.token_id}
            tokenType={txn.token_type}
            txnHash={txn.txn_hash}
            counterparty={txn.counterparty}
            price={txn.price}
          />
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default Transactions;
