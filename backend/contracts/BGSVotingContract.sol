// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BGSVotingContract is ReentrancyGuard, Ownable {
    // BGS Token interface
    address public immutable bgsToken;
    // Proposal information
    string public proposalTopic;
    
    // Voting parameters
    uint256 public immutable votingDuration;
    uint256 public immutable goalAmount;
    uint256 public immutable startTime;
    uint256 public immutable endTime;
    
    // Voting state
    uint256 public totalVoted;
    bool public goalReached;
    bool public votingEnded;
    
    // Direct transfer tracking
    uint256 public totalTokensReceived; // Total tokens sent to contract
    mapping(address => uint256) public pendingTransfers; // Tokens sent but not yet registered as votes
    
    // Voter tracking
    mapping(address => uint256) public voterContributions;
    address[] public voters;
    mapping(address => bool) public hasVoted;
    
    // Events
    event ProposalCreated(string topic, uint256 goalAmount, uint256 endTime);
    event TokensReceived(address indexed from, uint256 amount);
    event VoteCast(address indexed voter, uint256 amount, string topic);
    event GoalReached(uint256 totalAmount, uint256 timestamp, string topic);
    event VotingEnded(bool goalAchieved, uint256 totalAmount, string topic);
    event FundsWithdrawn(address indexed voter, uint256 amount, string topic);
    event GoalFundsWithdrawn(address indexed owner, uint256 amount, string topic);
    event ResponseCode(int responseCode);

    // Errors
    error VotingNotActive();
    error VotingStillActive();
    error InsufficientBGSBalance();
    error TransferFailed();
    error GoalAlreadyReached();
    error NoContributionToWithdraw();
    error NoPendingTransfers();
    error GoalNotReached();
    error AlreadyWithdrawn();
    error UnauthorizedWithdrawal();
    error InvalidAmount();
    
    constructor(
        address _bgsToken,
        uint256 _votingDurationDays,
        uint256 _goalAmount,
        string memory _proposalTopic
    ) Ownable(msg.sender) {
        require(_bgsToken != address(0), "Invalid BGS token address");
        require(_votingDurationDays > 0, "Voting duration must be positive");
        require(_goalAmount > 0, "Goal amount must be positive");
        require(bytes(_proposalTopic).length > 0, "Proposal topic cannot be empty");
        
        bgsToken = _bgsToken;
        votingDuration = _votingDurationDays * 1 days;
        goalAmount = _goalAmount;
        proposalTopic = _proposalTopic;
        startTime = block.timestamp;
        endTime = startTime + votingDuration;

        // Associate token with contract
        
        emit ProposalCreated(_proposalTopic, _goalAmount, endTime);
    }
    
    /**
     * @notice Called when tokens are directly transferred to this contract
     * @dev This function tracks tokens received but doesn't register them as votes yet
     */
    function onTokenReceived(address from, uint256 amount) external {
        require(msg.sender == from, "Only voters with bgs transferred can call this");
        
        // Track the transfer
        pendingTransfers[from] += amount;
        totalTokensReceived += amount;
        
        emit TokensReceived(from, amount);
    }
    
    /**
     * @notice Register pending transfers as votes (Method 1 implementation)
     * @dev Users call this after they've transferred tokens directly to the contract
     */
    function registerVote() external nonReentrant {
        if (block.timestamp >= endTime || goalReached || votingEnded) {
            revert VotingNotActive();
        }
        
        // Check if user has pending transfers
        uint256 pendingAmount = pendingTransfers[msg.sender];
        if (pendingAmount == 0) {
            revert NoPendingTransfers();
        }
        
        // Clear pending transfers
        pendingTransfers[msg.sender] = 0;
        
        // Process the vote
        _processVote(msg.sender, pendingAmount);
    }
    
    /**
     * @notice Internal function to process votes
     */
    function _processVote(address voter, uint256 amount) internal {
        // Track voter contribution
        if (!hasVoted[voter]) {
            voters.push(voter);
            hasVoted[voter] = true;
        }
        
        voterContributions[voter] += amount;
        totalVoted += amount;
        
        emit VoteCast(voter, amount, proposalTopic);
        
        // Check if goal is reached
        if (totalVoted >= goalAmount && !goalReached) {
            goalReached = true;
            votingEnded = true;
            emit GoalReached(totalVoted, block.timestamp, proposalTopic);
        }
    }
    
    /**
     * @notice Get total pending transfers across all users
     */
    function _getTotalPendingTransfers() internal view returns (uint256) {
        // Note: This is a simplified version. In practice, you'd need to track this more efficiently
        return totalTokensReceived - totalVoted;
    }
    
    /**
     * @notice Get user's pending transfer amount
     */
    function getPendingTransfers(address user) external view returns (uint256) {
        return pendingTransfers[user];
    }

    /**
     * @notice End voting period (can be called by anyone after time expires)
     */
    function endVoting() external {
        if (block.timestamp < endTime && !goalReached) {
            revert VotingStillActive();
        }
        
        if (!votingEnded) {
            votingEnded = true;
            emit VotingEnded(goalReached, totalVoted, proposalTopic);
        }
    }
    
    /**
     * @notice Withdraw contributed tokens (only if goal not reached)
     */
    function withdrawContribution() external nonReentrant {
        if (!votingEnded) {
            if (block.timestamp < endTime && !goalReached) {
                revert VotingStillActive();
            } else if (!votingEnded) {
                // Auto-end voting if time expired
                votingEnded = true;
                emit VotingEnded(goalReached, totalVoted, proposalTopic);
            }
        }
        
        if (goalReached) {
            revert GoalAlreadyReached();
        }
        
        uint256 contribution = voterContributions[msg.sender];
        if (contribution == 0) {
            revert NoContributionToWithdraw();
        }
        
        // Reset contribution to prevent re-withdrawal
        voterContributions[msg.sender] = 0;
        
        // Transfer tokens back to voter
        IERC20(bgsToken).transfer( msg.sender, contribution);
        
        emit FundsWithdrawn(msg.sender, contribution, proposalTopic);
    }
    
    /**
     * @notice Owner withdraws funds if goal is reached
     */
    function withdrawGoalFunds() external onlyOwner nonReentrant {
        if (!goalReached) {
            revert GoalNotReached();
        }
        
        if (totalVoted == 0) {
            revert NoContributionToWithdraw();
        }
        
        IERC20(bgsToken).transfer(msg.sender, totalVoted);

        
        emit GoalFundsWithdrawn(msg.sender, totalVoted, proposalTopic);
    }

    /**
     * @notice Get proposal information
     */
    function getProposalInfo() external view returns (
        string memory topic,
        uint256 _goalAmount,
        uint256 _startTime,
        uint256 _endTime
    ) {
        return (
            proposalTopic,
            goalAmount,
            startTime,
            endTime
        );
    }
    
    /**
     * @notice Get voting status information
     */
    function getVotingStatus() external view returns (
        uint256 _totalVoted,
        uint256 _goalAmount,
        uint256 _timeRemaining,
        bool _goalReached,
        bool _votingEnded,
        uint256 _voterCount,
        uint256 _totalTokensReceived,
        uint256 _totalPendingTransfers
    ) {
        uint256 timeRemaining = 0;
        if (block.timestamp < endTime) {
            timeRemaining = endTime - block.timestamp;
        }
        
        return (
            totalVoted,
            goalAmount,
            timeRemaining,
            goalReached,
            votingEnded,
            voters.length,
            totalTokensReceived,
            _getTotalPendingTransfers()
        );
    }
    
    /**
     * @notice Get voter's contribution amount
     */
    function getVoterContribution(address voter) external view returns (uint256) {
        return voterContributions[voter];
    }
    
    /**
     * @notice Get all voters (for transparency)
     */
    function getAllVoters() external view returns (address[] memory) {
        return voters;
    }
    
    /**
     * @notice Check if voting is currently active
     */
    function isVotingActive() external view returns (bool) {
        return block.timestamp < endTime && !goalReached && !votingEnded;
    }
}