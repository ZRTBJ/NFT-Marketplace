import PublishPreview from 'components/NFT/PublishPreview';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}

const PublishView = (query) => {
  return <PublishPreview query={query?.query} />;
};

export default PublishView;
