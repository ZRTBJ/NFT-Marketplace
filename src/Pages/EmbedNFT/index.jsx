import { useEffect, useState } from "react";
import WalletConnectModal from "components/modalDialog/WalletConnectModal";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getNftDetails,
  mintProductOrMembershipNft,
} from "services/nft/nftService";
import { createMintNFT } from "eth/deploy-mintnft";
import { createProvider } from "eth/provider";
import { createMintInstance } from "eth/mint-nft";

function EmbedNFT(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nft, setNft] = useState({});
  const { type, id } = useParams();
  const userinfo = useSelector((state) => state.user.userinfo);
  const provider = createProvider();
  useEffect(() => {
    if (id) {
      nftDetails(id);
    }
  }, [id, type]);

  function nftDetails() {
    getNftDetails(type, id)
      .then((e) => {
        console.log(e);
        setNft(e.lnft);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  const hideModal = () => {
    setShowModal(false);
  };

  const handleModal = () => {
    setShowModal(true);
  };

  const handleContract = async (config) => {
    try {
      const mintContract = createMintInstance(config.contract, provider);
      const response = await createMintNFT(
        mintContract,
        config.metadataUrl,
        config.price,
        provider
      );
      if (response) {
        let data = {
          hash: response?.transactionHash,
          blockNumber: response?.blockNumber,
        };
        console.log(data);
        handleProceedPayment(data);
      }
    } catch (err) {
      if (err.message) {
        setErrorMessage(err.message);
        setIsMinting(false);
      } else {
        setErrorMessage("Minting failed. Please try again later");
        setIsMinting(false);
      }
    }
  };

  async function handleProceedPayment(response) {
    setIsMinting(true);
    const payload = {
      id: nft?.id,
      data: {
        transaction_hash: response.hash,
        token_id: "",
        block_number: response.blockNumber,
      },
      type: nft?.lnft?.nft_type,
    };

    await mintProductOrMembershipNft(payload)
      .then((resp) => {
        if (resp.code === 0) {
          if (response.hash) {
            setErrorMessage("");
            if (resp?.function?.status === "success") {
              setIsMinting(false);
              setErrorMessage("");
            } else if (resp?.function?.status === "failed") {
              let message = resp?.function?.message;
              setErrorMessage(message);
              setIsMinting(false);
            }
          } else {
            handleContract(resp.config);
          }
        } else {
          let message = resp?.function?.message;
          setErrorMessage(message);
          setIsMinting(false);
        }
      })
      .catch((err) => {
        setErrorMessage("Minting Failed. Please tru again later");
      });
  }

  return (
    <>
      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <>
          <div
            className={`overflow-y-auto h-[100vh] bg-white border-[1px] p-2 border-[1px] rounded-[12px] border-[#C7CEE6]`}
          >
            {nft?.asset?.path && (
              <img
                src={nft.asset.path}
                alt="NFT"
                className="w-[254px] h-[254px] object-contain"
              />
            )}
            <div className="text-left mt-4">
              <p className="text-textSubtle text-[12px]">Name</p>
              <h2 className="text-black">{nft?.name}</h2>
            </div>
            <div className="flex items-center w-100 mt-3 bg-[#122478] rounded-[12px] p-4 bg-opacity-[0.1]">
              <div className="w-1/2 pl-3">
                <p className="text-textSubtle text-[12px]">Price</p>
                <h2 className="text-black">{nft?.price}</h2>
              </div>
              <div className="w-1/2 pl-3">
                <p className="text-textSubtle text-[12px]">Price</p>
                <h2 className="text-black">{nft?.price}</h2>
              </div>
            </div>
            <p className="text-danger-900 text-sm text-center">
              {errorMessage}
            </p>
            <button
              disabled={isMinting}
              className="mt-3 text-primary-900 bg-primary-100 w-full text-[14px] font-black py-2 rounded-[4px]"
              onClick={userinfo.id ? handleProceedPayment : handleModal}
            >
              {isMinting
                ? "Minting NFT..."
                : userinfo.id
                ? "Buy Now"
                : "Connect Wallet"}
            </button>
          </div>
          <WalletConnectModal
            showModal={showModal}
            closeModal={hideModal}
            noRedirection={true}
          />
        </>
      )}
    </>
  );
}

export default EmbedNFT;
