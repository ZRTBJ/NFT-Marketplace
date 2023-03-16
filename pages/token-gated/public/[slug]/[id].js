import React from 'react';
import TokenGatedPublicContent from 'components/TokenGated/public/TokenGatedPublicContent';

export async function getServerSideProps(context) {
  const query = context.query;
  let resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/tokengate/${query.id}`
  );

  let output = await resp.json();

  let image = output?.token_gate_project?.assets?.find(
    (img) => img['asset_purpose'] === 'subphoto'
  );
  let cover = output?.token_gate_project?.assets?.find(
    (img) => img['asset_purpose'] === 'cover'
  );

  let data = {
    title: output?.token_gate_project?.title
      ? output.token_gate_project.title
      : '',
    description: output?.token_gate_project?.description
      ? output.token_gate_project.description
      : '',
    image: image?.path
      ? image.path
      : cover?.path
      ? cover.path
      : 'https://storage.googleapis.com/apollo_creabo_prod/decir/ogp_img.jpg',
  };
  return { props: { query, data } };
}

export default function TokenGatedPublic(query) {
  return <TokenGatedPublicContent query={query?.query} />;
}
