import { useEffect, useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCollectionNFTs,
  getCollectionDetailsById,
  getSplitterDetails,
  updateRoyaltySplitter,
  getCollectionSales,
  getNetWorth,
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
import Facebook from "assets/images/facebook.svg";
import Instagram from "assets/images/instagram.svg";
import Twitter from "assets/images/twitter.svg";
import Github from "assets/images/github.svg";
import Reddit from "assets/images/reddit.svg";
import ExternalLink from "assets/images/link.svg";
import TransferNFT from "components/modalDialog/TransferNFT";
import { getProjectDetailsById } from "services/project/projectService";
import Eth from "assets/images/network/eth.svg";
import Polygon from "assets/images/network/polygon.svg";
import MemberListTable from "components/RoyalityManagement/MemberListTable/MemberListTable";
import PlusIcon from "assets/images/icons/plus-circle.svg";
import NFTSales from "components/RoyalityManagement/NFTSale/NFTSales";
import ConfirmationModal from "components/modalDialog/ConfirmationModal";
import ImportWalletModal from "components/modalDialog/ImportWalletModal/ImportWalletModal";
import { walletAddressTruncate } from "util/walletAddressTruncate";
import usePublishRoyaltySplitter from "hooks/usePublishRoyaltySplitter";
import PublishRoyaltyModal from "components/StatusModal/PublishRoyaltyModal";
import SalesSuccessModal from "components/modalDialog/SalesSuccessModal";
import defaultCover from "assets/images/image-default.svg";
const TABLE_HEADERS = [
  { id: 0, label: "Wallet Address" },
  // { id: 2, label: "Email" },
  { id: 1, label: "Percentage" },
  { id: 2, label: "Name" },
  // { id: 4, label: "Token ID" },
  { id: 3, label: "Role" },
  { id: 4, label: "Action" },
];
const imageRegex = new RegExp("image");

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
  const [projectNetwork, setProjectNetwork] = useState("");
  const [selectedTab, setSelectedTab] = useState(1);
  const [isEdit, setIsEdit] = useState(null);
  const [AutoAssign, setAutoAssign] = useState(false);
  const [royalitySplitterId, setRoyalitySpliterId] = useState("");
  const [royalityMembers, setRoyalityMembers] = useState([]);
  const [IsAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [RoyaltyUpdatedSuccessfully, setRoyaltyUpdatedSuccessfully] =
    useState(false);
  const [ShowPercentError, setShowPercentError] = useState(false);
  const [showRoyalityErrorModal, setShowRoyalityErrorModal] = useState(false);
  const [showRoyalityErrorMessage, setShowRoyalityErrorMessage] = useState("");
  const [showImportWallet, setShowImportWallet] = useState(false);
  const [projectID, setProjectID] = useState("");
  const [nftSales, setNFTSales] = useState([]);
  const [nftMemSupply, setNftMemSupply] = useState(0);
  const [daoInfo, setDaoInfo] = useState({});

  // Publish royalty splitter
  const [showPublishRoyaltySpliterModal, setShowPublishRoyaltySpliterModal] =
    useState(false);
  const [
    showPublishRoyaltySpliterConfirmModal,
    setShowPublishRoyaltySpliterConfirmModal,
  ] = useState();
  const [
    showPublishRoyaltySpliterErrorModal,
    setShowPublishRoyaltySpliterErrorModal,
  ] = useState(false);
  const hasPublishedRoyaltySplitter = useMemo(
    () => Collection?.royalty_splitter?.status === "published",
    [Collection]
  );

  const hanldeUpdatePublishStatus = (status) => {
    if (status === "success") {
      if (Collection.royalty_splitter.status !== "published") {
        setCollection({
          ...Collection,
          royalty_splitter: {
            ...Collection.royalty_splitter,
            status: "published",
          },
        });
      }
    }
  };

  const {
    isLoading: isPublishingRoyaltySplitter,
    status: publishRoyaltySplitterStatus,
    canPublish: canPublishRoyaltySplitter,
    publish: publishRoyaltySplitter,
  } = usePublishRoyaltySplitter({
    collection: Collection,
    splitters: royalityMembers,
    onUpdateStatus: hanldeUpdatePublishStatus,
  });

  const [balanceLoading, setBalanceLoading] = useState(false);
  const [newWorth, setNetWorth] = useState({
    balance: 0,
    currency: "",
    balanceUSD: 0,
  });

  useEffect(() => {
    if (collectionId) {
      getCollectionDetail();
      getNFTs();
      getCollectionSalesData();
      getCollectionNewWorth();
    }
  }, []);

  const getCollectionSalesData = () => {
    getCollectionSales(collectionId).then((data) =>
      setNFTSales(data?.sales ? data?.sales : [])
    );
  };

  const getCollectionNewWorth = () => {
    setBalanceLoading(true);
    getNetWorth(collectionId).then((resp) => {
      if (resp.code === 0) {
        setBalanceLoading(false);
        setNetWorth({
          balance: resp.balance,
          currency: resp.currency,
          balanceUSD: resp.balance_usd,
        });
      } else {
        setBalanceLoading(false);
        setNetWorth({ balance: 0, currency: "", balanceUSD: 0 });
      }
    });
  };

  const getNFTs = () => {
    getCollectionNFTs(collectionId)
      .then((resp) => {
        if (resp.code === 0) {
          setNFTs(resp.lnfts);
        }
      })
      .catch((err) => console.log(err));
  };

  const getSplittedContributors = (id) => {
    getSplitterDetails(id).then((data) => {
      if (data.code === 0) {
        setRoyalityMembers(data?.members);
      }
    });
  };

  const getCollectionDetail = () => {
    let payload = {
      id: collectionId,
    };
    getCollectionDetailsById(payload)
      .then((resp) => {
        if (resp.code === 0) {
          console.log(resp);
          setProjectID(resp?.collection?.project_uid);
          getProjectDetailsById({ id: resp?.collection?.project_uid }).then(
            (resp) => {
              setProjectNetwork(resp?.project?.blockchain);
              setDaoInfo(resp?.project);
            }
          );
          if (resp?.collection?.royalty_splitter?.id) {
            setRoyalitySpliterId(resp.collection.royalty_splitter.id);
            getSplittedContributors(resp.collection.royalty_splitter.id);
          }
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
          }
          if (resp?.collection?.links) {
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

  const handleAutoAssign = (e) => {
    setAutoAssign(!AutoAssign);
    let memberCount = royalityMembers.length;
    let value = 100 / memberCount;
    let values = royalityMembers.map((mem) => {
      return {
        ...mem,
        royalty_percent: parseInt(value),
      };
    });
    setRoyalityMembers(values);
  };

  const handleEditNFT = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setShowOptions(null);
    history.push(
      `${
        Collection?.type === "product"
          ? `/product-nft?collectionId=${collectionId}&nftId=${id}`
          : `/membershipNFT?dao_id=${Collection.project_uid}&collection_id=${collectionId}&nftId=${id}`
      }`
    );
  };

  const handleUpdateMeta = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setShowOptions(null);
  };

  function salesPageModal(e, type, id, supply) {
    e.stopPropagation();
    e.preventDefault();
    setShowOptions(null);
    if (type === "membership") {
      setNftId(id);
      setNftMemSupply(supply);
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

  const handleAutoFill = () => {
    let members = royalityMembers.map((mem) => {
      return {
        wallet_address: mem.user_eoa,
        royalty: mem.royalty_percent,
      };
    });
    let formData = new FormData();
    formData.append("royalty_data", JSON.stringify(members));
    royalitySplitterId
      ? formData.append("splitter_uid", royalitySplitterId)
      : formData.append("collection_uid", Collection.id);
    if (!ShowPercentError) {
      setIsAutoFillLoading(true);
      updateRoyaltySplitter(formData)
        .then((resp) => {
          if (resp.code === 0) {
            toast.success("Royalty Percentage Updated Successfully");

            setIsAutoFillLoading(false);
            setAutoAssign(false);
            setIsEdit(null);
            setShowRoyalityErrorModal(false);
            setShowRoyalityErrorMessage("");
          } else {
            setIsAutoFillLoading(false);
            setRoyaltyUpdatedSuccessfully(false);
            setShowRoyalityErrorModal(true);
            setAutoAssign(false);
            setShowRoyalityErrorMessage(resp.message);
          }
        })
        .catch((err) => {
          setIsAutoFillLoading(false);
          setRoyaltyUpdatedSuccessfully(false);
          setAutoAssign(false);
        });
    }
  };

  const handleValueChange = (e, id) => {
    let values = royalityMembers.map((mem) => {
      if (id === mem.user_eoa) {
        return {
          ...mem,
          royalty_percent: parseInt(e.target.value),
        };
      }
      return mem;
    });

    let percent = royalityMembers.reduce(
      (acc, val) => acc + val.royalty_percent,
      0
    );

    if (percent > 100) {
      setShowPercentError(true);
    } else {
      setShowPercentError(false);
    }

    setRoyalityMembers(values);
  };

  const handlePublishRoyaltySplitterButtonClick = async () => {
    setShowPublishRoyaltySpliterConfirmModal(true);
  };

  const handlePublishRoyaltySplitter = async () => {
    try {
      setShowPublishRoyaltySpliterConfirmModal(false);
      setShowPublishRoyaltySpliterModal(true);
      await publishRoyaltySplitter();
    } catch (err) {
      setShowPublishRoyaltySpliterModal(false);
      setShowPublishRoyaltySpliterErrorModal(true);
      console.error(err);
    }
  };

  return (
    <div className="mx-4 md:mx-0">
      {ShowPublishModal && (
        <PublishModal
          show={ShowPublishModal}
          handleClose={() => setShowPublishModal(false)}
          publishProject={handlePublish}
          type="Collection"
        />
      )}
      {RoyaltyUpdatedSuccessfully && (
        <SuccessModal
          show={RoyaltyUpdatedSuccessfully}
          handleClose={setRoyaltyUpdatedSuccessfully}
          message="Royalty Percentage Updated Successfully"
          btnText="Done"
        />
      )}
      {showRoyalityErrorModal && (
        <ErrorModal
          title={"Failed to apply royalty percentage!"}
          message={`${showRoyalityErrorMessage}`}
          handleClose={() => {
            setShowRoyalityErrorModal(false);
            setShowRoyalityErrorMessage(null);
            setAutoAssign(false);
          }}
          show={showRoyalityErrorModal}
        />
      )}
      {AutoAssign && (
        <ConfirmationModal
          show={AutoAssign}
          handleClose={setAutoAssign}
          handleApply={handleAutoFill}
          message="This will apply royalty percentage to all the members equally. Are you
          sure, you want to proceed?"
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
          collectionId={Collection?.id}
          collectionName={Collection?.name}
          collectionSymbol={Collection?.symbol}
          collectionType={Collection?.type}
          publishStep={publishStep}
        />
      )}
      {showTransferNFT && (
        <TransferNFT
          show={showTransferNFT}
          handleClose={() => setShowTransferNFT(false)}
        />
      )}
      {showImportWallet && (
        <ImportWalletModal
          show={showImportWallet}
          handleClose={() => {
            setShowImportWallet(false);
            getSplittedContributors(
              royalitySplitterId ? royalitySplitterId : Collection?.id
            );
          }}
          projectId={projectID}
          collectionName={Collection?.name}
          collectionId={Collection?.id}
          handleValueChange={handleValueChange}
          handleAutoFill={handleAutoFill}
          royalityMembers={royalityMembers}
          setRoyalityMembers={setRoyalityMembers}
          showPercentError={ShowPercentError}
          royalitySplitterId={royalitySplitterId}
          setRoyaltyUpdatedSuccessfully={setRoyaltyUpdatedSuccessfully}
          setShowRoyalityErrorModal={setShowRoyalityErrorModal}
          setShowRoyalityErrorMessage={setShowRoyalityErrorMessage}
        />
      )}
      <section className="mt-6">
        <div className="row-span-2 col-span-2">
          <img
            className="rounded-xl object-cover h-[124px] md:h-[260px] w-full"
            src={CoverImages?.path ? CoverImages?.path : Cover}
            alt=""
          />
        </div>
      </section>
      <section className={`bg-[#fff] rounded-b-xl mt-4 p-6 shadow-main`}>
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
                    ? walletAddressTruncate(Collection.contract_address)
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
                <p className="my-2 text-textLight text-sm flex items-center">
                  Connected With :
                  <Link
                    className="ml-2 font-bold flex items-center !no-underline"
                    to={`/project-details/${daoInfo?.id}`}
                  >
                    <img
                      className="h-[24px] w-[24px] rounded-full mr-1"
                      src={
                        daoInfo?.assets?.length > 0
                          ? daoInfo.assets.find(
                              (img) => img["asset_purpose"] === "cover"
                            )
                            ? daoInfo.assets.find(
                                (img) => img["asset_purpose"] === "cover"
                              ).path
                            : defaultCover
                          : defaultCover
                      }
                      alt="collection cover"
                    />
                    {daoInfo?.name}
                  </Link>
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
                <div className="social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300">
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
            {Links.find((link) => link.title === "linkReddit") &&
              Links.find((link) => link.title === "linkReddit").value?.length >
                0 && (
                <div className="social-icon-button cursor-pointer w-8 h-8 mb-4 flex justify-center items-center rounded-md ease-in-out duration-300 ml-4 ">
                  <a
                    href={`${
                      Links.find((link) => link.title === "linkReddit").value
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={Reddit} alt="Reddit" />
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
            <div className="text-textLight text-sm">
              {Collection?.description ? (
                <p className="whitespace-pre-line text-textLight text-sm">
                  {Collection.description}
                </p>
              ) : (
                "Please add description to show here"
              )}
            </div>
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
                        src={img?.avatar ? img.avatar : avatar}
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

          <div className="flex items-start md:items-end flex-col mt-3 justify-center md:justify-end md:w-1/3  md:mt-0">
            <div className="bg-[#E8F5FB] ml-0 md:ml-3 rounded-md p-3 px-5 relative w-56">
              <i
                onClick={getCollectionNewWorth}
                className={`cursor-pointer fa-regular fa-arrows-rotate text-textSubtle text-sm  absolute right-2 top-3 ${
                  balanceLoading ? "fa-spin" : ""
                }'}`}
              ></i>
              <p className=" text-sm text-textSubtle ">Net Worth</p>
              <h4>
                {newWorth?.balance} {newWorth?.currency}
              </h4>
              <p className="text-sm text-textSubtle">
                $ {newWorth.balanceUSD?.toFixed(2)}
              </p>
            </div>
            <div className="mt-6 flex items-center">
              {/* <a className='inline-block ml-4 bg-primary-900 bg-opacity-10 p-3 text-primary-900  font-black text-sm leading-4 font-satoshi-bold rounded cursor-pointer  hover:bg-opacity-100 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>
                Sales Setting
              </a> */}
              {Collection?.type === "product" &&
                Collection?.is_owner &&
                Collection?.status === "published" && (
                  <div
                    onClick={(e) => salesPageModal(e, "product")}
                    className="outlined-button ml-0 md:ml-4 font-satoshi-bold"
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
            className="mint-button mt-3 text-center font-satoshi-bold w-full md:w-fit"
          >
            <span> Create NFT</span>
          </div>
        )}
        <section>
          <div className="mb-4">
            <ul
              className="flex flex-wrap -mb-px text-sm font-medium text-center"
              id="myTab"
              data-tabs-toggle="#myTabContent"
              role="tablist"
            >
              <li
                className="mr-2"
                role="presentation"
                onClick={() => setSelectedTab(1)}
              >
                <button
                  className={`inline-block p-4 text-lg rounded-t-lg ${
                    selectedTab === 1
                      ? "border-b-2 border-primary-900 text-primary-900"
                      : "border-transparent text-textSubtle"
                  } hover:text-primary-600`}
                  id="nft"
                  data-tabs-target="#nft"
                  type="button"
                  role="tab"
                  aria-controls="nft"
                  aria-selected="true"
                >
                  NFT
                </button>
              </li>
              <li
                className="mr-2"
                role="presentation"
                onClick={() => setSelectedTab(2)}
              >
                <button
                  className={`inline-block p-4 text-lg rounded-t-lg ${
                    selectedTab === 2
                      ? "border-b-2 border-primary-900 text-primary-900"
                      : "border-transparent text-textSubtle"
                  } hover:text-primary-900`}
                  id="dashboard"
                  data-tabs-target="#dashboard"
                  type="button"
                  role="tab"
                  aria-controls="dashboard"
                  aria-selected="false"
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </div>
          <div id="myTabContent">
            {selectedTab === 1 && (
              <div className="flex flex-wrap mt-4 mb-[60px]">
                {NFTs?.length ? (
                  NFTs.map((nft) => {
                    return (
                      <div
                        key={nft?.id}
                        className="min-h-auto md:min-h-[390px] rounded-xl mr-2 md:mr-4 mb-4 bg-white p-4"
                      >
                        <Link to={`/nft-details/${nft?.nft_type}/${nft.id}`}>
                          {imageRegex.test(nft?.asset?.asset_type) && (
                            <img
                              className="rounded-xl h-[176px] md:h-[276px] w-[150px] md:w-[276px] object-contain"
                              src={nft?.asset?.path}
                              alt=""
                            />
                          )}
                          {nft?.asset?.asset_type === "movie" ||
                          nft?.asset?.asset_type === "video/mp4" ? (
                            <video
                              className="h-[176px] md:h-[276px] w-[150px] md:w-[276px]"
                              controls
                            >
                              <source src={nft?.asset?.path} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : null}
                          {nft?.asset?.asset_type === "audio" ||
                          nft?.asset?.asset_type === "audio/mpeg" ? (
                            <audio
                              src={nft?.asset?.path}
                              controls
                              autoPlay={false}
                              className="h-[176px] md:h-[276px] w-[150px] md:w-[276px]"
                            />
                          ) : null}
                        </Link>
                        <div className="py-2 md:py-5">
                          <div className="flex w-[150px] md:w-[276px]">
                            <h2 className="mb-2 text-txtblack truncate flex-1 mr-3 m-w-0 text-[24px]">
                              {nft?.name}
                            </h2>
                            <div className="relative">
                              {/* Dropdown menu  */}
                              {Collection?.is_owner && (
                                <>
                                  <button
                                    type="button"
                                    className="w-[20px]"
                                    onClick={(e) =>
                                      handleShowOptions(e, nft.id)
                                    }
                                  >
                                    <i className="fa-regular fa-ellipsis-vertical text-textSubtle"></i>
                                  </button>
                                </>
                              )}
                              {ShowOptions === nft.id && (
                                <div className="z-10 w-48 bg-white   rounded-md  absolute left-0 top-8 mb-6 block">
                                  <ul className="text-sm mb-0">
                                    {Collection.updatable && (
                                      <>
                                        {Collection.status === "draft" && (
                                          <>
                                            <li className="border">
                                              <div
                                                onClick={(e) =>
                                                  handleEditNFT(e, nft.id)
                                                }
                                                className="py-3 pl-3 block hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                              >
                                                Edit NFT
                                              </div>
                                            </li>
                                          </>
                                        )}
                                        {Collection.status === "published" && (
                                          <>
                                            {Collection.type === "product" && (
                                              <>
                                                {!nft.freeze_metadata && (
                                                  <li className="border-b border-divide">
                                                    <div
                                                      onClick={(e) =>
                                                        handleEditNFT(e, nft.id)
                                                      }
                                                      className="py-3 pl-3 block hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                                    >
                                                      Edit NFT
                                                    </div>
                                                  </li>
                                                )}
                                              </>
                                            )}
                                          </>
                                        )}
                                      </>
                                    )}

                                    {Collection?.type === "membership" && (
                                      <>
                                        <li className="border">
                                          <div
                                            onClick={() => {
                                              setShowTransferNFT(true);
                                              setShowOptions(false);
                                            }}
                                            className="block p-4 hover:bg-gray-100 cursor-pointer"
                                          >
                                            Transfer NFT
                                          </div>
                                        </li>
                                        <li className="border">
                                          <div
                                            onClick={(e) =>
                                              salesPageModal(
                                                e,
                                                "membership",
                                                nft.id,
                                                nft.supply
                                              )
                                            }
                                            className="block p-4 hover:bg-gray-100 cursor-pointer"
                                          >
                                            Sales Settings
                                          </div>
                                        </li>
                                      </>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex  w-[150px] md:w-[276px]">
                            <p className="text-[13px]">
                              {nft?.price}{" "}
                              {nft.currency && nft.currency === "eth"
                                ? "ETH"
                                : "MATIC"}
                            </p>
                            {nft.currency ? (
                              <img
                                className="ml-auto"
                                src={nft.currency === "eth" ? Eth : Polygon}
                                alt={projectNetwork}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full">
                    <p className="font-bold text-center">
                      You don't have any NFT's. Start minting NFT's to display
                      here
                    </p>
                  </div>
                )}
              </div>
            )}
            {selectedTab === 2 && (
              <div className="mb-6">
                <div className="bg-white rounded-[12px] p-5 shadow-main">
                  <div className="flex items-start md:items-center justify-between pb-7 border-b-[1px] mb-6 border-[#E3DEEA]">
                    <h3 className="text-[18px] font-black">Contributor</h3>
                    {ShowPercentError ? (
                      <p className="text-red-400 text-[14px] mt-1">
                        Total percent of contributors should equal to or lesser
                        than 100%
                      </p>
                    ) : null}
                    {/* {CollectionDetail?.is_owner && data?.members?.length ? ( */}
                    <div className="flex items-center justify-center flex-col md:flex-row">
                      {!hasPublishedRoyaltySplitter && (
                        <>
                          <div className="form-check form-switch flex items-center">
                            <p className="text-[#303548] text-[12px] mr-3">
                              Split Evenly
                            </p>
                            <input
                              className="form-check-input appearance-none w-9 rounded-full h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                              type="checkbox"
                              checked={AutoAssign}
                              role="switch"
                              onChange={handleAutoAssign}
                            />
                          </div>
                          <div
                            className="mint-button mt-4 md:mt-0 ml-4 text-center font-satoshi-bold w-full text-[12px] md:w-fit flex"
                            onClick={() => setShowImportWallet(true)}
                          >
                            <img src={PlusIcon} alt="add" />
                            <span className="ml-1">Import Contributor</span>
                          </div>
                        </>
                      )}
                    </div>
                    {/* ) : null} */}
                  </div>{" "}
                  <MemberListTable
                    collection={Collection}
                    list={royalityMembers}
                    headers={TABLE_HEADERS}
                    // handlePublish={setShowPublish}
                    setIsEdit={setIsEdit}
                    setRoyalityMembers={setRoyalityMembers}
                    showRoyalityErrorModal={showRoyalityErrorModal}
                    isEdit={isEdit}
                    handleValueChange={handleValueChange}
                    handleAutoFill={handleAutoFill}
                    isOwner={Collection?.is_owner}
                  />
                  {/* {CollectionDetail.is_owner &&
                CollectionDetail.status !== "published" ? ( */}
                  <div className="w-full">
                    {!hasPublishedRoyaltySplitter && (
                      <button
                        className="block ml-auto bg-primary-100 text-primary-900 p-3 font-black text-[14px]"
                        onClick={() =>
                          setShowPublishRoyaltySpliterConfirmModal(true)
                        }
                        disabled={
                          !canPublishRoyaltySplitter ||
                          isPublishingRoyaltySplitter
                        }
                      >
                        {isPublishingRoyaltySplitter
                          ? publishRoyaltySplitterStatus === 1
                            ? "Creating contract"
                            : "Publishing"
                          : "Lock Percentage"}
                      </button>
                    )}
                  </div>
                  {/* ) : null} */}
                </div>
                <div className="bg-white rounded-[12px] p-5 mt-6 shadow-main">
                  <NFTSales items={nftSales} />
                </div>
              </div>
            )}
          </div>
        </section>
      </section>
      {showSalesPageModal && (
        <SalesPageModal
          show={showSalesPageModal}
          address={Collection?.contract_address}
          collectionId={collectionId}
          collectionType={`${collectionType}`}
          nftId={nftId}
          collectionName={Collection?.name}
          handleClose={() => setShowSalesPageModal(false)}
          successClose={() => {
            setShowSalesPageModal(false);
            setShowSuccessModal(true);
          }}
          supply={nftMemSupply}
          projectNetwork={projectNetwork}
        />
      )}
      {showSuccessModal && (
        <SalesSuccessModal
          show={showSuccessModal}
          handleClose={() => {
            setShowSuccessModal(false);
            getCollectionDetail();
          }}
        />
      )}
      <PublishModal
        show={showPublishRoyaltySpliterConfirmModal}
        handleClose={() => setShowPublishRoyaltySpliterConfirmModal(false)}
        publishProject={handlePublishRoyaltySplitter}
        type="Royalty Splitter"
      />
      <PublishRoyaltyModal
        isVisible={showPublishRoyaltySpliterModal}
        isLoading={isPublishingRoyaltySplitter}
        status={publishRoyaltySplitterStatus}
        onRequestClose={() => setShowPublishRoyaltySpliterModal(false)}
      />
      <ErrorModal
        show={showPublishRoyaltySpliterErrorModal}
        title="Failed to publish royalty percentage!"
        handleClose={() => setShowPublishRoyaltySpliterErrorModal(false)}
      />
    </div>
  );
};

export default CollectionDetail;
