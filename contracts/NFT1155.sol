// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NFT1155 is ERC1155 {
    constructor() ERC1155("My NFT") {
        _mint(msg.sender, 0, 1, "");
        _mint(msg.sender, 1, 2, "");
        _mint(msg.sender, 2, 3, "");
    }
}
