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

import thumbIcon from "assets/images/profile/card.svg";
import avatar from "assets/images/dummy-img.svg";


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
      {/* end gallery */}


      {/* profile information section */}
      <section className="bg-light3 rounded-b-xl mt-4 p-6">

        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <div className="flex">
              <img
                src={manImg}
                className="rounded-full self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6"
                alt="User profile"
              />
              <div className="flex-1 min-w-0  px-4">
                <h1 className="-mt-1 mb-1 md:mb-2 truncate">
                  DAO Name
                </h1>
                <p className="text-textLight text-sm">
                  Smart COntract not released
                  <i class="fa-solid fa-copy ml-2"></i>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap mt-3 items-start md:justify-end md:w-1/3 md:mt-0" role="group">
            <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5" >
              <a href="" target="_blank" rel="noreferrer">
                <i class="fa-brands fa-facebook text-primary-900"></i>
              </a>
            </div>

            <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5" >
              <a href="" target="_blank" rel="noreferrer">
                <i class="fa-brands fa-instagram text-primary-900"></i>
              </a>
            </div>

            <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5" >
              <a href="" target="_blank" rel="noreferrer">
                <i class="fa-solid fa-globe text-primary-900"></i>
              </a>
            </div>
            <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5" >
              <a href="" target="_blank" rel="noreferrer">
                <i class="fa-solid fa-headphones text-primary-900"></i>
              </a>
            </div>

            <div className="cursor-pointer w-8 h-8 mb-4 bg-primary-900 bg-opacity-20 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 hover:bg-opacity-5" >
              <a href="" target="_blank" rel="noreferrer">
                <i class="fa-brands fa-twitter text-primary-900"></i>
              </a>
            </div>

            <a className="inline-block ml-4 bg-primary-900 px-3 py-2 text-white font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-secondary-800 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Publish</a>

          </div>
        </div>

        <div className="flex flex-col md:flex-row pt-5">
          <div className="md:w-2/3">
            <h3>About The Collection</h3>
            <p className="text-textLight text-sm" >It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point tsfd now use</p>
            <div className="flex items-center mt-3">
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <img
                className="rounded-full w-9 h-9 -ml-1 "
                src={avatar}
                alt=""
              />
              <span className="ml-2 bg-primary-900 bg-opacity-5  text-primary-900 rounded p-1 text-xs  ">
                +12
              </span>
            </div>
          </div>

          <div className="flex items-start mt-3 md:justify-end md:w-1/3  md:mt-0">

            <div className="bg-primary-900 bg-opacity-10 rounded-md p-3 px-5 relative w-56">
              <i className="fa-regular fa-arrows-rotate text-textSubtle text-sm  absolute right-2 top-3"></i>
              <p className=" text-sm text-textSubtle ">Net Worth</p>
              <h4>1.400.000 MATIC</h4>
              <p className="text-sm text-textSubtle">($1,400.00)</p>
            </div>



          </div>
        </div>
      </section>

      <section className="mb-10">

        <div class="mb-4">
          <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
            <li class="mr-2" role="presentation">
              <button class="inline-block p-4 text-lg rounded-t-lg border-b-2 border-primary-900 text-primary-900 hover:text-primary-600" id="membership_nft" data-tabs-target="#membership_nft" type="button" role="tab" aria-controls="MembershipNFT" aria-selected="true">Membership NFT</button>
            </li>
            <li class="mr-2" role="presentation">
              <button class="inline-block p-4 text-lg rounded-t-lg border-b-2 border-transparent  text-textSubtle  hover:text-primary-900" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Product NFT</button>
            </li>
            <li class="mr-2" role="presentation">
              <button class="inline-block p-4 text-lg rounded-t-lg border-b-2 border-transparent  text-textSubtle  hover:text-primary-900" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Rights Attached NFT</button>
            </li>
          </ul>
        </div>


        <div id="myTabContent">

          <section className="grid md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6" id="membership_nft" role="tabpanel" aria-labelledby="membership-nft-tab">

            {/* Card */}
            <div className="min-h-[390px] rounded-x">
              <a href="#">
                <img
                  className="rounded-xl h-[276px] object-cover w-full"
                  src={thumbIcon}
                  alt=""
                />
              </a>

              <div className="p-5">
                <h2 className="mb-2 text-txtblack truncate">NFT Collection #1</h2>
                <p className="mb-3 text-textSubtle text-[13px]">
                  There are many variations of passages of Lorem
                </p>

                <div className="flex items-center">
                  <img
                    className="rounded-full w-9 h-9 -ml-1 "
                    src={avatar}
                    alt=""
                  />
                  <img
                    className="rounded-full w-9 h-9 -ml-1 "
                    src={avatar}
                    alt=""
                  />
                  <img
                    className="rounded-full w-9 h-9 -ml-1 "
                    src={avatar}
                    alt=""
                  />
                  <img
                    className="rounded-full w-9 h-9 -ml-1 "
                    src={avatar}
                    alt=""
                  />
                  <img
                    className="rounded-full w-9 h-9 -ml-1 "
                    src={avatar}
                    alt=""
                  />
                </div>
              </div>
            </div>


            {/* Card */}
            <div className="rounded-xl h-[276px] w-full bg-success-1 bg-opacity-20 flex flex-col items-center justify-center">
              <i className="fa-solid fa-circle-plus text-success-1 text-2xl mb-2"></i>
              <p className="text-success-1 text-lg font-black font-satoshi-bold">Create new</p>

            </div>



          </section>







          <div class="hidden p-4 bg-gray-50 rounded-lg dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
            <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
          </div>
          <div class="hidden p-4 bg-gray-50 rounded-lg dark:bg-gray-800" id="settings" role="tabpanel" aria-labelledby="settings-tab">
            <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Settings tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
          </div>
        </div>





      </section>










      {isLoading && <div className="loading"></div>}
      {
        !isLoading && (
          <>
            {/* {userInfo.id && (
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
            )} */}

            {/* Cover image section */}
            {/* <section className="pt-5 rounded-3xl">
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
            </section> */}

            {/* {nftList.length === 0 ? (
              <>
                {project.is_owner ? (
                  <ProjectDetailsEmptyCaseCard userType="self"></ProjectDetailsEmptyCaseCard>
                ) : (
                  <ProjectDetailsEmptyCaseCard userType="visitor"></ProjectDetailsEmptyCaseCard>
                )}
              </>
            ) : (
              <></>
            )} */}

            {/* {!isLoading && (
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
            )} */}
          </>
        )
      }
    </>
  );
}
