import React from "react";
import { Box } from "@chakra-ui/react";

const SectionWrapper = ({ children, bg = "transparent", py = { base: "12", md: "20" }, ...props }) => {
  return (
    <Box
      as="section"
      py={py}
      px={{ base: "4", md: "8", lg: "16" }}
      bg={bg}
      maxW="1400px"
      mx="auto"
      w="100%"
      {...props}
    >
      {children}
    </Box>
  );
};

export default SectionWrapper;
