import publishModalSvg from "assets/images/modal/publishModalSvg.svg";
import Modal from "components/Commons/Modal";
import { NETWORKS } from "config/networks";

const LeavingSite = ({ handleClose, show, treasuryAddress, network }) => {
  async function goToSafe() {
    if (network !== "" && treasuryAddress !== "") {
      window.open(
        `${NETWORKS[network].gnosis}:${treasuryAddress}/home`,
        "_blank"
      );
      handleClose(false);
    }
  }
  return (
    <Modal width={400} show={show} handleClose={() => handleClose(false)}>
      <div className="text-center">
        <img className="block mx-auto" src={publishModalSvg} alt="" />
        <p className="my-4 text-[18px] font-bold txtblack">
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
