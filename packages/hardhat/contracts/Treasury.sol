//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @custom:security-contact lourens@dao.health
contract Treasury {

    IERC20 internal demoToken;

    function setToken(IERC20 token) public {
        demoToken = token;
    }

    function approveTerminal(address spender, uint256 amount) public {
        require(demoToken.approve(spender, amount), "Approval Failed");
    }
}