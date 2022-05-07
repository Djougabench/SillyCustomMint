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

const publicSale = (props) => {
  const { account, provider } = useEthersProvider();
  const [isLoading, setIsloading] = useState(false);
  const [mintIsloading, setMintIsLoading] = useState(false);

  const toast = useToast();
  const contractAdress = "0xF3F703D91A909E87D79da828A8D817f1DBfA7fCD";

  const mint = async (quantity) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAdress, Contract.abi, signer);

    let overrides = {
      value: props.BNPublicSalePrice.mul(quantity),
    };
    console.log(props.BNPublicSalePrice.mul(quantity));
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
    <Flex>
      {isLoading ? (
        <Spinner />
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
                    Public sale SOLD OUT
                  </Text>
                </Flex>
              ) : (
                <Flex
                  p="2rem "
                  align="center"
                  direction={["column", "column", "row", "row"]}
                >
                  <Flex
                    width={["100%", "100%", "50%", "50%"]}
                    align="center"
                    direction="column"
                  >
                    <Text
                      fontWeight="bold"
                      fontSize={["2rem", "2rem", "2rem", "3rem"]}
                    >
                      Public sale
                    </Text>
                    <Text fontSize={["1rem", "1rem", "1,5rem", "2rem"]}>
                      <chakra.span fontWeight="bold">NFT SOLD :</chakra.span>
                      <chakra.span fontWeight="bold" color="orange">
                        {props.totalSupply}/14
                      </chakra.span>
                    </Text>

                    <Text fontSize="1.5rem">
                      <chakra.span fontWeight="bold">Price :</chakra.span>
                      <chakra.span color="orange" fontWeight="bold">
                        {props.publicSalePrice} Eth
                      </chakra.span>
                      /NFT
                    </Text>
                    <Flex mt="2rem">
                      <Button colorScheme="orange" onClick={mint}>
                        Buy 1 NFT
                      </Button>
                    </Flex>
                  </Flex>

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
  );
};

export default publicSale;
