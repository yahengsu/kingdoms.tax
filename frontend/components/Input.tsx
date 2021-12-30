import React, { InputHTMLAttributes } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

type InputProps = {
  formFieldName: string;
  formRegisterOptions?: RegisterOptions;
};

const Input: React.FC<InputProps & InputHTMLAttributes<HTMLInputElement>> = ({
  formFieldName,
  formRegisterOptions,
  ...props
}) => {
  const { register } = useFormContext();
  return (
    <input
      className="appearance-none rounded-md w-full p-2 border-2 border-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-300"
      {...register(formFieldName, formRegisterOptions)}
      {...props}
    />
  );
};

export default Input;
