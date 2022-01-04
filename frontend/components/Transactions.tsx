import React, { useEffect } from 'react';
import TransactionCard from './TransactionCard';
import TransactionHeader from './TransactionsHeader';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactLoading from 'react-loading';
import CSVModal from './CSVModal';

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
      }
    } catch (err) {
      console.log(err);
    }
  };

  const spinLoader = (
    <div className={'flex justify-center items-center mt-6'}>
      <ReactLoading type={'spin'} color={'#8b5cf6'} height={'60px'} width={'60px'} />
    </div>
  );

  useEffect(() => {
    getTxns();
  }, [address, startTime, endTime]);

  return (
    <InfiniteScroll
      className="flex flex-col justify-center items-center w-full h-full py-5"
      next={getTxns}
      hasMore={hasMore}
      loader={spinLoader}
      dataLength={userTransactions.length}
    >
      <CSVModal
        address={address}
        startTime={startTime}
        endTime={endTime}
      />
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
          />
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default Transactions;
