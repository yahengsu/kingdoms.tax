import React, { useEffect, useState } from 'react';
import TransactionCard from './TransactionCard';
import TransactionHeader from './TransactionsHeader';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactLoading from 'react-loading';

type Direction = "IN" | "OUT";
type Token = "ERC20" | "ERC721";

type TransactionsProps = {
    address: string
    startTime: string,
    endTime: string
};

type Transaction = {
    account: string,
    counterparty: string,
    block_number: number,
    direction: Direction,
    net_amount: string,
    timestamp: number,
    token_addr: string,
    token_id: string,
    token_type: Token,
    txn_hash: string,
    log_index: string,
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
                const paramsObj = {
                    address: address,
                    startTime: startTime,
                    endTime: endTime,
                    page: page.toString(),
                    count: numToFetch
                }
                const searchParams = new URLSearchParams(paramsObj);
                const url = 'https://backend-jtcrtmomna-uc.a.run.app/transactions?' + searchParams.toString();
                const res = await fetch(url);
                const json = await res.json();
                const txns: Array<Transaction> = json.transactions;
                setUserTransactions(userTransactions.concat(txns));
                setHasMore(json.has_more);
                setPage(page + 1);
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

    useEffect(() => { getTxns() }, [address, startTime, endTime]);

    return (
        <InfiniteScroll className="flex flex-col justify-center items-center w-full py-5" next={getTxns} hasMore={hasMore} loader={spinLoader} dataLength={userTransactions.length}>
            <TransactionHeader/>
            {userTransactions.map((txn) => (
                <div className="flex flex-row justify-center py-2 w-full">
                    <TransactionCard
                        direction={txn.direction}
                        netAmount={txn.net_amount}
                        timestamp={txn.timestamp}
                        tokenAddr={txn.token_addr}
                        tokenId={txn.token_id}
                        tokenType={txn.token_type}
                        txnHash={txn.txn_hash}
                    />
                </div>
            ))

            }
        </InfiniteScroll>
    );
};

export default Transactions;