import React from "react";
import {
  Upload as UploadIcon,
  Plus,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Heading, Text } from "../components/ui/Typography";
import Badge from "../components/ui/Badge";

const Upload = () => {
  return (
    <div className="h-full min-h-0 bg-background grid-pattern p-8 lg:p-16 overflow-y-auto">
      {/* Editorial Header Section */}
      <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-6">
            v4.0 Core Engine
          </Badge>
          <Heading level={1} className="mb-6">
            Contract Intake
          </Heading>
          <Text>
            Upload your legal documents for comprehensive AI-driven analysis.
            Our preprocessing layer identifies risk profiles and redacts
            sensitive data with architectural precision.
          </Text>
        </div>
        <div className="hidden lg:block text-right">
          <Text variant="label" className="mb-1">
            Current Workspace
          </Text>
          <div className="text-2xl font-black text-primary tracking-tighter">
            Pre-processing Node 01
          </div>
        </div>
      </div>

      {/* Main Bento Grid Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Upload Core */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 group"
        >
          <Card
            padding="p-2"
            className="h-full bg-surface-container-high/50 border-2 border-primary/5"
          >
            <div className="bg-white h-full rounded-[2rem] p-16 flex flex-col items-center justify-center border-2 border-dashed border-surface-container-high group-hover:border-primary/40 transition-all cursor-pointer shadow-inner">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-28 h-28 rounded-[2.5rem] bg-linear-to-br from-surface-container-low to-white flex items-center justify-center mb-10 text-primary shadow-xl shadow-primary/5 border border-surface-container-high"
              >
                <UploadIcon size={44} />
              </motion.div>
              <Heading level={2} className="mb-4">
                Drop Contract Here
              </Heading>
              <Text className="mb-12 text-center max-w-sm">
                PDF, DOCX, or scanned images. Max file size 50MB for deep neural
                processing.
              </Text>

              <Button size="lg" className="px-12">
                <Plus size={20} className="mr-2" />
                Select File
              </Button>

              <div className="mt-20 flex gap-8 w-full">
                <FeatureSmall
                  icon={<ShieldCheck size={24} />}
                  label="Security"
                  value="End-to-End Encryption"
                />
                <FeatureSmall
                  icon={<Zap size={24} />}
                  label="Speed"
                  value="Instant Pre-scan Active"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Configuration & Meta */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          {/* Configuration Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              hover={false}
              className="bg-white/80 backdrop-blur-xl border-primary/10 shadow-xl shadow-primary/5"
            >
              <Text
                variant="label"
                className="border-b border-surface-container-high pb-6 mb-8 block"
              >
                Document Classification
              </Text>

              <div className="flex flex-col gap-8">
                <InputField label="Contract Domain">
                  <option>Commercial Business Agreement</option>
                  <option>Residential Lease (Rent)</option>
                  <option>Employment / Job Contract</option>
                  <option>Service Level Agreement (SLA)</option>
                  <option>Non-Disclosure Agreement (NDA)</option>
                </InputField>

                <InputField label="User Party Identity">
                  <option>Landlord / Lessor</option>
                  <option>Tenant / Lessee</option>
                  <option>Employer / Principal</option>
                  <option>Employee / Agent</option>
                  <option>Service Provider</option>
                </InputField>
              </div>

              {/* Redaction Toggle */}
              <div className="pt-8 mt-8 border-t border-surface-container-high">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-on-surface uppercase tracking-widest">
                    Privacy Redaction
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-12 h-6.5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                  </label>
                </div>
                <Text variant="detail" className="leading-relaxed">
                  Automatically redact names, addresses, and financial values
                  before AI processing for maximum confidentiality.
                </Text>
              </div>
            </Card>
          </motion.div>

          {/* AI Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              padding="p-6"
              className="bg-linear-to-br from-primary/10 to-transparent border-primary/20 shadow-none overflow-hidden relative"
            >
              <div className="absolute -right-4 -top-4 text-primary/5 rotate-12">
                <Sparkles size={120} />
              </div>
              <div className="flex gap-6 relative z-10">
                <div className="p-3 bg-white rounded-2xl text-primary shadow-sm h-fit">
                  <Sparkles size={24} />
                </div>
                <div>
                  <Text variant="label" className="text-primary mb-2">
                    AI Recommendation
                  </Text>
                  <Text
                    variant="detail"
                    className="text-primary/80 leading-relaxed font-bold"
                  >
                    Based on current legal trends, we recommend enabling "Clause
                    Comparison" for multi-jurisdictional compliance checks.
                  </Text>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button variant="secondary" className="w-full py-6 group">
              Process Analysis
              <ArrowRight
                size={18}
                className="ml-3 transition-transform group-hover:translate-x-1"
              />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeatureSmall = ({ icon, label, value }) => (
  <div className="flex-1 bg-surface-container-low rounded-2xl p-6 flex items-center gap-6 border border-surface-container-high/50 group/item hover:bg-white transition-all shadow-sm">
    <div className="p-3 bg-white rounded-xl text-primary shadow-sm group-hover/item:shadow-md transition-all">
      {icon}
    </div>
    <div>
      <Text variant="label">{label}</Text>
      <div className="text-sm font-black text-on-surface">{value}</div>
    </div>
  </div>
);

const InputField = ({ label, children }) => (
  <div className="flex flex-col gap-3">
    <Text variant="label">{label}</Text>
    <div className="relative">
      <select className="w-full bg-white border border-surface-container-high rounded-2xl px-5 py-4 text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none appearance-none cursor-pointer shadow-sm">
        {children}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
        <ArrowRight size={14} className="rotate-90" />
      </div>
    </div>
  </div>
);

export default Upload;
