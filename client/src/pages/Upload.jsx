import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  GridItem,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import { FileUp, Plus, Shield, Zap, ArrowRight, Upload as UploadIcon, Lock, Sparkles } from "lucide-react";

const Upload = () => {
  return (
    <Box minH="100%" bg="#F8FAFC" overflow="auto" p={{ base: "5", md: "8", lg: "10" }}>
      <Box maxW="1400px" mx="auto">
        {/* Header */}
        <Flex
          justify="space-between" align="flex-end" gap="6" mb="8" flexWrap="wrap"
        >
          <Box>
            <Text
              as="h1"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="900" color="#0F1B2D"
              letterSpacing="-0.03em" lineHeight="1.1"
            >
              Contract Intake
            </Text>
            <Text
              mt="3" fontSize={{ base: "sm", md: "md" }}
              color="#64748B" maxW="580px" lineHeight="1.8"
            >
              Upload your legal documents for comprehensive AI-driven analysis.
              Our preprocessing layer identifies risk profiles and redacts
              sensitive data with architectural precision.
            </Text>
          </Box>
          <Flex
            align="center" gap="2" bg="#F1F5F9"
            border="1px solid" borderColor="#E2E8F0"
            px="4" py="2.5" borderRadius="xl"
          >
            <Box w="2" h="2" borderRadius="full" bg="#16A34A" />
            <Text fontSize="xs" fontWeight="700" color="#64748B" letterSpacing="0.08em">
              PRE-PROCESSING NODE 01
            </Text>
          </Flex>
        </Flex>

        {/* Main Grid */}
        <Grid templateColumns={{ base: "1fr", lg: "1.9fr 1fr" }} gap="7">
          {/* Upload Zone */}
          <GridItem>
            <Box
              bg="white" border="1px solid" borderColor="#E2E8F0"
              borderRadius="3xl" p="4"
              shadow="0 1px 3px rgba(0,0,0,0.03)"
            >
              <Flex
                direction="column" align="center" justify="center" textAlign="center"
                border="2px dashed" borderColor="#CBD5E0" borderRadius="2xl"
                bg="linear-gradient(135deg, #FAFBFE, #F8FAFC)"
                minH="480px" p="10"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  borderColor: "#93C5FD",
                  bg: "linear-gradient(135deg, #F0F7FF, #EFF6FF)",
                  shadow: "inset 0 0 30px rgba(49,130,206,0.03)",
                }}
                cursor="pointer" position="relative"
              >
                {/* Decorative orb */}
                <Box
                  position="absolute" top="20%" right="15%"
                  w="120px" h="120px" borderRadius="full"
                  bg="radial-gradient(circle, rgba(49,130,206,0.04) 0%, transparent 70%)"
                />

                <Flex
                  w="20" h="20" borderRadius="2xl"
                  bg="linear-gradient(135deg, #EBF8FF, #DBEAFE)"
                  color="#2B6CB0" align="center" justify="center"
                  mb="6" shadow="0 4px 16px rgba(49,130,206,0.12)"
                >
                  <FileUp size={32} />
                </Flex>
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="800" color="#0F1B2D" mb="3"
                  letterSpacing="-0.02em"
                >
                  Drop Contract Here
                </Text>
                <Text
                  fontSize="md" color="#64748B"
                  maxW="420px" mb="7" lineHeight="1.8"
                >
                  PDF, DOCX, or scanned images. Max file size 50MB for deep neural processing.
                </Text>
                <Button
                  bg="linear-gradient(135deg, #2B6CB0, #3182CE)"
                  color="white" borderRadius="xl"
                  px="8" py="6" fontWeight="700" fontSize="md"
                  shadow="0 4px 16px rgba(49,130,206,0.3)"
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "0 8px 25px rgba(49,130,206,0.35)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.3s"
                >
                  <Plus size={18} />
                  Select File
                </Button>

                <SimpleGrid columns={2} gap="4" mt="10" w="100%" maxW="480px">
                  {[
                    {
                      icon: <Lock size={15} />,
                      label: "SECURITY",
                      value: "End-to-End Encryption",
                      gradient: "linear-gradient(135deg, #EBF8FF, #DBEAFE)",
                      color: "#2B6CB0",
                    },
                    {
                      icon: <Zap size={15} />,
                      label: "SPEED",
                      value: "Instant Pre-scan Active",
                      gradient: "linear-gradient(135deg, #F0FFF4, #DCFCE7)",
                      color: "#16A34A",
                    },
                  ].map((item) => (
                    <Flex
                      key={item.label}
                      bg="white" border="1px solid" borderColor="#E2E8F0"
                      borderRadius="xl" p="4" gap="3" align="center"
                      shadow="0 1px 3px rgba(0,0,0,0.03)"
                      transition="all 0.2s"
                      _hover={{ shadow: "0 4px 12px rgba(0,0,0,0.05)", transform: "translateY(-1px)" }}
                    >
                      <Flex
                        w="10" h="10" borderRadius="xl"
                        bg={item.gradient} color={item.color}
                        align="center" justify="center" flexShrink="0"
                      >
                        {item.icon}
                      </Flex>
                      <Box>
                        <Text fontSize="9px" fontWeight="800" color="#94A3B8" letterSpacing="0.15em">
                          {item.label}
                        </Text>
                        <Text fontSize="xs" fontWeight="700" color="#475569">
                          {item.value}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Flex>
            </Box>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <Flex direction="column" gap="5">
              {/* Document Classification Card */}
              <Box
                bg="white" border="1px solid" borderColor="#E2E8F0"
                borderRadius="2xl" p="7"
                shadow="0 1px 3px rgba(0,0,0,0.03)"
              >
                <Text
                  fontSize="xs" fontWeight="800" letterSpacing="0.15em"
                  color="#94A3B8" mb="5"
                >
                  DOCUMENT CLASSIFICATION
                </Text>

                {[
                  { label: "CONTRACT DOMAIN", id: "domain", defaultValue: "Commercial Business Agreement", options: ["Commercial Business Agreement", "Residential Lease", "Employment Contract"] },
                  { label: "USER PARTY IDENTITY", id: "party", defaultValue: "Landlord / Lessor", options: ["Landlord / Lessor", "Tenant / Lessee", "Service Provider"] },
                ].map((field) => (
                  <Box key={field.id} mb="5">
                    <Text fontSize="10px" fontWeight="800" letterSpacing="0.14em" color="#94A3B8" mb="2">
                      {field.label}
                    </Text>
                    <Box
                      as="select" id={field.id}
                      defaultValue={field.defaultValue}
                      w="100%" h="12"
                      border="1px solid" borderColor="#E2E8F0"
                      bg="#F8FAFC" borderRadius="xl" px="4"
                      fontSize="sm" color="#1E293B" fontWeight="600"
                      _focus={{ borderColor: "#93C5FD", outline: "none", shadow: "0 0 0 3px rgba(49,130,206,0.08)" }}
                      transition="all 0.2s"
                    >
                      {field.options.map((opt) => <option key={opt}>{opt}</option>)}
                    </Box>
                  </Box>
                ))}

                {/* Toggle */}
                <Flex justify="space-between" gap="4" align="flex-start">
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="700" color="#1E293B">Privacy Redaction</Text>
                    <Text fontSize="xs" color="#64748B" mt="1" lineHeight="1.7">
                      Automatically redact names, addresses, and financial values
                      before AI processing.
                    </Text>
                  </Box>
                  <Box
                    w="40px" h="22px" borderRadius="full"
                    bg="linear-gradient(135deg, #2B6CB0, #3182CE)"
                    position="relative" cursor="pointer" flexShrink="0" mt="1"
                    shadow="inset 0 1px 3px rgba(0,0,0,0.1)"
                  >
                    <Box
                      w="16px" h="16px" borderRadius="full" bg="white"
                      position="absolute" top="3px" left="21px"
                      shadow="0 1px 4px rgba(0,0,0,0.15)"
                    />
                  </Box>
                </Flex>
              </Box>

              {/* AI Recommendation */}
              <Box
                bg="linear-gradient(135deg, #EFF6FF, #DBEAFE)"
                border="1px solid" borderColor="#BFDBFE"
                borderRadius="2xl" p="6"
              >
                <Flex align="center" gap="2" mb="3">
                  <Sparkles size={14} color="#2B6CB0" />
                  <Text fontSize="xs" fontWeight="800" color="#2B6CB0" letterSpacing="0.08em">
                    AI RECOMMENDATION
                  </Text>
                </Flex>
                <Text fontSize="sm" color="#475569" lineHeight="1.8">
                  Based on current legal trends, we recommend enabling clause
                  comparison for multi-jurisdiction compliance.
                </Text>
              </Box>

              {/* Process Button */}
              <Button
                w="100%" h="14"
                bg="linear-gradient(135deg, #2B6CB0, #3182CE)"
                color="white" borderRadius="2xl"
                fontWeight="800" fontSize="md"
                shadow="0 4px 20px rgba(49,130,206,0.3)"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "0 8px 30px rgba(49,130,206,0.4)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.3s"
              >
                Process Analysis
                <ArrowRight size={18} />
              </Button>
            </Flex>
          </GridItem>
        </Grid>

        {/* Footer Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="5" mt="8">
          {[
            {
              label: "INSTITUTIONAL SECURITY",
              text: "SOC2 Type II compliant storage with zero-knowledge encryption protocols.",
              gradient: "linear-gradient(135deg, #EBF8FF, #DBEAFE)",
              color: "#2B6CB0",
            },
            {
              label: "LEGAL INTEGRITY",
              text: "Models trained on 10M+ curated judicial precedents and federal statutes.",
              gradient: "linear-gradient(135deg, #F0FFF4, #DCFCE7)",
              color: "#16A34A",
            },
            {
              label: "DOCUMENT LIFECYCLE",
              text: "Automated versioning and audit trails for every revision made.",
              gradient: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
              color: "#D97706",
            },
          ].map((item) => (
            <Box
              key={item.label}
              bg="white" borderRadius="2xl" p="7"
              border="1px solid" borderColor="#E2E8F0"
              shadow="0 1px 3px rgba(0,0,0,0.03)"
              transition="all 0.3s"
              _hover={{ transform: "translateY(-3px)", shadow: "0 8px 25px rgba(0,0,0,0.06)" }}
            >
              <Flex
                w="10" h="10" borderRadius="xl" mb="4"
                bg={item.gradient} color={item.color}
                align="center" justify="center"
              >
                <Shield size={16} />
              </Flex>
              <Text
                fontSize="10px" fontWeight="800" letterSpacing="0.15em"
                color="#94A3B8" mb="3"
              >
                {item.label}
              </Text>
              <Text fontSize="sm" color="#64748B" lineHeight="1.8">
                {item.text}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Upload;
