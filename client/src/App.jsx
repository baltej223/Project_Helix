import React from "react";
import { Box, Flex, Text, Button, Image } from "@chakra-ui/react";
import { Bell, Settings, Shield, Search } from "lucide-react";
import {
  BrowserRouter as Router,
  NavLink,
  Routes,
  Route,
} from "react-router-dom";
import Analysis from "./pages/Analysis";
import Upload from "./pages/Upload";
import Benchmarks from "./pages/Benchmarks";
import Marketplace from "./pages/Marketplace";
import LandingPage from "./pages/LandingPage";

const navItems = [
  { label: "Upload", path: "/upload" },
  { label: "Analysis", path: "/analysis" },
  { label: "Benchmarks", path: "/benchmarks" },
  { label: "Marketplace", path: "/marketplace" },
];

function TopNav() {
  return (
    <Box
      as="header"
      h="68px"
      bg="rgba(255,255,255,0.85)"
      backdropFilter="blur(24px) saturate(200%)"
      borderBottom="1px solid"
      borderColor="rgba(226,232,240,0.6)"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={{ base: "5", md: "8" }}
      position="sticky"
      top="0"
      zIndex="100"
    >
      {/* Brand */}
      <Flex align="center" gap="3.5">
        <Flex
          w="9" h="9" borderRadius="xl"
          bg="linear-gradient(135deg, #2B6CB0, #3182CE)"
          color="white" align="center" justify="center"
          shadow="0 3px 12px rgba(49,130,206,0.3)"
        >
          <Shield size={17} />
        </Flex>
        <Text
          as={NavLink} to="/"
          fontSize="lg" fontWeight="900"
          letterSpacing="-0.04em" color="#0F1B2D"
          _hover={{ textDecoration: "none" }}
        >
          LegalLens AI
        </Text>
      </Flex>

      {/* Nav Links — pill container */}
      <Flex
        as="nav" align="center" gap="1"
        display={{ base: "none", md: "flex" }}
        bg="rgba(241,245,249,0.6)"
        border="1px solid" borderColor="rgba(226,232,240,0.5)"
        borderRadius="full" px="2" py="1.5"
      >
        {navItems.map((item) => (
          <Box
            key={item.path}
            as={NavLink}
            to={item.path}
            end={item.path === "/upload"}
            display="inline-flex"
            alignItems="center"
            px="4" py="2"
            fontSize="sm"
            fontWeight="600"
            color="#64748B"
            borderRadius="full"
            transition="all 0.25s"
            _hover={{ color: "#1E293B", bg: "rgba(255,255,255,0.8)" }}
            sx={{
              "&.active": {
                color: "#1E293B",
                bg: "white",
                fontWeight: "700",
                shadow: "0 1px 3px rgba(0,0,0,0.06)",
              },
            }}
          >
            {item.label}
          </Box>
        ))}
      </Flex>

      {/* Actions */}
      <Flex align="center" gap="1.5">
        <Flex
          as="button" w="9" h="9" borderRadius="xl"
          align="center" justify="center" color="#94A3B8"
          bg="transparent" border="none" cursor="pointer"
          _hover={{ bg: "#F1F5F9", color: "#475569" }}
          transition="all 0.2s" aria-label="Notifications"
        >
          <Bell size={17} />
        </Flex>
        <Flex
          as="button" w="9" h="9" borderRadius="xl"
          align="center" justify="center" color="#94A3B8"
          bg="transparent" border="none" cursor="pointer"
          _hover={{ bg: "#F1F5F9", color: "#475569" }}
          transition="all 0.2s" aria-label="Settings"
        >
          <Settings size={17} />
        </Flex>
        <Box w="1px" h="6" bg="#E2E8F0" mx="1" />
        <Image
          w="9" h="9" borderRadius="xl"
          border="2.5px solid" borderColor="#E2E8F0"
          objectFit="cover"
          shadow="0 2px 8px rgba(0,0,0,0.06)"
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
          alt="User profile"
        />
      </Flex>
    </Box>
  );
}

function DashboardLayout({ children }) {
  return (
    <Box h="100vh" bg="#F8FAFC">
      <TopNav />
      <Box as="main" h="calc(100vh - 68px)">
        {children}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<DashboardLayout><Upload /></DashboardLayout>} />
        <Route path="/analysis" element={<DashboardLayout><Analysis /></DashboardLayout>} />
        <Route path="/benchmarks" element={<DashboardLayout><Benchmarks /></DashboardLayout>} />
        <Route path="/marketplace" element={<DashboardLayout><Marketplace /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
