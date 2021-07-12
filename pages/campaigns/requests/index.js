import React, { useState } from "react";
import { Button, Header, Table, Message, Container } from "semantic-ui-react";
import CampaignInstance from "../../../ethereum/campaign";
import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";
import { Link } from "../../../routes";

function CampaignsRequestIndex({
  campaignAddress,
  requestCount,
  requests,
  approversCount,
}) {
  const [error, setError] = useState("");
  const { Header: THeader, HeaderCell, Row, Body } = Table || {};

  function showError(message) {
    setError(message);
  }

  function renderRow() {
    return requests.map((req, i) => {
      return (
        <RequestRow
          request={req}
          id={i}
          key={i}
          campaignAddress={campaignAddress}
          approversCount={approversCount}
          showError={showError}
        />
      );
    });
  }

  return (
    <Layout>
      <Header as="h3">Requests</Header>
      <Link route={`/campaigns/${campaignAddress}/requests/new`}>
        <a>
          <Button
            style={{ marginBottom: 10 }}
            primary
            floated="right"
            content="Add request"
          />
        </a>
      </Link>
      {!!error && <Message error header="Oops!" content={error} />}
      <Table>
        <THeader>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount (ether)</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </THeader>
        <Body>{renderRow()}</Body>
      </Table>
      <Container>Found {requestCount} requests</Container>
    </Layout>
  );
}

CampaignsRequestIndex.getInitialProps = async ({ query }) => {
  const { address } = query || {};
  const campaignInstance = CampaignInstance(address);

  const requestCount = await campaignInstance.methods.numOfRequests().call();
  console.log(requestCount);
  const requestsP = [];
  for (let i = 0; i < requestCount; i++) {
    requestsP.push(campaignInstance.methods.requests(i).call());
  }
  const requests = await Promise.all(requestsP);

  console.log(requests);

  const approversCount = await campaignInstance.methods.approversCount().call();

  return {
    campaignAddress: address,
    requestCount,
    requests,
    approversCount,
  };
};

export default CampaignsRequestIndex;
