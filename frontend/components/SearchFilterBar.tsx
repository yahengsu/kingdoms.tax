import React, { forwardRef } from 'react';
import { useRouter } from 'next/router';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

import Input from './Input';
import { validateAddress } from '../utils/address';
import Button from './Button';
import CSVModal from './CSVModal';

type SearchFilterBarProps = {
  address: string | string[] | undefined;
  startDate: Date | undefined | null;
  endDate: Date | undefined | null;
  onStartDateChange: (date: Date | undefined | null) => void;
  onEndDateChange: (date: Date | undefined | null) => void;
  onDateReset: () => void;
};

type SearchFormValues = {
  address: string;
};

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  address,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onDateReset,
}) => {
  const formMethods = useForm<SearchFormValues>();
  const formErrors = formMethods.formState.errors;

  const router = useRouter();
  const onSubmit: SubmitHandler<SearchFormValues> = ({ address: newAddress }) => {
    if (newAddress !== address) {
      router.push(`/txns/${newAddress}`);
    }
  };

  return (
    <div className="grid grid-cols-12 w-2/3 mt-5 items-end">
      <div className="col-span-5">
        {formMethods ? (
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <div className="flex flex-row space-x-3">
                <Input
                  formFieldName="address"
                  placeholder="Wallet Address"
                  autoComplete="off"
                  small
                  defaultValue={address}
                  errorState={Boolean(formErrors.address)}
                  formRegisterOptions={{
                    required: {
                      value: true,
                      message: 'Please enter a wallet address.',
                    },
                    validate: (value) => validateAddress(value) || 'Please enter a valid wallet address.',
                  }}
                />
                <Button buttonText="Search" small />
              </div>
              <div className="mt-1 mb-1 text-sm text-red-600">
                {formErrors.address?.message || String.fromCharCode(160)}
              </div>
            </form>
          </FormProvider>
        ) : null}
      </div>
      <div className="col-span-3"></div>
      <div className="col-span-3 flex flex-col">
        <div
          className="text-md hover:text-cyan-400 hover:font-medium cursor-pointer mb-1 text-right"
          onClick={onDateReset}
        >
          Reset
        </div>
        <div className="flex flex-row space-x-3 items-center">
          <div className="relative w-full">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                date?.setHours(0, 0, 0, 0);
                onStartDateChange(date);
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
              nextMonthButtonLabel=">"
              previousMonthButtonLabel="<"
              popperClassName="react-datepicker-left"
              customInput={<StartButtonInput />}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-lg text-gray-700">{format(date, 'MMMM yyyy')}</span>

                  <div className="space-x-2">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      type="button"
                      className={`
                          ${prevMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                          inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                        `}
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>

                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      type="button"
                      className={`
                          ${nextMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                          inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                        `}
                    >
                      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
          <div className="relative w-full">
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                date?.setHours(23, 59, 59);
                onEndDateChange(date);
              }}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
              nextMonthButtonLabel=">"
              previousMonthButtonLabel="<"
              popperClassName="react-datepicker-right"
              customInput={<EndButtonInput />}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-lg text-gray-700">{format(date, 'MMMM yyyy')}</span>

                  <div className="space-x-2">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      type="button"
                      className={`
                      ${prevMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                      inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                    `}
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>

                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      type="button"
                      className={`
                      ${nextMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                      inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                    `}
                    >
                      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
        <div className="mt-1 mb-1 text-sm text-red-600">{String.fromCharCode(160)}</div>
      </div>
      <div className="col-span-1 ml-5 justify-self-end">
        <CSVModal
          address={typeof address === 'string' ? address : ''}
          startTime={startDate ? String(startDate.getTime()) : ''}
          endTime={endDate ? String(endDate.getTime()) : ''}
        />
        <div className="mt-1 mb-1 text-sm text-red-600">{String.fromCharCode(160)}</div>
      </div>
    </div>
  );
};

// @ts-ignore
const StartButtonInput = forwardRef(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    // @ts-ignore
    ref={ref}
    type="button"
    className="justify-start w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-cyan-400"
  >
    {value ? format(new Date(value), 'd MMM yyyy') : 'Start Date'}
  </button>
));
StartButtonInput.displayName = 'StartButtonInput';

// @ts-ignore
const EndButtonInput = forwardRef(({ value, onClick }, ref) => (
  <button
    onClick={onClick}
    // @ts-ignore
    ref={ref}
    type="button"
    className="justify-start w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-cyan-400"
  >
    {value ? format(new Date(value), 'd MMM yyyy') : 'End Date'}
  </button>
));
EndButtonInput.displayName = 'EndButtonInput';

export default SearchFilterBar;
