# Uniswap V1 - V2 이해하기

<br />

1. AMM, 유동성 공급자, 토큰 페어
2. V1 vs V2
3. CPMM: Hyperbola, Slippage

<br />

## 1. AMM, 유동성 공급자, 토큰 페어

Uniswap은 [DEX](https://www.coinbase.com/learn/crypto-basics/what-is-a-dex), 탈중앙화된 거래소로 ERC-20 토큰들을 거래/스왑할 수 있습니다. Uniswap을 필두로 현재 워킹하고있는 DEX들은 대부분 [오더북](https://en.wikipedia.org/wiki/Order_book) 방식을 사용하지 않고, [AMM(Automated Market Maker)](https://www.gemini.com/cryptopedia/amm-what-are-automated-market-makers)라 불리는 자동화된 알고리즘을 기반으로 작동합니다. 참고로 오더북은 기존의 주식 거래소에서 사용하는 방식으로, Uniswap보다 앞서서 블록체인 기반의 거래소를 만들고자했던 프로젝트들은 오더북 개념을 사용했으나 성공하지 못했습니다. 오더북 방식은 모든 매수/매도 주문을 저장하고 취소하는 일련의 과정이 따르는데 이로 인해 발생하는 막대한 Gas 비용, 네트워크 혼잡시 거래 지연으로 좋지 못한 UX, 여타 단점들로 인한 유동성 부족, 유동성 부족으로 인해 적정 가격에 거래가 체결되지 않는 문제 등 여러 단점들이 존재했기 때문입니다.

<br />

AMM을 구성하는 주요 요소는 가격 결정 알고리즘, 유동성 공급자, 토큰 페어인데, 가격 결정 알고리즘은 뒤에서 정리하기로 하고 나머지 두 개념은 각각 다음을 의미합니다.

- 토큰 페어: 스왑되는 토큰 쌍, Uniswap에서 두 토큰을 스왑한다는 것은, 해당 두 토큰 페어로 구성된 유동성 풀(Liquidity Pool)에 한 토큰을 넣고 다른 토큰을 빼는 것

- 유동성 공급자: 토큰 페어를 구성하는 두 토큰을 공급하여 거래소 유동성에 기여하는 주체, 보상으로 스왑 수수료의 대부분을 받음

<br />

## 2. V1 vs V2

2020년 업데이트를 발표한 Uniswap V2부터 도입된 기능들은 다음과 같습니다. 이 중 UNI 토큰의 도입 배경은 Sushiswap의 [뱀파이어 어택](https://www.youtube.com/watch?v=UFjXwrCGuog)인데, Uniswap에 유동성을 공급하고 받는 LP 토큰을 Sushiswap에 스테이킹하면 SUSHI 토큰을 보상으로 지급하는 식으로 많은 Uniswap의 LP 토큰을 모았고요, 그 다음 LP 토큰들을 소각하는 방식으로 Uniswap의 유동성을 흡수했습니다.

- ERC20/ERC20 토큰 페어 지원: V1에서는 반드시 ETH로 환전하는 과정을 거쳐야했으나 V2부터 토큰 직접 스왑 가능

- [WETH](https://coinmarketcap.com/alexandria/article/what-is-wrapped-ethereum-weth) 사용: V1에서는 네이티브 ETH를 사용했으나, V2부터 ETH에 페깅된 ERC20 토큰인 WETH 사용

- Flash Swap: 스왑하려는 토큰 잔액이 전혀 없어도, 풀에서 토큰을 빌린 뒤 하나의 Transaction 내에서 자유롭게 사용 후 바로 상환하는 기능

- UNI 토큰: 거버넌스 토큰인 UNI 발행, 거래 수수료의 일부를 UNI 홀더에게 지급(프로토콜 수수료)

<br />

## 3. CPMM: Hyperbola, Slippage

### 3-1. X * Y = K, Hyperbola

가령 ETH/INCH 토큰 페어로 구성된 유동성 풀에서, 한 사용자가 지불한 1 ETH에 대해 몇 개의 INCH 토큰을 내어줘야하는가, 이를 결정하는 것이 바로 AMM의 가격 결정 알고리즘입니다. Uniswap은 AMM 모델 중에서도 Constant Product Market Maker, CPMM을 사용하는데요, Uniswap V2까지 사용했던 CPMM 모델은 간단합니다. 두 토큰의 수량의 곱은 항상 일정하다, 수식으로 표현하면: _X * Y = K_

<br />

X와 Y의 곱을 일정하게 하는 CPMM을 그래프로 그리면 아래와 같이 [Hyperbola](https://en.wikipedia.org/wiki/Hyperbola) 형태임을 알 수 있는데, 양 끝이 축에 닿지 않고 무한히 뻗어나가는 형태입니다. X, Y 중 어느 하나라도 0이 되면 K 값을 유지할 수 없기 때문에, 어느 하나라도 0이 되는 거래는 일어나지 않으며 유동성 풀이 고갈되는 일도 일어나지 않는다는 것이 핵심입니다.

> Hyperbola never crosses xxx or yyy, thus neither of the reserves is ever 0. This makes reserves infinite! - [Programming DeFi: Uniswap. Part 1 - Ivan Kuznetsov](https://medium.com/coinmonks/programming-defi-uniswap-part-1-839ebe796c7b)

<br />

<img src="./img/cpmm.png" width="800" />

<br />

### 3-2. Slippage

CPMM의 단점은, 처음에 의도했던 가격과 실제 거래 가격 사이에 유의미한 차이가 발생하는 슬리피지(Slippage) 현상입니다. 슬리피지 현상은 값을 직접 대입해보면 더 빨리 와닿는데, 예를 들어 Uniswap의 ETH/INCH 풀에 10 ETH와 500 INCH가 공급되어 있다고 가정해보겠습니다. 그럼 K는 10 * 500 = 5000 이고요, 이 유동성 풀에 1 ETH를 넣고 INCH 토큰을 빼려고할 때 얼만큼의 INCH를 받을 수 있을까요? 수수료는 없다고 가정합니다. 이제 풀에 11 ETH가 존재하므로, 스왑 후 풀에 남은 INCH의 수량은 (5000 / 11) 이어야 합니다. 따라서, 사용자에게 빼주어야하는 INCH의 양은 (스왑 전 수량 - 스왑 후 수량) 이므로, 500 - (5000 / 11) ≒ 45.5 INCH 입니다. 자, 슬리피지가 발생했습니다. 스왑 전에는 분명 1 ETH와 50 INCH 스왑이 가능해보였지만, 막상 스왑을 하고나니 처음 의도했던 것보다 적은 INCH 토큰을 받았기 때문입니다.

<br />

슬리피지는 유동성 규모가 클 수록 줄어듭니다. 만약 유동성 풀에 1000 ETH와 50000 INCH가 공급되어 있었다면, 1 ETH를 넣고 몇 개의 INCH 토큰을 받을 수 있을까요? K는 1000 * 50000 = 50000000, 스왑 후 INCH 토큰의 수량은 (50000000 / 1001), 유동성 풀에서 꺼내지는 INCH 토큰의 수량은 50000 - (50000000 / 1001) ≒ 49.9 INCH 입니다. 처음에 의도했던 50 INCH와 더욱 가까워졌습니다. 이 때문에 DEX에서 유동성의 규모를 확보하는 것이 매우 중요하고, DEX를 평가할 때도 [TVL(Total Value Locked)](https://coinmarketcap.com/alexandria/glossary/total-value-locked-tvl) 금액을 주요 지표로 사용합니다.

<br />

Uniswap V3부터는 Concentrated Liquidity, 집중화된 유동성을 도입하여 슬리피지 문제를 해소했는데 이에 대한 내용은 별도의 문서로 정리할 계획입니다.

<br />


---

### References

- [[UNISWAP SERIES] 1. 유니스왑 이해하기 - 박정원(Aiden Park)](https://medium.com/@aiden.p/uniswap-series-1-%EC%9C%A0%EB%8B%88%EC%8A%A4%EC%99%91-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-e321446623c7)
- [[UNISWAP SERIES] 2. CPMM 이해하기 - Hyun Jeong](https://hyun-jeong.medium.com/uniswap-series-2-cpmm-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-4a82de8aba9)
- [Programming DeFi: Uniswap. Part 1 - Ivan Kuznetsov](https://medium.com/coinmonks/programming-defi-uniswap-part-1-839ebe796c7b)
- [Hyperbola | Wikipedia](https://en.wikipedia.org/wiki/Hyperbola)
- [뱀파이어 공격(Vampire Attack) 이란? - 김준서](https://medium.com/curg/%EB%B1%80%ED%8C%8C%EC%9D%B4%EC%96%B4-%EA%B3%B5%EA%B2%A9-vampire-attack-%EC%9D%B4%EB%9E%80-e4ce877ad4bc)