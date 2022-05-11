import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import {
  getPublicProjectList,
  getProjectCategory,
  getProjectListBySearch,
} from "services/project/projectService";
import ProjectListCard from "components/Home/ProjectListCard";
import InfiniteScroll from "react-infinite-scroll-component";
import sortIcon from "assets/images/home/ico_filter.svg";

function AllProject() {
  const [categoryList, setCategoryList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsloading] = useState(true);
  const [orderBy, setOrderBy] = useState("newer");
  const [page, setPage] = useState(10);
  const [limit, setLimit] = useState(1);
  const [criteria, setCriteria] = useState("name");
  const [keyword, setKeyword] = useState("");
  const [smallSpinnedLoading, setSmallSpinnedLoading] = useState(false);

  async function categoryListAPIcCall() {
    setIsloading(true);
    await getProjectCategory().then((response) => {
      setCategoryList(response.categories);
      filterProjectList(response.categories);
    });
    setIsloading(false);
  }
  async function filterProjectList(categories) {
    setSmallSpinnedLoading(true);
    setHasMore(false);
    const payload = {
      order_by: orderBy,
      page: page,
      limit: limit,
      criteria: criteria,
      keyword: keyword,
    };
    await getProjectListBySearch(payload).then((response) => {
      if (response.data !== null) {
        response.data.forEach((element) => {
          element.category_name = categories.find(
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
            element.project_fundraising.total_allocation =
              user_allocated_percent;
          }
        });
        let projects = projectList.concat(response.data);
        setProjectList(projects);
        if (response.data.length === limit) {
          let pageSize = page + 1;
          setPage(pageSize);
          // let limiteSize = limit + 1;
          // setLimit(limiteSize);
          setHasMore(true);
        }
        setSmallSpinnedLoading(false);
      }
    });
  }

  async function fetchData() {
    if (hasMore) {
      await filterProjectList(categoryList);
    }
  }
  async function onProjectNameChange(value) {
    if (value === "") {
      console.log("empty");
    } else {
      setKeyword(value);
      await filterProjectList();
    }
  }
  async function onOrderChange(e) {
    setOrderBy(e);
    await filterProjectList();
  }
  async function onSearchTypeChange(e) {
    setCriteria(e);
    await filterProjectList();
  }
  useEffect(() => {
    categoryListAPIcCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="max-w-[1366px] mx-auto ">
      <div className="mt-[15px]">
        <div className="flex 	w-full   md:px-[27px] px-[14px]">
          <div className="flex w-full">
            <select
              value={criteria}
              onChange={(e) => onSearchTypeChange(e.target.value)}
              className="w-[88px]  h-[34px] md:h-[44px] text-[12px] md:text-[16px] md:w-[160px] md:ml-4 mb-4 "
            >
              <option value="name">Project Name</option>
              <option value="job">Role</option>
            </select>
            <DebounceInput
              minLength={1}
              debounceTimeout={600}
              onChange={(e) => onProjectNameChange(e.target.value)}
              type="text"
              className="border mr-4 border-[#cccccc]  rounded   md:w-[776px] mb-4 h-[34px] md:h-[44px] "
              name="projectNameLable"
              id="projectNameLable"
              placeholder={"Search"}
              value={keyword}
            />
            <button className="text-center h-[34px] md:h-[44px] w-[34px] border border-[#CCCCCC] md:hidden">
              <img
                src={sortIcon}
                className={"h-[24px] ml-1 w-[24px] block "}
                alt=""
              />
            </button>
            <select
              value={orderBy}
              onChange={(e) => onOrderChange(e.target.value)}
              className="hidden md:block md:w-[174px] pr-4 ml-auto"
            >
              <option defaultValue={"newer"}>Newer</option>
              <option value="old">OLD</option>
            </select>
          </div>
        </div>
      </div>
      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <InfiniteScroll
          dataLength={projectList.length} //This is important field to render the next data
          next={fetchData}
          hasMore={hasMore}
        >
          <div className="container md:mx-auto md:p-6 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4  md:gap-4">
            {projectList.map((i) => (
              <div
                key={i.id}
                className="mb-8 col-span-1 flex flex-col bg-white p-4"
              >
                <ProjectListCard key={i.id} sm={166} md={280} project={i} />
              </div>
            ))}
          </div>
          {hasMore && <div className="onlySpinner"></div>}
        </InfiniteScroll>
      )}
    </div>
  );
}
export default AllProject;
