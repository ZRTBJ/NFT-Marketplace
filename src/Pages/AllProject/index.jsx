import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import {
  getPublicProjectList,
  getProjectCategory,
} from "services/project/projectService";
import ProjectListCard from "components/Home/ProjectListCard";
import InfiniteScroll from "react-infinite-scroll-component";
function AllProject() {
  const [search, setSearch] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  let [limit, setLimit] = useState(4);
  const [isLoading, setIsloading] = useState(true);

  function onProjectNameChange(value) {
    if (value === "") {
      console.log("empty");
    } else {
      setSearch(value);
    }
  }
  async function getProjectList(payload) {
    let categoryList = [];
    setIsloading(true);
    await getProjectCategory().then((response) => {
      categoryList = response.categories;
    });
    await getPublicProjectList(payload).then((response) => {
      response.data.forEach((element) => {
        element.category_name = categoryList.find(
          (x) => x.id === element.category_id
        ).name;
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
    setIsloading(false);
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
  async function selectSearchType(e) {
    let payload = {
      limit: limit,
      order_by: e,
    };
    console.log(payload);
    // getProjectList(payload);
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
        <div className="flex 	w-full align-items flex-wrap  px-[27px]  justify-between">
          <div className="md:flex flex-1 ">
            <select
              name=""
              id=""
              onChange={(e) => selectSearchType(e.target.value)}
              className="md:w-[160px] md:ml-4 mb-4"
            >
              <option selected value="newer">
                Project Name
              </option>
              <option value="old">Role</option>
            </select>
            <DebounceInput
              minLength={1}
              debounceTimeout={300}
              onChange={(e) => onProjectNameChange(e.target.value)}
              type="text"
              className="projectNameInput md:max-w-[464px] mb-4"
              name="projectNameLable"
              id="projectNameLable"
              placeholder={"Search"}
              value={search}
            />
          </div>
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
        loader={isLoading && <div className="loading"></div>}

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
