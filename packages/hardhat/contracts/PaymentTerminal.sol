pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT
/// @title Payment terminal for CureDAO payments
/// @author @lourenslinde
/// @notice Acts as the payment intermediary between the CureDAO multisig 
/// @dev Allows for the automated payment of tokens from the CureDAO multisig, using approve() + transferFrom() pattern

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 

contract PaymentTerminal {

  IERC20 private demoToken;
  address public treasury;

  constructor(IERC20 _token, address _treasury) payable {
    demoToken = _token;
    treasury = _treasury;
  }

  /// @notice Makes demoToken payments from the CureDAO MultiSig
  /// @dev Calls transferFrom on demoToken
  /// @param to:address Address where tokens must be transferred to
  /// @param amount:uint256 Amount of tokens to be transferred
  /// @return bool Indicates if the function executed successfully
  function payment(address payable to, uint256 amount) public returns(bool) {
    require(demoToken.transferFrom(treasury, to, amount), "Payment was unsuccessful");
    return true;
  }

  /// @notice Returns the PaymentTerminal's allowance
  /// @dev Calls the allowance(address) on the IERC20 interface. 
  /// @return amount:uint256 Spender's allowance
  function terminalAllowance() external view returns(uint256) {
    return demoToken.allowance(treasury, address(this));
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}
