/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  getPublicProjectList,
  getProjectCategory,
} from 'services/project/projectService';
import HomeNavigateCard from 'components/Home/HomeNavigateCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore, { Autoplay } from 'swiper';
import CommonCard from 'components/CommonCard';
import { Navigation } from 'swiper';
import thumbIcon from 'assets/images/profile/card.svg';
import avatar from 'assets/images/dummy-img.svg';
import DAOCard from 'components/DAOCard';
import { getCollections } from 'services/collection/collectionService';
import { Link } from 'react-router-dom';
import InviteModal from 'components/modalDialog/InviteModal';
import { getIdbyCode } from 'services/nft/nftService';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Home() {
  SwiperCore.use([Autoplay]);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [popularProjectList, setPopularProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState('newer');
  const [collectionList, setCollectionList] = useState([]);
  const [inviteData, setInviteData] = useState();
  const [isInviteLoading, setIsInvteLoading] = useState(false);
  const [ShowInviteModal, setShowInviteModal] = useState(false);
  const { invite } = useParams();
  const userinfo = useSelector((state) => state.user.userinfo);

  const payload = {
    order_by: 'newer',
    page: 1,
    limit: 10,
    keyword: '',
  };
  const popularPayload = {
    order_by: 'view',
    page: 1,
    limit: 10,
  };

  useEffect(() => {
    if (invite) {
      getIdbyCode(invite)
        .then((resp) => {
          if (resp.code === 0) {
            setShowInviteModal(true);
          }
          setInviteData(resp);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  async function getProjectList(payload, type) {
    const categoriesRes = await getProjectCategory();
    const projectRes = await getPublicProjectList(payload);

    if (categoriesRes?.categories && projectRes?.data) {
      const projects = projectRes.data.map((project) => {
        project.category_name = categoriesRes.categories.find(
          (category) => category.id === project.category_id
        )?.name;
        return project;
      });
      // types
      if (type === "new") {
        setProjectList(projects);
      }
      if (type === "popular") {
        setPopularProjectList(projects);
      }
      // if (type === "search") {
      //   setSearchList(projects);
      // }
    }
    setIsLoading(false);
  }
  useEffect(() => {
    (async () => {
      await getProjectList(payload, "new");
      await getProjectList(popularPayload, "popular");
      await getCollectionList();
    })();
  }, []);

  function handleSortType(type) {
    setSortType(type);
    payload.order_by = type;
    getProjectList(payload, 'new');
  }

  function searchProject(event) {
    event.stopPropagation();
    event.preventDefault();
    const text = event.currentTarget.value;
    setSearchKeyword(text);
    if (text && text.length > 2) {
      // todo: use debounce
      payload.keyword = text;
      getProjectList(payload, "new");
    }
  }

  async function getCollectionList() {
    setIsLoading(true);
    await getCollections('', '', 1, 20)
      .then((e) => {
        if (e.code === 0 && e.data !== null) {
          setCollectionList(e.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  const truncateArray = (members) => {
    let slicedItems = members.slice(0, 3);
    return { slicedItems, restSize: members.length - slicedItems.length };
  };

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
  return (
    <div className='text-txtblack dark:text-white'>
      <InviteModal
        show={ShowInviteModal}
        handleClose={() => setShowInviteModal(false)}
        collectionName={inviteData?.collection_name}
        isAuthenticated={userinfo?.id}
        nftId={inviteData?.lnft_id}
        collectionId={inviteData?.collection_id}
      />
      <section className='text-center my-4'>
        <HomeNavigateCard />
      </section>

      {/* Start New UI MVP-1.1 */}

      <h2 className='mb-5'>DAO List</h2>

      <section className='flex mb-6'>
        <form className='mr-4 flex-1'>
          <div className='relative'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none'>
              <i className='fa-regular fa-magnifying-glass text-primary-900 text-lg'></i>
            </div>
            <input
              type="text"
              id="default-search"
              className="text-lg shadow-main w-full rounded-lg  pl-12 placeholder-color-ass-4 py-4 pr-4 h-[72px] text-[#000]"
              placeholder="Search DAO by name"
              onChange={searchProject}
              value={searchKeyword}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  searchProject(event);
                }
              }}
            />
          </div>
        </form>

        <div className='dropdown relative'>
          <button
            className='bg-white dropdown-toggle p-4 text-textSubtle font-black font-satoshi-bold rounded-lg shadow-main flex items-center justify-between w-44 h-[72px]'
            type='button'
            id='dropdownMenuButton1'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            Sort Of
            <i className='fa-solid fa-angle-down'></i>
          </button>

          <ul
            className='dropdown-menu w-full absolute hidden bg-white text-base z-50 py-2 list-none rounded-lg shadow-main  mt-1 '
            aria-labelledby='dropdownMenuButton1'
          >
            <li onClick={() => handleSortType('newer')}>
              <a
                className={`dropdown-item py-2 px-4 block whitespace-nowrap ${
                  sortType === 'newer' ? 'text-primary-900' : 'text-txtblack'
                } hover:bg-slate-50 transition duration-150 ease-in-out`}
              >
                Newer
              </a>
            </li>
            <li onClick={() => handleSortType('older')}>
              <a
                className={`dropdown-item py-2 px-4 block whitespace-nowrap ${
                  sortType === 'older' ? 'text-primary-900' : 'text-txtblack'
                } hover:bg-slate-50 transition duration-150 ease-in-out`}
              >
                older
              </a>
            </li>
            <li onClick={() => handleSortType('view')}>
              <a
                className={`dropdown-item py-2 px-4 block whitespace-nowrap ${
                  sortType === 'view' ? 'text-primary-900' : 'text-txtblack'
                } hover:bg-slate-50 transition duration-150 ease-in-out`}
              >
                view
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="grid md:grid-cols-2 xl:grid-cols-3 xl:gap-1">
        {projectList.map((item, index) => (
          <div key={item.id}>
            <DAOCard item={item} key={item.id} />
          </div>
        ))}
      </section>
      {/* ----- End Card Section ---- */}

      {/* <section className="mb-5">
        <div className="flex justify-center space-x-1">
          <a className="px-3 py-1 text-sm  text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7">
            <i className="fa-solid fa-angle-left"></i>
          </a>

          <a
            href="#"
            className="px-3 py-1 font-satoshi-bold text-sm text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
          >
            1
          </a>
          <a
            href="#"
            className="px-3 py-1 font-satoshi-bold text-sm text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
          >
            2
          </a>
          <a
            href="#"
            className="px-3 py-1 font-satoshi-bold text-sm text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
          >
            3
          </a>
          <a
            href="#"
            className="px-3 py-1 font-satoshi-bold text-sm text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7"
          >
            4
          </a>

          <a className="px-3 py-1 text-sm  text-primary-900 bg-primary-900 bg-opacity-5 rounded hover:bg-opacity-7">
            <i className="fa-solid fa-angle-right"></i>
          </a>
        </div>
      </section> */}
      {/* End pagination */}

      <h2 className='mb-5'>Best Collection</h2>
      <section className='grid md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6'>
        {/* Card */}
        {collectionList &&
          collectionList.length > 0 &&
          collectionList.map((collection, index) => (
            <div
              className='min-h-[390px] rounded-x'
              key={`best-collection-${index}`}
            >
              <Link
                to={
                  collection.type === 'right_attach'
                    ? `/royality-management/${collection.id}`
                    : `/collection-details/${collection.id}`
                }
              >
                <img
                  className='rounded-xl h-[276px] object-cover w-full'
                  src={
                    collection && collection.assets && collection.assets[0]
                      ? collection.assets[0].path
                      : thumbIcon
                  }
                  alt=''
                />
              </Link>

              <div className='p-5'>
                <h2 className='pb-2 text-txtblack truncate'>
                  {collection.name}
                </h2>
                <p className='mb-3 text-textSubtle text-[13px]'>
                  {collection.description && collection.description.length > 70
                    ? collection.description.substring(0, 67) + '...'
                    : collection.description}
                </p>

                <div className='flex items-center'>
                  {collection.members &&
                    collection.members.length > 0 &&
                    truncateArray(collection.members).slicedItems.map(
                      (member) => (
                        <img
                          src={member.avatar}
                          alt={member.id}
                          className='rounded-full w-9 h-9 -ml-2 border-2 border-white'
                        />
                      )
                    )}
                  {collection.members && collection.members.length > 3 && (
                    <div className='flex items-center mt-[6px] justify-center rounded-1 ml-[10px] bg-[#9A5AFF] bg-opacity-[0.1] w-[26px] h-[26px]'>
                      <p className='text-[12px] text-[#9A5AFF]'>
                        +{truncateArray(collection.members).restSize}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </section>
      {/* ----- End Card Section ---- */}

      {/* END New UI MVP-1.1 */}

      {/* <div className="relative">
        <h2 className="mb-5">Newest Project</h2>
        {isLoading && <div className="onlySpinner mt-[150px]"></div>}
        {!isLoading && (
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 15,
              },
              1536: {
                slidesPerView: 5,
                spaceBetween: 15,
              },
            }}
            className="swipe-card"
            navigation={true}
            modules={[Navigation]}
          >
            <div>
              {projectList.map((i, index) => (
                <SwiperSlide key={index}>
                  <CommonCard key={index} project={i} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        )}
      </div> */}

      {/* {!isLoading && (
        <section className="mt-16 pb-16 relative">
          <h2 className="mb-5">Popular Project</h2>
          <Swiper
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 15,
              },
              1536: {
                slidesPerView: 5,
                spaceBetween: 15,
              },
            }}
            className="swipe-card"
            navigation={true}
            modules={[Navigation]}
          >
            <div>
              {popularProjectList.map((i, index) => (
                <SwiperSlide key={index}>
                  <CommonCard key={index} project={i} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </section>
      )} */}
    </div>
  );
}

export default Home;
