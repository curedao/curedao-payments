pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT
/// @title Payment terminal for CureDAO payments
/// @author @lourenslinde
/// @notice Acts as the payment intermediary between the CureDAO multisig 
/// @dev Allows for the automated payment of tokens from the CureDAO multisig, using approve() + transferFrom() pattern
/// @dev For testing: uses DemoToken.sol as replacement for GCURE token and uses Treasury.sol as replacement for MultiSig 

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract PaymentTerminal is Pausable, AccessControl {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant PAYMENTS_ROLE = keccak256("PAYMENTS_ROLE");

  IERC20 private token;
  address public treasury;

  constructor(IERC20 _token, address multisig, address paymentRole) {
    token = _token;
    treasury = multisig;
    _grantRole(PAYMENTS_ROLE, paymentRole);
    _grantRole(DEFAULT_ADMIN_ROLE, multisig);
    _grantRole(PAUSER_ROLE, multisig);
  }

  /// @notice Makes demoToken payments from the CureDAO MultiSig
  /// @dev Calls transferFrom on demoToken
  /// @param to:address Address where tokens must be transferred to
  /// @param amount:uint256 Amount of tokens to be transferred
  /// @return bool Indicates if the function executed successfully
  function payment(address payable to, uint256 amount) public onlyRole(PAYMENTS_ROLE) returns(bool) {
    require(token.transferFrom(treasury, to, amount), "Payment was unsuccessful");
    return true;
  }

  /// @notice Returns the PaymentTerminal's allowance
  /// @dev Calls the allowance(address) on the IERC20 interface. 
  /// @return amount:uint256 Spender's allowance
  function terminalAllowance() external view returns(uint256) {
    return token.allowance(treasury, address(this));
  }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
