import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
import { ethers } from "hardhat"

const toWei = (value: number) => ethers.utils.parseEther(value.toString())
const fromWei = (value: number | string) =>
	ethers.utils.formatEther(typeof value === "string" ? value : value.toString())
const getBalance = ethers.provider.getBalance

describe("Exchange", function () {
	let owner: SignerWithAddress
	let user: SignerWithAddress
	let tokenContract: Contract
	let exchangeContract: Contract

	beforeEach(async () => {
		;[owner, user] = await ethers.getSigners()

		// Token contract deployed
		const tokenFactory = await ethers.getContractFactory("Token")
		tokenContract = await tokenFactory.deploy("Token", "TKN", toWei(1000000))
		await tokenContract.deployed()

		// Exchange contract deployed
		const exchangeFactory = await ethers.getContractFactory("Exchange")
		exchangeContract = await exchangeFactory.deploy(tokenContract.address)
		await exchangeContract.deployed()
	})

	it("Is Exchange deployed", async () => {
		expect(await exchangeContract.deployed()).to.equal(exchangeContract)
	})

	describe("addLiquidity", async () => {
		it("adds liquidity for both ETH and the token", async () => {
			// approve Exchange contract send 200 tokens
			await tokenContract.approve(exchangeContract.addres, toWei(200))
			// transfer 200 tokens, 100 ethers to Exchange
			await exchangeContract.addLiquidity(toWei(200), { value: toWei(100) })

			// check if Exchange has a balance of 100 ethers
			expect(await getBalance(exchangeContract.address)).to.equal(toWei(100))
			// check if Exchange reserves 200 tokens
			expect(await exchangeContract.getReserve()).to.equal(toWei(200))
		})
	})

	describe("getPrice", async () => {
		it("returns correct pricing", async () => {
			// add liquidity
			await tokenContract.approve(exchangeContract.addres, toWei(200))
			await exchangeContract.addLiquidity(toWei(200), { value: toWei(100) })

			const tokenReserves = await exchangeContract.getReserve()
			const etherReserves = await getBalance(exchangeContract.address)

			// ETH per token
			expect(
				await exchangeContract.getPrice(etherReserves, tokenReserves)
			).to.eq(500)

			// token per ETH
			expect(
				await exchangeContract.getPrice(tokenReserves, etherReserves)
			).to.eq(2000)
		})
	})

	describe("getSwapedTokenAmount", async () => {
		it("returns correct token swap amount", async () => {
			// add liquidity
			await tokenContract.approve(exchangeContract.addres, toWei(2000))
			await exchangeContract.addLiquidity(toWei(2000), { value: toWei(1000) })

			// try swap from eth to the token
			let tokensOut = await exchangeContract.getSwapedTokenAmount(toWei(1))
			expect(fromWei(tokensOut)).to.equal("1.998001998001998001") // slippage !

			tokensOut = await exchangeContract.getTokenAmount(toWei(100))
			expect(fromWei(tokensOut)).to.equal("181.818181818181818181")

			// when we’re trying to drain the pool, we’re getting only a half of what we’d expect
			tokensOut = await exchangeContract.getTokenAmount(toWei(1000))
			expect(fromWei(tokensOut)).to.equal("1000.0") // slippage got doubled !!!
		})
	})

	describe("getSwapedEthAmount", async () => {
		it("returns correct eth swap amount", async () => {
			// add liquidity
			await tokenContract.approve(exchangeContract.addres, toWei(2000))
			await exchangeContract.addLiquidity(toWei(2000), { value: toWei(1000) })

			// try swap from the token to eth
			let ethersOut = await exchangeContract.getSwapedEthAmount(toWei(2))
			expect(fromWei(ethersOut)).to.equal("0.999000999000999") // slippage !

			ethersOut = await exchangeContract.getEthAmount(toWei(100))
			expect(fromWei(ethersOut)).to.equal("47.619047619047619047")

			// when we’re trying to drain the pool, we’re getting only a half of what we’d expect
			ethersOut = await exchangeContract.getEthAmount(toWei(2000))
			expect(fromWei(ethersOut)).to.equal("500.0") // slippage got doubled !!!
		})
	})
})
