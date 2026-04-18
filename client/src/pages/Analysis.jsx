import React from 'react';
import { FileText, ZoomIn, Printer, ExternalLink, Sparkles, Edit3, Download, Search, AlertCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Heading, Text } from '../components/ui/Typography';
import Badge from '../components/ui/Badge';

const Analysis = () => {
  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Left: Document Viewer */}
      <section className="flex-[1.2] bg-white p-10 flex flex-col overflow-hidden border-r border-surface-container-high relative">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <div className="p-3.5 bg-linear-to-br from-primary/10 to-transparent rounded-2xl text-primary border border-primary/5 shadow-inner">
              <FileText size={28} />
            </div>
            <div>
              <Heading level={4} className="mb-1">Master_Service_Agreement_v4.pdf</Heading>
              <div className="flex items-center gap-3">
                <Text variant="detail">Modified 2 hours ago • 24 Pages</Text>
                <div className="w-1 h-1 rounded-full bg-surface-container-high"></div>
                <Badge variant="success">Verified Scan</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <ToolButton icon={<ZoomIn size={20} />} />
            <ToolButton icon={<Printer size={20} />} />
            <ToolButton icon={<MoreHorizontal size={20} />} />
          </div>
        </div>

        <div className="flex-1 bg-surface-container-low/20 rounded-[2.5rem] border border-surface-container-high shadow-inner overflow-y-auto p-16 mx-auto w-full max-w-3xl relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-white/80 to-transparent pointer-events-none"></div>
          
          <div className="space-y-10 text-on-surface-variant font-serif text-[16px] leading-relaxed relative z-10">
            <Heading level={2} className="mb-12 tracking-tight text-center">MASTER SERVICES AGREEMENT</Heading>
            <p>This Master Services Agreement ("Agreement") is entered into as of <span className="text-on-surface font-bold">October 12, 2023</span>, by and between <span className="bg-primary/10 px-1.5 py-0.5 rounded text-primary font-black uppercase tracking-widest text-[10px]">Nexus Global Corp</span> ("Client") and <span className="bg-primary/10 px-1.5 py-0.5 rounded text-primary font-black uppercase tracking-widest text-[10px]">Stratos Solutions Ltd</span> ("Provider").</p>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50/50 p-8 rounded-2xl border-l-4 border-red-500 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute -right-8 -top-8 text-red-500/5 group-hover:scale-110 transition-transform">
                <AlertCircle size={120} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <Heading level={4} className="text-red-900">Section 4. Limitation of Liability</Heading>
                <Badge variant="danger">High Risk</Badge>
              </div>
              <p className="italic text-red-800/80">4.1. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES...</p>
            </motion.div>

            <div>
              <Heading level={4} className="mb-4">Section 7. Indemnification</Heading>
              <p>7.2. Provider shall indemnify, defend, and hold harmless Client and its officers, directors, and employees from and against any and all claims, costs, damages, losses, liabilities and expenses...</p>
            </div>

            <div className="opacity-20 select-none blur-[1px]">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-white/80 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Right: AI Analysis Panel */}
      <section className="flex-1 bg-surface-container-low/30 flex flex-col overflow-hidden">
        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Sparkles className="text-primary" size={20} />
              <Text variant="label" className="text-primary font-black">AI Analysis Engine</Text>
            </div>
            <div className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black text-primary border border-primary/20 shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              LIVE SCANNING
            </div>
          </div>

          <Card className="p-8 border-primary/10 shadow-xl shadow-primary/5 bg-white/80 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute -right-10 -bottom-10 text-primary/5">
              <Search size={160} />
            </div>
            <div className="flex items-center gap-10 relative z-10">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle className="text-surface-container-high" cx="64" cy="64" fill="none" r="58" stroke="currentColor" strokeWidth="12"></circle>
                  <motion.circle 
                    initial={{ strokeDashoffset: 364 }}
                    animate={{ strokeDashoffset: 120 }}
                    className="text-primary" cx="64" cy="64" fill="none" r="58" stroke="currentColor" strokeDasharray="364" strokeWidth="12" strokeLinecap="round"
                  ></motion.circle>
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black tracking-tighter text-on-surface leading-none">68</span>
                  <Text variant="label" className="mt-2">Score</Text>
                </div>
              </div>
              <div className="flex-1">
                <Heading level={3} className="mb-2">Moderate Risk</Heading>
                <Text variant="detail" className="leading-relaxed mb-6">
                  Multiple clauses contain non-standard indemnity terms and aggressive limitation of liability caps.
                </Text>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div 
                      key={i} 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex-1 h-2 rounded-full ${i <= 3 ? 'bg-primary shadow-[0_0_10px_rgba(78,96,115,0.3)]' : 'bg-surface-container-high'}`}
                    ></motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-6">
          <div className="sticky top-0 bg-surface-container-low/80 backdrop-blur-md py-4 z-10 border-b border-surface-container-high/50 flex items-center justify-between">
            <Text variant="label">Flagged Clauses (3)</Text>
            <Badge variant="neutral">Sorted by Impact</Badge>
          </div>

          <RiskCard 
            risk="HIGH" 
            section="Section 4.1 • Liability" 
            title="Uncapped indirect damages for Provider's negligence."
            meaning="This clause suggests that Stratos Solutions can be held liable for unlimited monetary losses (like lost profits) if they make a mistake."
          />

          <RiskCard 
            risk="MEDIUM" 
            section="Section 7.2 • IP Indemnity" 
            title="Narrow definition of third-party IP rights."
            meaning="The protection against copyright infringement is standard, but the clause fails to mention trade secrets, leaving a potential gap."
          />
        </div>

        <div className="p-8 bg-white/50 backdrop-blur-md border-t border-surface-container-high flex gap-4">
          <Button variant="outline" className="flex-1">
            <Download size={18} className="mr-2" />
            Report
          </Button>
          <Button variant="primary" className="flex-[2] py-5">
            <Edit3 size={18} className="mr-2" />
            Request Redline
          </Button>
        </div>
      </section>
    </div>
  );
};

const ToolButton = ({ icon }) => (
  <button className="p-3 bg-white border border-surface-container-high rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all shadow-sm hover:shadow-md active:scale-95">
    {icon}
  </button>
);

const RiskCard = ({ risk, section, title, meaning }) => {
  return (
    <Card padding="p-6" className="group overflow-hidden relative">
      <div className={`absolute left-0 top-0 w-1.5 h-full ${risk === 'HIGH' ? 'bg-red-500' : 'bg-primary'}`}></div>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Badge variant={risk === 'HIGH' ? 'danger' : 'warning'}>{risk} RISK</Badge>
          <Text variant="detail" className="font-black opacity-60 tracking-widest">{section}</Text>
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container-low">
          <ExternalLink size={18} />
        </button>
      </div>
      <Heading level={4} className="mb-4 leading-snug group-hover:text-primary transition-colors">{title}</Heading>
      <div className="bg-surface-container-low/50 p-5 rounded-2xl border border-surface-container-high/50 group-hover:bg-white transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-primary" />
          <Text variant="label" className="text-primary">Simplified Meaning</Text>
        </div>
        <Text variant="detail" className="leading-relaxed opacity-80">
          {meaning}
        </Text>
      </div>
    </Card>
  );
};

export default Analysis;
