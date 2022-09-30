// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

//@author Lionel
//@title TSSC

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ERC721A.sol";
import "hardhat/console.sol";

error SillyCustom__CantBeZero();
error ContractNotActivated();
error WhitelistSaleNotActivated();
error NotWhitelisted();
error only1NFTOnTheWhitelistSale();
error MaxSupplyExceeded();
error NotEnoughtFunds();
error OGWhitelistSaleNotActivated();
error only2NFTOnTheOGWhitelistSale();
error OGWhitelistSaleActivated();
error WhitelistSaleActivated();
error only5NFTOnThePublicSale();
error ReachedMaxSupply();

contract SillyCustom is Ownable, ERC721A, PaymentSplitter {
    //To concatenate the URL of an NFT
    using Strings for uint256;

    //base URI of the NFTs
    string private baseURI;

    //total number of NFTs available
    uint256 private constant MAX_SUPPLY = 14;
    // amount available for the whitelist sale
    uint256 private constant MAX_WHITELIST = 4;
    // amount available fort The OG whitelist sale
    uint256 private constant MAX_OG_WHITELIST = 8;
    //amount  available for the OG Whitelist  AND for the whitelist
    uint256 private constant MAX_OGWHITELIST_AND_WHITELIST =
        MAX_OG_WHITELIST + MAX_WHITELIST;
    //amount available for the gifts
    uint256 private constant MAX_GIFT = 2;
    //The total number of NFTs minus gift
    uint256 private constant MAX_SUPPLY_MINUS_GIFT = MAX_SUPPLY - MAX_GIFT;

    //The price for the OG Whitelist, the whitelist sale  sale & the public sale
    uint256 public OGWhiteListPrice = 0.0025 ether;
    uint256 public WhiteListPrice = 0.003 ether;
    uint256 public publicSalePrice = 0.006 ether;

    bytes32 public merkleRoot;

    //Is the contract activated ?
    bool public isActive = false;

    //Is the the whitelist activated ?
    bool public isWhitelistSaleActive = false;

    ////Is the the OGwhitelist activated ?
    bool public isOGWhitelistSaleActive = false;

    //Number of NFTs/Wallet OGWhitelist  and Whitelist
    mapping(address => uint256) public amountNFTsPerWalletOGWhitelistSale;
    mapping(address => uint256) public amountNFTsperWalletWhitelistSale;
    mapping(address => uint256) public amountNFTsperWalletPublicSale;

    //Amount of NFTs per Wallet for presale and whitelist sale Mint
    uint256 private constant maxPerAddressDuringOGWhitelistSale = 2;
    uint256 private constant maxPerAddressDuringWhitelistMint = 1;
    uint256 private constant maxPerAddressDuringPublicSaleMint = 5;

    //Number of addresses in the paymentSplitter
    uint256 private teamLength;

    address[] private _team = [
        0xF240A9D087bDa31ec2C334e8245c8152911E72a8,
        0x15294c91d24d2c4949d8193C705de6D65a3d26e3,
        0x2Fa0667Cd6B8d8BcE3fdDEc3425c629EE4a1269A
    ];

    uint256[] private _teamShares = [600, 395, 5];

    constructor(bytes32 _merkleRoot, string memory _baseURI)
        ERC721A("The Silly Custom Collection", "TSCC")
        PaymentSplitter(_team, _teamShares)
    {
        merkleRoot = _merkleRoot;
        baseURI = _baseURI;
        teamLength = _team.length;
    }

    /**
     * @notice the contract can't be called by another smart contract
     */
    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    /**
     *  To start the token ID from 1
     */
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    /**
     * @notice Mint function for the Whitelist Mint
     *
     * @param _account Account which will receive the NFT
     * @param _quantity Amount of NFTs the user wants to mint
     * @param _proof The Merkle Proof
     **/
    function whitelistMint(
        address _account,
        uint256 _quantity,
        bytes32[] calldata _proof
    ) external payable callerIsUser {
        uint256 price = WhiteListPrice;

        if (price == 0) {
            revert SillyCustom__CantBeZero();
        }
        if (!isActive) {
            revert ContractNotActivated();
        }
        if (!isWhitelistSaleActive) {
            revert WhitelistSaleNotActivated();
        }
        if (!isWhiteListed(msg.sender, _proof)) {
            revert NotWhitelisted();
        }
        if (
            amountNFTsperWalletWhitelistSale[msg.sender] + _quantity >
            maxPerAddressDuringWhitelistMint
        ) {
            revert only1NFTOnTheWhitelistSale();
        }
        if (totalSupply() + _quantity > MAX_OGWHITELIST_AND_WHITELIST) {
            revert MaxSupplyExceeded();
        }
        if (msg.value < price * _quantity) {
            revert NotEnoughtFunds();
        }

        amountNFTsperWalletWhitelistSale[msg.sender] += _quantity;
        _safeMint(_account, _quantity);
    }

    /**
     * @notice Mint function for the OG Whitelist Mint
     *
     * @param _account Account which will receive the NFT
     * @param _quantity Amount of NFTs the user wants to mint
     * @param _proof The Merkle Proof
     **/

    function OGWhitelistMint(
        address _account,
        uint256 _quantity,
        bytes32[] calldata _proof
    ) external payable callerIsUser {
        uint256 price = OGWhiteListPrice;

        if (price == 0) {
            revert SillyCustom__CantBeZero();
        }
        if (!isActive) {
            revert ContractNotActivated();
        }
        if (!isOGWhitelistSaleActive) {
            revert OGWhitelistSaleNotActivated();
        }

        if (!isWhiteListed(msg.sender, _proof)) {
            revert NotWhitelisted();
        }

        if (
            amountNFTsPerWalletOGWhitelistSale[msg.sender] + _quantity >
            maxPerAddressDuringOGWhitelistSale
        ) {
            revert only2NFTOnTheOGWhitelistSale();
        }

        if (totalSupply() + _quantity > MAX_OG_WHITELIST) {
            revert MaxSupplyExceeded();
        }

        if (msg.value < price * _quantity) {
            revert NotEnoughtFunds();
        }

        amountNFTsPerWalletOGWhitelistSale[msg.sender] += _quantity;
        _safeMint(_account, _quantity);
    }

    /**
    * @notice Mint function for the Public Sale
    *
    * @param _account Account which will receive the NFT
    * @param _quantity Amount of NFTs the user wants to mint
 
    **/
    function publicSaleMint(address _account, uint256 _quantity)
        external
        payable
        callerIsUser
    {
        uint256 price = publicSalePrice;
        if (price == 0) {
            revert SillyCustom__CantBeZero();
        }

        if (!isActive) {
            revert ContractNotActivated();
        }
        if (isOGWhitelistSaleActive) {
            revert OGWhitelistSaleActivated();
        }

        if (isWhitelistSaleActive) {
            revert WhitelistSaleActivated();
        }

        if (
            amountNFTsperWalletPublicSale[msg.sender] + _quantity >
            maxPerAddressDuringPublicSaleMint
        ) {
            revert only5NFTOnThePublicSale();
        }

        if (totalSupply() + _quantity > MAX_SUPPLY_MINUS_GIFT) {
            revert MaxSupplyExceeded();
        }
        if (msg.value < price * _quantity) {
            revert NotEnoughtFunds();
        }

        amountNFTsperWalletPublicSale[msg.sender] += _quantity;
        _safeMint(_account, _quantity);
    }

    /**
     * @notice Allows the owner to gift NFTs
     *
     * @param _to The address of the receiver
     * @param _quantity Amount of NFTs the owner wants to gift
     **/
    function gift(address _to, uint256 _quantity) external onlyOwner {
      if (!isActive) {
            revert ContractNotActivated();
        }
       if (isOGWhitelistSaleActive) {
            revert OGWhitelistSaleActivated();
        }
          if (isWhitelistSaleActive) {
            revert WhitelistSaleActivated();
        }
         if (totalSupply() + _quantity > MAX_SUPPLY) {
            revert ReachedMaxSupply();
        }
        
        _safeMint(_to, _quantity);
    }

    /**
     * @notice Allows to set the OG whitelist sale price
     * @param  _ogwlSalePrice is the new price of one NFT during the OGWhitelist sale
     */
    function setOGWLSalePrice(uint256 _ogwlSalePrice) external onlyOwner {
        OGWhiteListPrice = _ogwlSalePrice;
    }

    /**
     *
     * @notice Allows to set the whitelist sale price
     * @param  _wlSalePrice is the new price of one NFT during the Whitelist sale
     */
    function setWLSalePrice(uint256 _wlSalePrice) external onlyOwner {
        WhiteListPrice = _wlSalePrice;
    }

    /**
     * @notice Allows to set the public sale price
     */
    function setPublicSalePrice(uint256 _publicSalePrice) external onlyOwner {
        publicSalePrice = _publicSalePrice;
    }

    /*
     * Function setIsActive to activate/desactivate the smart contract
     */
    function setIsActive(bool _isActive) external onlyOwner {
        isActive = _isActive;
    }

    /*
     * Function setOGWhitelistSaleActive to activate/desactivate the OGwhitelist presale
     */
    function setOGWhitelistSaleActive(bool _isActive) external onlyOwner {
        isOGWhitelistSaleActive = _isActive;
    }

    /*
     * Function setWhitelistSaleActive to activate/desactivate the whitelist presale
     */
    function setWhitelistSaleActive(bool _isActive) external onlyOwner {
        isWhitelistSaleActive = _isActive;
    }

    /**
     * @notice Change the base URI of the NFTs
     *
     * @param _baseURI The new base URI of the NFTs
     **/
    function setBaseUri(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    /**
     * @notice Get the token URI of an NFT by his ID
     *
     * @param _tokenId The ID of the NFT you want to have the URI
     **/
    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(_tokenId), "URI query for nonexistent token");

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    //Whitelist

    /**
     * @notice Change the Merkle Root
     *
     * @param _merkleRoot The new Merkle Root
     **/
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    /**
     * @notice Check if an address is whitelisted
     *
     * @param _account The address checked
     * @param _proof The Merkle proof
     *
     * @return bool return true if the address is whitelisted, false otherwise
     **/
    function isWhiteListed(address _account, bytes32[] calldata _proof)
        internal
        view
        returns (bool)
    {
        return _verify(leaf(_account), _proof);
    }

    /**
     * @notice Hash an address
     *
     * @param _account The address to be hashed
     *
     * @return bytes32 The hashed address
     **/
    function leaf(address _account) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_account));
    }

    /**
     * @notice Returns true if a leaf can be proved to be a part of a Merkle tree defined by root
     *
     * @param _leaf The leaf
     * @param _proof The Merkle Proof
     *
     * @return True if a leaf can be provded to be a part of a Merkle tree defined by root
     **/
    function _verify(bytes32 _leaf, bytes32[] memory _proof)
        internal
        view
        returns (bool)
    {
        return MerkleProof.verify(_proof, merkleRoot, _leaf);
    }

    //ReleaseALL

    /**
     * @notice Release the gains on every accounts
     **/
    function releaseAll() external {
        for (uint256 i = 0; i < teamLength; i++) {
            release(payable(payee(i)));
        }
    }

    /**
     * Not allowing receiving ether outside minting functions
     */
    receive() external payable override {
        revert("Only if you mint");
    }
}
