/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DebounceInput } from 'react-debounce-input';
import { createCollection } from 'services/collection/collectionService';
import {
  generateUploadkey,
  createMembershipNft,
  getassetDetails,
  getNftDetailsAutoType,
  updateMembershipNFT,
  deleteDraftNFT,
  createNft,
  updateNft,
  NFTRegisterAfterPublish,
} from 'services/nft/nftService';
import {
  updateRoyaltySplitter,
  getCollectionDetailsById,
  getUserCollections,
} from 'services/collection/collectionService';
import {
  ls_GetChainID,
  ls_GetUserToken,
  ls_GetWalletAddress,
  ls_GetWalletType,
} from 'util/ApplicationStorage';
import { uniqBy } from 'lodash';
import { getNotificationData } from 'redux/notification';
import { NETWORKS } from 'config/networks';
import { event } from 'nextjs-google-analytics';
import { getCurrentNetworkId } from 'util/MetaMask';
import { addDays, format, parse } from 'date-fns';
import getUnixTime from 'date-fns/getUnixTime';
import { DateRangePicker } from 'rsuite';
import Tooltip from 'components/Commons/Tooltip';
import Modal from 'components/Commons/Modal';
import SuccessModal from 'components/Modals/SuccessModal';
import Select, { components } from 'react-select';
import axios from 'axios';
import Config from 'config/config';
import ErrorModal from 'components/Modals/ErrorModal';
import MoonpayModal from 'components/Modals/MoonpayModal';
import Image from 'next/image';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import TagManager from 'react-gtm-module';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import NetworkSwitchModal from 'components/Commons/NetworkSwitchModal/NetworkSwitchModal';
import Matic from 'assets/images/polygon.svg';
import Eth from 'assets/images/eth.svg';
import Bnb from 'assets/images/bnb.svg';

import { createProvider } from 'util/smartcontract/provider';
import { erc721Instance } from 'config/ABI/erc721';
import { erc1155Instance } from 'config/ABI/erc1155';
import { ethers } from 'ethers';

const predefinedBottomRanges = [
  {
    label: '7 Days',
    closeOverlay: false,
    value: [new Date(), addDays(new Date(), 6)],
  },
  {
    label: '2 Weeks',
    closeOverlay: false,
    value: [new Date(), addDays(new Date(), 13)],
  },
  {
    label: '1 Month',
    closeOverlay: false,
    value: [new Date(), addDays(new Date(), 29)],
  },
];
const CURRENCY = [
  { id: 5, value: 'eth', label: 'ETH', icon: Eth },
  { id: 97, value: 'bnb', label: 'BNB', icon: Bnb },
  { id: 80001, value: 'matic', label: 'MATIC', icon: Matic },
  { id: 1, value: 'eth', label: 'ETH', icon: Eth },
  { id: 137, value: 'matic', label: 'MATIC', icon: Matic },
  { id: 56, value: 'bnb', label: 'BNB', icon: Bnb },
];
const Control = ({ children, ...props }) => {
  const { value } = props.selectProps;
  let selectedValue = CURRENCY.find((item) => value?.value === item?.value);
  return (
    <components.Control {...props}>
      <div className='flex items-center w-full h-[42px] rounded pl-2'>
        <div className='user-menu-dropdown'>
          <Image
            src={selectedValue?.icon}
            alt={selectedValue?.label}
            className='w-[18px] h-[18px]'
            height={18}
            width={18}
          />
        </div>
        {children}
      </div>
    </components.Control>
  );
};
export default function CreateNFTContent({ query }) {
  const provider = createProvider();

  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [holdCreateNFT, setHoldCreateNFT] = useState(false);
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isListUpdate, setIsListUpdate] = useState(false);
  const [showNetworkSwitch, setShowNetworkSwitch] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [collection, setCollection] = useState({});
  const nftList = [
    {
      tierName: '',
      assets: {
        file: null,
        path: null,
        isFileError: false,
        limitExceeded: false,
      },
      externalLink: '',
      description: '',
      benefits: [{ title: '' }, { title: '' }],
      properties: [
        {
          key: '',
          value: '',
          value_type: 'string',
          display_type: 'properties',
        },
      ],
      sensitiveContent: false,
      supply: 1,
      isOpen: true,
      blockchainCategory: 'polygon',
      indexId: 1,
      price: 0,
      salesTimeRange: null,
      token_id: null,
    },
  ];
  const [nfts, setNfts] = useState(nftList);
  const audioRef = useRef();
  const [checkedValidation, setCheckedValidation] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [indexOfNfts, setIndexOfNfts] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [collection_id, setCollection_id] = useState(null);
  const [projectCreated, setProjectCreated] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showMoonpayModal, setShowMoonpayModal] = useState(false);
  const [options, setOptions] = useState([]);
  const jobIds = [];
  const [calledIds, setCalledIds] = useState([]);
  const [showDataUploadingModal, setShowDataUploadingModal] = useState(false);
  const [nftItem, setNft] = useState(null);

  const [errorTitle, setErrorTitle] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isNftLoading, setIsNftLoading] = useState(false);
  const [hasNextPageData, setHasNextPageData] = useState(true);
  const [asseteRemoveInUpdateMode, setAsseteRemoveInUpdateMode] =
    useState(false);

  const [payload, setPayload] = useState({
    page: 1,
    perPage: 10,
    keyword: '',
    order_by: 'newer',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [redirectOnError, setRedirectOnError] = useState(false);
  const minPrice = 0;

  useEffect(() => {
    if (holdCreateNFT) {
      nextHandle();
    }

    return () => {
      setHoldCreateNFT(false);
    };
  }, [userinfo?.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('wheel', function (event) {
        if (document.activeElement.type === 'number') {
          document.activeElement.blur();
        }
      });
    }
  }, []);

  function onTextfieldChange(index, fieldName, value) {
    setValue(index, fieldName, value);
  }
  const useDebounceCallback = (delay = 100, cleaning = true) => {
    // or: delayed debounce callback
    const ref = React.useRef();
    React.useEffect(() => {
      if (cleaning) {
        // cleaning uncalled delayed callback with component destroying
        return () => {
          if (ref.current) clearTimeout(ref.current);
        };
      }
    }, []);
    return (callback) => {
      if (ref.current) clearTimeout(ref.current);
      ref.current = setTimeout(callback, delay);
    };
  };
  const delayCallback = useDebounceCallback(500);

  async function collectionFetch() {
    setIsLoading(true);
    await getUserCollections(payload)
      .then((res) => {
        if (res?.code === 0) {
          // const matchedBlockchainDao = res?.data?.filter(
          //   (dao) => dao?.blockchain === collection?.blockchain
          // );
          const daoList = [...options];
          const mergedDaoList = [...daoList, ...res?.data];
          const uniqDaoList = uniqBy(mergedDaoList, function (e) {
            return e.id;
          });
          setOptions(uniqDaoList);
          setIsLoading(false);
          if (res?.data?.length === 0) {
            setHasNextPageData(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }
  function setValue(index, fieldName, value) {
    let oldNfts = [...nfts];
    oldNfts[index][fieldName] = value;
    setNfts(oldNfts);
  }
  function addMoreTier() {
    let oldNfts = [...nfts];
    oldNfts.push({
      tierName: '',
      assets: {
        file: null,
        path: null,
        isFileError: false,
        limitExceeded: false,
      },
      externalLink: '',
      description: '',
      benefits: [{ title: '' }, { title: '' }],
      properties: [
        {
          key: '',
          value: '',
          value_type: 'string',
          display_type: 'properties',
        },
      ],
      sensitiveContent: false,
      supply: 1,
      isOpen: true,
      blockchainCategory: 'polygon',
      indexId: oldNfts.length + 1,
      price: !updateMode && collection?.price ? collection?.price : 0,
      salesTimeRange: null,
      token_id: null,
    });
    setNfts(oldNfts);
  }
  function deleteNfs(index) {
    let oldNfts = [...nfts];
    oldNfts.splice(index, 1);
    setNfts(oldNfts);
  }
  function nftFileChangeHandler(event, index) {
    let oldNfts = [...nfts];
    const nftFile = oldNfts[index].assets;
    try {
      const file = event.currentTarget.files[0];
      const usedSize = userinfo['storage_usage'];
      let totalSize = 0;
      // const usedSize = 4000;
      // let totalSize = 0;
      if (usedSize) {
        if (usedSize && file) {
          totalSize = (usedSize + file.size) / 1024 / 1024;
          if (file.size / 1024 / 1024 > 100) {
            setErrorTitle('Maximum file size limit exceeded');
            setErrorMessage(`You can add your assets up to 100MB.`);
            setShowErrorModal(true);
            event.currentTarget.value = '';
          } else if (totalSize > 1024) {
            setErrorTitle('Maximum file size limit exceeded');
            setErrorMessage(
              `You can add your assets up to 1GB. you have a remaining of ${(
                1024 -
                usedSize / 1024 / 1024
              ).toFixed(2)} MB storage`
            );
            setShowErrorModal(true);
            event.currentTarget.value = '';
          } else {
            nftFile.file = file;
            nftFile.path = URL.createObjectURL(file);
            nftFile.isFileError = false;
            if (updateMode) {
              setAsseteRemoveInUpdateMode(true);
            }
          }
        }
      } else if (!usedSize) {
        nftFile.file = file;
        nftFile.path = URL.createObjectURL(file);
        nftFile.isFileError = false;
        if (updateMode) {
          setAsseteRemoveInUpdateMode(true);
        }
      }
    } catch {
      nftFile.isFileError = true;
    }
    setNfts(oldNfts);
  }
  function addMoreBenefits(index) {
    let oldNfts = nfts.map((nft, i) => {
      if (i === index) {
        return {
          ...nft,
          benefits: [...nft.benefits, { title: '' }],
        };
      }
      return nft;
    });
    setNfts(oldNfts);
  }
  function onBenefitChange(index, benefitIndex, value) {
    let oldNfts = nfts.map((nft, i) => {
      if (i === index) {
        return {
          ...nft,
          benefits: nft?.benefits?.map((benefit, ind) => {
            if (ind === benefitIndex) {
              return {
                title: value,
              };
            }
            return benefit;
          }),
        };
      }
      return nft;
    });
    setNfts(oldNfts);
  }
  function deleteBenefits(index, benefitIndex) {
    let oldNfts = [...nfts];
    oldNfts[index].benefits.splice(benefitIndex, 1);
    setNfts(oldNfts);
  }
  function handleOnChangePropertyType(event, index) {
    const value = event.target.value;
    let tempProperty = [...propertyList];
    const property = propertyList[index];
    property.key = value;
    setPropertyList(tempProperty);
  }
  function handleOnChangePropertyName(event, index) {
    const value = event.target.value;
    let tempProperty = [...propertyList];
    const property = tempProperty[index];
    property.value = value;
    setPropertyList(tempProperty);
  }
  function addProperty() {
    const tempProperty = [...propertyList];
    tempProperty.push({
      key: '',
      value: '',
      value_type: 'string',
      display_type: 'properties',
    });
    setPropertyList(tempProperty);
  }
  function removeProperty(index) {
    setIsListUpdate(true);
    let tempProperty = [...propertyList];
    tempProperty = tempProperty.filter((prop) => prop !== tempProperty[index]);
    setPropertyList(tempProperty);
    setTimeout(() => {
      setIsListUpdate(false);
    }, 50);
  }
  function onSensitiveContentChange(index) {
    let oldNfts = [...nfts];
    oldNfts[index].sensitiveContent = !oldNfts[index].sensitiveContent;
    setNfts(oldNfts);
  }
  function openPropertyModal(index) {
    setIndexOfNfts(index);
    let oldNfts = [...nfts];
    setPropertyList(oldNfts[index].properties);
    setShowPropertyModal(true);
  }
  function onSavePropertiesChange() {
    setIsListUpdate(true);
    let oldNfts = [...nfts];
    oldNfts[indexOfNfts].properties = propertyList;
    setNfts(oldNfts);
    setShowPropertyModal(false);
    setPropertyList([]);
    setTimeout(() => {
      setIsListUpdate(false);
    }, 50);
  }
  async function collectionCreate() {
    event('create_collection', {
      category: 'collection',
      label: 'blockchain',
      value: ls_GetChainID(),
    });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'collection',
        pageTitle: 'create_collection',
        label: 'blockchain',
        value: ls_GetChainID(),
      },
    });
    let collection_id = '';
    let payload = {
      collection_type: 'auto',
      blockchain: ls_GetChainID(),
    };
    await createCollection(payload).then((res) => {
      collection_id = res.collection.id;
      let members = [{ wallet_address: userinfo?.eoa, royalty: 100 }];
      let formData = new FormData();
      formData.append('royalty_data', JSON.stringify(members));
      formData.append('collection_uid', res.collection.id);
      // updateRoyaltySplitter(formData);
      setCollection_id(collection_id);
    });
    return collection_id;
  }
  const handleErrorState = (msg, jobId) => {
    if (typeof window !== 'undefined') {
      jobId && localStorage.removeItem(`${jobId}`);
    }

    setErrorTitle('Error');
    setErrorMessage(msg);
    setShowErrorModal(true);
    setShowDataUploadingModal(false);
    setIsNftLoading(false);
    setShowDataUploadingModal(false);
  };

  const verifyTokenId = async (nftId, hash) => {
    const tnxHash = await provider.waitForTransaction(hash);
    await NFTRegisterAfterPublish(nftId, hash)
      .then((res) => {
        if (res?.code !== 0) {
          setShowDataUploadingModal(false);
          setShowErrorModal(true);
          setErrorTitle(
            'NFT is not on blockchain yet, please try saving again'
          );
          setErrorMessage(res?.message);
        }
      })
      .catch((error) => {
        setShowDataUploadingModal(false);
        setShowErrorModal(true);
        setErrorTitle('NFT is not on blockchain yet, please try saving again');
        setErrorMessage(JSON.stringify(error));
      });
  };

  const registerNFT = async (price, ipfsLink, supply, nftId, token_id) => {
    if (
      collection?.id &&
      collection?.type === 'auto' &&
      collection?.status === 'published' &&
      collection?.contract_address &&
      !token_id &&
      ipfsLink
    ) {
      if (ipfsLink) {
        let walletType = await ls_GetWalletType();
        let signer;

        if (walletType === 'metamask') {
          if (!window.ethereum) throw new Error(`User wallet not found`);
          await window.ethereum.enable();
          const userProvider = await new ethers.providers.Web3Provider(
            window.ethereum
          );
          signer = await userProvider.getSigner();
        } else if (walletType === 'magicwallet') {
          signer = await etherMagicProvider.getSigner();
        }

        if (collection?.token_standard == 'ERC721') {
          const priceContract = erc721Instance(
            collection?.contract_address,
            // '0x695397fae5e6f4aa6dff8ebc2d723b354fb1c6fa',
            provider
          );
          const nftInfo = {
            price: ethers.utils.parseEther(price.toString()),
            uri: `${Config.PINATA_URL}${ipfsLink}`,
          };
          try {
            console.log(`${collection?.token_standard} :`, price);
            const response = await priceContract
              .connect(signer)
              .addNewToken(nftInfo.price, nftInfo.uri);
            if (response?.hash) {
              await verifyTokenId(nftId, response?.hash);
            }
          } catch (error) {
            setShowDataUploadingModal(false);
            setShowErrorModal(true);
            setErrorTitle(
              'NFT is not on blockchain yet, please try saving again'
            );
            setErrorMessage(JSON.stringify(error));
            console.log(error);
          }
        }

        if (collection?.token_standard == 'ERC1155') {
          const priceContract = erc1155Instance(
            collection?.contract_address,
            // '0xED129b2A708CA6bd20d53c63Db5263870D12b2B9',
            provider
          );
          const nftInfo = {
            price: ethers.utils.parseEther(price.toString()),
            uri: `${Config.PINATA_URL}${ipfsLink}`,
            total_supply: supply,
          };
          try {
            console.log(`${collection?.token_standard} :`, price);
            const response = await priceContract
              .connect(signer)
              .addNewToken(nftInfo.price, nftInfo.uri, nftInfo.total_supply);
            if (response?.hash) {
              await verifyTokenId(nftId, response?.hash);
            }
          } catch (error) {
            setShowDataUploadingModal(false);
            setShowErrorModal(true);
            setErrorTitle(
              'NFT is not on blockchain yet, please try saving again'
            );
            setErrorMessage(JSON.stringify(error));
            console.log(error);
          }
        }
      }
    }
  };

  async function saveNFTDetails(assetId, jobId) {
    let nft = {};
    if (typeof window !== 'undefined') {
      nft = JSON.parse(localStorage.getItem(`${jobId}`));
    }

    const request = new FormData();
    request.append('asset_uid', assetId);
    request.append('collection_uid', collection_id);
    request.append('tier_name', nft.tier_name);
    request.append('supply', nft.supply ? nft.supply : 1);
    request.append('blockchain', nft.blockchain);
    request.append('description', nft.description);
    request.append('external_link', nft.external_link);
    request.append('sensitive_content', nft.sensitive_content);
    request.append('attributes', JSON.stringify(nft.properties));
    request.append('job_id', nft.job_id);
    const benefit_array = nft.benefit_array.filter((x) => x.title !== '');
    request.append('benefit_array', JSON.stringify(benefit_array));
    request.append('price', nft?.price ? nft?.price : minPrice);
    if (nft?.salesTimeRange && nft?.salesTimeRange?.length > 0) {
      if (nft?.salesTimeRange[0]) {
        try {
          const formattedStartDate = new Date(nft?.salesTimeRange[0]);
          request.append('start_time', getUnixTime(formattedStartDate));
        } catch (error) {
          console.log(error);
        }
      }
      if (nft?.salesTimeRange[1]) {
        try {
          const formattedEndDate = new Date(nft?.salesTimeRange[1]);
          request.append('end_time', getUnixTime(formattedEndDate));
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (!updateMode) {
      event('create_auto_type_nft', { category: 'nft' });
      TagManager.dataLayer({
        dataLayer: {
          event: 'click_event',
          category: 'nft',
          pageTitle: 'create_auto_type_nft',
        },
      });
      await createNft(request)
        .then(async (res) => {
          if (res?.code === 0) {
            await registerNFT(
              res?.lnft?.more_info?.price
                ? res?.lnft?.more_info?.price
                : minPrice,
              res?.lnft?.metadata_url,
              res?.lnft?.supply,
              res?.lnft?.id,
              res?.lnft?.token_id
            );
            if (typeof window !== 'undefined') {
              localStorage.removeItem(`${jobId}`);
              const index = jobIds.indexOf(jobId);
              if (index > -1) {
                jobIds.splice(index, 1); // 2nd parameter means remove one item only
              }
              const upload_number = localStorage.getItem('upload_number');
              const update_upload_number = parseInt(upload_number) - 1;
              localStorage.setItem('upload_number', update_upload_number);
              if (update_upload_number === 0) {
                setShowDataUploadingModal(false);
                setShowSuccessModal(true);
              }
            }
          } else {
            handleErrorState(res.message, jobId);
          }
        })
        .catch((err) => {
          setShowDataUploadingModal(false);
          setShowErrorModal(true);
          setErrorMessage(JSON.stringify(err));
          console.log(err);
        });
    } else if (updateMode) {
      await updateNft(nftItem.id, request)
        .then((res) => {
          if (res?.code === 0) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem(`${jobId}`);
            }
            setShowDataUploadingModal(false);
            setShowSuccessModal(true);
          } else {
            handleErrorState(res.message, jobId);
          }
        })
        .catch((err) => {
          handleErrorState('Failed to create NFT', jobId);
        });
    }
  }
  async function uploadAFile(nft) {
    let headers;
    headers = {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${ls_GetUserToken()}`,
    };
    let formdata = new FormData();
    formdata.append('file', nft.assets.file);
    if (collection?.status === 'published') {
      formdata.append('target', 'ipfs');
    } else {
      formdata.append('target', 'gcp');
    }
    await axios({
      method: 'POST',
      url: Config.FILE_SERVER_URL,
      data: formdata,
      headers: headers,
    })
      .then((response) => {
        let data = {
          collection_uid: collection_id,
          tier_name: nft?.tierName,
          supply: nft?.supply,
          blockchain: nft?.blockchainCategory,
          description: nft?.description,
          external_link: nft?.externalLink,
          sensitive_content: nft?.sensitiveContent,
          benefit_array: nft?.benefits.filter((x) => x?.title !== ''),
          job_id: response['job_id'],
          properties: nft?.properties,
          price: nft?.price,
          salesTimeRange: nft?.salesTimeRange,
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(`${response['job_id']}`, JSON.stringify(data));
        }
        jobIds.push(response['job_id']);
        const notificationData = {
          etherscan: '',
          function_uuid: response['job_id'],
          data: '',
        };
        dispatch(getNotificationData(notificationData));
      })
      .catch((err) => {
        handleErrorState('Failed to create NFT');
      });
  }
  async function updateNFT(nft) {
    const request = new FormData();
    request.append('tier_name', nft?.tierName);
    request.append('asset_uid', nftItem?.asset?.id);
    request.append('external_link', nft?.externalLink);
    request.append('description', nft?.description);
    const benefit_array = nft?.benefits?.filter((x) => x?.title !== '');
    request.append('benefit_array', JSON.stringify(benefit_array));
    request.append('attributes', JSON.stringify(nft?.properties));
    request.append('sensitive_content', nft?.sensitiveContent);
    request.append('supply', nft?.supply);
    request.append('price', nft?.price ? nft?.price : minPrice);

    if (nft?.salesTimeRange && nft?.salesTimeRange?.length > 0) {
      if (nft?.salesTimeRange[0]) {
        try {
          const formattedStartDate = new Date(nft?.salesTimeRange[0]);
          request.append('start_time', getUnixTime(formattedStartDate));
        } catch (error) {
          console.log(error);
        }
      }
      if (nft?.salesTimeRange[1]) {
        try {
          const formattedEndDate = new Date(nft?.salesTimeRange[1]);
          request.append('end_time', getUnixTime(formattedEndDate));
        } catch (error) {
          console.log(error);
        }
      }
    }
    await updateNft(nftItem?.id, request)
      .then(async (res) => {
        if (res?.code === 0) {
          await registerNFT(
            nftItem?.price ? nftItem?.price : minPrice,
            nftItem?.metadata_url,
            nftItem?.supply,
            nftItem?.id,
            nftItem?.token_id
          );
          setShowDataUploadingModal(false);
          setShowSuccessModal(true);
        } else {
          handleErrorState(res?.message);
        }
      })
      .catch((err) => {
        handleErrorState('Failed to update NFT');
      });
  }
  async function createBlock(validateNfts) {
    setShowDataUploadingModal(true);
    if (!updateMode) {
      if (query?.collection_id || collection_id) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('upload_number', validateNfts.length);
        }
        for (const iterator of validateNfts) {
          await uploadAFile(iterator);
        }
        // recheckStatus();
      } else {
        const collection_id = await collectionCreate();
        if (typeof window !== 'undefined') {
          localStorage.setItem('upload_number', validateNfts?.length);
        }
        for (const iterator of validateNfts) {
          await uploadAFile(iterator);
        }
        // recheckStatus();
        if (typeof window !== 'undefined') {
          const process_status = localStorage.getItem('upload_number');
        }
      }
    } else if (updateMode) {
      if (!asseteRemoveInUpdateMode) {
        await updateNFT(validateNfts[0]);
      } else if (asseteRemoveInUpdateMode) {
        await uploadAFile(validateNfts[0]);
      }
    }
  }
  async function nextHandle() {
    const validateNfts = nfts.filter(
      (element) =>
        element?.tierName !== '' &&
        element?.assets?.file !== null &&
        element?.assets?.isFileError === false &&
        element?.assets?.limitExceeded === false &&
        element?.nftName !== '' &&
        element?.supply !== ''
    );

    if (isPreview) {
      if (userinfo?.id) {
        await createBlock(validateNfts);
      } else {
        let currentNetwork = await getCurrentNetworkId();
        if (NETWORKS?.[currentNetwork]) {
          setShowConnectModal(true);
          setHoldCreateNFT(true);
        } else {
          setShowNetworkSwitch(true);
        }
      }
    } else {
      setCheckedValidation(true);
      if (validateNfts.length === nfts.length) {
        window.scroll({ top: 0, behavior: 'smooth' });
        setIsPreview(true);
      } else {
        const invalidNfts = nfts.filter(
          (element) =>
            element.tierName === '' ||
            element.assets.file === null ||
            element.assets.isFileError === true ||
            element.assets.limitExceeded === true ||
            element.nftName === '' ||
            element.supply === ''
        );
        invalidNfts.forEach((element) => {
          document.getElementById(`nft-${element.indexId}`).scrollIntoView({
            behavior: 'smooth',
          });
        });
      }
    }
  }
  function validate() {
    if (typeof window !== 'undefined') {
      for (const localkey in localStorage) {
        const projectDeployStatus = fileUploadNotification.find(
          (x) => x.function_uuid === localkey
        );
        if (projectDeployStatus) {
          if (projectDeployStatus.data !== '') {
            const data = JSON.parse(projectDeployStatus.data);
            if (data.Data['assetId'] && data.Data['assetId'].length > 0) {
              if (!calledIds.includes(data.Data['assetId'])) {
                saveNFTDetails(
                  data.Data['assetId'],
                  projectDeployStatus.function_uuid
                );
                let nftId = [...calledIds, data.Data['assetId']];
                setCalledIds(nftId);
              }
            }
          } else {
            getassetDetails(projectDeployStatus.function_uuid).then((res) => {
              if (res.code === 0) {
                if (res['asset'] && res['asset']['id']) {
                  const asstdata = {
                    Data: { assetId: res['asset']['id'] },
                  };
                  const deployData = {
                    function_uuid: projectDeployStatus.function_uuid,
                    data: JSON.stringify(asstdata),
                  };
                  dispatch(getNotificationData(deployData));
                }
              } else if (res.code === 5001) {
                setTimeout(function () {
                  const notificationData = {
                    etherscan: '',
                    function_uuid: projectDeployStatus.function_uuid,
                    data: '',
                  };
                  dispatch(getNotificationData(notificationData));
                }, 30000);
              }
            });
          }
        }
      }
    }
  }
  async function nftDetails(id) {
    setIsNftLoading(true);
    await getNftDetailsAutoType(id)
      .then((resp) => {
        if (resp.code === 0) {
          const nft = resp.lnft;
          setUpdateMode(true);
          setNft(nft);
          onTextfieldChange(0, 'tierName', nft.name);
          const assets = {
            file: { type: nft.asset.asset_type },
            path: nft.asset.path,
            isFileError: false,
            limitExceeded: false,
          };
          onTextfieldChange(0, 'assets', assets);
          onTextfieldChange(0, 'externalLink', nft.external_url);
          onTextfieldChange(0, 'description', nft.description);
          try {
            const benefit = JSON.parse(resp.more_info.benefits);
            if (benefit && benefit?.length === 0) {
              onTextfieldChange(0, 'benefits', [{ title: '' }]);
            } else if (benefit && benefit?.length > 0) {
              onTextfieldChange(0, 'benefits', benefit);
            }
          } catch (error) {
            onTextfieldChange(0, 'benefits', [{ title: '' }]);
          }
          onTextfieldChange(0, 'properties', nft.attributes);
          onTextfieldChange(0, 'sensitiveContent', nft.sensitive_content);
          onTextfieldChange(0, 'supply', nft.supply);
          if (
            resp?.more_info?.start_datetime &&
            resp?.more_info?.end_datetime
          ) {
            try {
              const dateRange = [
                new Date(resp?.more_info?.start_datetime),
                new Date(resp?.more_info?.end_datetime),
              ];
              onTextfieldChange(0, 'salesTimeRange', dateRange);
            } catch (error) {
              console.log(error);
            }
          }
          if (resp?.more_info?.price) {
            onTextfieldChange(0, 'price', resp?.more_info?.price);
          }
          if (nft?.token_id) {
            onTextfieldChange(0, 'token_id', nft.token_id);
          }
          setIndexOfNfts(0);
          setIsNftLoading(false);
        } else {
          setIsNftLoading(false);
        }
      })
      .catch((e) => {
        setIsNftLoading(false);
      });
  }
  const getCollectionDetail = async (collectionId) => {
    let payload = {
      id: collectionId,
    };
    await getCollectionDetailsById(payload).then((resp) => {
      if (resp?.code === 0) {
        setCollection(resp.collection);
      }
    });
  };
  function removePropertyOfTier(nft, index) {
    setIsListUpdate(true);
    let tempProperty = [...nft.properties];
    tempProperty = tempProperty.filter((prop) => prop !== tempProperty[index]);
    let oldNfts = [...nfts];
    oldNfts[indexOfNfts].properties = tempProperty;
    setNfts(oldNfts);
    setTimeout(() => {
      setIsListUpdate(false);
    }, 50);
  }
  const onDeleteNFT = async () => {
    setIsNftLoading(true);
    await deleteDraftNFT(nftItem?.id)
      .then((res) => {
        if (res.code === 0) {
          setShowDeleteModal(false);
          setShowDeleteSuccessModal(true);
          setIsNftLoading(false);
        } else {
          setShowErrorModal(true);
          setErrorTitle('Opps, something went wrong');
          setErrorMessage(res.message);
          setIsNftLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsNftLoading(false);
      });
  };

  useEffect(() => {
    validate();
  }, [fileUploadNotification]);
  useEffect(() => {
    setPropertyList(propertyList);
  }, [propertyList]);
  useEffect(() => {
    setNfts(nfts);
  }, [nfts]);
  useEffect(() => {
    setCollection_id(collection_id);
  }, [collection_id]);
  useEffect(() => {
    if (query?.collection_id) {
      setCollection_id(query?.collection_id);
      getCollectionDetail(query?.collection_id);
    }
  }, []);
  useEffect(() => {
    try {
      const nftId = query?.nftId;
      if (nftId) {
        nftDetails(nftId);
      }
    } catch {}
  }, []);
  useEffect(() => {
    if (hasNextPageData) {
      collectionFetch();
    }
  }, [payload]);

  let curCollection = collection_id
    ? options.find((item) => item.id === collection_id)
    : null;

  let networkName = curCollection?.blockchain
    ? NETWORKS?.[Number(curCollection?.blockchain)]?.networkName
    : null;

  useEffect(() => {
    // for attached collection
    let collectionBlockchain = CURRENCY.find(
      (value) => value?.id === Number(collection?.blockchain)
    );

    // for selected Collection
    let selectedCollection = collection_id
      ? options.find((item) => item.id === collection_id)
      : null;
    let selectedCollectionBlockchain = null;
    if (selectedCollection) {
      selectedCollectionBlockchain = CURRENCY.find(
        (value) => value?.id === Number(selectedCollection?.blockchain)
      );
    }

    // for user wallet
    let userWalletBlockchain = CURRENCY.find(
      (value) => value?.id === Number(ls_GetChainID())
    );

    if (collectionBlockchain) {
      setSelectedCurrency(collectionBlockchain);
    } else if (selectedCollectionBlockchain) {
      setSelectedCurrency(selectedCollectionBlockchain);
    } else if (userWalletBlockchain) {
      setSelectedCurrency(userWalletBlockchain);
    }
  }, [collection, collection_id]);

  useEffect(() => {
    if (collection?.price && !updateMode) {
      let oldNftList = [...nfts];
      oldNftList[0].price = collection?.price;
      setNfts(oldNftList);
    }
  }, [collection, updateMode]);

  const [selectedCurrency, setSelectedCurrency] = useState({
    id: 0,
    value: 'eth',
    label: 'ETH',
    icon: Eth,
  });
  const canEdit = () => {
    if (collection?.status === 'published' && updateMode) {
      return false;
    } else {
      return true;
    }
  };
  const isERC721 = () => {
    if (
      collection?.status === 'published' &&
      collection?.token_standard === 'ERC721'
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {isNftLoading && <div className='loading'></div>}
      <div className='max-w-[600px] md:mx-auto pt-6 md:pt-0 md:mt-[40px] mx-4  '>
        <div className='mb-[24px] flex flex-wrap items-center'>
          <div>
            <h1 className='text-[28px] font-black mb-[6px]'>
              {isPreview
                ? 'Preview NFT'
                : updateMode
                ? 'Update NFT'
                : 'Create NFT'}
            </h1>
            <p className='text-[14px] text-textSubtle word-break'>
              {isPreview
                ? ' Preview the NFT'
                : ' Please fill in all required data to create your NFT'}
            </p>
          </div>
          <div className='ml-auto'>
            {updateMode &&
              nftItem?.is_owner &&
              !isPreview &&
              collection?.status === 'draft' && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className='px-4 py-2 text-white bg-danger-1  rounded'
                >
                  <i className='fa-solid fa-trash mr-1'></i>
                  <span>Delete</span>
                </button>
              )}
          </div>
        </div>
        <div>
          {nfts.map((nft, index) => (
            <div
              key={index}
              id={`nft-${index + 1}`}
              className='mb-6 rounded-[12px]  border border-divider  p-4'
            >
              {nfts.length > 1 && !isPreview && (
                <div className='text-right'>
                  <i
                    onClick={() => deleteNfs(index)}
                    className='cursor-pointer fa-solid fa-trash text-danger-1/[0.7]'
                  ></i>
                </div>
              )}
              {/* name */}
              <div className='mb-6 md:w-[50%]'>
                <p className='text-txtblack text-[14px] font-bold font-satoshi-bold'>
                  Type your NFT name{' '}
                  <span className='ml-1 text-danger-1 font-bold'>*</span>
                </p>
                <>
                  <DebounceInput
                    minLength={1}
                    debounceTimeout={0}
                    className={`debounceInput mt-1 ${
                      isPreview ? ' !border-none bg-transparent' : ''
                    } `}
                    disabled={isPreview || !canEdit()}
                    value={nft.tierName}
                    onChange={(e) =>
                      onTextfieldChange(index, 'tierName', e.target.value)
                    }
                    placeholder='Specify name for the NFT'
                  />
                  {checkedValidation && nft.tierName === '' && (
                    <p className='validationTag text-sm'>
                      NFT name is required
                    </p>
                  )}
                </>
              </div>
              {/* asset */}
              <div className='mb-6'>
                <label
                  className='block text-[14px] font-bold font-satoshi-bold text-txtblack'
                  htmlFor='dropzone-file'
                >
                  Upload assets{' '}
                  <span className='ml-1 text-danger-1 font-bold'>*</span>
                </label>
                <p className='block text-[14px] text-textSubtle mb-4 word-break'>
                  You can upload assets in any of these formats. PNG, GIF, WEBP,
                  MP3, or MP4. Max 100 MB
                </p>
                <div className='flex items-center w-full gap-4'>
                  <div
                    className={`flex justify-center items-center max-w-full ${
                      nft.assets.file?.type?.split('/')[0]?.toLowerCase() ===
                      'video'
                        ? ''
                        : 'w-40 h-40'
                    }`}
                  >
                    <label
                      htmlFor={`dropzone-file${index}`}
                      className={`flex flex-col justify-center items-center w-full  ${
                        nft.assets.file?.type?.split('/')[0]?.toLowerCase() ===
                        'video'
                          ? ''
                          : 'h-40'
                      } ${
                        nft.assets.file ? '' : 'bg-white-filled-form'
                      } rounded-xl  cursor-pointer`}
                    >
                      <div className='flex flex-col justify-center items-center pt-5 pb-6 relative'>
                        {nft.assets.file ? (
                          <>
                            {nft.assets.file?.type
                              ?.split('/')[0]
                              ?.toLowerCase() === 'image' && (
                              <Image
                                height={40}
                                width={40}
                                unoptimized
                                src={nft.assets.path}
                                alt='nft'
                                className='rounded-xl  max-w-full w-40 h-40 object-cover'
                              />
                            )}
                            {nft.assets.file?.type
                              ?.split('/')[0]
                              ?.toLowerCase() === 'audio' && (
                              <>
                                <i
                                  onClick={(e) =>
                                    nftFileChangeHandler(e, index)
                                  }
                                  className='absolute top-0 text-[18px] cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark'
                                ></i>
                                <audio
                                  ref={audioRef}
                                  src={nft.assets.path}
                                  controls
                                  autoPlay={false}
                                  className='ml-[8rem]'
                                />
                              </>
                            )}
                            {nft.assets.file?.type
                              ?.split('/')[0]
                              ?.toLowerCase() === 'video' && (
                              <>
                                <i
                                  onClick={(e) =>
                                    nftFileChangeHandler(e, index)
                                  }
                                  className='absolute top-0 text-[18px] cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark'
                                ></i>
                                <video width='650' height='400' controls>
                                  <source
                                    src={nft.assets.path}
                                    type='video/mp4'
                                  />
                                </video>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <svg
                              width='39'
                              height='39'
                              viewBox='0 0 39 39'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                opacity='0.4'
                                d='M27.8167 38.5097H11.4644C5.0695 38.5097 0.773438 34.0245 0.773438 27.3479V11.9373C0.773438 5.2606 5.0695 0.77356 11.4644 0.77356H27.8186C34.2135 0.77356 38.5095 5.2606 38.5095 11.9373V27.3479C38.5095 34.0245 34.2135 38.5097 27.8167 38.5097Z'
                                fill='#9499AE'
                              />
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M18.2168 13.368C18.2168 15.9529 16.113 18.0567 13.5281 18.0567C10.9413 18.0567 8.83938 15.9529 8.83938 13.368C8.83938 10.783 10.9413 8.67737 13.5281 8.67737C16.113 8.67737 18.2168 10.783 18.2168 13.368ZM33.6045 23.5805C34.0441 24.0069 34.3592 24.4937 34.5667 25.0126C35.195 26.5824 34.8686 28.4692 34.1969 30.0239C33.4007 31.8749 31.8761 33.273 29.9554 33.8843C29.1025 34.1579 28.2082 34.2749 27.3157 34.2749H11.5024C9.92882 34.2749 8.53636 33.9089 7.39484 33.2221C6.67974 32.7919 6.55332 31.8013 7.08352 31.156C7.97031 30.0805 8.84579 29.0013 9.72882 27.9126C11.4118 25.8296 12.5458 25.2258 13.8062 25.756C14.3175 25.9748 14.8307 26.305 15.359 26.6522C16.7666 27.5843 18.7232 28.8635 21.3006 27.4749C23.0623 26.5115 24.085 24.8631 24.9751 23.4283L24.9931 23.3994C25.053 23.3033 25.1124 23.2073 25.1716 23.1116C25.4743 22.6226 25.7724 22.1409 26.1101 21.6975C26.5289 21.1484 28.0837 19.4314 30.0931 20.6541C31.3743 21.4239 32.4516 22.4654 33.6045 23.5805Z'
                                fill='#9499AE'
                              />
                            </svg>
                            <p className='text-xs mt-2 text-color-ass-8'>
                              Add Assets from
                            </p>
                            <p className='text-xs text-primary-color-1'>
                              Computer
                            </p>
                          </>
                        )}
                      </div>

                      <input
                        disabled={isPreview || !canEdit()}
                        key={index}
                        id={`dropzone-file${index}`}
                        type='file'
                        className='hidden'
                        accept='audio/*, image/*, video/*'
                        onChange={(e) => nftFileChangeHandler(e, index)}
                      />
                    </label>
                  </div>
                  <div
                    className={`text-[13px] text-textSubtle ${
                      nft.assets.file?.type?.split('/')[0]?.toLowerCase() ===
                      'audio'
                        ? 'ml-auto'
                        : ''
                    }`}
                  >
                    Looking for <br /> customize design ? <br />
                    <a
                      href='mailto:contact@decir.io'
                      className='font-bold text-primary-900 underline hover:!text-primary-900'
                    >
                      Contact US
                    </a>
                  </div>
                </div>
                {nft.assets.isFileError && (
                  <p className='validationTag text-sm'>
                    Please select a valid file.
                  </p>
                )}
                {checkedValidation && !nft.assets.file && (
                  <p className='validationTag text-sm'>
                    Asset field is required
                  </p>
                )}
                {nft.assets.limitExceeded && (
                  <p className='validationTag text-sm'>
                    {`You can upload your assets up to 100 MB`}
                  </p>
                )}
              </div>
              {/* benefit */}
              <div className='mb-3'>
                <div className='flex items-center'>
                  <Tooltip message='You can specific benefits for users like exclusive permission'></Tooltip>
                  <p className='text-[14px] font-bold font-satoshi-bold text-txtblack'>
                    Benefits
                  </p>
                </div>
                <span className='block text-[14px] text-textSubtle mb-4 word-break'>
                  NFT as Membership: NFT buyers can have exclusive benefits
                </span>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {nft.benefits.map((benefit, benefitIndex) => (
                    <div
                      className='md:mb-6 mb-3 flex items-center'
                      key={benefitIndex}
                    >
                      <DebounceInput
                        minLength={1}
                        debounceTimeout={0}
                        className={`debounceInput mt-1 ${
                          isPreview ? ' !border-none bg-transparent' : ''
                        } `}
                        disabled={isPreview}
                        value={benefit.title}
                        onChange={(e) =>
                          onBenefitChange(index, benefitIndex, e.target.value)
                        }
                        placeholder={`${isPreview ? '' : 'Enter benefit here'}`}
                      />
                      {nft.benefits.length > 1 && !isPreview && (
                        <div className='ml-4'>
                          <i
                            onClick={() => deleteBenefits(index, benefitIndex)}
                            className='cursor-pointer fa-solid fa-trash text-danger-1/[0.7]'
                          ></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!isPreview && (
                  <div className='text-right'>
                    <button
                      onClick={() => addMoreBenefits(index)}
                      className='mb-4 text-[12px] font-black  rounded text-primary-900'
                    >
                      + Add More Benefits
                    </button>
                  </div>
                )}
              </div>
              {/* pricing */}
              <div className='mb-6'>
                <p className='mb-3 text-[14px] font-bold font-satoshi-bold text-txtblack'>
                  Pricing
                </p>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
                  {/* price */}
                  <div className='md:col-span-6'>
                    <div className='flex items-center mb-2'>
                      <Tooltip></Tooltip>
                      <p className='text-txtblack text-[14px]'>NFT Price</p>
                    </div>
                    <div className='flex  gap-2'>
                      <Select
                        components={{
                          Control,
                          IndicatorSeparator: () => null,
                        }}
                        options={CURRENCY}
                        isSearchable={false}
                        onChange={(value) => setSelectedCurrency(value)}
                        value={selectedCurrency}
                        isDisabled={true}
                        className='min-w-[50%]'
                      />
                      <div>
                        <input
                          value={nft.price}
                          onChange={(e) =>
                            onTextfieldChange(index, 'price', e.target.value)
                          }
                          disabled={isPreview || !canEdit()}
                          type='number'
                          min='0'
                          className={`debounceInput ${
                            isPreview ? ' !border-none bg-transparent' : ''
                          } `}
                          placeholder={`${isPreview ? '' : 'Add Price'}`}
                        />
                      </div>
                    </div>
                  </div>
                  {/* sale time */}
                  <div className='md:col-span-3'>
                    <div className='flex items-center mb-2'>
                      <Tooltip message='If set, this NFT can only be minted within that time period'></Tooltip>
                      <p className='text-txtblack text-[14px]'>Sale Time</p>
                    </div>
                    <DateRangePicker
                      placeholder='Unlimited'
                      value={nft.salesTimeRange}
                      onChange={(date) =>
                        onTextfieldChange(index, 'salesTimeRange', date)
                      }
                      format='yyyy-MM-dd HH:mm:ss'
                      preventOverflow={false}
                      defaultOpen={false}
                      placement='auto'
                      showMeridian={true}
                      className='date-range-picker nft-sales-range'
                      ranges={predefinedBottomRanges}
                      disabled={isPreview || !canEdit()}
                    />
                    {/* {checkedValidation && nft.salesTimeRange === '' && (
                      <p className='validationTag text-sm'>Price is required</p>
                    )} */}
                  </div>

                  {/* supply */}
                  <div className='md:col-span-3'>
                    <div className='flex items-center mb-2'>
                      <Tooltip message='Maximum copies of this NFT can be minted'></Tooltip>
                      <p className='text-txtblack text-[14px]'>Supply</p>
                    </div>
                    <>
                      <DebounceInput
                        minLength={1}
                        debounceTimeout={0}
                        className={`debounceInput ${
                          isPreview ? ' !border-none bg-transparent' : ''
                        } `}
                        disabled={isPreview || !canEdit() || isERC721()}
                        value={nft.supply}
                        type='number'
                        onChange={(e) =>
                          onTextfieldChange(index, 'supply', e.target.value)
                        }
                        placeholder='Add Supply'
                      />
                      {checkedValidation && nft.supply === '' && (
                        <p className='validationTag text-sm'>
                          Supply is required
                        </p>
                      )}
                    </>
                  </div>
                </div>
              </div>
              <div className='my-6 md:my-12'>
                <h2
                  className='accordion-header border rounded-[15px] rounded-bl-none rounded-br-none mb-0'
                  id={`heading-${index}`}
                >
                  <button
                    className='flex  w-full text-[16px] items-center justify-between py-4 px-5 rounded-[16px]'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target={`#configure-${index}`}
                    aria-expanded='false'
                    aria-controls={`configure-${index}`}
                  >
                    Other Settings (Optional)
                    <i className='ml-auto fa-solid fa-angle-down'></i>
                  </button>
                </h2>

                <div
                  id={`configure-${index}`}
                  className={`accordion-collapse accordian-detail-content collapse rounded-[16px]`}
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent='#content-configure'
                >
                  <div className='accordion-body py-4 px-5 rounded-[16px] border border-t-none rounded-tl-none rounded-tr-none'>
                    <div className='mb-6'>
                      <p className='text-txtblack text-[14px]'>
                        Project External link (if available)
                      </p>
                      <>
                        <DebounceInput
                          minLength={1}
                          debounceTimeout={0}
                          className={`debounceInput mt-1 ${
                            isPreview ? ' !border-none bg-transparent' : ''
                          } `}
                          disabled={isPreview || !canEdit()}
                          value={nft.externalLink}
                          onChange={(e) =>
                            onTextfieldChange(
                              index,
                              'externalLink',
                              e.target.value
                            )
                          }
                          placeholder='https://'
                        />
                      </>
                    </div>
                    <div className='mb-6'>
                      <p className='text-txtblack font-bold '>Properties</p>
                      <p className='text-textSubtle text-[14px] mb-[16px]'>
                        Add the properties of your NFT below
                      </p>
                      <div className='flex py-3 '>
                        <i className='fa-regular fa-grip-lines'></i>
                        <div className='flex-1 px-3'>
                          <p className='-mt-1'>Add NFT Properties</p>
                          <small className='text-textSubtle word-break'>
                            Add the properties and values of your NFT. You can
                            add more NFT properties as you deem fit
                          </small>
                        </div>
                        <>
                          {!isPreview && canEdit() && (
                            <i
                              className='fa-regular fa-square-plus text-2xl text-primary-900 cursor-pointer'
                              onClick={() => openPropertyModal(index)}
                            ></i>
                          )}
                        </>
                      </div>

                      <div className='grid grid-cols-1 mt-2 mb-4'>
                        {isListUpdate && (
                          <div className='text-center mt-3'>
                            <i className='fa-solid fa-loader fa-spin text-primary-900'></i>
                          </div>
                        )}
                        {!isListUpdate &&
                          nft.properties &&
                          nft.properties.map((property, i) => (
                            <div key={i}>
                              {property?.key && property?.value && (
                                <div key={i}>
                                  <div className='flex items-center gap-4 mb-2'>
                                    <div>
                                      <p className='text-[14px] text-txtSubtle'>
                                        Attribute
                                      </p>
                                      <input
                                        name={`preview-type-${i}`}
                                        type={'text'}
                                        className='w-32 bg-gray-200 disabled:cursor-not-allowed'
                                        defaultValue={property.key}
                                        disabled={true}
                                      />
                                    </div>
                                    <div>
                                      <p className='text-[14px] text-txtSubtle'>
                                        Description
                                      </p>
                                      <input
                                        name={`preview-name-${i}`}
                                        type={'text'}
                                        className=' w-32 bg-gray-200 disabled:cursor-not-allowed'
                                        defaultValue={property.value}
                                        disabled={true}
                                      />
                                    </div>
                                    <>
                                      <button
                                        disabled={isPreview || !canEdit()}
                                        onClick={() => {
                                          removePropertyOfTier(nft, i);
                                        }}
                                      >
                                        <i className='fa-solid fa-trash text-danger-1/[0.7]'></i>
                                      </button>
                                    </>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>

                      <div className='flex  py-3 border-t border-t-divider border-b border-b-divider'>
                        <p className='text-txtblack text-[18px] font-black'>
                          18+
                        </p>
                        <div className='flex-1 px-3'>
                          <p className='-mt-1'>Sensitive Content</p>
                          <small className='text-textSubtle'>
                            Specify if your NFT content is rated 18
                          </small>
                        </div>
                        {isPreview || !canEdit() ? (
                          <p className='text-[14px] text-textSubtle'>
                            {nft.sensitiveContent
                              .toString()
                              .toLocaleUpperCase()}
                          </p>
                        ) : (
                          <div className='flex flex-wrap items-center'>
                            <label
                              htmlFor={`checked-toggle-${index}`}
                              className='inline-flex relative items-center cursor-pointer ml-auto'
                            >
                              <input
                                type='checkbox'
                                value={nft.sensitiveContent}
                                id={`checked-toggle-${index}`}
                                checked={nft.sensitiveContent}
                                className='sr-only peer outline-none'
                                onChange={(e) =>
                                  onSensitiveContentChange(
                                    index,
                                    nft.sensitiveContent
                                  )
                                }
                              />
                              <div className="w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-900"></div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='mb-6'>
                      <p className='text-txtblack text-[14px]'>Description</p>
                      <textarea
                        value={nft.description}
                        onChange={(e) =>
                          onTextfieldChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                        name='description'
                        id='description'
                        cols='30'
                        rows='6'
                        placeholder='Add a brief description of your membership NFT'
                        className={`mt-1 p-4 ${
                          isPreview ? ' !border-none bg-transparent' : ''
                        } `}
                        disabled={isPreview || !canEdit()}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              {isPreview &&
                collection?.status === 'published' &&
                !nft?.token_id && (
                  <div className='my-6'>
                    <div className='w-full text-center rounded-lg mx-auto max-w-[400px] p-5 border shadow text-danger-1 text-[14px]'>
                      Since collection published, your NFT will added to
                      blockchain and also be ready to mint after saving
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
        <div className='py-6 flex flex-wrap justify-between mb-4'>
          {isPreview ? (
            <>
              <button
                onClick={() => setIsPreview(false)}
                className='h-[43px]  px-6 py-2 bg-primary-900/[.20] font-black  rounded text-primary-900'
              >
                Back
              </button>
              <button
                onClick={nextHandle}
                className='w-[140px] !text-[16px] h-[44px] contained-button'
              >
                Submit
              </button>
            </>
          ) : (
            <>
              {!updateMode && collection?.status !== 'published' ? (
                <div className='block md:flex  items-center gap-2'>
                  <button
                    onClick={addMoreTier}
                    className='h-[43px] px-3 mb-2 md:mb-0  md:px-6 py-2 bg-primary-900/[.20] font-black  rounded text-primary-900'
                  >
                    + Add More Tier
                  </button>
                  <div className='flex items-center'>
                    <Tooltip message='You can create multiple NFT, each is one tier'></Tooltip>
                    <span className='text-[13px] text-textSubtle font-bold'>
                      What is Tier ?
                    </span>
                  </div>
                </div>
              ) : null}
              <button
                onClick={nextHandle}
                className='w-[140px] !text-[16px] h-[44px] contained-button ml-auto'
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
      {showPropertyModal && (
        <Modal
          show={showPropertyModal}
          handleClose={() => setShowPropertyModal(false)}
          height={'auto'}
          width={'564'}
        >
          <p className='font-black  mb-4'>Add your properties</p>
          <div className='md:w-10/12'>
            <p className='mb-4 break-normal'>
              Add the properties, with value, you can add more than 5 properties
            </p>
            <p className='text-color-ass-9 text-sm'>Add Properties</p>
            {isListUpdate && (
              <div className='text-center mt-3'>
                <i className='fa-solid fa-loader fa-spin text-primary-900'></i>
              </div>
            )}
            {!isListUpdate &&
              propertyList &&
              propertyList.map((property, index) => (
                <div key={index}>
                  <div className='flex items-center mt-3'>
                    <div>
                      <p className='text-[14px] text-txtSubtle'>Attribute</p>
                      <input
                        name={`type-${index}`}
                        type={'text'}
                        className='w-32'
                        defaultValue={property.key}
                        onChange={(e) => handleOnChangePropertyType(e, index)}
                      />
                    </div>

                    <div className='ml-3'>
                      <p className='text-[14px] text-txtSubtle'>Description</p>
                      <input
                        name={`name-${index}`}
                        type={'text'}
                        className=' w-32'
                        defaultValue={property.value}
                        onChange={(e) => handleOnChangePropertyName(e, index)}
                      />
                    </div>

                    {propertyList.length > 1 && (
                      <i
                        className='cursor-pointer fa-solid fa-trash text-danger-1/[0.7] ml-3'
                        onClick={() => removeProperty(index)}
                      ></i>
                    )}
                  </div>
                </div>
              ))}

            <div className='mt-5'>
              <button
                className='text-primary-900 cursor-pointer ml-1'
                onClick={() => addProperty()}
              >
                Add more +
              </button>
            </div>

            <div className='mt-5'>
              <button
                className='w-[120px] !text-[16px] h-[38px] contained-button'
                onClick={onSavePropertiesChange}
              >
                SAVE
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showSuccessModal && (
        <SuccessModal
          message={`You have successfully ${
            updateMode ? 'update' : 'create'
          } NFT!`}
          subMessage="Let's explore the NFT"
          buttonText='View NFT'
          redirection={`/collection/${collection_id}`}
          handleClose={() => setShowSuccessModal(false)}
          show={showSuccessModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => {
            setShowErrorModal(false);
            setErrorTitle(null);
            setErrorMessage(null);
            setRedirectOnError(false);
          }}
          showCloseIcon={!redirectOnError}
          show={showErrorModal}
          title={errorTitle}
          message={errorMessage}
          showErrorTitleInRedColor={true}
          redirection={
            redirectOnError ? `/collection/${collection?.id}` : false
          }
        />
      )}
      {showMoonpayModal && process.env.NEXT_PUBLIC_ENV !== 'production' && (
        <MoonpayModal
          handleClose={() => {
            setShowMoonpayModal(false);
          }}
          show={showMoonpayModal}
        />
      )}
      {showConnectModal && (
        <WalletConnectModal
          showModal={showConnectModal}
          noRedirection={true}
          closeModal={() => setShowConnectModal(false)}
        />
      )}
      {showDataUploadingModal && (
        <Modal
          width={400}
          show={showDataUploadingModal}
          showCloseIcon={false}
          handleClose={() => setShowDataUploadingModal(false)}
        >
          <div className='text-center '>
            <p className='font-black text-[18px]'>
              Please do not close the tab
            </p>
            <p>Your assets are being uploaded</p>
            <div className='overflow-hidden rounded-full h-4 w-full mt-4 md:mt-6 mb-8 relative animated fadeIn'>
              <div className='animated-process-bar'></div>
            </div>
          </div>
        </Modal>
      )}
      {showDeleteModal && (
        <ConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleApply={() => onDeleteNFT()}
          message='Are you sure to delete this NFT?'
        />
      )}
      {showDeleteSuccessModal && (
        <SuccessModal
          message={`You have successfully deleted the NFT!`}
          subMessage=''
          buttonText='Close'
          redirection={`/collection/${collection_id}`}
          show={showDeleteSuccessModal}
          handleClose={() => setShowDeleteSuccessModal(false)}
        />
      )}
      {showNetworkSwitch && (
        <NetworkSwitchModal
          show={showNetworkSwitch}
          handleClose={() => setShowNetworkSwitch(false)}
        />
      )}
    </>
  );
}
