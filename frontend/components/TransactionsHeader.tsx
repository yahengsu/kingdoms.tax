import React from 'react';

const TransactionCard: React.FC = () => {
    return (
        <div className="grid grid-cols-12 w-5/6 text-xl font-bold">
            <p className="px-5 col-span-1">Txn Link</p>
            <p className="px-5 col-span-2">Date</p>
            <p className="px-5 col-span-1">Direction</p>
            <p className="px-5 col-span-2">Token</p>
            <p className="px-5 col-span-2">Token Id</p>
            <p className="px-5 col-span-2">Amount</p>
            <p className="px-5 col-span-2">USD Value</p>
        </div>
    );
};

export default TransactionCard;