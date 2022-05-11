import React, { useEffect, useState } from "react";

import {
  Image,
  Button,
  Flex,
  Spinner,
  useToast,
  chakra,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Badge,
} from "@chakra-ui/react";

import useEthersProvider from "../../hooks/useEthersProvider";
import { ethers } from "ethers";
import Contract from "../../artifacts/contracts/SillyCustom.sol/SillyCustom.json";

const publicSale = (props) => {
  const { account, provider } = useEthersProvider();
  const [isLoading, setIsloading] = useState(false);
  const [mintIsloading, setMintIsLoading] = useState(false);
  const [value, setValue] = useState("1");

  const toast = useToast();
  const contractAdress = "0xbc45F73212c9e4d20B75064cB0c762da8bcf952d";

  const mint = async (quantity) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAdress, Contract.abi, signer);

    let overrides = {
      value: props.BNPublicSalePrice.mul(quantity),
    };

    console.log("BIG NUMBER TEST : ", props.BNPublicSalePrice.mul(quantity));
    try {
      let transaction = await contract.publicSaleMint(
        account,
        quantity,
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
          {mintIsloading ? (
            <Text fontSize={["1.5rem", "1.5rem", "1,5rem", "2rem"]}>
              <Spinner /> Processing mint ...
            </Text>
          ) : (
            <Flex>
              {props.totalSupply >= 20 ? (
                <Flex>
                  <Text fontSize={["1rem", "1rem", "1rem", "1.5rem"]}>
                    Public sale SOLD OUT
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
                      colorScheme="green"
                      fontWeight="bold"
                      fontSize={["1rem", "1rem", "1,5rem", "2rem"]}
                      mb="6rem"
                      px="0.7rem"
                    >
                      PUBLIC SALE
                    </Badge>
                    <Text fontSize={["1.2rem", "1.4rem", "1.4rem", "1.8rem"]}>
                      <chakra.span fontWeight="bold">NFT SOLD : </chakra.span>
                      <chakra.span fontWeight="bold" color="cyan">
                        {props.totalSupply} / 14
                      </chakra.span>
                    </Text>

                    <Flex fontSize={["1rem", "1rem", "1.2rem", "1.5rem"]}>
                      <Text mx="0.5rem" fontWeight="bold">
                        PRICE :{" "}
                      </Text>
                      <Text color="cyan" fontWeight="bold">
                        {props.publicSalePrice} Eth
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
                          <Radio size="lg" value="2">
                            2
                          </Radio>
                          <Radio size="lg" value="3">
                            3
                          </Radio>
                          <Radio size="lg" value="4">
                            4
                          </Radio>
                          <Radio size="lg" value="5">
                            5
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Flex>
                    <Button
                      variant="outline"
                      bg="green"
                      color="black"
                      onClick={() => mint(value)}
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
  );
};

export default publicSale;
