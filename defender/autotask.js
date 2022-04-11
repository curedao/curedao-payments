//  @title CureDAO Payments Automation
//  @author @lourenslinde, built upon Openzeppelin Defender Rollup examples
//  @dev Allows for a webhook to POST to this Autotask which, in turn, connects to the.. 
//  ...Openzeppelin Relayer for the Payment Terminal
//  @notice Copy and paste this into the Autotask code section on Defender.

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ethers = require('defender-relay-client/lib/ethers');
var ethers$1 = require('ethers');

var contractName="IERC20";var abi=[{anonymous:false,inputs:[{indexed:true,internalType:"address",name:"owner",type:"address"},{indexed:true,internalType:"address",name:"spender",type:"address"},{indexed:false,internalType:"uint256",name:"value",type:"uint256"}],name:"Approval",type:"event"},{anonymous:false,inputs:[{indexed:true,internalType:"address",name:"from",type:"address"},{indexed:true,internalType:"address",name:"to",type:"address"},{indexed:false,internalType:"uint256",name:"value",type:"uint256"}],name:"Transfer",type:"event"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"spender",type:"address"}],name:"allowance",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"spender",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"approve",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalSupply",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"recipient",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transfer",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"address",name:"recipient",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"transferFrom",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}];var bytecode="0x";var deployedBytecode="0x";var linkReferences={};var deployedLinkReferences={};var IERC20 = {contractName:contractName,abi:abi,bytecode:bytecode,deployedBytecode:deployedBytecode,linkReferences:linkReferences,deployedLinkReferences:deployedLinkReferences};

//  Address of testnet GCURE token contract on the KOVAN testnet (for this example)
const testGCURES = `0x1ede49963291FC2d03B0aEbbFcC57D310B2dd8b6`;
//  Entrypoint for the Autotask
async function handler(event) {
    //  Unpack the event for the query parameters sent in the POST webhook'
    //  POST webhook sends two parameters
    //  recipient:address The receiver address in format 0x1ede49963291FC2d03B0aEbbFcC57D310B2dd8b6 NOT as a string "0x1ede49963291FC2d03B0aEbbFcC57D310B2dd8b6"
    //  amount:uint256 The amount of GCURES (in WEI) to be transferred from the Relayer to the Receiver. 
	const { body, headers, queryParameters } = event.request;	
  	const receiver = queryParameters.recipient;
  	const amount = queryParameters.amount;
    //  Initialize defender relayer provider and signer
    const provider = new ethers.DefenderRelayProvider(event);
    const signer = new ethers.DefenderRelaySigner(event, provider, { speed: 'fast' });
    //  Initialize the contract object with the ERC20 contract address, the ERC20 contract ABI and the signer
    const gcures = new ethers$1.ethers.Contract(testGCURES, IERC20.abi, signer);
    //  Getting the totalSupply and logging it makes it easier to keep an eye on the amount of tokens still available to the Relayer.
    const atto = await gcures.totalSupply();
    const supply = Math.ceil(atto.div(1e18.toString()).toNumber());
    console.log(`TestGCURES total supply is ${supply}`);
    //  The balanceOf method is called on the Relayer address (this is obtained from the Defender console)
    const balance = await gcures.balanceOf("0x00fe9722f15D84bCD19c3B669ec8a1Ec064794d4");
    if (balance.gt(0)) {
        //  transfer() sends tokens owned by the Relayer address to the receiver address
        //  tx abstracts away the transaction logic
        const tx = await gcures.transfer(receiver, amount.toString());
        console.log(`Transferred ${amount.toString()} to ${ receiver } `);
        return tx;
    }
    else {
        console.log(`No balance to transfer`);
    } 
    return { to: receiver}; 
}

exports.handler = handler;
