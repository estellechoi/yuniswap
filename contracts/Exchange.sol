// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange {

    // tokenAddress as a state variable
    // making it public allows users and developers to read it and to find out what token this exchange is linked to
    address public tokenAddress;

    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid Token Address!");

        tokenAddress = _tokenAddress;
    }

    function addLiquidity(uint _totkenAmt) public payable {
        require(_totkenAmt > 0, "Invalid token amount!");

        // ERC20 token balance is stored in the token Contract if you use IERC20.transferFrom() method
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _totkenAmt);
        // token.approve(address(this), _totkenAmt);

        // what about ethers ? the ratio between ETH and the token is based on the current value of each in $
    }

    function getReserves() public view returns (uint) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    // DEX prices tokens with the ratio between two tokens.
    function getPrice(uint _inputReserve, uint _outputReserve) public pure returns (uint) {
        require(_inputReserve > 0 && _outputReserve > 0, "Invalid reserves!");

        return (_inputReserve * 1000) / _outputReserve; // multiply 1000 to avoid losing value as Solidity floor rounds.
    }

    // see https://medium.com/coinmonks/programming-defi-uniswap-part-1-839ebe796c7b
    // (x + △x) * (y + △y) = x * y = k in CPMM of Uniswap
    // △y = (△x * y) / (x + △x)
    function _getSwapedAmount(uint _inputAmt, uint _inputReserve, uint _outputReserve) private pure returns (uint) {
        require(_inputReserve > 0 && _outputReserve > 0, "Invalid reserves!");

        return (_inputAmt * _outputReserve) / (_inputReserve + _inputAmt);
    }

    function getSwapedTokenAmount(uint _ethSold) public view returns (uint) {
        require(_ethSold > 0, "ETH has not been sold");

        uint tokenReserve = getReserves();
        return _getSwapedAmount(_ethSold, address(this).balance, tokenReserve);
    }

    function getSwapedEthAmount(uint _tokenSold) public view returns (uint) {
        require(_tokenSold > 0, "ETH has not been sold");

        uint tokenReserve = getReserves();
        return _getSwapedAmount(_tokenSold, tokenReserve, address(this).balance);
    }

    // _minTokens is a minimal amount of tokens the user wants to get in exchange for their ethers
    // This amount is calculated in UI and always includes slippage tolerance
    function swapEthTo(uint _minTokens) public payable {
        uint tokenReserve = getReserves();
        uint swappedTokenAmt = _getSwapedAmount(msg.value, address(this).balance - msg.value, tokenReserve);

        require(swappedTokenAmt >= _minTokens, "Insufficient output amount");

        IERC20(tokenAddress).transfer(msg.sender, swappedTokenAmt);
    }

    function swapToEth(uint _tokenSold, uint _minEth) public {
        uint tokenReserve = getReserves();
        uint ethBought = _getSwapedAmount(_tokenSold, tokenReserve, address(this).balance);

        require(ethBought >= _minEth, "Insufficient output amount");

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokenSold);
        payable(msg.sender).transfer(ethBought);
    }
}
