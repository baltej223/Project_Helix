import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
} from "@chakra-ui/react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  Loader2,
} from "lucide-react";

const RISK_COLORS = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#22C55E",
};

const getRiskLevel = (financialExposure) => {
  if (!financialExposure) return "low";
  if (financialExposure > 66) return "high";
  if (financialExposure > 33) return "medium";
  return "low";
};

const PdfViewer = ({ pdfData, clauses, onClauseHover, selectedClause }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Convert ArrayBuffer to Blob URL
  useEffect(() => {
    if (!pdfData) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setLoading(false);
      console.log("📄 PDF blob created:", blob.size, "bytes");
      
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (e) {
      console.error("Error creating blob:", e);
      setLoading(false);
    }
  }, [pdfData]);

  const handleClauseClick = (clause) => {
    if (onClauseHover) {
      onClauseHover(clause);
    }
  };

  if (!pdfData) {
    return (
      <Flex
        h="100%"
        align="center"
        justify="center"
        bg="#F8FAFC"
        borderRadius="2xl"
        flexDirection="column"
      >
        <FileText size={48} color="#94A3B8" />
        <Text mt="4" color="#64748B" fontSize="sm">
          Upload a PDF to view it here
        </Text>
      </Flex>
    );
  }

  if (loading) {
    return (
      <Flex
        h="100%"
        align="center"
        justify="center"
        bg="#F8FAFC"
        borderRadius="2xl"
        flexDirection="column"
      >
        <Loader2 size={40} className="animate-spin" style={{ color: "#0F172A" }} />
        <Text mt="4" color="#64748B" fontSize="sm">
          Loading PDF...
        </Text>
      </Flex>
    );
  }

  return (
    <Box h="100%" display="flex" flexDirection="column" bg="#F8FAFC" borderRadius="2xl" overflow="hidden">
      {/* PDF Render via object tag */}
      <Box
        flex="1"
        position="relative"
        bg="#64748B"
        p="4"
      >
        <Box
          position="relative"
          mx="auto"
          maxW="800px"
          h="100%"
          bg="white"
          shadow="lg"
        >
          <object
            data={blobUrl}
            type="application/pdf"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          >
            <Text color="#64748B" textAlign="center" p="4">
              Your browser doesn't support PDF viewing. 
              <br />
              Please download the PDF to view it.
            </Text>
          </object>
        </Box>
      </Box>

      {/* Clause List */}
      {clauses && clauses.length > 0 && (
        <Box
          h="120px"
          bg="white"
          borderTop="1px solid"
          borderColor="#E2E8F0"
          p="3"
          overflow="auto"
          flexShrink={0}
        >
          <Text fontSize="xs" fontWeight="700" color="#64748B" mb="2" letterSpacing="0.1em">
            CLAUSES ({clauses.length})
          </Text>
          <Flex gap="2" flexWrap="wrap">
            {clauses.map((clause, index) => (
              <Box
                key={index}
                px="2"
                py="1"
                borderRadius="md"
                cursor="pointer"
                onClick={() => handleClauseClick(clause)}
                bg={RISK_COLORS[getRiskLevel(clause.scores?.financialExposure)]}
                opacity={selectedClause?.index === clause.index ? 1 : 0.7}
                _hover={{ opacity: 1 }}
                transition="opacity 0.2s"
              >
                <Text fontSize="xs" fontWeight="600" color="white">
                  {clause.type || 'other'}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default PdfViewer;