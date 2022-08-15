import { useState, useCallback, useEffect } from "react";
import "assets/css/CreateProject/mainView.css";
import { checkUniqueProjectName } from "services/project/projectService";
import Outline from "components/DraftProjectUpdate/Outline";
import Confirmation from "components/DraftProjectUpdate/Confirmation";
import {
  createProject,
  updateProject,
  getProjectDetailsById,
  deleteAssetsOfProject,
} from "services/project/projectService";
import ErrorModal from "components/modalDialog/ErrorModal";
import SuccessModal from "components/modalDialog/SuccessModal";
import { getProjectCategory } from "services/project/projectService";

export default function ProjectCreate() {
  // Logo start
  // logo is the cover photo
  const [logoPhoto, setLogoPhoto] = useState([]);
  const [logoPhotoUrl, setLogoPhotoUrl] = useState("");
  const onLogoPhotoSelect = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      setLogoPhoto(acceptedFiles);
      let objectUrl = URL.createObjectURL(acceptedFiles[0]);
      let logoPhotoInfo = {
        path: objectUrl,
      };
      setLogoPhotoUrl(logoPhotoInfo);
      setoutlineKey((pre) => pre + 1);
    }
  }, []);
  function onLogoPhotoRemove() {
    if (logoPhotoUrl.id) {
      let payload = {
        projectId: projectInfo.id,
        assetsId: logoPhotoUrl.id,
      };
      deleteAssetsOfProject(payload).then((e) => {
        setLogoPhoto([]);
        setLogoPhotoUrl("");
      });
    } else {
      setLogoPhoto([]);
      setLogoPhotoUrl("");
    }
  }
  // Logo End

  // Project Name start
  const [projectName, setProjectName] = useState("");
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);
  const [projectNameDisabled, setProjectNameDisabled] = useState(false);
  async function onProjectNameChange(e) {
    let payload = {
      projectName: e,
    };
    setProjectName(payload.projectName);
    await checkUniqueProjectName(payload)
      .then((e) => {
        if (e.code === 0) {
          setemptyProjectName(false);
          setAlreadyTakenProjectName(false);
        } else {
          setAlreadyTakenProjectName(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // Project Name End

  // Dao symbol start
  const [daoSymbol, setDaoSymbol] = useState("");
  const [emptyDaoSymbol, setEmptyDaoSymbol] = useState(false);
  const [daoSymbolDisable, setDaoSymbolDisable] = useState(false);
  async function onDaoSymbolChange(e) {
    setDaoSymbol(e);
    setEmptyDaoSymbol(false);
  }
  // Dao symbol End

  // Dao symbol start
  const [daoWallet, setDaoWallet] = useState("");
  const [emptyDaoWallet, setEmptyDaoWallet] = useState(false);
  const [daoWalletDisable, setDaoWalletDisable] = useState(false);
  async function onDaoWalletChange(e) {
    setDaoWallet(e);
    setEmptyDaoWallet(false);
  }
  // Dao symbol End

  // overview start
  const [overview, setOverview] = useState("");
  function onOverviewChange(e) {
    setOverview(e.target.value);
  }
  // overview End

  // photos start
  const [photosLengthFromResponse, setPhotosLengthFromResponse] = useState(0);
  const [remainingPhotosName, setRemainingPhotosName] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photosUrl, setPhotosUrl] = useState([]);
  const onPhotosSelect = useCallback((params, photos) => {
    if (photosLengthFromResponse + params.length > 4) {
      alert("Maxmimum 4 photos");
    } else {
      let totalSize = 0;
      params.forEach((element) => {
        totalSize = totalSize + element.size;
      });
      if (totalSize > 16000000) {
        alert("Size Exceed");
      } else {
        let objectUrl = [];
        params.forEach((element) => {
          objectUrl.push({
            name: element.name,
            path: URL.createObjectURL(element),
          });
        });
        let megred = [...photos, ...objectUrl];
        setPhotosUrl(megred);
        setPhotos(params);
      }
    }
  }, []);
  async function onPhotosRemove(i) {
    if (i.id) {
      let payload = {
        projectId: projectInfo.id,
        assetsId: i.id,
      };
      await deleteAssetsOfProject(payload).then((e) => {
        setUpPhotos();
      });
    } else {
      setPhotosUrl(photosUrl.filter((x) => x.name !== i.name));
    }
  }
  async function setUpPhotos() {
    let payload = {
      id: projectInfo.id,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      let photosInfoData = response.assets.filter(
        (x) => x.asset_purpose === "subphoto"
      );
      setPhotosLengthFromResponse(photosInfoData.length);
      setPhotosUrl(photosInfoData);
      let constPhotosName = ["img1", "img2", "img3", "img4"];
      let photosname = [];
      photosname = photosInfoData.map((e) => {
        return e.name;
      });
      let remainingPhotosName = constPhotosName.filter(function (v) {
        return !photosname.includes(v);
      });
      setRemainingPhotosName(remainingPhotosName);
    });
  }
  // Photos End

  // webLinks start
  const links = [
    { title: "linkInsta", icon: "instagram", value: "" },
    { title: "linkGithub", icon: "github", value: "" },
    { title: "linkTwitter", icon: "twitter", value: "" },
    { title: "linkFacebook", icon: "facebook", value: "" },
    { title: "customLinks1", icon: "link", value: "" },
  ];
  const [webLinks, setWebLinks] = useState(links);
  function onSocialLinkChange(url, index) {
    let oldLinks = [...webLinks];
    oldLinks[index].value = url;
    setWebLinks(oldLinks);
  }
  // webLinks end

  // category start
  const [projectCategory, setProjectCategory] = useState("");
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  const [projectCategoryName, setProjectCategoryName] = useState("");
  function onProjectCategoryChange(event) {
    setProjectCategory(event.target.value);
    setEmptyProjectCategory(false);
    const categoryName = projectCategoryList.find(
      (x) => x.id === parseInt(event.target.value)
    );

    setProjectCategoryName(categoryName ? categoryName.name : "");
  }
  // category end

  // Blockchain start
  const [blockchainCategory, setBlockchaainCategory] = useState("polygon");
  // Blockchain end

  const [outlineKey, setoutlineKey] = useState(0);
  const [currentStep, setcurrentStep] = useState([1]);
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectStatus, setProjectStatus] = useState("");

  const [isDataLoading, setDataIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});
  const [projectCategoryList, setProjectCategoryList] = useState([]);

  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }

  async function createBlock(id) {
    setDataIsLoading(true);
    id = await createNewProject();
    await updateExistingProject(id);
    await projectDetails(id);
    setDataIsLoading(false);
    setShowSuccessModal(true);
  }
  async function updateBlock(id) {
    setDataIsLoading(true);
    await updateExistingProject(id);
    await projectDetails(id);
    setDataIsLoading(false);
    setShowSuccessModal(true);
  }
  async function saveDraft() {
    // outline
    if (currentStep.length === 2) {
      if (
        projectName !== "" &&
        daoSymbol !== "" &&
        daoWallet !== "" &&
        projectCategory !== "" &&
        alreadyTakenProjectName === false
      ) {
        let id = "";
        if (!projectCreated) {
          await createBlock(id);
        } else if (projectCreated && projectId !== "") {
          console.log(projectId);
          await updateBlock(projectId);
        }
      }
    }
  }
  async function createNewProject() {
    let createPayload = {
      name: projectName,
      category_id: projectCategory,
    };

    let projectId = "";
    await createProject(createPayload)
      .then((res) => {
        if (res.code === 4003) {
          setAlreadyTakenProjectName(true);
          setcurrentStep([1]);
          window.scrollTo(0, 0);
        } else if (res.code === 0) {
          projectId = res.project.id;
          setProjectCreated(true);
          setProjectId(projectId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return projectId;
  }
  async function updateExistingProject(id) {
    let updatePayload = {
      logo: logoPhoto.length > 0 ? logoPhoto[0] : null,
      name: projectName,
      daoSymbol: daoSymbol,
      daoWallet: daoWallet,
      overview: overview,
      photos: photos.length > 0 ? photos : null,
      photosLengthFromResponse: photosLengthFromResponse,
      remainingPhotosName: remainingPhotosName,
      webLinks: JSON.stringify(webLinks),
      category_id: projectCategory,
      blockchainCategory: blockchainCategory,
      id: id,
    };
    await updateProject(updatePayload);
  }
  async function projectDetails(id) {
    let payload = {
      id: id ? id : projectId,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      console.log(response);
      // setProjectInfo(e.project);
      // setProjectStatus(response.project_status);

      // let cover = response.assets.find((x) => x.asset_purpose === "cover");
      // setLogoPhotoUrl(cover ? cover : "");
      // let photosInfoData = response.assets.filter(
      //   (x) => x.asset_purpose === "subphoto"
      // );
      // setPhotosLengthFromResponse(photosInfoData.length);
      // setPhotosUrl(photosInfoData);
      // let constPhotosName = ["img1", "img2", "img3", "img4"];
      // let photosname = [];
      // photosname = photosInfoData.map((e) => {
      //   return e.name;
      // });
      // let remainingPhotosName = constPhotosName.filter(function (v) {
      //   return !photosname.includes(v);
      // });
      // setRemainingPhotosName(remainingPhotosName);
    });
  }
  function handelClickNext() {
    // outline
    if (currentStep.length === 1) {
      if (projectName === "") {
        setemptyProjectName(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (daoSymbol === "") {
        setEmptyDaoSymbol(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (daoWallet === "") {
        setEmptyDaoWallet(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else if (
        projectName !== "" &&
        daoSymbol !== "" &&
        daoWallet !== "" &&
        projectCategory !== "" &&
        alreadyTakenProjectName === false
      ) {
        const payload = {
          cover: logoPhoto.length > 0 ? logoPhoto[0] : null,
          name: projectName,
          daoSymbol: daoSymbol,
          daoWallet: daoWallet,
          overview: overview,
          photos: photos.length > 0 ? photos : null,
          photosLengthFromResponse: photosLengthFromResponse,
          remainingPhotosName: remainingPhotosName,
          webLinks: JSON.stringify(webLinks),
          category_id: projectCategory,
          blockchainCategory: blockchainCategory,
          // tags: tagList.toString(),
          // roles: roleList.toString(),

          // token_name: tokenName,
          // token_symbol: tokenSymbol,
          // token_amount_total: numberOfTokens,
        };
        console.log(payload);
        setcurrentStep([1, 2]);
      }
    }
  }
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);

  return (
    <>
      {isDataLoading && <div className="loading"></div>}
      <div className="txtblack dark:text-white max-w-[600px] mx-auto md:mt-[40px]">
        <div className="create-project-container">
          {currentStep.length === 1 && (
            <div>
              <h1 className="text-[28px] font-black mb-[6px]">
                Create New DAO
              </h1>
              <p className="text-[14px] text-textSubtle mb-[24px]">
                Fill the require form to create dao
              </p>
              <Outline
                key={outlineKey}
                // logo
                logoLabel="DAO Logo"
                logoPhotoUrl={logoPhotoUrl}
                onLogoPhotoSelect={onLogoPhotoSelect}
                onLogoPhotoRemove={onLogoPhotoRemove}
                // name
                nameLabel="DAO Name"
                projectName={projectName}
                emptyProjectName={emptyProjectName}
                alreadyTakenProjectName={alreadyTakenProjectName}
                projectNameDisabled={projectNameDisabled}
                onProjectNameChange={onProjectNameChange}
                // Dao symbol
                showDaoSymbol={true}
                daoSymbol={daoSymbol}
                emptyDaoSymbol={emptyDaoSymbol}
                onDaoSymbolChange={onDaoSymbolChange}
                daoSymbolDisable={daoSymbolDisable}
                // Dao Wallet
                showDaoWallet={true}
                daoWallet={daoWallet}
                emptyDaoWallet={emptyDaoWallet}
                daoWalletDisable={daoWalletDisable}
                onDaoWalletChange={onDaoWalletChange}
                // overview
                overview={overview}
                onOverviewChange={onOverviewChange}
                //photos
                showPhotos={true}
                photosUrl={photosUrl}
                onPhotosSelect={onPhotosSelect}
                onPhotosRemove={onPhotosRemove}
                // cover
                showCover={false}
                // Royalties
                showRoyalties={false}
                // webLinks
                webLinks={webLinks}
                onSocialLinkChange={onSocialLinkChange}
                // category
                projectCategory={projectCategory}
                emptyProjeCtCategory={emptyProjeCtCategory}
                onProjectCategoryChange={onProjectCategoryChange}
                blockchainCategory={blockchainCategory}
                // Freeze metadata
                showFreezeMetadata={false}
              />
            </div>
          )}
          {currentStep.length === 2 && (
            <Confirmation
              key={outlineKey}
              // logo
              logoLabel="DAO Logo"
              logoPhotoUrl={logoPhotoUrl}
              // name
              nameLabel="DAO Name"
              projectName={projectName}
              // Dao symbol
              showDaoSymbol={true}
              daoSymbol={daoSymbol}
              // Dao Wallet
              showDaoWallet={true}
              daoWallet={daoWallet}
              // overview
              overview={overview}
              //photos
              showPhotos={true}
              photosUrl={photosUrl}
              // cover
              showCover={false}
              // royalties
              showRoyalties={false}
              // webLinks
              webLinks={webLinks}
              // category
              projectCategoryName={projectCategoryName}
              blockchainCategory={blockchainCategory}
              showFreezeMetadata={false}
            />
          )}
        </div>
        <div className="mb-6">
          <div className="flex">
            {projectStatus !== "publishing" && (
              <>
                {currentStep.length > 1 && (
                  <button
                    className="bg-primary-900/[0.10] text-primary-900 px-3 font-black"
                    onClick={() => handelClickBack()}
                  >
                    <i className="fa-regular fa-angle-left"></i> Back
                  </button>
                )}
                {currentStep.length === 1 && (
                  <button
                    className="btn text-white-shade-900 bg-primary-900 btn-sm"
                    onClick={() => handelClickNext()}
                  >
                    Next <i className="fa-regular fa-angle-right ml-1"></i>
                  </button>
                )}
                {currentStep.length > 1 && projectStatus !== "published" && (
                  <button
                    onClick={() => saveDraft("public")}
                    className={`btn text-white-shade-900 bg-primary-900 btn-sm ml-auto`}
                  >
                    Submit
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal
          handleClose={() => setShowSuccessModal(false)}
          show={showSuccessModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          show={showErrorModal}
        />
      )}
    </>
  );
}
