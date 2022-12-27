import React from 'react';
import DetailsMintedNFT from 'components/NFT/DetailsMintedNFT';

export async function getServerSideProps(context) {
  const query = context.query;
  let resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/lnft/${query?.id}/${query?.tokenId}`
  );

  let output = await resp.json();
  let data = {
    title: output?.lnft?.name ? output.lnft.name : '',
    description: output?.lnft?.description ? output.lnft.description : '',
    image: output?.lnft?.asset?.path ? output.lnft.asset.path : '',
  };
  return { props: { query, data } };
}

export default function NFTDetails(query) {
  return (
    <DetailsMintedNFT
      nftId={query?.query?.id}
      tokenId={query?.query?.tokenId}
    />
  );
}
