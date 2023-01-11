import React, { useState, useEffect } from 'react';

import Modal from 'components/Commons/Modal';
import SettingContent from './components/SettingContent';
import Configuration from './components/Configuration';
import Review from './components/Review';
import { getUserCollections } from 'services/collection/collectionService';
import { uniqBy } from 'lodash';
import IntegrateNewCollection from './components/IntegrateNewCollection';
import { getCollectionDetailFromContract } from 'services/collection/collectionService';

const STEPS = [
  { id: 1, label: 'Setting Content' },
  { id: 2, label: 'Configuration' },
  { id: 3, label: 'Review' },
];

export default function AddNewContent({ show, handleClose }) {
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
    setHandledSteps([...handledSteps, activeStep]);
    setActiveStep(activeStep + 1);
  };

  const handleConfigurations = (id, collectionID) => {
    let items = configurations.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          collectionId: collectionID,
        };
      }
      return item;
    });
    setConfigurations(items);
    setShowAddCollection(null);
    setSmartContractAddress('');
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
            (list) => list.type === 'product'
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
    getCollectionDetailFromContract(e.target.value);
  };
  console.log(showAddCollection);
  return (
    <Modal
      width={600}
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
            setCollectionDetail={setCollectionDetail}
            collectionDetail={collectionDetail}
            showAddCollection={showAddCollection}
          />
        ) : (
          <>
            <h2 className='text-[28px] text-black'>Configure your content</h2>
            <p className='text-textLight text-[14px] mt-2'>
              Please set up the content to explain more to your audience.
            </p>
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
            <div>
              <div className='overflow-y-auto max-h-[650px]'>
                {activeStep === 1 && (
                  <SettingContent
                    content={content}
                    handleFieldChange={handleFieldChange}
                    handleMediaFile={handleMediaFile}
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
                  />
                )}
                {activeStep === 3 && (
                  <Review
                    content={content}
                    configurations={configurations}
                    options={options}
                  />
                )}
              </div>
              <div>
                {activeStep === 3 ? (
                  <button
                    className='px-6 py-2 contained-button rounded font-black text-white-shade-900 w-full mt-6'
                    onClick={handleStep}
                  >
                    Publish Content
                  </button>
                ) : (
                  <button
                    className='px-6 py-2 contained-button rounded font-black text-white-shade-900 w-full mt-6'
                    onClick={handleStep}
                  >
                    Next <i className='ml-4 fa-solid fa-arrow-right'></i>
                  </button>
                )}
                {activeStep !== 3 && (
                  <button className='px-6 py-2 rounded font-black text-textSubtle w-full mt-6'>
                    Save as Draft
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
