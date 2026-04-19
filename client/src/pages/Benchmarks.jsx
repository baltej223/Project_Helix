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
  AlertTriangle,
  FileText,
  History,
  LayoutList,
  WandSparkles,
  Download,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const Benchmarks = () => {
  const rows = [
    {
      factor: "Liability Cap",
      section: "Section 12.4 - Indemnification",
      yourTerm: "3x Annual Fees",
      market: "1x Annual Fees",
      status: "NEEDS NEGOTIATION",
      tone: "danger",
    },
    {
      factor: "Notice Period",
      section: "Section 4.2 - Termination",
      yourTerm: "90 Days",
      market: "30 - 60 Days",
      status: "FAVORABLE",
      tone: "good",
    },
    {
      factor: "Data Portability",
      section: "Section 8.1 - Confidentiality",
      yourTerm: "Standard JSON",
      market: "Standard JSON",
      status: "ALIGNED",
      tone: "neutral",
    },
    {
      factor: "IP Rights",
      section: "Section 5.3 - Ownership",
      yourTerm: "Restricted Use",
      market: "Mutual Ownership",
      status: "NEEDS NEGOTIATION",
      tone: "danger",
    },
  ];

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

  const getStatusStyles = (tone) => {
    switch (tone) {
      case "danger":
        return { bg: "#FEF2F2", color: "#DC2626", border: "#FEE2E2" };
      case "good":
        return { bg: "#F0FFF4", color: "#16A34A", border: "#DCFCE7" };
      default:
        return { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" };
    }
  };

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
              color={item.active ? "white" : "#64748B"}
              bg={item.active ? "linear-gradient(135deg, #0F172A, #1E293B)" : "transparent"}
              borderRadius="xl"
              _hover={{
                bg: item.active ? "linear-gradient(135deg, #0F172A, #1E293B)" : "#F1F5F9",
                color: item.active ? "white" : "#1E293B",
              }}
              transition="all 0.2s"
              shadow={item.active ? "0 2px 8px rgba(15,23,42,0.15)" : "none"}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </Flex>

        <Button
          mt="auto"
          bg="linear-gradient(135deg, #0F172A, #1E293B)"
          color="white"
          h="12"
          borderRadius="xl"
          fontSize="xs"
          fontWeight="800"
          letterSpacing="0.1em"
          shadow="0 4px 16px rgba(15, 23, 42, 0.25)"
          _hover={{
            shadow: "0 6px 20px rgba(15, 23, 42, 0.35)",
            transform: "translateY(-1px)",
          }}
          transition="all 0.2s"
        >
          <Sparkles size={14} style={{ marginRight: '6px' }} />
          New Analysis
        </Button>
      </Box>

      {/* Main Panel */}
      <Box p={{ base: "5", md: "8", lg: "10" }} overflow="auto">
        <Box maxW="1200px" mx="auto">
          {/* Header */}
          <Flex
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            mb="8"
            flexWrap="wrap"
            gap="4"
          >
            <Box>
              <Text
                as="h1"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="900"
                color="#0F1B2D"
                letterSpacing="-0.03em"
              >
                Market Benchmarks
              </Text>
              <Text fontSize="sm" color="#64748B" mt="2" lineHeight="1.6">
                Comparing{" "}
                <Text as="span" fontWeight="800" color="#1E293B">
                  SaaS Agreement_v4.pdf
                </Text>{" "}
                against the LegalLens global corpus.
              </Text>
            </Box>
            <Badge
              bg="#F0FFF4"
              color="#16A34A"
              px="4"
              py="2"
              borderRadius="full"
              fontSize="10px"
              fontWeight="800"
              letterSpacing="0.1em"
              border="1px solid"
              borderColor="#DCFCE7"
            >
              LIVE CORPUS: 14.2K DOCS
            </Badge>
          </Flex>

          {/* Top Cards */}
          <Grid templateColumns={{ base: "1fr", md: "1.3fr 1fr" }} gap="6" mb="8">
            {/* Readiness Card */}
            <Box
              bg="white"
              borderRadius="3xl"
              p={{ base: "6", md: "8" }}
              border="1px solid"
              borderColor="#E2E8F0"
              shadow="0 2px 8px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04)"
              position="relative"
              overflow="hidden"
            >
              {/* Decorative gradient strip */}
              <Box position="absolute" top="0" left="0" right="0" h="4px" bg="linear-gradient(90deg, #0F172A, #1E293B, #475569)" />

              <Text fontSize="lg" fontWeight="800" color="#0F1B2D" mb="6">
                Negotiation Readiness
              </Text>
              <Grid templateColumns="repeat(3, 1fr)" gap="4">
                <Box>
                  <Text fontSize="3xl" fontWeight="900" color="#0F172A" mb="1">
                    84%
                  </Text>
                  <Text fontSize="10px" fontWeight="700" letterSpacing="0.12em" color="#94A3B8">
                    MARKET ALIGNMENT
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="3xl" fontWeight="900" color="#F59E0B" mb="1">
                    3
                  </Text>
                  <Text fontSize="10px" fontWeight="700" letterSpacing="0.12em" color="#94A3B8">
                    CRITICAL OUTLIERS
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="3xl" fontWeight="900" color="#16A34A" mb="1">
                    High
                  </Text>
                  <Text fontSize="10px" fontWeight="700" letterSpacing="0.12em" color="#94A3B8">
                    LEVERAGE SCORE
                  </Text>
                </Box>
              </Grid>
            </Box>

            {/* Recommendation Card */}
            <Box
              bg="linear-gradient(135deg, #F8FAFC, #E2E8F0)"
              borderRadius="3xl"
              p={{ base: "6", md: "8" }}
              border="1px solid"
              borderColor="#E2E8F0"
              shadow="0 4px 16px rgba(15,23,42,0.1)"
            >
              <Flex align="center" gap="2" mb="4">
                <Sparkles size={16} color="#0F172A" />
                <Text
                  fontSize="xs"
                  fontWeight="800"
                  letterSpacing="0.12em"
                  color="#0F172A"
                >
                  JURIST RECOMMENDATION
                </Text>
              </Flex>
              <Text fontSize="sm" color="#1E293B" lineHeight="1.8" mb="3">
                Your <Text as="span" fontWeight="800">Liability Cap</Text> is significantly higher than
                92% of similar enterprise deals.
              </Text>
              <Text fontSize="sm" color="#475569" lineHeight="1.8">
                Focus your negotiation here to reduce corporate exposure by an
                estimated <Text as="span" fontWeight="800" color="#DC2626">$2.4M.</Text>
              </Text>
            </Box>
          </Grid>

          {/* Table */}
          <Box
            bg="white"
            borderRadius="3xl"
            border="1px solid"
            borderColor="#E2E8F0"
            shadow="0 2px 8px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04)"
            overflow="hidden"
            mb="8"
          >
            <Box overflowX="auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["NEGOTIABLE FACTORS", "YOUR TERM", "MARKET STANDARD", "ASSESSMENT"].map(
                      (head) => (
                        <th
                          key={head}
                          style={{
                            padding: "20px 24px",
                            textAlign: "left",
                            fontSize: "11px",
                            fontWeight: "800",
                            letterSpacing: "0.15em",
                            color: "#94A3B8",
                            borderBottom: "1px solid #E2E8F0",
                            background: "#FAFBFE",
                          }}
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const statusStyle = getStatusStyles(row.tone);
                    return (
                      <tr
                        key={row.factor}
                        style={{
                          borderBottom: "1px solid #E2E8F0",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFE")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "20px 24px" }}>
                          <Text fontSize="sm" fontWeight="700" color="#0F1B2D">
                            {row.factor}
                          </Text>
                          <Text fontSize="xs" color="#94A3B8" mt="1" fontWeight="500">
                            {row.section}
                          </Text>
                        </td>
                        <td style={{ padding: "20px 24px" }}>
                          <Text fontSize="sm" color="#475569" fontWeight="600">{row.yourTerm}</Text>
                        </td>
                        <td style={{ padding: "20px 24px" }}>
                          <Text fontSize="sm" color="#475569" fontWeight="500">{row.market}</Text>
                        </td>
                        <td style={{ padding: "20px 24px" }}>
                          <Badge
                            bg={statusStyle.bg}
                            color={statusStyle.color}
                            border="1px solid"
                            borderColor={statusStyle.border}
                            px="3"
                            py="1.5"
                            borderRadius="lg"
                            fontSize="10px"
                            fontWeight="800"
                            letterSpacing="0.05em"
                            display="inline-flex"
                            alignItems="center"
                            gap="1.5"
                          >
                            {row.tone === "danger" ? <AlertTriangle size={12} /> : row.tone === "good" ? <CheckCircle2 size={12} /> : null}
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </Box>

          {/* Bottom Grid */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
            {/* Regional Standards */}
            <Box
              bg="white"
              borderRadius="3xl"
              p={{ base: "6", md: "8" }}
              border="1px solid"
              borderColor="#E2E8F0"
              shadow="0 2px 8px rgba(0,0,0,0.02)"
            >
              <Text
                fontSize="xs"
                fontWeight="800"
                letterSpacing="0.15em"
                color="#94A3B8"
                mb="6"
              >
                REGIONAL STANDARDS
              </Text>

              <Box mb="6">
                <Flex justify="space-between" align="center" mb="3">
                  <Text fontSize="sm" color="#475569" fontWeight="600">North America (AMER)</Text>
                  <Text fontSize="sm" fontWeight="800" color="#16A34A">High Alignment</Text>
                </Flex>
                <Box w="100%" h="2.5" bg="#F1F5F9" borderRadius="full" overflow="hidden">
                  <Box w="88%" h="100%" bg="linear-gradient(90deg, #22C55E, #16A34A)" borderRadius="full" shadow="0 0 8px rgba(22,163,74,0.4)" />
                </Box>
              </Box>

              <Box>
                <Flex justify="space-between" align="center" mb="3">
                  <Text fontSize="sm" color="#475569" fontWeight="600">European Union (EMEA)</Text>
                  <Text fontSize="sm" fontWeight="800" color="#F59E0B">Moderate Gap</Text>
                </Flex>
                <Box w="100%" h="2.5" bg="#F1F5F9" borderRadius="full" overflow="hidden">
                  <Box w="62%" h="100%" bg="linear-gradient(90deg, #FBBF24, #F59E0B)" borderRadius="full" shadow="0 0 8px rgba(245,158,11,0.4)" />
                </Box>
              </Box>
            </Box>

            {/* Negotiation Playbook */}
            <Box
              bg="white"
              borderRadius="3xl"
              p={{ base: "6", md: "8" }}
              border="1px solid"
              borderColor="#E2E8F0"
              shadow="0 2px 8px rgba(0,0,0,0.02)"
              display="flex"
              flexDirection="column"
            >
              <Text
                fontSize="xs"
                fontWeight="800"
                letterSpacing="0.15em"
                color="#94A3B8"
                mb="4"
              >
                NEGOTIATION PLAYBOOK
              </Text>
              <Text fontSize="sm" color="#64748B" lineHeight="1.8" mb="6">
                Generate a custom counter-proposal email based on these market
                discrepancies, aligned perfectly with current SaaS norms.
              </Text>
              <Button
                mt="auto"
                bg="linear-gradient(135deg, #0F172A, #1E293B)"
                color="white"
                borderRadius="xl"
                px="6"
                py="6"
                fontWeight="700"
                fontSize="sm"
                shadow="0 4px 16px rgba(15,23,42,0.3)"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "0 8px 24px rgba(15,23,42,0.4)",
                  bg: "linear-gradient(135deg, #1E293B, #334155)",
                }}
                transition="all 0.3s"
              >
                <WandSparkles size={16} style={{ marginRight: '8px' }} />
                Draft Counter-Proposal
              </Button>
            </Box>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};

export default Benchmarks;
