import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Transactions from '../../components/Transactions';
import SearchFilterBar from '../../components/SearchFilterBar';

const Txns: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  const resetDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const [startDate, setStartDate] = useState<Date | undefined | null>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined | null>(undefined);

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) setStartDate(endDate);
  }, [endDate]);

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) setEndDate(startDate);
  }, [startDate]);

  return (
    <div className="flex flex-col font-default w-full min-h-screen items-center bg-gray-50 py-10">
      <h1 className="font-bold text-3xl">Your Transactions</h1>
      <SearchFilterBar
        address={address}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onDateReset={resetDates}
      />
      <Transactions
        address={typeof address == 'string' ? address : ''}
        startTime={startDate ? String(startDate.getTime() / 1000) : ''}
        endTime={endDate ? String(endDate.getTime() / 1000) : ''}
      />
    </div>
  );
};

export default Txns;
