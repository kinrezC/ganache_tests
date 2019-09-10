var con = artifacts.require('TestContract');
const leftPad = require('left-pad');
const parser = require('huff.js/src/parser');

const standardizeInput = input =>
  leftPad(web3.utils.toHex(input).replace('0x', ''), 64, '0');

const getMappingSlot = (mappingSlot, key) => {
  const mappingSlotPadded = standardizeInput(mappingSlot);
  const keyPadded = standardizeInput(key);
  const slot = web3.utils.sha3(keyPadded.concat(mappingSlotPadded), {
    encoding: 'hex',
  });

  return slot;
};

const getMappingStorage = async (address, mappingSlot, key) => {
  const mappingKeySlot = getMappingSlot(mappingSlot.toString(), key);

  console.log('keyslot1', mappingKeySlot);
  const complexStorage = await web3.eth.getStorageAt(address, mappingKeySlot);
  return complexStorage;
};

module.exports = async deployer => {
  deployer.deploy(con).then(async res => {
    const { address } = res;
    console.log(address);
    const storedAddr = await web3.eth.getStorageAt(address, 2);

    const addrBytes = web3.utils.leftPad(storedAddr.replace('0x', ''), '64');
    const numBytes = await res.contract.methods
      .getNumInBytes()
      .call()
      .then(res => res.replace('0x', ''));

    const newKey = web3.utils.sha3(addrBytes + numBytes, {
      'encoding': 'hex',
    });

    const getHash = await res.contract.methods.getHash().call();
    const bn = web3.utils.toBN(newKey);

    const val = await web3.eth.getStorageAt(
      address,
      '0x57e6ec33c3d2f2ebe28483ec48a55a2d24e3ba638ddc652a54c050f9a36ce1b9',
    );
    const parsedFile = parser.parseFile('edit_balance.huff', '.');
    const {
      macros: { EDIT_BAL },
    } = parsedFile;

    const { bytecode } = parser.compileMacro(
      'EDIT_BAL',
      'edit_balance.huff',
      '.',
    );
    console.log(bytecode);

    const accounts = await web3.eth.getAccounts();

    const setBal = await web3.eth.sendTransaction({
      from: accounts[0],
      to: address,
      value: 999999999999999,
    });

    console.log(setBal);

    const tx = await web3.eth.sendTransaction({
      from: address,
      to: address,
      data: bytecode,
    });

    console.log(tx);
  });
};

//0x8107eBd675fB088BD37Ad13EfB206b7269F4f24D

// ganache-cli -m "taste asset knock twin swarm before phrase jump expect call city shallow" -u 0x8107eBd675fB088BD37Ad13EfB206b7269F4f24D
