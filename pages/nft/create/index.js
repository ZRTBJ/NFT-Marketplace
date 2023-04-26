import CreateNFTContent from 'components/NFT/Create/CreateNFTContent';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}

const Create = (query) => {
  return <CreateNFTContent query={query?.query} />;
};

export default Create;
