import React from 'react';
import DetailsMintedNFT from 'components/NFT/DetailsMintedNFT';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}
export default function NFTDetails(query) {
  return (
    <DetailsMintedNFT
      nftId={query?.query?.id}
      tokenId={query?.query?.tokenId}
    />
  );
}
