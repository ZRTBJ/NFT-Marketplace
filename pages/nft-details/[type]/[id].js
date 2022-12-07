import React from 'react';
import DetailsNFT from 'components/NFT/DetailsNFT';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}
export default function NFTDetails(query) {
  console.log(query);
  return <DetailsNFT type={query?.query?.type} id={query?.query?.id} />;
}
