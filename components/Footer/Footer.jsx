import { Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex align="center" justify="center" my="sm" p="2rem">
      <Text fontSize={12} fontWeight={400}>
        copyright &copy; {new Date().getFullYear()}, all rights reserved - silly
        Custom
      </Text>
    </Flex>
  );
};

export default Footer;
