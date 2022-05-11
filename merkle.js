const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const tokensWL = require("./tokensWL.json");

async function main() {
  let tab = [];
  tokensWL.map((token) => {
    tab.push(token.address);
  });
  const leaves = tab.map((address) => keccak256(address));
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const root = tree.getHexRoot();
  const leaf = keccak256("0xF240A9D087bDa31ec2C334e8245c8152911E72a8");
  const proof = tree.getHexProof(leaf);
  console.log("root : " + root);
  console.log("proof : " + proof);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
