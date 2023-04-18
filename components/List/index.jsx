/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  getUserProjectListById,
  getProjectCategory,
} from 'services/project/projectService';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore, { Autoplay } from 'swiper';
import DAOCard from 'components/Cards/DAOCard';
import CollectionCard from 'components/Cards/CollectionCard';
import NFTListCard from 'components/Cards/NFTListCard';
import Sort from 'assets/images/icons/sort.svg';
import { toast } from 'react-toastify';
import { getCollections } from 'services/collection/collectionService';
import ReactPaginate from 'react-paginate';
import { getMintedNftListByUserId } from 'services/nft/nftService';
import emptyStateCommon from 'assets/images/profile/emptyStateCommon.svg';
import Image from 'next/image';
import TokenGatedProjectCard from 'components/Cards/TokenGatedProjectCard';
import { getTokenGatedProjectList } from 'services/tokenGated/tokenGatedService';
import { ls_GetUserID } from 'util/ApplicationStorage';
import { useRouter } from 'next/router';
import { createTokenGatedProject } from 'services/tokenGated/tokenGatedService';
import { useSelector } from 'react-redux';
function List({ query }) {
  SwiperCore.use([Autoplay]);
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortType, setSortType] = useState('newer');
  const [pagination, SetPagination] = useState([]);
  const [isActive, setIsactive] = useState(1);
  const userinfo = useSelector((state) => state.user.userinfo);
  const payload = {
    order_by: 'newer',
    page: 1,
    limit: 10,
    keyword: '',
  };

  const calculatePageCount = (pageSize, totalItems) => {
    return totalItems < pageSize ? 1 : Math.ceil(totalItems / pageSize);
  };

  async function getProjectList(payload, orderBy, isSearch = false) {
    payload.order_by = orderBy;

    const categoriesRes = await getProjectCategory();
    let projectResponse = [];
    if (query?.type === 'collection') {
      let listType = '';
      if (query?.user === 'true') {
        listType = 'user';
      }
      projectResponse = await getCollections(
        listType,
        '',
        payload.page,
        10,
        payload.keyword,
        payload.order_by
      );
    } else if (query?.type === 'dao') {
      let payloadData = {
        id: ls_GetUserID(),
        page: payload.page,
        perPage: 10,
        keyword: payload.keyword,
        order_by: payload.order_by,
      };
      projectResponse = await getUserProjectListById(payloadData);
    } else if (query?.type === 'nft') {
      let payloadData = {
        userId: ls_GetUserID(),
        page: payload.page,
        limit: 10,
        keyword: payload.keyword,
        order_by: payload.order_by,
      };
      projectResponse = await getMintedNftListByUserId(payloadData);
    }
    if (query?.type === 'tokenGated') {
      let listType = '';
      if (query?.user === 'true') {
        listType = 'user';
      }
      let payloadData = {
        id: ls_GetUserID(),
        page: payload.page,
        limit: 10,
        keyword: payload.keyword,
        order_by: payload.order_by,
      };
      projectResponse = await getTokenGatedProjectList(payloadData);
    }

    if (categoriesRes?.categories && projectResponse?.data) {
      let projects = [];

      if (query?.type !== 'nft') {
        projects = projectResponse.data.map((project) => {
          project.category_name = categoriesRes.categories.find(
            (category) => category.id === project.category_id
          )?.name;
          return project;
        });
      } else {
        projects = projectResponse.data;
      }

      // types

      if (isSearch) {
        setSearchList(projects);
      } else {
        setProjectList(projects);
      }
      if (projectResponse.total && projectResponse.total > 0) {
        const page = calculatePageCount(10, projectResponse.total);
        const pageList = [];
        for (let index = 1; index <= page; index++) {
          pageList.push(index);
        }
        SetPagination(pageList);
      }
    } else {
      SetPagination([]);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      payload.page = isActive;
      if (searchKeyword.length > 0) {
        payload.keyword = searchKeyword;
      }
      await getProjectList(
        payload,
        sortType,
        searchKeyword.length > 0 ? true : false
      );
      // await getCollectionList();
    })();
  }, [sortType, query, userinfo?.id]);

  function handleSortType(type) {
    setSortType(type);
  }

  function searchProject(event) {
    event.stopPropagation();
    event.preventDefault();
    const text = event.currentTarget.value;
    setSearchKeyword(text);
    if (text && text.length > 2) {
      // todo: use debounce
      payload.keyword = text;
      setIsactive(1);
      getProjectList(payload, sortType, true);
    }
  }
  async function clearSearch() {
    setSearchKeyword('');
    payload.page = 1;
    setIsactive(1);
    await getProjectList(payload, 'newer');
  }

  useEffect(() => {
    const navItem = document.getElementById('nav-home');
    if (navItem) navItem.classList.add('active-menu');
  }, []);
  useEffect(
    () => () => {
      const navItem = document.getElementById('nav-home');
      if (navItem) navItem.classList.remove('active-menu');
    },
    []
  );
  const isSearching = searchKeyword.length > 2;

  const handlePageClick = (event) => {
    setIsactive(event.selected + 1);
  };
  const onCreateItems = async (type) => {
    if (type === 'dao') {
      router.push('/dao/create');
    } else if (type === 'collection') {
      router.push('/collection/create');
    } else if (type === 'tokenGated') {
      setIsLoading(true);
      const title = `Unnamed Project ${new Date().toISOString()}`;
      await createTokenGatedProject(title)
        .then((res) => {
          setIsLoading(false);
          if (res.code === 0) {
            router.push(`/token-gated/${res?.token_gate_project?.id}`);
          } else {
            toast.error(`Failed, ${res?.message}`);
          }
        })
        .catch((err) => {
          toast.error(`Failed, ${err}`);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    payload.page = isActive;
    if (searchKeyword.length > 0) {
      payload.keyword = searchKeyword;
    }
    setIsLoading(true);
    getProjectList(payload, sortType, searchKeyword.length > 0 ? true : false);
  }, [isActive]);

  return (
    <>
      {isLoading && <div className='loading'></div>}
      <div className='text-txtblack'>
        {/* <h1 className='my-6 pl-4'>
          {query?.type === 'collection'
            ? 'Collection List'
            : query?.type === 'dao'
            ? 'DAO List'
            : query?.type === 'tokenGated'
            ? 'Token Gated Project List'
            : 'Minted NFT List'}
        </h1> */}

        <div className='mr-4 flex-1 block md:hidden'>
          <div className='relative'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none'>
              <i className='fa-regular fa-magnifying-glass text-primary-900 text-lg'></i>
            </div>
            <input
              type='text'
              id='default-search'
              style={{
                paddingLeft: 40, // todo: use tailwind
                border: 'none',
              }}
              className='text-lg shadow-main w-full rounded-lg placeholder-color-ass-4 h-[72px] text-[#000] pl-[40px]'
              placeholder='Search by name or title...'
              onChange={searchProject}
              value={searchKeyword}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  searchProject(event);
                }
              }}
            />
          </div>
        </div>
        <section className='flex px-4 mb-6 mt-6'>
          <div className='mr-4 flex-1 hidden md:block'>
            <div className='relative'>
              <div className='flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none'>
                <i className='fa-regular fa-magnifying-glass text-primary-900 text-lg'></i>
              </div>
              <input
                type='text'
                id='default-search'
                style={{
                  paddingLeft: 40, // todo: use tailwind
                  border: 'none',
                }}
                className='text-lg shadow-main w-full rounded-lg placeholder-color-ass-4 h-[72px] text-[#000] pl-[40px]'
                placeholder='Search by name or title...'
                onChange={searchProject}
                value={searchKeyword}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    searchProject(event);
                  }
                }}
              />
            </div>
          </div>

          <div className='dropdown relative w-1/2 md:w-auto'>
            <button
              className='bg-white dropdown-toggle p-4 text-textSubtle font-black font-satoshi-bold rounded-lg shadow-main flex items-center justify-between w-full md:w-15 md:w-44 h-[72px]'
              type='button'
              id='dropdownMenuButton1'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              <span className=''> Sort Of</span>
              <i className='fa-solid fa-angle-down hidden md:block'></i>
              {/* <Image src={Sort} alt='sort' className='block md:hidden' /> */}
            </button>

            <ul
              className='dropdown-menu w-[150px] md:w-full absolute hidden bg-white text-base z-50 py-2 list-none rounded-lg shadow-main  mt-1 '
              aria-labelledby='dropdownMenuButton1'
            >
              <li onClick={() => handleSortType('newer')}>
                <div
                  className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                    sortType === 'newer' ? 'text-primary-900' : 'text-txtblack'
                  } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  Newer
                </div>
              </li>
              <li onClick={() => handleSortType('older')}>
                <div
                  className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                    sortType === 'older' ? 'text-primary-900' : 'text-txtblack'
                  } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  older
                </div>
              </li>
              <li onClick={() => handleSortType('view')}>
                <div
                  className={`cursor-pointer dropdown-item py-2 px-4 block whitespace-nowrap ${
                    sortType === 'view' ? 'text-primary-900' : 'text-txtblack'
                  } hover:bg-slate-50 transition duration-150 ease-in-out`}
                >
                  view
                </div>
              </li>
            </ul>
          </div>
          <button
            onClick={() => onCreateItems(query?.type)}
            className='contained-button rounded ml-[10px] !text-white !no-underline'
          >
            <i className='fa-solid fa-plus mr-2 font-bold'></i>
            Create{' '}
            {query?.type === 'collection'
              ? 'Collection'
              : query?.type === 'dao'
              ? 'DAO'
              : query?.type === 'tokenGated'
              ? 'Token Gated Project'
              : ''}
          </button>
        </section>
        <section>
          {isSearching ? (
            <h4 className='ml-4 mb-5'>
              {`Showing result for "${searchKeyword}"`}{' '}
              <p
                className='text-primary-900 font-light cursor-pointer'
                onClick={clearSearch}
              >
                clear
              </p>
            </h4>
          ) : null}
          {isSearching && searchList.length === 0 ? (
            <div className='p-5 text-center min-h-[100px] text-primary-700'>
              <div className='text-center mt-6 text-textSubtle'>
                <Image
                  src={emptyStateCommon}
                  className='h-[210px] w-[315px] m-auto'
                  alt=''
                  height={210}
                  width={315}
                />
                <p className='text-subtitle font-bold mb-10'>Nothing Found</p>
                {query?.type !== 'nft' && (
                  <button
                    onClick={() => onCreateItems(query?.type)}
                    className='contained-button rounded ml-auto !text-white !py-3 !no-underline'
                  >
                    <i className='fa-solid fa-plus mr-2'></i>
                    Create{' '}
                    {query?.type === 'collection'
                      ? 'Collection'
                      : query?.type === 'dao'
                      ? 'DAO'
                      : query?.type === 'tokenGated'
                      ? 'Token Gated Project'
                      : ''}
                  </button>
                )}
              </div>
            </div>
          ) : null}
          {!isLoading && (
            <>
              {projectList.length > 0 ? (
                <div className='mx-4'>
                  {query?.type === 'collection' && (
                    <section className='grid gap-6  grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                      {isSearching
                        ? searchList.map((item, index) => (
                            <div key={item.id}>
                              <CollectionCard key={index} collection={item} />
                            </div>
                          ))
                        : projectList.map((item, index) => (
                            <div key={item.id}>
                              <CollectionCard key={item.id} collection={item} />
                            </div>
                          ))}
                    </section>
                  )}

                  {query?.type === 'dao' && (
                    <section className='grid gap-6  grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                      {isSearching
                        ? searchList.map((item, index) => (
                            <div className='my-0 md:my-4' key={item.id}>
                              <DAOCard item={item} key={item.id} />
                            </div>
                          ))
                        : projectList.map((item, index) => (
                            <div className='my-0 md:my-4' key={item.id}>
                              <DAOCard item={item} key={item.id} />
                            </div>
                          ))}
                    </section>
                  )}

                  {query?.type === 'nft' && (
                    <section className='grid gap-6  grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                      {isSearching
                        ? searchList.map((nft, index) => (
                            <div key={`${nft.id}-${nft.token_id}`}>
                              <NFTListCard nft={nft} />
                            </div>
                          ))
                        : projectList.map((nft, index) => (
                            <div key={`${nft.id}-${nft.token_id}`}>
                              <NFTListCard nft={nft} />
                            </div>
                          ))}
                    </section>
                  )}

                  {query?.type === 'tokenGated' && (
                    <section className='grid gap-6  grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                      {isSearching
                        ? searchList.map((item, index) => (
                            <div key={item.id}>
                              <TokenGatedProjectCard
                                key={index}
                                tokenGatedProject={item}
                              />
                            </div>
                          ))
                        : projectList.map((item, index) => (
                            <div key={item.id}>
                              <TokenGatedProjectCard
                                key={item.id}
                                tokenGatedProject={item}
                              />
                            </div>
                          ))}
                    </section>
                  )}
                </div>
              ) : (
                <>
                  <div className='p-5 text-center min-h-[100px] text-primary-700'>
                    <div className='text-center mt-6 text-textSubtle'>
                      <Image
                        src={emptyStateCommon}
                        className='h-[210px] w-[315px] m-auto'
                        alt=''
                        unoptimized
                        height={210}
                        width={210}
                      />
                      <p className='text-subtitle font-bold mb-10'>
                        You don`t have any{' '}
                        {query?.type === 'collection'
                          ? 'Collection'
                          : query?.type === 'dao'
                          ? 'DAO'
                          : query?.type === 'tokenGated'
                          ? 'Token Gated Project'
                          : 'Minted NFT'}{' '}
                        yet
                      </p>
                      {query?.type !== 'nft' && (
                        <button
                          onClick={() => onCreateItems(query?.type)}
                          className='contained-button rounded ml-auto !text-white !py-3 !no-underline'
                        >
                          <i className='fa-solid fa-plus mr-2'></i>
                          Create{' '}
                          {query?.type === 'collection'
                            ? 'Collection'
                            : query?.type === 'dao'
                            ? 'DAO'
                            : query?.type === 'tokenGated'
                            ? 'Token Gated Project'
                            : ''}
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </section>

        {/* ----- End Card Section ---- */}

        {pagination.length > 0 && (
          <ReactPaginate
            className='flex flex-wrap md:space-x-10 space-x-3 justify-center items-center my-6'
            pageClassName='px-3 py-1 font-satoshi-bold text-sm  bg-opacity-5 rounded hover:bg-opacity-7 !text-txtblack '
            breakLabel='...'
            nextLabel='>'
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pagination.length}
            previousLabel='<'
            renderOnZeroPageCount={null}
            activeClassName='text-primary-900 bg-primary-900 !no-underline'
            activeLinkClassName='!text-txtblack !no-underline'
          />
        )}
        {/* End pagination */}
      </div>
    </>
  );
}

export default List;
