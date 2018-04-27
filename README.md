# Abstract
```
Accepting payments in the form of Ether and ERC20 tokens is still a challenge due to the nature of how browsers were not designed with identity and payment mechanisms baked in. Generally, those selling a product wish to reach the broader global market, but are limited to credit card and Paypal payments that require permissioned systems and possibly paid APIs to work with. In addition, there are difficult problems to solve when deciding to handle customer payments, involving verifying who actually made a payment. Here is where MetaMask+EthJS+EthSigUtil come in. This suggested solution includes a 3 step technical workflow, and it is a surprisingly pleasant user experience: 1) register a public address with the site by digitally signing a challenge phrase with personal_sign. Signature of a hashed message is performed off-chain to prevent chosen cipher and replay attacks 2) server side personal_ecRecover is used to verify the digital signature was created by the address 3) allow acceptance of payment by giving the user easy access to seeing tokens and/or ether in a wallet on your site. Even if you do not want to manage customer sessions with this method, it is effective for solving the problem of accepting crypto payments and being able to verify a person that said they paid you, really did. A full demo is included and linked to at the bottom of this document to demonstrate the process. It uses Metamask + EthJS + EthSigUtil + TruffleBoxes + Angular components. At the backbone of all this, we use Elliptic Curve Cryptography.
```

# Introduction 
```
You want to accept Ether and ERC20 tokens as payment for your service, but you don’t have a way of performing KYC with a user, since this type of payment was fundamentally designed to be decentralized, which circumvents the entire banking infrastructure. This is by design, and avoids a centralized authority. In addition, you may not have the financial means to establish a business relationship with a bank, nor the legal right to establish API access with a payment processor. This proposes a solution to verifying payments from digital identities using signatures. You can then use this public address to associate payments with a customer on your site.
```

# Wallet example With Digital Signature Challenge Using Metamask
This project aims to demonstrate these key concepts:
```
Authentication / Verification
1) User Signs a Random Message to Prove his/her Identity
2) We Verify a Message Hash was Signed by a Particular User

Wallet Injection in the Browser
1) Connect to Web3 via MetaMask's injected WebProvider
2) Display Wallet Account
3a) Send StandardToken (ERC20 compliant) from Account to another Account address
or
3b) Approve StandardToken (ERC20 compliant) allowance from Account to another address.
```

## Overview
# [Angular App](src/app)
 `app.module.ts` establishes the Angular app
# [Utilities](src/app/util)
 `window-ref.ts` a utility for injecting the global native window as a service.
 `web3.service.ts` a uitility for injecting Web3.js as a service
 `util.module.ts` a service that acts as a provider for window & web3 utility services.
# [Core Functionality](src/app/meta)
  `meta-module.ts` imports our util module and prepares the MetaSenderComponent
  `meta-sender.component.ts` contains all the logic for signing a message, verifying a message, and sending StandardToken from a wallet.
# [ERC20 Artifacts](build/contracts) 
 `StandardToken.json` for the sake of simplicity, this OpenZeppelin code does the job well. for demo, reused addresses from `LOCIcoin.json`
 `LOCIcoin.json` for the sake of simplicity, reused from [LOCIcoin](https://github.com/locipro/loci-coin-sale) project.


## Building
```
npm install -g truffle
npm install -g @angular/cli
npm install -g ethereumjs-testrpc
npm install

# NOTE: you may have to run this to get everything to `ng serve` correctly
# IT TAKES A LONG TIME. ONLY DO SO IF NECESSARY.
npm rebuild node-sass --force
```

## Compiling - You wont have to do this unless you introduce your own contracts for demo
```
nohup testrpc & # start testrpc simulator
truffle compile && truffle migrate
```

### Running - The app will be served on localhost:4200
```
ng serve
```

### Trying it out in the Browser
Connect to it by opening it in your browser and configuring MetaMask with the 12-word phrase from TestRPC. Use on ROPSTEN!

# Conclusion
```
Again, to give credit where it is due, several man-hours of research was poured over to come to this solution and standard for accepting payments while being able to verify them. I did not have to invent any of the following myself: ECDSA, MetaMask, EthJS, EthSigUtil, Angular, OpenZeppelin, and the many other open source projects that were relied upon to get here. I am just putting it all together in a demo in a user-friendly and developer-friendly package in hopes of sparking a decentralized payment fire and getting this in the hands of many developers. Research Links Will be added Below.
```


