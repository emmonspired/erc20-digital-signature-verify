import { Component, OnInit } from '@angular/core';

import { Web3Service } from "../../util/web3.service";

import { Buffer } from 'buffer';
import { default as ethUtil } from 'ethereumjs-util';
import { default as sigUtil } from 'eth-sig-util';
import { default as Eth } from 'ethjs';

@Component({
  selector: 'app-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.css']
})
export class MetaSenderComponent implements OnInit {
  constructor(private web3Service: Web3Service) {
    console.log("Constructor: " + web3Service);
  }

  accounts: string[];
  coinInstance: any;
  web3: any;

  model = {
    amount: 5,
    receiver: "",
    balance: 0,
    account: "",
    contractAddress: '0x',
    msgParams: {rawText:'These are the terms and conditions', sig:'', hexEncodedMsg:'', recoveredAddress:'', addressMatched:false}    
  };

  status = "";

  async ngOnInit() {
    this.watchAccount();
    this.coinInstance = await this.web3Service.StandardToken.deployed();
    this.web3 = this.web3Service.web3;
    this.refreshBalance();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.model.account = accounts[0];
        console.log(this.model.account);
      }
    });
  }

  setStatus(status) {
    this.status = status;
  };

  sendCoin() {
    if (!this.coinInstance) {
      this.setStatus("coinInstance is not loaded, unable to send transaction");
      return;
    }

    console.log("Sending coins" + this.model.amount + " to " + this.model.receiver);


    let amount = this.web3.utils.toWei( this.model.amount, 'ether' );
    let receiver = this.model.receiver;

    this.setStatus("Initiating transaction... (please wait)");

    this.coinInstance.transfer(receiver, amount, { from: this.model.account }).then((success) => {
      if (!success) {
        this.setStatus("Transaction failed!");
      }
      else {
        this.setStatus("Transaction complete!");
        this.refreshBalance();
      }
    }).catch((e) => {
      console.log(e);
      this.setStatus("Error sending coin; see log.");
    });

  };

  refreshBalance() {
    console.log("Refreshing balance");
        
    this.model.contractAddress = this.coinInstance.address;
    
    this.coinInstance.balanceOf.call(this.model.account).then((value) => {
      console.log("Found balance: ", value);
      this.model.balance = this.web3.utils.fromWei(value, 'ether');
    }).catch(function (e) {
      console.log(e);
      this.setStatus("Error getting balance; see log.");
    });
  };

  clickAddress(e) {
    this.model.account = e.target.value;
    this.refreshBalance();
  }

  setAmount(e) {
    console.log("Setting amount: " + e.target.value);
    this.model.amount = e.target.value;
  }

  setReceiver(e) {
    console.log("Setting receiver: " + e.target.value);
    this.model.receiver = e.target.value;
  }

  setMessageSignature(e) {
    console.log("Setting signature: " + e.target.value);
    this.model.msgParams.sig = e.target.value;
  }

  setMessageRawText(e) {
    console.log("Setting rawText: " + e.target.value);
    this.model.msgParams.rawText = e.target.value;
  }

  setMessageHashedText(e) {
    console.log("Setting hexEncodedMsg: " + e.target.value);
    this.model.msgParams.hexEncodedMsg = e.target.value; 
  }

  ethjsPersonalVerifyButton(event) {

    var from = this.model.account;
    var msg = this.model.msgParams.hexEncodedMsg;
    var signed = this.model.msgParams.sig;
    var eth = new Eth(this.web3.currentProvider);

    var self = this;

    eth.personal_ecRecover(msg, signed).then((recovered) => {

      if ( this.model.msgParams.addressMatched = (recovered.toLowerCase() === from.toLowerCase()) ) {
        console.log('Ethjs recovered the message signer! recovered:' + recovered + "; from: " + from);
      } else {
        console.log('Ethjs failed to recover the message signer!');
        console.dir({ recovered });      
      }

      this.model.msgParams.recoveredAddress = recovered;
    }, function(error) {
      console.log('Ethjs failed to recover the message signer!');      
      self.model.msgParams.recoveredAddress = 'FAILED!';      
      this.model.msgParams.addressMatched = false;
    });
    

  }

  ethjsPersonalSignButton(event) {

    event.preventDefault();
    
    var msg = ethUtil.bufferToHex(new Buffer(this.model.msgParams.rawText, 'utf8'));
    var from = this.model.account;

    console.log('CLICKED, SENDING PERSONAL SIGN REQ');
    var params = [from, msg];
    var eth = new Eth(this.web3.currentProvider);

    eth.personal_sign(msg, from)
    .then((signed) => {
      console.log('Signed!  Result is: ', signed);
      console.log('Recovering...');
      this.model.msgParams.hexEncodedMsg = msg;
      this.model.msgParams.sig = signed;

      return eth.personal_ecRecover(msg, signed)
    })
    .then((recovered) => {

      if ( this.model.msgParams.addressMatched = (recovered.toLowerCase() === from.toLowerCase()) ) {
        console.log('Ethjs recovered the message signer! recovered:' + recovered + "; from: " + from);
      } else {
        console.log('Ethjs failed to recover the message signer!');
        console.dir({ recovered });
      }
    })

  }

  
}
