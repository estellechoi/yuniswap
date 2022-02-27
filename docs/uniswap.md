# Uniswap 이해하기

<br />

## 1. AMM

Uniswap은 DEX, 탈중앙화된 거래소로, ERC-20 토큰들을 거래하거나 스왑할 수 있습니다. Uniswap을 필두로 현재 워킹하고있는 DEX들은 대부분 [오더북]()이 아닌 자동화된 알고리즘 기반으로 작동하는데, AMM(Automated Market Maker)가 바로 그 알고리즘입니다. 참고로 오더북은 기존의 주식 거래소에서 사용하는 방식으로 Uniswap보다 앞서서 블록체인 기반의 거래소를 만들고자했던 프로젝트들 역시 오더북 개념을 그대로 사용했었죠. 

AMM을 구성하는 주요 요소는 가격 결정 알고리즘, 유동성 공급자, 토큰 페어입니다. Uniswap은 AMM 모델 중에서도 CPMM(Constant Product Market Maker)을 사용하고요.

- 유동성 공급자: 토큰 페어를 구성하는 두 토큰을 공급하여 거래소 유동성에 기여하는 주체. 보상으로 스왑 수수료 중 일부를 받음.

- 토큰 페어: 스왑되는 토큰 쌍, Uniswap에서 두 토큰을 스왑한다는 것은, 해당 두 토큰 페어로 구성된 유동성 풀(Liquidity Pool)을 통해 거래하는 것

<br />

---

### References

- [[UNISWAP SERIES] 1. 유니스왑 이해하기 - 박정원(Aiden Park)](https://medium.com/@aiden.p/uniswap-series-1-%EC%9C%A0%EB%8B%88%EC%8A%A4%EC%99%91-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-e321446623c7)
- [[UNISWAP SERIES] 2. CPMM 이해하기 - Hyun Jeong](https://hyun-jeong.medium.com/uniswap-series-2-cpmm-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-4a82de8aba9)