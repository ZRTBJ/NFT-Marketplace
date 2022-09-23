import Modal from "components/Modal";
import { getCollections } from "services/collection/collectionService";
import { useState, useEffect } from "react";
import manImg from "assets/images/image-default.svg";
import fileUpload from "assets/images/file-upload.svg";
import Papa from "papaparse";
import ContributorsList from "./ContributorsList";

const ImportWalletModal = ({
  show,
  handleClose,
  collectionName,
  projectId,
  collectionId,
}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [collections, setCollections] = useState([]);
  const [contributors, setContributors] = useState();
  const [selectAll, setSelectAll] = useState(false);

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

  const handleCSV = (e) => {
    let files = e.target.files[0];
    if (files) {
      Papa.parse(files, {
        complete: function (results) {
          const data = results.data.filter((data, index) => index !== 0);
          const result = data.map((item) => ({
            wallet_address: item[0],
            royalty: item[1],
            selected: false,
          }));
          setContributors(result);
        },
      });
    }
  };

  const handleContributorSelect = (e, address) => {
    let items = contributors.map((item) => {
      if (item.wallet_address === address) {
        return {
          ...item,
          selected: true,
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

  return (
    <Modal show={show} handleClose={handleClose} width={638}>
      <h3 className="text-[30px] font-black">Import Wallet</h3>
      <p className="text-[12px]">
        Choose Collection to add member for {collectionName} Contributors
      </p>
      <p className="text-[12px] text-danger-900 w-[350px] leading-[18px] mt-0">
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
            onClick={() => setSelectedTab(1)}
          >
            <button
              className={`inline-block font-bold p-4 text-[18px] rounded-t-lg ${
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
            onClick={() => setSelectedTab(2)}
          >
            <button
              className={`inline-block p-4 font-bold text-[18px] rounded-t-lg ${
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
              {collections.map((collection) => {
                let image = collection?.assets?.find(
                  (img) => img["asset_purpose"] === "logo"
                );
                return (
                  <div className="flex items-center mb-6 cursor-pointer">
                    <img
                      src={image ? image.path : manImg}
                      className="w-[56px] h-[56px] rounded-[6px]"
                      alt="Collection"
                    />
                    <p className="text-[14px] font-bold ml-4 truncate w-[160px]">
                      {collection.name}
                    </p>
                    <p className="text-[12px] ml-8">
                      {collection?.members ? collection.members.length : 0}{" "}
                      Contributors
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          {selectedTab === 2 && (
            <div className="mt-8">
              <p className="text-[12px] mb-3">
                Choose Collection to add member for {collectionName}{" "}
                Contributors
              </p>
              {contributors?.length ? (
                <ContributorsList
                  contributors={contributors}
                  handleContributorSelect={handleContributorSelect}
                  selectAll={selectAll}
                  handleContributorSelectAll={handleContributorSelectAll}
                />
              ) : (
                <div>
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
