const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
require("dotenv").config({ path: "../.env" });

const compiledCampaignFactoryContract = require("./artifacts/CampaignFactory.json");

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.MNEMONIC,
  },
  providerOrUrl: process.env.INFURA_ROPSTEN,
});

const web3 = new Web3(provider);

async function deploy() {
  const accounts = await web3.eth.getAccounts();
  const [deployerAccount] = accounts;
  console.log(`Attempting to deploy via account: ${deployerAccount}`);

  const contractInstance = await new web3.eth.Contract(
    compiledCampaignFactoryContract.abi
  )
    .deploy({
      data: compiledCampaignFactoryContract.evm.bytecode.object,
    })
    .send({
      from: deployerAccount,
      gas: "5000000",
    });
  console.log(`Contract deployed to ${contractInstance.options.address}`);
}

deploy();
