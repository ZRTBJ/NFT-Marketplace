import { useEffect, useState } from "react";
import {
  getProjectDetailsById,
  projectLike,
  projectBookmark,
} from "services/project/projectService";
import { getNftListByProjectId, getNftDetails } from "services/nft/nftService";
import { ReactComponent as HeartIcon } from "assets/images/projectDetails/heartIcon.svg";
import { ReactComponent as BookmarkIcon } from "assets/images/projectDetails/bookmarkIcon.svg";
import { ReactComponent as HeartIconFilled } from "assets/images/projectDetails/HeartIconFilled.svg";
import { ReactComponent as BookmarkIconFilled } from "assets/images/projectDetails/BookmarkIconFilled.svg";
import coverImg from "assets/images/no-image-found.png";
import manImg from "assets/images/projectDetails/man-img.svg";
import locationIcon from "assets/images/profile/locationIcon.svg";
import { Link, useHistory } from "react-router-dom";
import Slider from "components/slider/slider";
import Card from "components/profile/Card";
import InfiniteScroll from "react-infinite-scroll-component";

import { useSelector } from "react-redux";
import ProjectDetailsEmptyCaseCard from "components/EmptyCaseCard/ProjectDetailsEmptyCaseCard";
import CommonCard from "components/CommonCard";

export default function DetailsNFT(props) {
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
      // projectDetails(projectId);
      nftDetails();
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
  async function nftDetails() {
    await getNftDetails(projectId)
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <>
      {isLoading && <div className="loading"></div>}
      {!isLoading && (
        <>
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
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  It is a long established fact that a reader will be distracted
                  by
                </p>
              </div>

              <div className="bg-color-dark-1 rounded-3xl p-5 ">
                <h1 className="text-white  pb-4">Properties</h1>
                <div className="flex  flex-wrap">
                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
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
                  <i className="fa-thin fa-copy cursor-pointer absolute top-1 right-0"></i>
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
          </section>
          <section className="flex flex-col lg:flex-row py-5">
            <div className="flex-1 pr-4 mb-5 md:mb-0">
              <img src={manImg} className="rounded-3xl" alt="image" />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="bg-color-dark-1 rounded-3xl p-5 mb-2">
                <h1 className="text-white  pb-4">Bored Ape #8295</h1>
                <p className="text-white text-sm pb-4">Find it On</p>

                <div className="flex">
                  <button className="border border-color-blue rounded-xl p-5 text-color-blue font-semibold mr-4 hover:text-white hover:bg-color-blue">
                    <i className="fa-regular fa-aperture mr-1"></i> Opensea
                  </button>
                  <button className="border border-color-yellow rounded-xl p-5 text-color-yellow font-semibold hover:text-white hover:bg-color-yellow">
                    <i className="fa-regular fa-square-r mr-1"></i> Rarible
                  </button>
                </div>
              </div>

              <div className="bg-color-dark-1 rounded-3xl p-5 mb-2">
                <h1 className="text-white  pb-4">Description</h1>
                <p className="text-white-shade-600 text-sm pb-4">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  It is a long established fact that a reader will be distracted
                  by
                </p>
              </div>

              <div className="bg-color-dark-1 rounded-3xl p-5 ">
                <h1 className="text-white  pb-4">Properties</h1>
                <div className="flex  flex-wrap">
                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
                      <h5 className="text-white">Green</h5>
                      <p className="text-white-shade-600 text-sm">
                        Add 5% this trait
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl w-32 h-28  mr-3 mb-3 bg-gradient-to-r p-[1px] from-[#DF9B5D]  to-[#9A5AFF]">
                    <div className="flex flex-col justify-between text-center h-full bg-color-dark-1 text-white rounded-3xl p-3">
                      <p className="text-white-shade-600 text-sm">Background</p>
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
        </>
      )}
    </>
  );
}
