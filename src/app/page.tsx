"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { BigNumber, ethers } from "ethers";
import config from "../../config.json";
import { getSimpleAccount } from "./api/src/getSimpleAccount";
import { useState } from "react";
import { formatEther } from "ethers/lib/utils";
import { useSnapshot } from "valtio";
import SettingsStore from "@/store/SettingsStore";

export default function Home() {
  // const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>();
  const { erc4337Address } = useSnapshot(SettingsStore.state);

  const createAddress = async () => {
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const accountAPI = getSimpleAccount(
      provider,
      config.signingKey,
      config.entryPoint,
      config.simpleAccountFactory
    );
    const address = await accountAPI.getCounterFactualAddress();
    SettingsStore.setERC4337Address(address);
    console.log(`SimpleAccount address: ${address}`);
  };

  const getAddressBalance = async () => {
    const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    const bigNumberBalance = await provider.getBalance(erc4337Address);
    console.log(bigNumberBalance);
    const balance = formatEther(bigNumberBalance);
    setBalance(balance);
  };
  return (
    <>
      <div className="wallet">
        <div>
          <text>Your Address is {erc4337Address}</text>
        </div>
        <div>
          <text>Your balance is {balance}</text>
        </div>
        <div>
          <button onClick={() => createAddress()}>
            <text>Create Goerli Address</text>
          </button>
        </div>
        <div>
          <button onClick={() => getAddressBalance()}>
            <text>Get Goerli Balance</text>
          </button>
        </div>
      </div>
    </>
  );
}
