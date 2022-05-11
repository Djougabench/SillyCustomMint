import { ChakraProvider } from "@chakra-ui/react";
import { EthersProvider } from "../context/ethersProviderContext";
import "../styles/App.css";

function MyApp({ Component, pageProps }) {
  return (
    <EthersProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </EthersProvider>
  );
}

export default MyApp;
