import React, { useState, useEffect } from "react";
import { Flex, Button, Spinner, Text, useToast } from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";
import useEthersProvider from "../hooks/useEthersProvider";
import Contract from "../artifacts/contracts/SillyCustom.sol/SillyCustom.json";
import Before from "../components/Before/Before";
import WhiteListSale from "../components/WhitelistSale/WhitelistSale";
import OGWhiteListSale from "../components/OGWhitelistSale/OGWhitelistSale";
import PublicSale from "../components/PublicSale/PublicSale";
import SoldOut from "../components/SoldOut/SoldOut";
import { ethers } from "ethers";

export default function Home() {
  const { account, provider } = useEthersProvider();
  const [isLoading, setIsloading] = useState(false);

  //isWhitelistSaleActive
  const [isWhitelistSaleActive, setIsWhitelistSaleActive] = useState(false);

  //isOGWhitelistSaleActive
  const [isOGWhitelistSaleActive, setIsOGWhitelistSaleActive] = useState(false);

  //WhitelistSale price
  const [BNWlSalePrice, setBNWlSalePrice] = useState(null);
  const [wlSalePrice, setWlSalePrice] = useState(null);

  //OGWhiteListSale price
  const [BNOGWlSalePrice, setBNOGWlSalePrice] = useState(null);
  const [OGWlSalePrice, setOGWlSalePrice] = useState(null);

  //publicSale price
  const [BNPublicSalePrice, setBNPubliclSalePrice] = useState(null);
  const [publicSalePrice, setpublicSalePrice] = useState(null);

  //Total supply
  const [totalSupply, setTotalSupply] = useState(null);

  const toast = useToast();
  const contractAdress = "0xa2931e93d4ec895bd241f7ecc4a72d0ca8e468ed";

  useEffect(() => {
    if (account) {
      getDatas();
    }
  }, [account]);

  const getDatas = async () => {
    setIsloading(true);
    const contract = new ethers.Contract(
      contractAdress,
      Contract.abi,
      provider
    );

    let isWhitelistSaleActive = await contract.isWhitelistSaleActive();
    console.log("isWhitelistSaleActive :", isWhitelistSaleActive);

    let isOGWhitelistSaleActive = await contract.isOGWhitelistSaleActive();
    console.log("isOGWhitelistSaleActive :", isOGWhitelistSaleActive);

    let OGWhiteListPrice = await contract.OGWhiteListPrice();
    let OGWhiteListPriceBN = ethers.BigNumber.from(OGWhiteListPrice._hex);
    OGWhiteListPrice = ethers.utils.formatEther(OGWhiteListPriceBN);

    console.log("OGWhiteListPrice :", OGWhiteListPrice);

    let WhiteListPrice = await contract.WhiteListPrice();
    let WhiteListPriceBN = ethers.BigNumber.from(WhiteListPrice._hex);
    WhiteListPrice = ethers.utils.formatEther(WhiteListPriceBN);

    console.log("WhiteListPrice :", WhiteListPrice);

    let publicSalePrice = await contract.publicSalePrice();
    let publicSalePriceBN = ethers.BigNumber.from(publicSalePrice._hex);
    publicSalePrice = ethers.utils.formatEther(publicSalePriceBN);

    console.log("publicSalePrice :", publicSalePrice);

    let totalSupply = await contract.totalSupply();
    totalSupply = totalSupply.toString();

    setIsWhitelistSaleActive(isWhitelistSaleActive);
    setIsOGWhitelistSaleActive(isOGWhitelistSaleActive);

    setWlSalePrice(WhiteListPrice);
    setBNWlSalePrice(WhiteListPriceBN);
    setOGWlSalePrice(OGWhiteListPrice);
    setBNOGWlSalePrice(OGWhiteListPriceBN);
    setpublicSalePrice(publicSalePrice);
    setBNPubliclSalePrice(publicSalePriceBN);
    setTotalSupply(totalSupply);
    setIsloading(false);
  };

  return (
    <Layout>
      <Flex align="center" justify="center">
        {isLoading ? (
          <Spinner />
        ) : account ? (
          () => {
            switch (isWhitelistSaleActive) {
              case null:
                return <Spinner />;
              case false:
                return (
                  <OGWhiteListSale
                    BNOGWlSalePrice={BNOGWlSalePrice}
                    OGWlSalePrice={OGWlSalePrice}
                    totalSupply={totalSupply}
                    getDatas={getDatas}
                  />
                );
              case true:
                return (
                  <isWhitelistSaleActive
                    BNWlSalePrice={BNWlSalePrice}
                    wlSalePrice={wlSalePrice}
                    totalSupply={totalSupply}
                    getDatas={getDatas}
                  />
                );

              default:
                return <Flex>Return your wallet</Flex>;
            }
          }
        ) : (
          <Text fontSize={30}>Please connect your wallet</Text>
        )}
      </Flex>
    </Layout>
  );
}
