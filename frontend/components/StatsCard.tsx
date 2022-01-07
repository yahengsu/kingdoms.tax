import React from 'react';

const StatsCard: React.FC = ({ children }) => {
  return (
    <div className="rounded-lg p-5 mb-5 drop-shadow-lg hover:drop-shadow-2xl bg-white w-full text-lg ">{children}</div>
  );
};

export default StatsCard;
