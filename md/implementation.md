The implementation breaks down into five layers:

**1. Document Ingestion**
User uploads a PDF or DOCX. You use `pdfjs` for PDFs and `mammoth` for DOCX to extract raw text. Then clause segmentation runs — this is the hardest engineering problem in the whole product. Contracts don't have clean boundaries. You'll need a combination of regex for numbered clauses, a fine-tuned model (CUAD-trained RoBERTa works here) to detect clause boundaries in unstructured text, and a fallback heuristic for poorly formatted documents. Get this right before touching anything else downstream.

**2. PII Removal**
Before any text leaves your server toward an external LLM, run a PII scrubber — Microsoft Presidio is open source and handles Indian PII patterns (Aadhaar, PAN, phone formats) reasonably well. Log what was removed so you can show the user "we anonymized X fields."

**3. AI Analysis Pipeline**
This is a multi-step LLM chain, not a single prompt. Each clause goes through: domain classification → scoring on the four dimensions → plain language rewrite → red flag detection. You run this with structured outputs (JSON schema enforced) so every clause comes back as a typed object your frontend can render. Pinecone holds your public domain contract embeddings — similarity search finds the comparable clauses from your database for the deviation score.

**4. Backend & Storage**
Node.js/Express backend. MongoDB for user data, contract metadata, and analysis results. Redis for job queues — analysis is async, you don't want the user waiting on a synchronous HTTP request. The document itself is processed ephemerally and not stored after analysis unless the user explicitly opts into version tracking. This is your DPDPA posture.

**5. Frontend**
React. The main view is a PDF with inline annotations — clicking a clause opens the analysis panel on the right: score breakdown, plain language rewrite, public standard comparison spectrum. Not a separate report page. The lawyer marketplace is a separate booking flow — calendar integration, payment via Razorpay, advocate profiles with domain tags.

The build order matters: clause segmentation → PII pipeline → LLM chain → backend jobs → frontend last. Most teams make the mistake of building UI first and discovering the segmentation problem too late.