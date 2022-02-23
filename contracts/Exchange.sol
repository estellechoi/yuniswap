// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange {
    address public tokenAddress; // state variable

    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid Token Address!");
        tokenAddress = _tokenAddress;
    }

    function addLiquidity(uint _totkenAmt) public payable {
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _totkenAmt);
    }

    function getReserves() public view returns (uint) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    // DEX prices tokens with the ratio between two tokens.
    function getPrice(uint _inputReserve, uint _outputReserve) public pure returns (uint) {
        require(_inputReserve > 0 && _outputReserve > 0, "Invalid reserves!");
        return (_inputReserve * 1000) / _outputReserve; // multiply 1000 to avoid losing value as Solidity floor rounds.
    }
}
