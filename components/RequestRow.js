import React, { useState } from "react";
import { Table, Button, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import CampaignInstance from "../ethereum/campaign";

function RequestRow({
  request,
  id,
  approversCount,
  campaignAddress,
  showError,
}) {
  const [processing, setProcessing] = useState(false);
  const { Cell, Row } = Table || {};
  const { description, value, recipient, completed, approvalCount } =
    request || {};

  const readyToFinalize = approvalCount > approversCount / 2;

  async function handleApproveRequest() {
    showError("");
    setProcessing(true);
    try {
      const accounts = await web3.eth.getAccounts();

      const campaignInstance = CampaignInstance(campaignAddress);
      const res = await campaignInstance.methods.approveRequest(id).send({
        from: accounts[0],
      });
      const { code, message } = res || {};
      if (code >= 4000) {
        throw Error(message);
      }
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      showError(err.message);
    }
  }
  async function handleFinalizeRequest() {
    showError("");
    setProcessing(true);
    try {
      const accounts = await web3.eth.getAccounts();

      const campaignInstance = CampaignInstance(campaignAddress);
      const res = await campaignInstance.methods.finalizeRequest(id).send({
        from: accounts[0],
      });
      const { code, message } = res || {};
      if (code >= 4000) {
        throw Error(message);
      }
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      showError(err.message);
    }
  }
  return (
    <Row disabled={completed} positive={!completed && readyToFinalize}>
      <Cell>{id}</Cell>
      <Cell>{description}</Cell>
      <Cell>{web3.utils.fromWei(value, "ether")}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>{`${approvalCount}/${approversCount}`}</Cell>
      <Cell>
        {!completed && (
          <Button
            loading={processing}
            disabled={processing}
            color="green"
            basic
            content="Approve"
            onClick={handleApproveRequest}
          />
        )}
      </Cell>
      <Cell>
        {!completed && (
          <Button
            loading={processing}
            disabled={processing}
            color="teal"
            basic
            content="Finalize"
            onClick={handleFinalizeRequest}
          />
        )}
      </Cell>
    </Row>
  );
}

export default RequestRow;
