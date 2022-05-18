const { expect } = require('chai');

describe('NFT Disperse', function () {
	let nft721Factory, nft721Contract, nft1155Factory, nft1155Contract, nftDisperseContract, nftDisperseFactory;
	let receivers;

	beforeEach(async function () {
		nft721Factory = await hre.ethers.getContractFactory('NFT721');
		nft1155Factory = await hre.ethers.getContractFactory('NFT1155');
		nftDisperseFactory = await hre.ethers.getContractFactory('NFTDisperse');
		[...receivers] = await ethers.getSigners();
		nftDisperseContract = await nftDisperseFactory.deploy();
		nft721Contract = await nft721Factory.deploy();
		nft1155Contract = await nft1155Factory.deploy();
		await nft721Contract.deployed();
		await nft1155Contract.deployed();
		await nftDisperseContract.deployed();
		await nft721Contract.setApprovalForAll(nftDisperseContract.address, true);
		await nft1155Contract.setApprovalForAll(nftDisperseContract.address, true);
	});

	it('Should disperse ERC721 nfts', async function () {
		const nft721 = nft721Contract.address;
		const recipients = receivers.slice(0, 3).map((r) => r.address);
		const ids = [0, 1, 2];
		await nftDisperseContract.batchAirdropERC721(nft721, recipients, ids);
		for (let i = 0; i < recipients.length; i++) {
			expect(await nft721Contract.ownerOf(i)).to.equal(recipients[i]);
		}
	});

	it('Should disperse ERC1155 nfts', async function () {
		const nft1155 = nft1155Contract.address;
		const recipients = receivers.slice(0, 3).map((r) => r.address);
		const ids = [0, 1, 2];
		const amount = [1, 2, 3];
		await nftDisperseContract.batchAirdropERC1155(nft1155, recipients, ids, amount);
		for (let i = 0; i < recipients.length; i++) {
			expect(await nft1155Contract.balanceOf(recipients[i], ids[i])).to.equal(i + 1);
		}
	});
});
