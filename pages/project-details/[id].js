import ProjectDetailsContent from 'components/Project/ProjectDetailsContent';
import { useRouter } from 'next/router';

const ProjectDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  return <ProjectDetailsContent id={id} />;
};

export default ProjectDetails;
