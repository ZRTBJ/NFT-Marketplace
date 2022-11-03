import { useEffect, useState } from "react";
import WalletConnectModal from "Pages/User/Login/WalletConnectModal";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getNftDetails,
  mintProductOrMembershipNft,
} from "services/nft/nftService";
import { createMintNFT } from "Pages/NFT/DetailsNFT/MintNFT/deploy-mintnft";
import { createProvider } from "util/smartcontract/provider";
import { createMintInstance } from "config/ABI/mint-nft";
import { createMembsrshipMintInstance } from "config/ABI/mint-membershipNFT";
import { createMembershipMintNFT } from "Pages/NFT/DetailsNFT/MintNFT/deploy-membershipNFTMint";
import { handleSwitchNetwork, getCurrentNetworkId } from "util/MetaMask";
import { NETWORKS } from "config/networks";

function EmbedNFT(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nft, setNft] = useState({});
  const { type, id } = useParams();
  const userinfo = useSelector((state) => state.user.userinfo);
  const provider = createProvider();
  useEffect(() => {
    if (id) {
      nftDetails(type, id);
    }
  }, [id, type]);

  function nftDetails() {
    getNftDetails(type, id)
      .then((e) => {
        setNft(e);
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
      const membershipMintContract = createMembsrshipMintInstance(
        config.contract,
        provider
      );
      const response =
        type === "membership"
          ? await createMembershipMintNFT(
            membershipMintContract,
            config.metadataUrl,
            id,
            provider
          )
          : await createMintNFT(
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

  const getCurrentNftNetwork = () => {
    let currency = nft?.more_info?.currency;
    let networks = Object.values(NETWORKS);
    let currentNetwork = networks.find((value) => value.value === currency);
    return currentNetwork.network;
  };

  async function handleProceedPayment(response) {
    if (!nft.more_info.currency) {
      setErrorMessage("This NFT is not for sale yet");
      return;
    }
    let nftNetwork = await getCurrentNftNetwork();
    let networkId = await getCurrentNetworkId();
    setIsMinting(true);
    if (nftNetwork === networkId) {
      setErrorMessage("");
      let formData = new FormData();

      formData.append("transaction_hash", response.hash);
      formData.append("block_number", response.blockNumber);
      const payload = {
        id: nft?.lnft?.id,
        data: formData,
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
                setSuccess(true);

                setTimeout(() => {
                  setSuccess(false);
                }, 5000);
              } else if (resp?.function?.status === "failed") {
                let message = resp?.function?.message;
                setErrorMessage(message);
                setIsMinting(false);
              }
            } else {
              handleContract(resp.config);
            }
          } else {
            let message = resp?.function?.message || resp.message;
            setErrorMessage(message);
            setIsMinting(false);
          }
        })
        .catch((err) => {
          setErrorMessage("Minting Failed. Please try again later");
        });
    } else {
      try {
        await handleSwitchNetwork(nftNetwork);
      } catch (err) {
        setErrorMessage(
          `Please add ${NETWORKS?.[nftNetwork]?.networkName} network to your metamask wallet and then try again`
        );
      }
    }
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
            {nft?.lnft?.asset?.path && (
              <img
                src={nft.lnft.asset.path}
                alt="NFT"
                className="w-[254px] h-[254px] object-contain"
              />
            )}
            <div className="text-left mt-4">
              <p className="text-textSubtle text-[12px]">Name</p>
              <h2 className="text-black">{nft?.lnft?.name}</h2>
            </div>
            <div className="flex items-center justify-center w-100 mt-3 bg-[#122478] rounded-[12px] p-4 bg-opacity-[0.1]">
              <div className="w-2/2 pl-3">
                <p className="text-textSubtle text-[12px] text-center">Price</p>
                <h2 className="text-black">
                  {nft?.more_info?.price}{" "}
                  {nft?.more_info?.currency?.toUpperCase()}
                </h2>
              </div>
            </div>
            <p className="text-danger-900 text-sm text-center">
              {errorMessage}
            </p>
            {success && (
              <p className="text-success-900 text-sm text-center">
                Successfully Minted!
              </p>
            )}
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
