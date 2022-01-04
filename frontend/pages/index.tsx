import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import Button from '../components/Button';
import Input from '../components/Input';
import { validateAddress } from '../utils/address';

type WalletFormValues = {
  address: string;
};

const Home: NextPage = () => {
  const formMethods = useForm<WalletFormValues>();
  const formErrors = formMethods.formState.errors;
  const router = useRouter();

  const onSubmit: SubmitHandler<WalletFormValues> = ({ address }) => {
    router.push(`/txns/${address}`);
  };

  return (
    <div className="flex flex-col font-default w-full min-h-screen items-center justify-center bg-gray-50">
      <h1 className="font-bold text-7xl text-transparent text-center bg-clip-text bg-gradient-to-r from-cyan-500 to-green-500">
        Explore your <br /> DFK transactions.
      </h1>
      <FormProvider {...formMethods}>
        <form className="mt-12 w-3/4 md:w-1/2 lg:w-3/7 xl:w-1/3" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <div className="flex flex-row space-x-5">
            <Input
              formFieldName="address"
              placeholder="Wallet Address"
              autoComplete="off"
              errorState={Boolean(formErrors.address)}
              formRegisterOptions={{
                required: {
                  value: true,
                  message: 'Please enter a wallet address.',
                },
                validate: (value) => validateAddress(value) || 'Please enter a valid wallet address.',
              }}
            />
            <Button buttonText="Search" />
          </div>
          <div className="mt-10 text-red-600 text-center">
            {formErrors.address?.message || String.fromCharCode(160)}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Home;
