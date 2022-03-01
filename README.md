# Yuniswap

Clone contracts of Uniswap to understand how DEX works

<br />

## 1. What I Learned

- [Uniswap V1 - V2 이해하기](./docs/uniswap.md)

<br />

## 2. Install

### Install Solidity compiler

```zsh
brew tap ethereum/ethereum
brew install solidity
```

```zsh
# Try solc command (solc is solidity compiler)
solc --verison
```

<br />

### Install packages

```zsh
# npm install -g yarn (if needed)
yarn install
```

<br />

## 3. Setup environment variables

Copy and paste your private key for Ethereum address into `.env` file. Don't forget prefix it with `0x`!

```.env
PRIVATE_KEY=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1
```

<br />


---

### References

- [Uniswap V2](https://app.uniswap.org/#/swap?chain=mainnet)
- [Welcome to the Uniswap Docs](https://docs.uniswap.org/)
- [Uniswap Whitepaper](https://hackmd.io/@HaydenAdams/HJ9jLsfTz)
- [Uniswap/v1-contracts (archive)](https://github.com/Uniswap/v1-contracts/tree/master/contracts)
- [Programming DeFi: Uniswap. Part 1 - Ivan Kuznetsov](https://medium.com/coinmonks/programming-defi-uniswap-part-1-839ebe796c7b)
- [Programming DeFi: Uniswap - Part 2 - Ivan Kuznetsov](https://medium.com/coinmonks/programming-defi-uniswap-part-2-13a6428bf892)
- [Programming DeFi: Uniswap. Part 3 - Ivan Kuznetsov](https://medium.com/coinmonks/programming-defi-uniswap-part-3-791005c6238e)
- [[Defi] Uniswap V2 Architecture 분석](https://boohyunsik.tistory.com/10)
- [[UNISWAP SERIES] 1. 유니스왑 이해하기 - 박정원(Aiden Park)](https://medium.com/@aiden.p/uniswap-series-1-%EC%9C%A0%EB%8B%88%EC%8A%A4%EC%99%91-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-e321446623c7)
- [[UNISWAP SERIES] 2. CPMM 이해하기 - Hyun Jeong](https://hyun-jeong.medium.com/uniswap-series-2-cpmm-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-4a82de8aba9)