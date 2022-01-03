import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Web3 from 'web3';

import Button from '../components/Button';
import Input from '../components/Input';

type WalletFormValues = {
  address: string;
};

const Home: NextPage = () => {
  const formMethods = useForm<WalletFormValues>();
  const formErrors = formMethods.formState.errors;
  const router = useRouter();

  const validateAddress = (address: string) => {
    try {
      Web3.utils.toChecksumAddress(address);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onSubmit: SubmitHandler<WalletFormValues> = ({ address }) => {
    router.push(`/txns/${address}`);
  };

  return (
    <div className="flex flex-col font-default w-full min-h-screen items-center justify-center bg-gray-50">
      <h1 className="font-bold text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
        penis
      </h1>
      <FormProvider {...formMethods}>
        <form className="mt-10 w-1/3" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-8 gap-3 w-full mb-10">
            <div className="col-span-6">
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
            </div>
            <div className="col-span-2">
              <Button buttonText="Search" />
            </div>
          </div>
          <div className="text-red-600 text-center">{formErrors.address?.message || String.fromCharCode(160)}</div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Home;
