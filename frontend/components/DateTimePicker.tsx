import DatePicker from 'react-datepicker';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { format } from 'date-fns';
import React from 'react';

type DateTimePickerProps = {
  selectedDate: Date;
  onChange: (arg0: Date) => void;
  start: boolean;
  startDate: Date;
  endDate: Date;
};

// Custom datepicker element based on https://github.com/msnegurski/tailwind-react-datepicker
const DateTimePicker: React.FC<DateTimePickerProps> = ({ selectedDate, onChange, start, startDate, endDate }) => {
  return (
    <div className="relative">
      <DatePicker
        selected={startDate}
        onChange={onChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        nextMonthButtonLabel=">"
        previousMonthButtonLabel="<"
        popperClassName="react-datepicker-left"
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
                  inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-cyan-300
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
                  inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-cyan-300
                `}
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default DateTimePicker;
