import React, { useState } from "react";
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
import {
  Phone,
  ShieldCheck,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Home,
  Users,
  Scale,
  ShieldAlert,
  FileText,
  CheckCircle2,
} from "lucide-react";

const categories = [
  { name: "Divorce", icon: <Users size={16} /> },
  { name: "Property", icon: <Home size={16} /> },
  { name: "Employment", icon: <Briefcase size={16} /> },
  { name: "Criminal", icon: <Scale size={16} /> },
  { name: "Consumer", icon: <ShieldAlert size={16} /> },
  { name: "Contracts", icon: <FileText size={16} /> },
];

const Marketplace = () => {
  const [selectedDate, setSelectedDate] = useState(18);

  // Simple calendar generation for mockup
  const daysInMonth = 30;
  const startDay = 3; // Wednesday
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  return (
    <Box minH="100%" bg="#F8FAFC" overflow="auto">
      {/* Hero Section */}
      <Box
        position="relative"
        bg="#0F172A"
        overflow="hidden"
        px={{ base: "5", md: "10", lg: "16" }}
        py={{ base: "12", lg: "20" }}
      >
        {/* Background Image & Overlay */}
        <Box
          position="absolute"
          top="0"
          right="0"
          w={{ base: "100%", lg: "60%" }}
          h="100%"
          opacity="0.4"
        >
          <Image
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Courtroom interior"
            w="100%"
            h="100%"
            objectFit="cover"
            maskImage="linear-gradient(to right, transparent, black)"
            WebkitMaskImage="linear-gradient(to right, transparent, black)"
          />
        </Box>
        <Box
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bg="linear-gradient(90deg, #0F172A 40%, rgba(15,23,42,0.8) 70%, transparent 100%)"
        />

        {/* Hero Content */}
        <Box position="relative" zIndex="1" maxW="1400px" mx="auto">
          <Badge
            bg="rgba(255,255,255,0.1)"
            color="#CBD5E0"
            border="1px solid rgba(255,255,255,0.2)"
            px="3"
            py="1"
            borderRadius="full"
            fontSize="xs"
            fontWeight="800"
            letterSpacing="0.1em"
            mb="6"
          >
            CONFIDENTIAL & SECURE
          </Badge>

          <Text
            as="h1"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            fontWeight="900"
            color="white"
            lineHeight="1.1"
            letterSpacing="-0.03em"
            mb="4"
          >
            Online Legal{" "}
            <Text as="span" color="#F59E0B">
              Consultation
            </Text>
            <br />
            Anytime Anywhere
          </Text>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="#94A3B8"
            maxW="540px"
            lineHeight="1.6"
            mb="10"
          >
            Connect instantly with top-tier legal experts. Enterprise-grade
            consultations without the traditional law firm overhead.
          </Text>

          {/* Stats Pills */}
          <Flex gap="4" mb="10" flexWrap="wrap">
            <Flex
              align="center"
              gap="3"
              bg="rgba(255,255,255,0.05)"
              border="1px solid rgba(255,255,255,0.1)"
              backdropFilter="blur(10px)"
              px="4"
              py="2"
              borderRadius="full"
            >
              <Flex gap="-2">
                {[
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
                ].map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    w="7"
                    h="7"
                    borderRadius="full"
                    border="2px solid #0F172A"
                    ml={i !== 0 ? "-3" : "0"}
                  />
                ))}
              </Flex>
              <Text fontSize="sm" color="white" fontWeight="600">
                +197 Online Lawyers
              </Text>
              <Box w="2" h="2" borderRadius="full" bg="#22C55E" />
            </Flex>

            <Flex
              align="center"
              gap="3"
              bg="rgba(255,255,255,0.05)"
              border="1px solid rgba(255,255,255,0.1)"
              backdropFilter="blur(10px)"
              px="4"
              py="2"
              borderRadius="full"
            >
              <Flex
                w="7"
                h="7"
                borderRadius="full"
                bg="rgba(255,255,255,0.1)"
                align="center"
                justify="center"
                color="white"
              >
                <Phone size={14} />
              </Flex>
              <Text fontSize="sm" color="white" fontWeight="600">
                +26 Active Consultations
              </Text>
              <Box w="2" h="2" borderRadius="full" bg="#F59E0B" />
            </Flex>
          </Flex>

          <Button
            bg="linear-gradient(135deg, #0F172A, #1E293B)"
            border="1px solid rgba(255,255,255,0.1)"
            color="white"
            size="lg"
            h="14"
            px="10"
            borderRadius="xl"
            fontWeight="800"
            fontSize="md"
            shadow="0 4px 20px rgba(15,23,42,0.4)"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "0 8px 30px rgba(15,23,42,0.5)",
              bg: "linear-gradient(135deg, #1E293B, #334155)"
            }}
            transition="all 0.3s"
          >
            Consult Now
          </Button>

          {/* Trust Indicators */}
          <Flex gap={{ base: "6", md: "10" }} mt="16" flexWrap="wrap">
            <Box>
              <Flex align="center" gap="2" mb="1">
                <ShieldCheck size={18} color="white" />
                <Text fontSize="md" fontWeight="800" color="white">
                  Trusted
                </Text>
              </Flex>
              <Flex align="center" gap="1">
                <Text fontSize="sm" color="#94A3B8">
                  4.8
                </Text>
                <Star size={12} fill="#F59E0B" color="#F59E0B" />
              </Flex>
            </Box>
            <Box borderLeft="1px solid rgba(255,255,255,0.1)" pl={{ base: "6", md: "10" }}>
              <Flex align="center" gap="2" mb="1">
                <ShieldAlert size={18} color="white" />
                <Text fontSize="md" fontWeight="800" color="white">
                  Secured
                </Text>
              </Flex>
              <Text fontSize="sm" color="#94A3B8">
                256bit encryption
              </Text>
            </Box>
            <Box borderLeft="1px solid rgba(255,255,255,0.1)" pl={{ base: "6", md: "10" }}>
              <Flex align="center" gap="2" mb="1">
                <Clock size={18} color="white" />
                <Text fontSize="md" fontWeight="800" color="white">
                  Convenient
                </Text>
              </Flex>
              <Text fontSize="sm" color="#94A3B8">
                Audio and Internet call 24x7
              </Text>
            </Box>
          </Flex>

          {/* Categories */}
          <Flex align="center" gap="6" mt="12" borderTop="1px solid rgba(255,255,255,0.1)" pt="6" overflowX="auto" pb="2">
            <Text fontSize="xs" fontWeight="800" color="white" letterSpacing="0.1em" flexShrink="0">
              CONSULT ON:
            </Text>
            {categories.map((cat) => (
              <Flex
                key={cat.name}
                align="center"
                gap="2"
                color="#CBD5E0"
                cursor="pointer"
                _hover={{ color: "white" }}
                transition="color 0.2s"
                flexShrink="0"
              >
                {cat.icon}
                <Text fontSize="sm" fontWeight="600">
                  {cat.name}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* Booking Calendar Section */}
      <Box maxW="1400px" mx="auto" p={{ base: "5", md: "10", lg: "16" }}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 400px" }} gap="10">
          <Box>
            <Text fontSize="2xl" fontWeight="900" color="#0F1B2D" mb="2" letterSpacing="-0.02em">
              Your Upcoming Consultations
            </Text>
            <Text fontSize="md" color="#64748B" mb="8">
              Select a date to view your scheduled calls or book a new session with an available expert.
            </Text>

            {/* Calendar UI */}
            <Box
              bg="white"
              borderRadius="3xl"
              border="1px solid"
              borderColor="#E2E8F0"
              p="8"
              shadow="0 4px 20px rgba(0,0,0,0.03)"
            >
              {/* Calendar Header */}
              <Flex justify="space-between" align="center" mb="6">
                <Text fontSize="xl" fontWeight="800" color="#0F1B2D">
                  April 2026
                </Text>
                <Flex gap="2">
                  <Flex
                    w="10"
                    h="10"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="#E2E8F0"
                    align="center"
                    justify="center"
                    cursor="pointer"
                    _hover={{ bg: "#F8FAFC" }}
                  >
                    <ChevronLeft size={18} color="#64748B" />
                  </Flex>
                  <Flex
                    w="10"
                    h="10"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="#E2E8F0"
                    align="center"
                    justify="center"
                    cursor="pointer"
                    _hover={{ bg: "#F8FAFC" }}
                  >
                    <ChevronRight size={18} color="#64748B" />
                  </Flex>
                </Flex>
              </Flex>

              {/* Days of Week */}
              <Grid templateColumns="repeat(7, 1fr)" gap="2" mb="4">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                  <Text key={day} textAlign="center" fontSize="xs" fontWeight="800" color="#94A3B8" letterSpacing="0.05em">
                    {day}
                  </Text>
                ))}
              </Grid>

              {/* Dates */}
              <Grid templateColumns="repeat(7, 1fr)" gap="2">
                {blanks.map((b) => (
                  <Box key={`blank-${b}`} h="12" />
                ))}
                {days.map((day) => {
                  const isSelected = day === selectedDate;
                  const hasBooking = day === 18 || day === 24;

                  return (
                    <Flex
                      key={day}
                      h="12"
                      align="center"
                      justify="center"
                      borderRadius="xl"
                      cursor="pointer"
                      position="relative"
                      bg={isSelected ? "linear-gradient(135deg, #0F172A, #1E293B)" : "transparent"}
                      color={isSelected ? "white" : "#1E293B"}
                      fontWeight={isSelected ? "800" : "600"}
                      _hover={!isSelected ? { bg: "#F1F5F9" } : {}}
                      onClick={() => setSelectedDate(day)}
                      transition="all 0.2s"
                    >
                      {day}
                      {hasBooking && !isSelected && (
                        <Box
                          position="absolute"
                          bottom="2"
                          w="1.5"
                          h="1.5"
                          borderRadius="full"
                          bg="#0F1B2D"
                        />
                      )}
                      {hasBooking && isSelected && (
                        <Box
                          position="absolute"
                          bottom="2"
                          w="1.5"
                          h="1.5"
                          borderRadius="full"
                          bg="white"
                        />
                      )}
                    </Flex>
                  );
                })}
              </Grid>
            </Box>
          </Box>

          {/* Booking Details / Active Schedule */}
          <Box>
            <Box
              bg="white"
              borderRadius="3xl"
              border="1px solid"
              borderColor="#E2E8F0"
              p="6"
              shadow="0 4px 20px rgba(0,0,0,0.03)"
              h="100%"
            >
              <Text fontSize="sm" fontWeight="800" color="#94A3B8" letterSpacing="0.1em" mb="6">
                SCHEDULE FOR APR {selectedDate}
              </Text>

              {selectedDate === 18 ? (
                <Box>
                  <Box
                    bg="#F8FAFC"
                    border="1px solid"
                    borderColor="#E2E8F0"
                    borderRadius="2xl"
                    p="5"
                    mb="4"
                  >
                    <Flex justify="space-between" align="flex-start" mb="4">
                      <Box>
                        <Badge
                          bg="#F1F5F9"
                          color="#334155"
                          px="2"
                          py="1"
                          borderRadius="md"
                          fontSize="9px"
                          fontWeight="800"
                          mb="2"
                          border="1px solid"
                          borderColor="#E2E8F0"
                        >
                          UPCOMING CALL
                        </Badge>
                        <Text fontSize="md" fontWeight="800" color="#0F1B2D">
                          Corporate Restructuring
                        </Text>
                      </Box>
                      <Box textAlign="right">
                        <Text fontSize="lg" fontWeight="900" color="#0F1B2D">
                          10:30 AM
                        </Text>
                        <Text fontSize="xs" color="#64748B" fontWeight="600">
                          30 Min Duration
                        </Text>
                      </Box>
                    </Flex>
                    
                    <Flex align="center" gap="3" pt="4" borderTop="1px solid" borderColor="#E2E8F0">
                      <Image
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop"
                        w="10"
                        h="10"
                        borderRadius="full"
                        objectFit="cover"
                      />
                      <Box>
                        <Text fontSize="sm" fontWeight="700" color="#0F1B2D">
                          Dr. Aris Thorne
                        </Text>
                        <Text fontSize="xs" color="#64748B">
                          Senior Legal Counsel
                        </Text>
                      </Box>
                      <Flex
                        ml="auto"
                        w="8"
                        h="8"
                        borderRadius="full"
                        bg="#E2E8F0"
                        align="center"
                        justify="center"
                        color="#64748B"
                        cursor="pointer"
                        _hover={{ bg: "#CBD5E0" }}
                      >
                        <Phone size={14} />
                      </Flex>
                    </Flex>
                  </Box>

                  <Button
                    w="100%"
                    variant="outline"
                    border="1px solid"
                    borderColor="#E2E8F0"
                    color="#0F1B2D"
                    h="12"
                    borderRadius="xl"
                    fontWeight="700"
                    _hover={{ bg: "#F8FAFC" }}
                  >
                    Book New Session
                  </Button>
                </Box>
              ) : selectedDate === 24 ? (
                <Box>
                  <Box
                    bg="#F8FAFC"
                    border="1px solid"
                    borderColor="#E2E8F0"
                    borderRadius="2xl"
                    p="5"
                    mb="4"
                  >
                    <Flex justify="space-between" align="flex-start" mb="4">
                      <Box>
                        <Badge
                          bg="#F1F5F9"
                          color="#334155"
                          px="2"
                          py="1"
                          borderRadius="md"
                          fontSize="9px"
                          fontWeight="800"
                          mb="2"
                          border="1px solid"
                          borderColor="#E2E8F0"
                        >
                          SCHEDULED
                        </Badge>
                        <Text fontSize="md" fontWeight="800" color="#0F1B2D">
                          IP Rights Review
                        </Text>
                      </Box>
                      <Box textAlign="right">
                        <Text fontSize="lg" fontWeight="900" color="#0F1B2D">
                          2:00 PM
                        </Text>
                        <Text fontSize="xs" color="#64748B" fontWeight="600">
                          45 Min Duration
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Button
                    w="100%"
                    variant="outline"
                    border="1px solid"
                    borderColor="#E2E8F0"
                    color="#0F1B2D"
                    h="12"
                    borderRadius="xl"
                    fontWeight="700"
                    _hover={{ bg: "#F8FAFC" }}
                  >
                    Book New Session
                  </Button>
                </Box>
              ) : (
                <Box textAlign="center" py="10">
                  <Flex
                    w="16"
                    h="16"
                    borderRadius="2xl"
                    bg="#F1F5F9"
                    color="#94A3B8"
                    align="center"
                    justify="center"
                    mx="auto"
                    mb="4"
                  >
                    <CheckCircle2 size={24} />
                  </Flex>
                  <Text fontSize="md" fontWeight="700" color="#0F1B2D" mb="2">
                    No Consultations Scheduled
                  </Text>
                  <Text fontSize="sm" color="#64748B" mb="6">
                    You have no active bookings for this date.
                  </Text>
                  <Button
                    bg="linear-gradient(135deg, #0F172A, #1E293B)"
                    color="white"
                    h="12"
                    px="6"
                    borderRadius="xl"
                    fontWeight="700"
                    shadow="0 4px 12px rgba(15,23,42,0.3)"
                    _hover={{ transform: "translateY(-1px)", shadow: "0 6px 16px rgba(15,23,42,0.4)" }}
                  >
                    Book a Consultation
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Marketplace;
