import { useState } from "react";
import ProfileImage from "assets/images/createDAO/user.svg";
import CoverImage from "assets/images/createDAO/cover.svg";
import CirclePlus from "assets/images/createDAO/circle-plus.svg";
import DAOCard from "components/DAOCard";
import NFTCard from "components/NFTCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import styles from "./style.module.css";
import CreateNFTModal from "../../components/modalDialog/CreateNFTModal";
import { Link } from "react-router-dom";
import { getUserProjectListById } from "services/project/projectService";
import { useEffect } from "react";
import { getCollections } from "services/collection/collectionService";

const CreateDAOandNFT = () => {
  const [ShowCreateNFT, setShowCreateNFT] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const [DAOs, setDAOs] = useState([]);
  const [Collections, setCollections] = useState([]);
  const settings = {
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
  };

  useEffect(() => {
    let userId = localStorage.getItem("user_id");
    console.log(userId);
    let payload = {
      id: userId,
    };
    setIsLoading(true);
    getUserProjectListById(payload)
      .then((resp) => {
        setIsLoading(false);
        if (resp.code === 0) {
          setDAOs(resp.data);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
    getCollections("user")
      .then((resp) => {
        if (resp.code === 0) {
          setCollections(resp.data);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  console.log(Collections);
  return (
    <div className={`bg-white mt-4 py-6 pl-6 ${IsLoading ? "loading" : ""}`}>
      <CreateNFTModal
        show={ShowCreateNFT}
        handleClose={() => setShowCreateNFT(false)}
      />
      <div className="border-[#C7CEE5] border-b-[1px] pb-3">
        <h3 className="text-[28px] font-black mb-2">Create new DAO</h3>
        <p className="text-[14px] text-[#5F6479] font-normal w-[450px]">
          Create new DAO for making your project is really managed and secure in
          web3 environment.
        </p>
        <div className="flex mt-6">
          <Link to="/project-create">
            <div className="gradient-border cursor-pointer w-[276px] h-[276px] mr-6 flex flex-col items-center justify-center rounded-[12px]">
              <img src={CirclePlus} alt="add" />
              <p className="text-[#D66EFB] gradient-text font-black mt-3">
                Create new
              </p>
            </div>
          </Link>
          <Swiper
            breakpoints={settings}
            navigation={true}
            modules={[Navigation]}
            className={styles.createSwiper}
          >
            <div>
              {DAOs.map((item) => (
                <SwiperSlide key={item.id} className={styles.daoCard}>
                  <DAOCard item={item} key={item.id} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-[28px] font-black mb-2">Create new NFT</h3>
        <p className="text-[14px] text-[#5F6479] font-normal w-[450px]">
          Start creating your NFT with many of choice, you can create 3 type of
          NFT such like Membership,Pre-Product and Product.
        </p>
        <div className="flex mt-6">
          <div
            className="gradient-border cursor-pointer min-w-[276px] h-[276px] mr-6 flex flex-col items-center justify-center rounded-[12px]"
            onClick={() => setShowCreateNFT(true)}
          >
            <img src={CirclePlus} alt="add" />
            <p className="text-[18px] gradient-text font-black mt-3">
              Create new
            </p>
          </div>
          <Swiper
            breakpoints={settings}
            navigation={true}
            modules={[Navigation]}
            className={styles.createSwiper}
          >
            <div>
              {Collections.map((item) => (
                <SwiperSlide key={item.id} className={styles.nftCard}>
                  <NFTCard item={item} key={item.id} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default CreateDAOandNFT;
