import ProjectDetailsContent from 'components/Project/ProjectDetailsContent';

export async function getServerSideProps(context) {
  const query = context.query;
  let resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/project/${query?.id}`
  );

  let output = await resp.json();

  let image = output.project?.assets?.find(
    (img) => img['asset_purpose'] === 'cover'
  );
  let data = {
    title: output?.project?.name,
    description: output?.project?.overview,
    image: image,
  };
  return { props: { query, data } };
}

const ProjectDetails = (query) => {
  console.log(query);
  return <ProjectDetailsContent id={query?.query?.id} />;
};

export default ProjectDetails;
