import TokenGatedContentDetailContainer from 'components/TokenGated/TokenGatedDetailContainer';

export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}

const TokenGatedContentDetail = (query) => {
  return <TokenGatedContentDetailContainer query={query?.query} />;
};

export default TokenGatedContentDetail;
