import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  checkUniqueCollectionName,
  checkUniqueCollectionSymbol,
  getSplitterList,
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
  getProjectDetailsById,
} from 'services/project/projectService';
import { ls_GetChainID } from 'util/ApplicationStorage';
import Outline from 'components/FormUtility/Outline';
import Confirmation from 'components/FormUtility/Confirmation';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import { event } from 'nextjs-google-analytics';
import TagManager from 'react-gtm-module';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { uniqBy } from 'lodash';
import { toast } from 'react-toastify';
import { addDays } from 'date-fns';
import getUnixTime from 'date-fns/getUnixTime';
import { format } from 'date-fns';

export default function CollectionCreate({ query }) {
  // logo start
  const [logoPhoto, setLogoPhoto] = useState([]);
  const [logoPhotoUrl, setLogoPhotoUrl] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [toCreateCollection, setToCreateCollection] = useState(false);
  const userInfo = useSelector((state) => state.user.userinfo);
  const onLogoPhotoSelect = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length === 1) {
      setLogoPhoto(acceptedFiles);
      let objectUrl = URL.createObjectURL(acceptedFiles[0]);
      let logoPhotoInfo = {
        path: objectUrl,
      };
      setLogoPhotoUrl(logoPhotoInfo);
      setoutlineKey(1);
    }
  }, []);
  const onLogoPhotoRemove = async () => {
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
  };
  // Logo End

  // Collection Name start
  const [projectName, setProjectName] = useState('');
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);
  const [projectNameDisabled, setProjectNameDisabled] = useState(false);
  const onProjectNameChange = async (e) => {
    let payload = {
      projectName: e,
      project_uuid: projectId,
    };
    setProjectName(payload.projectName);
    setemptyProjectName(false);
    await checkUniqueCollectionName(payload)
      .then((e) => {
        if (e?.code === 0) {
          setemptyProjectName(false);
          setAlreadyTakenProjectName(false);
        } else {
          setAlreadyTakenProjectName(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Collection Name End

  // Collection symbol start
  const [daoSymbol, setDaoSymbol] = useState('');
  const [emptyDaoSymbol, setEmptyDaoSymbol] = useState(false);
  const [daoSymbolDisable, setDaoSymbolDisable] = useState(false);
  const [alreadyTakenDaoSymbol, setAlreadyTakenDaoSymbol] = useState(false);
  const onDaoSymbolChange = async (e) => {
    let payload = {
      collectionSymbol: e,
      project_uuid: projectId,
    };
    setDaoSymbol(payload.collectionSymbol);
    setEmptyDaoSymbol(false);
    await checkUniqueCollectionSymbol(payload)
      .then((e) => {
        if (e?.code === 0) {
          setEmptyDaoSymbol(false);
          setAlreadyTakenDaoSymbol(false);
        } else {
          setAlreadyTakenDaoSymbol(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Collection symbol End

  // Category start
  const [projectCategory, setProjectCategory] = useState('');
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  const [projectCategoryName, setProjectCategoryName] = useState('');
  const onProjectCategoryChange = async (event) => {
    setProjectCategory(event.target.value);
    setEmptyProjectCategory(false);
    const categoryName = projectCategoryList?.find(
      (x) => x?.id === parseInt(event.target.value)
    );
    setProjectCategoryName(categoryName ? categoryName?.name : '');
  };
  // Category end

  // Blockchain start
  let chainId = ls_GetChainID();
  const [network, setNetwork] = useState(chainId?.toString());
  const [isNetworkEmpty, setIsNetworkEmpty] = useState(false);
  const [disableNetwork, setDisableNetwork] = useState(false);
  //  BlockChain end

  // Token Transferable start
  const [isTokenTransferable, setIsTokenTransferable] = useState(false);
  const onTokenTransferableChange = (data) => {
    setIsTokenTransferable((o) => !o);
  };
  // Token Transferable End

  // Token Time Bound start
  const [isTokenTimebound, setIsTokenTimebound] = useState(false);
  const [isTimeboundDurationValid, setisTimeboundDurationValid] =
    useState(true);

  const [timeboundDuration, setTimeBoundDuration] = useState({
    days: null,
    months: null,
    years: null,
  });
  const onTokenTimeboundChange = (data) => {
    setTimeBoundDuration({
      days: null,
      months: null,
      years: null,
    });
    setIsTokenTimebound((o) => !o);
  };
  const onTimeboundDurationChange = (key, value) => {
    let data = { ...timeboundDuration };
    data[key] = value;
    setTimeBoundDuration(data);
  };
  // Token Time bound End

  // Base price start
  const [basePrice, setBasePrice] = useState('');
  const [isBasePriceValid, setIsBasePriceValid] = useState(true);
  const handleBasePriceValue = (e) => {
    if (e.target.value <= 0) {
      setIsBasePriceValid(false);
    } else {
      setIsBasePriceValid(true);
    }
    setBasePrice(e.target.value);
  };
  // Base price end

  // Supply start
  const [supply, setSupply] = useState(0);
  const [supplyDisable, setSupplyDisable] = useState(false);
  const [isSupplyValid, setIsSupplyValid] = useState(true);
  const handleSupplyValue = (e) => {
    if (e.target.value <= 0) {
      setIsSupplyValid(false);
    } else {
      setIsSupplyValid(true);
    }
    setSupply(Number(e.target.value));
  };
  // Supply end

  // Royalty Earnable By Owner start
  const [isRoyaltyEarnableByOwner, setIsRoyaltyEarnableByOwner] =
    useState(false);
  const [royaltyPercentage, setRoyaltyPercentage] = useState(0);
  const [splitter, setSplitter] = useState();
  const onRoyaltyEarnableByOwnerChange = (data) => {
    setRoyaltyPercentage(0);
    setSplitter();
    setIsRoyaltyEarnableByOwner((o) => !o);
  };
  // Royalty Earnable By Owner end

  // Royalty Percentage start
  const [showRoyalties, setShowRoyalties] = useState(true);
  const [royaltyPercentageDisable, setRoyaltyPercentageDisable] =
    useState(false);
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
        } else if (value > 1 && value > 10) {
          setIsRoyaltyPercentageValid(false);
        } else {
          setIsRoyaltyPercentageValid(true);
        }
      }
    }
  }
  // Royalty Percentage end

  // Splitter start

  const [splittersOptions, setSplittersOptions] = useState([]);
  const [splitterListPayload, setSplitterListPayload] = useState({
    page: 1,
    perPage: 10,
    keyword: '',
    order_by: 'newer',
  });
  const [hasNextPageData, setHasNextPageData] = useState(true);
  const getSplitters = async (network) => {
    await getSplitterList(splitterListPayload.page, splitterListPayload.perPage)
      .then((res) => {
        let chain = network ? network : network;
        let filteredSplitters =
          chain &&
          res?.splitters?.filter((split) => split?.blockchain === chain);
        const splitterList = [...splittersOptions];
        const mergedSplitterList = [...splitterList, ...filteredSplitters];
        const uniqSplitterList = uniqBy(mergedSplitterList, function (e) {
          return e?.id;
        });

        setSplittersOptions(uniqSplitterList);
        if (res?.splitters?.length === 0) {
          setHasNextPageData(false);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  const scrolledBottomSplitters = async () => {
    let oldPayload = { ...splitterListPayload };
    oldPayload.page = oldPayload.page + 1;
    setSplitterListPayload(oldPayload);
  };

  const onGetSplitterList = async () => {
    setSplittersOptions([]);
    setSplitterListPayload({
      page: 1,
      perPage: 10,
      keyword: '',
      order_by: 'newer',
    });
  };

  const onSplitterDraftSave = async (id) => {
    toast.success('Successfully Created New Splitter');
    await getSplitterList(splitterListPayload.page, splitterListPayload.perPage)
      .then((res) => {
        let chain = network ? network : network;
        let filteredSplitters =
          chain &&
          res?.splitters?.filter((split) => split?.blockchain === chain);
        let splitter = null;
        if (id) {
          splitter = filteredSplitters?.find((x) => x.id === id);
        }
        if (splitter) {
          setSplitter(splitter);
          setoutlineKey((pre) => pre + 1);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  // Splitter end

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

  // overview start
  const [overview, setOverview] = useState('');
  function onOverviewChange(e) {
    setOverview(e.target.value);
  }
  // overview End

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
  function addMoreSocialLink() {
    let oldLinks = [...webLinks];
    oldLinks.push({
      title: `customLinks${webLinks?.length + 1}`,
      icon: 'link',
      value: '',
    });
    setWebLinks(oldLinks);
  }
  function deleteSocialLinks(index) {
    let oldLinks = [...webLinks];
    oldLinks?.splice(index, 1);
    setWebLinks(oldLinks);
  }

  // webLinks end

  // Freeze MetaData start
  const [isMetaDaFreezed, setIsMetaDataFreezed] = useState(true);
  const [freezeMetadataDisabled, setFreezeMetadataDisabled] = useState(false);
  function onMetadataFreezeChange(data) {
    setIsMetaDataFreezed((o) => !o);
  }
  // Freeze MetaData end

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionPublished, setCollectionPublished] = useState(false);
  const [collectionDeleted, setCollectionDeleted] = useState(false);
  const [daoDetails, setDaoDetails] = useState({});

  function handelClickBack() {
    setoutlineKey((pre) => pre + 1);
    let currentIndex = currentStep.pop();
    setcurrentStep(currentStep.filter((x) => x !== currentIndex));
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
      setShowSuccessModal(false);
      setShowErrorModal(true);
    }
  }
  async function updateBlock(id) {
    try {
      setDataIsLoading(true);
      const data = await updateExistingProject(id);
    } catch (err) {
      setDataIsLoading(false);
      setShowSuccessModal(false);
      setShowErrorModal(true);
    }
  }

  const daysToSec = (days) => {
    return days * 24 * 60 * 60;
  };
  const monthsToSec = (months) => {
    return months * 30 * 24 * 60 * 60;
  };
  const yearsToSec = (years) => {
    return years * 60 * 60 * 24 * 365;
  };
  const convertSecondsToDHMS = (seconds) => {
    const oneDay = 24 * 60 * 60; // Number of seconds in one day
    const oneMonth = 30 * oneDay; // Number of seconds in one month
    const oneYear = 365 * oneDay; // Number of seconds in one year
    const years = Math.floor(seconds / oneYear);
    const months = Math.floor((seconds % oneYear) / oneMonth);
    const days = Math.floor(((seconds % oneYear) % oneMonth) / oneDay);
    return { years, months, days };
  };

  async function saveDraft() {
    if (userInfo?.id) {
      // outline
      if (currentStep.length === 2) {
        if (
          projectName !== '' &&
          projectCategory !== '' &&
          alreadyTakenProjectName === false &&
          daoSymbol !== '' &&
          alreadyTakenDaoSymbol === false
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
      collection_type: 'auto',
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
        setShowErrorModal(true);
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
    const allWebLinks = [...webLinks];

    let timeDuration = 0;
    if (timeboundDuration.days && timeboundDuration.days > 0) {
      timeDuration = timeDuration + daysToSec(timeboundDuration.days);
    }
    if (timeboundDuration.months && timeboundDuration.months > 0) {
      timeDuration = timeDuration + monthsToSec(timeboundDuration.months);
    }
    if (timeboundDuration.years && timeboundDuration.years > 0) {
      timeDuration = timeDuration + yearsToSec(timeboundDuration.years);
    }

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
      total_supply: supply ? supply : 1,
      price: basePrice,
      id: id,
      splitterId: splitter?.id ? splitter.id : '',
      timebound: timeDuration ? timeDuration : '',
    };
    await updateCollection(updatePayload)
      .then((res) => {
        setDataIsLoading(false);
        if (res?.code === 0) {
          setShowSuccessModal(true);
        } else {
          setShowErrorModal(true);
          setErrorMessage(res.message);
        }
      })
      .catch((error) => {
        setDataIsLoading(false);
        setShowErrorModal(true);
      });
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
        if (response?.royalty_percent) {
          setIsRoyaltyEarnableByOwner(true);
        }
        setSupply(response?.total_supply);
        setDataIsLoading(false);
        setProjectInfo(response);
        setProjectStatus(response?.status);
        setProjectCreated(true);
        setProjectId(response?.id);
        if (response?.price) {
          setBasePrice(response?.price);
        }
        if (response?.royalty_splitter?.id) {
          setSplitter(response?.royalty_splitter);
        }
        if (response?.token_limit_duration) {
          const { years, months, days } = convertSecondsToDHMS(
            response?.token_limit_duration
          );
          setIsTokenTimebound(true);
          setTimeBoundDuration({
            days: days,
            months: months,
            years: years,
          });
        }
        if (response?.type === 'right_attach') {
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
          setRoyaltyPercentageDisable(true);
          setSupplyDisable(true);
          setDisableNetwork(true);
          setCollectionPublished(true);
        }
        if (!response?.is_owner) {
          setNotOwner(true);
        }
        setoutlineKey((pre) => pre + 1);
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
      if (network === '0') {
        setIsNetworkEmpty(true);
      }
      if (projectCategory === '') {
        setEmptyProjectCategory(true);
      }
      if (
        (isRoyaltyEarnableByOwner && royaltyPercentage == 0) ||
        (isRoyaltyEarnableByOwner && !isRoyaltyPercentageValid)
      ) {
        setIsRoyaltyPercentageValid(false);
        return;
      } else if (
        projectName !== '' &&
        projectCategory !== '' &&
        alreadyTakenProjectName === false &&
        daoSymbol !== '' &&
        alreadyTakenDaoSymbol === false &&
        network !== '0'
      ) {
        const categoryName = projectCategoryList.find(
          (x) => x.id === parseInt(projectCategory)
        );
        setProjectCategoryName(categoryName ? categoryName.name : '');
        if (isTokenTimebound) {
          if (
            timeboundDuration.days ||
            timeboundDuration.months ||
            timeboundDuration.years
          ) {
            setcurrentStep([1, 2]);
          } else {
            setisTimeboundDurationValid(false);
          }
        } else {
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
  useEffect(() => {
    if (hasNextPageData) {
      getSplitters(network);
    }
  }, [splitterListPayload, userInfo?.id]);
  useEffect(() => {
    setDao_id(dao_id);
  }, [dao_id]);
  useEffect(() => {
    if (query?.id) {
      projectDetails(query?.id);
    }
    if (query?.dao_id) {
      setDao_id(query?.dao_id);
      let payload = {
        id: query?.dao_id,
      };
      getProjectDetailsById(payload).then((e) => {
        if (e?.code === 0) {
          setDaoDetails(e.project);
          setNetwork(e?.project?.blockchain);
        }
      });
    }
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  useEffect(() => {
    if (toCreateCollection) {
      saveDraft();
    }
    return () => {
      setToCreateCollection(false);
    };
  }, [userInfo?.id]);
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
                        {query?.draft
                          ? 'Edit'
                          : projectCreated
                          ? 'Edit'
                          : 'Create New'}{' '}
                        Collection
                      </h1>
                      <p className='txtblack text-[14px] text-textSubtle'>
                        Fill the require form to save collection
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
                    isPublished={collectionPublished}
                    key={outlineKey}
                    // logo
                    logoLabel='Collection Logo'
                    coverPhotoUrl={coverPhotoUrl}
                    onCoverPhotoSelect={onCoverPhotoSelect}
                    onCoverPhotoRemove={onCoverPhotoRemove}
                    // collection Type
                    showCollectionType={false}
                    // name
                    nameLabel='Collection'
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
                    // options
                    showOptions={true}
                    // Token Transferable
                    showTokenTransferable={true}
                    isTokenTransferable={isTokenTransferable}
                    onTokenTransferableChange={onTokenTransferableChange}
                    // Timebound token
                    showTimeBoundToken={true}
                    isTokenTimebound={isTokenTimebound}
                    onTokenTimeboundChange={onTokenTimeboundChange}
                    timeboundDuration={timeboundDuration}
                    onTimeboundDurationChange={(key, value) =>
                      onTimeboundDurationChange(key, value)
                    }
                    isTimeboundDurationValid={isTimeboundDurationValid}
                    // price and royalty settings
                    showPriceAndRoyaltySettings={true}
                    // base price
                    isBasePriceValid={isBasePriceValid}
                    basePrice={basePrice}
                    handleBasePriceValue={handleBasePriceValue}
                    // supply
                    showSupply={true}
                    supply={supply}
                    supplyDisable={supplyDisable}
                    isSupplyValid={isSupplyValid}
                    handleSupplyValue={handleSupplyValue}
                    // Royalty Earnable By Owner
                    showOwnerCanEarnRoyalty={true}
                    isRoyaltyEarnableByOwner={isRoyaltyEarnableByOwner}
                    onRoyaltyEarnableByOwnerChange={
                      onRoyaltyEarnableByOwnerChange
                    }
                    // Royalty Percentage
                    showRoyaltyPercentage={showRoyalties}
                    royaltyPercentageDisable={royaltyPercentageDisable}
                    royaltyPercentage={royaltyPercentage}
                    onRoyaltyPercentageChange={onRoyaltyPercentageChange}
                    isRoyaltyPercentageValid={isRoyaltyPercentageValid}
                    // splitter
                    splitter={splitter}
                    onsetSplitter={setSplitter}
                    splittersOptions={splittersOptions}
                    scrolledBottomSplitters={scrolledBottomSplitters}
                    onGetSplitterList={onGetSplitterList}
                    onSplitterDraftSave={onSplitterDraftSave}
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
                    // webLinks
                    showWebLinks={showWebLinks}
                    webLinks={webLinks}
                    onSocialLinkChange={onSocialLinkChange}
                    addMoreSocialLink={addMoreSocialLink}
                    deleteSocialLinks={deleteSocialLinks}
                    // category
                    showProjectCategory={true}
                    projectCategory={projectCategory}
                    emptyProjeCtCategory={emptyProjeCtCategory}
                    onProjectCategoryChange={onProjectCategoryChange}
                    // Freeze metadata
                    showFreezeMetadata={false}
                    onBlockchainCategoryChange={setNetwork}
                    collectionNetwork={network}
                    disableNetwork={disableNetwork}
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
                  // category
                  showProjectCategory={true}
                  projectCategoryName={projectCategoryName}
                  showFreezeMetadata={false}
                  isMetaDaFreezed={isMetaDaFreezed}
                  showTokenTransferable={true}
                  isTokenTransferable={isTokenTransferable}
                  showRoyaltyPercentage={showRoyalties}
                  royaltyPercentage={royaltyPercentage}
                  showSupplyData={true}
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
          buttonText={!collectionDeleted ? 'View Collection' : 'Close'}
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
