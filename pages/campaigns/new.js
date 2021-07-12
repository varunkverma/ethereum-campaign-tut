import React, { useState } from "react";
import { Button, Header, Form, Input, Message } from "semantic-ui-react";

import { Router } from "../../routes";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";

function CampaignNew() {
  const [minimumContribution, setMinimumContribution] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  function handleMinimumContributionChange(e) {
    const { target } = e || {};
    const { value } = target || {};
    setMinimumContribution(parseInt(value || 0));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setProcessing(true);
    setError("");

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(minimumContribution.toString())
        .send({
          from: accounts[0],
        });

      setProcessing(false);
      Router.pushRoute("/");
    } catch (err) {
      setProcessing(false);
      setError(err.message);
    }
  }

  return (
    <Layout>
      <Header as="h3" content="Create a camapign" />
      <Form onSubmit={handleSubmit} error={!!error}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            labelPosition="right"
            label="wei"
            type="number"
            onChange={handleMinimumContributionChange}
            value={minimumContribution}
          />
        </Form.Field>
        <Message error header="Oops!" content={error} />
        <Button
          loading={processing}
          disabled={processing}
          type="submit"
          primary
          content="Create"
        />
      </Form>
    </Layout>
  );
}

export default CampaignNew;
