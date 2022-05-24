import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-waffle"
import "@typechain/hardhat"
import * as dotenv from "dotenv"
import "hardhat-gas-reporter"
import { HardhatUserConfig, task } from "hardhat/config"
import "solidity-coverage"

dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const [account] = await hre.ethers.getSigners() // the first account

	console.log("account address", account.address)

	// for (const account of accounts) {
	// 	// 여기서 뭔가를 하는거 같아요 script에서 사용할 수 있게
	// 	console.log(account.address)
	// }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
	// solidity: "0.8.11", // updated
	solidity: {
		version: "0.8.11",
		// solc optimizer options explained here: https://docs.soliditylang.org/en/v0.7.2/using-the-compiler.html#using-the-commandline-compiler
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	defaultNetwork: "rinkeby",
	networks: {
		// ropsten: {
		// 	url: process.env.ROPSTEN_URL || "",
		// 	accounts:
		// 		process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
		// },
		rinkeby: {
			url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env
				.ALCHEMY_API_KEY!}`,
			accounts:
				process.env.PRIVATE_KEY !== undefined
					? [`${process.env.RINKEBY_PRIVATE_KEY!}`]
					: [],
		},
	},
	// gasReporter: {
	// 	enabled: process.env.REPORT_GAS !== undefined,
	// 	currency: "USD",
	// },
	// etherscan: {
	// 	apiKey: process.env.ETHERSCAN_API_KEY,
	// },
}

export default config
