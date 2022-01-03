import { NextPage } from 'next';
import { useRouter } from 'next/router'
import Transactions from '../../components/Transactions';

const Txns: NextPage = () => {
  const router = useRouter()
  const { address, startTime, endTime } = router.query
  console.log({address, startTime, endTime});

  return (
    <div className="flex flex-col font-default w-full min-h-screen items-center bg-gray-50 py-10">
      <h1 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
        DFK token transactions for address: {address}
      </h1>
      <Transactions
        address={typeof address == "string" ? address : ''}
        startTime={typeof startTime == "string" ? startTime : ''}
        endTime={typeof endTime == "string" ? endTime : ''}
      />
    </div>
  )
}

export default Txns;
