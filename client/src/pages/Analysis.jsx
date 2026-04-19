import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  Badge,
  VStack,
} from "@chakra-ui/react";
import {
  Sparkles,
  AlertTriangle,
  Loader2,
  Brain,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import PdfViewer from "../components/PdfViewer";
import { getJobStatus, getClauses, getJobSummary, fetchPdfAsArrayBuffer } from "../services/api";

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

const Analysis = () => {
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("docId");
  const jobId = searchParams.get("jobId");

  const [loading, setLoading] = useState(true);
  const [isThinking, setIsThinking] = useState(true);
  const [clauses, setClauses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [selectedClause, setSelectedClause] = useState(null);
  const [error, setError] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  // Fetch PDF from server as ArrayBuffer
  useEffect(() => {
    if (docId) {
      const loadPdf = async () => {
        try {
          console.log("📄 Fetching PDF from server...");
          const arrayBuffer = await fetchPdfAsArrayBuffer(docId);
          setPdfData(arrayBuffer);
          console.log("📄 PDF loaded:", arrayBuffer.byteLength, "bytes");
        } catch (e) {
          console.error("Failed to fetch PDF:", e);
        }
      };
      loadPdf();
    }
  }, [docId]);

  const fetchJobData = useCallback(async () => {
    if (!jobId) return;

    try {
      const statusRes = await getJobStatus(jobId);
      const statusData = statusRes.data;
      setJobStatus(statusData);

      if (statusData.status === "completed") {
        setIsThinking(false);
        try {
          const clausesRes = await getClauses(jobId);
          setClauses(clausesRes.data.clauses || []);
        } catch (e) {
          console.warn("No clauses yet:", e);
        }
        try {
          const summaryRes = await getJobSummary(jobId);
          setSummary(summaryRes.data);
        } catch (e) {
          console.warn("No summary yet:", e);
        }
      } else if (statusData.status === "failed") {
        setIsThinking(false);
        setError("Analysis failed. Please try again.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching job:", err);
      setError(err.message);
      setLoading(false);
      setIsThinking(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    fetchJobData();

    const pollInterval = setInterval(async () => {
      if (!jobId) return;
      try {
        const statusRes = await getJobStatus(jobId);
        const statusData = statusRes.data;
        setJobStatus(statusData);

        if (statusData.status === "completed") {
          clearInterval(pollInterval);
          setIsThinking(false);
          await fetchJobData();
        } else if (statusData.status === "failed") {
          clearInterval(pollInterval);
          setIsThinking(false);
          setError("Analysis failed. Please try again.");
        } else {
          setIsThinking(true);
        }
      } catch (e) {
        console.warn("Polling error:", e);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [jobId, fetchJobData]);

  const handleClauseClick = (clause) => {
    setSelectedClause(clause);
  };

  if (!docId || !jobId) {
    return (
      <Flex h="100%" align="center" justify="center" bg="#F8FAFC" flexDirection="column">
        <Box textAlign="center" p="8">
          <FileText size={48} color="#94A3B8" />
          <Text fontSize="lg" fontWeight="700" color="#0F1B2D" mt="4">
            No document selected
          </Text>
          <Text fontSize="sm" color="#64748B" mt="2">
            Please upload a document first.
          </Text>
          <Button
            as={Link}
            to="/upload"
            mt="4"
            bg="linear-gradient(135deg, #0F172A, #1E293B)"
            color="white"
            borderRadius="xl"
            fontWeight="700"
          >
            Go to Upload
          </Button>
        </Box>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex h="100%" align="center" justify="center" bg="#F8FAFC">
        <Box textAlign="center" p="8" color="#DC2626">
          <AlertTriangle size={40} style={{ margin: "0 auto" }} />
          <Text mt="4" fontSize="lg" fontWeight="700">
            {error}
          </Text>
          <Button
            as={Link}
            to="/upload"
            mt="4"
            variant="outline"
            borderColor="#E2E8F0"
            color="#64748B"
          >
            Upload New Document
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "1.5fr 1fr" }}
      h="100%"
      bg="#F8FAFC"
    >
      <Box p="4" overflow="hidden" display="flex" flexDirection="column">
        <PdfViewer
          pdfData={pdfData}
          clauses={clauses}
          onClauseHover={handleClauseClick}
          selectedClause={selectedClause}
        />
      </Box>

      <Box
        bg="white"
        borderLeft="1px solid"
        borderColor="#E2E8F0"
        p="5"
        overflow="auto"
      >
        {isThinking || loading ? (
          <Flex h="300px" align="center" justify="center" flexDirection="column">
            <Box position="relative">
              <Brain size={48} color="#0F172A" className="animate-pulse" />
              <Box
                position="absolute"
                bottom="-10px"
                left="50%"
                transform="translateX(-50%)"
                bg="#0F172A"
                color="white"
                borderRadius="full"
                p="1"
              >
                <Loader2 size={16} className="animate-spin" />
              </Box>
            </Box>
            <Text mt="6" fontSize="md" fontWeight="700" color="#0F1B2D">
              Analyzing Contract
            </Text>
            <Text fontSize="sm" color="#64748B" mt="2">
              {jobStatus?.progress
                ? `${jobStatus.progress.processedClauses || 0} / ${jobStatus.progress.totalClauses || '?'} clauses`
                : "Processing document..."}
            </Text>
            <Box mt="4" w="200px" h="2px" bg="#E2E8F0" borderRadius="full" overflow="hidden">
              <Box
                h="100%"
                bg="linear-gradient(90deg, #0F172A, #64748B)"
                borderRadius="full"
                animation="pulse 1.5s ease-in-out infinite"
                style={{ width: "60%", transition: "width 0.3s" }}
              />
            </Box>
            <Flex align="center" gap="2" mt="4" color="#94A3B8">
              <Clock size={12} />
              <Text fontSize="xs">This may take a moment...</Text>
            </Flex>
          </Flex>
        ) : (
          <>
            <Flex align="center" gap="3" mb="4">
              <Sparkles size={16} color="#0F172A" />
              <Text fontSize="sm" fontWeight="800" color="#0F1B2D" letterSpacing="0.05em">
                CLAUSE ANALYSIS
              </Text>
              <Badge
                bg="#F0FFF4"
                color="#16A34A"
                px="2"
                py="1"
                borderRadius="md"
                fontSize="10px"
                fontWeight="700"
              >
                {clauses.length} CLAUSES
              </Badge>
            </Flex>

            {selectedClause && (
              <Box
                mb="4"
                p="4"
                borderRadius="xl"
                bg="#F8FAFC"
                border="1px solid"
                borderColor="#E2E8F0"
              >
                <Flex justify="space-between" align="center" mb="3">
                  <Badge
                    bg={
                      getRiskLevel(selectedClause.scores?.financialExposure) === "high"
                        ? "#FEE2E2"
                        : getRiskLevel(selectedClause.scores?.financialExposure) === "medium"
                        ? "#FFFBEB"
                        : "#F1F5F9"
                    }
                    color={
                      getRiskLevel(selectedClause.scores?.financialExposure) === "high"
                        ? "#DC2626"
                        : getRiskLevel(selectedClause.scores?.financialExposure) === "medium"
                        ? "#D97706"
                        : "#475569"
                    }
                    fontSize="10px"
                    fontWeight="800"
                    px="2"
                    py="1"
                    borderRadius="md"
                  >
                    {selectedClause.type?.toUpperCase() || 'OTHER'}
                  </Badge>
                </Flex>

                <Text fontSize="sm" fontWeight="700" color="#0F1B2D" mb="3">
                  Risk Score: {selectedClause.scores?.financialExposure || 0}
                </Text>

                <Grid templateColumns="1fr 1fr" gap="3" mb="3">
                  {[
                    { label: "CLARITY", value: selectedClause.scores?.clarity || 0 },
                    { label: "DEVIATION", value: selectedClause.scores?.deviation || 0 },
                    { label: "ASYMMETRY", value: selectedClause.scores?.obligationAsymmetry || 0 },
                    { label: "EXPOSURE", value: selectedClause.scores?.financialExposure || 0 },
                  ].map((score) => (
                    <Box key={score.label}>
                      <Text fontSize="9px" color="#64748B" fontWeight="700">
                        {score.label}
                      </Text>
                      <Box h="4px" bg="#E2E8F0" borderRadius="full" overflow="hidden">
                        <Box
                          h="100%"
                          w={`${score.value}%`}
                          bg={RISK_COLORS[getRiskLevel(score.value)]}
                          borderRadius="full"
                        />
                      </Box>
                    </Box>
                  ))}
                </Grid>

                {selectedClause.redFlags?.length > 0 && (
                  <Box mt="3">
                    <Text fontSize="10px" fontWeight="800" color="#DC2626" mb="2">
                      RED FLAGS ({selectedClause.redFlags.length})
                    </Text>
                    {selectedClause.redFlags.slice(0, 3).map((flag, i) => (
                      <Text key={i} fontSize="xs" color="#64748B" mb="1">
                        • {flag}
                      </Text>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            <Text fontSize="xs" fontWeight="700" color="#64748B" mb="3">
              ALL CLAUSES
            </Text>
            <VStack gap="2" align="stretch">
              {clauses.map((clause, index) => (
                <Box
                  key={index}
                  p="3"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={
                    selectedClause?.index === clause.index ? "#0F172A" : "#E2E8F0"
                  }
                  bg={selectedClause?.index === clause.index ? "#F8FAFC" : "white"}
                  cursor="pointer"
                  onClick={() => handleClauseClick(clause)}
                  _hover={{ borderColor: "#CBD5E0" }}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs" fontWeight="700" color="#0F1B2D">
                      {clause.type || 'other'}
                    </Text>
                    <Box
                      w="3"
                      h="3"
                      borderRadius="full"
                      bg={RISK_COLORS[getRiskLevel(clause.scores?.financialExposure)]}
                    />
                  </Flex>
                  <Text fontSize="10px" color="#64748B" mt="1">
                    Risk: {clause.scores?.financialExposure || 0}
                  </Text>
                </Box>
              ))}
            </VStack>

            {summary && (
              <Box mt="6" p="4" borderRadius="xl" bg="#F8FAFC">
                <Flex align="center" gap="2" mb="2">
                  <CheckCircle2 size={14} color="#16A34A" />
                  <Text fontSize="xs" fontWeight="800" color="#64748B">
                    ANALYSIS COMPLETE
                  </Text>
                </Flex>
                <Text fontSize="sm" fontWeight="700" color="#0F1B2D">
                  {summary.classification?.domain}
                </Text>
                <Text fontSize="xs" color="#64748B" mt="1">
                  {summary.statistics?.totalClauses} clauses analyzed
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Grid>
  );
};

export default Analysis;