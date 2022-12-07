import React from 'react';
import EmbedNFT from 'components/NFT/Embed/EmbedNFT';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}
export default function NFTDetails(query) {
  return <EmbedNFT type={query?.query?.type} id={query?.query?.id} />;
}
