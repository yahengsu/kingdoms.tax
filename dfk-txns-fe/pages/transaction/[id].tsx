import { useRouter } from 'next/router';
import Head from 'next/head';
import TransactionInfoTable from '../../components/TransactionInfoTable';

export default function Transaction() {
  const router = useRouter();
  const { address, id } = router.query;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>[DFK] Address {address}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="mt-3 text-3xl text-left ml-8">This is the transaction with txID {id}</h1>
        <TransactionInfoTable />
      </main>
    </div>
  );
}
