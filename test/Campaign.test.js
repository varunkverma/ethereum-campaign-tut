const assert = require("assert");
const ganache = require("ganache-core");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledCampaignFactoryContract = require("../ethereum/artifacts/CampaignFactory.json");
const compiledCamapignContract = require("../ethereum/artifacts/Campaign.json");

let accounts;
let campaignFactoryInstance;
let campaignInstance;
let campaignAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  campaignFactoryInstance = await new web3.eth.Contract(
    compiledCampaignFactoryContract.abi
  )
    .deploy({ data: compiledCampaignFactoryContract.evm.bytecode.object })
    .send({
      from: accounts[0],
      gas: "5000000",
    });

  await campaignFactoryInstance.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "5000000",
  });

  const storedCampaigns = await campaignFactoryInstance.methods
    .getDeployedCampaigns()
    .call();
  campaignAddress = storedCampaigns[0];
  campaignInstance = await new web3.eth.Contract(
    compiledCamapignContract.abi,
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(campaignFactoryInstance.options.address);
    assert.ok(campaignInstance.options.address);
  });

  it("marks the caller as the campaign manager", async () => {
    const campaignManager = await campaignInstance.methods.manager().call();
    assert.strictEqual(accounts[0], campaignManager);
  });

  it("allows people to contribute and mark them as an approver", async () => {
    await web3.eth.sendTransaction({
      from: accounts[1],
      to: campaignInstance._address,
      value: web3.utils.toWei("1", "ether"),
    });

    const isAContributer = await campaignInstance.methods
      .approvers(accounts[1])
      .call();
    assert.strictEqual(isAContributer, true);
  });

  it("requires a minimum contribution", async () => {
    try {
      await web3.eth.sendTransaction({
        from: accounts[1],
        to: campaignInstance._address,
        value: "10",
      });
    } catch (e) {
      assert.ok(e);
    }
  });

  it("allows a manager to create a payment request", async () => {
    await campaignInstance.methods
      .createRequest("request creation test", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "5000000",
      });

    const request = await campaignInstance.methods.requests(0).call();
    assert.strictEqual(request.description, "request creation test");
  });

  it("processes request", async () => {
    await web3.eth.sendTransaction({
      from: accounts[1],
      to: campaignInstance._address,
      value: web3.utils.toWei("10", "ether"),
    });

    await campaignInstance.methods
      .createRequest(
        "request creation test",
        web3.utils.toWei("5", "ether"),
        accounts[2]
      )
      .send({
        from: accounts[0],
        gas: "5000000",
      });

    await campaignInstance.methods.approveRequest(0).send({
      from: accounts[1],
      gas: "5000000",
    });

    await campaignInstance.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "5000000",
    });

    let balance = await web3.eth.getBalance(accounts[2]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    assert(balance > 104);
  });
});
