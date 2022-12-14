import CollectionContent from 'components/Collection/CollectionContent';

export async function getServerSideProps(context) {
  const query = context.query;
  let resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/collection/${query.collectionId}`
  );

  let output = await resp.json();

  let image = output?.collection?.assets?.find(
    (img) => img['asset_purpose'] === 'logo'
  );
  let data = {
    title: output?.collection?.name,
    description: output?.collection?.description,
    image: image ? image : '',
  };
  return { props: { query, data } };
}

const CollectionDetails = (query) => {
  return <CollectionContent collectionId={query?.query?.collectionId} />;
};

export default CollectionDetails;
