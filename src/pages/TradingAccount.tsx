
import React from 'react';
import { useParams } from 'react-router-dom';

const TradingAccount = () => {
  const { id } = useParams();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">Trading Account</h1>
      <p>Details for trading account {id} will be shown here.</p>
    </div>
  );
};

export default TradingAccount;
