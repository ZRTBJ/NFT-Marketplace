import React from 'react';

export default function TransactionDetailsContent({ query }) {
  return (
    <div>
      <h1>selected tab : {query?.tab}</h1>
      TransactionDetails
    </div>
  );
}
