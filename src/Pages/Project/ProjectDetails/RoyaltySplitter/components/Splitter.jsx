import { useState, useEffect, useMemo } from "react";
import PlusIcon from "assets/images/icons/plus-circle.svg";
import { round } from "lodash";
import MemberListTable from "Pages/Collection/CollectionDetail/RoyaltySplitter/MemberListTable";
import usePublishRoyaltySplitter from "Pages/Collection/CollectionDetail/RoyaltySplitter/Publish/hooks/usePublishRoyaltySplitter";
import {
  getCollectionDetailsById,
  getSplitterDetails,
  updateRoyaltySplitter,
} from "services/collection/collectionService";
import SuccessModal from "components/Modals/SuccessModal";
import ConfirmationModal from "components/Modals/ConfirmationModal";
import ImportWalletModal from "Pages/Collection/CollectionDetail/RoyaltySplitter/ImportWalletModal/ImportWalletModal";
import ErrorModal from "components/Modals/ErrorModal";
import { toast } from "react-toastify";
import PublishRoyaltyModal from "Pages/Collection/CollectionDetail/RoyaltySplitter/Publish/PublishRoyaltyModal";
import PublishCollectionModal from "Pages/Collection/CollectionDetail/Publish/PublishCollectionModal";
import Spinner from "components/Commons/Spinner";
import ReactPaginate from "react-paginate";
import { getCurrentNetworkId } from "util/MetaMask";
import NetworkHandlerModal from "components/Modals/NetworkHandlerModal";

const TABLE_HEADERS = [
  { id: 0, label: "Wallet Address" },
  { id: 1, label: "Percentage" },
  { id: 2, label: "Name" },
  { id: 3, label: "Role" },
  { id: 4, label: "Action" },
];

const Splitter = ({ collectionId, getProjectCollections, projectNetwork }) => {
  const [ShowPercentError, setShowPercentError] = useState(false);
  const [AutoAssign, setAutoAssign] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [royalitySplitterId, setRoyalitySpliterId] = useState("");
  const [royalityMembers, setRoyalityMembers] = useState([]);
  const [showRoyalityErrorModal, setShowRoyalityErrorModal] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [IsAutoFillLoading, setIsAutoFillLoading] = useState(false);
  const [pagination, SetPagination] = useState([]);
  const [payload, setPayload] = useState({
    page: 1,
    limit: 5,
  });
  const [Collection, setCollection] = useState();
  const [projectID, setProjectID] = useState("");
  const [showNetworkHandler, setShowNetworkHandler] = useState(false);

  const hasPublishedRoyaltySplitter = useMemo(
    () => Collection?.royalty_splitter?.status === "published",
    [Collection]
  );
  const [showRoyalityErrorMessage, setShowRoyalityErrorMessage] = useState("");
  const [RoyaltyUpdatedSuccessfully, setRoyaltyUpdatedSuccessfully] =
    useState(false);
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
        // getProjectCollections();
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

  const [showImportWallet, setShowImportWallet] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getCollectionDetail();
  }, [collectionId]);

  // useEffect(() => {}, [payload]);

  const getCollectionDetail = () => {
    let payload = {
      id: collectionId,
    };
    getCollectionDetailsById(payload)
      .then((resp) => {
        setIsLoading(false);
        if (resp.code === 0) {
          setProjectID(resp?.collection?.project_uid);
          if (resp?.collection?.royalty_splitter?.id) {
            setRoyalitySpliterId(resp.collection.royalty_splitter.id);
            getSplittedContributors(resp.collection.royalty_splitter.id);
          }
          setCollection(resp.collection);
        }
      })
      .catch((err) => setIsLoading(false));
  };

  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  const getSplittedContributors = (id) => {
    getSplitterDetails(id).then((data) => {
      if (data.code === 0) {
        setRoyalityMembers(data?.members);
        if (data?.members?.length > 0) {
          const page = calculatePageCount(payload.limit, data.members.length);
          const pageList = [];
          for (let index = 1; index <= page; index++) {
            pageList.push(index);
          }
          SetPagination(pageList);
        }
      }
    });
  };

  const handleAutoAssign = (e) => {
    let memberCount = royalityMembers.length;

    if (!memberCount) {
      return;
    }

    setAutoAssign(!AutoAssign);

    let value = 100 / memberCount;
    let values = royalityMembers.map((mem) => {
      return {
        ...mem,
        royalty_percent: parseFloat(round(value, 18)),
      };
    });
    setRoyalityMembers(values);
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

  const handleValueChange = (e, id) => {
    let values = royalityMembers.map((mem) => {
      if (id === mem.user_eoa) {
        return {
          ...mem,
          royalty_percent: parseFloat(e.target.value),
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

  const handlePageClick = (event) => {
    const newPayload = { ...payload };
    newPayload.page = event.selected + 1;
    setPayload(newPayload);
  };

  const handlePublishSpliter = async () => {
    let networkId = await getCurrentNetworkId();
    if (Number(projectNetwork) === networkId) {
      setShowPublishRoyaltySpliterConfirmModal(true);
    } else {
      setShowNetworkHandler(true);
    }
  };

  const indexOfLastPost = payload.page * payload.limit;

  const indexOfFirstPost = indexOfLastPost - payload.limit;

  const currentMembers =
    royalityMembers?.length &&
    royalityMembers.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      {loading && (
        <div className="grid mt-[40px] place-items-center">
          <Spinner />
        </div>
      )}
      {showNetworkHandler && (
        <NetworkHandlerModal
          show={showNetworkHandler}
          handleClose={() => setShowNetworkHandler(false)}
          projectNetwork={projectNetwork}
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
      {showPublishRoyaltySpliterConfirmModal && (
        <PublishCollectionModal
          show={showPublishRoyaltySpliterConfirmModal}
          handleClose={() => setShowPublishRoyaltySpliterConfirmModal(false)}
          publishProject={handlePublishRoyaltySplitter}
          type="Royalty Splitter"
        />
      )}

      {showPublishRoyaltySpliterModal && (
        <PublishRoyaltyModal
          isVisible={showPublishRoyaltySpliterModal}
          isLoading={isPublishingRoyaltySplitter}
          status={publishRoyaltySplitterStatus}
          onRequestClose={() => setShowPublishRoyaltySpliterModal(false)}
        />
      )}
      {showPublishRoyaltySpliterErrorModal && (
        <ErrorModal
          show={showPublishRoyaltySpliterErrorModal}
          title="Failed to publish royalty percentage!"
          handleClose={() => setShowPublishRoyaltySpliterErrorModal(false)}
        />
      )}

      {!loading && (
        <div className="bg-[#F8FCFE] rounded-[12px] p-5 mt-5">
          <div className="flex items-start md:items-center justify-between pb-7 ">
            <h3 className="text-[18px] font-black">Splitter Information</h3>
            {ShowPercentError ? (
              <p className="text-red-400 text-[14px] mt-1">
                Total percent of contributors should equal to or lesser than
                100%
              </p>
            ) : null}
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
          {/* <div className="mt-[30px]">
            {pagination.length > 0 && (
              <>
                <ReactPaginate
                  className="flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6"
                  pageClassName="px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack "
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pagination.length}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  activeClassName="text-primary-900 bg-primary-900 !no-underline"
                  activeLinkClassName="!text-txtblack !no-underline"
                />
              </>
            )}
          </div> */}
          {/* {CollectionDetail.is_owner &&
                CollectionDetail.status !== "published" ? ( */}
          <div className="w-full">
            {!hasPublishedRoyaltySplitter && (
              <button
                className="block ml-auto bg-primary-100 text-primary-900 p-3 font-black text-[14px]"
                onClick={handlePublishSpliter}
                disabled={
                  !canPublishRoyaltySplitter ||
                  isPublishingRoyaltySplitter ||
                  !royalityMembers.length
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
      )}
    </>
  );
};

export default Splitter;
