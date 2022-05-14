const { MerkleTree } = require('merkletreejs');
const { expect } = require('chai');
const { ethers, network } = require('hardhat');
const { keccak256, bufferToHex } = require('ethereumjs-util');
const { utils, BigNumber } = require('ethers');
const tokens = require('./tokens.json');

function hashToken(tokenId, account) {
	return bufferToHex(utils.solidityKeccak256(['uint256', 'address'], [tokenId, account]));
}

describe('ERC721 Airdrop', function () {
	const merkleDropTree = {};
	let owner;
	let merkleDropFactory, merkleDropContract;
	let accounts = [];
	let tokenIds = [];

	beforeEach(async function () {
		merkleDropFactory = await hre.ethers.getContractFactory('MerkleDrop');
		[owner] = await ethers.getSigners();
		tokenIds = Object.keys(tokens).map((id) => id);
		accounts = Object.values(tokens).map((address) => address);
		merkleDropTree.leaves = Object.entries(tokens).map((token) => hashToken(...token));
		merkleDropTree.tree = new MerkleTree(merkleDropTree.leaves, keccak256, { sort: true });
		merkleDropTree.root = merkleDropTree.tree.getHexRoot();
		merkleDropContract = await merkleDropFactory.deploy(merkleDropTree.root);
		await merkleDropContract.deployed();
	});

	it('Should create the merkle tree', async function () {
		expect(await merkleDropContract.root()).to.not.be.empty;
	});

	it('Should revert with receivers and IDs are different lengths', async function () {
		const leaf = bufferToHex(utils.solidityKeccak256(['address'], [owner.address]));
		const proof = merkleDropTree.tree.getHexProof(leaf);
		await expect(merkleDropContract.batchMerkleDropERC721([owner.address], tokenIds, proof)).to.be.revertedWith(
			'Receivers and IDs are different lengths'
		);
	});

	it('Should revert with invalid merkle proof ', async function () {
		const leaf = bufferToHex(utils.solidityKeccak256(['address'], [owner.address]));
		const proof = merkleDropTree.tree.getHexProof(leaf);
		console.log(leaf, proof);
		await expect(merkleDropContract.batchMerkleDropERC721([owner.address], [tokenIds[0]], proof)).to.be.revertedWith(
			'Invalid merkle proof'
		);
	});

	it('Should transfer ERC721 NFT to address', async function () {
		const leaf = bufferToHex(utils.solidityKeccak256(['address'], [accounts[0]]));
		const proof = merkleDropTree.tree.getHexProof(leaf);
		console.log(leaf, proof);
		await expect(merkleDropContract.batchMerkleDropERC721([accounts[0]], [tokenIds[0]], proof)).to.not.be.revertedWith(
			'Invalid merkle proof'
		);
	});
});
