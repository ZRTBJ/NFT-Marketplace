import React from 'react';
import TokenGatedPublicContent from 'components/TokenGated/public/TokenGatedPublicContent';

export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}
export default function TokenGatedPublic(query) {
  return <TokenGatedPublicContent query={query?.query} />;
}
