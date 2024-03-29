import React, { useState } from "react";
import {
  Flex,
  Text,
  Button,
  chakra,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { hasMetamask } from "../../utils/hasMetamask";
import useEthersProvider from "../../hooks/useEthersProvider";
import { ethers } from "ethers";

const Header = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { account, setAccount, provider } = useEthersProvider();
  const toast = useToast();

  const connectWallet = async () => {
    if (!hasMetamask()) {
      toast({
        description: "please install metamask browser extension and retry",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      setIsLoading(true);
      if (provider) {
        let network = await provider.getNetwork();
        if (network.chainId !== 1) {
          const resultAccount = await provider.send("eth_requestAccounts", []);
          setAccount(ethers.utils.getAddress(resultAccount[0]));
          setIsLoading(false);
          toast({
            description: "your wallet has been successfully connected!",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else {
          setAccount(null);
          setIsLoading(false);
          toast({
            description: "PLease swich to main Ethereum Network on Metamask",
          });
        }
      }
    }
  };

  return (
    <Flex
      align="center"
      flexDir={["column", "column", "row", "row"]}
      my="md"
      px={["sm", "sm", "lg", "lg"]}
      p="2rem"
    >
      <Text fontSize="2rem" fontWeight={900} letterSpacing={2}></Text>
      <Flex align="center" justify="flex-end" flex={1}>
        {isLoading ? (
          <Spinner />
        ) : account ? (
          <Flex
            flexDir="column"
            align={["center", "center", "flex-end", "flex-end"]}
          >
            <Text fontSize={15}>
              Connected Wallet :
              <chakra.span fontWeight="bold" color="cyan">
                {account.substring(0, 6)}...
                {account.substring(account.length - 4, account.length)}
              </chakra.span>
            </Text>
          </Flex>
        ) : (
          <Button
            variant="outline"
            colorScheme="teal"
            color="cyan"
            onClick={() => connectWallet()}
            size="lg"
            height="60px"
            width="200px"
            border="2px"
          >
            Connect Wallet
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
