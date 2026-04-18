import React from "react";
import { Box, Flex, Text, Button, SimpleGrid, Grid, GridItem, Badge } from "@chakra-ui/react";
import {
  Shield,
  FileSearch,
  Brain,
  Lightbulb,
  Upload,
  ShieldAlert,
  CheckCircle2,
  FileText,
  ChevronRight,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  TrendingUp,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import SectionWrapper from "../components/SectionWrapper";

/* ──────────────────────── keyframe animation styles ──────────────────────── */
const floatAnimation = {
  animation: "float 6s ease-in-out infinite",
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-12px)" },
  },
};

const pulseGlow = {
  animation: "pulseGlow 3s ease-in-out infinite",
  "@keyframes pulseGlow": {
    "0%, 100%": { boxShadow: "0 0 20px rgba(49, 130, 206, 0.15)" },
    "50%": { boxShadow: "0 0 40px rgba(49, 130, 206, 0.3)" },
  },
};

/* ─── Hero Section ──────────────────────────────────────── */
const HeroSection = () => (
  <Box
    bg="linear-gradient(160deg, #FAFBFE 0%, #EEF4FF 35%, #E8F4FD 55%, #F0FAFA 100%)"
    position="relative"
    overflow="hidden"
    minH={{ base: "auto", lg: "92vh" }}
    display="flex"
    alignItems="center"
  >
    {/* Animated orbs */}
    <Box
      position="absolute" top="-180px" right="-120px"
      w="600px" h="600px" borderRadius="full"
      bg="radial-gradient(circle, rgba(49,130,206,0.08) 0%, transparent 70%)"
      css={floatAnimation}
    />
    <Box
      position="absolute" bottom="-140px" left="-100px"
      w="500px" h="500px" borderRadius="full"
      bg="radial-gradient(circle, rgba(56,178,172,0.06) 0%, transparent 70%)"
      css={{ ...floatAnimation, animationDelay: "3s" }}
    />
    <Box
      position="absolute" top="40%" right="15%"
      w="200px" h="200px" borderRadius="full"
      bg="radial-gradient(circle, rgba(237,100,166,0.04) 0%, transparent 70%)"
      css={{ ...floatAnimation, animationDelay: "1.5s" }}
    />
    {/* Grid pattern overlay */}
    <Box
      position="absolute" inset="0" opacity="0.03"
      backgroundImage="linear-gradient(rgba(49,130,206,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(49,130,206,0.3) 1px, transparent 1px)"
      backgroundSize="60px 60px"
    />

    <SectionWrapper py={{ base: "20", md: "0" }} position="relative" zIndex="1">
      <Grid
        templateColumns={{ base: "1fr", lg: "1.15fr 1fr" }}
        gap={{ base: "14", lg: "20" }}
        alignItems="center"
      >
        {/* Left */}
        <GridItem>
          <Flex align="center" gap="2" mb="8">
            <Box w="2" h="2" borderRadius="full" bg="#3182CE" css={pulseGlow} />
            <Text
              fontSize="xs" fontWeight="700" letterSpacing="0.18em"
              textTransform="uppercase"
              bgGradient="to-r" gradientFrom="#3182CE" gradientTo="#319795"
              bgClip="text" color="transparent"
            >
              AI-Powered Legal Intelligence
            </Text>
          </Flex>

          <Text
            as="h1"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            fontWeight="900"
            color="#0F1B2D"
            lineHeight="1.08"
            letterSpacing="-0.04em"
            mb="7"
          >
            Understand Legal
            <br />
            Documents{" "}
            <Text
              as="span"
              bgGradient="to-r" gradientFrom="#2B6CB0" gradientTo="#319795"
              bgClip="text" color="transparent"
            >
              Before They
            </Text>
            <br />
            Understand You
          </Text>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="#64748B"
            lineHeight="1.85"
            maxW="520px"
            mb="10"
            fontWeight="400"
          >
            LegalLens AI scans every clause, flags hidden risks, and translates
            dense legal jargon into plain English — so you never sign blind again.
          </Text>

          <Flex gap="4" flexWrap="wrap" mb="12">
            <Button
              as={RouterLink} to="/upload"
              bg="linear-gradient(135deg, #2B6CB0 0%, #3182CE 50%, #4299E1 100%)"
              color="white" size="lg" borderRadius="2xl"
              px="10" py="7" fontWeight="700" fontSize="md"
              shadow="0 4px 20px rgba(49, 130, 206, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)"
              _hover={{
                transform: "translateY(-3px) scale(1.02)",
                shadow: "0 12px 35px rgba(49, 130, 206, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
              _active={{ transform: "translateY(-1px) scale(0.98)" }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <Upload size={18} />
              Upload Document
              <ArrowRight size={16} />
            </Button>
            <Button
              as={RouterLink} to="/analysis"
              variant="outline" size="lg" borderRadius="2xl"
              px="9" py="7" fontWeight="600" fontSize="md"
              borderColor="#CBD5E0" borderWidth="1.5px" color="#475569"
              bg="rgba(255,255,255,0.6)" backdropFilter="blur(8px)"
              _hover={{
                bg: "white", borderColor: "#93C5FD",
                transform: "translateY(-3px)",
                shadow: "0 8px 25px rgba(0,0,0,0.06)",
              }}
              _active={{ transform: "translateY(-1px)" }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              View Demo
              <ChevronRight size={18} />
            </Button>
          </Flex>

          {/* Trust */}
          <Flex gap="8" flexWrap="wrap" align="center">
            {[
              { icon: <Lock size={13} />, label: "SOC2 Compliant" },
              { icon: <Shield size={13} />, label: "GDPR Ready" },
              { icon: <TrendingUp size={13} />, label: "10M+ Precedents" },
            ].map((t) => (
              <Flex key={t.label} align="center" gap="2.5">
                <Flex
                  w="6" h="6" borderRadius="md" bg="#F0FFF4" color="#38A169"
                  align="center" justify="center"
                >
                  {t.icon}
                </Flex>
                <Text fontSize="xs" color="#64748B" fontWeight="600" letterSpacing="0.02em">
                  {t.label}
                </Text>
              </Flex>
            ))}
          </Flex>
        </GridItem>

        {/* Right — Floating Mock UI */}
        <GridItem>
          <Box position="relative" css={floatAnimation}>
            {/* Glow behind card */}
            <Box
              position="absolute" inset="-20px" borderRadius="3xl"
              bg="radial-gradient(ellipse at center, rgba(49,130,206,0.08) 0%, transparent 70%)"
              filter="blur(20px)"
            />
            <Box
              bg="rgba(255,255,255,0.92)" backdropFilter="blur(20px) saturate(180%)"
              borderRadius="3xl" p="7"
              shadow="0 25px 50px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.7), inset 0 1px 0 rgba(255,255,255,0.9)"
              border="1px solid rgba(226,232,240,0.6)"
              position="relative"
            >
              {/* Mock header */}
              <Flex justify="space-between" align="center" mb="6">
                <Flex align="center" gap="3">
                  <Flex
                    w="10" h="10" borderRadius="xl"
                    bg="linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 100%)"
                    color="#2B6CB0" align="center" justify="center"
                    shadow="0 2px 8px rgba(49,130,206,0.12)"
                  >
                    <FileText size={18} />
                  </Flex>
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="#1E293B">SaaS_Agreement_v3.pdf</Text>
                    <Text fontSize="xs" color="#94A3B8">Uploaded 2 min ago · 24 pages</Text>
                  </Box>
                </Flex>
                <Badge
                  bg="linear-gradient(135deg, #FEE2E2, #FECACA)" color="#DC2626"
                  px="3" py="1.5" borderRadius="xl" fontSize="10px" fontWeight="800"
                  letterSpacing="0.08em" border="1px solid" borderColor="#FECACA"
                >
                  HIGH RISK
                </Badge>
              </Flex>

              {/* AI Summary */}
              <Box
                bg="linear-gradient(135deg, #F8FAFC, #F1F5F9)" borderRadius="2xl"
                p="5" mb="5" border="1px solid" borderColor="#E2E8F0"
              >
                <Flex align="center" gap="2" mb="3">
                  <Sparkles size={13} color="#3182CE" />
                  <Text fontSize="10px" fontWeight="800" color="#64748B" letterSpacing="0.15em">
                    AI SUMMARY
                  </Text>
                </Flex>
                <Text fontSize="sm" color="#475569" lineHeight="1.75">
                  This agreement contains{" "}
                  <Text as="span" fontWeight="800" color="#DC2626">3 high-risk clauses</Text>{" "}
                  related to liability caps, IP ownership, and data portability.
                </Text>
              </Box>

              {/* Risk clause */}
              <Box
                borderLeft="4px solid" borderLeftColor="#EF4444"
                bg="linear-gradient(135deg, #FFF5F5, #FEF2F2)"
                borderRadius="xl" p="5" mb="5"
              >
                <Flex justify="space-between" align="center" mb="2">
                  <Badge
                    bg="#FEE2E2" color="#DC2626" fontSize="9px" fontWeight="800"
                    px="2.5" py="1" borderRadius="lg" letterSpacing="0.08em"
                  >
                    CRITICAL
                  </Badge>
                  <Text fontSize="xs" color="#94A3B8" fontWeight="500">§4.1 · Liability</Text>
                </Flex>
                <Text fontSize="sm" color="#1E293B" fontWeight="700" mb="1">
                  Uncapped indirect damages exposure
                </Text>
                <Text fontSize="xs" color="#64748B" lineHeight="1.7">
                  Provider faces unlimited monetary liability — far exceeding norms.
                </Text>
              </Box>

              {/* Score bar */}
              <Box bg="#F8FAFC" borderRadius="xl" p="4" border="1px solid" borderColor="#E2E8F0">
                <Flex justify="space-between" align="center" mb="3">
                  <Text fontSize="xs" color="#94A3B8" fontWeight="700" letterSpacing="0.08em">RISK SCORE</Text>
                  <Text fontSize="xl" fontWeight="900" color="#DC2626">72</Text>
                </Flex>
                <Box h="3" bg="#E2E8F0" borderRadius="full" overflow="hidden">
                  <Box
                    w="72%" h="100%" borderRadius="full"
                    bg="linear-gradient(90deg, #FBBF24, #F59E0B, #EF4444)"
                    shadow="0 0 12px rgba(239,68,68,0.3)"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </SectionWrapper>
  </Box>
);

/* ─── Features — Bento Grid ──────────────────────────────── */
const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain size={24} />,
      title: "AI Classification",
      description: "Automatically classifies documents by type, jurisdiction, and risk category using deep NLP models.",
      gradient: "linear-gradient(135deg, #EBF8FF, #DBEAFE)",
      iconColor: "#2B6CB0",
      span: { base: 1, md: 1 },
    },
    {
      icon: <ShieldAlert size={24} />,
      title: "Risk Detection",
      description: "Flags high-risk clauses like uncapped liabilities, aggressive indemnity, and non-standard terms.",
      gradient: "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
      iconColor: "#DC2626",
      span: { base: 1, md: 1 },
    },
    {
      icon: <FileSearch size={24} />,
      title: "Clause Breakdown",
      description: "Dissects every section with clause-level analysis, cross-referencing with statutory frameworks.",
      gradient: "linear-gradient(135deg, #F0FFF4, #DCFCE7)",
      iconColor: "#16A34A",
      span: { base: 1, md: 1 },
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Plain English Insights",
      description: "Translates dense legal language into clear, actionable summaries anyone can understand.",
      gradient: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
      iconColor: "#D97706",
      span: { base: 1, md: 1 },
    },
  ];

  return (
    <Box id="features" bg="white" position="relative" overflow="hidden">
      {/* Subtle dots pattern */}
      <Box
        position="absolute" inset="0" opacity="0.015"
        backgroundImage="radial-gradient(circle, #3182CE 1px, transparent 1px)"
        backgroundSize="30px 30px"
      />

      <SectionWrapper position="relative" zIndex="1">
        <Flex direction="column" align="center" mb="16" textAlign="center">
          <Flex
            align="center" gap="2" mb="5"
            bg="#F0FFF4" border="1px solid" borderColor="#C6F6D5"
            px="4" py="2" borderRadius="full"
          >
            <Sparkles size={14} color="#16A34A" />
            <Text fontSize="xs" fontWeight="700" letterSpacing="0.12em" color="#16A34A">
              CAPABILITIES
            </Text>
          </Flex>
          <Text
            as="h2"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="900" color="#0F1B2D"
            letterSpacing="-0.03em" mb="5" lineHeight="1.1"
          >
            Everything You Need to
            <br />
            <Text as="span" bgGradient="to-r" gradientFrom="#2B6CB0" gradientTo="#319795" bgClip="text" color="transparent">
              Review Contracts
            </Text>
          </Text>
          <Text
            fontSize={{ base: "md", md: "lg" }} color="#64748B"
            maxW="580px" lineHeight="1.85"
          >
            From clause-level risk analysis to AI-generated negotiation strategies —
            powered by institutional-grade legal intelligence.
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
          {features.map((feat) => (
            <Box
              key={feat.title}
              bg="rgba(255,255,255,0.8)"
              backdropFilter="blur(12px)"
              borderRadius="2xl"
              p={{ base: "7", md: "8" }}
              border="1px solid" borderColor="#E2E8F0"
              shadow="0 1px 3px rgba(0,0,0,0.03)"
              transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: "translateY(-6px)",
                shadow: "0 20px 40px rgba(0,0,0,0.06), 0 0 0 1px rgba(49,130,206,0.08)",
                borderColor: "#BEE3F8",
              }}
              cursor="pointer"
              position="relative"
              overflow="hidden"
              role="group"
            >
              {/* Hover gradient */}
              <Box
                position="absolute" inset="0" borderRadius="2xl"
                bg="linear-gradient(135deg, rgba(49,130,206,0.02), rgba(56,178,172,0.02))"
                opacity="0" transition="opacity 0.4s"
                _groupHover={{ opacity: 1 }}
              />
              <Flex position="relative" zIndex="1" direction="column">
                <Flex
                  w="14" h="14" borderRadius="2xl"
                  bg={feat.gradient} color={feat.iconColor}
                  align="center" justify="center" mb="6"
                  shadow={`0 4px 12px ${feat.iconColor}15`}
                  transition="all 0.4s"
                  _groupHover={{ transform: "scale(1.08) rotate(-3deg)" }}
                >
                  {feat.icon}
                </Flex>
                <Text fontWeight="800" fontSize="lg" color="#0F1B2D" mb="3" letterSpacing="-0.01em">
                  {feat.title}
                </Text>
                <Text fontSize="sm" color="#64748B" lineHeight="1.8">
                  {feat.description}
                </Text>
                <Flex
                  align="center" gap="1.5" mt="5" color="#3182CE"
                  fontWeight="600" fontSize="sm"
                  opacity="0" transform="translateX(-8px)"
                  transition="all 0.3s"
                  _groupHover={{ opacity: 1, transform: "translateX(0)" }}
                >
                  Learn more <ArrowRight size={14} />
                </Flex>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </SectionWrapper>
    </Box>
  );
};

/* ─── CTA Section ────────────────────────────────────────── */
const CTASection = () => (
  <Box
    bg="linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #1E3A5F 100%)"
    position="relative" overflow="hidden"
  >
    <Box
      position="absolute" top="-200px" right="-100px"
      w="500px" h="500px" borderRadius="full"
      bg="radial-gradient(circle, rgba(49,130,206,0.15) 0%, transparent 70%)"
    />
    <Box
      position="absolute" bottom="-150px" left="-80px"
      w="400px" h="400px" borderRadius="full"
      bg="radial-gradient(circle, rgba(56,178,172,0.1) 0%, transparent 70%)"
    />
    <Box
      position="absolute" inset="0" opacity="0.04"
      backgroundImage="radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)"
      backgroundSize="40px 40px"
    />

    <SectionWrapper py={{ base: "20", md: "28" }}>
      <Flex direction="column" align="center" textAlign="center" position="relative" zIndex="1">
        <Flex
          w="16" h="16" borderRadius="2xl" mb="8"
          bg="linear-gradient(135deg, rgba(49,130,206,0.2), rgba(56,178,172,0.15))"
          border="1px solid rgba(255,255,255,0.08)"
          align="center" justify="center" color="#63B3ED"
          css={pulseGlow}
        >
          <Shield size={28} />
        </Flex>
        <Text
          as="h2"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="900" color="white"
          letterSpacing="-0.03em" mb="5" lineHeight="1.1"
        >
          Stop Signing Blindly
        </Text>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="rgba(255,255,255,0.55)" lineHeight="1.85"
          mb="10" maxW="520px"
        >
          Every unsigned clause is a potential liability. Let AI be your first line
          of defense before you commit.
        </Text>
        <Button
          as={RouterLink} to="/upload"
          bg="white" color="#0F172A" size="lg"
          borderRadius="2xl" px="12" py="7"
          fontWeight="800" fontSize="md"
          shadow="0 4px 20px rgba(255,255,255,0.15)"
          _hover={{
            bg: "#F0F9FF", transform: "translateY(-3px) scale(1.02)",
            shadow: "0 15px 40px rgba(255,255,255,0.2)",
          }}
          _active={{ transform: "translateY(-1px) scale(0.98)" }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <Zap size={18} />
          Analyze Now
          <ArrowRight size={16} />
        </Button>
      </Flex>
    </SectionWrapper>
  </Box>
);

/* ─── Footer ─────────────────────────────────────────────── */
const Footer = () => (
  <Box bg="#0F172A" color="#94A3B8">
    <SectionWrapper py={{ base: "14", md: "20" }}>
      <Grid
        templateColumns={{ base: "1fr", md: "2.5fr 1fr 1fr 1fr" }}
        gap={{ base: "10", md: "16" }}
      >
        <Box>
          <Flex align="center" gap="3" mb="5">
            <Flex
              w="10" h="10" borderRadius="xl"
              bg="linear-gradient(135deg, rgba(49,130,206,0.15), rgba(56,178,172,0.1))"
              color="#63B3ED" align="center" justify="center"
              border="1px solid rgba(255,255,255,0.06)"
            >
              <Shield size={18} />
            </Flex>
            <Text fontSize="xl" fontWeight="900" color="white" letterSpacing="-0.03em">
              LegalLens AI
            </Text>
          </Flex>
          <Text fontSize="sm" lineHeight="1.9" maxW="320px" color="#64748B" mb="6">
            The next-generation legal workspace. Bridging the gap between AI-powered
            analysis and human legal intuition.
          </Text>
          <Text fontSize="xs" color="#334155">
            © 2024 LegalLens Technologies. All rights reserved.
          </Text>
        </Box>

        {[
          { title: "PLATFORM", links: [{ label: "Analyzer", to: "/analysis" }, { label: "Marketplace", to: "/marketplace" }, { label: "API Docs" }] },
          { title: "LAWYERS", links: [{ label: "Join Network" }, { label: "Provider Portal" }, { label: "Best Practices" }] },
          { title: "LEGAL", links: [{ label: "Privacy Policy" }, { label: "Compliance" }, { label: "Terms of Service" }] },
        ].map((col) => (
          <Box key={col.title}>
            <Text fontSize="xs" fontWeight="800" letterSpacing="0.18em" color="#475569" mb="5">
              {col.title}
            </Text>
            <Flex direction="column" gap="3.5">
              {col.links.map((link) => (
                <Text
                  key={link.label}
                  as={link.to ? RouterLink : "a"}
                  to={link.to} href={link.to ? undefined : "#"}
                  fontSize="sm" color="#64748B" fontWeight="500"
                  _hover={{ color: "#E2E8F0" }}
                  transition="color 0.2s"
                >
                  {link.label}
                </Text>
              ))}
            </Flex>
          </Box>
        ))}
      </Grid>

      {/* Bottom bar */}
      <Box borderTop="1px solid" borderColor="rgba(255,255,255,0.06)" mt="14" pt="8">
        <Flex justify="space-between" align="center" flexWrap="wrap" gap="4">
          <Text fontSize="xs" color="#334155">
            Built with precision for legal professionals worldwide.
          </Text>
          <Flex gap="6">
            {["Twitter", "LinkedIn", "GitHub"].map((s) => (
              <Text
                key={s} as="a" href="#" fontSize="xs" color="#475569"
                fontWeight="600" _hover={{ color: "#94A3B8" }} transition="color 0.2s"
              >
                {s}
              </Text>
            ))}
          </Flex>
        </Flex>
      </Box>
    </SectionWrapper>
  </Box>
);

/* ─── Landing Page ───────────────────────────────────────── */
const LandingPage = () => (
  <Box minH="100vh" bg="#FAFBFE">
    <LandingNavbar />
    <HeroSection />
    <FeaturesSection />
    <CTASection />
    <Footer />
  </Box>
);

export default LandingPage;
