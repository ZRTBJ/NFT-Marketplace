import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import WalletConnectModal from "components/modalDialog/WalletConnectModal";
import { useHistory } from "react-router-dom";
const HomeNavigateCard = () => {
  const history = useHistory();
  const userinfo = useSelector((state) => state.user.userinfo);
  const [showModal, setShowModal] = useState(false);
  const [navigateToPage, setNavigateToPage] = useState("");
  async function navigate(type) {
    setNavigateToPage(type);
    if (!userinfo.id) {
      setShowModal(true);
    } else {
      history.push(`/${type}`);
    }
  }
  function hideModal() {
    setShowModal(false);
  }
  useEffect(() => {
    return () => {
      setShowModal(false);
    }; // cleanup toggles value, if unmounted
  }, []);
  return (
    <div>
      <div className="max-w-[533px] w-full mx-auto px-5 ">
        <h1 className="leading-[40px]">
          Lorem Ipsum is simply dolor amet text
        </h1>
      </div>
      <div className="max-w-[505px] w-full mx-auto mt-[17px] px-5">
        <p className="leading-[24px] text-[16px] ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="mt-[17px] md:flex justify-center">
        <button
          className="btn-primary px-4 w-[199px] mb-4 mr-4 h-[38px]"
          onClick={() => navigate("project-create")}
        >
          Create New Project
        </button>
        <button
          className="btn-outline-primary px-4 h-[38px] w-[120px]"
          onClick={() => navigate("mint")}
        >
          Mint NFT
        </button>
      </div>
      <WalletConnectModal
        showModal={showModal}
        closeModal={hideModal}
        navigateToPage={navigateToPage}
      />
    </div>
  );
};

export default HomeNavigateCard;
