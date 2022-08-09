import { useEffect, useState } from "react";
import {
  getProjectDetailsById,
  projectLike,
  projectBookmark,
} from "services/project/projectService";
import { getNftListByProjectId } from "services/nft/nftService";
import { ReactComponent as HeartIcon } from "assets/images/projectDetails/heartIcon.svg";
import { ReactComponent as BookmarkIcon } from "assets/images/projectDetails/bookmarkIcon.svg";
import { ReactComponent as HeartIconFilled } from "assets/images/projectDetails/HeartIconFilled.svg";
import { ReactComponent as BookmarkIconFilled } from "assets/images/projectDetails/BookmarkIconFilled.svg";
import coverImg from "assets/images/no-image-found.png";
import manImg from "assets/images/projectDetails/man-img.svg";
import bigImg from "assets/images/gallery/big-img.svg";
import galleryImg from "assets/images/gallery/1.svg";
import locationIcon from "assets/images/profile/locationIcon.svg";
import { Link, useHistory } from "react-router-dom";
import Slider from "components/slider/slider";
import Card from "components/profile/Card";
import InfiniteScroll from "react-infinite-scroll-component";

import { useSelector } from "react-redux";
import ProjectDetailsEmptyCaseCard from "components/EmptyCaseCard/ProjectDetailsEmptyCaseCard";
import CommonCard from "components/CommonCard";

export default function ProjectDetails(props) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState({});
  const projectId = props.match.params.id;
  const [selectedImages, setSelectedImages] = useState({});
  const userInfo = useSelector((state) => state.user.userinfo);
  // nft list
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [nftList, setNftList] = useState([]);

  async function fetchData() {
    if (hasMore) {
      setHasMore(false);
      // setIsLoading(true);
      await fetchNftList();
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (projectId && !isLoading) {
      projectDetails(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    fetchNftList();
  }, []);

  async function projectDetails(pid) {
    setIsLoading(true);
    await getProjectDetailsById({ id: pid })
      .then((res) => {
        if (res.code === 0) {
          setProject(res.project);
          if (res?.project?.assets[1]) {
            setSelectedImages(res.project.assets[1]);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function LikeProject(value) {
    setIsLoading(true);
    const request = new FormData();
    request.append("like", value);
    projectLike(projectId, request)
      .then((res) => {
        if (res.code === 0) {
        }
        setIsLoading(false);
        projectDetails(projectId);
        fetchNftList();
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function BookmarkProject(value) {
    setIsLoading(true);
    const request = new FormData();
    request.append("bookmark", value);
    projectBookmark(projectId, request)
      .then((res) => {
        if (res.code === 0) {
        }
        setIsLoading(false);
        projectDetails(projectId);
        fetchNftList();
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function changeImagePreview(image) {
    setSelectedImages(image);
  }

  async function fetchNftList() {
    let payload = {
      projectId: projectId,
      page: page,
      perPage: limit,
    };
    // setIsLoading(true);
    await getNftListByProjectId(payload)
      .then((e) => {
        if (e.code === 0 && e.nfts !== null) {
          if (e.nfts.length === limit) {
            let pageSize = page + 1;
            setPage(pageSize);
            setHasMore(true);
          }
          e.nfts.forEach((element) => {
            element.isNft = true;
          });
          const nfts = nftList.concat(e.nfts);
          setNftList(nfts);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  return (
    <>

      <section className="grid sm:grid-cols-5 gap-4 mt-6">

        <div className="row-span-2 col-span-2">
          <img className="rounded-xl object-cover h-[254px] w-full" src={bigImg} alt="" />
        </div>
        <div className="">
          <img className="rounded-xl object-cover h-[122px] w-full" src={manImg} alt="" />
        </div>
        <div className="">
          <img className="rounded-xl object-cover h-[122px] w-full" src={galleryImg} alt="" />
        </div>
        <div className="">
          <img className="rounded-xl object-cover h-[122px] w-full" src={bigImg} alt="" />
        </div>
        <div className="">
          <img className="rounded-xl object-cover h-[122px] w-full" src={bigImg} alt="" />
        </div>
        <div className="">
          <img className="rounded-xl object-cover h-[122px] w-full" src={manImg} alt="" />
        </div>
        <div className="">
          <img className="rounded-xl object-cover h-[122px] w-full" src={galleryImg} alt="" />
        </div>
      </section>



      {/* profile information section */}
      <section className="flex flex-col md:flex-row pt-5">
        <div className="md:w-2/3 txtblack dark:text-white">
          <div className="flex">
            <img
              src=""
              className="rounded-full self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6"
              alt="User profile"
            />


            <div className="flex-1 min-w-0  px-4">
              <h1 className="-mt-1 mb-1 md:mb-2 text-ellipsis overflow-hidden whitespace-nowrap">
                DAO Name
              </h1>
              <p className="flex">
                Smart COntract not released
              </p>

            </div>
          </div>
        </div>

        <div
          className="flex flex-wrap mt-3 md:justify-end md:w-1/3  md:mt-0"
          role="group"
        >

          <div
            className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-primary-400"
          >
            <div className="inline-flex p-1.5">
              <a href="" target="_blank" rel="noreferrer">
                <i class="fa-brands fa-facebook text-primary-900"></i>
              </a>
            </div>


          </div>

        </div>


      </section>


      <section className="flex flex-col md:flex-row pt-5">
        <div className="md:w-2/3">
          <h1>About The Collection</h1>
          <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point tsfd now use</p>
        </div>

        <div
          className="flex items-start mt-3 md:justify-end md:w-1/3  md:mt-0"
        >
          <a className="inline-block bg-primary-900 px-4 py-3 text-white font-black text-sm  font-satoshi-bold rounded cursor-pointer  hover:bg-secondary-800 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Create Project</a>

        </div>
      </section>





      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <>
          {userInfo.id && (
            <>
              {project.is_owner && project.project_status === "published" ? (
                <>
                  <section className="flex  justify-end py-7">
                    <button
                      type="button"
                      className="btn btn-outline-primary-gradient btn-md"
                    >
                      <Link to={`/project-edit/${project.id}/outline`}>
                        <span>Edit Project</span>
                      </Link>
                    </button>
                  </section>
                </>
              ) : (
                <div className="flex justify-end gap-3">
                  {project.liked ? (
                    <div className="h-[56px] w-[56px] bg-[#231B39] rounded-xl  text-center flex justify-center items-center">
                      <HeartIconFilled
                        className="h-[24px] w-[24px] cursor-pointer"
                        onClick={() => LikeProject(false)}
                      />
                    </div>
                  ) : (
                    <div className="h-[56px] w-[56px] bg-[#231B39] rounded-xl text-center flex justify-center items-center">
                      <HeartIcon
                        className="h-[24px] w-[24px] cursor-pointer"
                        onClick={() => LikeProject(true)}
                      />
                    </div>
                  )}

                  {project.bookmarked ? (
                    <div className="h-[56px] w-[56px] bg-[#231B39] rounded-xl text-center flex justify-center items-center">
                      <BookmarkIconFilled
                        className="h-[24px] w-[24px] cursor-pointer"
                        onClick={() => BookmarkProject(false)}
                      />
                    </div>
                  ) : (
                    <div className="h-[56px] w-[56px] bg-[#231B39] rounded-xl text-center flex justify-center items-center">
                      <BookmarkIcon
                        className=" h-[24px] w-[24px] cursor-pointer"
                        onClick={() => BookmarkProject(true)}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Cover image section */}
          <section className="pt-5 rounded-3xl">
            {!isLoading && (
              <img
                src={
                  project && project.assets && project.assets.length > 0
                    ? project.assets.find((x) => x.asset_purpose === "cover")
                      ?.path
                      ? project.assets.find((x) => x.asset_purpose === "cover")
                        ?.path
                      : require(`assets/images/no-image-found.png`)
                    : require(`assets/images/no-image-found.png`)
                }
                className={`rounded-3xl object-cover md:h-[310px] w-full 
                  ${project && project.assets && project.assets.length > 0
                    ? project.assets.find((x) => x.asset_purpose === "cover")
                      ?.path
                      ? project.assets.find(
                        (x) => x.asset_purpose === "cover"
                      )?.path
                      : "object-right-top"
                    : "object-right-top"
                  }`}
                alt="Project Cover"
              />
            )}
          </section>

          <section className="flex flex-col lg:flex-row py-9">
            <div className="flex-1 flex items-center py-5">
              <div className="pr-4 lg:pr-28">
                <h1 className="txtblack dark:text-white mb-6">{project.name}</h1>

                <div className="flex flex-wrap mb-6">
                  <div className="flex space-x-2 items-center txtblack dark:text-white mr-4 cursor-pointer">
                    <i className="fa-thin fa-eye"></i>
                    <span className=" ml-1">{project.project_view_count}</span>
                  </div>

                  <div className="flex space-x-2 items-center txtblack dark:text-white mr-4 cursor-pointer">
                    <i className="fa-thin fa-heart"></i>

                    <span className=" ml-1">{project.project_like_count}</span>
                  </div>

                  <div className="flex space-x-2 items-center txtblack dark:text-white mr-4 cursor-pointer">
                    <i className="fa-thin fa-bookmark"></i>

                    <span className=" ml-1">{project.project_mark_count}</span>
                  </div>
                </div>
                <p className="text-color-asss-3 text-sm font-satoshi-bold font-black mb-3">
                  {project.overview}
                </p>
              </div>
            </div>

            <div className="max-w-full lg:w-[553px] lg:h-[690px] mx-auto">
              <Slider imagesUrl={project.assets} />
            </div>
          </section>

          <section className="flex  my-4">
            {project.is_owner &&
              project.your_token_category &&
              project.project_status === "published" && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    history.push(`/${project.id ? project.id : ""}/mint-nft`)
                  }
                >
                  MINT NFT <i className="fa-thin fa-square-plus ml-1"></i>
                </button>
              )}

            {nftList.length !== 0 && (
              <button
                type="button"
                className="ml-auto btn btn-outline-primary btn-sm"
              >
                Sort By{" "}
                <i className="fa-thin fa-arrow-down-short-wide ml-1"></i>
              </button>
            )}
          </section>

          {nftList.length === 0 ? (
            <>
              {project.is_owner ? (
                <ProjectDetailsEmptyCaseCard userType="self"></ProjectDetailsEmptyCaseCard>
              ) : (
                <ProjectDetailsEmptyCaseCard userType="visitor"></ProjectDetailsEmptyCaseCard>
              )}
            </>
          ) : (
            <></>
          )}

          {!isLoading && (
            <InfiniteScroll
              dataLength={nftList.length} //This is important field to render the next data
              next={fetchData}
              hasMore={hasMore}
            >
              <div className="py-5 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {nftList.map((nft) => (
                  <div key={nft.id}>
                    <div className="">
                      <CommonCard project={nft} />
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </>
      )}
    </>
  );
}
