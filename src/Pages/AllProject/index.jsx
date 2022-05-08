import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import { getPublicProjectList } from "services/project/projectService";
import ProjectListCard from "components/Home/ProjectListCard";
import InfiniteScroll from "react-infinite-scroll-component";
function AllProject() {
  const [search, setSearch] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  let [limit, setLimit] = useState(4);

  function onProjectNameChange(value) {
    if (value === "") {
      console.log("empty");
    } else {
      setSearch(value);
    }
  }
  async function getProjectList(payload) {
    await getPublicProjectList(payload).then((response) => {
      response.data.forEach((element) => {
        if (element.project_fundraising !== null) {
          let allocation = "";
          let user_allocated_percent = "";
          allocation =
            (element.token_amount_total / 100) *
            element.project_fundraising.allocation_percent;
          user_allocated_percent =
            (allocation / 100) *
            element.project_fundraising.user_allocated_percent;
          element.project_fundraising.total_allocation = user_allocated_percent;
        }
      });
      setProjectList(response.data);
      if (response.pageSize >= response.total) {
        setHasMore(false);
      }
    });
  }
  async function fetchData() {
    setLimit((limit = limit + 1));
    let payload = {
      limit: limit,
    };
    await getProjectList(payload);
  }
  async function typeChange(e) {
    let payload = {
      limit: limit,
      order_by: e,
    };
    getProjectList(payload);
  }
  useEffect(() => {
    let payload = {
      limit: limit,
    };
    getProjectList(payload);
  }, []);
  return (
    <div className="max-w-[1366px] mx-auto ">
      <div className="mt-[24px]  md:mb-[40px]">
        <div className="flex 	align-items flex-wrap justify px-[27px]  justify-between">
          <DebounceInput
            minLength={1}
            debounceTimeout={300}
            onChange={(e) => onProjectNameChange(e.target.value)}
            type="text"
            className="projectNameInput md:max-w-[680px] mb-4"
            name="projectNameLable"
            id="projectNameLable"
            placeholder={"Search project name or Finding the roll …"}
            value={search}
          />
          <select
            name=""
            id=""
            onChange={(e) => typeChange(e.target.value)}
            className="md:w-[174px] pr-4"
          >
            <option value="newer">Newer</option>
            <option value="old">OLD</option>
          </select>
        </div>
      </div>

      <InfiniteScroll
        dataLength={projectList.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}

        // below props only if you need pull down functionality
      >
        <div className="container mx-auto p-6 grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4  gap-4">
          {projectList.map((i) => (
            <div
              key={i.id}
              className="mb-8 col-span-1 flex flex-col bg-white p-4"
            >
              <ProjectListCard key={i.id} project={i} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
export default AllProject;
