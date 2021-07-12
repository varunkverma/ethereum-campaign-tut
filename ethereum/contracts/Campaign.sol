// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

contract CampaignFactory {
    address[] deployedCampaigns;

    function createCampaign(uint256 _minimumContribution) public {
        address newCampaign = address(
            new Campaign(_minimumContribution, msg.sender)
        );
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool completed;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    uint256 public numOfRequests;
    mapping(uint256 => Request) public requests;

    address public manager;

    uint256 public minimumContribution;

    uint256 public approversCount;
    mapping(address => bool) public approvers;

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager is authorized");
        _;
    }

    constructor(uint256 _minimumContribution, address _manager) {
        manager = _manager;
        minimumContribution = _minimumContribution;
    }

    function createRequest(
        string memory _description,
        uint256 _value,
        address _recipient
    ) public onlyManager {
        Request storage newRequest = requests[numOfRequests++];
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = payable(_recipient);
        newRequest.completed = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 requestNumber) public {
        require(approvers[msg.sender], "you are not an authorized approver");
        require(
            requestNumber >= 0 && requestNumber <= numOfRequests,
            "invalid request number"
        );

        Request storage r = requests[requestNumber];
        require(
            !r.approvals[msg.sender],
            "you have already approved this request"
        );

        // adding msg sender to approvals of this request.
        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function finalizeRequest(uint256 requestNumber) public onlyManager {
        require(requestNumber <= numOfRequests, "invalid request number");

        Request storage r = requests[requestNumber];
        require(
            r.approvalCount > (approversCount / 2),
            "request cannot be completed, as it doesn't meet required number of approvals"
        );
        require(!r.completed, "request is already marked as completed");

        r.recipient.transfer(r.value);
        r.completed = true;
    }

    function getTotalFunds() public view returns (uint256) {
        return address(this).balance;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            getTotalFunds(),
            numOfRequests,
            approversCount,
            manager
        );
    }

    receive() external payable {
        require(
            msg.value >= minimumContribution,
            "contribution send needs to meet the minimum contribution amount"
        );
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }
}
