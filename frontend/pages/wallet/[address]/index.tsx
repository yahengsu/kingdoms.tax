import Head from 'next/head';
import { useRouter } from 'next/router';
import TransactionsTable from '../../../components/TransactionsTable';
import { Transaction } from '../../../types/types';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Wallet() {
  const router = useRouter();
  const { address, startDate, endDate } = router.query;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>[DFK] Address {address}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="mt-3 text-3xl text-left ml-8">
          This is the wallet address of {address} with start date {startDate} and endDate {endDate}
        </h1>
        <h3 className="mt-5 text-1xl text-left ml-8">Pro-tip, bookmark this page!</h3>
        <h2 className="mt-5 text-2xl text-left ml-8">Transactions</h2>
        <TransactionsTable address={address} />
      </main>
    </div>
  );
}
