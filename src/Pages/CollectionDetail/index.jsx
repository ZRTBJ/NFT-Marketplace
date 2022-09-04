import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  getCollectionNFTs,
  getCollectionDetailsById,
} from "services/collection/collectionService";
import Cover from "assets/images/cover-default.svg";
import manImg from "assets/images/image-default.svg";
import avatar from "assets/images/dummy-img.svg";
import { Link } from "react-router-dom";
import PublishModal from "components/modalDialog/PublishModal";
import SalesPageModal from "components/modalDialog/SalesPageModal";
import SuccessModal from "components/modalDialog/SuccessModal";
import DeployingCollectiontModal from "components/modalDialog/DeployingCollectionModal";
import ErrorModal from "components/modalDialog/ErrorModal";
import styles from "./style.module.css";
import Facebook from "assets/images/facebook.svg";
import Instagram from "assets/images/instagram.svg";
import Twitter from "assets/images/twitter.svg";
import Github from "assets/images/github.svg";
import ExternalLink from "assets/images/link.svg";
import TransferNFT from "components/modalDialog/TransferNFT";

const CollectionDetail = () => {
  const history = useHistory();
  const [Collection, setCollection] = useState();
  const [CoverImages, setCoverImages] = useState({});
  const [NFTs, setNFTs] = useState([]);
  const [Links, setLinks] = useState([]);
  const [ShowPublishModal, setShowPublishModal] = useState(false);
  const [ShowOptions, setShowOptions] = useState(null);
  const { collectionId } = useParams();
  const [showSalesPageModal, setShowSalesPageModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [collectionType, setCollectionType] = useState("");
  const [nftId, setNftId] = useState("");
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [publishStep, setPublishStep] = useState(1);
  const [tnxData, setTnxData] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [Logo, setLogo] = useState({});
  const [showTransferNFT, setShowTransferNFT] = useState(false);

  useEffect(() => {
    if (collectionId) {
      getCollectionDetail();
      getNFTs();
    }
  }, []);

  const getNFTs = () => {
    getCollectionNFTs(collectionId)
      .then((resp) => {
        if (resp.code === 0) {
          setNFTs(resp.lnfts);
        }
      })
      .catch((err) => console.log(err));
  };

  const getCollectionDetail = () => {
    let payload = {
      id: collectionId,
    };
    getCollectionDetailsById(payload)
      .then((resp) => {
        if (resp.code === 0) {
          console.log(resp);
          setCollection(resp.collection);
          setCollectionType(resp.collection.type);
          if (resp?.collection?.assets && resp?.collection?.assets.length > 0) {
            setCoverImages(
              resp.collection.assets.find(
                (img) => img["asset_purpose"] === "cover"
              )
            );
            setLogo(
              resp.collection.assets.find(
                (img) => img["asset_purpose"] === "logo"
              )
            );

            if (resp?.collection?.links && resp?.collection.links?.length > 0) {
              const webLinks = [];
              try {
                const urls = JSON.parse(resp?.collection.links);
                for (let url of urls) {
                  webLinks.push({
                    title: Object.values(url)[0],
                    value: Object.values(url)[2],
                  });
                }
              } catch {}
              setLinks(webLinks);
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const copyEl = document.getElementById("copied-message");
    copyEl.classList.toggle("hidden");
    setTimeout(() => {
      copyEl.classList.toggle("hidden");
    }, 2000);
  }

  const handleShowOptions = (e, value) => {
    e.stopPropagation();
    e.preventDefault();
    if (ShowOptions) {
      setShowOptions(null);
    } else {
      setShowOptions(value);
    }
  };

  const handleEditNFT = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setShowOptions(null);
  };

  const handleUpdateMeta = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setShowOptions(null);
  };

  function salesPageModal(e, type, id) {
    e.stopPropagation();
    e.preventDefault();
    if (type === "membership") {
      setNftId(id);
    }
    setShowSalesPageModal(true);
  }

  const handlePublish = () => {
    setShowPublishModal(false);
    if (Collection.status === "publishing") {
      setPublishStep(1);
      setShowDeployModal(true);
    } else {
      setShowDeployModal(true);
    }
  };

  return (
    <div>
      {ShowPublishModal && (
        <PublishModal
          show={ShowPublishModal}
          handleClose={() => setShowPublishModal(false)}
          publishProject={handlePublish}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          title={"Collection Publish failed !"}
          message={`${errorMsg}`}
          handleClose={() => {
            setShowErrorModal(false);
            setErrorMsg(null);
          }}
          show={showErrorModal}
        />
      )}
      {showDeployModal && (
        <DeployingCollectiontModal
          show={showDeployModal}
          handleClose={(status) => {
            setShowDeployModal(status);
            const payload = {
              id: collectionId,
            };
            getCollectionDetail(payload);
          }}
          errorClose={(msg) => {
            setErrorMsg(msg);
            setShowDeployModal(false);
            setShowErrorModal(true);
          }}
          tnxData={tnxData}
          collectionId={collectionId}
          publishStep={publishStep}
        />
      )}
      {showTransferNFT && (
        <TransferNFT
          show={showTransferNFT}
          handleClose={() => setShowTransferNFT(false)}
        />
      )}
      <section className="mt-6">
        <div className="row-span-2 col-span-2">
          <img
            className="rounded-xl object-cover h-[260px] w-full"
            src={CoverImages?.path ? CoverImages?.path : Cover}
            alt=""
          />
        </div>
      </section>
      <section
        className={`${styles.collectionDetailDesc} bg-[#fff] rounded-b-xl mt-4 p-6`}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3">
            <div className="flex">
              <img
                src={Logo?.path ? Logo?.path : manImg}
                className="rounded-full self-start w-14 h-14 md:w-[98px] object-cover md:h-[98px] bg-color-ass-6"
                alt="User profile"
              />
              <div className="flex-1 min-w-0  px-4">
                <h1 className="-mt-1 mb-1 md:mb-2 truncate">
                  {Collection?.name}
                </h1>
                <p className="text-textLight text-sm">
                  {Collection?.contract_address
                    ? Collection.contract_address
                    : "Smart Contract not released"}
                  <i
                    className={`fa-solid fa-copy ml-2 ${
                      Collection?.contract_address
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                    disabled={!Collection?.contract_address}
                    onClick={() =>
                      copyToClipboard(Collection?.contract_address)
                    }
                  ></i>
                  <span id="copied-message" className="hidden ml-2">
                    Copied !
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex flex-wrap mt-3 items-start md:justify-end md:w-1/3 md:mt-0"
            role="group"
          >
            {Links.find((link) => link.title === "linkFacebook") &&
              Links.find((link) => link.title === "linkFacebook").value
                ?.length > 0 && (
                <div className="social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 ">
                  <a
                    href={`${
                      Links.find((link) => link.title === "linkFacebook").value
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={Facebook} alt="Facebook" />
                  </a>
                </div>
              )}

            {Links.find((link) => link.title === "linkInsta") &&
              Links.find((link) => link.title === "linkInsta").value?.length >
                0 && (
                <div className="social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4">
                  <a
                    href={`${
                      Links.find((link) => link.title === "linkInsta").value
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={Instagram} alt="Instagram" />
                  </a>
                </div>
              )}

            {Links.find((link) => link.title === "linkTwitter") &&
              Links.find((link) => link.title === "linkTwitter").value?.length >
                0 && (
                <div className="social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4">
                  <a
                    href={`${
                      Links.find((link) => link.title === "linkTwitter").value
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={Twitter} alt="Twitter" />
                  </a>
                </div>
              )}

            {Links.find((link) => link.title === "linkGitub") &&
              Links.find((link) => link.title === "linkGitub").value?.length >
                0 && (
                <div className="social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 ">
                  <a
                    href={`${
                      Links.find((link) => link.title === "linkGitub").value
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={Github} alt="Github" />
                  </a>
                </div>
              )}

            {Links.find((link) => link.title === "customLinks1") &&
              Links.find((link) => link.title === "customLinks1").value
                ?.length > 0 && (
                <div className="social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 ">
                  <a
                    href={`${
                      Links.find((link) => link.title === "customLinks1").value
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={ExternalLink} alt="Github" />
                  </a>
                </div>
              )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row pt-5">
          <div className="md:w-2/3">
            <h3>About</h3>
            <p className="text-textLight text-sm">
              {Collection?.description
                ? Collection.description
                : "Please add description to show here"}
            </p>
            <div className="flex items-center mt-3">
              {Collection &&
                Collection.members &&
                Collection.members.length > 0 &&
                Collection.members.map((img, index) => (
                  <>
                    {index < 5 && (
                      <img
                        key={`member-img-${index}`}
                        className="rounded-full w-9 h-9 -ml-1 border-2 border-white"
                        src={img?.path ? img.path : avatar}
                        alt=""
                      />
                    )}
                  </>
                ))}
              {Collection &&
                Collection.members &&
                Collection.members.length > 5 && (
                  <span className="ml-2 bg-primary-900 bg-opacity-5  text-primary-900 rounded p-1 text-xs  ">
                    +{Collection.members.length - 5}
                  </span>
                )}
            </div>
          </div>

          <div className="flex items-end justify-center flex-col mt-3 md:justify-end md:w-1/3  md:mt-0">
            <div className="bg-[#E8F5FB] ml-3 rounded-md p-3 px-5 relative w-56">
              <i className="fa-regular fa-arrows-rotate text-textSubtle text-sm  absolute right-2 top-3"></i>
              <p className=" text-sm text-textSubtle ">Net Worth</p>
              <h4>10,290.38 ETH</h4>
              <p className="text-sm text-textSubtle">($17295556.18)</p>
            </div>
            <div className="mt-6 flex items-center">
              {/* <a className='inline-block ml-4 bg-primary-900 bg-opacity-10 p-3 text-primary-900  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-opacity-100 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>
                Sales Setting
              </a> */}
              {Collection?.type === "product" && Collection?.is_owner && (
                <div
                  onClick={(e) => salesPageModal(e, "product")}
                  className="outlined-button  ml-4 font-satoshi-bold"
                >
                  <span>Sales Setting</span>
                </div>
              )}
              {Collection?.is_owner && (
                <Link
                  to={`/collection-create/?id=${collectionId}`}
                  className="outlined-button ml-4 font-satoshi-bold"
                >
                  <span>Edit Collection</span>
                </Link>
              )}
              {Collection?.status !== "published" && Collection?.is_owner && (
                <a
                  onClick={() => setShowPublishModal(true)}
                  className="contained-button ml-4 font-satoshi-bold"
                >
                  Publish
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      <section>
        {Collection?.is_owner && (
          <div
            onClick={() =>
              history.push(
                `${
                  Collection?.type === "product"
                    ? `/product-nft?collectionId=${collectionId}`
                    : `/membershipNFT?dao_id=${Collection.project_uid}&collection_id=${collectionId}`
                }`
              )
            }
            className="mint-button mt-3 font-satoshi-bold"
          >
            <span> Mint NFT</span>
          </div>
        )}
        <div className="flex flex-wrap mt-4 mb-[60px]">
          {NFTs &&
            NFTs.map((nft) => {
              return (
                <div
                  key={nft?.id}
                  className="min-h-[390px] rounded-xl mr-4 mb-4 bg-white p-4"
                >
                  <Link to={`/nft-details/${nft?.nft_type}/${nft.id}`}>
                    <img
                      className="rounded-xl h-[276px] w-[276px]"
                      src={nft?.asset?.path}
                      alt=""
                    />
                  </Link>
                  <div className="py-5">
                    <div className="flex w-[276px]">
                      <h2 className="mb-2 text-txtblack truncate flex-1 mr-3 m-w-0 text-[24px]">
                        {nft?.name}
                      </h2>
                      <div className="relative">
                        {Collection?.type === "membership" && (
                          <button
                            type="button"
                            className="w-[20px]"
                            onClick={(e) => handleShowOptions(e, nft.id)}
                          >
                            <i className="fa-regular fa-ellipsis-vertical text-textSubtle"></i>
                          </button>
                        )}

                        {/* Dropdown menu  */}
                        {ShowOptions === nft.id && (
                          <div className="z-10 w-48 bg-white border border-divide rounded-md  absolute left-0 top-8 mb-6 block">
                            <ul className="text-sm">
                              {/*Temporarily disable <li className="border-b border-divide">
                                <div
                                  onClick={(e) => handleEditNFT(e, nft.id)}
                                  className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                >
                                  Edit NFT
                                </div>
                              </li>
                              <li className="border-b border-divide">
                                <div
                                  onClick={(e) => handleUpdateMeta(e, nft.id)}
                                  className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                >
                                  Update Metadata
                                </div>
                              </li> */}
                              <li className="border-b border-divide">
                                <div
                                  onClick={() => setShowTransferNFT(true)}
                                  className="block p-4 hover:bg-gray-100 cursor-pointer"
                                >
                                  Transfer NFT
                                </div>
                              </li>{" "}
                              {Collection?.type === "membership" && (
                                <li className="border-b border-divide">
                                  <div
                                    onClick={(e) =>
                                      salesPageModal(e, "membership", nft.id)
                                    }
                                    className="block p-4 hover:bg-gray-100 cursor-pointer"
                                  >
                                    Sales Settings
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
      {showSalesPageModal && (
        <SalesPageModal
          show={showSalesPageModal}
          collectionId={collectionId}
          collectionType={`${collectionType}`}
          nftId={nftId}
          handleClose={() => setShowSalesPageModal(false)}
          successClose={() => {
            setShowSalesPageModal(false);
            setShowSuccessModal(true);
          }}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          message={"Sale information updated successfully"}
          subMessage={"You can mint NFT now"}
          buttonText={"Close"}
          handleClose={() => {
            setShowSuccessModal(false);
            getCollectionDetail();
          }}
          redirection={`/collection-details/${collectionId}`}
          show={showSuccessModal}
        />
      )}
    </div>
  );
};

export default CollectionDetail;
