import React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Tooltip from "components/Tooltip";
import Modal from "components/Modal";
import { useForm } from "react-hook-form";
import ErrorModal from "components/modalDialog/ErrorModal";
import { generateUploadkey, saveProductNFT } from "services/nft/nftService";
import Config from "config";
import { getNotificationData } from "Slice/notificationSlice";
import { getFunctionStatus } from "services/websocketFunction/webSocketFunctionService";

export default function ProductNFT(props) {
  const audioRef = useRef();
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isLoading, setIsLoading] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [checkedValidation, setCheckedValidation] = useState(false);
  const [nftFile, setnftFile] = useState({ file: null, path: "" });
  const [errorTitle, setErrorTitle] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isFileError, setFileError] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [jobId, setJobId] = useState("");
  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [isNFTSaved, setIsNFTSaved] = useState(false);
  const [savingNFT, setSavingNFT] = useState(false);
  const [mintingfuuid, setMintingfuuid] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const projectId = "e5ac3187-2dba-4713-b049-a81249302fdd";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // file upload web socket
    const projectDeployStatus = fileUploadNotification.find(
      (x) => x.function_uuid === jobId
    );
    if (projectDeployStatus && projectDeployStatus.data) {
      const data = JSON.parse(projectDeployStatus.data);
      if (
        data.Data["assetId"] &&
        data.Data["assetId"].length > 0 &&
        data.Data["path"] &&
        data.Data["path"].length > 0
      ) {
        if (!savingNFT && !isNFTSaved) {
          setSavingNFT(true);
          saveNFTDetails(data.Data["assetId"]);
        }
      } else {
        setSavingNFT(false);
      }
    }
    // product nft web socket
    if (isNFTSaved) {
      const mintStatus = fileUploadNotification.find(
        (x) => x.function_uuid === mintingfuuid
      );
      if (mintStatus && mintStatus.data) {
        try {
          const status = JSON.parse(mintStatus.data);
          if (status["fn_name"] === "createNFTBatch") {
            const fn_response = status["fn_response_data"];
            if (fn_response["transactionStatus"] === "mined") {
              setShowConfirmationModal(false);
              setShowSuccessModal(true);
            } else {
              setShowConfirmationModal(false);
              setShowErrorModal(true);
            }
            setIsLoading(false);
          }
        } catch {}
      }
    }
  }, [fileUploadNotification]);

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

  function nftFileChangeHandler(event) {
    try {
      const file = event.currentTarget.files[0];
      const usedSize = userinfo["storage_usage"];
      let totalSize = 0;
      if (usedSize && file) {
        totalSize = (usedSize + file.size) / 1024 / 1024;
        if (file.size / 1024 > 100) {
          setErrorTitle("Maximum file size limit exceeded");
          setErrorMessage(`You can add your assets up to 100MB.`);
          setShowErrorModal(true);
          event.currentTarget.value = "";
        } else if (totalSize > 1024) {
          setErrorTitle("Maximum file size limit exceeded");
          setErrorMessage(
            `You can add your assets up to 1GB. you have a remaining of ${(
              1024 -
              usedSize / 1024 / 1024
            ).toFixed(2)} MB storage`
          );
          setShowErrorModal(true);
          event.currentTarget.value = "";
        } else {
          setnftFile({ file: file, path: URL.createObjectURL(file) });
          setFileError(false);
        }
      }
    } catch {
      setFileError(true);
    }
  }

  const onSubmit = (data) => {
    if (nftFile && nftFile.file) {
      setFileError(false);
      setIsLoading(true);
      genUploadKey();
    } else {
      setFileError(true);
    }
  };

  function genUploadKey() {
    const request = new FormData();
    generateUploadkey(request)
      .then((res) => {
        if (res.key) {
          uploadAFile(res.key);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function uploadAFile(uploadKey) {
    let headers;

    headers = {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
      key: uploadKey,
    };

    let formdata = new FormData();

    formdata.append("file", nftFile.file);

    axios({
      method: "POST",
      url: Config.FILE_SERVER_URL,
      data: formdata,
      headers: headers,
    })
      .then((response) => {
        setJobId(response["job_id"]);
        const notificationData = {
          projectId: projectId,
          etherscan: "",
          function_uuid: response["job_id"],
          data: "",
        };
        dispatch(getNotificationData(notificationData));
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  function saveNFTDetails(assetId) {
    setIsLoading(true);
    const request = new FormData();
    request.append("collection_uid", "da6738bc-9160-4911-8422-02723ceefbad");
    request.append("name", watch("name"));
    request.append("asset_uid", assetId);
    request.append("supply", watch("supply"));
    request.append("blockchain", "polygon");
    request.append("description", watch("description"));
    request.append("external_link", watch("externalLink"));
    request.append("sensitive_content", watch("sensitiveContent"));

    const attributes = [];

    // properties
    for (let aprop of propertyList) {
      if (
        aprop.key &&
        aprop.key.length > 0 &&
        aprop.value &&
        aprop.value.length > 0
      ) {
        const prop = {
          key: aprop.key,
          value: aprop.value,
          value_type: aprop.value_type,
          display_type: aprop.display_type,
        };
        attributes.push(prop);
      }
    }
    if (attributes && attributes.length > 0) {
      request.append("attributes", JSON.stringify(attributes));
    }
    saveProductNFT(request)
      .then((res) => {
        setSavingNFT(false);
        if (res["code"] === 0) {
          setMintingfuuid(res["function_uuid"]);
          setJobId("");
          setIsNFTSaved(true);
          const deployData = {
            projectId: projectId,
            function_uuid: res["function_uuid"],
            data: "",
          };
          dispatch(getNotificationData(deployData));
          recheckStatus(res["function_uuid"]);
        } else {
          setIsLoading(false);
          setShowConfirmationModal(false);
          setErrorTitle("Create NFT failed");
          setErrorMessage("Failed to create NFT. Please try again later");
          setShowSuccessModal(false);
          setShowErrorModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setSavingNFT(false);
        setIsNFTSaved(false);
        setShowConfirmationModal(false);
        setShowErrorModal(true);
      });
  }

  function recheckStatus(fuuid) {
    setTimeout(() => {
      getFunctionStatus(fuuid)
        .then((res) => {
          if (res.code === 0) {
            if (
              res["fn_name"] === "createNFTBatch" &&
              res["fn_status"] === "success"
            ) {
              if (res["fn_response_data"]["transactionStatus"] === "mined") {
                const deployData = {
                  function_uuid: fuuid,
                  data: JSON.stringify(res),
                };
                dispatch(getNotificationData(deployData));
                setShowConfirmationModal(false);
                setShowSuccessModal(true);
              }
            } else if (
              res["fn_name"] === "createNFTBatch" &&
              res["fn_status"] === "processing"
            ) {
              recheckStatus(fuuid);
            }
          }
        })
        .catch((error) => {});
    }, 30000);
  }

  return (
    <>
      {isLoading && <div className="loading"></div>}
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    className={`flex justify-center items-center max-w-full ${
                      nftFile.file?.type?.split("/")[0]?.toLowerCase() ===
                      "video"
                        ? ""
                        : "w-40 h-40"
                    }`}
                  >
                    <label
                      htmlFor={`dropzone-file`}
                      className={`flex flex-col justify-center items-center w-full  ${
                        nftFile.file?.type?.split("/")[0]?.toLowerCase() ===
                        "video"
                          ? ""
                          : "h-40"
                      } ${
                        nftFile.file ? "" : "bg-white-filled-form"
                      } rounded-xl  cursor-pointer`}
                    >
                      <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        {nftFile.file ? (
                          <>
                            {nftFile.file?.type
                              ?.split("/")[0]
                              ?.toLowerCase() === "image" && (
                              <img
                                src={nftFile.path}
                                alt="nft"
                                className="rounded-xl  max-w-full w-40 h-40 object-cover"
                              />
                            )}
                            {nftFile.file?.type
                              ?.split("/")[0]
                              ?.toLowerCase() === "audio" && (
                              <audio
                                ref={audioRef}
                                src={nftFile.path}
                                controls
                                autoPlay={false}
                                className="ml-28"
                              />
                            )}
                            {nftFile.file?.type
                              ?.split("/")[0]
                              ?.toLowerCase() === "video" && (
                              <video width="650" height="400" controls>
                                <source src={nftFile.path} type="video/mp4" />
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
                        id={`dropzone-file`}
                        type="file"
                        className="hidden"
                        accept="audio/*, image/*, video/*"
                        onChange={(e) => nftFileChangeHandler(e)}
                      />
                    </label>
                  </div>
                  {isFileError && (
                    <p className="text-red-500 text-xs font-medium mt-2">
                      Please select a vaild file.
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <div className="txtblack text-[14px]">Name</div>
                  <>
                    <input
                      id="name"
                      name="name"
                      className="debounceInput mt-1"
                      {...register("name", {
                        required: "Name is required.",
                      })}
                      defaultValue={""}
                      placeholder="Name for the NFT"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs font-medium">
                        {errors.name.message}
                      </p>
                    )}
                  </>
                </div>
                <div className="mb-6">
                  <div className="txtblack text-[14px]">External Links</div>
                  <input
                    id="externalLink"
                    name="externalLink"
                    className="debounceInput mt-1"
                    defaultValue={""}
                    {...register("externalLink", {
                      required: "External Link is required.",
                    })}
                    placeholder="https://"
                  />
                  {errors.externalLink && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.externalLink.message}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <div className="txtblack text-[14px]">Description</div>
                  <textarea
                    id="description"
                    name="description"
                    cols="30"
                    rows="6"
                    placeholder="Add brief description about this NFT"
                    {...register("description", {
                      required: "Description is required.",
                    })}
                    defaultValue={""}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.description.message}
                    </p>
                  )}
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
                      onClick={() => setShowPropertyModal(true)}
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
                        htmlFor={`sensitiveContent`}
                        className="inline-flex relative items-center cursor-pointer ml-auto"
                      >
                        <input
                          type="checkbox"
                          id={`sensitiveContent`}
                          name="sensitiveContent"
                          defaultChecked={false}
                          className="sr-only peer outline-none"
                          {...register("sensitiveContent")}
                        />
                        <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-900"></div>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 mt-2">
                    {propertyList &&
                      propertyList.map((property, index) => (
                        <div key={`view-properties-${index}`}>
                          <div className="flex items-center mt-3">
                            <input
                              name={`type-${index}`}
                              type={"text"}
                              className="w-32 bg-gray-200 disabled:cursor-not-allowed"
                              defaultValue={property.key}
                              disabled={true}
                            />

                            <input
                              name={`name-${index}`}
                              type={"text"}
                              className="ml-3 w-32 bg-gray-200 disabled:cursor-not-allowed"
                              disabled={true}
                              defaultValue={property.value}
                            />
                            <i
                              className="fa-solid fa-trash cursor-pointer ml-3 text-primary-900"
                              onClick={() => removeProperty(index)}
                            ></i>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mb-6 ">
                  <div className="flex items-center mb-2">
                    <Tooltip></Tooltip>
                    <div className="txtblack text-[14px]">Supply</div>
                  </div>
                  <>
                    <input
                      id="supply"
                      name="supply"
                      className="debounceInput mt-1"
                      defaultValue={""}
                      {...register("supply", {
                        required: "Supply Link is required.",
                      })}
                      type="number"
                      placeholder="Supply for the NFT"
                    />
                    {errors.supply && (
                      <p className="text-red-500 text-xs font-medium">
                        {errors.supply.message}
                      </p>
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
                    className="h-[44px] border border-divider text-textSubtle bg-gray-200 pl-3"
                  >
                    <option value={"polygon"} defaultValue>
                      Polygon
                    </option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="!w-full px-6 py-2 bg-primary-900 rounded font-black text-white-shade-900"
                >
                  Next
                  <i className="ml-4 fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
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
                      className="fa-solid fa-trash cursor-pointer ml-3 text-primary-900"
                      onClick={() => removeProperty(index)}
                    ></i>
                  </div>
                </div>
              ))}

            <div className="mt-5">
              <button
                type="button"
                className="btn text-primary-900 btn-sm"
                onClick={() => addProperty()}
              >
                Add more +
              </button>
            </div>

            <div className="mt-5">
              <button
                type="button"
                className="btn text-white-shade-900 bg-primary-900 btn-sm"
                onClick={() => setShowPropertyModal(false)}
              >
                SAVE
              </button>
            </div>
          </div>
        </Modal>
        {showErrorModal && (
          <ErrorModal
            handleClose={() => {
              setShowErrorModal(false);
              setErrorTitle(null);
              setErrorMessage(null);
            }}
            show={showErrorModal}
            title={errorTitle}
            message={errorMessage}
          />
        )}
      </>
    </>
  );
}
