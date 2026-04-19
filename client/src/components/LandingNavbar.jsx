import React from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Shield, ArrowRight } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="100"
      bg="rgba(250, 251, 254, 0.75)"
      backdropFilter="blur(24px) saturate(200%)"
      borderBottom="1px solid"
      borderColor="rgba(226,232,240,0.5)"
    >
      <Flex
        maxW="1400px"
        mx="auto"
        px={{ base: "5", md: "8", lg: "16" }}
        h="76px"
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Flex align="center" gap="3">
          <Flex
            w="10"
            h="10"
            borderRadius="xl"
            bg="linear-gradient(135deg, #0F172A, #1E293B)"
            color="white"
            align="center"
            justify="center"
            shadow="0 4px 14px rgba(15, 23, 42, 0.35)"
          >
            <Shield size={19} />
          </Flex>
          <Text
            fontSize="xl"
            fontWeight="900"
            letterSpacing="-0.04em"
            color="#0F1B2D"
          >
            LegalLens AI
          </Text>
        </Flex>

        {/* Nav Links */}
        <Flex
          display={{ base: "none", md: "flex" }}
          align="center"
          gap="1"
          bg="rgba(241,245,249,0.6)"
          border="1px solid"
          borderColor="rgba(226,232,240,0.5)"
          borderRadius="full"
          px="2"
          py="1.5"
        >
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Dashboard", to: "/upload" },
          ].map((item) => (
            <Text
              key={item.label}
              as={item.to ? RouterLink : "a"}
              to={item.to}
              href={item.href}
              fontSize="sm"
              fontWeight="600"
              color="#475569"
              px="4"
              py="2"
              borderRadius="full"
              _hover={{ color: "#1E293B", bg: "rgba(255,255,255,0.8)" }}
              transition="all 0.2s"
              cursor="pointer"
            >
              {item.label}
            </Text>
          ))}
        </Flex>

        {/* CTA */}
        <Flex align="center" gap="3">
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            size="sm"
            fontWeight="600"
            color="#475569"
            borderRadius="xl"
            px="4"
            _hover={{ bg: "rgba(241,245,249,0.8)" }}
            display={{ base: "none", md: "flex" }}
          >
            Log In
          </Button>
          <Button
            as={RouterLink}
            to="/upload"
            size="sm"
            bg="linear-gradient(135deg, #0F172A, #1E293B)"
            color="white"
            fontWeight="700"
            borderRadius="xl"
            px="6"
            py="5"
            shadow="0 2px 10px rgba(15, 23, 42, 0.3)"
            _hover={{
              shadow: "0 6px 20px rgba(15, 23, 42, 0.4)",
              transform: "translateY(-2px)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            Get Started
            <ArrowRight size={15} />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default LandingNavbar;
