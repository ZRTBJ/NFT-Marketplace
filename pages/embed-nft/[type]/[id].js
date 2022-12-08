import React from 'react';
import EmbedNFT from 'components/NFT/Embed/EmbedNFT';
import { useRouter } from 'next/router';

export default function NFTDetails() {
  const router = useRouter();
  const { id, type } = router.query;
  return <EmbedNFT type={type} id={id} />;
}
