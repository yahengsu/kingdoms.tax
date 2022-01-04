import React from 'react';

const TransactionCard: React.FC = () => {
  return (
    <div className="grid grid-cols-12 w-2/3 text-xl font-semibold items-end">
      <p className="px-5 col-span-1">Txn</p>
      <p className="px-5 col-span-2">Date</p>
      <p className="px-5 col-span-1">Direction</p>
      <p className="px-5 col-span-1">Token</p>
      <p className="px-5 col-span-2">Amount</p>
      <p className="px-5 col-span-2">Type</p>
      <p className="px-5 col-span-1" data-bs-toggle="tooltip" data-bs-placement="top" title="NFTs only">
        TokenID
      </p>
      <p className="px-5 col-span-2">USD Value</p>
    </div>
  );
};

export default TransactionCard;
