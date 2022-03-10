import { useState, useEffect } from "react";
import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";
const TorusWallet = () => {
  const [account, setAccount] = useState("");
  const [torus] = useState(
    new Torus({
      buttonPosition: "top-right",
    })
  );

  const onClickLogin = async (e) => {
    e.preventDefault();
    await torus.login();
    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    const userinfo =  await torus.getUserInfo();
    console.log(userinfo);
    setAccount({  address, balance ,...userinfo});
    console.log(account);
  };
  const onClickCleanUp = async () => {
    // await torus.cleanUp();
    await torus.logout();
    setAccount('');
  };
  
  const onClickShowWallet = async () => {
    // await torus.cleanUp();
    torus.showWallet("");
    
  };

  const onMount = async () => {
    await torus.init({
      enableLogging: false,
      //   network:'',
      //   buildEnv:'production',
      showTorusButton: true,
    });
    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    
    if (address !== undefined) {
      const balance = await web3.eth.getBalance(address);
      const userinfo =  await torus.getUserInfo();
    setAccount({  address, balance ,...userinfo});
    console.log(account);
    }
  };
  useEffect(() => {
    onMount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h1>Torus Wallet</h1>
      {account !== "" ? (
        <div>
            <img src={account.profileImage} alt="" height="100px" width="100px" />
            <h3>HI {account.name}</h3>
          <ul>
          <li>Email: {account.email}</li>

            <li>Address : {account.address}</li>
            <li>Balance : {account.balance}</li>
            <li>Verifier : {account.verifier}</li>
            <li>VerifierId : {account.verifierId}</li>
            
          </ul>
          <button onClick={onClickShowWallet}>Show Wallet</button>
          <button onClick={onClickCleanUp}>Log Out</button>
        </div>
      ) : (
        <button onClick={onClickLogin}>Login</button>
      )}
    </div>
  );
};
export default TorusWallet;