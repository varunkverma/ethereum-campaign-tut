import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

function ContributeForm({ campaignAddress }) {
  const [contributionAmount, setContributionAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  function handleContributionAmountChange(e) {
    const { target } = e || {};
    const { value } = target || {};
    setContributionAmount(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setProcessing(true);
    setError("");

    try {
      if (contributionAmount <= 0) {
        throw Error("contribution amount should be greater than 0 ether");
      }
      const accounts = await web3.eth.getAccounts();

      await web3.eth.sendTransaction({
        from: accounts[0],
        to: campaignAddress,
        value: web3.utils.toWei(contributionAmount.toString(), "ether"),
      });

      setProcessing(false);
      setContributionAmount(0);

      Router.replaceRoute(`/campaigns/${campaignAddress}`);
    } catch (err) {
      setProcessing(false);
      console.log(err);
      setError(err.message);
    }
  }
  return (
    <Form onSubmit={handleSubmit} error={!!error}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          labelPosition="right"
          label="ether"
          type="number"
          value={contributionAmount}
          onChange={handleContributionAmountChange}
        />
      </Form.Field>
      <Message error header="Oops!" content={error} />
      <Button
        type="submit"
        primary
        content="Contribute!"
        loading={processing}
        disabled={processing}
      />
    </Form>
  );
}

export default ContributeForm;
