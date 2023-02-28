import Modal from 'components/Commons/Modal';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import daoConnectSvg from 'assets/images/modal/daoConnect.svg';
import Tooltip from 'components/Commons/Tooltip';
import Select from 'react-select';
import { getUserProjectListById } from 'services/project/projectService';
import { connectCollectionToDAO } from 'services/collection/collectionService';
import Link from 'next/link';
import Spinner from 'components/Commons/Spinner';
import SuccessModal from 'components/Modals/SuccessModal';
import ErrorModal from 'components/Modals/ErrorModal';
import { NETWORKS } from 'config/networks';
import { uniqBy } from 'lodash';
import { event } from 'nextjs-google-analytics';
import TagManager from 'react-gtm-module';

export default function DaoConnectModal({
  handleClose,
  show,
  userId,
  collection,
  dao,
  onSuccessFullyConnect,
}) {
  const [selectedOption, setSelectedOption] = useState(dao?.id ? dao : null);
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [payload, setPayload] = useState({
    id: userId,
    page: 1,
    perPage: 10,
    keyword: '',
    order_by: 'newer',
  });
  const [daoConnecting, setDaoConnecting] = useState(false);
  const [hasNextPageData, setHasNextPageData] = useState(true);
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function daoFetch() {
    setIsLoading(true);
    await getUserProjectListById(payload)
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

  useEffect(() => {
    if (userId && hasNextPageData) {
      daoFetch();
    }
  }, [payload]);

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
  async function connectDao() {
    event('collection_connect_dao', { category: 'collection' });
    TagManager.dataLayer({
      dataLayer: {
        event: 'click_event',
        category: 'collection',
        pageTitle: 'collection_connect_dao',
      },
    });
    setDaoConnecting(true);
    let payload = { ...collection };
    payload.project_uid = selectedOption?.id;
    delete payload?.assets;
    delete payload?.royalty_splitter;
    await connectCollectionToDAO(payload)
      .then((res) => {
        setDaoConnecting(false);
        setStep(2);
        if (res?.code === 0) {
          setShowSuccessModal(true);
        } else {
          setShowErrorModal(true);
          setErrorMessage(res?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setDaoConnecting(false);
      });
  }
  function scrolledBottom() {
    let oldPayload = { ...payload };
    oldPayload.page = oldPayload.page + 1;
    setPayload(oldPayload);
  }

  return (
    <>
      {step === 1 && (
        <Modal
          width={450}
          show={show}
          handleClose={() => handleClose(false)}
          showCloseIcon={true}
        >
          <div className='mt-2'>
            <Image
              src={daoConnectSvg}
              unoptimized
              height={200}
              width={200}
              alt='dao connect svg'
              className='max-w-[200px] max-h-[200px] rounded block mx-auto mb-2'
            />
            <h3 className='text-center text-txtblack mb-4 !text-[22px]'>
              Connect Your Dao
            </h3>
            <p className='text-sm break-normal px-4 mb-6 md:max-w-[400px] text-center mx-auto'>
              Connect your Collection with Existing DAO or create the new one.
              its easy with only few steps.
            </p>
            <div className='px-4'>
              {/* <Tooltip message='This field will not be changeable after publishing on the blockchain.'></Tooltip> */}
              <div className='flex flex-wrap items-center mb-2'>
                <label className='text-[14px] font-bold'>Select DAO</label>
                {selectedOption?.blockchain && (
                  <Image
                    src={`${
                      NETWORKS[parseInt(selectedOption?.blockchain)]?.icon?.src
                    }`}
                    alt=''
                    className='h-[18px] w-[18px] ml-1'
                    height={20}
                    width={20}
                  />
                )}
              </div>
              {typeof window !== 'undefined' && (
                <Select
                  defaultValue={selectedOption}
                  onChange={setSelectedOption}
                  onKeyDown={(event) => onDaoSearch(event.target.value)}
                  options={options}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                  placeholder=''
                  isLoading={isLoading}
                  noOptionsMessage={() => 'No Dao Found'}
                  loadingMessage={() => 'Loading,please wait...'}
                  getOptionLabel={(option) => `${option.name}`}
                  classNamePrefix='dao-connect'
                  isClearable
                  isSearchable
                  menuShouldScrollIntoView
                  disabled={daoConnecting}
                  onMenuScrollToBottom={() => scrolledBottom()}
                />
              )}
              <p className='text-[14px] mt-2 mb-6'>
                Don't have DAO?{' '}
                <Link className='text-primary-900' href='/dao/create'>
                  {' '}
                  Create New{' '}
                </Link>
              </p>
              <button
                onClick={() => connectDao()}
                disabled={!selectedOption || daoConnecting}
                className={`block mx-auto w-full mt-4 ${
                  !selectedOption
                    ? 'bg-color-asss-3 py-2 text-white rounded'
                    : 'contained-button'
                }`}
              >
                {daoConnecting ? <Spinner forButton={true} /> : 'Submit'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {step === 2 && (
        <>
          {showSuccessModal && (
            <SuccessModal
              show={showSuccessModal}
              handleClose={() => {
                setShowSuccessModal(false);
                setStep(1);
                handleClose(false);
                onSuccessFullyConnect();
              }}
              message='Dao Successfully Connected'
              btnText='Close'
            />
          )}
          {showErrorModal && (
            <ErrorModal
              handleClose={() => {
                setShowErrorModal(false);
                setErrorMessage('');
                setStep(1);
              }}
              show={showErrorModal}
              message={errorMessage}
              buttomText='Try Again'
            />
          )}
        </>
      )}
    </>
  );
}
