import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  Badge,
} from "@chakra-ui/react";
import {
  Download,
  ExternalLink,
  FileText,
  History,
  LayoutList,
  MoreHorizontal,
  Printer,
  ZoomIn,
  Sparkles,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const Analysis = () => {
  const sideLinks = [
    { icon: <FileText size={16} />, label: "DOCUMENT METADATA" },
    { icon: <LayoutList size={16} />, label: "CLAUSE LIBRARY" },
    {
      icon: <Text fontSize="md" fontWeight="900" lineHeight="1">!</Text>,
      label: "RISK PROFILE",
      active: true,
    },
    { icon: <History size={16} />, label: "HISTORY" },
    { icon: <Download size={16} />, label: "EXPORT" },
  ];

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "240px 1fr" }}
      h="100%"
      bg="#F8FAFC"
    >
      {/* Sidebar */}
      <Box
        borderRight="1px solid"
        borderColor="#E2E8F0"
        bg="white"
        p="5"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        shadow="1px 0 10px rgba(0,0,0,0.02)"
        zIndex="10"
      >
        <Text fontSize="sm" fontWeight="800" color="#0F1B2D" mb="1" letterSpacing="-0.01em">
          Case Metadata
        </Text>
        <Text
          fontSize="10px"
          fontWeight="700"
          letterSpacing="0.15em"
          color="#94A3B8"
          textTransform="uppercase"
          mb="6"
        >
          AI-generated insight
        </Text>

        <Flex direction="column" gap="2">
          {sideLinks.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              h="10"
              px="4"
              justifyContent="flex-start"
              gap="3"
              fontSize="11px"
              fontWeight="700"
              letterSpacing="0.1em"
              color={item.active ? "#2B6CB0" : "#64748B"}
              bg={item.active ? "linear-gradient(135deg, #EFF6FF, #DBEAFE)" : "transparent"}
              borderRadius="xl"
              _hover={{
                bg: item.active ? "linear-gradient(135deg, #EFF6FF, #DBEAFE)" : "#F1F5F9",
                color: item.active ? "#2B6CB0" : "#1E293B",
              }}
              transition="all 0.2s"
              shadow={item.active ? "0 2px 8px rgba(49,130,206,0.15)" : "none"}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </Flex>

        <Button
          mt="auto"
          bg="linear-gradient(135deg, #2B6CB0, #3182CE)"
          color="white"
          h="12"
          borderRadius="xl"
          fontSize="xs"
          fontWeight="800"
          letterSpacing="0.1em"
          shadow="0 4px 16px rgba(49, 130, 206, 0.25)"
          _hover={{
            shadow: "0 6px 20px rgba(49, 130, 206, 0.35)",
            transform: "translateY(-1px)",
          }}
          transition="all 0.2s"
        >
          <Sparkles size={14} style={{ marginRight: '6px' }} />
          NEW ANALYSIS
        </Button>
      </Box>

      {/* Main Content */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1.45fr 1fr" }}
        h="100%"
        overflow="hidden"
      >
        {/* Document Column */}
        <Box
          borderRight="1px solid"
          borderColor="#E2E8F0"
          p={{ base: "4", md: "6", lg: "8" }}
          overflow="hidden"
          display="flex"
          flexDirection="column"
          bg="#FAFBFE"
        >
          {/* Toolbar */}
          <Flex justify="space-between" align="center" mb="5">
            <Flex align="center" gap="4">
              <Flex
                w="10"
                h="10"
                borderRadius="xl"
                bg="linear-gradient(135deg, #EBF8FF, #DBEAFE)"
                color="#2B6CB0"
                align="center"
                justify="center"
                shadow="0 2px 8px rgba(49,130,206,0.15)"
              >
                <FileText size={18} />
              </Flex>
              <Box>
                <Text fontSize="md" fontWeight="800" color="#0F1B2D" mb="0.5">
                  Master_Service_Agreement_v4.pdf
                </Text>
                <Text fontSize="xs" color="#94A3B8" fontWeight="500">
                  Modified 2 hours ago • 24 Pages
                </Text>
              </Box>
            </Flex>
            <Flex gap="2" color="#64748B">
              {[
                { icon: <ZoomIn size={16} /> },
                { icon: <Printer size={16} /> },
                { icon: <MoreHorizontal size={16} /> }
              ].map((btn, i) => (
                <Flex
                  key={i} w="8" h="8" borderRadius="lg"
                  align="center" justify="center" cursor="pointer"
                  _hover={{ bg: "#F1F5F9", color: "#2B6CB0" }} transition="all 0.2s"
                >
                  {btn.icon}
                </Flex>
              ))}
            </Flex>
          </Flex>

          {/* Document Sheet */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="#E2E8F0"
            flex="1"
            overflow="auto"
            p={{ base: "6", md: "10" }}
            borderRadius="2xl"
            shadow="0 8px 30px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)"
            mx="auto" w="100%" maxW="800px"
          >
            <Text
              as="h2"
              textAlign="center"
              fontFamily="'Georgia', serif"
              fontSize="xl"
              fontWeight="700"
              letterSpacing="0.02em"
              color="#0F1B2D"
              mb="8"
            >
              MASTER SERVICES AGREEMENT
            </Text>
            <Text
              fontFamily="'Georgia', serif"
              fontSize="md"
              lineHeight="2"
              color="#475569"
              mb="6"
            >
              This Master Services Agreement ("Agreement") is entered into as of
              October 12, 2023, by and between Nexus Global Corp ("Client") and
              Stratos Solutions Ltd ("Provider").
            </Text>

            {/* Risk Highlight */}
            <Box
              bg="linear-gradient(135deg, #FEF2F2, #FFF1F2)"
              borderLeft="4px solid"
              borderLeftColor="#EF4444"
              borderRadius="xl"
              p="5"
              my="6"
              position="relative"
            >
              <Box position="absolute" top="12px" right="16px">
                <Badge bg="#FEE2E2" color="#DC2626" fontSize="9px" fontWeight="800" px="2" py="1" borderRadius="md">
                  FLAGGED
                </Badge>
              </Box>
              <Text
                fontFamily="'Georgia', serif"
                fontSize="md"
                fontWeight="700"
                color="#0F1B2D"
                mb="3"
              >
                Section 4. Limitation of Liability
              </Text>
              <Text
                fontFamily="'Georgia', serif"
                fontSize="md"
                lineHeight="2"
                color="#475569"
              >
                4.1. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO
                EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, PUNITIVE,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES...
              </Text>
            </Box>

            <Text
              fontFamily="'Georgia', serif"
              fontSize="md"
              fontWeight="700"
              color="#0F1B2D"
              mb="3"
            >
              Section 7. Indemnification
            </Text>
            <Text
              fontFamily="'Georgia', serif"
              fontSize="md"
              lineHeight="2"
              color="#475569"
              mb="6"
            >
              7.2. Provider shall indemnify, defend, and hold harmless Client
              and its officers and employees from and against any and all
              claims, costs and liabilities...
            </Text>

            <Text
              fontFamily="'Georgia', serif"
              fontSize="md"
              lineHeight="2"
              color="#475569"
              opacity="0.3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit...
            </Text>
          </Box>
        </Box>

        {/* AI Analysis Column */}
        <Box
          bg="#F8FAFC"
          p={{ base: "5", md: "8" }}
          display="flex"
          flexDirection="column"
          overflow="auto"
        >
          {/* Header */}
          <Flex justify="space-between" align="center" mb="6">
            <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" color="#64748B">
              AI ANALYSIS ENGINE
            </Text>
            <Badge
              bg="#F0FFF4"
              color="#16A34A"
              px="3"
              py="1.5"
              borderRadius="full"
              fontSize="9px"
              fontWeight="800"
              letterSpacing="0.1em"
              border="1px solid"
              borderColor="#DCFCE7"
            >
              ● LIVE SCANNING
            </Badge>
          </Flex>

          {/* Score Card */}
          <Grid
            templateColumns="120px 1fr"
            gap="5"
            alignItems="center"
            mb="6"
            bg="white"
            p="5"
            borderRadius="2xl"
            border="1px solid"
            borderColor="#E2E8F0"
            shadow="0 4px 16px rgba(0,0,0,0.02)"
          >
            {/* Score Ring */}
            <Box position="relative" w="110px" h="110px">
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset="84"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
              </svg>
              <Flex
                position="absolute"
                inset="0"
                align="center"
                justify="center"
                direction="column"
              >
                <Text fontSize="3xl" fontWeight="900" lineHeight="1" color="#0F1B2D" mt="1">
                  68
                </Text>
                <Text fontSize="9px" letterSpacing="0.15em" color="#94A3B8" fontWeight="800">
                  SCORE
                </Text>
              </Flex>
            </Box>
            <Box>
              <Text fontSize="md" fontWeight="800" color="#0F1B2D" mb="1.5">
                Moderate Risk Detected
              </Text>
              <Text fontSize="sm" color="#64748B" lineHeight="1.6" mb="4">
                Multiple clauses contain non-standard indemnity terms and
                aggressive limitation of liability caps.
              </Text>
              <Flex gap="2">
                <Box w="50px" h="4px" borderRadius="full" bg="#EF4444" />
                <Box w="50px" h="4px" borderRadius="full" bg="#F59E0B" />
              </Flex>
            </Box>
          </Grid>

          <Text
            fontSize="xs"
            fontWeight="800"
            letterSpacing="0.15em"
            color="#94A3B8"
            mb="4"
          >
            FLAGGED CLAUSES
          </Text>

          {/* High Risk Clause */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="#E2E8F0"
            borderLeft="4px solid"
            borderLeftColor="#EF4444"
            borderRadius="2xl"
            p="5"
            mb="4"
            shadow="0 2px 8px rgba(0,0,0,0.02)"
            transition="all 0.2s"
            _hover={{ shadow: "0 8px 24px rgba(0,0,0,0.06)", transform: "translateY(-2px)" }}
          >
            <Flex align="center" gap="3" mb="3" color="#64748B">
              <Badge
                bg="#FEF2F2"
                color="#DC2626"
                fontSize="10px"
                fontWeight="800"
                px="2.5"
                py="1"
                borderRadius="lg"
              >
                HIGH RISK
              </Badge>
              <Text fontSize="xs" fontWeight="600">Section 4.1 • Liability</Text>
              <Box ml="auto" cursor="pointer" _hover={{ color: "#2B6CB0" }}>
                <ExternalLink size={14} />
              </Box>
            </Flex>
            <Text fontSize="sm" fontWeight="700" color="#0F1B2D" mb="3">
              Uncapped indirect damages for Provider&apos;s negligence.
            </Text>
            <Box
              bg="linear-gradient(135deg, #FAFBFE, #F8FAFC)"
              borderRadius="xl"
              p="4"
              border="1px solid" borderColor="#F1F5F9"
            >
              <Flex align="center" gap="1.5" mb="1.5">
                <Sparkles size={12} color="#2B6CB0" />
                <Text fontSize="10px" fontWeight="800" color="#2B6CB0" letterSpacing="0.1em">
                  SIMPLIFIED MEANING
                </Text>
              </Flex>
              <Text fontSize="sm" color="#475569" lineHeight="1.7">
                This clause suggests that Stratos Solutions can be held liable
                for unlimited monetary losses if they make a mistake.
              </Text>
            </Box>
          </Box>

          {/* Medium Risk Clause */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="#E2E8F0"
            borderLeft="4px solid"
            borderLeftColor="#F59E0B"
            borderRadius="2xl"
            p="5"
            mb="6"
            shadow="0 2px 8px rgba(0,0,0,0.02)"
            transition="all 0.2s"
            _hover={{ shadow: "0 8px 24px rgba(0,0,0,0.06)", transform: "translateY(-2px)" }}
          >
            <Flex align="center" gap="3" mb="3" color="#64748B">
              <Badge
                bg="#FFFBEB"
                color="#D97706"
                fontSize="10px"
                fontWeight="800"
                px="2.5"
                py="1"
                borderRadius="lg"
              >
                MEDIUM RISK
              </Badge>
              <Text fontSize="xs" fontWeight="600">Section 7.2 • IP Indemnity</Text>
              <Box ml="auto" cursor="pointer" _hover={{ color: "#2B6CB0" }}>
                <ExternalLink size={14} />
              </Box>
            </Flex>
            <Text fontSize="sm" fontWeight="700" color="#0F1B2D" mb="3">
              Narrow definition of third-party IP rights.
            </Text>
            <Box
              bg="linear-gradient(135deg, #FAFBFE, #F8FAFC)"
              borderRadius="xl"
              p="4"
              border="1px solid" borderColor="#F1F5F9"
            >
              <Flex align="center" gap="1.5" mb="1.5">
                <Sparkles size={12} color="#2B6CB0" />
                <Text fontSize="10px" fontWeight="800" color="#2B6CB0" letterSpacing="0.1em">
                  SIMPLIFIED MEANING
                </Text>
              </Flex>
              <Text fontSize="sm" color="#475569" lineHeight="1.7">
                The protection is standard, but the clause misses key references
                to trade secrets and may favor the client excessively.
              </Text>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Grid templateColumns="1fr 1.2fr" gap="4" mt="auto" pt="4">
            <Button
              variant="outline"
              h="12"
              borderRadius="xl"
              borderColor="#E2E8F0"
              color="#475569"
              fontSize="sm"
              fontWeight="700"
              _hover={{ bg: "#F1F5F9", borderColor: "#CBD5E0", color: "#1E293B" }}
              transition="all 0.2s"
            >
              Generate Report
            </Button>
            <Button
              bg="linear-gradient(135deg, #2B6CB0, #3182CE)"
              color="white"
              h="12"
              borderRadius="xl"
              fontSize="sm"
              fontWeight="700"
              shadow="0 4px 16px rgba(49,130,206,0.3)"
              _hover={{
                shadow: "0 6px 20px rgba(49,130,206,0.4)",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
            >
              Request Redline
            </Button>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Analysis;
