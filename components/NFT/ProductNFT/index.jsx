/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Tooltip from 'components/Commons/Tooltip';
import Modal from 'components/Commons/Modal';
import { useForm } from 'react-hook-form';
import ErrorModal from 'components/Modals/ErrorModal';
import {
  generateUploadkeyGcp,
  getassetDetails,
  getNftDetails,
  saveProductNFT,
  updateProductNFT,
  deleteDraftNFT,
} from 'services/nft/nftService';
import { getNotificationData } from 'redux/notification';
import SuccessModal from 'components/Modals/SuccessModal';
import { createCollection } from 'services/collection/collectionService';
import PublishingProductNFT from './PublishingProductNFT';
import {
  getCollectionDetailsById,
  updateRoyaltySplitter,
  getUserCollections,
} from 'services/collection/collectionService';
import { ls_GetChainID } from 'util/ApplicationStorage';
import Image from 'next/image';
import Select from 'react-select';
import { uniqBy } from 'lodash';
import { NETWORKS } from 'config/networks';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
import { event } from 'nextjs-google-analytics';
import TagManager from 'react-gtm-module';
import WalletConnectModal from 'components/Login/WalletConnectModal';
import { DebounceInput } from 'react-debounce-input';
import { getCurrentNetworkId } from 'util/MetaMask';
import NetworkSwitchModal from 'components/Commons/NetworkSwitchModal/NetworkSwitchModal';
import { useRouter } from 'next/router';

export default function ProductNFT({ query }) {
  const audioRef = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isLoading, setIsLoading] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyList, setPropertyList] = useState([
    {
      key: '',
      value: '',
      value_type: 'string',
      display_type: 'properties',
    },
  ]);
  const [checkedValidation, setCheckedValidation] = useState(false);
  const [nftFile, setnftFile] = useState({ file: null, path: '' });
  const [errorTitle, setErrorTitle] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isFileError, setFileError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [jobId, setJobId] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [step, setStep] = useState(1);
  const [holdCreateNFT, setHoldCreateNFT] = useState(false);
  const [supply, setSupply] = useState();

  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [isNFTSaved, setIsNFTSaved] = useState(false);
  const [savingNFT, setSavingNFT] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [collectionId, setCollectionId] = useState('');
  const [isListUpdate, setIsListUpdate] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const [uploadingSize, setUploading] = useState(0);
  const [uploadedPercent, setUploadedPercent] = useState();
  const [nft, setNft] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [isNftLoading, setIsNftLoading] = useState(false);
  const [asseteRemoveInUpdateMode, setAsseteRemoveInUpdateMode] =
    useState(false);
  const [hasNextPageData, setHasNextPageData] = useState(true);
  const [payload, setPayload] = useState({
    page: 1,
    perPage: 10,
    keyword: '',
    order_by: 'newer',
  });

  const [collection, setCollection] = useState({});
  const [options, setOptions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showNetworkSwitch, setShowNetworkSwitch] = useState(false);
  const [redirection, setRedirection] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    if (holdCreateNFT) {
      onSubmit();
    }

    return () => {
      setHoldCreateNFT(false);
    };
  }, [userinfo?.id]);

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
  async function onDaoSearch(keyword) {
    delayCallback(() => {
      let oldPayload = { ...payload };
      oldPayload.keyword = keyword;
      setPayload(oldPayload);
    });
  }

  useEffect(() => {
    if (hasNextPageData) {
      collectionFetch();
    }
  }, [payload]);

  function scrolledBottom() {
    let oldPayload = { ...payload };
    oldPayload.page = oldPayload.page + 1;
    setPayload(oldPayload);
  }

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
          let filtered = uniqDaoList.filter((list) => list.type === 'product');
          setOptions(filtered);
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

  useEffect(() => {
    // file upload web socket
    const projectDeployStatus = fileUploadNotification.find(
      (x) => x.function_uuid === jobId
    );
    if (projectDeployStatus && projectDeployStatus.data) {
      const data = JSON.parse(projectDeployStatus.data);
      if (data.Data['assetId'] && data.Data['assetId'].length > 0) {
        if (!savingNFT && !isNFTSaved) {
          setSavingNFT(true);
          updateNFT(data.Data['assetId']);
        }
      } else {
        setSavingNFT(false);
      }
    }
  }, [fileUploadNotification]);

  useEffect(() => {
    try {
      const cid = query?.collectionId;
      setCollectionId(cid ? cid : '');
    } catch {}
  }, []);

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
    const tempProperty = [...propertyList];
    tempProperty.splice(index, 1);
    setPropertyList(tempProperty);
    setTimeout(() => {
      setIsListUpdate(false);
    }, 50);
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
      const usedSize = userinfo['storage_usage'];
      let totalSize = 0;
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
            setnftFile({ file: file, path: URL.createObjectURL(file) });
            if (updateMode) {
              setAsseteRemoveInUpdateMode(true);
            }
            setFileError(false);
          }
        }
      } else if (!usedSize) {
        setnftFile({ file: file, path: URL.createObjectURL(file) });
        if (updateMode) {
          setAsseteRemoveInUpdateMode(true);
        }
        setFileError(false);
      }
    } catch {
      setFileError(true);
    }
  }

  const onSubmit = async (data) => {
    if (nftFile && nftFile.file) {
      if (!collectionId && !supply) {
        setCheckedValidation(true);
      } else {
        setShowConfirmation(true);
        setCheckedValidation(false);
      }

      if (showConfirmation) {
        if (userinfo?.id) {
          setFileError(false);
          setShowSteps(true);
          if (!updateMode) {
            if (!collectionId || collectionId === '') {
              createNewProject();
            } else {
              await genUploadKey();
            }
          } else if (updateMode) {
            if (!asseteRemoveInUpdateMode) {
              await updateNFT(nft.asset.path);
            } else if (asseteRemoveInUpdateMode) {
              await genUploadKey();
            }
          }
        } else {
          let currentNetwork = await getCurrentNetworkId();
          if (NETWORKS?.[currentNetwork]) {
            setShowConnectModal(true);
            setHoldCreateNFT(true);
          } else {
            setShowNetworkSwitch(true);
          }
        }
      }
    } else {
      setFileError(true);
    }
  };

  async function genUploadKey(collectionID) {
    const request = new FormData();
    request.append('file_name', nftFile.file.name);
    request.append('mime_type', nftFile.file.type);
    await generateUploadkeyGcp(request)
      .then((res) => {
        if (res?.code === 0) {
          if (
            res?.signed_url &&
            res?.signed_url !== '' &&
            res?.file_path &&
            res?.file_path !== ''
          ) {
            uploadAFile(res.signed_url, res.file_path, collectionID);
          } else {
            handleErrorState(res?.message);
          }
        } else {
          handleErrorState(res?.message);
        }
      })
      .catch((err) => {
        handleErrorState(err);
      });
  }

  async function uploadAFile(uploadKey, filePath, collectionID) {
    const headers = {
      'Content-Type': nftFile.file.type,
    };
    await axios({
      method: 'PUT',
      url: uploadKey,
      data: nftFile.file,
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
        if (updateMode) {
          updateNFT(filePath, collectionID);
        } else if (!updateMode) {
          saveNFTDetails(filePath, collectionID);
        }
      })
      .catch((err) => {
        handleErrorState(err);
      });
  }

  const handleErrorState = (msg) => {
    setIsLoading(false);
    setShowSteps(false);
    setErrorTitle('Saving Product NFT Failed');
    setErrorMessage(msg);
    setShowSuccessModal(false);
    setShowErrorModal(true);
    setSavingNFT(false);
    setIsNFTSaved(false);
    setShowConfirmation(false);
  };

  function saveNFTDetails(assetId, collectionID) {
    event('create_product_nft', { category: 'nft' });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'nft',
        pageTitle: 'create_product_nft',
      },
    });
    if (assetId && assetId.length > 0) {
      setIsLoading(true);
      const request = new FormData();
      request.append(
        'collection_uid',
        collectionID ? collectionID : collectionId
      );
      request.append('name', watch('name'));
      request.append('asset_url', assetId);
      request.append('description', watch('description'));
      request.append('external_link', watch('externalLink'));
      request.append('sensitive_content', watch('sensitiveContent'));

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
        request.append('attributes', JSON.stringify(attributes));
      }
      saveProductNFT(request)
        .then((res) => {
          setSavingNFT(false);
          if (res['code'] === 0) {
            setJobId('');
            setStep(2);
            setIsNFTSaved(true);
            setIsLoading(false);
          } else {
            handleErrorState(
              'Failed to create product NFT. Please try again later'
            );
          }
        })
        .catch((err) => {
          handleErrorState(
            'Failed to create product NFT. Please try again later'
          );
        });
    } else {
      handleErrorState('AssetID  not found. Please try again later');
    }
  }

  async function updateNFT(assetId, collectionID) {
    if (assetId && assetId.length > 0) {
      setIsLoading(true);
      const request = new FormData();
      request.append('name', watch('name'));
      request.append('asset_url', assetId);
      request.append('description', watch('description'));
      request.append('external_link', watch('externalLink'));
      request.append('sensitive_content', watch('sensitiveContent'));
      request.append('benefit_array', []);

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
        request.append('attributes', JSON.stringify(attributes));
      }

      await updateProductNFT(nft.id, request)
        .then((res) => {
          setSavingNFT(false);
          if (res['code'] === 0) {
            setJobId('');
            setStep(2);
            setIsNFTSaved(true);
            setIsLoading(false);
            // if (res['function_uuid'] === '') {
            //   setJobId('');
            //   setStep(2);
            //   setIsNFTSaved(true);
            //   setIsLoading(false);
            // } else {
            //   setJobId(res['function_uuid']);
            //   const notificationData = {
            //     etherscan: '',
            //     function_uuid: res['function_uuid'],
            //     data: '',
            //   };
            //   dispatch(getNotificationData(notificationData));
            //   recheckStatus(res['function_uuid']);
            // }
          }
          // else if (res['code'] === 4000) {
          //   setShowSteps(false);
          //   setIsNFTSaved(true);
          //   setIsLoading(false);
          //   setShowSuccessModal(true);
          // }
          else {
            handleErrorState(res?.message);
          }
        })
        .catch((err) => {
          handleErrorState(err);
        });
    } else {
      handleErrorState(
        'AssetID and/or CollectionID not found. Please try again'
      );
    }
  }

  function recheckStatus(jobId) {
    setTimeout(() => {
      getassetDetails(jobId)
        .then((res) => {
          if (res.code === 0) {
            if (res['asset'] && res['asset']['id']) {
              const asstdata = {
                Data: { assetId: res['asset']['id'] },
              };
              const deployData = {
                function_uuid: jobId,
                data: JSON.stringify(asstdata),
              };
              dispatch(getNotificationData(deployData));
            }
          } else {
            recheckStatus(jobId);
          }
        })
        .catch((error) => {});
    }, 30000);
  }

  function createNewProject() {
    createNewCollection();
  }

  function createNewCollection() {
    event('create_collection', {
      category: 'collection',
      label: 'blockchain',
      value: ls_GetChainID(),
    });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'collection',
        label: 'blockchain',
        value: ls_GetChainID(),
        pageTitle: 'create_collection',
      },
    });
    let createPayload = {
      blockchain: ls_GetChainID(),
      collection_type: 'product',
      supply: supply,
    };

    createCollection(createPayload)
      .then((res) => {
        if (res.code === 0) {
          setCollectionId(res.collection.id);
          let members = [{ wallet_address: userinfo?.eoa, royalty: 100 }];
          let formData = new FormData();
          formData.append('royalty_data', JSON.stringify(members));
          formData.append('collection_uid', res.collection.id);
          updateRoyaltySplitter(formData);
          genUploadKey(res.collection.id);
        } else {
          handleErrorState(res.message);
        }
      })
      .catch((err) => {
        handleErrorState('Please try again later');
      });
  }

  const handleShowStepClose = () => {
    setShowSteps(false);
  };
  async function nftDetails(type, id) {
    setIsNftLoading(true);
    await getNftDetails(type, id)
      .then((resp) => {
        if (resp.code === 0) {
          const nft = resp.lnft;
          setNft(nft);
          setUpdateMode(true);
          const assets = {
            file: { type: nft.asset.asset_type },
            path: nft.asset.path,
          };
          setnftFile(assets);
          setValue('name', nft.name);
          setValue('externalLink', nft.external_url);
          setValue('description', nft.description);
          setValue('sensitiveContent', nft.sensitive_content);
          if (nft?.attributes?.length === 0) {
            setPropertyList([
              {
                key: '',
                value: '',
                value_type: 'string',
                display_type: 'properties',
              },
            ]);
          } else {
            setPropertyList(nft?.attributes);
          }
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
    await getCollectionDetailsById(payload)
      .then((resp) => {
        if (resp?.code === 0) {
          setCollection(resp?.collection);
        } else {
          setErrorTitle('Unexpected Error, please try again');
          setErrorMessage(resp?.message);
          setShowErrorModal(true);
        }
      })
      .catch((err) => console.log(err));
  };
  const deleteProductNFT = async () => {
    setIsNftLoading(true);
    await deleteDraftNFT(nft?.id)
      .then((res) => {
        if (res.code === 0) {
          setShowDeleteModal(false);
          setShowDeleteSuccessModal(true);
          setIsNftLoading(false);
        } else {
          setShowErrorModal(true);
          setErrorTitle('Opps, something went wrong');
          setErrorMessage(res?.message);
          setIsNftLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsNftLoading(false);
      });
  };

  useEffect(() => {
    if (query?.collectionId) {
      getCollectionDetail(query?.collectionId);
    }
  }, []);
  useEffect(() => {
    try {
      const nftId = query?.nftId;
      if (nftId) {
        nftDetails('product', nftId);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (collection?.id && !collection?.updatable) {
      setRedirection(true);
      setErrorTitle('NFT can not update');
      setErrorMessage('NFT updatable is turned off from the Collection');
      setShowErrorModal(true);
    } else if (
      collection?.id &&
      collection?.status === 'published' &&
      nft?.id &&
      !nft.freeze_metadata
    ) {
      setShowConfirmModal(true);
    } else if (nft?.id && nft.freeze_metadata) {
      setRedirection(true);
      setErrorTitle('NFT can not update');
      setErrorMessage('This nft is freezed');
      setShowErrorModal(true);
    }
  }, [collection, nft]);

  let curCollection = collectionId
    ? options.find((item) => item.id === collectionId)
    : null;

  let networkName = curCollection?.blockchain
    ? NETWORKS?.[Number(curCollection?.blockchain)]?.networkName
    : null;

  return (
    <>
      {isNftLoading && <div className='loading'></div>}
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='max-w-[600px] mx-4 md:mx-auto md:mt-[40px]'>
            <div className='mb-[24px] flex flex-wrap items-center'>
              <div>
                <h1 className='text-[28px] font-black mb-[6px]'>
                  {showConfirmation
                    ? 'Preview '
                    : updateMode
                    ? 'Update '
                    : 'Create '}
                  Product NFT
                </h1>
                <p className='text-[14px] text-textSubtle word-break'>
                  {showConfirmation
                    ? 'Preview the NFT'
                    : 'Please fill in all required data to create your NFT'}
                </p>
              </div>
              <div className='ml-auto'>
                {updateMode &&
                  nft?.is_owner &&
                  collection?.status === 'draft' &&
                  !showConfirmation && (
                    <button
                      type='button'
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
              <div className='bg-white mb-6 rounded-[12px]  border border-divider  p-4'>
                <div className='mb-6'>
                  <label
                    className='block text-[16px] font-bold font-satoshi-bold'
                    htmlFor='dropzone-file'
                  >
                    Upload assets
                  </label>
                  <p className='block text-[14px] text-textSubtle mb-4 word-break'>
                    You can upload assets in any of these formats. PNG, GIF,
                    WEBP, MP3, or MP4. Max 100 MB.
                  </p>
                  <div
                    className={`flex justify-center items-center max-w-full  ${
                      nftFile.file?.type?.split('/')[0]?.toLowerCase() ===
                        'video' ||
                      nftFile.file?.type?.split('/')[0]?.toLowerCase() ===
                        'movie'
                        ? ''
                        : 'w-40 h-40'
                    }`}
                  >
                    <label
                      htmlFor={`dropzone-file`}
                      className={`flex flex-col justify-center items-center w-full  ${
                        nftFile.file?.type?.split('/')[0]?.toLowerCase() ===
                          'video' ||
                        nftFile.file?.type?.split('/')[0]?.toLowerCase() ===
                          'movie'
                          ? ''
                          : 'h-40'
                      } ${
                        nftFile.file ? '' : 'bg-white-filled-form'
                      } rounded-xl  cursor-pointer`}
                    >
                      <div className='flex flex-col justify-center items-center pt-5 pb-6 relative'>
                        {nftFile.file ? (
                          <>
                            {nftFile.file?.type
                              ?.split('/')[0]
                              ?.toLowerCase() === 'image' && (
                              <Image
                                unoptimized
                                src={nftFile.path}
                                alt='nft'
                                height={40}
                                width={40}
                                className='rounded-xl  max-w-full w-40 h-40 object-cover'
                              />
                            )}
                            {nftFile.file?.type
                              ?.split('/')[0]
                              ?.toLowerCase() === 'audio' && (
                              <>
                                <i
                                  onClick={() => {
                                    setAsseteRemoveInUpdateMode(true);
                                    setnftFile({ file: null, path: '' });
                                  }}
                                  className='absolute top-0 text-[18px] cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark'
                                ></i>
                                <audio
                                  ref={audioRef}
                                  src={nftFile.path}
                                  controls
                                  autoPlay={false}
                                  className='ml-[8rem]'
                                />
                              </>
                            )}
                            {nftFile.file?.type
                              ?.split('/')[0]
                              ?.toLowerCase() === 'video' ||
                            nftFile.file?.type?.split('/')[0]?.toLowerCase() ===
                              'movie' ? (
                              <>
                                <i
                                  onClick={() => {
                                    setAsseteRemoveInUpdateMode(true);
                                    setnftFile({ file: null, path: '' });
                                  }}
                                  className='absolute top-0 text-[18px] cursor-pointer  text-primary-900 right-0 fa-solid fa-circle-xmark'
                                ></i>
                                <video width='650' height='400' controls>
                                  <source src={nftFile.path} type='video/mp4' />
                                </video>
                              </>
                            ) : null}
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
                            <p className='text-xs text-primary-900'>Computer</p>
                          </>
                        )}
                      </div>

                      <input
                        id={`dropzone-file`}
                        type='file'
                        className='hidden'
                        accept='audio/*, image/*, video/*'
                        disabled={showConfirmation}
                        onChange={(e) => nftFileChangeHandler(e)}
                      />
                    </label>
                  </div>
                  {isFileError && (
                    <p className='text-red-500 text-xs font-medium mt-2'>
                      Please select a valid file.
                    </p>
                  )}
                </div>
                <div className='mb-6'>
                  <div className='flex items-center mb-2'>
                    <Tooltip></Tooltip>
                    <div className='txtblack text-[14px]'>Name</div>
                  </div>
                  <>
                    <input
                      id='name'
                      name='name'
                      className={`debounceInput mt-1 ${
                        showConfirmation ? 'hidden' : ''
                      }`}
                      {...register('name', {
                        required: 'Name is required.',
                      })}
                      defaultValue={nft ? nft.name : ''}
                      placeholder='Name for the NFT'
                    />
                    <p className={`${showConfirmation ? '' : 'hidden'}`}>
                      {watch('name')}
                    </p>
                    {errors.name && (
                      <p className='text-red-500 text-xs font-medium'>
                        {errors.name.message}
                      </p>
                    )}
                  </>
                </div>
                <div className='mb-6'>
                  <div className='txtblack text-[14px]'>
                    Project External link (if available)
                  </div>
                  <input
                    id='externalLink'
                    name='externalLink'
                    className={`debounceInput mt-1 ${
                      showConfirmation ? 'hidden' : ''
                    }`}
                    defaultValue={nft ? nft.external_url : ''}
                    {...register('externalLink')}
                    placeholder='https://'
                  />
                  <p className={`${showConfirmation ? '' : 'hidden'}`}>
                    {watch('externalLink')}
                  </p>
                  {errors.externalLink && (
                    <p className='text-red-500 text-xs font-medium'>
                      {errors.externalLink.message}
                    </p>
                  )}
                </div>
                <div className='mb-6'>
                  <div className='txtblack text-[14px]'>Description</div>
                  <textarea
                    id='description'
                    name='description'
                    cols='30'
                    rows='6'
                    className={`p-4 ${showConfirmation ? 'hidden' : ''}`}
                    placeholder='Add a brief description of your product NFT'
                    {...register('description')}
                    defaultValue={nft ? nft.description : ''}
                  ></textarea>
                  <p className={`${showConfirmation ? '' : 'hidden'}`}>
                    {watch('description')}
                  </p>
                  {errors.description && (
                    <p className='text-red-500 text-xs font-medium'>
                      {errors.description.message}
                    </p>
                  )}
                </div>
                {userinfo?.id && typeof window !== 'undefined' && (
                  <div className='mb-6'>
                    <div className='flex items-center mb-2'>
                      <Tooltip message='If you selecting a Collection, it will generate automatically'></Tooltip>
                      <p className='txtblack text-[14px]'>Connect Collection</p>
                    </div>
                    <Select
                      // defaultValue={curCollection}
                      value={curCollection}
                      onChange={(data) => setCollectionId(data?.id)}
                      onKeyDown={(event) => onDaoSearch(event.target.value)}
                      options={options}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (base) => ({
                          ...base,
                          border: showConfirmation
                            ? 'none'
                            : '1px solid hsl(0, 0%, 80%)',
                        }),
                      }}
                      isDisabled={query?.collectionId}
                      menuPortalTarget={document.body}
                      placeholder='Choose Collection'
                      isLoading={isLoading}
                      noOptionsMessage={() => 'No Collection Found'}
                      loadingMessage={() => 'Loading,please wait...'}
                      getOptionLabel={(option) => `${option.name}`}
                      getOptionValue={(option) => option.id}
                      classNamePrefix='collection-connect'
                      isClearable
                      isSearchable
                      menuShouldScrollIntoView
                      onMenuScrollToBottom={() => scrolledBottom()}
                    />
                  </div>
                )}
                {networkName && (
                  <div className='mb-6 '>
                    <p className='txtblack text-[14px]'>Blockchain</p>
                    <>
                      <input
                        className={`debounceInput mt-1 ${
                          showConfirmation ? ' !border-none bg-transparent' : ''
                        } `}
                        disabled
                        value={networkName}
                        type='text'
                      />
                    </>
                  </div>
                )}
                <div className='mb-6'>
                  <div className='text-txtblack font-bold '>Properties</div>
                  <div className='text-textSubtle text-[14px] mb-[16px]'>
                    Add the properties of your NFT below
                  </div>
                  <div className='flex py-3'>
                    <i className='fa-regular fa-grip-lines'></i>
                    <div className='flex-1 px-3'>
                      <p className='-mt-1'>Add NFT Properties</p>
                      <small className='text-textSubtle word-break'>
                        Add the properties and values of your NFT. You can add
                        more NFT properties as you deem fit.
                      </small>
                    </div>
                    <i
                      className={`fa-regular fa-square-plus text-2xl text-primary-900 cursor-pointer ${
                        showConfirmation ? 'hidden' : ''
                      }`}
                      onClick={() => setShowPropertyModal(true)}
                    ></i>
                  </div>
                  <div className='grid grid-cols-1 mt-2 mt-2 mb-4'>
                    {isListUpdate && (
                      <div className='text-center mt-3'>
                        <i className='fa-solid fa-loader fa-spin text-primary-900'></i>
                      </div>
                    )}
                    {!isListUpdate &&
                      propertyList &&
                      propertyList.map((property, index) => (
                        <div key={`view-properties-${index}`}>
                          {property?.key && property?.value && (
                            <div className='flex items-center gap-4 mb-2'>
                              <div>
                                <p className='text-[14px] text-txtSubtle'>
                                  Attribute
                                </p>
                                <input
                                  name={`type-${index}`}
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
                                  name={`name-${index}`}
                                  type={'text'}
                                  className='w-32 bg-gray-200 disabled:cursor-not-allowed'
                                  disabled={true}
                                  defaultValue={property.value}
                                />
                              </div>
                              {!showConfirmation &&
                                propertyList?.length > 1 && (
                                  <i
                                    className={`fa-solid fa-trash cursor-pointer text-danger-1/[0.7] ${
                                      showConfirmation ? 'hidden' : ''
                                    }`}
                                    onClick={() => removeProperty(index)}
                                  ></i>
                                )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  <div className='flex py-3 mb-4 border-t border-t-divider border-b border-b-divider'>
                    <p className='text-txtblack text-[18px] font-black'>18+</p>
                    <div className='flex-1 px-3'>
                      <p className='-mt-1'>Sensitive Content</p>
                      <small className='text-textSubtle'>
                        Specify if your NFT content is rated 18
                      </small>
                    </div>
                    <div className='flex flex-wrap items-center'>
                      <label
                        htmlFor={`sensitiveContent`}
                        className='inline-flex relative items-center cursor-pointer ml-auto'
                      >
                        <input
                          type='checkbox'
                          id={`sensitiveContent`}
                          name='sensitiveContent'
                          defaultChecked={nft ? nft.sensitive_content : false}
                          disabled={showConfirmation}
                          className='sr-only peer outline-none '
                          {...register('sensitiveContent')}
                        />
                        <div
                          className={` w-11 outline-none h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600  ${
                            showConfirmation
                              ? 'peer-checked:bg-gray-200'
                              : 'peer-checked:bg-primary-900'
                          }  `}
                        ></div>
                      </label>
                    </div>
                  </div>
                  {!collectionId ? (
                    <div className='mb-6 '>
                      <div className='flex items-center mb-2'>
                        <Tooltip></Tooltip>
                        <p className='txtblack text-[14px]'>Supply</p>
                      </div>
                      <>
                        <DebounceInput
                          minLength={1}
                          debounceTimeout={0}
                          className={`debounceInput mt-1 ${
                            showConfirmation
                              ? ' !border-none bg-transparent'
                              : ''
                          } `}
                          disabled={showConfirmation}
                          value={supply}
                          type='number'
                          onChange={(e) => setSupply(e.target.value)}
                          placeholder='Specify the total supply of your NFT'
                        />
                        {checkedValidation && !supply && (
                          <p className='text-red-500 text-xs font-medium'>
                            Supply is required
                          </p>
                        )}
                      </>
                    </div>
                  ) : null}
                </div>
                {showConfirmation === false && (
                  <button className='px-6 py-2 contained-button rounded font-black text-white-shade-900'>
                    Next
                    <i className='ml-4 fa-solid fa-arrow-right'></i>
                  </button>
                )}
                {showConfirmation && (
                  <div className='flex flex-wrap items-center justify-between'>
                    <button
                      onClick={() => {
                        setShowConfirmation(false);
                      }}
                      className='px-6 py-2 bg-primary-900/[.20] font-black rounded text-primary-900'
                    >
                      <i className=' mr-2 fa-solid fa-arrow-left'></i>
                      Back
                    </button>
                    <button className=' !px-6 py-2 contained-button rounded font-black text-white-shade-900'>
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
        {showPropertyModal && (
          <Modal
            show={showPropertyModal}
            handleClose={() => setShowPropertyModal(false)}
            height={'auto'}
            width={'564'}
          >
            <p className='font-black mb-4'>Add your Properties</p>
            <div className='md:w-10/12'>
              <p className='mb-4 break-normal'>
                Add the properties, with value , you can add more than 5
                properties
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
                  <div key={`properties-${index}`}>
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
                        <p className='text-[14px] text-txtSubtle'>
                          Description
                        </p>
                        <input
                          name={`name-${index}`}
                          type={'text'}
                          className='w-32'
                          defaultValue={property.value}
                          onChange={(e) => handleOnChangePropertyName(e, index)}
                        />
                      </div>
                      <i
                        className='fa-solid fa-trash cursor-pointer ml-3 text-danger-1/[0.7]'
                        onClick={() => removeProperty(index)}
                      ></i>
                    </div>
                  </div>
                ))}

              <div className='mt-5'>
                <button
                  type='button'
                  className='text-primary-900 cursor-pointer ml-1'
                  onClick={() => addProperty()}
                >
                  Add more +
                </button>
              </div>

              <div className='mt-5'>
                <button
                  type='button'
                  className='contained-button text-white-shade-900 bg-primary-900 btn-sm'
                  onClick={() => {
                    setIsListUpdate(true);
                    setShowPropertyModal(false);
                    setTimeout(() => {
                      setIsListUpdate(false);
                    }, 50);
                  }}
                >
                  SAVE
                </button>
              </div>
            </div>
          </Modal>
        )}

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
            redirection={redirection ? `/collection/${collection?.id}` : false}
          />
        )}
        {showSuccessModal && (
          <SuccessModal
            message={'Your NFT has been saved successfully'}
            subMessage={'go to the collection page and see your collection.'}
            buttonText={'Ok'}
            redirection={`/collection/${collectionId}`}
            handleClose={() => {
              setShowSuccessModal(false);
            }}
            show={showSuccessModal}
          />
        )}
        {showSteps && (
          <PublishingProductNFT
            handleShowStepClose={handleShowStepClose}
            show={showSteps}
            step={step}
            collectionId={collectionId}
            fileSize={fileSize}
            sizeUploaded={uploadingSize}
            uploadedPercent={uploadedPercent}
            mode={updateMode ? 'update' : 'create'}
          />
        )}
        {showDeleteModal && (
          <ConfirmationModal
            show={showDeleteModal}
            handleClose={() => setShowDeleteModal(false)}
            handleApply={deleteProductNFT}
            message='Are you sure to delete this NFT?'
          />
        )}
        {showDeleteSuccessModal && (
          <SuccessModal
            message={`You have successfully deleted the NFT!`}
            subMessage=''
            buttonText='Close'
            redirection={`/collection/${collectionId}`}
            show={showDeleteSuccessModal}
            handleClose={() => setShowDeleteSuccessModal(false)}
          />
        )}
        {showConnectModal && (
          <WalletConnectModal
            showModal={showConnectModal}
            noRedirection={true}
            closeModal={() => setShowConnectModal(false)}
          />
        )}
        {showNetworkSwitch && (
          <NetworkSwitchModal
            show={showNetworkSwitch}
            handleClose={() => setShowNetworkSwitch(false)}
          />
        )}
        {showConfirmModal && (
          <ConfirmationModal
            show={showConfirmModal}
            handleClose={() => {
              setShowConfirmModal(false);
              router.push(`/collection/${collection?.id}`);
            }}
            handleApply={() => setShowConfirmModal(false)}
            message='The NFT will be frozen after this update, continue?'
          />
        )}
      </>
    </>
  );
}
