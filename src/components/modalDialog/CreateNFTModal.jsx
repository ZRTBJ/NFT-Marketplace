import Modal from "../Modal";
import Users from "assets/images/createDAO/users.svg";
import HandShake from "assets/images/createDAO/handshake.svg";
import Product from "assets/images/createDAO/product.svg";
import Tooltip from "components/Tooltip";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import CreateRightAttachedNFT from "components/modalDialog/CreateRightAttachNFT";

const CreateNFTModal = ({ handleClose, show }) => {
  const history = useHistory();
  const [ShowCreateRANFT, setShowCreateRANFT] = useState(false);
  return (
    <Modal show={show} handleClose={handleClose} width={680}>
      {ShowCreateRANFT && (
        <CreateRightAttachedNFT
          show={ShowCreateRANFT}
          handleClose={() => setShowCreateRANFT(false)}
        />
      )}
      <div className="md:px-10">
        <h3 className="text-[28px] text-black font-black mb-8">
          Create new NFT
        </h3>
        <div className="cursor-pointer flex bg-[#F9FCFF] border-[1px] border-[#C7CEE5] rounded-[12px] p-6 mb-6">
          <div className="md:mr-6 mr-3 h-[74px] w-[74px] md:bg-secondary-50  hidden md:flex items-center justify-center rounded-[8px]">
            <img src={Users} className="" alt="Users" />
          </div>
          <div onClick={() => history.push("/membershipNFT")}>
            <h3 className=" text-[18px] md:text-[24px] font-bold text-[#303548]">
              Membership NFT
            </h3>
            <p className="text-[14px] text-[#5F6479]  md:w-[470px] mt-2 ">
              Get fundraiser by creating NFT Membership and make your own
              Decentralize Community
            </p>
          </div>
        </div>
        <div className="cursor-pointer flex bg-[#F9FCFF] border-[1px] border-[#C7CEE5] rounded-[12px] p-6 mb-6">
          <div className="md:mr-6 mr-3 h-[74px] w-[74px] md:bg-primary-50 hidden md:flex items-center justify-center rounded-[8px]">
            <img src={Product} alt="Product" />
          </div>
          <div onClick={() => history.push("/product-nft")}>
            <h3 className="text-[18px] md:text-[24px] font-bold text-[#303548]">
              Product NFT
            </h3>
            <p className="text-[14px] text-[#5F647 md:w-[470px] mt-2">
              Start Creating your NFT and earn as a Creator
            </p>
          </div>
        </div>
        <div
          className="cursor-pointer flex bg-[#F9FCFF] border-[1px] border-[#C7CEE5] rounded-[12px] p-6 mb-6"
          onClick={() => setShowCreateRANFT(true)}
        >
          <div className="md:mr-6 mr-3 h-[74px] w-[74px] md:bg-success-500 bg-opacity-[0.5] hidden md:flex items-center justify-center rounded-[8px]">
            <img src={HandShake} alt="HandShake" />
          </div>
          <div>
            <h3 className="text-[18px] md:text-[24px] font-bold text-[#303548]">
              Rights Attached NFT
            </h3>
            <p className="text-[14px] text-[#5F647 md:w-[470px] mt-2">
              Have a team? Don't worry! we’re gonna split the royalties so
              everyone get more clran Revenue!
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Tooltip message="Click to create a new collection" />
          <Link to="/collection-create">
            <button className="rounded-[12px] py-3 px-4 bg-[#E8F5FB] text-[#199BD8] text-[14px] font-black">
              Create Collection
            </button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default CreateNFTModal;
