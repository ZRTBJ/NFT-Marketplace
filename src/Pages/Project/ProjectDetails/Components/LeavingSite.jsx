import publishModalSvg from "assets/images/modal/publishModalSvg.svg";
import { ethers } from "ethers";
import Modal from "components/Commons/Modal";

const LeavingSite = ({ handleClose, show, treasuryAddress }) => {
  async function goToSafe() {
    const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const userNetwork = await userProvider.getNetwork();
    //TODO This part you must get network from DAO itself, not user

    let network = "";
    if (userNetwork.chainId === 1) {
      network = "matic";
    } else if (userNetwork.chainId === 5) {
      network = "gor";
    } else {
      alert("Please Choose Goerli or Ethereum network from you wallet ");
    }
    if (network !== "" && treasuryAddress !== "") {
      window.open(
        `https://gnosis-safe.io/app/${network}:${treasuryAddress}/home`,
        "_blank"
      );
      handleClose(false);
    }
  }
  return (
    <Modal
      height={480}
      width={800}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="text-center">
        <img className="block mx-auto" src={publishModalSvg} alt="" />
        <p className="my-4 text-xl font-bold txtblack">
          You will be leaving the platform
        </p>
        <p className="my-4 break-normal text-textSubtle md:mx-auto md:max-w-[500px]">
          In order to transfer funds, you need to do it manually for now with
          gnosis safe. you will be leaving our platform to do it.
        </p>
        <div className="flex justify-center mb-4 ">
          <button
            type="button"
            className="contained-button btn-sm"
            onClick={goToSafe}
          >
            <span>Go to Gnosis Safe</span>
          </button>

          <button
            type="button"
            className="btn bg-primary-50 text-primary-900 btn-sm ml-4"
            onClick={(e) => {
              handleClose(false);
            }}
          >
            <span>Back</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeavingSite;
