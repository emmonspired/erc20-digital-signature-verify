import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import { WindowRefService } from './window-ref.service';
import standard_token_artifacts from '../../../build/contracts/StandardToken.json';
import erc20compatible_artifacts from '../../../build/contracts/LOCIcoin.json';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class Web3Service {

  public web3: Web3;
  private accounts: string[];
  public StandardToken: any;  

  public accountsObservable = new Subject<string[]>();

  constructor(private windowRef: WindowRefService) {
    this.setupContract();
    this.refreshAccounts();
  }

  private setupMetamaskWeb3() {
    if (!this.windowRef.nativeWindow) {
      throw new Error('Can not get the window');
    }
    if (!this.windowRef.nativeWindow.web3) {
      throw new Error('Not a metamask browser');
    }
    this.web3 = new Web3(this.windowRef.nativeWindow.web3.currentProvider);
  }

  private setupContract() {
    this.setupMetamaskWeb3();

    this.StandardToken = contract(standard_token_artifacts);
    this.StandardToken.setProvider(this.web3.currentProvider);        
  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert(`There was an error fetching your accounts.`);
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length == 0) {
        alert(`Couldn't get any accounts! Make sure your Ethereum client is configured correctly.`);
        return;
      }

      if (!this.accounts || this.accounts.length != accs.length || this.accounts[0] != accs[0]) {
        console.log(`Observed new accounts`);
        this.accountsObservable.next(accs);
        this.accounts = accs;
      }
    });
  }
}
