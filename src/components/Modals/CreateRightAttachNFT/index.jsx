import Modal from "../../Common/Modal";
import FileUploader from "components/FormUtility/FileUploader";
import Template1 from "assets/images/templates/ra-nft-1.png";
import Template2 from "assets/images/templates/ra-nft-2.png";
import Template3 from "assets/images/templates/ra-nft-3.png";
import Template4 from "assets/images/templates/ra-nft-4.png";
import Template5 from "assets/images/templates/ra-nft-5.png";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from 'swiper';
import ErrorModal from "../ErrorModal";
import styles from "./style.module.css";
import { useState, useEffect } from "react";
import {
  generateUploadkey,
  saveRightAttachedNFT,
} from "services/nft/nftService";
import { useParams } from "react-router-dom";
import axios from "axios";
import Config from "config/config";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationData } from "Slice/notificationSlice";
import { createProject } from "services/project/projectService";
import { createCollection } from "services/collection/collectionService";
import SuccessModal from "../SuccessModal";
import PublishingRANFT from "../PublishingRANFT";

const TEMPLATES = [
  { id: 0, image: Template1 },
  { id: 1, image: Template2 },
  { id: 2, image: Template3 },
  { id: 3, image: Template4 },
  { id: 4, image: Template5 },
];

const settings = {
  320: {
    slidesPerView: 2,
    spaceBetween: 15,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 15,
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 15,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 15,
  },
  1536: {
    slidesPerView: 4,
    spaceBetween: 15,
  },
};

const CreateRightAttachedNFT = ({ handleClose, show }) => {
  const [Supply, setSupply] = useState(1);
  const [Asset, setAsset] = useState();
  const [AssetPreview, setAssetPreview] = useState("");
  const [StepReview, setStepReview] = useState(false);
  const [JobId, setJobId] = useState("");
  const [ProjectID, setProjectID] = useState("");
  const [CollectionID, setCollectionID] = useState("");
  // const [Success, setSuccess] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [RANFTId, setRANFTId] = useState("");
  const [IsSubmitted, setIsSubmitted] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [step, setStep] = useState(1);
  const projectDeploy = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [fileSize, setFileSize] = useState(0);
  const [uploadingSize, setUploading] = useState(0);
  const [uploadedPercent, setUploadedPercent] = useState();

  const { id } = useParams();
  const dispatch = useDispatch();

  const handleCreateProjectOrCol = () => {
    if (!id && !ProjectID) {
      handleCreateProject();
    }

    if (id) {
      handleCreateCollection(id);
    }
  };

  useEffect(() => {
    const projectDeployStatus = projectDeploy.find(
      (x) => x.function_uuid === JobId
    );
    if (projectDeployStatus && projectDeployStatus.data) {
      const data = JSON.parse(projectDeployStatus.data);
      if (
        data.Data["assetId"] &&
        data.Data["assetId"].length > 0 &&
        data.Data["path"] &&
        data.Data["path"].length > 0
      ) {
        postRightAttachNFT(data.Data["assetId"]);
      } else {
        setErrorMsg("Right Attach NFT creation failed!");
      }
    }
  }, [projectDeploy]);

  const postRightAttachNFT = (assetId) => {
    let formData = new FormData();
    formData.append("collection_uid", CollectionID);
    formData.append("supply", Supply);
    formData.append("blockchain", "polygon");
    formData.append("asset_uid", assetId);
    saveRightAttachedNFT(formData)
      .then((resp) => {
        if (resp?.code === 0) {
          // setSuccess(true);
          setStep(2);
          setErrorMsg("");
          setStepReview(false);
          setAssetPreview("");
          setAsset();
          setSupply(1);
          setIsLoading(false);
          setRANFTId(resp?.lnft?.id);
        } else {
          setErrorMsg(resp.message);
          // setSuccess(false);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleImage = (e) => {
    setAsset(e.target.files[0]);
    setAssetPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleCreateProject = () => {
    setShowSteps(true);
    createProject()
      .then((resp) => {
        let projectId = resp?.project?.id;
        setProjectID(projectId);
        if (projectId) {
          handleCreateCollection(projectId);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg(err.message);
        setShowSteps(false);
      });
  };

  const handleCreateCollection = (projectID) => {
    setShowSteps(true);
    let data = { dao_id: projectID, collection_type: "right_attach" };
    createCollection(data)
      .then((resp) => {
        setCollectionID(resp.collection.id);
        generateKey();
      })
      .catch((err) => console.log(err));
  };

  const generateKey = () => {
    setIsLoading(true);
    const request = new FormData();
    request.append("project_uid", id ? id : ProjectID);
    generateUploadkey(request)
      .then((resp) => handleUploadNFT(resp.key))
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleUploadNFT = (key) => {
    let headers;
    headers = {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
      key: key,
    };
    const request = new FormData();
    request.append("file", Asset);
    axios({
      method: "POST",
      url: Config.FILE_SERVER_URL,
      data: request,
      headers: headers,
      onUploadProgress: function (progressEvent) {
        const { loaded, total } = progressEvent;
        setFileSize(Math.ceil(total / 1024));
        setUploading(Math.ceil(loaded / 1024));
        let percent = Math.floor((loaded * 100) / total);
        setUploadedPercent(percent);
      },
    })
      .then((response) => {
        if (response.code === 200) {
          setJobId(response["job_id"]);
          const notificationData = {
            projectId: id,
            etherscan: "",
            function_uuid: response["job_id"],
            data: "",
          };
          dispatch(getNotificationData(notificationData));
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleNext = () => {
    setIsSubmitted(true);
    if (Asset && Supply > 0) {
      setStepReview(true);
    }
  };

  const handleTemplate = (image) => {
    setAssetPreview(image);
    toDataURL(image, function (dataUrl) {
      let data = dataURLToFile(
        dataUrl,
        `Right Attached NFT-${Math.random()}.png`
      );
      setAsset(data);
      console.log(data);
    });
  };

  const dataURLToFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const toDataURL = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  };

  const handleShowStepClose = () => {
    setShowSteps(false);
  };

  return (
    <Modal width={650} show={show} handleClose={() => handleClose(false)}>
      <div>
        {/* <SuccessModal
          show={Success}
          message='You successfully Create
a Right Attached NFT!'
          subMessage='Do you want to create New NFT? if yes let’s go!'
          buttonText='Done'
          redirection={`/royality-management/${CollectionID}`}
        /> */}
        {errorMsg && (
          <ErrorModal
            title={"Right Attach NFT minting failed !"}
            message={`${errorMsg}`}
            handleClose={() => {
              setErrorMsg("");
            }}
            show={errorMsg}
          />
        )}
        {showSteps && (
          <PublishingRANFT
            handleShowStepClose={handleShowStepClose}
            show={showSteps}
            step={step}
            collectionId={CollectionID}
            fileSize={fileSize}
            sizeUploaded={uploadingSize}
            uploadedPercent={uploadedPercent}
          />
        )}
        <h3 className="text-[20px] md:text-[28px] font-black mb-5">
          Upload Right attached NFT
        </h3>
        <FileUploader
          name="nft-asset"
          label={StepReview ? "Images" : "Upload Assets"}
          handleImage={handleImage}
          preview={AssetPreview}
        />
        {IsSubmitted && !Asset ? (
          <p className="text-red-500 text-[12px] ">Asset is required</p>
        ) : null}
        {/* {!StepReview && (
          <>
            <p className='text-[16px] font-bold'>Use Template</p>
            <div className='flex items-center overflow-x-auto mt-4'>
              <Swiper breakpoints={settings} className={styles.createSwiper}>
                <div>
                  {TEMPLATES.map((template) => (
                    <SwiperSlide
                      key={template.id}
                      className={styles.daoCard}
                      onClick={() => handleTemplate(template.image)}
                    >
                      <img
                        src={template.image}
                        key={template.id}
                        alt='Template'
                        className='mr-4 w-[158px] h-[158px] rounded-[12px] object-cover'
                      />
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
            </div>
          </>
        )} */}
        <div>
          <label
            htmlFor={"ra-nft-supply"}
            class="text-[14px] text-[#303548] font-bold outline-none mb-2"
          >
            Supply
          </label>
          {StepReview ? (
            <p className="text-[12px] mt-3 text-[#303548]">{Supply}</p>
          ) : (
            <input
              id={"ra-nft-supply"}
              type="number"
              value={Supply}
              onChange={(e) => {
                if (e.target.value >= 0) {
                  setSupply(e.target.value);
                }
              }}
              class="w-full mt-3 bg-secondary rounded-[6px] text-[12px] px-[10px] py-[14px] text-text-base"
            />
          )}
          {IsSubmitted && Supply < 1 ? (
            <p className="text-red-500 text-[12px]">
              Supply should be greater than 0
            </p>
          ) : null}
        </div>
        {StepReview ? (
          <button
            onClick={handleCreateProjectOrCol}
            className={`contained-button w-full mt-6 rounded-[4px] py-2`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className={`contained-button w-full mt-6 rounded-[4px] py-2`}
          >
            Next
          </button>
        )}
      </div>
    </Modal>
  );
};

export default CreateRightAttachedNFT;
