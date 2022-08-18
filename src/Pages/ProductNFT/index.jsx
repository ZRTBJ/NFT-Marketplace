import React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { DebounceInput } from "react-debounce-input";
import Tooltip from "components/Tooltip";
import Modal from "components/Modal";

export default function ProductNFT() {
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isDataLoading, setDataIsLoading] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [checkedValidation, setCheckedValidation] = useState(false);

  function setValue(index, fieldName, value) {
    // let oldNfts = [...nfts];
    // oldNfts[index][fieldName] = value;
    // setNfts(oldNfts);
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

  function handleOnChangePropertyName(event, index) {
    const value = event.target.value;
    const property = propertyList[index];
    property.value = value;
  }

  function handleOnChangePropertyType(event, index) {
    const value = event.target.value;
    const property = propertyList[index];
    property.key = value;
  }

  function onTextfieldChange(fieldName, value) {
    setValue(fieldName, value);
  }

  return (
    <>
      {isDataLoading && <div className="loading"></div>}
      {!isDataLoading && (
        <>
          <div className="max-w-[600px] mx-auto md:mt-[40px]">
            <div className="mb-[24px]">
              <h1 className="text-[28px] font-black mb-[6px]">
                Create Product NFT
              </h1>
              <p className="text-[14px] text-textSubtle ">
                Please fill this require Data for Setup yout NFT
              </p>
            </div>
            <div>
              <div className="mb-6 rounded-[12px]  border border-divider  p-4">
                <div className="mb-6">
                  <label
                    className="block text-[16px] font-bold font-satoshi-bold"
                    htmlFor="dropzone-file"
                  >
                    Upload Assets
                  </label>
                  <p className="block text-[14px] text-textSubtle mb-4">
                    you can use format PNG, GIF, WEBP, MP4 or MP3. Max 100MB.
                  </p>
                  <div
                  // className={`flex justify-center items-center max-w-full ${
                  //   nft.assets.file?.type?.split("/")[0]?.toLowerCase() ===
                  //   "video"
                  //     ? ""
                  //     : "w-40 h-40"
                  // }`}
                  >
                    <label
                      htmlFor={`dropzone-file`}
                      // className={`flex flex-col justify-center items-center w-full  ${
                      //   nft.assets.file?.type
                      //     ?.split("/")[0]
                      //     ?.toLowerCase() === "video"
                      //     ? ""
                      //     : "h-40"
                      // } ${
                      //   nft.assets.file ? "" : "bg-white-filled-form"
                      // } rounded-xl  cursor-pointer`}
                    >
                      <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        {/* {nft.assets.file ? (
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
                        ) :  */}
                        (
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
                        ){/* } */}
                      </div>

                      <input
                        id={`dropzone-file`}
                        type="file"
                        className="hidden"
                        accept="audio/*, image/*, video/*"
                        // onChange={(e) => nftFileChangeHandler(e, index)}
                      />
                    </label>
                  </div>
                  {/* {nft.assets.isFileError && (
                    <p className="validationTag">Please select a valid file.</p>
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
                  )} */}
                </div>
                <div className="mb-6">
                  <div className="txtblack text-[14px]">Name</div>
                  <>
                    <DebounceInput
                      minLength={1}
                      debounceTimeout={0}
                      className="debounceInput mt-1"
                      value={""}
                      onChange={(e) =>
                        onTextfieldChange("name", e.target.value)
                      }
                      placeholder="Name for the NFT"
                    />
                    {/* {checkedValidation && nft.nftName === "" && (
                      <div className="validationTag">Name is required</div>
                    )} */}
                  </>
                </div>
                <div className="mb-6">
                  <div className="txtblack text-[14px]">External Links</div>
                  <>
                    <DebounceInput
                      minLength={1}
                      debounceTimeout={0}
                      className="debounceInput mt-1"
                      value={""}
                      onChange={(e) =>
                        onTextfieldChange("externalLink", e.target.value)
                      }
                      placeholder="https://"
                    />
                  </>
                </div>
                <div className="mb-6">
                  <div className="txtblack text-[14px]">Description</div>
                  <textarea
                    value="" // {nft.description}
                    onChange={(e) =>
                      onTextfieldChange("description", e.target.value)
                    }
                    name="description"
                    id="description"
                    cols="30"
                    rows="6"
                    placeholder="Add brief description about this NFT"
                  ></textarea>
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
                      // onClick={() => openPropertyModal(index)}
                    ></i>
                  </div>
                  <div className="flex py-3 border-b border-b-divider">
                    <p className="text-txtblack text-[18px] font-black">18+</p>
                    <div className="flex-1 px-3">
                      <p className="-mt-1">Sensitive Content</p>
                      <small className="text-textSubtle">
                        Defined properties on your NFT
                      </small>
                    </div>
                    <div className="flex flex-wrap items-center">
                      <label
                        htmlFor={`checked-toggle`}
                        className="inline-flex relative items-center cursor-pointer ml-auto"
                      >
                        <input
                          type="checkbox"
                          value={""}
                          id={`checked-toggle`}
                          checked={""}
                          className="sr-only peer outline-none"
                          // onChange={(e) =>
                          //   onSensitiveContentChange(
                          //     index,
                          //     nft.sensitiveContent
                          //   )
                          // }
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
                      value={""}
                      type="number"
                      onChange={(e) =>
                        onTextfieldChange("supply", e.target.value)
                      }
                      placeholder="Supply for the NFT"
                    />
                    {checkedValidation && (
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
                    defaultValue={"polygon"}
                    disabled
                    className="h-[44px] border border-divider text-textSubtle bg-white-shade-900 pl-3"
                  >
                    <option value={"polygon"} defaultValue>
                      Polygon
                    </option>
                  </select>
                </div>
                <button
                  type="button"
                  className="!w-full px-6 py-2 bg-primary-900 rounded font-black text-white-shade-900"
                >
                  Next
                  <i className="ml-4 fa-solid fa-arrow-right"></i>
                </button>
              </div>
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
