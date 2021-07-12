import React from "react";
import { Card, Button, Header } from "semantic-ui-react";
import { Link } from "../routes";
import Layout from "../components/Layout";

import CampaignFactoryInstance from "../ethereum/factory";

function CampaignList({ campaigns }) {
  function renderCampaigns() {
    const items =
      campaigns &&
      campaigns.map((address) => ({
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      }));

    return (
      <Layout>
        <Header as="h3">Open Campaigns</Header>
        <Link route="/campaigns/new">
          <a className="item">
            <Button
              floated="right"
              content="Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>
        <Card.Group items={items || []} />
      </Layout>
    );
  }

  return renderCampaigns();
}

CampaignList.getInitialProps = async () => {
  const campaigns =
    (CampaignFactoryInstance &&
      (await CampaignFactoryInstance.methods.getDeployedCampaigns().call())) ||
    [];

  return {
    campaigns,
  };
};

export default CampaignList;
