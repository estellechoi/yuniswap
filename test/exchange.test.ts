import { expect } from "chai";
import { ethers } from "hardhat";

const toWei = (value: number) => ethers.utils.parseEther(value.toString());
const fromWei = (value: number | string) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );

const getBalance = ethers.provider.getBalance;

describe("Exchange", function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let tokenContract: Contract;
  let exchangeContract: Contract;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    // Token contract deployed
    const tokenFactory = await ethers.getContractFactory("Token");
    tokenContract = await tokenFactory.deploy("Token", "TKN", toWei(1000000));
    await tokenContract.deployed();

    // Exchange contract deployed
    const exchangeFactory = await ethers.getContractFactory("Exchange");
    exchangeContract = await exchangeFactory.deploy(tokenContract.address);
    await exchangeContract.deployed();
  });

  it("Is Exchange deployed", async () => {
    expect(await exchangeContract.deployed()).to.equal(exchangeContract);
  });

  describe("addLiquidity", async () => {
    it("should add liquidity for both ETH and the token", async () => {
      // approve Exchange contract send 200 tokens
      await tokenContract.approve(exchangeContract.addres, toWei(200));
      // send 200 tokens, 100 ethers
      await exchangeContract.addLiquidity(toWei(200), { value: toWei(100) });

      // check if Exchange has a balance of 100 ethers
      expect(await getBalance(exchangeContract.address)).to.equal(toWei(100));
      // check if Exchange reserves 200 tokens
      expect(await exchangeContract.getReserve()).to.equal(toWei(200));
    });
  });

  describe("getPrice", async () => {
    it("returns correct pricing", async () => {
      // approve Exchange contract send 200 tokens
      await tokenContract.approve(exchangeContract.addres, toWei(200));
      // transfer 200 tokens, 100 ethers to Exchange
      await exchangeContract.addLiquidity(toWei(200), { value: toWei(100) });

      const tokenReserves = await exchangeContract.getReserve();
      const etherReserves = await getBalance(exchangeContract.address);

      // ETH per token
      expect(
        await exchangeContract.getPrice(etherReserves, tokenReserves)
      ).to.eq(500);

      // token per ETH
      expect(
        await exchangeContract.getPrice(tokenReserves, etherReserves)
      ).to.eq(2000);
    });
  });
});
