import { NextSeo } from 'next-seo';

const MetaHead = ({
  title = 'DeCir',
  description = 'Empowering every individual to create their  own DAO and not just the techies',
  image = 'https://decir.mypinata.cloud/ipfs/QmbuYopyxYAnAkNGDeLKAK58HvUZw29bnT5FjU6FFmre64',
}) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title: title,
        description: description,
        images: [
          {
            url: image,
            alt: title,
          },
        ],
        type: 'website',
        siteName: 'DeCir',
      }}
      facebook={{
        appId: '907286643569007',
      }}
      twitter={{
        cardType: 'summary_large_image',
      }}
      additionalMetaTags={[
        {
          property: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: description,
        },
        {
          name: 'twitter:image',
          content: image,
        },
      ]}
    />
  );
};

export default MetaHead;
