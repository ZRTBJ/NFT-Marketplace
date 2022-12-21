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
export default function DaoConnectModal({
  handleClose,
  show,
  userId,
  collection,
  dao,
}) {
  const [selectedOption, setSelectedOption] = useState(dao?.id ? dao : null);
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [payload, setPayload] = useState({
    id: userId,
    page: 1,
    perPage: 20,
    keyword: '',
    order_by: 'newer',
  });
  const [daoConnecting, setDaoConnecting] = useState(false);
  async function daoFetch() {
    setIsLoading(true);
    await getUserProjectListById(payload)
      .then((res) => {
        if (res?.code === 0) {
          const matchedBlockchainDao = res?.data?.filter(
            (dao) => dao?.blockchain === collection?.blockchain
          );
          setOptions(matchedBlockchainDao);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (userId) {
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
    if (selectedOption?.blockchain === collection?.blockchain) {
      setDaoConnecting(true);
      const payload = {
        id: collection?.id,
        project_uid: selectedOption?.id,
        total_supply: collection?.total_supply,
        blockchain: collection?.blockchain,
      };
      await connectCollectionToDAO(payload).then((res) => {
        console.log(res);
      });
    }
  }

  return (
    <Modal
      width={400}
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
        <h3 className='text-center text-txtblack mb-3 !text-[18px]'>
          Connect Your Dao
        </h3>
        <p className='text-sm break-normal px-4 mb-2'>
          Connect your Collection with Existing DAO or create the new one. its
          easy with only few steps.
        </p>
        <div className='px-4 '>
          {/* <Tooltip message='This field will not be changeable after publishing on the blockchain.'></Tooltip> */}
          <label className='text-[14px] font-bold'>Select DAO</label>
          <p className='text-[12px] mb-1 break-normal'>
            Same Blockchain Network of DAO will only appear here
          </p>
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
            />
          )}
          <p className='text-[14px] mb-4'>
            Don't have DAO?{' '}
            <Link className='text-primary-900' href='/dao/create'>
              {' '}
              Create New{' '}
            </Link>
          </p>
          <button
            onClick={() => connectDao()}
            disabled={!selectedOption || daoConnecting}
            className={`block mx-auto w-[200px]  ${
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
  );
}
