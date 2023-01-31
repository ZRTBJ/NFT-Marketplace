import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'components/Commons/Modal';
import SettingContent from './components/SettingContent';
import Configuration from './components/Configuration';
import Review from './components/Review';
import { uniqBy } from 'lodash';
import IntegrateNewCollection from './components/IntegrateNewCollection';
import {
  getCollectionDetailFromContract,
  getUserCollections,
} from 'services/collection/collectionService';
import {
  createTokenGatedContent,
  updateTokenGatedContent,
  publishTokenGatedContent,
  configMultiContent,
  getTokenGatedContentDetail,
} from 'services/tokenGated/tokenGatedService';
import { getNotificationData } from 'redux/notification';
import axios from 'axios';
import Config from 'config/config';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import { ls_GetUserToken } from 'util/ApplicationStorage';

const STEPS = [
  { id: 1, label: 'Setting Content' },
  { id: 2, label: 'Configuration' },
  { id: 3, label: 'Review' },
];

export default function AddNewContent({
  show,
  handleClose,
  tokenProjectId,
  onContentAdded,
  linkDetails,
  setShowUploadByLinkModal,
  contents,
  isConfigureAll,
  allContents,
  setLinkDetails,
}) {
  const [activeStep, setActiveStep] = useState(1);
  const [content, setContent] = useState({
    media: null,
    title: '',
    description: '',
    isExplicit: false,
    accessToAll: false,
  });
  const [handledSteps, setHandledSteps] = useState([]);
  const [configurations, setConfigurations] = useState([{ id: 1 }]);
  const [payload, setPayload] = useState({
    page: 1,
    perPage: 10,
    keyword: '',
    order_by: 'newer',
  });
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [hasNextPageData, setHasNextPageData] = useState(true);
  const [showAddCollection, setShowAddCollection] = useState(null);
  const [smartContractAddress, setSmartContractAddress] = useState('');
  const [collectionDetail, setCollectionDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [jobId, setJobId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileUploadNotification = useSelector((state) =>
    state?.notifications?.notificationData
      ? state?.notifications?.notificationData
      : []
  );
  const [publishNow, setPublishNow] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [blockchain, setBlockchain] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [selectedContractValidation, setSelectedContractValidation] =
    useState(false);
  const [selectedContractError, setSelectedContractError] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isConfigureAll) {
      setActiveStep(2);
    }
  }, [isConfigureAll]);

  useEffect(() => {
    if (contents?.length) {
      console.log(contents);
      let title = contents[0]?.title;
      let description = contents[0]?.description;
      let isExplicit = contents[0]?.sensitive;
      let config_names = contents[0]?.config_names;
      let token = ls_GetUserToken();
      if (contents?.[0]?.id) {
        getContentDetail(contents[0].id);
      }
      setIsEdit(true);
      setContent({
        title,
        description,
        isExplicit,
        media: {
          path: `${contents[0]?.consumable_data}?token=${token}`,
          file: { type: contents[0]?.file_type },
        },
        accessToAll: config_names?.length ? false : true,
      });
      if (contents?.[0]?.content_type === 'url') {
        setLinkDetails({
          link: `${contents[0]?.consumable_data}?token=${token}}`,
          type: contents[0]?.file_type,
        });
      } else {
        setLinkDetails({ link: '', type: 'image' });
      }
    }
  }, [contents]);

  useEffect(() => {
    // file upload web socket
    const projectDeployStatus = fileUploadNotification.find(
      (x) => x.function_uuid === jobId
    );
    if (projectDeployStatus && projectDeployStatus.data) {
      const data = JSON.parse(projectDeployStatus.data);
      if (data.Data['asset_uid'] && data.Data['asset_uid'].length > 0) {
        handleCreateContent(data.Data['asset_uid']);
      } else {
        setIsLoading(false);
        setShowError(true);
      }
    }
  }, [fileUploadNotification, jobId]);

  const getContentDetail = (contentId) => {
    getTokenGatedContentDetail(contentId)
      .then((resp) => {
        if (resp.code === 0) {
          console.log(resp);
          if (resp?.token_gate_content?.token_gate_configs.length) {
            let tokenConfigs = resp?.token_gate_content?.token_gate_configs;
            let finalData = tokenConfigs.map((item, id) => {
              let tokens = item?.token_config.split('-');
              return {
                id: id + 1,
                name: item?.collection_name,
                collectionAddress: item?.collection_ct,
                blockchain: item?.blockchain,
                ...(tokens?.length === 2 && {
                  tokenMin: tokens[0],
                  tokenMax: tokens[1],
                  settings: 'Token Range',
                }),
                ...(tokens?.filter((item) => item)?.length === 1 && {
                  tokenId: tokens[0],
                  settings: 'Specific Token ID',
                }),
                ...(tokens?.filter((item) => item)?.length === 0 && {
                  settings: 'All Token ID',
                }),
              };
            });
            setConfigurations(finalData);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFieldChange = (e) => {
    setContent({
      ...content,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleMediaFile = (e) => {
    try {
      const file = e.currentTarget.files[0];
      setContent({
        ...content,
        media: { file, path: URL.createObjectURL(file) },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleStep = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (activeStep === 1) {
      if (
        (content?.title && content?.media?.file) ||
        (content?.title && linkDetails.link)
      ) {
        setHandledSteps([...handledSteps, activeStep]);
        setActiveStep(activeStep + 1);
      }
    } else {
      setHandledSteps([...handledSteps, activeStep]);
      setActiveStep(activeStep + 1);
    }
  };

  const handleConfigurations = (id, collectionID, name, blockchain) => {
    let items = configurations.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          collectionAddress: collectionID,
          name,
          blockchain,
        };
      }
      return item;
    });
    setConfigurations(items);
    setShowAddCollection(null);
    setSmartContractAddress('');
  };

  const deleteConfiguration = (id) => {
    console.log(id);
    let configures = configurations.filter((value) => value.id !== id);
    setConfigurations(configures);
    if (!configures.length) {
      setContent({ ...content, accessToAll: true });
    }
  };

  function scrolledBottom() {
    let oldPayload = { ...payload };
    oldPayload.page = oldPayload.page + 1;
    setPayload(oldPayload);
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

  useEffect(() => {
    if (hasNextPageData) {
      collectionFetch();
    }
  }, [payload]);

  const addConfigurations = () => {
    setConfigurations([...configurations, { id: configurations.length + 1 }]);
  };

  async function collectionFetch() {
    setIsCollectionLoading(true);
    await getUserCollections(payload)
      .then((res) => {
        if (res?.code === 0) {
          // const matchedBlockchainDao = res?.data?.filter(
          //   (dao) => dao?.blockchain === collection?.blockchain
          // );
          const collectionList = [...options];
          const mergedCollectionList = [...collectionList, ...res?.data];
          const uniqCollectionList = uniqBy(mergedCollectionList, function (e) {
            return e.id;
          });
          let filtered = uniqCollectionList.filter(
            (list) => list.status === 'published'
          );
          setOptions(filtered);
          setIsCollectionLoading(false);
          if (res?.data?.length === 0) {
            setHasNextPageData(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setIsCollectionLoading(false);
      });
  }

  const handleSettings = (id, value) => {
    let items = configurations.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          settings: value,
        };
      }
      return item;
    });
    setConfigurations(items);
  };

  const handleConfigValue = (e, id) => {
    let items = configurations.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [e.target.name]: e.target.value,
        };
      }
      return item;
    });
    setConfigurations(items);
  };

  const handleAddressChange = (e) => {
    setSmartContractAddress(e.target.value);
  };

  const handleCreateContent = (asset_id) => {
    let payload = {
      title: content?.title,
      project_id: tokenProjectId,
    };
    if (content?.title) {
      createTokenGatedContent(payload)
        .then((resp) => {
          if (resp.code === 0) {
            let tokenId = resp?.token_gate_content?.id;
            handleUpdateContent(tokenId, asset_id);
            setCurrentContent(tokenId);
          } else {
            setIsLoading(false);
            setShowError(true);
            setPublishNow(false);
            setCurrentContent('');
          }
        })
        .catch((err) => {
          setIsLoading(false);
          setPublishNow(false);
          setShowError(true);
          setCurrentContent('');
        });
    }
  };

  const handleUpdateContent = (id, asset_id, isDraft = false) => {
    let config = configurations.map((item) => {
      return {
        col_contract_address: item?.collectionAddress,
        blockchain: item?.blockchain,
        col_name: item?.name,
        ...(item?.tokenId && { token_id: item?.tokenId }),
        ...(item?.tokenMin && { token_min: item?.tokenMin }),
        ...(item?.tokenMax && { token_max: item?.tokenMax }),
      };
    });
    let data = contents?.[0]?.data;
    let type = contents?.[0]?.file_type;

    let finalType = content.media?.file?.type
      ? content.media.file.type.split('/')[0]
      : '';
    // video type is not working
    if (finalType === 'video') {
      finalType = 'movie';
    }
    const linkType =
      linkDetails?.type === 'video' ? 'movie' : linkDetails?.type;
    let payload = {
      title: content?.title,
      description: content?.description,
      sensitive: content?.isExplicit,
      data: data ? data : linkDetails?.link ? linkDetails.link : asset_id,
      content_type: linkDetails?.link ? 'url' : 'asset_id',
      file_type: type ? type : linkDetails?.link ? linkType : finalType,
      ...((config.some((item) => item.col_contract_address) ||
        content?.accessToAll) && {
        configs: content?.accessToAll ? [] : JSON.stringify(config),
      }),
      ...(isDraft && { status: 'draft' }),
    };

    console.log(payload, linkDetails);

    updateTokenGatedContent(id, payload)
      .then((resp) => {
        if (resp.code === 0) {
          if (publishNow) {
            const data = {
              is_publish: true,
            };
            publishTokenGatedContent(id, data)
              .then((resp) => {
                if (resp.code === 0) {
                  setShowSuccess(true);
                  setPublishNow(false);
                  setIsLoading(false);
                } else {
                  setShowSuccess(false);
                  setPublishNow(false);
                  setIsLoading(false);
                  setShowError(true);
                  setCurrentContent('');
                }
              })
              .catch((err) => {
                setShowSuccess(false);
                setIsLoading(false);
                setShowError(true);
                setPublishNow(false);
                setCurrentContent('');
              });
          } else {
            setShowSuccess(true);
            setIsLoading(false);
          }
        } else {
          setShowSuccess(false);
          setIsLoading(false);
          setShowError(true);
          setCurrentContent('');
          setPublishNow(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setShowError(true);
        setPublishNow(false);
        setCurrentContent('');
      });
  };

  async function uploadAFile() {
    setIsSubmitted(true);
    let headers;
    let token = ls_GetUserToken();
    headers = {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    };
    setIsLoading(true);
    let formdata = new FormData();
    formdata.append('file', content?.media?.file);
    await axios({
      method: 'POST',
      url: Config.TOKEN_GATE_FILE_SERVER_URL,
      data: formdata,
      headers: headers,
    })
      .then((resp) => {
        const notificationData = {
          etherscan: '',
          function_uuid: resp?.job_id,
          data: '',
        };
        setJobId(resp?.job_id);
        dispatch(getNotificationData(notificationData));
      })
      .catch((err) => {
        setShowError(true);
        setIsLoading(false);
      });
  }

  const handlePublish = (e) => {
    e.preventDefault();
    setIsPublishing(true);
    setPublishNow(true);
    if (isEdit) {
      let id = contents?.[0]?.id;
      handleUpdateContent(id);
    } else {
      if (linkDetails?.link) {
        handleCreateContent();
      } else {
        uploadAFile();
      }
    }
  };

  const handleDraft = (e) => {
    e.preventDefault();
    if (isEdit) {
      let id = contents?.[0]?.id;
      handleUpdateContent(id, null, true);
    } else {
      if (linkDetails?.link) {
        handleCreateContent();
      } else {
        uploadAFile();
      }
    }
  };

  const handleConfigureAll = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let config = configurations.map((item) => {
      return {
        col_contract_address: item?.collectionAddress,
        blockchain: item?.blockchain,
        col_name: item?.name,
        ...(item?.tokenId && { token_id: item?.tokenId }),
        ...(item?.tokenMin && { token_min: item?.tokenMin }),
        ...(item?.tokenMax && { token_max: item?.tokenMax }),
      };
    });

    let configs = content?.accessToAll ? [] : JSON.stringify(config);

    allContents?.map((item, id) =>
      configMultiContent(item.id, configs)
        .then((resp) => {
          if (resp.code === 0) {
            if (id === allContents.length - 1) {
              setShowSuccess(true);
              setPublishNow(false);
              setIsLoading(false);
            }
          } else {
            setShowSuccess(false);
            setIsLoading(false);
            setShowError(true);
            setCurrentContent('');
            setPublishNow(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          setShowError(true);
          setPublishNow(false);
          setCurrentContent('');
        })
    );
  };

  const handleSelectCollection = (data) => {
    if (data?.contract_address) {
      getCollectionDetailFromContract(data?.contract_address, data?.blockchain)
        .then((resp) => {
          if (
            resp?.address &&
            resp?.contractMetadata?.tokenType !== 'UNKNOWN'
          ) {
            setSelectedContractValidation(true);
            setSelectedContractError(false);
            setCollectionDetail(data);
          } else {
            setSelectedContractValidation(false);
            setSelectedContractError(true);
          }
        })
        .catch((err) => {
          setSelectedContractValidation(false);
          setSelectedContractError(true);
        });
    }
  };

  if (isLoading) {
    return (
      <Modal
        width={400}
        show={isLoading}
        showCloseIcon={false}
        handleClose={() => setIsLoading(false)}
      >
        <div className='text-center '>
          <p className='font-black text-[18px]'>Please do not close the tab</p>
          <p>Your assets are being uploaded</p>
          <div className='overflow-hidden rounded-full h-4 w-full mt-4 md:mt-6 mb-8 relative animated fadeIn'>
            <div className='animated-process-bar'></div>
          </div>
        </div>
      </Modal>
    );
  }

  if (showSuccess) {
    return (
      <SuccessModal
        show={showSuccess}
        handleClose={() => {
          handleClose();
          setShowSuccess(false);
          setIsPublishing(false);
          onContentAdded();
        }}
        subMessage={
          isPublishing
            ? 'You can start sharing the content with token gated configs. Only verified users can see your content.'
            : ''
        }
        message={
          isPublishing
            ? `Your content is Published `
            : `Content Saved Successfully`
        }
        link={
          window !== 'undefined' && isPublishing && currentContent
            ? `${window.location.origin}/token-gated/content/${currentContent}`
            : ''
        }
        btnText='Close'
      />
    );
  }

  if (showError) {
    return (
      <ErrorModal
        handleClose={() => {
          setShowError(false);
          setIsPublishing(false);
        }}
        show={showError}
        message={`Content failed to ${
          isPublishing ? 'publish' : 'save'
        }. Please try again later`}
        buttomText='Try Again'
      />
    );
  }
  console.log(blockchain, collectionDetail);
  return (
    <Modal
      width={600}
      overflow={'auto'}
      show={show}
      handleClose={() => handleClose()}
      showCloseIcon={showAddCollection ? false : true}
    >
      <div className='py-4'>
        {showAddCollection ? (
          <IntegrateNewCollection
            smartContractAddress={smartContractAddress}
            handleAddressChange={handleAddressChange}
            handleConfigurations={handleConfigurations}
            scrolledBottom={scrolledBottom}
            onDaoSearch={onDaoSearch}
            isCollectionLoading={isCollectionLoading}
            options={options}
            setSmartContractAddress={setSmartContractAddress}
            collectionDetail={collectionDetail}
            showAddCollection={showAddCollection}
            addressError={addressError}
            setBlockchain={setBlockchain}
            blockchain={blockchain}
            setAddressError={setAddressError}
            setShowAddCollection={setShowAddCollection}
            handleSelectCollection={handleSelectCollection}
            selectedContractValidation={selectedContractValidation}
            selectedContractError={selectedContractError}
            setSelectedContractValidation={setSelectedContractValidation}
            setSelectedContractError={setSelectedContractError}
            setCollectionDetail={setCollectionDetail}
          />
        ) : (
          <>
            <h2 className='text-[28px] text-black'>Configure your content</h2>
            <p className='text-textLight text-[14px] mt-2'>
              Please set up the content to explain more to your audience.
            </p>
            {!isConfigureAll ? (
              <div className='flex items-center justify-around mt-5'>
                {STEPS.map((step) => (
                  <span
                    key={step.id}
                    onClick={() => {
                      if (handledSteps.includes(step.id)) {
                        setActiveStep(step.id);
                      }
                    }}
                    className={`w-[110px] text-center text-[14px] font-bold border-b-[4px] pb-2 cursor-pointer ${
                      handledSteps.includes(step.id) || activeStep === step.id
                        ? 'border-primary-900 text-primary-900'
                        : 'border-black-shade-800 text-black-shade-800'
                    }`}
                  >
                    {step.label}
                  </span>
                ))}
              </div>
            ) : null}
            <div>
              <div>
                {activeStep === 1 && (
                  <SettingContent
                    content={content}
                    handleFieldChange={handleFieldChange}
                    handleMediaFile={handleMediaFile}
                    isSubmitted={isSubmitted}
                    linkDetails={linkDetails}
                    setShowUploadByLinkModal={setShowUploadByLinkModal}
                    handleClose={handleClose}
                  />
                )}
                {activeStep === 2 && (
                  <Configuration
                    content={content}
                    handleFieldChange={handleFieldChange}
                    handleStep={handleStep}
                    configurations={configurations}
                    addConfigurations={addConfigurations}
                    handleSettings={handleSettings}
                    handleConfigValue={handleConfigValue}
                    setShowAddCollection={setShowAddCollection}
                    deleteConfiguration={deleteConfiguration}
                  />
                )}
                {activeStep === 3 && (
                  <Review
                    content={content}
                    configurations={configurations}
                    options={options}
                    linkDetails={linkDetails}
                  />
                )}
              </div>
              {isConfigureAll ? (
                <button
                  className='px-6 py-2 contained-button rounded font-black text-white-shade-900 w-full mt-6'
                  onClick={handleConfigureAll}
                >
                  Save
                </button>
              ) : (
                <div>
                  {activeStep === 3 ? (
                    <>
                      <button
                        className='px-6 py-2 contained-button rounded font-black text-white-shade-900 w-full mt-6'
                        onClick={handlePublish}
                      >
                        Publish Content
                      </button>

                      <button
                        className='px-6 py-2 rounded font-black text-textSubtle w-full mt-6 mb-4'
                        onClick={handleDraft}
                      >
                        Save as Draft
                      </button>
                    </>
                  ) : (
                    <button
                      className='px-6 py-2 contained-button rounded font-black text-white-shade-900 w-full mt-6'
                      onClick={handleStep}
                    >
                      Next <i className='ml-4 fa-solid fa-arrow-right'></i>
                    </button>
                  )}
                  {activeStep !== 3 && (
                    <button
                      className='px-6 py-2 rounded font-black text-textSubtle w-full mt-6 mb-4'
                      onClick={handleDraft}
                    >
                      Save as Draft
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
