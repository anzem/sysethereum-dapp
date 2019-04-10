
import React, { Component } from 'react';
import * as SyscoinRpc from 'syscoin-js';
import CONFIGURATION from '../config';
import EthProof from 'eth-proof';
const rlp = require('rlp');
class Step2ES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mintsysrawtxunsigned: props.getStore().mintsysrawtxunsigned,
      working: false
    };
    
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.getMintTx = this.getMintTx.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
    this.syscoinClient = new SyscoinRpc.default({baseUrl: CONFIGURATION.syscoinRpcURL, port: CONFIGURATION.syscoinRpcPort, username: CONFIGURATION.syscoinRpcUser, password: CONFIGURATION.syscoinRpcPassword});
   
  }

  componentDidMount() {
    if(!this.props.getStore().receiptTxHash){
      this.props.jumpToStep(0);
    }
  }


  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if(this.props.getStore().mintsysrawtxunsigned !== userInput.mintsysrawtxunsigned) { // only update store of something changed
          this.props.updateStore({
            ...userInput,
            savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
          });  // Update store here (this is just an example, in reality you will do it via redux or flux)
        }

        isDataValid = true;
    }
    else {
        // if anything fails then update the UI validation state but NOT the UI Data State
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    }

    return isDataValid;
  }
  async getMintTx() {
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    validateNewInput.buttonVal = true;
    validateNewInput.buttonValMsg = "";
    validateNewInput.mintsysrawtxunsignedVal = true;
    validateNewInput.mintsysrawtxunsignedValMsg = "";       
    let self = this;
    this.setState({working: true});

    let toSysAssetGUID = this.props.getStore().toSysAssetGUID;
    let toSysAmount =  this.props.getStore().toSysAmount;
    let syscoinWitnessAddress =  this.props.getStore().syscoinWitnessAddress;
    let ethTXID = this.props.getStore().receiptTxHash;
    const buildEthProof = new EthProof(CONFIGURATION.infuraURL);
    try{
        let result = await buildEthProof.getTransactionProof(ethTXID);
        let tx_hex = rlp.encode(result.value).toString('hex');
        let tx_root_hex = rlp.encode(result.header[4]).toString('hex');
        let txmerkleproof_hex = rlp.encode(result.parentNodes).toString('hex');
        let txmerkleroofpath_hex = result.path.toString('hex');
        let blockNumber = result.blockNumber;
        console.log("tx_root_hex " + tx_root_hex);
        console.log("tx_hex: " + tx_hex);
        console.log("txmerkleproof_hex: " + txmerkleproof_hex);
        console.log("txmerkleroofpath_hex: " + txmerkleroofpath_hex);
        console.log("block number: " + blockNumber);

        if(toSysAssetGUID.length > 0){
          const args = [toSysAssetGUID, syscoinWitnessAddress, toSysAmount, blockNumber, tx_hex, tx_root_hex, txmerkleproof_hex, txmerkleroofpath_hex, ""];
          try {
            // [asset] [address] [amount] [blocknumber] [tx_hex] [txroot_hex] [txmerkleproof_hex] [txmerkleroofpath_hex] [witness]
            let results = await this.syscoinClient.callRpc("assetallocationmint", args);
            if(results && results.length && results.length > 0){
              try{
                let results1 = await this.syscoinClient.callRpc("syscointxfund", [results[0], syscoinWitnessAddress]);
                validateNewInput.mintsysrawtxunsignedVal = true;
                this.refs.mintsysrawtxunsigned.value = results1;
                userInput.mintsysrawtxunsigned = results1;
                self.setState({working: false});
                self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
              }catch(e){
                validateNewInput.buttonVal = false;
                validateNewInput.buttonValMsg = e.message;
                self.setState({working: false});
                console.log("error " + e.message);
              }
            }
          }catch(e) {
            validateNewInput.buttonVal = false;
            validateNewInput.buttonValMsg = e.message;
            console.log("error " + e.message);
            self.setState({working: false});
          }
        }
        else{
          const args = [syscoinWitnessAddress, toSysAmount, blockNumber, tx_hex, tx_root_hex, txmerkleproof_hex, txmerkleroofpath_hex, ""];
          try {
            //  [address] [amount] [blocknumber] [tx_hex] [txroot_hex] [txmerkleproof_hex] [txmerkleroofpath_hex] [witness]
            let results = await this.syscoinClient.callRpc("syscoinmint", args);
            if(results && results.length && results.length > 0){
              try{
                let results1 = await this.syscoinClient.callRpc("syscointxfund", [results[0],syscoinWitnessAddress]);
                validateNewInput.mintsysrawtxunsignedVal = true;
                this.refs.mintsysrawtxunsigned.value = results1;
                userInput.mintsysrawtxunsigned = results1;
                self.setState({working: false});
                self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
              }catch(e){
                validateNewInput.buttonVal = false;
                validateNewInput.buttonValMsg = e.message;
                console.log("error " + e.message);
                self.setState({working: false});
              }
            }
          
          }catch(e) {
            validateNewInput.buttonVal = false;
            validateNewInput.buttonValMsg = e.message;
            self.setState({working: false});
          }
        }

        this.setState({working: false});
    }catch(e){      
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = this.props.t("step2ESInvalidProof") + e;
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      this.setState({working: false});
    }

  }
  validationCheck() {
    if (!this._validateOnDemand)
      return;

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
  }

   _validateData(data) {
    return  {
      mintsysrawtxunsignedVal: true
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      mintsysrawtxunsignedValMsg: val.mintsysrawtxunsignedVal ? '' : this.props.t("step2ESRawTx")
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      mintsysrawtxunsigned: this.refs.mintsysrawtxunsigned.value
    };
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.mintsysrawtxunsignedVal == 'undefined' || this.state.mintsysrawtxunsignedVal) {
      notValidClasses.mintsysrawtxunsignedCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.mintsysrawtxunsignedCls = 'has-error col-md-8';
      notValidClasses.mintsysrawtxunsignedValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.buttonCls = 'has-error col-md-8';
      notValidClasses.buttonValGrpCls = 'val-err-tooltip';
    }
    return (
      <div className="step step2es">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
            <label className="col-md-12 control-label">
                <h1>{this.props.t("step2Head")}</h1>
                <h3>{this.props.t("step2Description")}</h3>
              </label>
             
              
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                </label>  
                <div className={notValidClasses.buttonCls}>
                    <button type="button" disabled={this.state.working} className="form-control btn btn-default" aria-label={this.props.t("step2Button")} onClick={this.getMintTx}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step2Button")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls}>{this.state.buttonValMsg}</div>
                </div>
              </div>
              </div>

              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step2RawTxLabel")}
                </label>  
                <div className={notValidClasses.mintsysrawtxunsignedCls}>
                  <textarea
                    rows="3"
                    ref="mintsysrawtxunsigned"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step2EnterRawTx")}
                    className="form-control"
                    required
                    defaultValue={this.state.mintsysrawtxunsigned}
                     />
                  <div className={notValidClasses.mintsysrawtxunsignedValGrpCls}>{this.state.mintsysrawtxunsignedValMsg}</div>
                </div>
              </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step2ES;