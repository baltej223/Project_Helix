import React, { useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  GridItem,
  SimpleGrid,
  Badge,
  Input,
} from "@chakra-ui/react";
import { FileUp, Plus, Shield, Zap, ArrowRight, Lock, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadDocument, classifyDocument, confirmClassification, uploadPdfToServer } from "../services/api";

const Upload = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [error, setError] = useState(null);

  const [classificationResult, setClassificationResult] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [domainInput, setDomainInput] = useState("");

  const [documentId, setDocumentId] = useState(null);
  const [jobId, setJobId] = useState(null);

  // Convert file to base64 for caching
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed. Please upload a PDF document.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setTitle(selectedFile.name.replace(/\.pdf$/i, ""));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed. Please upload a PDF document.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setTitle(selectedFile.name.replace(/\.pdf$/i, ""));
  };

  const handleUpload = async () => {
    if (!file || !title) return;

    setUploading(true);
    setError(null);

    try {
      const result = await uploadDocument(file, title);
      const docId = result.data.documentId;
      setDocumentId(docId);

      setUploading(false);
      setAnalyzing(true);

      const classifyResult = await classifyDocument(docId);
      const data = classifyResult.data;

      setClassificationResult(data);
      setSelectedDomain(data.classification.domain);
      setDomainInput(data.classification.domain);
      setSelectedParty("");
      setJobId(data.jobId);

      setAnalyzing(false);
      setClassifying(true);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || err.message || "Upload failed");
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleConfirm = async () => {
    if (!documentId || !selectedDomain || !selectedParty || !file) return;

    setClassifying(false);

    try {
      const result = await confirmClassification(documentId, selectedDomain, selectedParty);
      const data = result.data;

      // Upload PDF to server for rendering
      console.log("📄 Uploading PDF to server...");
      await uploadPdfToServer(documentId, file);
      console.log("📄 PDF uploaded to server successfully");

      // Navigate to analysis
      navigate(`/analysis?docId=${documentId}&jobId=${data.jobId}`);
    } catch (err) {
      console.error("Error confirming:", err);
      setError(err.response?.data?.message || err.message || "Confirmation failed");
    }
  };

  const handleCancel = () => {
    setFile(null);
    setTitle("");
    setClassificationResult(null);
    setSelectedDomain("");
    setSelectedParty("");
    setDomainInput("");
    setDocumentId(null);
    setJobId(null);
    setError(null);
  };

  return (
    <Box minH="100%" bg="#F8FAFC" overflow="auto" p={{ base: "5", md: "8", lg: "10" }}>
      <Box maxW="1400px" mx="auto">
        <Flex
          justify="space-between"
          align="flex-end"
          gap="6"
          mb="8"
          flexWrap="wrap"
        >
          <Box>
            <Text
              as="h1"
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="900"
              color="#0F1B2D"
              letterSpacing="-0.03em"
              lineHeight="1.1"
            >
              Upload Contract
            </Text>
            <Text
              mt="3"
              fontSize={{ base: "sm", md: "md" }}
              color="#64748B"
              maxW="580px"
              lineHeight="1.8"
            >
              Upload a PDF contract for AI analysis. We'll detect the domain and
              parties, then analyze each clause for risk.
            </Text>
          </Box>
          <Flex
            align="center"
            gap="2"
            bg="#F1F5F9"
            border="1px solid"
            borderColor="#E2E8F0"
            px="4"
            py="2.5"
            borderRadius="xl"
          >
            <Box w="2" h="2" borderRadius="full" bg="#16A34A" />
            <Text fontSize="xs" fontWeight="700" color="#64748B" letterSpacing="0.08em">
              PDF ONLY
            </Text>
          </Flex>
        </Flex>

        {!classificationResult ? (
          <Grid
            templateColumns={{ base: "1fr", lg: "1.9fr 1fr" }}
            gap="7"
          >
            <GridItem>
              <Box
                bg="white"
                border="1px solid"
                borderColor={error ? "#EF4444" : "#E2E8F0"}
                borderRadius="3xl"
                p="4"
                shadow="0 1px 3px rgba(0,0,0,0.03)"
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  textAlign="center"
                  border="2px dashed"
                  borderColor={error ? "#EF4444" : file ? "#22C55E" : "#CBD5E0"}
                  borderRadius="2xl"
                  bg="linear-gradient(135deg, #FAFBFE, #F8FAFC)"
                  minH="400px"
                  p="10"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    borderColor: error ? "#EF4444" : "#94A3B8",
                    bg: "linear-gradient(135deg, #F8FAFC, #F8FAFC)",
                    shadow: "inset 0 0 30px rgba(15,23,42,0.03)",
                  }}
                  cursor="pointer"
                  position="relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => !uploading && !analyzing && fileInputRef.current?.click()}
                >
                  {uploading || analyzing ? (
                    <Box color="#0F172A">
                      <Loader2
                        size={40}
                        className="animate-spin"
                        style={{ margin: "0 auto" }}
                      />
                      <Text mt="4" fontSize="lg" fontWeight="700">
                        {uploading ? "Uploading..." : "Analyzing document..."}
                      </Text>
                      <Text fontSize="sm" color="#64748B" mt="2">
                        {uploading
                          ? "Extracting text and removing PII..."
                          : "Detecting domain and parties..."}
                      </Text>
                    </Box>
                  ) : file ? (
                    <Box>
                      <Flex
                        w="16"
                        h="16"
                        borderRadius="2xl"
                        bg="linear-gradient(135deg, #F0FFF4, #DCFCE7)"
                        color="#16A34A"
                        align="center"
                        justify="center"
                        mb="4"
                        mx="auto"
                      >
                        <CheckCircle2 size={32} />
                      </Flex>
                      <Text
                        fontSize="xl"
                        fontWeight="800"
                        color="#0F1B2D"
                        mb="2"
                      >
                        {file.name}
                      </Text>
                      <Text fontSize="sm" color="#64748B" mb="6">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel();
                        }}
                        variant="outline"
                        size="sm"
                        color="#64748B"
                        borderColor="#E2E8F0"
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Flex
                        w="16"
                        h="16"
                        borderRadius="2xl"
                        bg="linear-gradient(135deg, #F1F5F9, #E2E8F0)"
                        color="#0F172A"
                        align="center"
                        justify="center"
                        mb="4"
                        mx="auto"
                      >
                        <FileUp size={32} />
                      </Flex>
                      <Text
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="800"
                        color="#0F1B2D"
                        mb="3"
                        letterSpacing="-0.02em"
                      >
                        Drop Contract Here
                      </Text>
                      <Text
                        fontSize="md"
                        color="#64748B"
                        maxW="420px"
                        mb="7"
                        lineHeight="1.8"
                      >
                        Only PDF files are supported. Max file size 10MB.
                      </Text>
                    </Box>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </Flex>

                {error && (
                  <Flex
                    mt="4"
                    align="center"
                    gap="2"
                    color="#DC2626"
                    bg="#FEF2F2"
                    p="3"
                    borderRadius="xl"
                  >
                    <AlertCircle size={16} />
                    <Text fontSize="sm" fontWeight="600">
                      {error}
                    </Text>
                  </Flex>
                )}

                {file && !uploading && !analyzing && (
                  <Box mt="6">
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color="#64748B"
                      mb="2"
                      letterSpacing="0.1em"
                    >
                      DOCUMENT TITLE
                    </Text>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter document title"
                      bg="#F8FAFC"
                      border="1px solid"
                      borderColor="#E2E8F0"
                      borderRadius="xl"
                      px="4"
                      h="12"
                      fontSize="sm"
                      _focus={{
                        borderColor: "#CBD5E0",
                        outline: "none",
                        shadow: "0 0 0 3px rgba(15,23,42,0.08)",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Flex direction="column" gap="5">
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="#E2E8F0"
                  borderRadius="2xl"
                  p="7"
                  shadow="0 1px 3px rgba(0,0,0,0.03)"
                >
                  <Text
                    fontSize="xs"
                    fontWeight="800"
                    letterSpacing="0.15em"
                    color="#94A3B8"
                    mb="5"
                  >
                    DOCUMENT CLASSIFICATION
                  </Text>
                  <Text fontSize="sm" color="#64748B" lineHeight="1.8">
                    After upload, the AI will automatically detect the contract domain
                    (e.g., employment, rental, NDA) and suggest party options for you to
                    confirm.
                  </Text>
                </Box>

                <Box
                  bg="linear-gradient(135deg, #F8FAFC, #E2E8F0)"
                  border="1px solid"
                  borderColor="#E2E8F0"
                  borderRadius="2xl"
                  p="6"
                >
                  <Flex align="center" gap="2" mb="3">
                    <Sparkles size={14} color="#0F172A" />
                    <Text
                      fontSize="xs"
                      fontWeight="800"
                      color="#0F172A"
                      letterSpacing="0.08em"
                    >
                      HOW IT WORKS
                    </Text>
                  </Flex>
                  <SimpleGrid columns={1} gap="3">
                    {[
                      "Upload PDF contract",
                      "AI detects domain & parties",
                      "You confirm the details",
                      "Clause analysis begins",
                    ].map((step, i) => (
                      <Flex key={i} align="center" gap="3">
                        <Box
                          w="5"
                          h="5"
                          borderRadius="full"
                          bg="#0F172A"
                          color="white"
                          fontSize="xs"
                          fontWeight="700"
                          align="center"
                          justify="center"
                        >
                          {i + 1}
                        </Box>
                        <Text fontSize="sm" color="#475569">
                          {step}
                        </Text>
                      </Flex>
                    ))}
                  </SimpleGrid>
                </Box>

                <Button
                  w="100%"
                  h="14"
                  bg="linear-gradient(135deg, #0F172A, #1E293B)"
                  color="white"
                  borderRadius="2xl"
                  fontWeight="800"
                  fontSize="md"
                  shadow="0 4px 20px rgba(15,23,42,0.3)"
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "0 8px 30px rgba(15,23,42,0.4)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.3s"
                  disabled={!file || !title || uploading || analyzing}
                  onClick={handleUpload}
                >
                  {uploading ? "Uploading..." : analyzing ? "Analyzing..." : "Start Analysis"}
                  <ArrowRight size={18} />
                </Button>

                <SimpleGrid columns={2} gap="4" mt="10" w="100%" maxW="480px">
                  {[
                    {
                      icon: <Lock size={15} />,
                      label: "SECURITY",
                      value: "End-to-End Encryption",
                      gradient: "linear-gradient(135deg, #F1F5F9, #E2E8F0)",
                      color: "#0F172A",
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
                      _focus={{ borderColor: "#CBD5E0", outline: "none", shadow: "0 0 0 3px rgba(15,23,42,0.08)" }}
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
                    bg="linear-gradient(135deg, #0F172A, #1E293B)"
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
                bg="linear-gradient(135deg, #F8FAFC, #E2E8F0)"
                border="1px solid" borderColor="#E2E8F0"
                borderRadius="2xl" p="6"
              >
                <Flex align="center" gap="2" mb="3">
                  <Sparkles size={14} color="#0F172A" />
                  <Text fontSize="xs" fontWeight="800" color="#0F172A" letterSpacing="0.08em">
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
                bg="linear-gradient(135deg, #0F172A, #1E293B)"
                color="white" borderRadius="2xl"
                fontWeight="800" fontSize="md"
                shadow="0 4px 20px rgba(15,23,42,0.3)"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "0 8px 30px rgba(15,23,42,0.4)",
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

        <SimpleGrid columns={{ base: 1, md: 3 }} gap="5" mt="8">
          {[
            { label: "INSTITUTIONAL SECURITY", text: "SOC2 Type II compliant storage with zero-knowledge encryption protocols.", gradient: "linear-gradient(135deg, #F1F5F9, #E2E8F0)", color: "#0F172A" },
            { label: "LEGAL INTEGRITY", text: "Models trained on 10M+ curated judicial precedents and federal statutes.", gradient: "linear-gradient(135deg, #F0FFF4, #DCFCE7)", color: "#16A34A" },
            { label: "DOCUMENT LIFECYCLE", text: "Automated versioning and audit trails for every revision made.", gradient: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", color: "#D97706" },
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