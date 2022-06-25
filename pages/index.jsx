import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import styles from '../styles/Home.module.css'
import abi from "../utils/Coffee.json";
import { ethers } from 'ethers';

export default function Home() {
  // Contract address and ABI
  const contractAddress = "0x538d713e477C0A18469F0e0Dd13304dDE1979522";
  const contractABI = abi.abi

  // Component State
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState("");

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("Wallet is connected! 🎉" + account);
      } else {
        alert("Make sure MetaMask is connected 🦊");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        alert("Please install MetaMask 🦊");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }
  
  const buyCoffee = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..")
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          {value: ethers.utils.parseEther("0.001")}
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
      
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const {ethereum} = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Rafael</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/rafa.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hello!  👋🏻  I am <a href="https://twitter.com/Rafael41603219">rafaelfuentes.eth! 👨🏻‍💻</a>
        </h1>

        <p className={styles.description}>
          I am blockchain and web3 developer, consultant and researcher 🌎
        </p>

        <div className={styles.grid}>
          <a href="https://github.com/RafaBlockDev" className={styles.card}>
            <h2>Github &rarr;</h2>
            <p>Look my github and find interesting projects in blockchain and web3! 🚀</p>
          </a>

          <a href="https://twitter.com/Rafael41603219" className={styles.card}>
            <h2>Twitter &rarr;</h2>
            <p>Find me on Twitter where I share and tweet very good content! 👻</p>
          </a>

          <a
            href="https://www.linkedin.com/in/rafael-f-b4809120a/"
            className={styles.card}
          >
            <h2>LinkedIn &rarr;</h2>
            <p>Found my experiences, my skills, posts and my professional profile! 😎</p>
          </a>

          <a
          href=""
            className={styles.card}
          >
            <h2>Articles &rarr;</h2>
            <p>
              Look my articles, and researcher done for me, about blockchain! 📚
            </p>
          </a>

          <a
          href=""
            className={styles.card}>
            <h2>Portafolio &rarr;</h2>
            <p>
              This is my portafolio where you will find my own projects... 🦾
            </p>
          </a>
        </div>

        {currentAccount ? (
        <div className={styles.buyCoffe}>
          <h2 className={styles.secondTitle}>Buy me a coffee ☕️</h2>

          <div className={styles.divBoxes}>
            <form className={styles.formContent}>
              <div className={styles.formgroup}>
                <label className={styles.labelText}>
                    What´s your name? 🧐
                </label>
                <br/>
                <div className={styles.formDivInput}>
                  <input
                    id="name"
                    type="text"
                    placeholer="anon"
                    onChange={onNameChange}
                  />
                </div>
              </div>
              <br/>

              <div className={styles.formgroup}>
                  <label className={styles.labelText}>
                    Send a message to Rafa 💌
                  </label>
                <br/>
                <div className={styles.formTextDiv}>
                  <textarea
                    className={styles.inputCon}
                    rows={3}
                    placeholder="Enjoy your gift! "
                    id="message"
                    onChange={onMessageChange}
                    required
                  >
                  </textarea>
                </div>  
              </div>
              <div className={styles.divButton}>
                <button
                  type=""
                  className={styles.button}
                  onClick={buyCoffee}
                >
                  Send ☕️
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <button className={styles.connectButton} onClick={connectWallet}>Connect 🦊</button>
      )}
      </main>

      {currentAccount && (<h1 className={styles.memoRec}>🎉 Memos received 🎉</h1>)}

      {currentAccount && (memos.map((memo, idx) => {
        return (
          <div key={idx} className={styles.memoShowMessage}>
            <p className={styles.messageMemos}>✏️ {memo.message}</p>
            <p>📬 From: {memo.name} at {memo.timestamp.toString()}</p>
          </div>
        )
      }))}

      <footer className={styles.footer}>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Cypherpunk and anarchist
          <span className={styles.logo}>
            <Image src="/rafa.png" alt="Rafa Face" width={20} height={20} />
          </span>
        </a>
      </footer>
    </div>
  )
}