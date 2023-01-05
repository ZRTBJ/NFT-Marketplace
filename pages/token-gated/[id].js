import React from 'react';
import TokenGatedContent from 'components/TokenGated/TokenGatedContent';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}
export default function TokenGated(query) {
  return <TokenGatedContent query={query?.query} />;
}
