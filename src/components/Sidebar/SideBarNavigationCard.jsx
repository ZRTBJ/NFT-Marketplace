import createProject from "assets/images/sidebar/createProject.png";
import allProjects from "assets/images/sidebar/allProjects.png";
import meetUp from "assets/images/sidebar/meetUp.png";
const list = [
  {
    id: 0,
    img: createProject,
    title: "CREATE PROJECT",
    class: "createProject",
  },
  { id: 1, img: allProjects, title: "ALL PROJECTS", class: "allProjects" },
  { id: 2, img: meetUp, title: "MEET UP", class: "meetUp" },
];
const SidebarNavigationCard = () => {
  return (
    <div className="sidebarContainer d-flex flex-wrap ">
      {list.map((i) => (
        <div key={i.id} className="sidebarCardContainer cp m-1">
          <div className={i.class}>
            <img src={i.img} alt={i.title} />
            <div className="sidebarCardTitle">{i.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SidebarNavigationCard;
