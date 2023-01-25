import { useEffect, useState } from "react";
import IconError from "assets/images/modal/error/error_modal_img.svg";
import Link from "next/link";
import Modal from "../Commons/Modal";
import Image from "next/image";
import { useEffect, useState } from 'react';
import IconError from 'assets/images/modal/error/error_modal_img.svg';
import Link from 'next/link';
import Modal from '../Commons/Modal';
import Image from 'next/image';
import {
  getPersonalSign,
  isWalletConnected,
  getWalletAccount,
  getCurrentNetworkId,
} from "util/MetaMask";
import { NETWORKS } from "config/networks";
import axios from "axios";
import Config from "config/config";

const MoonpayModal = ({ handleClose, show }) => {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [src, setSrc] = useState("");

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    const address = await getWalletAccount();
    const network = await getCurrentNetworkId();
    setAccount(address);
    setNetwork(network);
  };

  useEffect(() => {
    if (account && network) {
      createSrcUrl();
    }
  }, [account, network]);

  const createSrcUrl = async () => {
    let src = `${Config.MOONPAY_URL}?baseCurrencyCode=USD&apiKey=${
      Config.MOONPAY_KEY
    }&currencyCode=${
      network && NETWORKS[network].value
    }&walletAddress=${account}`;
    console.log("Res SRC", src);

    let formdata = new FormData();
    formdata.append("url", src);

    const res = await axios({
      method: "POST",
      url: `${Config.API_ENDPOINT}/payment/moonpay-hash`,
      data: formdata,
    });
    console.log("Res: ", res);

    src = `${src}&signature=${res.hash}`;
    setSrc(src);
  };

  console.log("SRC: ", src);
  return (
    <Modal
      width={400}
      height={620}
      show={show}
      handleClose={() => handleClose(false)}
    >
      <div className="text-center" style={{ marginTop: 30 }}>
        <iframe
          allow="accelerometer; autoplay; camera; gyroscope; payment"
          frameborder="0"
          height="550px"
          src={src}
          width="100%"
        >
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    </Modal>
  );
};

export default MoonpayModal;
