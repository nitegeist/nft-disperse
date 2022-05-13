// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract BufficornMerkleDrop is ReentrancyGuard {
    bytes32 public immutable root;
    using MerkleProof for bytes32[];

    constructor(bytes32 merkleroot) {
        root = merkleroot;
    }

    function batchMerkleDropERC721(
        IERC721 _token,
        address[] calldata _to,
        uint256[] calldata _tokenId,
        bytes32[] calldata proof
    ) external nonReentrant {
        require(
            _to.length == _tokenId.length,
            "Receivers and IDs are different length"
        );
        for (uint256 i = 0; i < _to.length; i++) {
            require(
                _verify(_leaf(_to[i], _tokenId[i]), proof),
                "Invalid merkle proof"
            );
            _token.safeTransferFrom(msg.sender, _to[i], _tokenId[i]);
        }
    }

    function batchMerkleDropERC1155(
        IERC1155 _token,
        address[] calldata _to,
        uint256[] calldata _tokenId,
        uint256[] calldata _amount,
        bytes32[] calldata proof
    ) external nonReentrant {
        require(
            _to.length == _tokenId.length,
            "Receivers and IDs are different length"
        );
        for (uint256 i = 0; i < _to.length; i++) {
            require(
                _verify(_leaf(_to[i], _tokenId[i]), proof),
                "Invalid merkle proof"
            );
            _token.safeTransferFrom(
                msg.sender,
                _to[i],
                _tokenId[i],
                _amount[i],
                ""
            );
        }
    }

    function _leaf(address account, uint256 tokenId)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(tokenId, account));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof)
        internal
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }
}
