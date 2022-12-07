import ProjectCreateContent from 'components/Project/ProjectCreateContent';
export async function getServerSideProps(context) {
  const query = context.query;
  return { props: { query } };
}
const ProjectCreate = (query) => {
  return <ProjectCreateContent search={query?.query} />;
};

export default ProjectCreate;
