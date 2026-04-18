import React from "react";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Wand2,
  Sparkles,
  ChevronRight,
  BarChart3,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Heading, Text } from "../components/ui/Typography";
import Badge from "../components/ui/Badge";

const Benchmarks = () => {
  return (
    <div className="h-full min-h-0 bg-background grid-pattern p-8 lg:p-16 overflow-y-auto">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-6">
            Global Corpus Analysis
          </Badge>
          <Heading level={1} className="mb-6">
            Market Benchmarks
          </Heading>
          <Text>
            Comparing{" "}
            <span className="font-black text-primary border-b-2 border-primary/20 pb-0.5">
              SaaS Agreement_v4.pdf
            </span>{" "}
            against the Digital Jurist global corpus to identify outliers and
            negotiation leverage.
          </Text>
        </div>
        <div className="px-8 py-4 bg-white border border-surface-container-high rounded-2xl flex items-center gap-4 shadow-xl shadow-primary/5">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(78,96,115,0.5)]"></div>
          <div>
            <Text variant="label" className="mb-0.5">
              Live Corpus Status
            </Text>
            <div className="text-xl font-black text-on-surface tracking-tighter">
              14.2k Documents
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Dashboard */}
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-10 mb-16">
        {/* Macro Comparison Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-8 group"
        >
          <Card className="h-full p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-primary/5 border-primary/5">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="text-primary" size={24} />
                <Heading level={3}>Negotiation Readiness</Heading>
              </div>
              <div className="grid grid-cols-3 gap-12">
                <StatBlock
                  value="84%"
                  label="Market Alignment"
                  color="text-primary"
                />
                <StatBlock
                  value="3"
                  label="Critical Outliers"
                  color="text-red-600"
                />
                <StatBlock
                  value="High"
                  label="Leverage Score"
                  color="text-on-surface"
                />
              </div>
            </div>
            {/* Abstract background element */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-linear-to-tl from-primary/10 to-transparent rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          </Card>
        </motion.div>

        {/* AI Quick Insight */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-12 lg:col-span-4"
        >
          <Card className="bg-primary h-full p-10 flex flex-col justify-center text-white shadow-2xl shadow-primary/30 border-none relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 text-white/10 group-hover:rotate-12 transition-transform duration-500">
              <Sparkles size={160} />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Sparkles size={20} className="text-white/80" />
              <span className="font-black text-[10px] uppercase tracking-[0.2em] text-white/70">
                Jurist Insight
              </span>
            </div>
            <Heading
              level={4}
              className="text-white mb-6 relative z-10 leading-relaxed"
            >
              Your{" "}
              <span className="underline decoration-white/40 underline-offset-8">
                Liability Cap
              </span>{" "}
              is significantly higher than 92% of similar deals.
            </Heading>
            <Text className="text-white/80 font-bold relative z-10 text-sm">
              Focus negotiation here to reduce exposure by{" "}
              <span className="text-white underline decoration-white/60">
                $2.4M
              </span>
              .
            </Text>
          </Card>
        </motion.div>

        {/* Comparison Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-12"
        >
          <Card
            padding="p-0"
            className="overflow-hidden border-surface-container-high shadow-xl shadow-primary/5"
          >
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low/50">
                <tr className="text-on-surface-variant">
                  <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em]">
                    Negotiable Factors
                  </th>
                  <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em]">
                    Your Term
                  </th>
                  <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em]">
                    Market Standard
                  </th>
                  <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em]">
                    Assessment
                  </th>
                  <th className="p-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                <BenchmarkRow
                  factor="Liability Cap"
                  section="Section 12.4 - Indemnification"
                  term="3x Annual Fees"
                  standard="1x Annual Fees"
                  status="danger"
                  assessment="Needs Negotiation"
                />
                <BenchmarkRow
                  factor="Notice Period"
                  section="Section 4.2 - Termination"
                  term="90 Days"
                  standard="30 - 60 Days"
                  status="success"
                  assessment="Favorable"
                />
                <BenchmarkRow
                  factor="Data Portability"
                  section="Section 8.1 - Confidentiality"
                  term="Standard JSON"
                  standard="Standard JSON"
                  status="neutral"
                  assessment="Aligned"
                />
              </tbody>
            </table>
          </Card>
        </motion.div>

        {/* Regional Benchmarks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-12 md:col-span-6"
        >
          <Card className="p-10 shadow-xl shadow-primary/5">
            <div className="flex items-center gap-3 mb-10">
              <Globe className="text-primary" size={20} />
              <Heading level={4}>Regional Alignment</Heading>
            </div>
            <div className="space-y-10">
              <ProgressBar
                label="North America (AMER)"
                percentage={92}
                status="High Alignment"
              />
              <ProgressBar
                label="European Union (EMEA)"
                percentage={64}
                status="Moderate Gap"
              />
            </div>
          </Card>
        </motion.div>

        {/* Strategy Generator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="col-span-12 md:col-span-6"
        >
          <Card className="bg-surface-container-low/50 h-full p-10 border-surface-container-high flex flex-col justify-between shadow-inner group">
            <div className="flex gap-8 items-start">
              <div className="p-4 bg-white rounded-2xl text-primary shadow-sm group-hover:scale-110 transition-transform">
                <Wand2 size={28} />
              </div>
              <div>
                <Heading level={4} className="mb-3">
                  Negotiation Playbook
                </Heading>
                <Text variant="detail" className="leading-relaxed">
                  Generate a custom counter-proposal email based on these market
                  discrepancies identified by Digital Jurist.
                </Text>
              </div>
            </div>
            <Button variant="primary" className="w-full py-5 mt-10">
              <Wand2 size={18} className="mr-3" />
              Draft Counter-Proposal
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const StatBlock = ({ value, label, color }) => (
  <div className="group/stat">
    <div
      className={`text-6xl font-black mb-3 tracking-tighter transition-transform group-hover/stat:scale-105 origin-left ${color}`}
    >
      {value}
    </div>
    <Text variant="label">{label}</Text>
  </div>
);

const BenchmarkRow = ({
  factor,
  section,
  term,
  standard,
  status,
  assessment,
}) => {
  return (
    <tr className="hover:bg-surface-container-low/30 transition-all group">
      <td className="p-8">
        <div className="font-black text-on-surface text-lg mb-1 group-hover:text-primary transition-colors">
          {factor}
        </div>
        <Text variant="label" className="opacity-60">
          {section}
        </Text>
      </td>
      <td className="p-8 font-black text-on-surface">{term}</td>
      <td className="p-8 text-on-surface-variant font-bold">{standard}</td>
      <td className="p-8">
        <Badge variant={status}>
          {status === "danger" ? (
            <AlertCircle size={12} className="mr-1" />
          ) : status === "success" ? (
            <TrendingUp size={12} className="mr-1" />
          ) : (
            <CheckCircle2 size={12} className="mr-1" />
          )}
          {assessment}
        </Badge>
      </td>
      <td className="p-8 text-right">
        <button className="text-primary opacity-0 group-hover:opacity-100 transition-all font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 ml-auto">
          Clause Detail <ChevronRight size={16} />
        </button>
      </td>
    </tr>
  );
};

const ProgressBar = ({ label, percentage, status }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Text
        variant="detail"
        className="font-black uppercase tracking-widest text-on-surface"
      >
        {label}
      </Text>
      <Badge variant={percentage > 80 ? "success" : "neutral"}>{status}</Badge>
    </div>
    <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden border border-surface-container-high shadow-inner p-0.5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="bg-linear-to-r from-primary to-primary-dim h-full rounded-full shadow-[0_0_15px_rgba(78,96,115,0.4)]"
      ></motion.div>
    </div>
  </div>
);

export default Benchmarks;
