import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box, Flex, Text, Button, Grid, Badge, SimpleGrid, Spinner
} from "@chakra-ui/react";
import {
  Download, ExternalLink, FileText, History, LayoutList, MoreHorizontal, Printer, ZoomIn, Sparkles,
  User, MapPin, Calendar, FileCheck, BookOpen, Search
} from "lucide-react";
import { getJobSummary, getJobClauses, getClauseDetail } from "../services/api";

const Analysis = () => {
  const location = useLocation();
  const { documentId, jobId, classification: initialClass } = location.state || {};

  const [activeTab, setActiveTab] = useState("RISK PROFILE");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [clauses, setClauses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Get summary
        const summaryRes = await getJobSummary(jobId);
        setSummary(summaryRes.data);

        // 2. Get list of clauses
        const clausesRes = await getJobClauses(jobId);
        const basicClauses = clausesRes.data.clauses || [];

        // 3. Get detailed info for each clause (which contains the text "title" and "plainLanguageRewrite")
        // We do this in parallel, but limit to 20 to avoid overwhelming the server just in case
        const detailedPromises = basicClauses.slice(0, 20).map(c => getClauseDetail(jobId, c.index));
        const detailedResults = await Promise.all(detailedPromises);
        
        setClauses(detailedResults.map(r => r.data));
      } catch (err) {
        console.error("Failed to load analysis data:", err);
        setError("Failed to load analysis data from server.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobId]);

  const sideLinks = [
    { icon: <FileText size={16} />, label: "DOCUMENT METADATA" },
    { icon: <LayoutList size={16} />, label: "CLAUSE LIBRARY" },
    { icon: <Text fontSize="md" fontWeight="900" lineHeight="1">!</Text>, label: "RISK PROFILE" },
    { icon: <History size={16} />, label: "HISTORY" },
    { icon: <Download size={16} />, label: "EXPORT" },
  ];

  const renderRightPanel = () => {
    if (loading) return <Flex align="center" justify="center" h="100%"><Spinner size="xl" /></Flex>;
    if (error) return <Box p="8"><Text color="red.500">{error}</Text></Box>;
    if (!summary) return <Box p="8"><Text color="gray.500">No data available. Please upload a document first.</Text></Box>;

    const stats = summary.statistics;
    const score = 100 - (stats.averageScores?.financialExposure || 0); // derive a 0-100 score where 100 is good

    switch (activeTab) {
      case "DOCUMENT METADATA":
        return (
          <Box bg="#F8FAFC" p={{ base: "5", md: "8" }} display="flex" flexDirection="column" overflow="auto" h="100%">
            <Flex justify="space-between" align="center" mb="6">
              <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" color="#64748B">EXTRACTED METADATA</Text>
              <Badge bg="#F1F5F9" color="#334155" px="3" py="1.5" borderRadius="full" fontSize="9px" fontWeight="800" letterSpacing="0.1em" border="1px solid" borderColor="#E2E8F0">● SYNCED</Badge>
            </Flex>

            <Grid templateColumns="1fr 1fr" gap="4" mb="6">
              {[
                { label: "Document Type", value: summary.classification?.domain || "Unknown", icon: <FileCheck size={16}/> },
                { label: "Jurisdiction", value: summary.classification?.jurisdiction || "Unknown", icon: <MapPin size={16}/> },
                { label: "User Party", value: summary.classification?.userParty || "Unknown", icon: <User size={16}/> },
                { label: "Confidence", value: `${Math.round((summary.classification?.confidence || 0) * 100)}%`, icon: <Sparkles size={16}/> },
              ].map((meta, i) => (
                <Box key={i} bg="white" p="4" borderRadius="2xl" border="1px solid" borderColor="#E2E8F0" shadow="0 2px 8px rgba(0,0,0,0.02)">
                  <Flex align="center" gap="2" mb="2" color="#64748B">
                    {meta.icon}
                    <Text fontSize="10px" fontWeight="800" letterSpacing="0.1em" textTransform="uppercase">{meta.label}</Text>
                  </Flex>
                  <Text fontSize="sm" fontWeight="700" color="#0F1B2D" textTransform="capitalize">{meta.value}</Text>
                </Box>
              ))}
            </Grid>
          </Box>
        );

      case "CLAUSE LIBRARY":
        return (
          <Box bg="#F8FAFC" p={{ base: "5", md: "8" }} display="flex" flexDirection="column" overflow="auto" h="100%">
            <Flex justify="space-between" align="center" mb="6">
              <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" color="#64748B">CLAUSE EXTRACTION</Text>
              <Flex bg="white" border="1px solid" borderColor="#E2E8F0" borderRadius="full" px="3" py="1.5" align="center" gap="2">
                <Search size={12} color="#64748B" />
                <Text fontSize="xs" color="#64748B" fontWeight="600">Search clauses...</Text>
              </Flex>
            </Flex>

            {clauses.map((clause, i) => (
              <Flex key={i} bg="white" border="1px solid" borderColor="#E2E8F0" borderRadius="2xl" p="4" mb="3" align="center" justify="space-between" cursor="pointer" _hover={{ borderColor: "#94A3B8", transform: "translateY(-1px)" }} transition="all 0.2s" shadow="0 2px 8px rgba(0,0,0,0.02)">
                <Box>
                  <Text fontSize="sm" fontWeight="700" color="#0F1B2D" textTransform="capitalize">{clause.type}</Text>
                  <Text fontSize="xs" color="#64748B" mt="1">{clause.scores.financialExposure > 50 ? 'High Exposure' : 'Low Exposure'}</Text>
                </Box>
                <Badge
                  bg={clause.scores.financialExposure > 66 ? "#FEF2F2" : clause.scores.financialExposure > 33 ? "#FFFBEB" : "#F1F5F9"}
                  color={clause.scores.financialExposure > 66 ? "#DC2626" : clause.scores.financialExposure > 33 ? "#D97706" : "#475569"}
                  px="2.5" py="1" borderRadius="lg" fontSize="9px" fontWeight="800"
                >
                  {clause.scores.financialExposure > 66 ? 'HIGH' : clause.scores.financialExposure > 33 ? 'MEDIUM' : 'LOW'} RISK
                </Badge>
              </Flex>
            ))}
          </Box>
        );

      case "RISK PROFILE":
      default:
        return (
          <Box bg="#F8FAFC" p={{ base: "5", md: "8" }} display="flex" flexDirection="column" overflow="auto" h="100%">
            <Flex justify="space-between" align="center" mb="6">
              <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" color="#64748B">AI ANALYSIS ENGINE</Text>
              <Badge bg="#F1F5F9" color="#334155" px="3" py="1.5" borderRadius="full" fontSize="9px" fontWeight="800" letterSpacing="0.1em" border="1px solid" borderColor="#E2E8F0">● LIVE SCANNING</Badge>
            </Flex>

            {/* Score Card */}
            <Grid templateColumns="120px 1fr" gap="5" alignItems="center" mb="6" bg="white" p="5" borderRadius="2xl" border="1px solid" borderColor="#E2E8F0" shadow="0 4px 16px rgba(0,0,0,0.02)">
              <Box position="relative" w="110px" h="110px">
                <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="264" strokeDashoffset={264 - (score / 100) * 264} strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
                <Flex position="absolute" inset="0" align="center" justify="center" direction="column">
                  <Text fontSize="3xl" fontWeight="900" lineHeight="1" color="#0F1B2D" mt="1">{Math.round(score)}</Text>
                  <Text fontSize="9px" letterSpacing="0.15em" color="#94A3B8" fontWeight="800">SCORE</Text>
                </Flex>
              </Box>
              <Box>
                <Text fontSize="md" fontWeight="800" color="#0F1B2D" mb="1.5" textTransform="capitalize">{stats.riskLevel} Risk Detected</Text>
                <Text fontSize="sm" color="#64748B" lineHeight="1.6" mb="4">
                  Analyzed {stats.totalClauses} clauses. Found {stats.criticalIssuesCount} critical issues and {stats.redFlagsCount} red flags.
                </Text>
              </Box>
            </Grid>

            <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" color="#94A3B8" mb="4">FLAGGED CLAUSES</Text>

            {/* Display Top Red Flags from clauses */}
            {clauses.filter(c => c.redFlags && c.redFlags.length > 0).slice(0, 3).map((clause, i) => (
              <Box key={i} bg="white" border="1px solid" borderColor="#E2E8F0" borderLeft="4px solid" borderLeftColor={clause.scores.financialExposure > 66 ? "#EF4444" : "#F59E0B"} borderRadius="2xl" p="5" mb="4" shadow="0 2px 8px rgba(0,0,0,0.02)">
                <Flex align="center" gap="3" mb="3" color="#64748B">
                  <Badge bg={clause.scores.financialExposure > 66 ? "#FEF2F2" : "#FFFBEB"} color={clause.scores.financialExposure > 66 ? "#DC2626" : "#D97706"} fontSize="10px" fontWeight="800" px="2.5" py="1" borderRadius="lg">
                    {clause.scores.financialExposure > 66 ? "HIGH" : "MEDIUM"} RISK
                  </Badge>
                  <Text fontSize="xs" fontWeight="600" textTransform="capitalize">{clause.type}</Text>
                </Flex>
                <Text fontSize="sm" fontWeight="700" color="#0F1B2D" mb="3">{clause.redFlags[0]}</Text>
                <Box bg="linear-gradient(135deg, #FAFBFE, #F8FAFC)" borderRadius="xl" p="4" border="1px solid" borderColor="#F1F5F9">
                  <Flex align="center" gap="1.5" mb="1.5">
                    <Sparkles size={12} color="#0F172A" />
                    <Text fontSize="10px" fontWeight="800" color="#0F172A" letterSpacing="0.1em">AI REWRITE</Text>
                  </Flex>
                  <Text fontSize="sm" color="#475569" lineHeight="1.7">{clause.plainLanguageRewrite || "No rewrite available."}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        );
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