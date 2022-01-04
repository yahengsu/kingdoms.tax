import React, { useEffect } from 'react';
import type { Transaction, TxnRequestParams } from './Transactions';
import { requestTxns } from './Transactions';
import ProgressBar from './ProgressBar';
import { CSVLink } from 'react-csv';
import Button from './Button';
import { decimals } from '../constants/constants';

type ExportProps = {
  address: string;
  startTime: string;
  endTime: string;
};

type CSVTxns = {
  txnHash: string;
  date: string;
  tokenAddr: string;
  netAmount: string;
};

const CSVModal: React.FC<ExportProps> = ({ ...props }) => {
  const [showModal, setShowModal] = React.useState(false);
  const { address, startTime, endTime } = props;
  const numToFetch = '100';
  const [total, setTotal] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [downloadedTxns, setDownloadedTxns] = React.useState<Array<CSVTxns>>([]);
  const headers = [
    { label: 'Transaction Hash', key: 'txnHash' },
    { label: 'Date', key: 'date' },
    { label: 'Token Address', key: 'tokenAddr' },
    { label: 'Net Token Amount', key: 'netAmount' },
  ];

  const txnsToCsv = (transactions: Array<Transaction>): Array<CSVTxns> => {
    const ret = [];
    for (const txn of transactions) {
      let netAmt = '1';
      if (txn.token_type === 'ERC20') {
        const weiAmt = parseFloat(parseInt(txn.net_amount, 16).toString());
        netAmt = (weiAmt / Math.pow(10, decimals[txn.token_addr])).toFixed(Math.min(4, decimals[txn.token_addr]));
      }

      if (txn.direction === 'IN') {
        netAmt = '+' + netAmt;
      } else {
        netAmt = '-' + netAmt;
      }

      ret.push({
        txnHash: txn.txn_hash,
        date: new Date(txn.timestamp).toUTCString(),
        tokenAddr: txn.token_addr,
        netAmount: netAmt,
      });
    }
    return ret;
  };

  const getMoreTxns = async () => {
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
          const newTxns = downloadedTxns.concat(txnsToCsv(txns));
          setTotal(json.total);
          setDownloadedTxns(newTxns);
          setHasMore(json.has_more);
          setPage(page + 1);
          setProgress(newTxns.length);
        } else {
          setDownloadedTxns([]);
          setHasMore(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (showModal && hasMore) {
      getMoreTxns();
    }
  }, [address, startTime, endTime, progress, showModal]);

  return (
    <>
      <Button onClick={() => setShowModal(true)} buttonText="Export to CSV" />
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Download Transactions as CSV</h3>
                </div>
                <div className="relative p-5 flex-col flex items-center">
                  <ProgressBar current={progress} end={total} />
                  <p className="pt-2 font-semibold">
                    {progress}/{total}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <Button className="px-6 py-2" onClick={() => setShowModal(false)} buttonText="Close" />
                  {hasMore ? (
                    <p>Processing...</p>
                  ) : (
                    <CSVLink
                      className="py-2 px-4 border-2 border-transparent rounded-md text-white bg-black hover:bg-white hover:border-black hover:text-black"
                      onClick={() => setShowModal(false)}
                      data={downloadedTxns}
                      headers={headers}
                    >
                      Download
                    </CSVLink>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default CSVModal;
