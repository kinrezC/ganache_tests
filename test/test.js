const con = artifacts.require('TestContract');
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

contract('TestContract', accounts => {
  it('Should return the address', async () => {
    const { address } = await con.deployed();
    const storedAddr = await web3.eth.getStorageAt(address, 2);

    const deployed = await con.deployed();

    const testKey = web3.utils.soliditySha3(storedAddr.replace('0x', ''), 1);

    const addrBytes = web3.utils.leftPad(storedAddr.replace('0x', ''), '64');
    const numBytes = await deployed.contract.methods
      .getNumInBytes()
      .call()
      .then(res => res.replace('0x', ''));

    const newKey = web3.utils.sha3(addrBytes + numBytes, {
      'encoding': 'hex',
    });

    const getHash = await deployed.contract.methods.getHash().call();
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

    const tx = await web3.eth.sendTransaction({
      from: address,
      data: bytecode,
    });

    console.log(tx);
  });
});

/*
0x1B207
321 | 0x1B207
0x1B207
02 | 0x1B207
addr | 0x1B207
1 | addr | 0x1B207
1 | 1 | addr | 0x1B207
160 | 1 | 1 | addr | 0x1B207
1 | addr | 0x1B207
0 | 1 | addr | 0x1B207
1 | 0 | addr | 0x1B207
0 | 1 | 0 | addr | 0x1B207
0 | addr | 0x1B207  MEM : 0...1
1 | 0 | addr | 0x1B207
32 | 1 | 0 | addr | 0x1B207
0 | addr | 0x1B207 MEM : 0...1<>0...1
64 | 0 | addr | 0x1B207
0 | 64 | addr | 0x1B207
addr | 0x1B207 MEM : 0...64<>0...1


PUSH32 val

*/
