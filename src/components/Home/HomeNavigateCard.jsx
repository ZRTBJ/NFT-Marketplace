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
<<<<<<< HEAD
      <article className="mx-3 rounded-xl bg-opacity-20 border gradient-border md:h-60 flex items-center justify-center p-4 flex-col">
=======
      <article className=" rounded-xl bg-opacity-20 border gradient-border flex items-center justify-center p-4 flex-col shadow-main">
>>>>>>> 269ad0756a8a32da2b9999fca14e61ef6252423a
        <h1 className="gradient-text mb-3">Start Creating your Project</h1>
        <div className="mb-4 gradient-text text-center">
          <p>You can simply create DAO or NFT project</p>
          <p>by simply clicking button.</p>
        </div>
        <div
          onClick={() => navigate("create")}
          className="inline-block cursor-pointer contained-button px-4 py-3 text-white font-black text-sm  font-satoshi-bold rounded cursor-pointer"
        >
          Create Project
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
