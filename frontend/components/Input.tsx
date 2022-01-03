import React, { InputHTMLAttributes } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

type InputProps = {
  errorState: boolean;
  formFieldName: string;
  formRegisterOptions?: RegisterOptions;
};

const Input: React.FC<InputProps & InputHTMLAttributes<HTMLInputElement>> = ({
  errorState,
  formFieldName,
  formRegisterOptions,
  ...props
}) => {
  const { register } = useFormContext();
  return (
    <input
      className={`appearance-none rounded-md w-full p-2 border-2 ${
        errorState ? 'border-red-500' : 'border-gray-200 focus:border-cyan-400'
      } placeholder-gray-500 focus:outline-none`}
      {...register(formFieldName, formRegisterOptions)}
      {...props}
    />
  );
};

export default Input;
