import MembershipNFTCreateContent from 'components/NFT/MembershipNFT/index.jsx';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}

const MembershipNFTCreate = (query) => {
  return <MembershipNFTCreateContent query={query?.query} />;
};

export default MembershipNFTCreate;
