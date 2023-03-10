import TransactionDetailsContent from 'components/Transactions/TransactionDetailsContent';

export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}

const TransactionDetails = (query) => {
  return <TransactionDetailsContent query={query?.query} />;
};

export default TransactionDetails;
