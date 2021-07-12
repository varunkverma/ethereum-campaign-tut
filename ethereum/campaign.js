import web3 from "./web3";
import campaignContract from "./artifacts/Campaign.json";

function getCampaignInstance(address) {
  const safe = web3 && typeof web3.eth !== "undefined";

  if (safe) {
    return new web3.eth.Contract(campaignContract.abi, address);
  }

  return null;
}

export default getCampaignInstance;
