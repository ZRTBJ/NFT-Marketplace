import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DebounceInput } from 'react-debounce-input';
import Tooltip from 'components/Commons/Tooltip';
import Modal from 'components/Commons/Modal';
import SuccessModal from 'components/Modals/SuccessModal';
import { createCollection } from 'services/collection/collectionService';
import {
  generateUploadkey,
  createMembershipNft,
  getassetDetails,
  getNftDetails,
  updateMembershipNFT,
  deleteDraftNFT,
} from 'services/nft/nftService';
import {
  updateRoyaltySplitter,
  getCollectionDetailsById,
  getUserCollections,
} from 'services/collection/collectionService';
import { ls_GetChainID } from 'util/ApplicationStorage';
import Select from 'react-select';
import { uniqBy } from 'lodash';
import axios from 'axios';
import Config from 'config/config';
import { getNotificationData } from 'redux/notification';
import ErrorModal from 'components/Modals/ErrorModal';
import Image from 'next/image';
import { NETWORKS } from 'config/networks';
import ConfirmationModal from 'components/Modals/ConfirmationModal';
export default function MembershipNFT({ query }) {
  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isListUpdate, setIsListUpdate] = useState(false);
  const nftList = [
    {
      tierName: '',
      assets: {
        file: null,
        path: null,
        isFileError: false,
        limitExceeded: false,
      },
      // nftName: "",
      externalLink: '',
      description: '',
      benefits: [{ title: '' }],
      properties: [
        {
          key: '',
          value: '',
          value_type: 'string',
          display_type: 'properties',
        },
      ],
      sensitiveContent: false,
      supply: '',
      isOpen: true,
      blockchainCategory: 'polygon',
      indexId: 1,
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
  const [options, setOptions] = useState([]);
  const jobIds = [];
  const [calledIds, setCalledIds] = useState([]);
  const [showDataUploadingModal, setShowDataUploadingModal] = useState(false);
  const [nftItem, setNft] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [errorTitle, setErrorTitle] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isNftLoading, setIsNftLoading] = useState(false);
  const [hasNextPageData, setHasNextPageData] = useState(true);
  const [asseteRemoveInUpdateMode, setAsseteRemoveInUpdateMode] =
    useState(false);
  const [collection, setCollection] = useState({});
  const [payload, setPayload] = useState({
    page: 1,
    perPage: 10,
    keyword: '',
    order_by: 'newer',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
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
  async function onDaoSearch(keyword) {
    delayCallback(() => {
      let oldPayload = { ...payload };
      oldPayload.keyword = keyword;
      setPayload(oldPayload);
    });
  }
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
          let filtered = uniqDaoList.filter(
            (list) => list.type === 'membership'
          );
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
      // nftName: "",
      externalLink: '',
      description: '',
      benefits: [{ title: '' }],
      properties: [
        {
          key: '',
          value: '',
          value_type: 'string',
          display_type: 'properties',
        },
      ],
      sensitiveContent: false,
      supply: '',
      isOpen: true,
      blockchainCategory: 'polygon',
      indexId: oldNfts.length + 1,
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
    let collection_id = '';
    let payload = {
      collection_type: 'membership',
      blockchain: ls_GetChainID(),
    };
    await createCollection(payload).then((res) => {
      collection_id = res.collection.id;
      let members = [{ wallet_address: userinfo?.eoa, royalty: 100 }];
      let formData = new FormData();
      formData.append('royalty_data', JSON.stringify(members));
      formData.append('collection_uid', res.collection.id);
      updateRoyaltySplitter(formData);
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
  async function saveNFTDetails(assetId, jobId) {
    let nft = {};
    if (typeof window !== 'undefined') {
      nft = JSON.parse(localStorage.getItem(`${jobId}`));
    }

    const request = new FormData();
    request.append('asset_uid', assetId);
    request.append('collection_uid', collection_id);
    request.append('tier_name', nft.tier_name);
    request.append('supply', nft.supply);
    request.append('blockchain', nft.blockchain);
    request.append('description', nft.description);
    request.append('external_link', nft.external_link);
    request.append('sensitive_content', nft.sensitive_content);
    request.append('attributes', JSON.stringify(nft.properties));
    request.append('job_id', nft.job_id);
    const benefit_array = nft.benefit_array.filter((x) => x.title !== '');
    request.append('benefit_array', JSON.stringify(benefit_array));

    if (!updateMode) {
      await createMembershipNft(request)
        .then((res) => {
          if (res.code === 0) {
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
          console.log(err);
        });
    } else if (updateMode) {
      await updateMembershipNFT(nftItem.id, request)
        .then((res) => {
          if (res.code === 0) {
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
  async function uploadAFile(uploadKey, nft) {
    let headers;
    headers = {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      key: uploadKey,
    };
    let formdata = new FormData();
    formdata.append('file', nft.assets.file);
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
  async function genUploadKey() {
    let key = '';
    const request = new FormData();
    await generateUploadkey(request)
      .then((res) => {
        if (res.key) {
          key = res.key;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return key;
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
    await updateMembershipNFT(nftItem?.id, request)
      .then((res) => {
        setShowDataUploadingModal(false);
        setShowSuccessModal(true);
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
          const key = await genUploadKey();
          if (key !== '') {
            await uploadAFile(key, iterator);
          }
        }
        // recheckStatus();
      } else {
        // const daoId = await daoCreate();
        const collection_id = await collectionCreate();
        if (typeof window !== 'undefined') {
          localStorage.setItem('upload_number', validateNfts?.length);
        }
        for (const iterator of validateNfts) {
          const key = await genUploadKey();
          if (key !== '') {
            await uploadAFile(key, iterator);
          }
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
        const uploadKey = await genUploadKey();
        if (uploadKey !== '') {
          await uploadAFile(uploadKey, validateNfts[0]);
        }
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
      if (!projectCreated) {
        await createBlock(validateNfts);
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
        // console.log(projectDeployStatus);
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
  async function nftDetails(type, id) {
    setIsNftLoading(true);
    await getNftDetails(type, id)
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
            onTextfieldChange(
              0,
              'benefits',
              JSON.parse(resp.more_info.benefits)
            );
          } catch (error) {
            console.log(error);
            onTextfieldChange(0, 'benefits', []);
          }
          onTextfieldChange(0, 'properties', nft.attributes);
          onTextfieldChange(0, 'sensitiveContent', nft.sensitive_content);
          onTextfieldChange(0, 'supply', nft.supply);

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
      if (resp.code === 0) {
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
  const deleteMembershipNFT = async () => {
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
    // console.log(fileUploadNotification);
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
      if (nftId !== null) {
        nftDetails('membership', nftId);
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

  console.log(collection_id, options);
  return (
    <>
      {isNftLoading && <div className='loading'></div>}
      <div className='max-w-[600px] md:mx-auto pt-6 md:pt-0 md:mt-[40px] mx-4  '>
        <div className='mb-[24px] flex flex-wrap items-center'>
          <div>
            <h1 className='text-[28px] font-black mb-[6px]'>
              {isPreview
                ? 'Preview Membership NFT'
                : updateMode
                ? 'Update Membership NFT'
                : 'Create Membership NFT'}
            </h1>
            <p className='text-[14px] text-textSubtle '>
              {isPreview
                ? ' Preview the NFT'
                : ' Please fill this require data for setup your NFT'}
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
              <div className='mb-6'>
                <p className='txtblack text-[14px]'>Tier Name</p>
                <>
                  <DebounceInput
                    minLength={1}
                    debounceTimeout={0}
                    className={`debounceInput mt-1 ${
                      isPreview ? ' !border-none bg-transparent' : ''
                    } `}
                    disabled={isPreview}
                    value={nft.tierName}
                    onChange={(e) =>
                      onTextfieldChange(index, 'tierName', e.target.value)
                    }
                    placeholder='Tier name for the NFT'
                  />
                  {checkedValidation && nft.tierName === '' && (
                    <p className='validationTag'>Tier Name is required</p>
                  )}
                </>
              </div>
              <div className='mb-6'>
                <label
                  className='block text-[16px] font-bold font-satoshi-bold'
                  htmlFor='dropzone-file'
                >
                  Upload Assets
                </label>
                <p className='block text-[14px] text-textSubtle mb-4'>
                  you can use format PNG, GIF, WEBP, MP4 or MP3. Max 100MB.
                </p>
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
                                onClick={(e) => nftFileChangeHandler(e, index)}
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
                                onClick={(e) => nftFileChangeHandler(e, index)}
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
                      disabled={isPreview}
                      key={index}
                      id={`dropzone-file${index}`}
                      type='file'
                      className='hidden'
                      accept='audio/*, image/*, video/*'
                      onChange={(e) => nftFileChangeHandler(e, index)}
                    />
                  </label>
                </div>
                {nft.assets.isFileError && (
                  <p className='validationTag'>Please select a valid file.</p>
                )}
                {checkedValidation && !nft.assets.file && (
                  <p className='validationTag'>Assets is required.</p>
                )}
                {nft.assets.limitExceeded && (
                  <p className='validationTag'>
                    {`You can upload your assets up to 100 MB`}
                  </p>
                )}
              </div>
              <div className='mb-6'>
                <p className='txtblack text-[14px]'>External Links</p>
                <>
                  <DebounceInput
                    minLength={1}
                    debounceTimeout={0}
                    className={`debounceInput mt-1 ${
                      isPreview ? ' !border-none bg-transparent' : ''
                    } `}
                    disabled={isPreview}
                    value={nft.externalLink}
                    onChange={(e) =>
                      onTextfieldChange(index, 'externalLink', e.target.value)
                    }
                    placeholder='https://'
                  />
                </>
              </div>
              <div className='mb-6'>
                <p className='txtblack text-[14px]'>Description</p>
                <textarea
                  value={nft.description}
                  onChange={(e) =>
                    onTextfieldChange(index, 'description', e.target.value)
                  }
                  name='description'
                  id='description'
                  cols='30'
                  rows='6'
                  placeholder='Add brief description about this NFT'
                  className={`mt-1 p-4 ${
                    isPreview ? ' !border-none bg-transparent' : ''
                  } `}
                  disabled={isPreview}
                ></textarea>
              </div>
              {typeof window !== 'undefined' && (
                <div className='mb-6'>
                  <div className='flex items-center mb-2'>
                    <Tooltip message='If you selecting a Collection, it will generate automatically'></Tooltip>
                    <p className='txtblack text-[14px]'>Connect Collection</p>
                  </div>
                  <Select
                    // defaultValue={curCollection}
                    value={curCollection}
                    onChange={(data) => setCollection_id(data?.id)}
                    onKeyDown={(event) => onDaoSearch(event.target.value)}
                    options={options}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (base) => ({
                        ...base,
                        border: isPreview
                          ? 'none'
                          : '1px solid hsl(0, 0%, 80%)',
                      }),
                    }}
                    isDisabled={query?.collection_id || isPreview}
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
                    <DebounceInput
                      debounceTimeout={0}
                      className={`debounceInput mt-1 ${
                        isPreview ? ' !border-none bg-transparent' : ''
                      } `}
                      disabled
                      value={networkName}
                      type='text'
                    />
                  </>
                </div>
              )}
              <div className='mb-6'>
                <p className='txtblack text-[14px]'>Benefit</p>
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
                      placeholder=''
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
                {!isPreview && (
                  <button
                    onClick={() => addMoreBenefits(index)}
                    className='h-[43px] mb-4 mr-4 px-4 py-2 text-[14px]  bg-primary-900/[.20] font-black  rounded text-primary-900   '
                  >
                    Add More Benefit
                  </button>
                )}
              </div>

              <div className='mb-6'>
                <p className='text-txtblack font-bold '>Properties</p>
                <p className='text-textSubtle text-[14px] mb-[16px]'>
                  Add the properties on your NFT.
                </p>
                <div className='flex py-3 border-b border-b-divider'>
                  <i className='fa-regular fa-grip-lines'></i>
                  <div className='flex-1 px-3'>
                    <p className='-mt-1'>Properties</p>
                    <small className='text-textSubtle'>
                      Add NFT properties
                    </small>
                  </div>
                  <>
                    {!isPreview && (
                      <i
                        className='fa-regular fa-square-plus text-2xl text-primary-900 cursor-pointer'
                        onClick={() => openPropertyModal(index)}
                      ></i>
                    )}
                  </>
                </div>
                <div className='flex py-3 border-b border-b-divider'>
                  <p className='text-txtblack text-[18px] font-black'>18+</p>
                  <div className='flex-1 px-3'>
                    <p className='-mt-1'>Sensitive Content</p>
                    <small className='text-textSubtle'>
                      Defined properties on your NFT
                    </small>
                  </div>
                  {isPreview ? (
                    <p className='text-[14px] text-textSubtle'>
                      {nft.sensitiveContent.toString().toLocaleUpperCase()}
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
                <div className='grid grid-cols-1 mt-2'>
                  {isListUpdate && (
                    <div className='text-center mt-3'>
                      <i className='fa-solid fa-loader fa-spin text-primary-900'></i>
                    </div>
                  )}
                  {!isListUpdate &&
                    nft.properties &&
                    nft.properties.map((property, i) => (
                      <div key={i}>
                        {property.key && property.value && (
                          <div key={i}>
                            <div className='flex items-center mt-3'>
                              <input
                                name={`preview-type-${i}`}
                                type={'text'}
                                className='w-32 bg-gray-200 disabled:cursor-not-allowed'
                                defaultValue={property.key}
                                disabled={true}
                              />

                              <input
                                name={`preview-name-${i}`}
                                type={'text'}
                                className='ml-4 w-32 bg-gray-200 disabled:cursor-not-allowed'
                                defaultValue={property.value}
                                disabled={true}
                              />

                              <>
                                {!isPreview && (
                                  <i
                                    className='cursor-pointer fa-solid fa-trash text-danger-1/[0.7] ml-3'
                                    onClick={() => {
                                      removePropertyOfTier(nft, i);
                                    }}
                                  ></i>
                                )}
                              </>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

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
                      isPreview ? ' !border-none bg-transparent' : ''
                    } `}
                    disabled={isPreview}
                    value={nft.supply}
                    type='number'
                    onChange={(e) =>
                      onTextfieldChange(index, 'supply', e.target.value)
                    }
                    placeholder='Supply for the NFT'
                  />
                  {checkedValidation && nft.supply === '' && (
                    <p className='validationTag'>Supply is required</p>
                  )}
                </>
              </div>
            </div>
          ))}
        </div>
        <div className='py-6 flex justify-center'>
          {isPreview ? (
            <>
              <button
                onClick={() => setIsPreview(false)}
                className='h-[43px] mb-4 mr-4 px-6 py-2 bg-primary-900/[.20] font-black  rounded text-primary-900   '
              >
                Back
              </button>
              <button
                onClick={nextHandle}
                className='w-[140px] !text-[16px] h-[44px] contained-button   md:ml-auto'
              >
                Submit
              </button>
            </>
          ) : (
            <>
              {!updateMode && (
                <button
                  onClick={addMoreTier}
                  className='h-[43px] mb-4 mr-4 px-3  md:px-6 py-2 bg-primary-900/[.20] font-black  rounded text-primary-900   '
                >
                  Add more tier
                </button>
              )}
              <button
                onClick={nextHandle}
                className='w-[140px] !text-[16px] h-[44px] contained-button   md:ml-auto'
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
                    <input
                      name={`type-${index}`}
                      type={'text'}
                      className='w-32'
                      defaultValue={property.key}
                      onChange={(e) => handleOnChangePropertyType(e, index)}
                    />

                    <input
                      name={`name-${index}`}
                      type={'text'}
                      className='ml-3 w-32'
                      defaultValue={property.value}
                      onChange={(e) => handleOnChangePropertyName(e, index)}
                    />

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
                className='h-[38px] mb-4 mr-4 px-6 py-2 bg-primary-900/[.20] font-black  rounded text-primary-900'
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
          message={`You successfully ${updateMode ? 'update' : 'create'}
                    a Membership NFT!`}
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
          }}
          show={showErrorModal}
          title={errorTitle}
          message={errorMessage}
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
          handleApply={deleteMembershipNFT}
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
    </>
  );
}
