import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
  buttonText: string;
};

const Button: React.FC<ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>> = ({ buttonText, ...props }) => {
  return (
    <button
      className="py-2 px-4 border-2 border-transparent rounded-md text-white bg-black hover:bg-white hover:border-black hover:text-black"
      {...props}
    >
      {buttonText}
    </button>
  );
};

export default Button;
