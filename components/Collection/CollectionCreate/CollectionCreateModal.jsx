import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  checkUniqueCollectionName,
  checkUniqueCollectionSymbol,
  createCollection,
  updateCollection,
} from 'services/collection/collectionService';
import { getProjectCategory } from 'services/project/projectService';

import { event } from 'nextjs-google-analytics';
import { ls_GetChainID } from 'util/ApplicationStorage';
import { toast } from 'react-toastify';
import TagManager from 'react-gtm-module';
import Outline from 'components/FormUtility/Outline';
import Modal from 'components/Commons/Modal';
import Spinner from 'components/Commons/Spinner';

export default function CollectionCreateModal({ show, handleClose }) {
  // general start
  const userInfo = useSelector((state) => state.user.userinfo);
  const [outlineKey, setoutlineKey] = useState(0);
  const [isDataLoading, setDataIsLoading] = useState(false);
  const [dao_id, setDao_id] = useState(null);
  // general end

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
    setLogoPhoto([]);
    setLogoPhotoUrl('');
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

  // Project Name start
  const [projectName, setProjectName] = useState('');
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);
  const [projectNameDisabled, setProjectNameDisabled] = useState(false);
  async function onProjectNameChange(e) {
    let payload = {
      projectName: e,
      project_uuid: '',
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
  // Dao symbol is collection symbol
  const [daoSymbol, setDaoSymbol] = useState('');
  const [emptyDaoSymbol, setEmptyDaoSymbol] = useState(false);
  const [daoSymbolDisable, setDaoSymbolDisable] = useState(false);
  const [alreadyTakenDaoSymbol, setAlreadyTakenDaoSymbol] = useState(false);
  async function onDaoSymbolChange(e) {
    let payload = {
      collectionSymbol: e,
      project_uuid: '',
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
    setCoverPhoto([]);
    setCoverPhotoUrl('');
  }
  // cover End

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
  const [projectCategoryList, setProjectCategoryList] = useState([]);
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

  // Token Transferable start
  const [isTokenTransferable, setIsTokenTransferable] = useState(true);
  const [showTokenTransferable, setShowTokenTransferable] = useState(true);
  const [tokenTransferableDisabled, setTokenTransferableDisabled] =
    useState(false);
  function onTokenTransferableChange(data) {
    setIsTokenTransferable((o) => !o);
  }
  // Token Transferable End

  // Freeze MetaData start
  const [isMetaDaFreezed, setIsMetaDataFreezed] = useState(true);
  const [freezeMetadataDisabled, setFreezeMetadataDisabled] = useState(false);
  function onMetadataFreezeChange(data) {
    setIsMetaDataFreezed((o) => !o);
  }
  // Freeze MetaData end

  //   blockchain start
  let chainId = ls_GetChainID();
  const [network, setNetwork] = useState(chainId?.toString());
  const [isNetworkEmpty, setIsNetworkEmpty] = useState(false);
  const [disableNetwork, setDisableNetwork] = useState(true);
  // blockchain end

  // Royalty Percentage start
  const [showRoyalties, setShowRoyalties] = useState(true);
  const [royaltyPercentageDisable, setRoyaltyPercentageDisable] =
    useState(false);
  const [royaltyPercentage, setRoyaltyPercentage] = useState(0);
  const [isRoyaltyPercentageValid, setIsRoyaltyPercentageValid] =
    useState(true);
  const [royaltiesDisable, setRoyaltiesDisable] = useState(false);
  const [primaryRoyalties, setPrimaryRoyalties] = useState(0);
  const [secondaryRoyalties, setSecondaryRoyalties] = useState(0);
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
  function onPrimaryRoyaltiesChange(royalties) {
    setPrimaryRoyalties(royalties);
  }
  function onSecondaryRoyaltiesChange(royalties) {
    setSecondaryRoyalties(royalties);
  }
  // Royalty Percentage end

  //Supply start
  const [supply, setSupply] = useState(0);
  const [supplyDisable, setSupplyDisable] = useState(false);
  console.log(collectionType, 'c');
  const [isSupplyValid, setIsSupplyValid] = useState(true);
  const handleSupplyValue = (e) => {
    if (e.target.value <= 0) {
      setIsSupplyValid(false);
    } else {
      setIsSupplyValid(true);
    }
    setSupply(e.target.value);
  };
  //   Supply end

  //   function start

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
        } else {
          setDataIsLoading(false);
          toast.error(res.message);
        }
      })
      .catch((err) => {
        setDataIsLoading(false);
        toast.error(err);
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
    await updateCollection(updatePayload)
      .then((res) => {
        setDataIsLoading(false);
        if (res?.code === 0) {
          toast.success('Successfully Created');
          handleClose();
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        setDataIsLoading(false);
        toast.error(res.message);
      });
  }

  async function createBlock(id) {
    try {
      setDataIsLoading(true);
      id = await createNewProject();
      if (id) {
        await updateExistingProject(id);
      }
    } catch (err) {
      setDataIsLoading(false);
      console.log(err);
    }
  }

  async function saveDraft() {
    if (userInfo?.id) {
      if (projectName === '') {
        setemptyProjectName(true);
      }
      if (daoSymbol === '') {
        setEmptyDaoSymbol(true);
      }
      if (collectionType === '') {
        setEmptyCollectionType(true);
      }
      if (network === '0') {
        setIsNetworkEmpty(true);
      }
      if (collectionType === 'product' && !supply) {
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
        network !== '0' &&
        isSupplyValid
      ) {
        await createBlock();
      }
    }
  }

  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e?.categories);
    });
  }, []);

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      width={600}
      height={700}
      showCloseIcon={true}
      overflow='auto'
    >
      <div className='p-4'>
        <p className='font-black text-[20px]'>Create New Collection</p>
        <p className='txtblack text-[14px] text-textSubtle mb-6'>
          Fill the require form to create collection
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
          royaltiesDiisTokenTransferablesable={false}
          primaryRoyalties={primaryRoyalties}
          secondaryRoyalties={secondaryRoyalties}
          onPrimaryRoyaltiesChange={onPrimaryRoyaltiesChange}
          onSecondaryRoyaltiesChange={onSecondaryRoyaltiesChange}
          // webLinks
          showWebLinks={showWebLinks}
          webLinks={webLinks}
          onSocialLinkChange={onSocialLinkChange}
          // category
          showProjectCategory={true}
          projectCategory={projectCategory}
          emptyProjeCtCategory={emptyProjeCtCategory}
          onProjectCategoryChange={onProjectCategoryChange}
          // blockchainCategory={blockchainCategory}
          // Freeze metadata
          showFreezeMetadata={collectionType === 'membership' ? false : true}
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
        <div className='mt-6'>
          <button
            onClick={() => saveDraft('public')}
            className={`w-full !text-[16px] h-[44px] contained-button `}
            disabled={isDataLoading}
          >
            {isDataLoading ? <Spinner forButton={true} /> : 'Create Collection'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
