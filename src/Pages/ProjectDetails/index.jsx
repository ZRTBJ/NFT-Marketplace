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
import coverImg from "assets/images/projectDetails/cover.svg";
import manImg from "assets/images/projectDetails/man-img.svg";
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
  }, []);

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
      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <main className="container mx-auto px-4">
          {userInfo.id && (
            <>
              {project.is_owner ? (
                <>
                  <section className="flex  justify-end py-7">
                    <button
                      type="button"
                      class="btn btn-outline-primary-gradient btn-md"
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
                    <div className="h-[56px] w-[56px] bg-[#231B39] rounded rounded-[12px] text-center flex justify-center items-center">
                      <HeartIconFilled
                        className="h-[24px] w-[24px] cursor-pointer"
                        onClick={() => LikeProject(false)}
                      />
                    </div>
                  ) : (
                    <div className="h-[56px] w-[56px] bg-[#231B39] rounded rounded-[12px] text-center flex justify-center items-center">
                      <HeartIcon
                        className="h-[24px] w-[24px] cursor-pointer"
                        onClick={() => LikeProject(true)}
                      />
                    </div>
                  )}

                  {project.bookmarked ? (
                    <div className="h-[56px] w-[56px] bg-[#231B39] rounded rounded-[12px] text-center flex justify-center items-center">
                      <BookmarkIconFilled
                        className="h-[24px] w-[24px] cursor-pointer"
                        onClick={() => BookmarkProject(false)}
                      />
                    </div>
                  ) : (
                    <div className="h-[56px] w-[56px] bg-[#231B39] rounded rounded-[12px] text-center flex justify-center items-center">
                      <BookmarkIcon
                        className=" h-[24px] w-[24px] cursor-pointer"
                        onClick={() => BookmarkProject(true)}
                      />
                    </div>
                  )}

                  {/* <img
                    className="h-[56px] w-[56px] mr-3 cursor-pointer"
                    src={heartIcon}
                    alt=""
                    onClick={LikeProject}
                  />
                  <img
                    className="h-[56px] w-[56px]  cursor-pointer"
                    src={bookmarkIcon}
                    alt=""
                    onClick={BookmarkProject}
                  /> */}
                </div>
              )}
            </>
          )}

          {/* Cover image section */}
          <section className="mt-5 rounded-3xl">
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
                className="rounded-3xl object-cover md:h-[217px] w-full"
                alt="Project Cover"
              />
            )}
          </section>

          <section className="flex flex-col lg:flex-row py-5">
            <div className="flex-1 flex items-center py-5">
              <div className="pr-4 lg:pr-28">
                <h1 className="text-white mb-6">{project.name}</h1>

                <div className="flex flex-wrap mb-6">
                  <div className="flex space-x-2 items-center text-white mr-4 cursor-pointer">
                    <i className="fa-thin fa-eye"></i>
                    <span className=" ml-1">{project.project_view_count}</span>
                  </div>

                  <div className="flex space-x-2 items-center text-white mr-4 cursor-pointer">
                    <i class="fa-thin fa-heart"></i>

                    <span className=" ml-1">{project.project_like_count}</span>
                  </div>

                  <div className="flex space-x-2 items-center text-white mr-4 cursor-pointer">
                    <i class="fa-thin fa-bookmark"></i>

                    <span className=" ml-1">{project.project_mark_count}</span>
                  </div>
                </div>
                <p className="text-color-asss-3 text-sm font-satoshi-bold font-black mb-3">
                  {project.overview}
                </p>
              </div>
            </div>

            <div className="max-w-full w-[553px] lg:h-[690px] mx-auto">
              <Slider imagesUrl={project.assets} />
            </div>
          </section>

          <section className="flex  my-4">
            {project.is_owner && (
              <button type="button" class="btn btn-primary btn-sm">
                MINT NFT <i class="fa-thin fa-square-plus ml-1"></i>
              </button>
            )}

            {nftList.length !== 0 && (
              <button
                type="button"
                class="ml-auto btn btn-outline-primary btn-sm"
              >
                Sort By <i class="fa-thin fa-arrow-down-short-wide ml-1"></i>
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

          {/* 
            <div className="py-3 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
            </div> */}

          {/* ========== nft deatils page murkup */}
          {/* <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br /> */}
          {/* 
            <section className="flex flex-col lg:flex-row py-5">
              <div className="flex-1 pr-4 mb-5 md:mb-0">
                <img src={manImg} className="rounded-3xl" alt="image" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="bg-color-dark-1 rounded-3xl p-5 mb-2">
                  <h1 className="text-white  pb-4">Bored Ape #8295</h1>
                  <p className="text-white text-sm pb-4">Find it On</p>
                  <p className="text-white-shade-600 text-sm">
                    Your NFT is not listed on any marketplace
                  </p>
                </div>

                <div className="bg-color-dark-1 rounded-3xl p-5 mb-2">
                  <h1 className="text-white  pb-4">Description</h1>
                  <p className="text-white-shade-600 text-sm pb-4">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. It is a long established fact that a reader will
                    be distracted by the readable content of a page when looking
                    at its layout. It is a long established fact that a reader
                    will be distracted by
                  </p>
                </div>

                <div className="bg-color-dark-1 rounded-3xl p-5 ">
                  <h1 className="text-white  pb-4">Properties</h1>
                  <div className="flex  flex-wrap">
                    <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                      <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                        <p className="text-white-shade-600 text-sm">
                          Background
                        </p>
                        <h5 className="text-white">Green</h5>
                        <p className="text-white-shade-600 text-sm">
                          Add 5% this trait
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                      <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                        <p className="text-white-shade-600 text-sm">
                          Background
                        </p>
                        <h5 className="text-white">Green</h5>
                        <p className="text-white-shade-600 text-sm">
                          Add 5% this trait
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                      <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                        <p className="text-white-shade-600 text-sm">
                          Background
                        </p>
                        <h5 className="text-white">Green</h5>
                        <p className="text-white-shade-600 text-sm">
                          Add 5% this trait
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                      <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                        <p className="text-white-shade-600 text-sm">
                          Background
                        </p>
                        <h5 className="text-white">Green</h5>
                        <p className="text-white-shade-600 text-sm">
                          Add 5% this trait
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="bg-color-dark-1 rounded-3xl p-5 mb-4 lg:w-2/5">
                <div className="flex text-white mb-3">
                  <div className="font-bold w-1/3 flex justify-between mr-1">
                    <span>Smart Contract </span>
                    <span>:</span>
                  </div>
                  <div className="text-ellipsis overflow-hidden flex-1 pr-4 relative">
                    Xysd29479q3hfu39238yXysd29479q3hfu39238yXysd29479q3hfu39238yXysd29479q3hfu39238y
                    <i class="fa-thin fa-copy cursor-pointer absolute top-1 right-0"></i>
                  </div>
                </div>
                <div className="flex text-white">
                  <div className="font-bold w-1/3 flex justify-between mr-1">
                    <span>Token ID </span>
                    <span>:</span>
                  </div>
                  <div className="text-ellipsis overflow-hidden">12342</div>
                </div>
              </div>
            </section> */}

          {/* ========== nft deatils page murkup */}
          {/* <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br /> */}

          {/* <section className="flex flex-col lg:flex-row py-5">
              <div className="flex-1 pr-4 mb-5 md:mb-0">
                <img src={manImg} className="rounded-3xl" alt="image" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="bg-color-dark-1 rounded-3xl p-5 mb-2">
                  <h1 className="text-white  pb-4">Bored Ape #8295</h1>
                  <p className="text-white text-sm pb-4">Find it On</p>

                  <div className="flex">
                    <button className="border border-color-blue rounded-xl p-5 text-color-blue font-semibold mr-4 hover:text-white hover:bg-color-blue">
                      <i class="fa-regular fa-aperture mr-1"></i> Opensea
                    </button>
                    <button className="border border-color-yellow rounded-xl p-5 text-color-yellow font-semibold hover:text-white hover:bg-color-yellow">
                      <i class="fa-regular fa-square-r mr-1"></i> Rarible
                    </button>
                  </div>
                </div>

                <div className="bg-color-dark-1 rounded-3xl p-5 mb-2">
                  <h1 className="text-white  pb-4">Description</h1>
                  <p className="text-white-shade-600 text-sm pb-4">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout. It is a long established fact that a reader will
                    be distracted by the readable content of a page when looking
                    at its layout. It is a long established fact that a reader
                    will be distracted by
                  </p>
                </div>

                <div className="bg-color-dark-1 rounded-3xl p-5 ">
                  <h1 className="text-white  pb-4">Properties</h1>
                  <div className="flex  flex-wrap">
                    <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                      <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                        <p className="text-white-shade-600 text-sm">
                          Background
                        </p>
                        <h5 className="text-white">Green</h5>
                        <p className="text-white-shade-600 text-sm">
                          Add 5% this trait
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                      <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                        <p className="text-white-shade-600 text-sm">
                          Background
                        </p>
                        <h5 className="text-white">Green</h5>
                        <p className="text-white-shade-600 text-sm">
                          Add 5% this trait
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                      <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                        <p className="text-white-shade-600 text-sm">
                          Background
                        </p>
                        <h5 className="text-white">Green</h5>
                        <p className="text-white-shade-600 text-sm">
                          Add 5% this trait
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                      <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                        <p className="text-white-shade-600 text-sm">
                          Background
                        </p>
                        <h5 className="text-white">Green</h5>
                        <p className="text-white-shade-600 text-sm">
                          Add 5% this trait
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
        </main>
      )}

      {/* old code */}

      {/* <div className={`my-4 ${isLoading ? "loading" : ""}`}>
        {!isLoading && project && !project.name && (
          <div className="text-center text-red-500">Project not Found</div>
        )}
        {!isLoading && project && project.name && (
          <div>
            <div className="ml-12 text-2xl font-bold">{project.name}</div>
            <div className="py-4">
              <img
                src={
                  project?.assets[0]?.path
                    ? project.assets[0].path
                    : require(`assets/images/no-image-found.png`)
                }
                alt="cover"
                className="w-full h-96"
              />
            </div>
            <div className="float-right mr-10">
              <div
                className="relative bottom-10 left-1 rounded-full h-14 w-14 bg-[#B9CCD5] hover:bg-[#0AB4AF] grid grid-cols-1 content-center cursor-pointer"
                onClick={LikeProject}
              >
                <LikeIcon className="ml-1.5" />
              </div>
              <div className="relative bottom-10 left-0 text-sm">Appreciate</div>
            </div>
            <div className="h-4"></div> */}

      {/* <div className="flex flex-row mt-24 mx-8">
            <div className="w-2/4 border border-gray-300 float-right">
              <div class="grid grid-cols-4 divide-x divide-gray-300 text-gray-400">
                <div className="h-28 text-center">
                  <div className="m-4">
                    <p className="text-sm font-semibold">TOKEN SALE</p>
                    <p className="text-black font-semibold my-2">
                      {project.token_amount_total
                        ? project.token_amount_total
                        : 0}
                    </p>
                    <p className="text-xs">(0000MATIC)</p>
                  </div>
                </div>
                <div className="h-28 text-center">
                  <div className="m-4">
                    <p className="text-sm font-semibold">TOKEN PRICE</p>
                    <p className="text-black font-semibold my-2">0 MATIC</p>
                    <p className="text-xs">(0000MATIC)</p>
                  </div>
                </div>
                <div className="h-28 text-center">
                  <div className="m-4">
                    <p className="text-sm font-semibold">BALANCE</p>
                    <p className="text-black font-semibold my-2">0 MATIC</p>
                    <p className="text-xs">(0000MATIC)</p>
                  </div>
                </div>
                <div className="h-28 text-center">
                  <div className="m-4">
                    <p className="text-sm font-semibold">IN WALLET</p>
                    <p className="text-black font-semibold my-2">0 MATIC</p>
                    <p className="text-xs">(0000MATIC)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row w-2/4 ml-14">
              <div className="bg-gray-300 text-white text-center h-14 w-1/2 rounded p-4 mr-2">
                TOKEN NOT SALE
              </div>
              <div className="bg-gray-300 text-white text-center h-14 w-1/2 rounded p-4">
                FIXED MEMBER
              </div>
            </div>
          </div> */}
      {/* <div className="flex flex-row mt-8 mx-8">
            <div className="w-2/4">
              <div class="flex justify-center">
                {project.voting_power === "TknW8" && (
                  <img
                    src={require(`assets/images/projectDetails/badge/badge_vr_weighted.png`)}
                    alt="weighted"
                    className="h-40 w-40"
                  />
                )}
                {project.voting_power === "1VPM" && (
                  <img
                    src={require(`assets/images/projectDetails/badge/badge_vr_1vote.png`)}
                    alt="weighted"
                    className="h-40 w-40"
                  />
                )}
              </div>
            </div>
            <div className="w-2/4">
              <div class="flex ml-12">
                <div className="w-1/2">
                  <p>
                    <strong>INVESTER</strong> <span>0 people</span>
                  </p>
                  <div className="mt-12 border-2 rounded h-36 w-72"></div>
                </div>
                <div className="w-1/2">
                  <p>
                    <strong>MEMBERS</strong> <span>3 people</span>
                  </p>
                  <div>
                    <div className="flex flex-row">
                      <img
                        className="rounded border-8 border-gray-300 shadow-sm h-14 w-14 mr-2"
                        src={require(`assets/images/ico_profilephoto@2x.png`)}
                        alt="user icon"
                      />
                      <img
                        className="rounded border-8 border-gray-300 shadow-sm h-14 w-14 mr-2"
                        src={require(`assets/images/ico_profilephoto@2x.png`)}
                        alt="user icon"
                      />
                      <img
                        className="rounded border-8 border-gray-300 shadow-sm h-14 w-14"
                        src={require(`assets/images/ico_profilephoto@2x.png`)}
                        alt="user icon"
                      />
                    </div>
                  </div>
                  <div className="border-2 rounded h-36 w-72 p-2">
                    <div className="flex">
                      <p className="text-sm font-semibold">NAME </p>
                      <img className="h-5 w-5" src={locationIcon} alt="" />
                      <p className="text-sm">Tokyo, Japan</p>
                    </div>
                    <div className="text-xs">
                      Designer, Web Analytics Consultant
                    </div>
                    <div className="text-sm mt-2">
                      Profile text Profile text Profile text Profile text
                      Profile text Profile text Profile text Profile text
                      Profile text Profile text Profile text Profile text
                      Profile text …
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

      {/* <div className="text-center w-full my-8 border-t">
              <div className="text-2xl font-semibold my-8">About Project</div>
            </div>
            <div className="flex flex-row mt-8 mx-8">
              <div className="w-2/4 pr-8">
                {!!project?.assets[1] && (
                  <img
                    className="rounded-lg shadow-sm h-96 w-full"
                    src={
                      selectedImages?.path
                        ? selectedImages.path
                        : require(`assets/images/no-image-found-square.png`)
                    }
                    alt="user icon"
                  />
                )}
                <div className="flex flex-row mt-2">
                  {project &&
                    project.assets &&
                    project.assets.length > 0 &&
                    project.assets.map((image, index) => (
                      <>
                        {index > 0 && (
                          <img
                            key={`project-image-${index}`}
                            className={`rounded-lg shadow-sm h-24 w-30 mr-2 ${image.path === selectedImages?.path
                              ? "border-4 border-[#0AB4AF]"
                              : ""
                              }`}
                            src={
                              image.path
                                ? image.path
                                : require(`assets/images/no-image-found-square.png`)
                            }
                            alt={`project pic-${index}`}
                            onClick={() => changeImagePreview(image)}
                          />
                        )}
                      </>
                    ))}
                </div>
              </div>
              <div className="w-2/4">
                <p>{project.overview}</p>
              </div>
            </div>
            <div className="flex justify-center my-8 border-t">
              <div className="bg-gray-200 text-center text-white h-14 w-1/4 rounded p-4 mr-2 mt-8">
                TOKEN NOT SALE
              </div>
            </div>
            <div className="flex justify-center">
              <div className="mt-4 justify-center text-center">
                <div className="rounded-full h-14 w-14 bg-[#B9CCD5] hover:bg-[#0AB4AF] grid grid-cols-1 content-center cursor-pointer m-4">
                  <LikeIcon className="ml-1.5" />
                </div>
                <div className="text-sm mt-1">Appreciate</div>
              </div>
              <div className="mt-4 justify-center text-center">
                <div className="rounded-full h-14 w-14 bg-[#B9CCD5] hover:bg-[#0AB4AF] grid grid-cols-1 content-center cursor-pointer m-4">
                  <ViewIcon className="ml-1.5" />
                </div>
                <div className="text-sm mt-1">
                  {project?.project_view_count ? project.project_view_count : 0}
                </div>
              </div>
            </div>
            <div
              className="flex justify-center cursor-pointer"
              onClick={() => history.push("/all-project")}
            >
              <div className="border rounded-full text-center text-black h-14 w-1/4 rounded p-4 mr-2 mt-8 hover:border-[#0AB4AF] hover:text-[#0AB4AF]">
                Back to project list
              </div>
            </div>
          </div>
        )}
      </div> */}
    </>
  );
}
