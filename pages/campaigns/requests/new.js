import React, { useState } from "react";
import { Button, Header, Form, Input, Message } from "semantic-ui-react";

import Layout from "../../../components/Layout";
import { Router, Link } from "../../../routes";
import web3 from "../../../ethereum/web3";
import CampaignInstance from "../../../ethereum/campaign";

function CampaignsRequestNew({ campaignAddress }) {
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  function handleChange(e, name) {
    const { target } = e || {};
    const { value } = target || {};
    switch (name) {
      case "description": {
        setDescription(value);
        break;
      }
      case "value": {
        setValue(value);
        break;
      }
      case "recipient": {
        setRecipient(value);
        break;
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setProcessing(true);

    try {
      if (value === "" || description === "" || recipient === "") {
        throw Error(
          "please provide all the required information to create a request"
        );
      }
      const campaignInstance = CampaignInstance(campaignAddress);
      const accounts = await web3.eth.getAccounts();

      await campaignInstance.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
          to: campaignInstance._Address,
        });
      setProcessing(false);
      Router.pushRoute(`/campaigns/${campaignAddress}/requests`);
    } catch (err) {
      setProcessing(false);
      setError(err.Message);
    }
  }

  return (
    <Layout>
      <Link route={`/campaigns/${campaignAddress}/requests`}>
        <a>Back</a>
      </Link>
      <Header as="h3" content="Create a new request" />
      <Form onSubmit={handleSubmit} error={!!error}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => handleChange(e, "description")}
          />
        </Form.Field>
        <Form.Field>
          <label>Amount in Ethers</label>
          <Input
            label="ether"
            labelPosition="right"
            value={value}
            onChange={(e) => handleChange(e, "value")}
            type="number"
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient Address</label>
          <Input
            value={recipient}
            onChange={(e) => handleChange(e, "recipient")}
          />
        </Form.Field>
        <Message error header="Oops!" content={error} />
        <Button
          loading={processing}
          disabled={processing}
          primary
          content="Create Request!"
        />
      </Form>
    </Layout>
  );
}

CampaignsRequestNew.getInitialProps = async ({ query }) => {
  const { address } = query || {};
  return {
    campaignAddress: address,
  };
};

export default CampaignsRequestNew;
