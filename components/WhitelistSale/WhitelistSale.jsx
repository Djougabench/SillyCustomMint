import React, { useEffect, useState } from "react";
import {
  Image,
  Button,
  Flex,
  Spinner,
  useToast,
  chakra,
  Text,
  Badge,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import useEthersProvider from "../../hooks/useEthersProvider";
import { ethers } from "ethers";
import Contract from "../../artifacts/contracts/SillyCustom.sol/SillyCustom.json";
import tokensWL from "../../tokensWL.json";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const WhitelistSale = (props) => {
  const { account, provider } = useEthersProvider();
  const [isLoading, setIsloading] = useState(false);
  const [mintIsloading, setMintIsLoading] = useState(false);
  const [isWhitelistSaleActive, setIsWhitelistSaleActive] = useState(false);
  const [isOGWhitelistSaleActive, setIsOGWhitelistSaleActive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState("1");

  const toast = useToast();
  const contractAdress = "0xbc45F73212c9e4d20B75064cB0c762da8bcf952d";

  const mint = async (quantity) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAdress, Contract.abi, signer);

    let tab = [];
    tokensWL.map((token) => {
      tab.push(token.address);
    });
    let leaves = tab.map((address) => keccak256(address));
    let tree = new MerkleTree(leaves, keccak256, { sort: true });
    let leaf = keccak256(account);
    let proof = tree.getHexProof(leaf);
    let overrides = {
      value: props.BNWlSalePrice.mul(quantity),
    };

    setIsActive(isActive);
    setIsWhitelistSaleActive(isWhitelistSaleActive);
    setIsOGWhitelistSaleActive(isOGWhitelistSaleActive);

    try {
      let transaction = await contract.whitelistMint(
        account,
        quantity,
        proof,
        overrides
      );

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
    <Flex
      className="sneak"
      pt={["1rem", "2rem", "3rem", "5rem"]}
      pb={["2rem", "4rem", "6rem", "10rem"]}
      px={["1.7rem", "5rem", "6rem", "15rem"]}
      mx={["2rem", "2rem", "2rem", "4rem"]}
      color="white"
      borderRadius="30"
      boxShadow="dark-lg"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex>
          {!isWhitelistSaleActive && isActive ? (
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
                      p="2rem "
                      align="center"
                      direction={["column", "column", "row", "row"]}
                    >
                      <Flex align="center" direction="column">
                        <Badge
                          variant="outline"
                          colorScheme="yellow"
                          fontWeight="bold"
                          fontSize={["1rem", "1rem", "1,5rem", "2rem"]}
                          mb="6rem"
                          px="0.7rem"
                        >
                          WHITELIST SALE
                        </Badge>
                        <Text
                          fontSize={["1.2rem", "1.4rem", "1.4rem", "1.8rem"]}
                        >
                          <chakra.span fontWeight="bold">
                            NFT SOLD :{" "}
                          </chakra.span>
                          <chakra.span fontWeight="bold" color="cyan">
                            {props.totalSupply} / 14
                          </chakra.span>
                        </Text>

                        <Flex fontSize={["1rem", "1rem", "1.2rem", "1.5rem"]}>
                          <Text mx="0.5rem" fontWeight="bold">
                            PRICE :{" "}
                          </Text>
                          <Text color="cyan" fontWeight="bold">
                            {props.wlSalePrice} Eth
                          </Text>
                          <Text mx="0.5rem"> / NFT</Text>
                        </Flex>
                        <Flex>
                          <Text>+ Gas fees</Text>
                        </Flex>
                        <Flex mt="3rem">
                          <Text
                            fontWeight="bold"
                            fontSize={["1rem", "1rem", "1.2rem", "1.5rem"]}
                          >
                            QUANTITY :
                          </Text>
                        </Flex>
                        <Flex mt="0.7rem">
                          <RadioGroup onChange={setValue} value={value}>
                            <Stack direction="row">
                              <Radio size="lg" value="1">
                                1
                              </Radio>
                            </Stack>
                          </RadioGroup>
                        </Flex>
                        <Button
                          variant="outline"
                          bg="orange"
                          color="black"
                          onClick={() => mint(1)}
                          mt="3rem"
                          mx="1rem"
                          size="lg"
                          height="60px"
                          width="200px"
                          border="2px"
                          rounded={50}
                        >
                          MINT
                        </Button>
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
