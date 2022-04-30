const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const tokens = require("../tokens.json");

async function main() {
  let tab = [];
  tokens.map((token) => {
    tab.push(token.address);
  });
  const leaves = tab.map((address) => keccak256(address));
  tree = new MerkleTree(leaves, keccak256, { sort: true });
  const root = tree.getHexRoot();
  baseURI = "ipfs://QmSsdTewBoTm6KZ1g1pfVNgLvc698UYmq52UJJsdvm4cfV/";

  const Contract = await hre.ethers.getContractFactory("SillyCustom");
  const contract = await Contract.deploy(root, baseURI);

  await contract.deployed();

  console.log(
    "contract deployed to:",
    contract.address + " - root " + root + "baseURI" + baseURI
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
