import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import 'assets/css/CreateProject/mainView.css';
import {
  checkUniqueCollectionName,
  checkUniqueCollectionSymbol,
} from 'services/collection/collectionService';
import Outline from 'components/DraftProjectUpdate/Outline';
import Confirmation from 'components/DraftProjectUpdate/Confirmation';
import { mockCreateProject } from 'services/project/projectService';
import {
  createCollection,
  updateCollection,
  getCollectionDetailsById,
  deleteAssetsOfCollection,
} from 'services/collection/collectionService';
import ErrorModal from 'components/modalDialog/ErrorModal';
import SuccessModal from 'components/modalDialog/SuccessModal';
import { getProjectCategory } from 'services/project/projectService';
import { useLocation } from 'react-router-dom';

export default function CollectionCreate() {
  // logo start
  const [logoPhoto, setLogoPhoto] = useState([]);
  const [logoPhotoUrl, setLogoPhotoUrl] = useState('');
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
  async function onLogoPhotoRemove() {
    if (coverPhotoUrl.id) {
      let payload = {
        projectId: projectInfo.id,
        assetsId: logoPhotoUrl.id,
      };
      setDataIsLoading(true);
      await deleteAssetsOfCollection(payload).then((e) => {
        setLogoPhoto([]);
        setLogoPhotoUrl('');
        setDataIsLoading(false);
      });
    } else {
      setLogoPhoto([]);
      setLogoPhotoUrl('');
    }
  }
  // Logo End

  // collection Type start
  const [collectionType, setCollectionType] = useState('');
  const [showCollectionType, setShowCollectionType] = useState(true);
  const [emptyCollectionType, setEmptyCollectionType] = useState(false);
  function onCollectionTypeSelect(e) {
    setCollectionType(e.target.value);
    setEmptyCollectionType(false);
  }
  // collection type End

  // cover start
  const [showCover, setShowCover] = useState(true);
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
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
  async function onCoverPhotoRemove() {
    if (coverPhotoUrl.id) {
      let payload = {
        projectId: projectInfo.id,
        assetsId: coverPhotoUrl.id,
      };
      setDataIsLoading(true);
      await deleteAssetsOfCollection(payload).then((e) => {
        setCoverPhoto([]);
        setCoverPhotoUrl('');
        setDataIsLoading(false);
      });
    } else {
      setCoverPhoto([]);
      setCoverPhotoUrl('');
    }
  }
  // cover End

  // Project Name start
  const [projectName, setProjectName] = useState('');
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);
  const [projectNameDisabled, setProjectNameDisabled] = useState(false);
  async function onProjectNameChange(e) {
    let payload = {
      projectName: e,
      project_uuid: projectId,
    };
    setProjectName(payload.projectName);
    setemptyProjectName(false);
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

  // Dao symbol start
  // dao symbol is collection symbol
  const [daoSymbol, setDaoSymbol] = useState('');
  const [emptyDaoSymbol, setEmptyDaoSymbol] = useState(false);
  const [daoSymbolDisable, setDaoSymbolDisable] = useState(false);
  const [alreadyTakenDaoSymbol, setAlreadyTakenDaoSymbol] = useState(false);
  async function onDaoSymbolChange(e) {
    let payload = {
      collectionSymbol: e,
      project_uuid: projectId,
    };
    setDaoSymbol(payload.collectionSymbol);
    setEmptyDaoSymbol(false);
    await checkUniqueCollectionSymbol(payload)
      .then((e) => {
        if (e.code === 0) {
          setEmptyDaoSymbol(false);
          setAlreadyTakenDaoSymbol(false);
        } else {
          setAlreadyTakenDaoSymbol(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // Dao symbol End

  // overview start
  const [overview, setOverview] = useState('');
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
    { title: 'linkInsta', icon: 'instagram', value: '' },
    { title: 'linkReddit', icon: 'reddit', value: '' },
    { title: 'linkTwitter', icon: 'twitter', value: '' },
    { title: 'linkFacebook', icon: 'facebook', value: '' },
    { title: 'customLinks1', icon: 'link', value: '' },
  ];
  const [showWebLinks, setShowWebLinks] = useState(true);
  const [webLinks, setWebLinks] = useState(links);
  function onSocialLinkChange(url, index) {
    let oldLinks = [...webLinks];
    oldLinks[index].value = url;
    setWebLinks(oldLinks);
  }
  // webLinks end

  // category start
  const [projectCategory, setProjectCategory] = useState('');
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  const [projectCategoryName, setProjectCategoryName] = useState('');
  function onProjectCategoryChange(event) {
    setProjectCategory(event.target.value);
    setEmptyProjectCategory(false);
    const categoryName = projectCategoryList.find(
      (x) => x.id === parseInt(event.target.value)
    );

    setProjectCategoryName(categoryName ? categoryName.name : '');
  }
  // category end

  // Blockchain start
  const [blockchainCategory, setBlockchaainCategory] = useState('polygon');
  // Blockchain end

  // Freeze MetaData start
  const [isMetaDaFreezed, setIsMetaDataFreezed] = useState(false);
  const [freezeMetadataDisabled, setFreezeMetadataDisabled] = useState(false);
  function onMetadataFreezeChange(data) {
    setIsMetaDataFreezed((o) => !o);
  }
  // Freeze MetaData end
  // Token Transferable start
  const [isTokenTransferable, setIsTokenTransferable] = useState(false);
  const [showTokenTransferable, setShowTokenTransferable] = useState(true);
  const [tokenTransferableDisabled, setTokenTransferableDisabled] =
    useState(false);
  function onTokenTransferableChange(data) {
    setIsTokenTransferable((o) => !o);
  }
  // Token Transferable End

  // Royalty Percentage start
  const [showRoyalties, setShowRoyalties] = useState(true);
  const [royaltyPercentageDisable, setRoyaltyPercentageDisable] =
    useState(false);
  const [royaltyPercentage, setRoyaltyPercentage] = useState(0);
  const [isRoyaltyPercentageValid, setIsRoyaltyPercentageValid] =
    useState(true);

  function onRoyaltyPercentageChange(royalties) {
    setRoyaltyPercentage(royalties);
    if (royalties === '') {
      setIsRoyaltyPercentageValid(false);
    } else {
      if (!isNaN(royalties)) {
        let value = parseInt(royalties);
        if (value < 0) {
          setIsRoyaltyPercentageValid(false);
        } else if (value > 0 && value > 10) {
          setIsRoyaltyPercentageValid(false);
        } else {
          setIsRoyaltyPercentageValid(true);
        }
      }
    }
  }

  // Royalty Percentage end

  const [outlineKey, setoutlineKey] = useState(0);
  let query = useQuery();

  const [currentStep, setcurrentStep] = useState([1]);
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
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
    if (dao_id) {
      setDataIsLoading(true);
      id = await createNewProject(dao_id);
      await updateExistingProject(id);
      // await projectDetails(id);
      setDataIsLoading(false);
      setShowSuccessModal(true);
    } else {
      setDataIsLoading(true);
      const daoId = await daoCreate();
      id = await createNewProject(daoId);
      await updateExistingProject(id);
      // await projectDetails(id);
      setDataIsLoading(false);
      setShowSuccessModal(true);
    }
  }
  async function updateBlock(id) {
    setDataIsLoading(true);
    await updateExistingProject(id);
    // await projectDetails(id);
    setDataIsLoading(false);
    setShowSuccessModal(true);
  }
  async function saveDraft() {
    // outline
    if (currentStep.length === 2) {
      if (
        projectName !== '' &&
        projectCategory !== '' &&
        alreadyTakenProjectName === false &&
        daoSymbol !== '' &&
        alreadyTakenDaoSymbol === false &&
        isRoyaltyPercentageValid
      ) {
        console.log('dfg');
        let id = '';
        if (!projectCreated) {
          await createBlock(id);
        } else if (projectCreated && projectId !== '') {
          await updateBlock(projectId);
        }
      }
    }
  }
  async function createNewProject(dao_id) {
    let createPayload = {
      name: projectName,
      dao_id: dao_id,
      collection_type: collectionType,
    };

    let projectId = '';
    await createCollection(createPayload)
      .then((res) => {
        if (res.code === 0) {
          projectId = res.collection.id;
          setProjectCreated(true);
          setProjectId(projectId);
        } else if (res.code === 5001) {
          setDataIsLoading(false);
          setShowErrorModal(true);
        }
      })
      .catch((err) => {
        setDataIsLoading(false);
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
      // primaryRoyalties: primaryRoyalties,
      // secondaryRoyalties: secondaryRoyalties,
      webLinks: JSON.stringify(webLinks),
      category_id: projectCategory,
      blockchainCategory: blockchainCategory,
      isMetaDaFreezed: isMetaDaFreezed,
      isTokenTransferable: isTokenTransferable,
      royaltyPercentage: royaltyPercentage,
      collectionSymbol: daoSymbol,
      id: id,
    };
    await updateCollection(updatePayload);
  }
  async function projectDetails(id) {
    let payload = {
      id: id ? id : projectId,
    };
    setDataIsLoading(true);
    await getCollectionDetailsById(payload).then((e) => {
      if (e.code === 0) {
        const response = e.collection;
        const logo = response.assets.find((x) => x.asset_purpose === 'logo');
        setLogoPhotoUrl(logo ? logo : '');
        setProjectName(response.name);
        setDaoSymbol(response.collection_symbol);
        setOverview(response.description);
        const cover = response.assets.find((x) => x.asset_purpose === 'cover');
        setCoverPhotoUrl(cover ? cover : '');
        try {
          setWebLinks(JSON.parse(response.links));
        } catch (e) {}
        setProjectCategory(response.category_id);
        setIsTokenTransferable(response.token_transferable);
        setIsMetaDataFreezed(response.freeze_metadata);
        setRoyaltyPercentage(response.royalty_percent);
        setCollectionType(response.type);
        setDataIsLoading(false);
        setProjectInfo(response);
        setProjectStatus(response.status);
        setProjectCreated(true);
        setProjectId(response.id);
        if (response.type === 'right_attach') {
          setShowTokenTransferable(false);
          setShowRoyalties(false);
          setShowCover(false);
          setShowWebLinks(false);
        }

        if (response.status === 'published') {
          setProjectNameDisabled(true);
          setDaoSymbolDisable(true);
          setFreezeMetadataDisabled(true);
          setTokenTransferableDisabled(true);
          setRoyaltyPercentageDisable(true);
        }
      } else {
        setDataIsLoading(false);
        showErrorModal(true);
      }

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
      if (projectName === '') {
        setemptyProjectName(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (daoSymbol === '') {
        setEmptyDaoSymbol(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (collectionType === '') {
        setEmptyCollectionType(true);
      }
      if (projectCategory === '') {
        setEmptyProjectCategory(true);
      } else if (
        projectName !== '' &&
        projectCategory !== '' &&
        alreadyTakenProjectName === false &&
        daoSymbol !== '' &&
        alreadyTakenDaoSymbol === false &&
        isRoyaltyPercentageValid
      ) {
        const payload = {
          logo: logoPhoto.length > 0 ? logoPhoto[0] : null,
          name: projectName,
          overview: overview,
          cover: coverPhoto.length > 0 ? coverPhoto[0] : null,
          // primaryRoyalties: primaryRoyalties,
          // secondaryRoyalties: secondaryRoyalties,
          collectionType: collectionType,
          webLinks: JSON.stringify(webLinks),
          category_id: projectCategory,
          blockchainCategory: blockchainCategory,
          isMetaDaFreezed: isMetaDaFreezed,
          isTokenTransferable: isTokenTransferable,
          royaltyPercentage: royaltyPercentage,
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
    let daoId = '';
    await mockCreateProject().then((res) => {
      daoId = res.project.id;
      setDao_id(daoId);
      // const newUrl =
      //   window.location.protocol +
      //   "//" +
      //   window.location.host +
      //   window.location.pathname +
      //   `?dao_id=${daoId}`;
      // window.history.pushState({ path: newUrl }, "", newUrl);
    });
    return daoId;
  }
  useEffect(() => {
    setDao_id(dao_id);
  }, [dao_id]);
  useEffect(() => {
    setCollectionType(collectionType);
  }, [collectionType]);

  useEffect(() => {
    if (query.get('dao_id')) {
      setDao_id(query.get('dao_id'));
    }
    if (query.get('type')) {
      setCollectionType(query.get('type'));
      setShowCollectionType(false);
    }
  }, []);
  useEffect(() => {
    if (query.get('id')) {
      projectDetails(query.get('id'));
      setShowCollectionType(false);
    }
  }, []);

  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  return (
    <>
      {isDataLoading && <div className='loading'></div>}
      <div className='txtblack max-w-[600px] mx-auto md:mt-[40px]'>
        <div className='create-project-container'>
          {currentStep.length === 1 && (
            <div>
              <h1 className='txtblack text-[28px] font-black mb-[6px]'>
                {projectCreated ? 'Update' : 'Create New'} Collection
              </h1>
              <p className='txtblack text-[14px] text-textSubtle mb-[24px]'>
                Fill the require form to{' '}
                {!projectCreated ? 'create ' : 'Update'} collection
              </p>
              <Outline
                key={outlineKey}
                // logo
                logoLabel='Collection Logo'
                coverPhotoUrl={coverPhotoUrl}
                onCoverPhotoSelect={onCoverPhotoSelect}
                onCoverPhotoRemove={onCoverPhotoRemove}
                // collection Type
                showCollectionType={showCollectionType}
                collectionType={collectionType}
                emptyCollectionType={emptyCollectionType}
                onCollectionTypeSelect={onCollectionTypeSelect}
                // name
                nameLabel='Collection Name'
                projectName={projectName}
                emptyProjectName={emptyProjectName}
                alreadyTakenProjectName={alreadyTakenProjectName}
                projectNameDisabled={projectNameDisabled}
                onProjectNameChange={onProjectNameChange}
                // Dao symbol
                symbolTitle='Collection Symbol'
                showDaoSymbol={true}
                daoSymbol={daoSymbol}
                emptyDaoSymbol={emptyDaoSymbol}
                onDaoSymbolChange={onDaoSymbolChange}
                daoSymbolDisable={daoSymbolDisable}
                alreadyTakenDaoSymbol={alreadyTakenDaoSymbol}
                // Dao Wallet
                showDaoWallet={false}
                // overview
                overview={overview}
                onOverviewChange={onOverviewChange}
                //photos
                showPhotos={false}
                // cover
                showCover={showCover}
                logoPhotoUrl={logoPhotoUrl}
                onLogoPhotoSelect={onLogoPhotoSelect}
                onLogoPhotoRemove={onLogoPhotoRemove}
                // Royalties
                showRoyalties={false}
                royaltiesDiisTokenTransferablesable={royaltiesDisable}
                primaryRoyalties={primaryRoyalties}
                secondaryRoyalties={secondaryRoyalties}
                onPrimaryRoyaltiesChange={onPrimaryRoyaltiesChange}
                onSecondaryRoyaltiesChange={onSecondaryRoyaltiesChange}
                // webLinks
                showWebLinks={showWebLinks}
                webLinks={webLinks}
                onSocialLinkChange={onSocialLinkChange}
                // category
                projectCategory={projectCategory}
                emptyProjeCtCategory={emptyProjeCtCategory}
                onProjectCategoryChange={onProjectCategoryChange}
                // blockchainCategory={blockchainCategory}
                // Freeze metadata
                showFreezeMetadata={true}
                isMetadataFreezed={isMetaDaFreezed}
                onMetadataFreezeChange={onMetadataFreezeChange}
                freezeMetadataDisabled={freezeMetadataDisabled}
                // Token Transferable
                showTokenTransferable={showTokenTransferable}
                isTokenTransferable={isTokenTransferable}
                onTokenTransferableChange={onTokenTransferableChange}
                tokenTransferableDisabled={tokenTransferableDisabled}
                // Royalty Percentage
                showRoyaltyPercentage={showRoyalties}
                royaltyPercentageDisable={royaltyPercentageDisable}
                royaltyPercentage={royaltyPercentage}
                onRoyaltyPercentageChange={onRoyaltyPercentageChange}
                isRoyaltyPercentageValid={isRoyaltyPercentageValid}
              />
            </div>
          )}
          {currentStep.length === 2 && (
            <Confirmation
              key={outlineKey}
              // logo
              logoLabel='Collection Logo'
              logoPhotoUrl={logoPhotoUrl}
              // name
              nameLabel='Collection Name'
              projectName={projectName}
              // Dao symbol
              symbolTitle='Collection Symbol'
              showDaoSymbol={true}
              daoSymbol={daoSymbol}
              // Dao Wallet
              showDaoWallet={false}
              // overview
              overview={overview}
              //photos
              showPhotos={false}
              // webLinks
              webLinks={webLinks}
              showWebLinks={showWebLinks}
              // Cover

              showCover={showCover}
              coverPhotoUrl={coverPhotoUrl}
              // Royalties
              showRoyalties={false}
              primaryRoyalties={primaryRoyalties}
              secondaryRoyalties={secondaryRoyalties}
              // category
              projectCategoryName={projectCategoryName}
              showFreezeMetadata={true}
              isMetaDaFreezed={isMetaDaFreezed}
              showTokenTransferable={showTokenTransferable}
              isTokenTransferable={isTokenTransferable}
              showRoyaltyPercentage={showRoyalties}
              royaltyPercentage={royaltyPercentage}
            />
          )}
        </div>
        <div className='mb-6'>
          <div className='flex'>
            {projectStatus !== 'publishing' && (
              <>
                {currentStep.length > 1 && (
                  <button
                    className='bg-primary-900/[0.10] text-primary-900 px-3 font-black'
                    onClick={() => handelClickBack()}
                  >
                    <i className='fa-regular fa-angle-left'></i> Back
                  </button>
                )}
                {currentStep.length === 1 && (
                  <button
                    className='btn text-white-shade-900 bg-primary-900 btn-sm'
                    onClick={() => handelClickNext()}
                  >
                    Next <i className='fa-regular fa-angle-right ml-1'></i>
                  </button>
                )}
                {currentStep.length > 1 && projectStatus !== 'published' && (
                  <button
                    onClick={() => saveDraft('public')}
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
          redirection={`/collection-details/${projectId}`}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          show={showErrorModal}
          buttomText='Try Again'
          redirection={`/create`}
        />
      )}
    </>
  );
}
