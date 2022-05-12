import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import {
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
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
  async function filterProjectList(
    categories,
    criteria_keyword,
    searchKeyword,
    order_By_keyword
  ) {
    setSmallSpinnedLoading(true);
    setHasMore(false);
    const payload = {
      order_by: order_By_keyword ? order_By_keyword : orderBy,
      page: page,
      limit: limit,
      criteria: criteria_keyword ? criteria_keyword : "",
      keyword: searchKeyword ? searchKeyword : "",
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
        if (response.data.length === limit) {
          let pageSize = page + 1;
          setPage(pageSize);
          // let limiteSize = limit + 1;
          // setLimit(limiteSize);
          setHasMore(true);
        }
        setProjectList(response.data);
        setSmallSpinnedLoading(false);
      } else {
        setProjectList([]);
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
      console.log(value);
      setKeyword("");
      await filterProjectList(categoryList, "");
    } else {
      setKeyword(value);
      await filterProjectList(categoryList, value);
    }
  }
  async function onOrderChange(e) {
    setOrderBy(e);
    await filterProjectList();
  }
  async function onCriteriaChnage(criteria_paramas) {
    setCriteria(criteria_paramas);
    await filterProjectList(categoryList, keyword, criteria_paramas);
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
              onChange={(e) => onCriteriaChnage(e.target.value)}
              className="w-[88px]  h-[34px] md:h-[44px] text-[12px] md:text-[16px] md:w-[160px] md:ml-4 mb-4 "
            >
              <option value="name">Project Name</option>
              <option value="job">Role</option>
            </select>
            <DebounceInput
              minLength={0}
              debounceTimeout={100}
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
            {projectList.length > 0 ? (
              <>
                {projectList.map((i) => (
                  <div
                    key={i.id}
                    className="mb-8 col-span-1 flex flex-col bg-white p-4"
                  >
                    <ProjectListCard key={i.id} sm={166} md={280} project={i} />
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center">No Match results</div>
            )}
          </div>
          {hasMore && <div className="onlySpinner"></div>}
        </InfiniteScroll>
      )}
    </div>
  );
}
export default AllProject;
