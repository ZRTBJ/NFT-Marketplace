import List from 'components/List/index';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}

const list = (query) => {
  return <List query={query?.query} />;
};

export default list;
