const { network, run, ethers } = require('hardhat');
const { keccak256, bufferToHex } = require('ethereumjs-util');
const { utils } = require('ethers');

async function main() {
	const [deployer] = await ethers.getSigners();
	console.log('Deploying onto network:', network.name);
	console.log('Deploying the contracts with the account:', await deployer.getAddress());
	console.log('Account balance:', (await deployer.getBalance()).toString());

	const nftDisperseFactory = await ethers.getContractFactory('NFTDisperse');
	const nftDisperseContract = await nftDisperseFactory.deploy();
	await nftDisperseContract.deployed();

	console.log('NFTDisperse address:', nftDisperseContract.address);

	console.log('Verifying on etherscan...');
	if (network.name != 'hardhat') {
		await run('verify', {
			address: nftDisperseContract.address,
			constructorArgParams: [],
		});
		console.log('Verified :D');
	}

	// We also save the contract's artifacts and address in the frontend directory
	const deploymentInfo = {
		network: network.name,
		'NFTDisperse Contract Address': nftDisperseContract.address,
	};
	fs.writeFileSync(`deployments/script-${network.name}.json`, JSON.stringify(deploymentInfo));

	console.log(`Latest contract address written to: deployments/script=${network.name}.json`);
}

// function saveFrontendFiles(token) {
//   const fs = require("fs");
//   const contractsDir = __dirname + "/../frontend/src/contracts";

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   fs.writeFileSync(
//     contractsDir + "/contract-address.json",
//     JSON.stringify({ Token: token.address }, undefined, 2)
//   );

//   const TokenArtifact = artifacts.readArtifactSync("Token");

//   fs.writeFileSync(
//     contractsDir + "/Token.json",
//     JSON.stringify(TokenArtifact, null, 2)
//   );
// }

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
