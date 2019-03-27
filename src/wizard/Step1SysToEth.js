
import React, { Component } from 'react';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import SyscoinSuperblocks from '../SyscoinSuperblocks';
const axios = require('axios');
class Step1 extends Component {
  constructor(props) {
    super(props);
    this.searchSuperblock = this.searchSuperblock.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.state = {
      superblockApproved: false,
      superblockBlockHeight: 0,
      superblockLastBlockHash: "",
      superblockLastBlockTime: 0,
      superblockMerkleRoot: "",
      superblockParentId: "",
      superblockPreviousBlockBits: 0,
      superblockPreviousBlockTime: 0,
      superblockHeight: 0,
      superblockId: "",
      searchError: ""
    };
  }
  handleNextClick() {
    console.log("next");
    console.log( this.state.superblockHeight+1);
    axios.get('http://localhost:8000/superblock?height=' + (this.state.superblockHeight+1), { crossdomain: true })
    .then(response => {
      console.log(response);
      if(response.data.error){
     
      }
      else{
        this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
          superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.previousSyscoinBlockTime,
          superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
          superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
          superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
        });
      }
    })
    .catch(error => {
  
    });
  }
  handlePrevClick() {
    console.log("prev");
    console.log( this.state.superblockHeight-1);
    axios.get('http://localhost:8000/superblock?height=' + (this.state.superblockHeight-1), { crossdomain: true })
    .then(response => {
      console.log(response);
      if(response.data.error){
       
      }
      else{
        this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
          superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.previousSyscoinBlockTime,
          superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
          superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
          superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
        });
      }
    })
    .catch(error => {
     
    });
  }
  searchSuperblock() {
    this.setState({searchError: ""});
    const userInput = this.refs.searchText.value;
    if(!userInput || userInput === "")
      return;
    axios.get('http://localhost:8000/superblock?hash=' + userInput, { crossdomain: true })
      .then(response => {
        console.log(response);
        if(response.data.error){
          axios.get('http://localhost:8000/superblock?height=' + userInput, { crossdomain: true })
            .then(response => {
              console.log(response);
              if(response.data.error){
                axios.get('http://localhost:8000/superblockbysyscoinblock?hash=' + userInput, { crossdomain: true })
                .then(response => {
                  console.log(response);
                  if(response.data.error){
                    axios.get('http://localhost:8000/superblockbysyscoinblock?height=' + userInput, { crossdomain: true })
                    .then(response => {
                      console.log(response);
                      if(response.data.error){
                        this.setState({searchError: response.data.error});
                      }
                      else{
                        this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
                          superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.previousSyscoinBlockTime,
                          superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
                          superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
                          superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
                        });
                      }
                    })
                    .catch(error => {
                      this.setState({searchError: error.response});
                    });
                  }
                  else{
                    this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
                      superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.previousSyscoinBlockTime,
                      superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
                      superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
                      superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
                    });
                  }
                })
                .catch(error => {
                  this.setState({searchError: error.response});
                });
              }
              else{
                this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
                  superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.previousSyscoinBlockTime,
                  superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
                  superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
                  superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
                });
              }
            })
            .catch(error => {
              this.setState({searchError: error.response});
            });
        }
        else{
          this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
            superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.previousSyscoinBlockTime,
            superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
            superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
            superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
          });
        }
      })
      .catch(error => {
        this.setState({searchError: error.response});
      });
  }
    async componentDidMount() {
    /*const currentSuperBlockHash = await SyscoinSuperblocks.methods.getBestSuperblock().call();
    axios.get('http://localhost:8000/superblock?hash=' + currentSuperBlockHash, { crossdomain: true })
      .then(response => {
        if(response.data.error){
          this.setState({searchError: response.error});
        }
        else{
          this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
            superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.previousSyscoinBlockTime,
            superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
            superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
            superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
          });
        }
      })
      .catch(error => {
        this.setState({searchError: error.response});
      });*/
  }

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  render() {
    return (
      <div className="step step1">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step1Head")}</h1>
                <h3>{this.props.t("step1Description")} <a href="https://github.com/syscoin/sysethereum-contracts" target="_blank" rel="noopener noreferrer">{this.props.t("repoUrl")}</a></h3>
              </label>
  

              <div className="row">
                <div className="col-md-8 col-md-offset-2">
                  <form class="navbar-form" onsubmit="return false;" role="search">
                    <div class="input-group add-on">
                      <input
                          ref="searchText"
                          autoComplete="off"
                          type="text"
                          placeholder={this.props.t("step1SearchBox")}
                          className="form-control"/>
                      <div class="input-group-btn">
                        <button class="btn btn-default" type="button" onClick={this.searchSuperblock}><i class="glyphicon glyphicon-search"></i></button>
                      </div>
                    </div>
                    <div class="superblocksearcherror">{this.state.searchError}</div>
                  </form>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="col-md-6">
                    <code>
                        {this.props.t("step1SuperblockId")}: {this.state.superblockId}<br />
                        {this.props.t("step1SuperblockBlockHeight")}: {this.state.superblockBlockHeight}<br />
                        {this.props.t("step1superblockHeight")}: {this.state.superblockHeight}<br />
                        {this.props.t("step1LastBlockTime")}: {this.state.superblockLastBlockTime}<br />
                        {this.props.t("step1SuperblockApproved")}: {this.state.superblockApproved.toString()}<br />
                    </code>
                  </div>
                  <div className="col-md-6">
                    <code>
                        {this.props.t("step1LastBlockHash")}: {this.state.superblockLastBlockHash}<br />
                        {this.props.t("step1MerkleRoot")}: {this.state.superblockMerkleRoot}<br />
                        {this.props.t("step1PreviousBlockTime")}: {this.state.superblockPreviousBlockTime}<br />
                        {this.props.t("step1PreviousBlockBits")}: {this.state.superblockPreviousBlockBits}<br />
                        {this.props.t("step1SuperblockParentId")}: {this.state.superblockParentId}<br />
                    </code>
                  </div>
                </div>
                
                <div className="col-8 col-md-offset-5 col-sm-offset-5 col-lg-offset-5">
                  <div class="superblockpagecontainer">
                    <div class="superblockpageicon" onClick={this.handlePrevClick}><MaterialIcon icon="arrow_left" size='large' /></div><div class="superblockpage">{this.state.superblockHeight}</div><div class="superblockpageicon" onClick={this.handleNextClick}><MaterialIcon icon="arrow_right" size='large' /></div>
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

export default Step1;