import TokenGatedContentDetailContainer from 'components/TokenGated/TokenGatedDetailContainer';

export async function getServerSideProps(context) {
  const query = context.query;
  let resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/tkg-content/${query.id}`
  );

  let output = await resp.json();

  let image = output?.token_gate_content?.thumbnail;
  let data = {
    title: output?.token_gate_content?.title
      ? output.token_gate_content.title
      : '',
    description: output?.token_gate_content?.description
      ? output.token_gate_content.description
      : '',
    image: image
      ? image
      : 'https://storage.googleapis.com/apollo_creabo_prod/decir/ogp_img.jpg',
  };
  return { props: { query, data } };
}

const TokenGatedContentDetail = (query) => {
  return <TokenGatedContentDetailContainer query={query?.query} />;
};

export default TokenGatedContentDetail;
