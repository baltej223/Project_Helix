import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  SimpleGrid,
  Badge,
  Image,
} from "@chakra-ui/react";
import { Calendar, Filter, Globe, Search, Settings2, Star, ArrowRight, Sparkles, MapPin, Clock } from "lucide-react";

const Marketplace = () => {
  const lawyers = [
    {
      name: "Eleanor Vance, LL.M.",
      role: "Corporate M&A & Intellectual Property",
      rating: "4.9",
      reviews: "124",
      price: "$180",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Marcus Kaine",
      role: "Digital Privacy & Data Compliance",
      rating: "4.7",
      reviews: "82",
      price: "$120",
      location: "San Francisco, CA",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Samuel Whitlock",
      role: "Tax Litigation & Asset Protection",
      rating: "5.0",
      reviews: "215",
      price: "$250",
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Linda Amara",
      role: "Environmental Regulatory Law",
      rating: "4.8",
      reviews: "54",
      price: "$165",
      location: "Washington, DC",
      image: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Robert Jensen",
      role: "Commercial Real Estate & Leasing",
      rating: "4.6",
      reviews: "91",
      price: "$140",
      location: "Dallas, TX",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Sienna Chang",
      role: "Contractual Disputes & Risk Mitigation",
      rating: "4.9",
      reviews: "112",
      price: "$175",
      location: "Boston, MA",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=300&auto=format&fit=crop",
    },
  ];

  return (
    <Box minH="100%" bg="#F8FAFC" overflow="auto" p={{ base: "5", md: "8", lg: "10" }}>
      <Box maxW="1400px" mx="auto">
        {/* Header */}
        <Flex
          justify="space-between" align={{ base: "flex-start", md: "center" }}
          mb="8" flexWrap="wrap" gap="4"
        >
          <Box>
            <Text
              as="h1"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="900" color="#0F1B2D"
              letterSpacing="-0.03em" lineHeight="1.1"
            >
              Legal Marketplace
            </Text>
            <Text fontSize="md" color="#64748B" mt="2" lineHeight="1.7" maxW="520px">
              Connect with specialized legal consultants for verified analysis
              and transparent pricing.
            </Text>
          </Box>
          <Flex align="center" gap="2" bg="#F0FFF4" border="1px solid" borderColor="#C6F6D5" px="4" py="2" borderRadius="full">
            <Box w="2" h="2" borderRadius="full" bg="#16A34A" />
            <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" color="#16A34A">
              VERIFIED NETWORK
            </Text>
          </Flex>
        </Flex>

        {/* Filters */}
        <Flex
          gap="3" mb="8" flexWrap="wrap" align="center"
          bg="white" p="4" borderRadius="2xl"
          border="1px solid" borderColor="#E2E8F0"
          shadow="0 1px 3px rgba(0,0,0,0.03)"
        >
          <Flex
            flex="1" minW="240px" maxW="420px"
            bg="#F8FAFC" border="1px solid" borderColor="#E2E8F0"
            borderRadius="xl" px="4" h="12" align="center" gap="3"
            transition="all 0.2s"
            _focusWithin={{ borderColor: "#93C5FD", shadow: "0 0 0 3px rgba(49,130,206,0.08)" }}
          >
            <Search size={16} color="#94A3B8" />
            <Box
              as="input" placeholder="Search by name, firm, or keyword..."
              type="text" flex="1" border="none" outline="none"
              bg="transparent" fontSize="sm" color="#1E293B"
              _placeholder={{ color: "#CBD5E0" }}
            />
          </Flex>
          <Button
            variant="outline" borderColor="#E2E8F0" color="#475569"
            borderRadius="xl" fontSize="sm" fontWeight="600" h="12" px="5"
            _hover={{ bg: "#F8FAFC", borderColor: "#93C5FD", color: "#2B6CB0" }}
            transition="all 0.2s"
          >
            <Filter size={14} /> Specialization
          </Button>
          <Button
            variant="outline" borderColor="#E2E8F0" color="#475569"
            borderRadius="xl" fontSize="sm" fontWeight="600" h="12" px="5"
            _hover={{ bg: "#F8FAFC", borderColor: "#93C5FD", color: "#2B6CB0" }}
            transition="all 0.2s"
          >
            <Calendar size={14} /> Availability
          </Button>
          <Button
            bg="linear-gradient(135deg, #2B6CB0, #3182CE)"
            color="white" borderRadius="xl" fontSize="sm" fontWeight="700"
            h="12" px="7"
            shadow="0 2px 8px rgba(49,130,206,0.25)"
            _hover={{
              shadow: "0 6px 20px rgba(49,130,206,0.35)",
              transform: "translateY(-1px)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
          >
            Apply Filters
          </Button>
        </Flex>

        {/* Lawyer Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6" mb="10">
          {lawyers.map((lawyer, index) => (
            <Box
              key={lawyer.name}
              bg="white" borderRadius="2xl" overflow="hidden"
              border="1px solid" borderColor="#E2E8F0"
              shadow="0 1px 3px rgba(0,0,0,0.03)"
              transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: "translateY(-8px)",
                shadow: "0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(49,130,206,0.06)",
                borderColor: "#BEE3F8",
              }}
              role="group" cursor="pointer"
            >
              {/* Gradient accent */}
              <Box
                h="4px"
                bg="linear-gradient(90deg, #2B6CB0, #3182CE, #38B2AC)"
                opacity="0.7" transition="opacity 0.3s"
                _groupHover={{ opacity: 1 }}
              />

              <Box p="6">
                {/* Profile row */}
                <Flex gap="4" mb="5">
                  <Box position="relative" flexShrink="0">
                    <Image
                      src={lawyer.image} alt={lawyer.name}
                      w="16" h="16" borderRadius="2xl"
                      objectFit="cover" border="3px solid" borderColor="#F1F5F9"
                      shadow="0 4px 12px rgba(0,0,0,0.08)"
                    />
                    <Box
                      position="absolute" bottom="-1px" right="-1px"
                      w="4" h="4" borderRadius="full"
                      bg={index === 4 ? "#F59E0B" : "#16A34A"}
                      border="2.5px solid white"
                      shadow={`0 0 8px ${index === 4 ? "rgba(245,158,11,0.4)" : "rgba(22,163,74,0.4)"}`}
                    />
                  </Box>
                  <Box flex="1" minW="0">
                    <Text fontSize="md" fontWeight="800" color="#0F1B2D" mb="0.5" lineHeight="1.3"
                      overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap"
                    >
                      {lawyer.name}
                    </Text>
                    <Text fontSize="sm" color="#64748B" lineHeight="1.5" mb="2">
                      {lawyer.role}
                    </Text>
                    <Flex gap="3" align="center" flexWrap="wrap">
                      <Flex align="center" gap="1">
                        <Star size={13} fill="#FBBF24" color="#FBBF24" />
                        <Text fontSize="sm" fontWeight="800" color="#1E293B">{lawyer.rating}</Text>
                        <Text fontSize="xs" color="#94A3B8">({lawyer.reviews})</Text>
                      </Flex>
                      <Flex align="center" gap="1" color="#94A3B8">
                        <MapPin size={11} />
                        <Text fontSize="xs">{lawyer.location}</Text>
                      </Flex>
                    </Flex>
                  </Box>
                </Flex>

                {/* Bottom */}
                <Box pt="5" borderTop="1px solid" borderColor="#F1F5F9">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="10px" fontWeight="700" color="#94A3B8" letterSpacing="0.12em" mb="1">
                        CONSULTATION
                      </Text>
                      <Flex align="baseline" gap="1">
                        <Text fontSize="xl" fontWeight="900" color="#0F1B2D">{lawyer.price}</Text>
                        <Text fontSize="xs" color="#94A3B8" fontWeight="500">/ 30 min</Text>
                      </Flex>
                    </Box>
                    <Button
                      bg="linear-gradient(135deg, #2B6CB0, #3182CE)"
                      color="white" borderRadius="xl" fontSize="sm" fontWeight="700"
                      px="6" py="5"
                      shadow="0 2px 8px rgba(49,130,206,0.2)"
                      _hover={{
                        shadow: "0 6px 20px rgba(49,130,206,0.3)",
                        transform: "translateY(-2px)",
                      }}
                      _active={{ transform: "translateY(0)" }}
                      transition="all 0.3s"
                    >
                      Book Now
                    </Button>
                  </Flex>
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {/* AI Recommended Section */}
        <Box
          bg="white" borderRadius="3xl" overflow="hidden"
          border="1px solid" borderColor="#E2E8F0"
          shadow="0 1px 3px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)"
          mb="10" position="relative"
        >
          {/* Top accent */}
          <Box h="4px" bg="linear-gradient(90deg, #2B6CB0, #3182CE, #38B2AC, #16A34A)" />

          <Grid templateColumns={{ base: "1fr", lg: "1.4fr 1fr" }}>
            <Box p={{ base: "8", md: "10", lg: "12" }}>
              <Flex align="center" gap="2" mb="5">
                <Flex
                  w="7" h="7" borderRadius="lg"
                  bg="linear-gradient(135deg, #EBF8FF, #DBEAFE)"
                  color="#2B6CB0" align="center" justify="center"
                >
                  <Sparkles size={14} />
                </Flex>
                <Text fontSize="xs" fontWeight="800" letterSpacing="0.12em" color="#2B6CB0">
                  AI-MATCHED SPECIALIST
                </Text>
              </Flex>

              <Text
                as="h2"
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                fontWeight="900" color="#0F1B2D"
                letterSpacing="-0.03em" lineHeight="1.15" mb="4"
              >
                Recommended for your
                <br />
                recent M&amp;A Analysis
              </Text>
              <Text fontSize="md" color="#64748B" lineHeight="1.85" mb="8" maxW="480px">
                Based on your uploaded documents, Dr. Aris Thorne specializes in
                the specific cross-border regulatory hurdles identified in your
                last risk profile.
              </Text>
              <Flex gap="4" flexWrap="wrap">
                <Button
                  bg="linear-gradient(135deg, #2B6CB0, #3182CE)"
                  color="white" borderRadius="xl" fontWeight="700" fontSize="sm"
                  px="8" py="6"
                  shadow="0 4px 16px rgba(49,130,206,0.25)"
                  _hover={{
                    shadow: "0 8px 25px rgba(49,130,206,0.35)",
                    transform: "translateY(-2px)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.3s"
                >
                  Schedule Priority Sync
                  <ArrowRight size={15} />
                </Button>
                <Button
                  variant="ghost" color="#2B6CB0" fontWeight="700" fontSize="sm"
                  borderRadius="xl" px="6" py="6"
                  _hover={{ bg: "#EFF6FF" }}
                  transition="all 0.2s"
                >
                  View Deep Profile
                </Button>
              </Flex>
            </Box>

            <Box
              bg="linear-gradient(135deg, #F8FAFC, #F1F5F9)"
              p={{ base: "8", md: "10" }}
              borderLeft={{ base: "none", lg: "1px solid" }}
              borderTop={{ base: "1px solid", lg: "none" }}
              borderColor="#E2E8F0"
              display="flex" flexDirection="column" justifyContent="center"
            >
              <SimpleGrid columns={2} gap="4" mb="6">
                {[
                  { label: "TIER 1 EXPERT", value: "98%", sub: "Relevance Match", color: "#2B6CB0" },
                  { label: "RESPONSE TIME", value: "< 2hrs", sub: "Avg. turnaround", color: "#0D9488" },
                ].map((stat) => (
                  <Box
                    key={stat.label}
                    bg="white" borderRadius="2xl" p="5"
                    border="1px solid" borderColor="#E2E8F0"
                    textAlign="center"
                    shadow="0 1px 3px rgba(0,0,0,0.03)"
                    transition="all 0.3s"
                    _hover={{ shadow: "0 4px 16px rgba(0,0,0,0.06)", transform: "translateY(-2px)" }}
                  >
                    <Text fontSize="9px" fontWeight="800" color="#94A3B8" letterSpacing="0.15em" mb="2">
                      {stat.label}
                    </Text>
                    <Text fontSize="2xl" fontWeight="900" color={stat.color} mb="1">
                      {stat.value}
                    </Text>
                    <Text fontSize="xs" color="#94A3B8">{stat.sub}</Text>
                  </Box>
                ))}
              </SimpleGrid>

              <Flex
                bg="white" borderRadius="2xl" p="5"
                border="1px solid" borderColor="#E2E8F0"
                align="center" gap="4"
                shadow="0 1px 3px rgba(0,0,0,0.03)"
              >
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"
                  alt="Dr. Aris Thorne"
                  w="14" h="14" borderRadius="2xl" objectFit="cover"
                  border="3px solid" borderColor="#F1F5F9"
                  shadow="0 4px 12px rgba(0,0,0,0.08)"
                />
                <Box>
                  <Text fontSize="md" fontWeight="800" color="#0F1B2D">Dr. Aris Thorne</Text>
                  <Text fontSize="sm" color="#64748B">Senior Counsel, Global Regulations</Text>
                  <Flex align="center" gap="1" mt="1">
                    <Star size={12} fill="#FBBF24" color="#FBBF24" />
                    <Text fontSize="sm" fontWeight="700" color="#1E293B">4.9</Text>
                    <Text fontSize="xs" color="#94A3B8">· 340 cases</Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          bg="white" borderRadius="3xl"
          border="1px solid" borderColor="#E2E8F0"
          shadow="0 1px 3px rgba(0,0,0,0.03)"
          p={{ base: "8", md: "10" }}
        >
          <Grid
            templateColumns={{ base: "1fr", md: "2.5fr 1fr 1fr 1fr" }}
            gap={{ base: "8", md: "12" }}
          >
            <Box>
              <Text fontSize="lg" fontWeight="900" color="#0F1B2D" mb="3" letterSpacing="-0.02em">
                LegalLens AI
              </Text>
              <Text fontSize="sm" color="#64748B" lineHeight="1.85" mb="4" maxW="300px">
                The next-generation legal workspace. Bridging the gap between
                AI-powered data and human legal intuition.
              </Text>
              <Text fontSize="xs" color="#CBD5E0">
                © 2024 LegalLens Technologies. All rights reserved.
              </Text>
            </Box>
            {[
              { title: "PLATFORM", links: ["Analyzer", "Marketplace", "API Docs"] },
              { title: "LAWYERS", links: ["Join Network", "Provider Portal", "Best Practices"] },
              { title: "LEGAL", links: ["Privacy Policy", "Compliance", "Terms of Service"] },
            ].map((col) => (
              <Box key={col.title}>
                <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" color="#94A3B8" mb="4">
                  {col.title}
                </Text>
                <Flex direction="column" gap="3">
                  {col.links.map((link) => (
                    <Text
                      key={link} as="a" href="#" fontSize="sm" color="#64748B" fontWeight="500"
                      _hover={{ color: "#2B6CB0" }} transition="color 0.2s"
                    >
                      {link}
                    </Text>
                  ))}
                </Flex>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Marketplace;
