import React from "react";
import { useState, useCallback, useEffect } from "react";
import "assets/css/CreateProject/mainView.css";
import { checkUniqueCollectionName } from "services/collection/collectionService";
import Outline from "components/DraftProjectUpdate/Outline";
import Confirmation from "components/DraftProjectUpdate/Confirmation";
import {
  deleteAssetsOfProject,
  mockCreateProject,
} from "services/project/projectService";
import {
  createCollection,
  updateCollection,
  getCollectionDetailsById,
} from "services/collection/collectionService";
import ErrorModal from "components/modalDialog/ErrorModal";
import SuccessModal from "components/modalDialog/SuccessModal";
import { getProjectCategory } from "services/project/projectService";
import { useLocation } from "react-router-dom";

export default function CollectionCreate() {
  // logo start
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
      setoutlineKey(1);
    }
  }, []);
  function onLogoPhotoRemove() {
    if (coverPhotoUrl.id) {
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

  // cover start
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const onCoverPhotoSelect = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      setCoverPhoto(acceptedFiles);
      let objectUrl = URL.createObjectURL(acceptedFiles[0]);
      let coverPhotoInfo = {
        path: objectUrl,
      };
      setCoverPhotoUrl(coverPhotoInfo);
      setoutlineKey(1);
    }
  }, []);
  function onCoverPhotoRemove() {
    if (coverPhotoUrl.id) {
      let payload = {
        projectId: projectInfo.id,
        assetsId: coverPhotoUrl.id,
      };
      deleteAssetsOfProject(payload).then((e) => {
        setCoverPhoto([]);
        setCoverPhotoUrl("");
      });
    } else {
      setCoverPhoto([]);
      setCoverPhotoUrl("");
    }
  }
  // cover End

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
    await checkUniqueCollectionName(payload)
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

  // overview start
  const [overview, setOverview] = useState("");
  function onOverviewChange(e) {
    setOverview(e.target.value);
  }
  // overview End

  // Royalties start
  const [royaltiesDisable, setRoyaltiesDisable] = useState(false);
  const [primaryRoyalties, setPrimaryRoyalties] = useState(0);
  const [secondaryRoyalties, setSecondaryRoyalties] = useState(0);
  function onPrimaryRoyaltiesChange(royalties) {
    setPrimaryRoyalties(royalties);
  }
  function onSecondaryRoyaltiesChange(royalties) {
    setSecondaryRoyalties(royalties);
  }
  // Royalties End

  // webLinks start
  const links = [
    { title: "linkInsta", icon: "instagram", value: "" },
    { title: "linkReddit", icon: "reddit", value: "" },
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

  // Freeze MetaData start
  const [isMetaDaFreezed, setIsMetaDataFreezed] = useState(false);
  const [freezeMetadataDisabled, setFreezeMetadataDisabled] = useState(false);
  function onMetadataFreezeChange(data) {
    console.log(data);
    setIsMetaDataFreezed((o) => !o);
  }
  // Freeze MetaData end

  const [outlineKey, setoutlineKey] = useState(0);
  let query = useQuery();

  const [currentStep, setcurrentStep] = useState([1]);
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [isDataLoading, setDataIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  const [dao_id, setDao_id] = useState(null);

  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }
  async function createBlock(id) {
    setDataIsLoading(true);
    if (query.get("dao_id")) {
      id = await createNewProject(dao_id);
      await updateExistingProject(id);
      await projectDetails(id);
    } else {
      const dao_id = await daoCreate();
      id = await createNewProject(dao_id);
      await updateExistingProject(id);
      await projectDetails(id);
    }
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
        projectCategory !== "" &&
        alreadyTakenProjectName === false
      ) {
        let id = "";
        if (!projectCreated) {
          await createBlock(id);
        } else if (projectCreated && projectId !== "") {
          await updateBlock(projectId);
        }
      }
    }
  }
  async function createNewProject(dao_id) {
    let createPayload = {
      name: projectName,
      dao_id: dao_id,
      collection_type: "membership",
    };

    let projectId = "";
    await createCollection(createPayload)
      .then((res) => {
        if (res.code === 0) {
          projectId = res.collection.id;
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
      overview: overview,
      cover: coverPhoto.length > 0 ? coverPhoto[0] : null,
      primaryRoyalties: primaryRoyalties,
      secondaryRoyalties: secondaryRoyalties,
      webLinks: JSON.stringify(webLinks),
      category_id: projectCategory,
      blockchainCategory: blockchainCategory,
      isMetaDaFreezed: isMetaDaFreezed,
      id: id,
    };
    await updateCollection(updatePayload);
  }
  async function projectDetails(id) {
    let payload = {
      id: id ? id : projectId,
    };
    await getCollectionDetailsById(payload).then((e) => {
      console.log(e);

      // setProjectInfo(e.project);
      // setProjectStatus(response.project_status);
      // let cover = response.assets.find((x) => x.asset_purpose === "cover");
      // setCoverPhotoUrl(cover ? cover : "");
      // let photosInfoData = response.assets.filter(
      //   (x) => x.asset_purpose === "subphoto"
      // );

      // let constPhotosName = ["img1", "img2", "img3", "img4"];
      // let photosname = [];
      // photosname = photosInfoData.map((e) => {
      //   return e.name;
      // });
      // let remainingPhotosName = constPhotosName.filter(function (v) {
      //   return !photosname.includes(v);
      // });
    });
  }
  function handelClickNext() {
    // outline
    if (currentStep.length === 1) {
      if (projectName === "") {
        setemptyProjectName(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else if (
        projectName !== "" &&
        projectCategory !== "" &&
        alreadyTakenProjectName === false
      ) {
        const payload = {
          logo: logoPhoto.length > 0 ? logoPhoto[0] : null,
          name: projectName,
          overview: overview,
          cover: coverPhoto.length > 0 ? coverPhoto[0] : null,
          primaryRoyalties: primaryRoyalties,
          secondaryRoyalties: secondaryRoyalties,
          webLinks: JSON.stringify(webLinks),
          category_id: projectCategory,
          blockchainCategory: blockchainCategory,
          isMetaDaFreezed: isMetaDaFreezed,
        };
        console.log(payload);
        setcurrentStep([1, 2]);
      }
    }
  }
  function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  async function daoCreate() {
    let daoId = "";
    await mockCreateProject().then((res) => {
      daoId = res.project.id;
      setDao_id(daoId);
      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        `?dao_id=${daoId}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    });
    return daoId;
  }
  useEffect(() => {
    setDao_id(dao_id);
  }, [dao_id]);

  useEffect(() => {
    if (query.get("dao_id")) {
      console.log(query.get("dao_id"));
      setDao_id(query.get("dao_id"));
      console.log(dao_id);
    }
  }, []);

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
                Create New Collection
              </h1>
              <p className="text-[14px] text-textSubtle mb-[24px]">
                Fill the require form to create collection
              </p>
              <Outline
                key={outlineKey}
                // logo
                logoLabel="Collection Logo"
                coverPhotoUrl={coverPhotoUrl}
                onCoverPhotoSelect={onCoverPhotoSelect}
                onCoverPhotoRemove={onCoverPhotoRemove}
                // name
                nameLabel="Collection Name"
                projectName={projectName}
                emptyProjectName={emptyProjectName}
                alreadyTakenProjectName={alreadyTakenProjectName}
                projectNameDisabled={projectNameDisabled}
                onProjectNameChange={onProjectNameChange}
                // Dao symbol
                showDaoSymbol={false}
                // Dao Wallet
                showDaoWallet={false}
                // overview
                overview={overview}
                onOverviewChange={onOverviewChange}
                //photos
                showPhotos={false}
                // cover
                showCover={true}
                logoPhotoUrl={logoPhotoUrl}
                onLogoPhotoSelect={onLogoPhotoSelect}
                onLogoPhotoRemove={onLogoPhotoRemove}
                // Royalties
                showRoyalties={true}
                royaltiesDisable={royaltiesDisable}
                primaryRoyalties={primaryRoyalties}
                secondaryRoyalties={secondaryRoyalties}
                onPrimaryRoyaltiesChange={onPrimaryRoyaltiesChange}
                onSecondaryRoyaltiesChange={onSecondaryRoyaltiesChange}
                // webLinks
                webLinks={webLinks}
                onSocialLinkChange={onSocialLinkChange}
                // category
                projectCategory={projectCategory}
                emptyProjeCtCategory={emptyProjeCtCategory}
                onProjectCategoryChange={onProjectCategoryChange}
                blockchainCategory={blockchainCategory}
                // Freeze metadata
                showFreezeMetadata={true}
                isMetadataFreezed={isMetaDaFreezed}
                onMetadataFreezeChange={onMetadataFreezeChange}
                freezeMetadataDisabled={freezeMetadataDisabled}
              />
            </div>
          )}
          {currentStep.length === 2 && (
            <Confirmation
              key={outlineKey}
              // logo
              logoLabel="Collection Logo"
              logoPhotoUrl={logoPhotoUrl}
              // name
              nameLabel="Collection Name"
              projectName={projectName}
              // Dao symbol
              showDaoSymbol={false}
              // Dao Wallet
              showDaoWallet={false}
              // overview
              overview={overview}
              //photos
              showPhotos={false}
              // webLinks
              webLinks={webLinks}
              // Cover

              showCover={true}
              coverPhotoUrl={coverPhotoUrl}
              // Royalties
              showRoyalties={true}
              primaryRoyalties={primaryRoyalties}
              secondaryRoyalties={secondaryRoyalties}
              // category
              projectCategoryName={projectCategoryName}
              blockchainCategory={blockchainCategory}
              showFreezeMetadata={true}
              isMetaDaFreezed={isMetaDaFreezed}
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
