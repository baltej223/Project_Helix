import React from "react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      p="6"
      shadow="0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)"
      border="1px solid"
      borderColor="#EDF2F7"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "0 4px 20px rgba(15, 23, 42, 0.12)",
        borderColor: "#E2E8F0",
      }}
      cursor="pointer"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        h="3px"
        bgGradient="to-r"
        gradientFrom="#1E293B"
        gradientTo="#475569"
        opacity="0"
        transition="opacity 0.3s ease"
        _groupHover={{ opacity: 1 }}
      />
      <Flex
        w="12"
        h="12"
        borderRadius="lg"
        bg="#F1F5F9"
        color="#1E293B"
        align="center"
        justify="center"
        mb="4"
        fontSize="xl"
      >
        {icon}
      </Flex>
      <Text fontWeight="700" fontSize="md" color="#2D3748" mb="2">
        {title}
      </Text>
      <Text fontSize="sm" color="#718096" lineHeight="1.7">
        {description}
      </Text>
    </Box>
  );
};

export default FeatureCard;
