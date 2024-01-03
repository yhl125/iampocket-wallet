# iampocket, The seedless account abstraction Wallet

> **Warning**
> Lit protocol is in a developer preview state.
> Do not store anything of value

## Demo Video

https://github.com/yhl125/iampocket-wallet/assets/69383768/484a72fa-5d64-4254-9f3b-5967891335df

## Live Demo

You can checkout the live demo from link down below<br>
https://demo-app.iampocket.com

## About

iampocket is a seedless wallet built using Lit protocol PKP (Programmable Key Pairs), for everyone's needs. Users have multiple login options available, including Google, Discord, Email, SMS, and Webauthn (Face ID, Touch ID).

With ZeroDev wallet, you can seamlessly operate across various blockchain networks such as Arbitrum One, Optimism, Ethereum Goerli, Polygon Mumbai, Arbitrum Goerli, and Optimism Goerli.And Biconomy wallet offers compatibility with Linea Goerli and Polygon zkEVM Testnet. And you can use ERC-20 Paymaster with transfer using stackup's testnet gas token.

Using ZeroDev wallet, 4337 contract is automatically deployed once you initiate a transaction. This contract facilitates connectivity and enables the use of DApps that support ERC-1271 via WalletConnect.

Please note that your ERC20 token balances are periodically updated at 30-second intervals through Covalent, so slight delays may occur.

## Key Features

### Seedless Wallet

iampocket uses Lit protocol's [PKP](https://developer.litprotocol.com/v2/pkp/intro) to make sure no seed phrase is needed for wallet creation.<br>
Currently iampocket is using lit relayer to use PKP supporting WebAuthn, Discord and Google.

### ERC-4337

iampoocket creates ERC-4337 Wallet using [ZeroDev](https://docs.zerodev.app/)<br>
[Paying gas with ERC20](https://docs.zerodev.app/use-wallets/pay-gas-with-erc20-tokens)(aka. PayMaster), [Batch Transaction](https://docs.zerodev.app/use-wallets/batch-transactions) can be used.

### Automated Transasction

With [Lit Actions](https://developer.litprotocol.com/v2/LitActions/intro) and [Lit Listener SDK](https://github.com/yhl125/lit-listener-sdk/) iampocket can automate transactions.

## 🏁 Running on browser

1. Install the dependencies

```bash
yarn
```

2. Set up ENV vars

create .env file on root directory.<br>
Go to [ZeroDev Dashboard](https://dashboard.zerodev.app/) and create project for certain network.<br>
Currently iampocket supports 5 EVM Testnet and 2 EVM Mainnet.<br>
You can add or remove env vars of your choice.<br>
For better example checkout .env.example on root directory

3. Run App

Run the following command at the root path of the project

```bash
yarn dev
```




