// Arweave Documentation
const AOModule = "Do_Uc2Sju_ffp6Ev0AnLVdPtot15rvMjP-a9VVaA5fM"; // aos 2.0.1
const AOScheduler = "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA";
const pId = "oBND0IgrBTgHGUk4UdL1-1yBUn0WA4NYdA2RUCeVVUY"
const CommonTags = [
  { name: "Name", value: "AO-Chat" },
  { name: "Version", value: "0.2.1" },
];

import { spawn, message, createDataItemSigner } from "@permaweb/aoconnect"

// connect wallet
export async function connectWallet() {
  try {
    if (!window.arweaveWallet) {
      alert('No Arconnect detected');
      return;
    }
    await window.arweaveWallet.connect(
      ['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ACCESS_TOKENS'],
      {
        name: 'AO-Chat',
        logo: 'https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk',
      },
      {
        host: 'g8way.io',
        port: 443,
        protocol: 'https',
      }
    );


  } catch (error) {
    console.error(error);
    throw error; // Re-throw to allow the caller to handle it.
  }
};

// disconnect wallet
export async function disconnectWallet() {
  try {
    await window.arweaveWallet.disconnect();
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    throw error;
  }
};

// get wallet details
export async function getWalletAddress() {
  try {
    const walletAddress = await window.arweaveWallet.getActiveAddress();
    console.log(walletAddress)
    return walletAddress;
  } catch (error) {
    console.error("Error getting wallet address:", error);
    return null; // Or handle appropriately for your use case
  }
};


// spawn process [ don't change anything in the function use it as it is *important]

export const spawnProcess = async (name, tags = []) => {
  try {
    const allTags = [...CommonTags, ...tags];
    if (name) {
      allTags.push({ name: "Name", value: name });
    }

    console.log(allTags)

    const walletAddress = await getWalletAddress();
    if (!walletAddress) {
      throw new Error("Wallet not connected.");
    }

    const processId = await spawn({
      module: AOModule,
      scheduler: AOScheduler,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: allTags
    });
    console.log(processId)

    return processId;
  } catch (error) {
    console.error("Error spawning process:", error);
    throw error;
  }
};

// send message to process
export const messageAR = async ({ tags = [], data, anchor = '', process }) => {
  try {
    if (!process) throw new Error("Process ID is required.");
    if (!data) throw new Error("Data is required.");

    const allTags = [...CommonTags, ...tags];
    const messageId = await message({
      data,
      anchor,
      process,
      tags: allTags,
      signer: createDataItemSigner(globalThis.arweaveWallet)
    });
    return messageId;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
