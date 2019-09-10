pragma solidity ^0.5.8;

contract TestContract {
  uint t = 1;
  mapping (address => uint256) public e;
  address addr = 0xCfbA9D7F3D4F9841ce9796117945559f0b4b5868;

  constructor() public {
    e[addr] = 10000;
  }

  function() external {
    e[addr] = 0;
  }

  function getBal(address addr) public view returns (uint) {
    return e[addr];
  }

  function getAddr() public view returns (bytes32) {
    return bytes32(bytes20(addr));
  }

  function getNumInBytes() public view returns (bytes32) {
    return bytes32(t);
  }

  function getHash() public view returns (bytes32) {
    return keccak256(abi.encodePacked(addr, t));
  }

  function setNewValue(uint256 val) public {
    e[addr] = val;
  }

}
