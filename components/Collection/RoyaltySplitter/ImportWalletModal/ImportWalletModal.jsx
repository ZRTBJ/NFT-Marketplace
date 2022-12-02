import Modal from "components/Commons/Modal";
import {
  getCollections,
  getSplitterDetails,
  updateRoyaltySplitter,
} from "services/collection/collectionService";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import manImg from "assets/images/image-default.svg";
import fileUpload from "assets/images/file-upload.svg";
import Papa from "papaparse";
import ContributorsList from "./ContributorsList";
import csvFile from "assets/csv/contributor-import-template.csv";

const ImportWalletModal = ({
  show,
  handleClose,
  collectionName,
  projectId,
  collectionId,
  royalitySplitterId,
  setRoyaltyUpdatedSuccessfully,
  setShowRoyalityErrorModal,
  setShowRoyalityErrorMessage,
}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [collections, setCollections] = useState([]);
  const [contributors, setContributors] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [showPercentError, setShowPercentError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContributors, setShowContributors] = useState(false);
  const [csvError, setCSVError] = useState("");
  const userinfo = useSelector((state) => state.user.userinfo);

  useEffect(() => {
    getCollections("project", projectId)
      .then((resp) => {
        if (resp.code === 0) {
          const items = resp?.data.filter((item) => item.id !== collectionId);
          setCollections(items);
        }
      })
      .catch((err) => console.log(err));
  }, [projectId]);

  useEffect(() => {
    if (contributors?.length) {
      let selectedValues = contributors?.filter((item) => item.selected);
      let percent = selectedValues.reduce((acc, val) => acc + val.royalty, 0);

      if (percent > 100) {
        setShowPercentError(true);
      } else {
        setShowPercentError(false);
      }
    }
  }, [contributors]);

  const handleCSV = (e) => {
    let files = e.target.files[0];
    if (files) {
      Papa.parse(files, {
        complete: function (results) {
          const headers = results.data.find((data, index) => index === 0);
          if (
            headers.length === 2 &&
            headers[0] === "Wallet Address" &&
            headers[1] === "Percentage"
          ) {
            const data = results.data.filter((data, index) => index !== 0);
            let dataValues = data.map((col) => ({
              id: col[0],
              percent: col[1],
            }));
            if (dataValues.every((value) => value.id && value.percent)) {
              let duplicateValues = dataValues.reduce((a, e) => {
                a[e.id] = ++a[e.id] || 0;
                return a;
              }, {});
              const hasDuplicate = dataValues.filter(
                (e) => duplicateValues[e.id]
              );
              if (!hasDuplicate.length) {
                const owner = {
                  wallet_address: userinfo?.eoa,
                  royalty: 100,
                  selected: true,
                  name: userinfo?.display_name,
                };
                const result = data.map((item) => ({
                  wallet_address: item[0],
                  royalty: parseInt(item[1]),
                  selected: false,
                }));
                setShowContributors(true);
                let values = [owner, ...result];
                setContributors(values);
                setCSVError("");
              } else {
                setCSVError(
                  "Your CSV file has duplicate wallet addressess. Please check and remove it"
                );
              }
            } else {
              setCSVError(
                "Please make sure both Wallet Address and Percentage fields are filled properly"
              );
            }
          } else {
            setCSVError(
              "CSV file should contain only two columns, Wallet Address and Percentage"
            );
          }
        },
      });
    }
  };

  const handleContributorSelect = (e, address) => {
    let items = contributors.map((item) => {
      if (item.wallet_address === address) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return item;
    });
    setContributors(items);
  };

  const handleContributorSelectAll = () => {
    if (contributors.every((item) => item.selected)) {
      let items = contributors.map((item) => ({ ...item, selected: false }));
      setContributors(items);
    } else {
      let items = contributors.map((item) => ({ ...item, selected: true }));
      setContributors(items);
    }
    setSelectAll(!selectAll);
  };

  const handleCollectionContributor = (id) => {
    if (id) {
      getSplitterDetails(id, "collection_id").then((data) => {
        if (data.code === 0) {
          const result = data.members.map((item) => ({
            wallet_address: item.user_eoa,
            royalty: item.royalty_percent,
            selected: item.is_owner ? true : false,
            name: item.user_name,
          }));
          setShowContributors(true);
          setContributors(result);
        }
      });
    }
  };

  const handleValueChange = (e, id) => {
    let values = contributors.map((mem) => {
      if (id === mem.wallet_address) {
        return {
          ...mem,
          royalty: parseInt(e.target.value),
        };
      }
      return mem;
    });

    let percent = values.reduce((acc, val) => acc + val.royalty, 0);

    if (percent > 100) {
      setShowPercentError(true);
    } else {
      setShowPercentError(false);
    }

    setContributors(values);
  };

  const handleAddWallet = () => {
    let splitters = contributors.filter((value) => value.selected);
    let members = splitters.map((mem) => {
      return {
        wallet_address: mem.wallet_address,
        royalty: mem.royalty,
      };
    });
    let formData = new FormData();
    formData.append("royalty_data", JSON.stringify(members));
    royalitySplitterId
      ? formData.append("splitter_uid", royalitySplitterId)
      : formData.append("collection_uid", collectionId);
    setIsLoading(true);
    updateRoyaltySplitter(formData)
      .then((resp) => {
        if (resp.code === 0) {
          setIsLoading(false);
          setRoyaltyUpdatedSuccessfully(true);
          setShowRoyalityErrorModal(false);
          setShowRoyalityErrorMessage("");
          handleClose();
        } else {
          setIsLoading(false);
          setRoyaltyUpdatedSuccessfully(false);
          setShowRoyalityErrorModal(true);
          setShowRoyalityErrorMessage(resp.message);
          handleClose();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setRoyaltyUpdatedSuccessfully(false);
        handleClose();
      });
  };

  return (
    <Modal show={show} handleClose={handleClose} width={638}>
      <h3 className="text-[16px] font-black">Import Wallet</h3>
      <p className="text-[12px]">
        Choose Collection to add member for {collectionName} Contributors
      </p>
      <p className="text-[12px] text-danger-900 w-[380px] leading-[18px] mt-0">
        Note : If you already have a list and importing new new list. The old
        list that you have will be deleted
      </p>
      <div className="mt-8">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          <li
            className="mr-2"
            role="presentation"
            onClick={() => {
              setSelectedTab(1);
              setContributors();
              setShowContributors(false);
            }}
          >
            <button
              className={`inline-block font-bold p-4 text-[16px] rounded-t-lg ${
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
              Collection
            </button>
          </li>
          <li
            className="mr-2"
            role="presentation"
            onClick={() => {
              setSelectedTab(2);
              setContributors();
              setShowContributors(false);
            }}
          >
            <button
              className={`inline-block p-4 font-bold text-[16px] rounded-t-lg ${
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
              Upload CSV
            </button>
          </li>
        </ul>
        <div id="myTabContent">
          {selectedTab === 1 && (
            <div className="mt-8">
              {showContributors ? (
                <ContributorsList
                  contributors={contributors}
                  handleContributorSelect={handleContributorSelect}
                  selectAll={selectAll}
                  handleAddWallet={handleAddWallet}
                  handleContributorSelectAll={handleContributorSelectAll}
                  handleValueChange={handleValueChange}
                  showPercentError={showPercentError}
                  isLoading={isLoading}
                />
              ) : (
                <>
                  {collections?.length ? (
                    collections.map((collection) => {
                      let image = collection?.assets?.find(
                        (img) => img["asset_purpose"] === "logo"
                      );
                      return (
                        <div
                          className="flex items-center mb-6 cursor-pointer"
                          onClick={() =>
                            handleCollectionContributor(collection.id)
                          }
                        >
                          <img
                            src={image ? image.path : manImg}
                            className="w-[56px] h-[56px] rounded-[6px]"
                            alt="Collection"
                          />
                          <p className="text-[14px] font-bold ml-4">
                            {collection.name}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No collections to show</p>
                  )}
                </>
              )}
            </div>
          )}
          {selectedTab === 2 && (
            <div className="mt-8">
              {showContributors ? (
                <ContributorsList
                  handleAddWallet={handleAddWallet}
                  contributors={contributors}
                  handleContributorSelect={handleContributorSelect}
                  selectAll={selectAll}
                  handleContributorSelectAll={handleContributorSelectAll}
                  handleValueChange={handleValueChange}
                  showPercentError={showPercentError}
                  isLoading={isLoading}
                />
              ) : (
                <div>
                  {csvError ? (
                    <p className="text-red-400 text-[14px] mb-3">{csvError}</p>
                  ) : null}
                  <p className="text-[14px] mb-2">
                    Get CSV template <a href={csvFile}>here</a>.
                  </p>
                  <input
                    id="csv-upload"
                    type="file"
                    className="hidden"
                    onChange={handleCSV}
                    accept=".csv"
                  />
                  <label htmlFor={"csv-upload"}>
                    <div className="bg-primary-100 border-[1px] border-primary-900 rounded-[12px] h-[230px] flex items-center justify-center cursor-pointer">
                      <div className="text-center">
                        <img
                          src={fileUpload}
                          alt="file upload"
                          className="w-[28px] h-[28px] mx-auto"
                        />
                        <p className="text-[14px] font-black text-primary-900">
                          Drag or click to Upload .CSV Files
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImportWalletModal;
