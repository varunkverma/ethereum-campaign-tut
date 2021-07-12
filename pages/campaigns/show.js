import React from "react";
import { Button, Header, Card, Input, Message, Grid } from "semantic-ui-react";
import Layout from "../../components/Layout";
import ContributeForm from "../../components/ContributeForm";
import getCampaignInstance from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";

function CampaignShow({
  minimumContribution,
  balance,
  numOfRequests,
  approversCount,
  manager,
  campaignAddress,
}) {
  function renderCards() {
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money. With appropriate number of approvals can finalise the request as well",
        style: {
          overflowWrap: "break-word",
        },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description: "You must contribute this much wei to become an approver",
      },
      {
        header: numOfRequests,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract funds. Request before being finalised, has to be approved by an appropriate amount of approvers",
      },
      {
        header: approversCount,
        meta: "Numbers of Approvers",
        description:
          "The number of people who has already contributed to the campaign",
      },
      {
        header: balance,
        meta: "Campaign Funds (ether)",
        description:
          "The amount of funds left in this campaign to be requested for by the manager of this campaign",
      },
    ];

    return <Card.Group items={items} />;
  }

  return (
    <Layout>
      <Header as="h3" content="Campaign Details" />
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm campaignAddress={campaignAddress} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${campaignAddress}/requests`}>
              <a>
                <Button secondary content="View Requests" />
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}

CampaignShow.getInitialProps = async ({ query }) => {
  const { address } = query || {};
  const campaignInstance = await getCampaignInstance(address);
  const campaignSummary = await campaignInstance.methods.getSummary().call();
  const [
    minimumContribution = 0,
    balance = 0,
    numOfRequests = 0,
    approversCount = 0,
    manager,
  ] = Object.values(campaignSummary) || [];

  return {
    minimumContribution,
    balance: web3.utils.fromWei(balance.toString(), "ether"),
    numOfRequests,
    approversCount,
    manager,
    campaignAddress: address,
  };
};

export default CampaignShow;
