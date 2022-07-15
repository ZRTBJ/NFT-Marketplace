import Modal from "components/Modal";
import ErrorModal from "components/modalDialog/ErrorModal";
import SuccessModal from "components/modalDialog/SuccessModal";
import publishModalSvg from "assets/images/modal/publishModalSvg.png";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  generateUploadkey,
  getDefinedProperties,
  saveNFT,
} from "services/nft/nftService";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getProjectDeploy } from "Slice/projectSlice";
import {
  getProjectDetailsById,
  getUserProjectListById,
} from "services/project/projectService";
import { useHistory } from "react-router-dom";
import { getFunctionStatus } from "services/websocketFunction/webSocketFunctionService";

export default function MintNFT(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const projectDeploy = useSelector((state) =>
    state?.projects?.projectDeploy ? state?.projects?.projectDeploy : []
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDefinedPropertyModal, setShowDefinedPropertyModal] =
    useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [propertyList, setPropertyList] = useState([
    {
      key: "",
      value: "",
      value_type: "string",
      display_type: "properties",
    },
  ]);
  const [definedPropertyList, setDefinedPropertyList] = useState([]);
  const [nftImage, setnftImage] = useState({ image: null, path: "" });
  const projectId = props.match.params.id;
  const [isFileError, setFileError] = useState(false);
  const [jobId, setJobId] = useState("");
  const [project, setProject] = useState({});
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [savingNFT, setSavingNFT] = useState(false);
  const [isNFTSaved, setIsNFTSaved] = useState(false);
  const [mintingfuuid, setMintingfuuid] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // file upload web socket
    const projectDeployStatus = projectDeploy.find(
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
          saveNFTDetails(data.Data["assetId"], data.Data["path"]);
        }
      } else {
        setSavingNFT(false);
      }
    }
    // mint nft web socket
    if (isNFTSaved) {
      const mintStatus = projectDeploy.find(
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
        } catch { }
      }
    }
  }, [projectDeploy]);

  useEffect(() => {
    getUserProjectList();
  }, []);

  function projectDetails(pid) {
    setIsLoading(true);
    getProjectDetailsById({ id: pid })
      .then((res) => {
        if (res.code === 0) {
          setProject(res.project);
        }
        getDefinedProperty(res.project.category_id);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function getUserProjectList() {
    let payload = {
      id: localStorage.getItem("user_id"),
      page: 1,
      perPage: 1000,
    };

    getUserProjectListById(payload).then((res) => {
      if (res && res.data) {
        const projects = res.data.filter(
          (p) => p["project_status"] === "published"
        );
        setProjectList(projects);
        setTimeout(() => {
          if (projectId && projectId != "undefined" && projectId.length > 0) {
            setSelectedProjectId(projectId);
            projectDetails(projectId);
            setValue("selectedProject", projectId);
          }
        }, 500);
        setIsLoading(false);
      }
    });
  }

  function getDefinedProperty(category_id) {
    setIsLoading(true);
    getDefinedProperties()
      .then((res) => {
        if (res && res.categories && res.categories.length > 0) {
          const category = res.categories.find((c) => c.id === category_id);
          const definedProperty = [];
          for (let attr of category.attributes) {
            const dprop = {
              key: attr["key"],
              value: "",
              value_type: attr["value_type"],
              display_type: "properties",
            };
            definedProperty.push(dprop);
          }
          setDefinedPropertyList(definedProperty);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  function nftImageChangeHandler(event) {
    try {
      const img = event.currentTarget.files[0];
      setnftImage({ image: img, path: URL.createObjectURL(img) });
      setFileError(false);
    } catch {
      setFileError(true);
    }
  }

  function genUploadKey() {
    const request = new FormData();
    request.append("project_uid", watch("selectedProject"));
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

    formdata.append("file", nftImage.image);

    axios({
      method: "POST",
      url: "http://34.102.235.130/upload",
      data: formdata,
      headers: headers,
    })
      .then((response) => {
        setJobId(response["job_id"]);
        const deployData = {
          projectId: watch("selectedProject"), // projectId,
          etherscan: "",
          function_uuid: response["job_id"],
          data: "",
        };
        dispatch(getProjectDeploy(deployData));
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  function saveNFTDetails(assetId, path) {
    setIsLoading(true);
    const request = new FormData();
    request.append("project_uuid", watch("selectedProject"));
    request.append("name", watch("name"));
    request.append("description", watch("description"));
    request.append("asset_uid", assetId);
    request.append("external_url", path);
    const attributes = [];

    // defined properties
    for (let dprop of definedPropertyList) {
      const prop = {
        key: dprop.key,
        value: dprop.value,
        value_type: dprop.value_type,
        display_type: dprop.display_type,
      };
      attributes.push(prop);
    }
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
    saveNFT(request)
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
          dispatch(getProjectDeploy(deployData));
          recheckStatus(res["function_uuid"]);
        } else {
          setIsLoading(false);
          setShowConfirmationModal(false);
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
                dispatch(getProjectDeploy(deployData));
                setShowConfirmationModal(false);
                setShowSuccessModal(true);
              } else if (
                res["fn_name"] === "createNFTBatch" &&
                res["fn_status"] === "pending"
              ) {
                recheckStatus();
              }
            }
          }
        })
        .catch((error) => { });
    }, 30000);
  }

  const onSubmit = (data) => {
    if (nftImage && nftImage.image) {
      setFileError(false);
      setShowConfirmationModal(true);
    } else {
      setFileError(true);
    }
  };

  function uploadAndSaveNFT() {
    setIsLoading(true);
    genUploadKey();
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

  function addDefinedProperty() {
    const tempProperty = [...definedPropertyList];
    tempProperty.push({
      key: "",
      value: "",
      value_type: "string",
      display_type: "properties",
    });
    setDefinedPropertyList(tempProperty);
  }

  function removeDefinedProperty(index) {
    const tempProperty = [...definedPropertyList];
    tempProperty.splice(index - 1, 1);
    setDefinedPropertyList(tempProperty);
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

  function handleOnChangeDefinedPropertyType(event, index) {
    const value = event.target.value;
    const property = definedPropertyList[index];
    property.key = value;
  }

  function handleOnChangeDefinedPropertyName(event, index) {
    const value = event.target.value;
    const property = definedPropertyList[index];
    property.value = value;
  }

  useEffect(() => {
    const selectedProjId = watch("selectedProject");
    if (selectedProjId && selectedProjId.length > 0) {
      setSelectedProjectId(selectedProjId);
      projectDetails(selectedProjId);
    }
  }, [watch("selectedProject")]);

  return (
    <div className={` ${isLoading ? "loading" : ""}`}>
      <section className="flex py-9 flex-col md:flex-row text-white">
        <div className="flex-1">
          <h3 className="mb-8">Start build your NFT</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label
                className="block text-sm font-bold font-satoshi-bold"
                htmlFor="name"
              >
                Name
              </label>
              <small className="block text-xs text-color-ass-7 mb-2">
                Fill the name for your NFT
              </small>
              <input
                className="block mb-3"
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                {...register("name", {
                  required: "Name is required.",
                })}
                defaultValue={""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-6  md:hidden ">
              <label
                className="block text-sm font-bold font-satoshi-bold"
                htmlFor="dropzone-file"
              >
                Upload Assets
              </label>
              <small className="block text-xs text-color-ass-7 mb-3">
                You can add your assets up to 1GB, you can user format
                Jpeg/Mp4/GIF/PNG/Mp3.
              </small>

              <div className="flex justify-center items-center max-w-full w-40 h-40">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col justify-center items-center w-full h-40 bg-black-shade-800 rounded-xl  cursor-pointer"
                >
                  <div className="flex flex-col justify-center items-center pt-5 pb-6">
                    {nftImage.image ? (
                      <img
                        src={nftImage.path}
                        className="rounded-xl  max-w-full w-40 h-40 object-cover"
                      />
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
                        <p className="text-xs text-primary-color-1">Computer</p>
                      </>
                    )}
                  </div>

                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="audio/mpeg3, image/*"
                    onChange={(e) => nftImageChangeHandler(e)}
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
              <label
                className="block text-sm font-bold font-satoshi-bold"
                htmlFor="description"
              >
                Description
              </label>
              <small className="block text-xs text-color-ass-7 mb-2">
                What this NFT about or story behind this NFT
              </small>

              <textarea
                className="block h-32  mb-3"
                id="description"
                name="description"
                placeholder="description"
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
              <label
                className="block text-sm font-bold font-satoshi-bold"
                htmlFor="select-project"
              >
                Select Project
              </label>
              <small className="block text-xs text-color-ass-7 mb-2">
                What this NFT about or story behind this NFT
              </small>

              <select
                value={selectedProjectId}
                id="select-project"
                name="selectedProject"
                {...register("selectedProject", {
                  required: "Select a project is required.",
                })}
              >
                <option value={""}>Select Project</option>
                {projectList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              {errors.selectedProject && (
                <p className="text-red-500 text-xs font-medium mt-2">
                  {errors.selectedProject.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-bold font-satoshi-bold"
                htmlFor="blockchain"
              >
                Blockchain
              </label>
              <small className="block text-xs text-color-ass-7 mb-2">
                Choose the blockchain you want to use for this NFT
              </small>
              <div className="icon-blockchain">
                <input
                  className="block mb-3"
                  id="blockchain"
                  name="blockchain"
                  type="text"
                  placeholder="Polygon"
                  {...register("blockchain")}
                  defaultValue={"Polygon"}
                  disabled={true}
                />
                {errors.blockchain && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.blockchain.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6 hidden md:block">
              <button type="submit" className="btn btn-primary btn-sm">
                CREATE
              </button>
            </div>
          </form>
        </div>

        <div className="w-[1px] bg-black-shade-800  mx-11 hidden md:block"></div>

        <div className="flex-1">
          <div className="mb-6 hidden md:block ">
            <label
              className="block text-sm font-bold font-satoshi-bold"
              htmlFor="dropzone-file"
            >
              Upload Assets
            </label>
            <small className="block text-xs text-color-ass-7 mb-3">
              You can add your assets up to 1GB, you can user format
              Jpeg/Mp4/GIF/PNG/Mp3.
            </small>

            <div className="flex justify-center items-center max-w-full w-40 h-40">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col justify-center items-center w-full h-40 bg-black-shade-800 rounded-xl  cursor-pointer"
              >
                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                  {nftImage.image ? (
                    <img
                      src={nftImage.path}
                      className="rounded-xl  max-w-full w-40 h-40 object-cover"
                    />
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
                      <p className="text-xs text-primary-color-1">Computer</p>
                    </>
                  )}
                </div>

                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="audio/mpeg3, image/*"
                  onChange={(e) => nftImageChangeHandler(e)}
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
            <div className="text-sm font-bold font-satoshi-bold">
              Properties
            </div>
            <small className="block text-xs text-color-ass-7 mb-2">
              Add the properties on your NFT.
            </small>

            <div className="flex py-3 border-b border-b-black-shade-800">
              <i className="fa-solid fa-star"></i>
              <div className="flex-1 px-3">
                <p className="-mt-1">Define Properties</p>
                <small className="text-color-ass-7">
                  {definedPropertyList && definedPropertyList.length > 0
                    ? `${definedPropertyList.length}+ Defined Attributes`
                    : "Add the properties on your NFT."}
                </small>
              </div>
              <i
                className="fa-regular fa-square-plus text-2xl cursor-pointer"
                onClick={() => setShowDefinedPropertyModal(true)}
              ></i>
            </div>

            <div className="flex py-3 border-b border-b-black-shade-800">
              <i className="fa-regular fa-grip-lines"></i>
              <div className="flex-1 px-3">
                <p className="-mt-1">Properties</p>
                <small className="text-color-ass-7">Add NFT properties</small>
              </div>
              <i
                className="fa-regular fa-square-plus text-2xl cursor-pointer"
                onClick={() => setShowPropertyModal(true)}
              ></i>
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
        </div>


        <div className="mb-6 text-right md:hidden">
          <button type="submit" className="btn btn-primary btn-sm">
            CREATE
          </button>
        </div>


      </section>



      <Modal
        show={showDefinedPropertyModal}
        handleClose={() => setShowDefinedPropertyModal(false)}
        height={"auto"}
        width={"564"}
      >
        <h2 className="mb-3">Add your defined Properties</h2>

        <div className="w-10/12">
          <p className="mb-4">
            Add the properties, with value , you can add more than 5 properties
          </p>
          <p className="text-color-ass-9 text-sm">Add Properties</p>
          {definedPropertyList &&
            definedPropertyList.map((property, index) => (
              <div key={`defined-properties-${index}`}>
                <div className="flex items-center mt-3">
                  <input
                    name={`type-${index}`}
                    type={"text"}
                    className="w-32"
                    defaultValue={property.key}
                    disabled={true}
                  />

                  <input
                    name={`name-${index}`}
                    type={"text"}
                    className="ml-3 w-32"
                    defaultValue={property.value}
                    onChange={(e) =>
                      handleOnChangeDefinedPropertyName(e, index)
                    }
                  />
                  {/* <i
                      className="fa-solid fa-trash cursor-pointer ml-3"
                      onClick={() => removeDefinedProperty(index)}
                    ></i> */}
                </div>
              </div>
            ))}

          {/* <div className="mt-5">
              <button
                type="button"
                className="btn btn-text-gradient"
                onClick={() => addDefinedProperty()}
              >
                Add more +
              </button>
            </div> */}

          <div className="mt-5">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowDefinedPropertyModal(false)}
            >
              SAVE
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        show={showPropertyModal}
        handleClose={() => setShowPropertyModal(false)}
        height={"auto"}
        width={"564"}
      >
        <h2 className="mb-3">Add your Properties</h2>

        <div className="w-10/12">
          <p className="mb-4">
            Add the properties, with value , you can add more than 5 properties
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

      {/* Mint popup */}
      <Modal
        show={showConfirmationModal}
        handleClose={() => setShowConfirmationModal(false)}
        height={"auto"}
        width={"864"}
      >
        <div className="text-center mt-2">
          <img className="block mx-auto" src={publishModalSvg} alt="" />
          <div className="my-4 text-xl font-bold  text-white">
            You Minting NFT for {project && project.name ? project.name : ""} ?
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="btn btn-primary btn-sm mr-4"
              onClick={(e) => {
                uploadAndSaveNFT();
              }}
            >
              <span>Mint NFT</span>
            </button>
            <button
              type="button"
              className="btn-outline-primary-gradient btn-sm"
              onClick={(e) => {
                setShowConfirmationModal(false);
              }}
            >
              <span>Back</span>
            </button>
          </div>
        </div>
      </Modal>
      {showSuccessModal && (
        <SuccessModal
          handleClose={() => {
            setShowSuccessModal(false);
            history.push(
              `/project-details/${watch("selectedProject") ? watch("selectedProject") : projectId
              }`
            );
          }}
          show={showSuccessModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          show={showErrorModal}
        />
      )}
    </div>
  );
}
