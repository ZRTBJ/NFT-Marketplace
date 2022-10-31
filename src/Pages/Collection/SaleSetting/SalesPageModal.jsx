import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import ErrorModal from "components/Modals/ErrorModal";
import { addDays } from "date-fns";
import getUnixTime from "date-fns/getUnixTime";
import { DateRangePicker } from "rsuite";
import { setSalesPage } from "services/nft/nftService";
import {
  getExchangeRate,
  getCollections,
  getCollectionNFTs,
} from "services/collection/collectionService";
import { setNFTPrice } from "./deploy-nftPrice";
import { createProvider } from "util/smartcontract/provider";
import { createMintInstance } from "config/ABI/mint-nft";
import DropdownCreabo from "components/Commons/Dropdown";
import Matic from "assets/images/polygon.svg";
import Eth from "assets/images/eth.svg";
import Modal from "components/Commons/Modal";
import Select, { components } from "react-select";
import { createMembsrshipMintInstance } from "config/ABI/mint-membershipNFT";
import { setMemNFTPrice } from "Pages/Collection/SaleSetting/deploy-membershipNFTPrice";
import { ethers } from "ethers";
import Delete from "assets/images/trash.svg";

//TODO: in the future, 1 network can support multiple currency, please fix this
const CURRENCY = [
  { id: 5, value: "eth", label: "ETH", icon: Eth },
  { id: 80001, value: "matic", label: "MATIC", icon: Matic },
  { id: 1, value: "eth", label: "ETH", icon: Eth },
  { id: 137, value: "matic", label: "MATIC", icon: Matic },
];

const Control = ({ children, ...props }) => {
  const { value } = props.selectProps;
  let selectedValue = CURRENCY.find((item) => value?.value === item?.value);
  return (
    <components.Control {...props}>
      <div className="flex items-center w-full h-[42px]">
        <div className="user-menu-dropdown">
          <img
            src={selectedValue?.icon}
            alt={selectedValue?.label}
            className="w-[18px] h-[18px]"
          />
        </div>
        {children}
      </div>
    </components.Control>
  );
};

const SalesPageModal = ({
  projectView,
  projectId,
  handleClose,
  show,
  collectionId,
  successClose,
  collectionType,
  nftId,
  address,
  collectionName = "",
  supply,
  projectNetwork,
  setNFTShareURL,
  setMembershipNFTId,
}) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dollarValue, setDollarValue] = useState("");
  const [agree, setAgree] = useState(false);
  const [memNFTs, setMemNFTs] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [publishedCollections, setPublishedCollections] = useState([]);
  const [collectionTiers, setCollectionTiers] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({
    id: 0,
    value: "eth",
    label: "ETH",
    icon: Eth,
  });
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [date, setDate] = useState();
  const provider = createProvider();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let detail = CURRENCY.find((value) => value.id === Number(projectNetwork));
    setSelectedCurrency(detail);
  }, [projectNetwork]);

  useEffect(() => {
    if (collectionId) {
      setSelectedCollection(collectionId);
    }
  }, [collectionId]);

  useEffect(() => {
    if (nftId) {
      setSelectedTier(nftId);
    }
  }, [nftId]);

  // useEffect(() => {
  //   if (collectionType === "membership") {
  //     getCollectionNFTs(collectionId).then((resp) => {
  //       if (resp.code === 0) {
  //         let mems = resp?.lnfts.map((nft) => ({
  //           tierId: nft.id,
  //           floorPrice: ethers.utils.parseEther("0.0001"),
  //           totalSupply: nft.supply,
  //         }));
  //         setMemNFTs(mems);
  //       }
  //       console.log(resp);
  //     });
  //   }
  // }, [collectionType]);

  useEffect(() => {
    getExchangeRate().then((resp) => {
      if (resp.code === 0) {
        let value = resp?.exchange_rate?.find(
          (item) => item.coin_name === "eth"
        );
        if (watch("price")) {
          let usd = value.rate * watch("price");
          setDollarValue(usd);
        }
      }
    });
  }, [watch("price")]);

  useEffect(() => {
    if (projectId)
      getCollections("project", projectId).then((resp) => {
        if (resp.code === 0) {
          let collections = resp.data.filter(
            (item) => item.status === "published"
          );
          setPublishedCollections(collections);
        }
      });
  }, [projectId]);

  useEffect(() => {
    if (selectedCollection) {
      getCollectionNFTs(selectedCollection).then((resp) => {
        if (resp.code === 0) {
          setCollectionTiers(resp.lnfts);
        }
      });
    }
  }, [selectedCollection]);

  let currentCollection =
    selectedCollection &&
    publishedCollections.find((item) => item.id === selectedCollection);

  const onSubmit = async (data) => {
    setIsSubmitted(true);
    let type = collectionType ? collectionType : currentCollection.type;
    if (agree && date.length === 2) {
      const payload = {
        price: data?.["price"],
        startTime: getUnixTime(date?.[0]),
        endTime: getUnixTime(date?.[1]),
        reserve_EOA: data["eoa"],
        collectionType: type,
        collectionId: selectedCollection,
        nftId: nftId,
      };

      setIsLoading(true);
      try {
        const priceContract = createMintInstance(
          address ? address : currentCollection.contract_address,
          provider
        );
        const membershipPriceContract = createMembsrshipMintInstance(
          address ? address : currentCollection.contract_address,
          provider
        );

        let tiers = [
          {
            tierId: nftId,
            floorPrice: ethers.utils.parseEther(data["price"].toString()),
            totalSupply: supply,
          },
        ];

        let allTiers = selectedTiers.map((value) => {
          return {
            tierId: value.id,
            floorPrice: ethers.utils.parseEther(data["price"].toString()),
            totalSupply: value.supply,
          };
        });
        const response =
          type === "membership"
            ? await setMemNFTPrice(
              membershipPriceContract,
              provider,
              nftId ? tiers : allTiers
            )
            : await setNFTPrice(priceContract, provider, data["price"]);

        if (response?.txReceipt?.status === 1) {
          const request = new FormData();
          request.append("price", data["price"]);
          request.append("start_time", payload.startTime);
          request.append("end_time", payload.endTime);
          request.append("currency", selectedCurrency.value);
          request.append(
            "transaction_hash",
            response?.txReceipt?.transactionHash
          );
          if (allTiers.length && !nftId) {
            allTiers.map((value) =>
              handleSalesAPICall(
                type,
                selectedCollection,
                request,
                value.tierId
              )
            );
          } else {
            handleSalesAPICall(type, selectedCollection, request, nftId);
          }
        }
      } catch (err) {
        if (err.message) {
          setErrorMessage(err.message);
          setShowErrorModal(true);
          setIsLoading(false);
          setIsSubmitted(false);
        } else {
          setIsLoading(false);
          setShowErrorModal(true);
          setIsSubmitted(false);
          setErrorMessage("Setting price failed. Please try again later");
        }
      }
    }
  };

  const handleSalesAPICall = async (
    type,
    selectedCollection,
    request,
    nftId
  ) => {
    let host = window.location.origin;
    await setSalesPage(type, selectedCollection, request, nftId)
      .then((res) => {
        if (res.code === 0) {
          setIsSubmitted(false);
          successClose();
          if (type === "product") {
            setNFTShareURL(`${host}/collection-details/${selectedCollection}`);
          } else {
            setNFTShareURL(`${host}/nft-details/membership/${nftId}`);
            setMembershipNFTId(nftId);
          }
        } else {
          setErrorMessage(res.message);
          setShowErrorModal(true);
          setIsSubmitted(false);
        }
        setIsLoading(false);
        setIsSubmitted(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsSubmitted(false);
      });
  };

  const modalBodyClicked = (e) => {
    e.stopPropagation();
  };

  const handleSelectedCollection = (e) => {
    setSelectedCollection(e.target.value);
    setSelectedTiers([]);
    setSelectedTier("");
  };

  const handleSelectTier = (e) => {
    setSelectedTier(e.target.value);
    let tier = collectionTiers.find((tier) => tier.id === e.target.value);
    let tiers = [...selectedTiers, tier];
    setSelectedTiers(tiers);
  };

  const handleRemoveTier = (value) => {
    let tiers = selectedTiers.filter((tier) => tier.id !== value);
    setSelectedTier("");
    setSelectedTiers(tiers);
  };

  return (
    <>
      {isLoading ? (
        <Modal
          width={800}
          show={isLoading}
          showCloseIcon={false}
          handleClose={() => isLoading(false)}
        >
          <div className="text-center md:my-6 md:mx-16">
            <h1>We are creating the sales page for NFT</h1>
            <div className="overflow-hidden rounded-full h-4 w-full mt-4 md:mt-12 mb-8 relative animated fadeIn">
              <div className="animated-process-bar"></div>
            </div>
          </div>
        </Modal>
      ) : (
        <>
          <div
            data-toggle="modal"
            data-backdrop="static"
            data-keyboard="false"
            className={`${show ? "modal display-block" : "modal display-none"
              } z-[2] `}
          >
            <section
              onClick={(e) => modalBodyClicked(e)}
              className={
                " modal-main w-[550px] bg-white rounded-[12px] relative txtblack p-11"
              }
            >
              <i
                className="fa fa-xmark cursor-pointer text-xl absolute top-12 right-8 text-black"
                onClick={handleClose}
              ></i>
              <div>
                <h3 className="text-[28px] text-black font-black mb-8">
                  Sales page
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6 ">
                    <DropdownCreabo
                      label="Select Collection"
                      value={selectedCollection}
                      id="select-collection"
                      defaultValue={"Select a Collection"}
                      handleChange={handleSelectedCollection}
                      options={publishedCollections}
                      disabled={!projectView}
                    />
                  </div>
                  {currentCollection &&
                    currentCollection?.type === "membership" ? (
                    <div className="mb-6 ">
                      <DropdownCreabo
                        label="Select Tier"
                        defaultValue={"Select a Tier"}
                        value={selectedTier}
                        id="select-tier"
                        handleChange={handleSelectTier}
                        options={collectionTiers}
                        disabled={!projectView}
                      />
                      {selectedTiers.length ? (
                        <div className="mt-1">
                          {selectedTiers.map((tier) => (
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[16px]">{tier.name}</p>
                              <img
                                src={Delete}
                                alt="delete"
                                className="mr-1 cursor-pointer"
                                onClick={() => handleRemoveTier(tier.id)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="mb-6 ">
                    <div className="flex items-center justify-between mb-2">
                      <div className="txtblack text-[14px]">Price</div>
                      {watch("price") ? (
                        <div className="text-[12px]">
                          Powered by{" "}
                          <a
                            href="https://www.coingecko.com/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            CoinGecko
                          </a>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center w-full">
                      <div className="w-32">
                        <Select
                          components={{
                            Control,
                            IndicatorSeparator: () => null,
                          }}
                          options={CURRENCY}
                          isSearchable={false}
                          // styles={customStyles}
                          onChange={(value) => setSelectedCurrency(value)}
                          value={selectedCurrency}
                          isDisabled={true}
                        />
                      </div>
                      <div className="w-2/4 mx-1">
                        <input
                          id="price"
                          name="price"
                          defaultValue={""}
                          step="0.000000001"
                          {...register("price", {
                            required: "Price is required.",
                          })}
                          className="mt-1 rounded-[3px]"
                          //TODO: Refactor
                          style={{ height: 42 }}
                          type="number"
                          placeholder="Enter your price"
                        />
                      </div>
                      {watch("price") ? (
                        <div className="w-1/4 ml-1">
                          <p className="text-[14px]">$ {dollarValue?.toFixed(3)}</p>
                        </div>
                      ) : null}
                      {errors.price && (
                        <p className="text-red-500 text-xs font-medium">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-6 ">
                    <div className="mb-2">
                      <div className="txtblack text-[14px]">Sales Duration</div>
                    </div>
                    <DateRangePicker
                      placeholder="Select Date"
                      value={date}
                      // block={true}
                      onChange={setDate}
                      format="yyyy-MM-dd HH:mm:ss"
                      preventOverflow={false}
                      defaultOpen={false}
                      placement="auto"
                      showMeridian={true}
                      className="date-range-picker"
                    />
                  </div>
                  {/* <div className="mb-6 ">
                    <div className="flex items-center mb-2">
                      <div className="txtblack text-[14px]">
                        Reserve for specific buyer
                      </div>
                    </div>
                    <>
                      <input
                        id="eoa"
                        name="eoa"
                        disabled
                        className={`debounceInput mt-1`}
                        defaultValue={""}
                        {...register("eoa")}
                        type="text"
                        placeholder="0xfdrgj..."
                      />
                      {errors.eoa && (
                        <p className="text-red-500 text-xs font-medium">
                          {errors.eoa.message}
                        </p>
                      )}
                    </>
                  </div> */}
                  <label htmlFor="agree-terms" className="flex">
                    <input
                      type="checkbox"
                      value={agree}
                      id="agree-terms"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />
                    <p className="text-[14px] text-[#303548] ml-2">
                      I Agree with <a href="#">terms and conditions</a> about
                      sales.
                    </p>
                  </label>
                  {isSubmitted && !agree && (
                    <p className="text-red-500 text-xs font-medium">
                      Please agree to terms and conditions
                    </p>
                  )}
                  <button
                    type="submit"
                    className="!w-full mt-5 px-6 py-2 text-[14px] contained-button rounded-[4px] font-black text-white-shade-900"
                  >
                    Create Sales Page
                  </button>
                </form>
              </div>

              {showErrorModal && (
                <ErrorModal
                  handleClose={() => {
                    setShowErrorModal(false);
                    setErrorMessage(null);
                  }}
                  show={showErrorModal}
                  title={"Saving sales information failed !"}
                  message={errorMessage}
                />
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default SalesPageModal;
