import React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { DebounceInput } from "react-debounce-input";
import Tooltip from "components/Tooltip";
import Modal from "components/Modal";

export default function MembershipNFT() {
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isDataLoading, setDataIsLoading] = useState(false);
  const nftList = [
    {
      tierName: "",
      assets: {
        file: null,
        path: null,
        isFileError: false,
        limitExceeded: false,
      },
      nftName: "",
      externalLink: "",
      description: "",
      benefits: [{ title: "" }],
      properties: [
        {
          key: "",
          value: "",
          value_type: "string",
          display_type: "properties",
        },
      ],
      sensitiveContent: false,
      supply: "",
      isOpen: true,
      blockchainCategory: "polygon",
    },
  ];
  const [nfts, setNfts] = useState(nftList);
  const audioRef = useRef();
  const [checkedValidation, setCheckedValidation] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  function onTextfieldChange(index, fieldName, value) {
    setValue(index, fieldName, value);
  }
  function setValue(index, fieldName, value) {
    let oldNfts = [...nfts];
    oldNfts[index][fieldName] = value;
    setNfts(oldNfts);
  }
  function addMoreTier() {
    let oldNfts = [...nfts];
    oldNfts.push({
      tierName: "",
      assets: {
        file: null,
        path: null,
        isFileError: false,
        limitExceeded: false,
      },
      nftName: "",
      externalLink: "",
      description: "",
      benefits: [{ title: "" }],
      properties: [
        {
          key: "",
          value: "",
          value_type: "string",
          display_type: "properties",
        },
      ],
      sensitiveContent: false,
      supply: "",
      isOpen: true,
      blockchainCategory: "polygon",
    });
    setNfts(oldNfts);
  }
  function deleteNfs(index) {
    let oldNfts = [...nfts];
    oldNfts.splice(index, 1);
    setNfts(oldNfts);
  }
  function nftFileChangeHandler(event, index) {
    let oldNfts = [...nfts];
    const nftFile = oldNfts[index].assets;
    try {
      const file = event.currentTarget.files[0];
      const usedSize = userinfo["storage_usage"];
      let totalSize = 0;
      if (usedSize && file) {
        totalSize = (usedSize + file.size) / 1024 / 1024;
        if (totalSize > 1024) {
          nftFile.limitExceeded = true;
          event.currentTarget.value = "";
        } else {
          nftFile.file = file;
          nftFile.path = URL.createObjectURL(file);
          nftFile.isFileError = false;
        }
      }
    } catch {
      nftFile.isFileError = true;
    }
    setNfts(oldNfts);
  }
  function addMoreBenefits(index) {
    let oldNfts = [...nfts];
    oldNfts[index].benefits.push({ title: "" });
    setNfts(oldNfts);
  }
  function onBenefitChange(index, benefitIndex, value) {
    let oldNfts = [...nfts];
    oldNfts[index].benefits[benefitIndex].title = value;
    setNfts(oldNfts);
  }
  function deleteBenefits(index, benefitIndex) {
    let oldNfts = [...nfts];
    oldNfts[index].benefits.splice(benefitIndex, 1);
    setNfts(oldNfts);
  }
  function handleOnChangePropertyType(event, index) {
    const value = event.target.value;
    const property = propertyList[index];
    property.key = value;
  }
  function handleOnChangePropertyName(event, index) {
    const value = event.target.value;
    const property = propertyList[index];
    property.value = value;
  }
  function addProperty() {
    const tempProperty = [...propertyList];
    tempProperty.push({
      key: "",
      value: "",
      value_type: "string",
      display_type: "properties",
    });
    setPropertyList(tempProperty);
  }
  function removeProperty(index) {
    const tempProperty = [...propertyList];
    tempProperty.splice(index - 1, 1);
    setPropertyList(tempProperty);
  }
  function onSensitiveContentChange(index) {
    let oldNfts = [...nfts];
    oldNfts[index].sensitiveContent = !oldNfts[index].sensitiveContent;
    setNfts(oldNfts);
  }
  function openPropertyModal(index) {
    let oldNfts = [...nfts];
    setPropertyList(oldNfts[index].properties);
    setShowPropertyModal(true);
  }
  function nextHandle() {
    console.log(nfts);
  }
  return (
    <>
      {isDataLoading && <div className="loading"></div>}
      {!isDataLoading && (
        <>
          <div className="max-w-[600px] mx-auto md:mt-[40px]">
            <div className="mb-[24px]">
              <h1 className="text-[28px] font-black mb-[6px]">
                Create Membership NFT
              </h1>
              <p className="text-[14px] text-textSubtle ">
                Fill the require form to create NFT
              </p>
            </div>
            <div>
              {nfts.map((nft, index) => (
                <div
                  key={index}
                  className="mb-6 rounded-[12px]  border border-divider  p-4"
                >
                  {nfts.length > 1 && (
                    <div className="text-right">
                      <i
                        onClick={() => deleteNfs(index)}
                        className="cursor-pointer fa-solid fa-trash text-danger-1/[0.7]"
                      ></i>
                    </div>
                  )}
                  <div className="mb-6">
                    <div className="txtblack text-[14px]">Tier Name</div>
                    <>
                      <DebounceInput
                        minLength={1}
                        debounceTimeout={0}
                        className="debounceInput mt-1"
                        value={nft.tierName}
                        onChange={(e) =>
                          onTextfieldChange(index, "tierName", e.target.value)
                        }
                        placeholder="Tier name for the NFT"
                      />
                      {checkedValidation && nft.tierName === "" && (
                        <div className="validationTag">
                          Tier Name is required
                        </div>
                      )}
                    </>
                  </div>
                  <div className="mb-6">
                    <label
                      className="block text-[16px] font-bold font-satoshi-bold"
                      htmlFor="dropzone-file"
                    >
                      Upload Assets
                    </label>
                    <p className="block text-[14px] text-textSubtle mb-4">
                      You can add your assets up to 1GB, you can user format
                      Jpeg/Mp4/GIF/PNG/Mp3.
                    </p>
                    <div
                      className={`flex justify-center items-center max-w-full ${
                        nft.assets.file?.type?.split("/")[0]?.toLowerCase() ===
                        "video"
                          ? ""
                          : "w-40 h-40"
                      }`}
                    >
                      <label
                        htmlFor={`dropzone-file${index}`}
                        className={`flex flex-col justify-center items-center w-full  ${
                          nft.assets.file?.type
                            ?.split("/")[0]
                            ?.toLowerCase() === "video"
                            ? ""
                            : "h-40"
                        } ${
                          nft.assets.file ? "" : "bg-white-filled-form"
                        } rounded-xl  cursor-pointer`}
                      >
                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                          {nft.assets.file ? (
                            <>
                              {nft.assets.file?.type
                                ?.split("/")[0]
                                ?.toLowerCase() === "image" && (
                                <img
                                  src={nft.assets.path}
                                  alt="nft"
                                  className="rounded-xl  max-w-full w-40 h-40 object-cover"
                                />
                              )}
                              {nft.assets.file?.type
                                ?.split("/")[0]
                                ?.toLowerCase() === "audio" && (
                                <audio
                                  ref={audioRef}
                                  src={nft.assets.path}
                                  controls
                                  autoPlay={false}
                                  className="ml-28"
                                />
                              )}
                              {nft.assets.file?.type
                                ?.split("/")[0]
                                ?.toLowerCase() === "video" && (
                                <video width="650" height="400" controls>
                                  <source
                                    src={nft.assets.path}
                                    type="video/mp4"
                                  />
                                </video>
                              )}
                            </>
                          ) : (
                            <>
                              <svg
                                width="39"
                                height="39"
                                viewBox="0 0 39 39"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  opacity="0.4"
                                  d="M27.8167 38.5097H11.4644C5.0695 38.5097 0.773438 34.0245 0.773438 27.3479V11.9373C0.773438 5.2606 5.0695 0.77356 11.4644 0.77356H27.8186C34.2135 0.77356 38.5095 5.2606 38.5095 11.9373V27.3479C38.5095 34.0245 34.2135 38.5097 27.8167 38.5097Z"
                                  fill="#9499AE"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M18.2168 13.368C18.2168 15.9529 16.113 18.0567 13.5281 18.0567C10.9413 18.0567 8.83938 15.9529 8.83938 13.368C8.83938 10.783 10.9413 8.67737 13.5281 8.67737C16.113 8.67737 18.2168 10.783 18.2168 13.368ZM33.6045 23.5805C34.0441 24.0069 34.3592 24.4937 34.5667 25.0126C35.195 26.5824 34.8686 28.4692 34.1969 30.0239C33.4007 31.8749 31.8761 33.273 29.9554 33.8843C29.1025 34.1579 28.2082 34.2749 27.3157 34.2749H11.5024C9.92882 34.2749 8.53636 33.9089 7.39484 33.2221C6.67974 32.7919 6.55332 31.8013 7.08352 31.156C7.97031 30.0805 8.84579 29.0013 9.72882 27.9126C11.4118 25.8296 12.5458 25.2258 13.8062 25.756C14.3175 25.9748 14.8307 26.305 15.359 26.6522C16.7666 27.5843 18.7232 28.8635 21.3006 27.4749C23.0623 26.5115 24.085 24.8631 24.9751 23.4283L24.9931 23.3994C25.053 23.3033 25.1124 23.2073 25.1716 23.1116C25.4743 22.6226 25.7724 22.1409 26.1101 21.6975C26.5289 21.1484 28.0837 19.4314 30.0931 20.6541C31.3743 21.4239 32.4516 22.4654 33.6045 23.5805Z"
                                  fill="#9499AE"
                                />
                              </svg>
                              <p className="text-xs mt-2 text-color-ass-8">
                                Add Assets from
                              </p>
                              <p className="text-xs text-primary-color-1">
                                Computer
                              </p>
                            </>
                          )}
                        </div>

                        <input
                          key={index}
                          id={`dropzone-file${index}`}
                          type="file"
                          className="hidden"
                          accept="audio/*, image/*, video/*"
                          onChange={(e) => nftFileChangeHandler(e, index)}
                        />
                      </label>
                    </div>
                    {nft.assets.isFileError && (
                      <p className="validationTag">
                        Please select a valid file.
                      </p>
                    )}
                    {checkedValidation && !nft.assets.file && (
                      <p className="validationTag">Assets is required.</p>
                    )}
                    {nft.assets.limitExceeded && (
                      <p className="validationTag">
                        {`You can add your assets up to 1GB. you have a remaining of ${(
                          1024 -
                          userinfo["storage_usage"] / 1024 / 1024
                        ).toFixed(2)} MB storage`}
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <div className="txtblack text-[14px]">Name</div>
                    <>
                      <DebounceInput
                        minLength={1}
                        debounceTimeout={0}
                        className="debounceInput mt-1"
                        value={nft.nftName}
                        onChange={(e) =>
                          onTextfieldChange(index, "name", e.target.value)
                        }
                        placeholder="Name for the NFT"
                      />
                      {checkedValidation && nft.nftName === "" && (
                        <div className="validationTag">Name is required</div>
                      )}
                    </>
                  </div>
                  <div className="mb-6">
                    <div className="txtblack text-[14px]">External Links</div>
                    <>
                      <DebounceInput
                        minLength={1}
                        debounceTimeout={0}
                        className="debounceInput mt-1"
                        value={nft.externalLink}
                        onChange={(e) =>
                          onTextfieldChange(
                            index,
                            "externalLink",
                            e.target.value
                          )
                        }
                        placeholder="https://"
                      />
                    </>
                  </div>
                  <div className="mb-6">
                    <div className="txtblack text-[14px]">Description</div>
                    <textarea
                      value={nft.description}
                      onChange={(e) =>
                        onTextfieldChange(index, "description", e.target.value)
                      }
                      name="description"
                      id="description"
                      cols="30"
                      rows="6"
                      placeholder="Add brief description about this NFT"
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <div className="txtblack text-[14px]">Benefit</div>
                    {nft.benefits.map((benefit, benefitIndex) => (
                      <div
                        className="mb-6 flex items-center"
                        key={benefitIndex}
                      >
                        <DebounceInput
                          minLength={1}
                          debounceTimeout={0}
                          className="debounceInput mt-1"
                          value={benefit.title}
                          onChange={(e) =>
                            onBenefitChange(index, benefitIndex, e.target.value)
                          }
                          placeholder="https://"
                        />
                        {nft.benefits.length > 1 && (
                          <div className="ml-4">
                            <i
                              onClick={() =>
                                deleteBenefits(index, benefitIndex)
                              }
                              className="cursor-pointer fa-solid fa-trash text-danger-1/[0.7]"
                            ></i>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addMoreBenefits(index)}
                      className="h-[43px] mb-4 mr-4 px-4 py-2 text-[14px]  bg-primary-900/[.20] font-black  rounded text-primary-900   "
                    >
                      Add More Benefit
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="text-txtblack font-bold ">Properties</div>
                    <div className="text-textSubtle text-[14px] mb-[16px]">
                      Add the properties on your NFT.
                    </div>
                    <div className="flex py-3 border-b border-b-divider">
                      <i className="fa-regular fa-grip-lines"></i>
                      <div className="flex-1 px-3">
                        <p className="-mt-1">Properties</p>
                        <small className="text-textSubtle">
                          Add NFT properties
                        </small>
                      </div>
                      <i
                        className="fa-regular fa-square-plus text-2xl text-primary-900 cursor-pointer"
                        onClick={() => openPropertyModal(index)}
                      ></i>
                    </div>
                    <div className="flex py-3 border-b border-b-divider">
                      <p className="text-txtblack text-[18px] font-black">
                        18+
                      </p>
                      <div className="flex-1 px-3">
                        <p className="-mt-1">Sensitive Content</p>
                        <small className="text-textSubtle">
                          Defined properties on your NFT
                        </small>
                      </div>
                      <div className="flex flex-wrap items-center">
                        <label
                          htmlFor={`checked-toggle-${index}`}
                          className="inline-flex relative items-center cursor-pointer ml-auto"
                        >
                          <input
                            type="checkbox"
                            value={nft.sensitiveContent}
                            id={`checked-toggle-${index}`}
                            checked={nft.sensitiveContent}
                            className="sr-only peer outline-none"
                            onChange={(e) =>
                              onSensitiveContentChange(
                                index,
                                nft.sensitiveContent
                              )
                            }
                          />
                          <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-900"></div>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-2">
                      {propertyList &&
                        propertyList.map((property, index) => (
                          <>
                            {property.key.length > 0 && property.value.length && (
                              <div
                                key={`properties-${index}`}
                                className="place-content-center"
                              >
                                <div className="h-16 w-24 border rounded text-center  p-2">
                                  <p className="text-primary-color-1 font-semibold">
                                    {property.key}
                                  </p>
                                  <p className="text-sm">{property.value}</p>
                                </div>
                              </div>
                            )}
                          </>
                        ))}
                    </div>
                  </div>

                  <div className="mb-6 ">
                    <div className="flex items-center mb-2">
                      <Tooltip></Tooltip>
                      <div className="txtblack text-[14px]">Supply</div>
                    </div>
                    <>
                      <DebounceInput
                        minLength={1}
                        debounceTimeout={0}
                        className="debounceInput mt-1"
                        value={nft.supply}
                        type="number"
                        onChange={(e) =>
                          onTextfieldChange(index, "supply", e.target.value)
                        }
                        placeholder="Supply for the NFT"
                      />
                      {checkedValidation && nft.supply === "" && (
                        <div className="validationTag">Supply is required</div>
                      )}
                    </>
                  </div>
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center">
                      <Tooltip></Tooltip>
                      <div className="txtblack text-[14px] mb-[6px]">
                        Blockchain
                      </div>
                    </div>
                    <select
                      value={nft.blockchainCategory}
                      disabled
                      className="h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3"
                    >
                      <option value={nft.blockchainCategory} defaultValue>
                        Polygon
                      </option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="my-6 md:flex">
              <button
                onClick={addMoreTier}
                className="h-[43px] mb-4 mr-4 px-6 py-2 bg-primary-900/[.20] font-black  rounded text-primary-900   "
              >
                Add More Tier
              </button>
              <button
                onClick={nextHandle}
                className="h-[43px] px-6 py-2 bg-primary-900 rounded font-black text-white-shade-900   md:ml-auto"
              >
                Next
              </button>
            </div>
          </div>
          <Modal
            show={showPropertyModal}
            handleClose={() => setShowPropertyModal(false)}
            height={"auto"}
            width={"564"}
          >
            <h2 className="mb-3">Add your Properties</h2>

            <div className="w-10/12">
              <p className="mb-4">
                Add the properties, with value , you can add more than 5
                properties
              </p>
              <p className="text-color-ass-9 text-sm">Add Properties</p>
              {propertyList &&
                propertyList.map((property, index) => (
                  <div key={`properties-${index}`}>
                    <div className="flex items-center mt-3">
                      <input
                        name={`type-${index}`}
                        type={"text"}
                        className="w-32"
                        defaultValue={property.key}
                        onChange={(e) => handleOnChangePropertyType(e, index)}
                      />

                      <input
                        name={`name-${index}`}
                        type={"text"}
                        className="ml-3 w-32"
                        defaultValue={property.value}
                        onChange={(e) => handleOnChangePropertyName(e, index)}
                      />
                      <i
                        className="fa-solid fa-trash cursor-pointer ml-3"
                        onClick={() => removeProperty(index)}
                      ></i>
                    </div>
                  </div>
                ))}

              <div className="mt-5">
                <button
                  type="button"
                  className="btn btn-text-gradient"
                  onClick={() => addProperty()}
                >
                  Add more +
                </button>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowPropertyModal(false)}
                >
                  SAVE
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
}
