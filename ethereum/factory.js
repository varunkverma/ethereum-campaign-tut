import web3 from "./web3";
import campaignFactoryContract from "./artifacts/CampaignFactory.json";

function getInstance() {
  const safe =
    web3 &&
    typeof web3.eth !== "undefined" &&
    !!process.env.CAMPAIGN_FACTORY_DEPLOYED_ADDRESS;

  if (safe) {
    return new web3.eth.Contract(
      campaignFactoryContract.abi,
      process.env.CAMPAIGN_FACTORY_DEPLOYED_ADDRESS
    );
  }

  return null;
}

export default getInstance();
