import React, { useEffect, useState } from "react";
import {
  Image,
  Button,
  Flex,
  Spinner,
  useToast,
  chakra,
  Text,
} from "@chakra-ui/react";
import useEthersProvider from "../../hooks/useEthersProvider";
import { ethers } from "ethers";
import Contract from "../../artifacts/contracts/SillyCustom.sol/SillyCustom.json";
import tokens from "../../tokens.json";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const WhitelistSale = (props) => {
  const { account, provider } = useEthersProvider();
  const [isLoading, setIsloading] = useState(false);
  const [mintIsloading, setMintIsLoading] = useState(false);
  const [isWhitelistSaleActive, setIsWhitelistSaleActive] = useState(false);
  const [isOGWhitelistSaleActive, setIsOGWhitelistSaleActive] = useState(false);

  const toast = useToast();
  const contractAdress = "0xa2931e93d4ec895bd241f7ecc4a72d0ca8e468ed";

  const mint = async () => {
    const signer = provider.getsigner();
    const contract = new ethers.Contract(contractAdress, Contract.abi, signer);

    let tab = [];
    tokens.map((token) => {
      tab.push(token.address);
    });
    const leaves = tab.map((address) => keccak256(address));
    let tree = new MerkleTree(leaves, keccak256, { sort: true });
    let leaf = keccak256(account);
    let proof = tree.getHexProof(leaf);
    let overrides = {
      value: props.BNWlSalePrice,
    };
    try {
      let transaction = await contract.whitelistMint(
        account,
        1,
        proof,
        overrides
      );

      setIsWhitelistSaleActive(isWhitelistSaleActive);
      setIsOGWhitelistSaleActive(isOGWhitelistSaleActive);

      setMintIsLoading(true);
      await transaction.wait();
      setMintIsLoading(false);
      toast({
        description: "congratulation you have minted your NFT!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      props.getDatas();
    } catch {
      toast({
        description: "oops an error occured!",
        status: "error",
      });
    }
  };

  return (
    <Flex>
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex>
          {isWhitelistSaleActive ? (
            <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>
              Whitelist Sale finished
            </Text>
          ) : (
            <Flex>
              {mintIsloading ? (
                <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>
                  <Spinner /> Processing mint ...
                </Text>
              ) : (
                <Flex>
                  {props.totalSupply >= 14 ? (
                    <Flex>
                      <Text fontSize={["1.5rem", "1.5rem", "2rem", "3rem"]}>
                        Whitelist sale SOLD OUT
                      </Text>
                    </Flex>
                  ) : (
                    <Flex
                      P="2rem "
                      align="center"
                      direction={["column", "column", "row", "row"]}
                    >
                      <Flex
                        width={["100%", "100%", "50%", "50%"]}
                        align="center"
                        direction="column"
                      ></Flex>

                      <Text
                        fontWeight="bold"
                        fontSize={["2rem", "2rem", "3rem", "4rem"]}
                      >
                        Whitelist Sale
                      </Text>
                      <Text fontSize={["1,5rem", "1,5rem", "2rem", "3rem"]}>
                        <chakra.span fontWeight="bold">
                          NFTs SOLD :{" "}
                        </chakra.span>
                        <chakra.span fontWeight="bold" color="orange">
                          {props.totalSupply}/14
                        </chakra.span>
                      </Text>
                      <Flex
                        width={["100%", "100%", "50%", "50%"]}
                        justify="center"
                        aline="center"
                        p={["2rem", "2rem", "0", "0"]}
                      >
                        <Image src="/silly.jpg" width="60%" />
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default WhitelistSale;

{
  /*<Flex
                      width={["100%", "100%", "50%", "50%"]}
                      justify="center"
                      aline="center"
                      p={["2rem", "2rem", "0", "0"]}
                    >
                      <Image src="/silly.jpg" width="60%" />
                    </Flex>*/
}
