import React, { useEffect, useState } from "react";
import './styles/App.css';
import MakeNFT from './utils/MakeNFT.json';
import { ethers } from "ethers"

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const renderNotConnectedContainer = () => (
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>
  );
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xAa430D419513E4D2B6052aA145B45a4283728bCb";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MakeNFT.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
  */
  return (
      <div className="App">
        <div className="container">
          <div className="header-container">
            <p className="header gradient-text">SmartDevsNFT</p>
            <p className="sub-text">
              Get your own Dev now!
            </p>
            <p className="sub-text">
              Open console to see minting proccess (f12)
            </p>
            {currentAccount === "" ? (
                renderNotConnectedContainer()
            ) : (
                <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                  Mint NFT
                </button>
            )}
          </div>
          <div className="footer-container">
            <p className="sub-text">
                Dont use ETH Mainnet! Check if you are on Rinkeby net!
            </p>
            <p className="sub-text">
                Szymon Mytych
            </p>
          </div>
        </div>
      </div>
  );
};

export default App;