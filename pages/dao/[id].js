import ProjectDetailsContent from 'components/Project/ProjectDetailsContent';

export async function getServerSideProps(context) {
  const query = context.query;
  let resp = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/project/${query?.id}`
  );

  let output = await resp.json();

  let image = output?.project?.assets?.find(
    (img) => img['asset_purpose'] === 'cover'
  );
  let data = {
    title: output?.project?.name ? output.project.name : '',
    description: output?.project?.overview ? output.project.overview : '',
    image: image?.path ? image.path : '',
  };
  return { props: { query, data } };
}

const ProjectDetails = (query) => {
  return <ProjectDetailsContent id={query?.query?.id} />;
};

export default ProjectDetails;
