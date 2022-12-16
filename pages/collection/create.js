import CollectionCreateContent from 'components/Collection/CollectionCreate';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}

const CollectionCreate = (query) => {
  return <CollectionCreateContent query={query?.query} />;
};

export default CollectionCreate;
