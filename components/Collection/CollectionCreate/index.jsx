import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  checkUniqueCollectionName,
  checkUniqueCollectionSymbol,
} from 'services/collection/collectionService';
import {
  createCollection,
  updateCollection,
  getCollectionDetailsById,
  deleteAssetsOfCollection,
  deleteDraftCollection,
} from 'services/collection/collectionService';
import ErrorModal from 'components/Modals/ErrorModal';
import SuccessModal from 'components/Modals/SuccessModal';
import {
  getProjectCategory,
  createProject,
} from 'services/project/projectService';
import { ls_GetChainID } from 'util/ApplicationStorage';
import Outline from 'components/FormUtility/Outline';
import Confirmation from 'components/FormUtility/Confirmation';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import { event } from 'nextjs-google-analytics';
import TagManager from 'react-gtm-module';
import WalletConnectModal from 'components/Login/WalletConnectModal';

export default function CollectionCreate({ query }) {
  // logo start
  const [logoPhoto, setLogoPhoto] = useState([]);
  const [logoPhotoUrl, setLogoPhotoUrl] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [toCreateCollection, setToCreateCollection] = useState(false);
  const userInfo = useSelector((state) => state.user.userinfo);

  useEffect(() => {
    if (toCreateCollection) {
      saveDraft();
    }

    return () => {
      setToCreateCollection(false);
    };
  }, [userInfo?.id]);
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

  // Freeze MetaData start
  const [isMetaDaFreezed, setIsMetaDataFreezed] = useState(true);
  const [freezeMetadataDisabled, setFreezeMetadataDisabled] = useState(false);
  function onMetadataFreezeChange(data) {
    setIsMetaDataFreezed((o) => !o);
  }
  // Freeze MetaData end
  // Token Transferable start
  const [isTokenTransferable, setIsTokenTransferable] = useState(true);
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
  let chainId = ls_GetChainID();
  //Supply
  const [supply, setSupply] = useState(0);
  const [supplyDisable, setSupplyDisable] = useState(false);
  const [isSupplyValid, setIsSupplyValid] = useState(true);

  const handleSupplyValue = (e) => {
    if (e.target.value <= 0) {
      setIsSupplyValid(false);
    } else {
      setIsSupplyValid(true);
    }
    setSupply(e.target.value);
  };
  const [outlineKey, setoutlineKey] = useState(0);
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
  const [notOwner, setNotOwner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [network, setNetwork] = useState(chainId?.toString());
  const [isNetworkEmpty, setIsNetworkEmpty] = useState(false);
  const [disableNetwork, setDisableNetwork] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionPublished, setCollectionPublished] = useState(false);
  const [collectionDeleted, setCollectionDeleted] = useState(false);

  function handelClickBack() {
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
  }
  async function createBlock(id) {
    try {
      setDataIsLoading(true);
      id = await createNewProject();
      await updateExistingProject(id);
      setShowSuccessModal(true);

      setDataIsLoading(false);
      // await projectDetails(id);
    } catch (err) {
      setDataIsLoading(false);
      setShowSuccessModal(false);
      setShowErrorModal(true);
    }
  }
  async function updateBlock(id) {
    try {
      setDataIsLoading(true);
      await updateExistingProject(id);
      // await projectDetails(id);
      setDataIsLoading(false);
      setShowSuccessModal(true);
    } catch (err) {
      setDataIsLoading(false);
      setShowSuccessModal(false);
      setShowErrorModal(true);
    }
  }

  async function saveDraft() {
    if (userInfo?.id) {
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
          let id = '';
          if (!projectCreated) {
            await createBlock(id);
          } else if (projectCreated && projectId !== '') {
            await updateBlock(projectId);
          }
        }
      }
    } else {
      setShowConnectModal(true);
      setToCreateCollection(true);
    }
  }
  async function createNewProject() {
    event('create_collection', {
      category: 'collection',
      label: 'blockchain',
      value: network,
    });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'collection',
        pageTitle: 'create_collection',
        label: 'blockchain',
        value: network,
      },
    });
    let createPayload = {
      name: projectName,
      collection_type: collectionType,
      blockchain: network,
      ...(dao_id && { dao_id: dao_id }),
    };

    let projectId = '';
    await createCollection(createPayload)
      .then((res) => {
        if (res.code === 0) {
          projectId = res.collection.id;
          setProjectCreated(true);
          setProjectId(projectId);
        } else {
          setDataIsLoading(false);
          setShowErrorModal(true);
          setErrorMessage(res.message);
        }
      })
      .catch((err) => {
        setDataIsLoading(false);
        console.log(err);
      });
    return projectId;
  }
  async function updateExistingProject(id) {
    event('update_collection', { category: 'collection' });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'collection',
        pageTitle: 'update_collection',
      },
    });
    let updatePayload = {
      logo: logoPhoto.length > 0 ? logoPhoto[0] : null,
      name: projectName,
      overview: overview,
      cover: coverPhoto.length > 0 ? coverPhoto[0] : null,
      // primaryRoyalties: primaryRoyalties,
      // secondaryRoyalties: secondaryRoyalties,
      webLinks: JSON.stringify(webLinks),
      category_id: projectCategory,
      blockchain: network,
      isMetaDaFreezed: isMetaDaFreezed,
      isTokenTransferable: isTokenTransferable,
      royaltyPercentage: royaltyPercentage,
      collectionSymbol: daoSymbol,
      total_supply: supply,
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
        const logo = response?.assets?.find((x) => x?.asset_purpose === 'logo');
        setLogoPhotoUrl(logo ? logo : '');
        setProjectName(response?.name);
        setNetwork(response?.blockchain);
        setDaoSymbol(response?.collection_symbol);
        setOverview(response?.description);
        const cover = response?.assets?.find(
          (x) => x?.asset_purpose === 'cover'
        );
        setCoverPhotoUrl(cover ? cover : '');
        try {
          setWebLinks(JSON.parse(response.links));
        } catch (e) {}
        setProjectCategory(response?.category_id);
        setIsTokenTransferable(response?.token_transferable);
        setIsMetaDataFreezed(response?.updatable);
        setRoyaltyPercentage(response?.royalty_percent);
        setSupply(response?.total_supply);
        setCollectionType(response?.type);
        setDataIsLoading(false);
        setProjectInfo(response);
        setProjectStatus(response?.status);
        setProjectCreated(true);
        setProjectId(response?.id);
        if (response?.type === 'right_attach') {
          setTokenTransferableDisabled(true);
          setIsMetaDataFreezed(true);
          setFreezeMetadataDisabled(true);
          setShowRoyalties(false);

          setShowCover(false);
          setShowWebLinks(false);
        }

        if (response?.status === 'published') {
          setProjectNameDisabled(true);
          setDaoSymbolDisable(true);
          setFreezeMetadataDisabled(true);
          setTokenTransferableDisabled(true);
          setRoyaltyPercentageDisable(true);
          setSupplyDisable(true);
          setDisableNetwork(true);
          setCollectionPublished(true);
        }
        if (!response?.is_owner) {
          setNotOwner(true);
        }
      } else {
        setDataIsLoading(false);
        showErrorModal(true);
        setErrorMessage(e?.message);
      }
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
      if (network === '0') {
        setIsNetworkEmpty(true);
      }
      if (!supply) {
        setIsSupplyValid(false);
      }
      if (projectCategory === '') {
        setEmptyProjectCategory(true);
      } else if (
        projectName !== '' &&
        projectCategory !== '' &&
        alreadyTakenProjectName === false &&
        daoSymbol !== '' &&
        alreadyTakenDaoSymbol === false &&
        isRoyaltyPercentageValid &&
        network !== '0'
      ) {
        if (collectionType === 'product') {
          if (supply && isSupplyValid) {
            const categoryName = projectCategoryList.find(
              (x) => x.id === parseInt(projectCategory)
            );
            setProjectCategoryName(categoryName ? categoryName.name : '');
            setcurrentStep([1, 2]);
          }
        } else {
          const categoryName = projectCategoryList.find(
            (x) => x.id === parseInt(projectCategory)
          );
          setProjectCategoryName(categoryName ? categoryName.name : '');
          setcurrentStep([1, 2]);
        }
      }
    }
  }
  async function deleteCollection() {
    event('delete_collection', { category: 'collection' });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'collection',
        pageTitle: 'delete_collection',
      },
    });
    setDataIsLoading(true);
    await deleteDraftCollection(projectId)
      .then((res) => {
        if (res.code === 0) {
          setCollectionDeleted(true);
          setShowDeleteModal(false);
          setShowSuccessModal(true);
          setDataIsLoading(false);
        } else {
          setShowErrorModal(true);
          setErrorMessage(res.message);
          setDataIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setDataIsLoading(false);
      });
  }
  // async function daoCreate() {
  //   let daoId = '';
  //   let payload = {
  //     // name: `DAO_${uuidv4()}`,
  //     blockchain: ls_GetChainID(),
  //   };
  //   await createProject(payload).then((res) => {
  //     if (res.code === 0) {
  //       daoId = res.project.id;
  //       setDao_id(daoId);
  //     } else {
  //       setShowErrorModal(true);
  //       setErrorMessage(res.message);
  //     }
  //   });
  //   return daoId;
  // }
  useEffect(() => {
    setDao_id(dao_id);
  }, [dao_id]);
  useEffect(() => {
    setCollectionType(collectionType);
    if (collectionType === 'membership') {
      setIsMetaDataFreezed(false);
    }
  }, [collectionType]);

  useEffect(() => {
    if (query?.id) {
      projectDetails(query?.id);
      setShowCollectionType(false);
    }
    if (query?.dao_id) {
      setDao_id(query?.dao_id);
    }
    if (query?.type) {
      setCollectionType(query?.type);
      setShowCollectionType(false);
    }
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  return (
    <>
      {isDataLoading && <div className='loading'></div>}
      <div className='txtblack max-w-[600px] pt-4 md:pt-0 mx-4 md:mx-auto md:mt-[40px]'>
        {notOwner ? (
          <h3 className='text-center mt-6'>
            You are not owner of this Collection <br />
            You can not edit this Collection
          </h3>
        ) : (
          <>
            <div className='create-collection-container'>
              {currentStep.length === 1 && (
                <div>
                  <div className='flex flex-wrap items-center mb-[24px]'>
                    <div>
                      <h1 className='txtblack text-[28px] font-black mb-[6px]'>
                        {projectCreated ? 'Update' : 'Create New'} Collection
                      </h1>
                      <p className='txtblack text-[14px] text-textSubtle'>
                        Fill the require form to{' '}
                        {!projectCreated ? 'create ' : 'Update'} collection
                      </p>
                    </div>
                    {query?.id && !notOwner && !collectionPublished && (
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className='px-4 py-2 text-white bg-danger-1 ml-auto rounded'
                      >
                        <i className='fa-solid fa-trash mr-1'></i>
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
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
                    showProjectCategory={
                      collectionType === 'right_attach' ? false : true
                    }
                    projectCategory={projectCategory}
                    emptyProjeCtCategory={emptyProjeCtCategory}
                    onProjectCategoryChange={onProjectCategoryChange}
                    // blockchainCategory={blockchainCategory}
                    // Freeze metadata
                    showFreezeMetadata={
                      collectionType === 'membership' ? false : true
                    }
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
                    //Supply
                    showSupply={collectionType === 'product' ? true : false}
                    supply={supply}
                    handleSupplyValue={handleSupplyValue}
                    supplyDisable={supplyDisable}
                    onBlockchainCategoryChange={setNetwork}
                    collectionNetwork={network}
                    disableNetwork={disableNetwork}
                    isSupplyValid={isSupplyValid}
                    userId={userInfo?.id}
                    setIsNetworkEmpty={setIsNetworkEmpty}
                    isNetworkEmpty={isNetworkEmpty}
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
                  showProjectCategory={
                    collectionType === 'right_attach' ? false : true
                  }
                  projectCategoryName={projectCategoryName}
                  showFreezeMetadata={
                    collectionType === 'membership' ? false : true
                  }
                  isMetaDaFreezed={isMetaDaFreezed}
                  showTokenTransferable={showTokenTransferable}
                  isTokenTransferable={isTokenTransferable}
                  showRoyaltyPercentage={showRoyalties}
                  royaltyPercentage={royaltyPercentage}
                  showSupplyData={collectionType === 'product' ? true : false}
                  supply={supply}
                  network={network}
                />
              )}
            </div>
            <div className='py-4'>
              <div className='flex'>
                <>
                  {currentStep.length > 1 && (
                    <button
                      className='bg-primary-900/[0.10] text-primary-900 px-3 font-black w-[140px] !text-[16px] h-[44px]'
                      onClick={() => handelClickBack()}
                    >
                      <i className='fa-regular fa-angle-left'></i> Back
                    </button>
                  )}
                  {currentStep.length === 1 && (
                    <button
                      className=' w-[140px] !text-[16px] h-[44px] contained-button '
                      onClick={() => handelClickNext()}
                    >
                      Next <i className='fa-regular fa-angle-right ml-1'></i>
                    </button>
                  )}
                  {currentStep.length > 1 && (
                    <button
                      onClick={() => saveDraft('public')}
                      className={`w-[140px] !text-[16px] h-[44px] contained-button  ml-auto`}
                    >
                      Submit
                    </button>
                  )}
                </>
              </div>
            </div>
          </>
        )}
      </div>
      {showSuccessModal && (
        <SuccessModal
          handleClose={() => setShowSuccessModal(false)}
          show={showSuccessModal}
          redirection={
            !collectionDeleted ? `/collection/${projectId}` : `/dashboard`
          }
          message={`Collection successfully ${
            !collectionDeleted ? 'saved' : 'deleted'
          }`}
          subMessage={!collectionDeleted ? "Let's explore the Collection" : ''}
          buttonText={!collectionDeleted ? 'VIEW Collection' : 'Close'}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => {
            setShowErrorModal(false);
            setErrorMessage(false);
          }}
          show={showErrorModal}
          message={errorMessage}
          buttomText='Try Again'
        />
      )}
      {showDeleteModal && (
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleApply={deleteCollection}
          message='Are you sure  to delete this Collection?'
        />
      )}
      {showConnectModal && (
        <WalletConnectModal
          showModal={showConnectModal}
          noRedirection={true}
          closeModal={() => setShowConnectModal(false)}
        />
      )}
    </>
  );
}
