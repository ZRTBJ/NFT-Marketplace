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
    <>
      <article className="max-w-lg mx-auto">
        <h1>Simply finf the project and start contributing</h1>
        <p className="text-sm mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="flex justify-center mt-5">
          <button
            className="btn btn-primary btn-sm mr-5"
            onClick={() => navigate("project-create")}
          >
            Create <span className="hidden md:inline">New</span> Project
          </button>
          <button
            className="btn-outline-primary-gradient btn-sm"
            onClick={() => navigate("mint-nft")}
          >
            <span>Mint NFT</span>
          </button>
        </div>
      </article>
      <WalletConnectModal
        showModal={showModal}
        closeModal={hideModal}
        navigateToPage={navigateToPage}
      />
    </>
  );
};

export default HomeNavigateCard;
