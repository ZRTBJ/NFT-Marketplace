import ProductNFTCreateContent from 'components/NFT/ProductNFT/index.jsx';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}

const ProductNFTCreate = (query) => {
  return <ProductNFTCreateContent query={query?.query} />;
};

export default ProductNFTCreate;
