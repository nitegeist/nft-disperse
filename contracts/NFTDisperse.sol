// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

interface IERC1155 {
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;
}

contract NFTDisperse {
    constructor() {}

    function batchAirdropERC721(
        IERC721 _token,
        address[] calldata _to,
        uint256[] calldata _tokenIds
    ) external {
        require(
            _to.length == _tokenIds.length,
            "Receivers and IDs are different lengths"
        );
        for (uint256 i = 0; i < _to.length; i++) {
            _token.safeTransferFrom(msg.sender, _to[i], _tokenIds[i]);
        }
    }

    function batchAirdropERC1155(
        IERC1155 _token,
        address[] calldata _to,
        uint256[] calldata _tokenIds,
        uint256[] calldata _amount
    ) external {
        require(
            _to.length == _tokenIds.length,
            "Receivers and IDs are different lengths"
        );
        for (uint256 i = 0; i < _to.length; i++) {
            _token.safeTransferFrom(
                msg.sender,
                _to[i],
                _tokenIds[i],
                _amount[i],
                ""
            );
        }
    }
}
