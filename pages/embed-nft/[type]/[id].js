import React from 'react';
import EmbedNFT from 'components/NFT/Embed/EmbedNFT';

export async function getServerSideProps(context) {
  const query = context.query;
  let typeValue =
    query.type === 'membership'
      ? '/membership-nft/'
      : query.type === 'product'
      ? '/product-nft/'
      : '/nft/';
  let resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}${typeValue}${query?.id}`
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
  return <EmbedNFT type={query?.query?.type} id={query?.query?.id} />;
}
