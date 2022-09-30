const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
var chai = require("chai");
const { expect } = require("chai");
const tokensOG = require("../tokensOG.json");

describe(" sillycustom contract deployement", () => {
  before(async () => {
    console.log("     Deploy contract");
    console.log("      ✓ End deploy contract");
    [
      this.owner,
      this.addr1,
      this.addr2,
      this.addr3,
      this.addr4,
      ...this.addrs
    ] = await ethers.getSigners();

    let tab = [];
    tokensOG.map((token) => {
      tab.push(token.address);
    });
    const leaves = tab.map((address) => keccak256(address));
    this.tree = new MerkleTree(leaves, keccak256, { sort: true });
    const root = this.tree.getHexRoot();
    this.MerkleTreeRoot = root;
    this.baseURI = "ipfs://xxxxxxxxxx/";
  });

  it("should deploy the smart contract", async () => {
    this.contract = await hre.ethers.getContractFactory("SillyCustom");
    this.deployedContract = await this.contract.deploy(
      this.MerkleTreeRoot,
      this.baseURI
    );
  });

  it("merkleRoot should be defined and have a length of 66", async () => {
    console.log("     merkleRootlength");
    console.log("      ✓ Good MerkleRoot length");
    expect(await this.deployedContract.merkleRoot()).to.have.length(66);
  });

  it("setIsActive Must not be callable by not contract owner", async () => {
    console.log("     contrat activation Ownership");
    console.log("      ✓ Good Ownership");
    await expect(
      this.deployedContract.connect(this.addr2).setIsActive(false)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("setIsActive Must be callable by contract owner and change value of _isActive accordingly", async () => {
    await this.deployedContract.setIsActive(true);
    expect(await this.deployedContract.isActive()).to.equal(true);
  });

  it("it should not be possible to change the BaseURI  if not OWNER", async () => {
    await expect(
      this.deployedContract.connect(this.addr1).setBaseUri(this.baseURI)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  /* it("it should be possible to change the BaseURI  if  OWNER", async () => {
    this.baseURI = "ipfs://xxxxxxxxxx/";
    await this.deployedContract.setBaseUri(this.baseURI);
    expect(await this.deployedContract.baseURI()).to.equal(this.baseURI);
  });

 */

  it("OG whitelist price should be  at  0.0025  Ether", async () => {
    let OGWhiteListPrice = await this.deployedContract.OGWhiteListPrice();
    expect(OGWhiteListPrice).to.equal(ethers.utils.parseEther("0.0025"));
  });

  it("it should not possible to change the OGWhiteList price if not OWNER", async () => {
    let OGWhiteListPrice = 0;
    await expect(
      this.deployedContract
        .connect(this.addr3)
        .setOGWLSalePrice(OGWhiteListPrice)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("it should be possible to change the OGWhiteList price if  OWNER", async () => {
    let OGWhiteListPrice = await this.deployedContract.OGWhiteListPrice();
    expect(await this.deployedContract.setOGWLSalePrice(OGWhiteListPrice));
  });

  it("whitelist price should be  at  0.003  Ether", async () => {
    let WhiteListPrice = await this.deployedContract.WhiteListPrice();
    expect(WhiteListPrice).to.equal(ethers.utils.parseEther("0.003"));
  });

  it("it should not be possible to change the Whitelist price if not OWNER", async () => {
    let WhiteListPrice = 0;
    await expect(
      this.deployedContract.connect(this.addr1).setWLSalePrice(WhiteListPrice)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("it should be possible to change the WhiteList price if  OWNER", async () => {
    let WhiteListPrice = await this.deployedContract.WhiteListPrice();
    expect(await this.deployedContract.setWLSalePrice(WhiteListPrice));
  });

  it("Public Sale Price  should be  at  0.006  Ether", async () => {
    let publicSalePrice = await this.deployedContract.publicSalePrice();
    expect(publicSalePrice).to.equal(ethers.utils.parseEther("0.006"));
  });

  it("it should not possible to change the Public Sale Price if not OWNER", async () => {
    let publicSalePrice = 0;
    await expect(
      this.deployedContract
        .connect(this.addr1)
        .setPublicSalePrice(publicSalePrice)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("it should be possible to change the Public Sale price if  OWNER", async () => {
    let publicSalePrice = await this.deployedContract.publicSalePrice();
    expect(await this.deployedContract.setPublicSalePrice(publicSalePrice));
  });

  it(" setOGWhitelistSaleActive Must not be callable by not contract owner", async () => {
    await expect(
      this.deployedContract.connect(this.addr2).setOGWhitelistSaleActive(true)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("setOGWhitelistSaleActive Must be callable by contract owner and change value of _isActive accordingly", async () => {
    await this.deployedContract.setOGWhitelistSaleActive(true);
    expect(await this.deployedContract.isOGWhitelistSaleActive()).to.equal(
      true
    );
  });

  it("Should mint 2 NFTs from the OG whitelist sale if the user is OG Whitelisted ", async () => {
    const leaf = keccak256(this.addr1.address);
    const proof = this.tree.getHexProof(leaf);

    let OGWhiteListPrice = await this.deployedContract.OGWhiteListPrice();
    OGWhiteListPrice = OGWhiteListPrice.mul(2);

    const overrides = {
      value: OGWhiteListPrice,
    };

    await this.deployedContract
      .connect(this.addr1)
      .OGWhitelistMint(this.addr1.address, 2, proof, overrides);
  });

  it(" setWhitelistSaleActive Must not be callable by not contract owner", async () => {
    await expect(
      this.deployedContract.connect(this.addr2).setWhitelistSaleActive(true)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("setWhitelistSaleActive Must be callable by contract owner and change value of _isActive accordingly", async () => {
    await this.deployedContract.setWhitelistSaleActive(true);
    expect(await this.deployedContract.isWhitelistSaleActive()).to.equal(true);
  });

  it("Should mint 1 NFT from the whitelist sale if the user is  Whitelisted ", async () => {
    const leaf = keccak256(this.addr2.address);
    const proof = this.tree.getHexProof(leaf);

    let whiteListPrice = await this.deployedContract.WhiteListPrice();

    const overrides = {
      value: whiteListPrice,
    };

    await this.deployedContract
      .connect(this.addr2)
      .whitelistMint(this.addr2.address, 1, proof, overrides);
  });

  it("Should not mint 1 NFT from the whitelist sale if the user is not  Whitelisted ", async () => {
    const leaf = keccak256(this.addr4.address);
    const proof = this.tree.getHexProof(leaf);

    let whiteListPrice = await this.deployedContract.WhiteListPrice();

    const overrides = {
      value: whiteListPrice,
    };

    await expect(
      this.deployedContract
        .connect(this.addr3)
        .whitelistMint(this.addr3.address, 1, proof, overrides)
    ).to.be.revertedWith("NotWhitelisted");
  });

  it("Should mint 5 NFT from the public  sale  ", async () => {
    await this.deployedContract.setOGWhitelistSaleActive(false);
    await this.deployedContract.setWhitelistSaleActive(false);

    let publicSalePrice = await this.deployedContract.publicSalePrice();

    publicSalePrice = publicSalePrice.mul(5);

    const overrides = {
      value: publicSalePrice,
    };

    await this.deployedContract
      .connect(this.addr3)
      .publicSaleMint(this.addr3.address, 5, overrides);
  });

  it("should get the  total supply and the total supply should be equal to 5 ", async () => {
    expect(await this.deployedContract.totalSupply()).to.equal(8);
  });

  it("public  sale mint Should revert if OGWhiteListSale  and  WhitelistSale is activated  ", async () => {
    await this.deployedContract.setOGWhitelistSaleActive(true);
    await this.deployedContract.setWhitelistSaleActive(true);

    let publicSalePrice = await this.deployedContract.publicSalePrice();

    publicSalePrice = publicSalePrice.mul(5);

    const overrides = {
      value: publicSalePrice,
    };

    await expect(
      this.deployedContract
        .connect(this.addr3)
        .publicSaleMint(this.addr3.address, 5, overrides)
    ).to.be.revertedWith("OGWhitelistSaleActivated");
  });
});
