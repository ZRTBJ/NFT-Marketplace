import React from 'react';
import TokenGatedContent from 'components/TokenGated/TokenGatedContent';

export async function getServerSideProps(context) {
  const query = context.query;
  let resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/tokengate/${query.id}`
  );

  let output = await resp.json();

  let image = output?.token_gate_project?.assets?.find(
    (img) => img['asset_purpose'] === 'logo'
  );
  let data = {
    title: output?.token_gate_project?.title
      ? output.token_gate_project.title
      : '',
    description: output?.token_gate_project?.description
      ? output.token_gate_project.description
      : '',
    image: image?.path ? image.path : '',
  };
  return { props: { query, data } };
}

export default function TokenGated(query) {
  return (
    <TokenGatedContent
      query={query?.query}
      createMode={query?.query?.id === 'create' ? true : false}
    />
  );
}
