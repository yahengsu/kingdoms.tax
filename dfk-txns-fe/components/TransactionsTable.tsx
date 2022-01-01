import { useState } from 'react';
import { Transaction } from '../types/types';
import TransactionsTableFooter from './TransactionsTableFooter';

type TransactionsTableProps = {
  transactions: Transaction[];
};
// TODO: Merge TokenType and TokenValue and TokenUSD Value into one row
// TODO: Add links to transaction pages for txn hashes
// TODO: Add a link to the harmony explorer
const TransactionTableHeaders = [
  'hash',
  'event',
  'block',
  'date',
  'from',
  'to',
  'token1',
  'token2',
  'token1USDValue',
  'token2USDValue',
];
const testTransactions: Transaction[] = [
  {
    hash: 'test1',
    event: 'SWAP',
    block: 21113217,
    timestamp: 194829230,
    from: '0x3d1d06c7488d15A357e68013b2c5d93ECD29F0bd ',
    to: '0x3d1d06c7488d15A357e68013b2c5d93ECD29F0bd ',
    token1Type: 'JEWEL',
    token2Type: 'ONE',
    token1Value: 100,
    token2Value: 21024,
    token1USDValue: 420,
    token2USDValue: 42069,
  },
  {
    hash: 'test1',
    event: 'QUEST',
    block: 21113217,
    timestamp: 194829230,
    from: '0x3d1d06c7488d15A357e68013b2c5d93ECD29F0bd',
    to: '0x3d1d06c7488d15A357e68013b2c5d93ECD29F0bd',
    token1Type: '',
    token2Type: '',
    token1Value: undefined,
    token2Value: undefined,
    token1USDValue: undefined,
    token2USDValue: undefined,
  },
];
export default function TransactionsTable(props: TransactionsTableProps) {
  const [transactions, setTransactions] = useState(testTransactions);
  return (
    <div className="mx-2 my-2 overflow-x-auto">
      <div className="py-2 align-middle inline-block">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {TransactionTableHeaders.map((key, i) => {
                  return (
                    <th
                      scope="col"
                      className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase text-center tracking-wider max-w-sm"
                      key={`header-${i}`}
                    >
                      {key}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((txn, i) => {
                return (
                  <tr key={i}>
                    <td id={`td-hash-${i}`}>HASH</td>
                    <td id={`td-hash-${i}`}>EVENT</td>
                    <td id={`td-hash-${i}`}>BLOCK</td>
                    <td id={`td-hash-${i}`}>TIMESTAMP</td>
                    <td id={`td-hash-${i}`} className="max-w-[6rem] truncate">
                      0x3d1d06c7488d15A357e68013b2c5d93ECD29F0bd
                    </td>
                    <td id={`td-hash-${i}`} className="max-w-[6rem] truncate">
                      0x3d1d06c7488d15A357e68013b2c5d93ECD29F0bd
                    </td>
                    <td>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">12321 JEWEL-AVAX LP</div>
                        <div className="text-sm text-gray-500">12312312 USD</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <TransactionsTableFooter
            startResult={props.startResult}
            endResult={props.endResult}
            minPage={props.minPage}
            maxPage={props.maxPage}
            totalResults={props.totalResults}
          />
        </div>
      </div>
    </div>
  );
}
