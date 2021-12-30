import { NextPage } from 'next';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Button from '../components/Button';
import DateTimePicker from '../components/DateTimePicker';
import Input from '../components/Input';

type WalletFormValues = {
  address: string;
};

const Home: NextPage = () => {
  const formMethods = useForm<WalletFormValues>();
  const formErrors = formMethods.formState.errors;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const onSubmit = () => {};

  return (
    <div className="flex flex-col font-default w-full min-h-screen items-center justify-center bg-gray-50">
      <h1 className="font-bold text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
        penis
      </h1>
      <FormProvider {...formMethods}>
        <form className="mt-10 w-1/2" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3 w-full">
            <div className="col-span-7">
              <Input formFieldName="address" placeholder="Wallet Address" autoComplete="off" />
            </div>
            <div className="col-span-2">
              <DateTimePicker
                selectedDate={startDate}
                onChange={(date) => setStartDate(date)}
                start
                startDate={startDate}
                endDate={endDate}
              />
            </div>
            <div className="col-span-1">
              <Button buttonText="Search" />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Home;
