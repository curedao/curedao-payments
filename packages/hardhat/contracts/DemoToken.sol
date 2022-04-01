// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @custom:security-contact lourens@dao.health
contract DemoToken is ERC20 {
    constructor(address payable treasury) ERC20("DemoToken", "DEMO") {
        _mint(treasury, 100000 * 10 ** decimals());
    }
}