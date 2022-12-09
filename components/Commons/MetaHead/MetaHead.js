import Head from 'next/head';

const MetaHead = ({
  title = 'DeCir',
  description = 'Empowering every individual to create their  own DAO and not just the techies',
  image = 'https://testnet.decir.io/ogp_img.png',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} key='description' />
      <meta
        name='keyword'
        content='Dao crypto, Dao meaning, Dao maker, No code,NFT, What is a dao, What is NFT, Create DAO, How to create a DAO, How to create NFT, How to make your own NFT, How to create a Membership NFT,Crypto, What is ethereum, What is smart contract, Decir,dao,NFT'
        key='keyword'
      />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='fb:app_id' content='907286643569007' />

      {/* Twitter  */}
      <meta property='twitter:card' content='summary_large_image' />
      <meta property='twitter:title' content={title} />
      <meta property='twitter:description' content={description} />
      <meta property='twitter:image' content={image} />
    </Head>
  );
};

export default MetaHead;
