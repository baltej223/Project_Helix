import React from "react";
import {
  Search,
  Filter,
  Calendar,
  Star,
  Verified,
  ArrowRight,
  MessageSquare,
  Briefcase,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Heading, Text } from "../components/ui/Typography";
import Badge from "../components/ui/Badge";

const Marketplace = () => {
  return (
    <div className="h-full min-h-0 bg-background grid-pattern p-8 lg:p-16 overflow-y-auto">
      {/* Marketplace Header */}
      <section className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="max-w-3xl">
          <Badge variant="primary" className="mb-6">
            Global Expert Network
          </Badge>
          <Heading level={1} className="mb-6 leading-tight">
            Legal Marketplace
          </Heading>
          <Text className="text-xl">
            Connect with specialized legal consultants for verified analysis and
            direct advisory sessions. Architecting trust through verified
            expertise.
          </Text>
        </div>
        <div className="flex gap-4">
          <div className="px-8 py-5 bg-white border border-surface-container-high rounded-2xl flex items-center gap-4 shadow-xl shadow-primary/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Verified size={24} />
            </div>
            <div>
              <Text variant="label" className="mb-0.5">
                Expert Status
              </Text>
              <div className="text-lg font-black text-on-surface tracking-tighter">
                Verified Pros Only
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto mb-16 flex flex-wrap items-center gap-8">
        <div className="flex-1 min-w-[400px]">
          <div className="relative group">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-all group-focus-within:scale-110"
              size={24}
            />
            <input
              className="w-full pl-16 pr-8 py-6 bg-white border-2 border-surface-container-high rounded-[2rem] focus:ring-8 focus:ring-primary/5 focus:border-primary/40 outline-none text-on-surface transition-all placeholder:text-on-surface-variant/40 font-bold text-lg shadow-xl shadow-primary/5"
              placeholder="Search by name, firm, or specialty..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <FilterButton icon={<Filter size={20} />} label="Specialization" />
          <FilterButton icon={<Calendar size={20} />} label="Availability" />
          <Button variant="primary" className="px-10 py-6 rounded-[2rem]">
            Apply Filters
          </Button>
        </div>
      </section>

      {/* Profile Card Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <LawyerCard
          name="Eleanor Vance, LL.M."
          title="Corporate M&A & Intellectual Property"
          rating="4.9"
          reviews="124"
          price="180"
          status="online"
          location="London, UK"
          image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
        />
        <LawyerCard
          name="Marcus Kaine"
          title="Digital Privacy & Data Compliance"
          rating="4.7"
          reviews="82"
          price="120"
          status="away"
          location="New York, USA"
          image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
        />
        <LawyerCard
          name="Samuel Whitlock"
          title="Tax Litigation & Asset Protection"
          rating="5.0"
          reviews="215"
          price="250"
          status="online"
          location="Singapore"
          image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop"
        />
      </div>

      {/* Featured Specialist */}
      <section className="max-w-7xl mx-auto mt-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-white to-surface-container-low/50 rounded-[3rem] p-16 lg:p-20 flex flex-col lg:flex-row gap-20 items-center border border-surface-container-high shadow-2xl shadow-primary/5 overflow-hidden relative"
        >
          <div className="absolute right-0 top-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none"></div>

          <div className="lg:w-1/2 relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-10 border border-primary/20">
              <Sparkles size={16} />
              AI-Matched Expert
            </div>
            <Heading level={2} className="mb-10 leading-tight">
              Recommended for your recent Analysis
            </Heading>
            <Text className="text-xl mb-12 font-medium leading-relaxed">
              Based on your{" "}
              <span className="text-primary font-black">
                Master_Service_Agreement_v4.pdf
              </span>
              , Dr. Aris Thorne specializes in the cross-border regulatory
              hurdles identified.
            </Text>
            <div className="flex items-center gap-10">
              <Button size="lg" className="px-12">
                Priority Sync
              </Button>
              <button className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant hover:text-primary transition-all border-b-2 border-primary/20 hover:border-primary pb-2 flex items-center gap-2">
                Deep Profile <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 w-full grid grid-cols-2 gap-8 relative z-10">
            <MetricCard
              icon={<Verified className="text-primary" />}
              label="Tier 1 Expert"
              value="98%"
              sub="Relevance Match"
            />
            <MetricCard
              icon={<Calendar className="text-primary" />}
              label="Response"
              value="< 2hrs"
              sub="Turnaround"
            />
            <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-surface-container-high col-span-2 flex items-center gap-8 group cursor-pointer hover:border-primary/20 transition-all">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop"
                  alt="Dr. Aris Thorne"
                  className="w-24 h-24 rounded-[2rem] object-cover border-4 border-primary/5 group-hover:scale-105 transition-transform"
                />
                <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white border-4 border-white">
                  <Verified size={14} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-on-surface mb-1">
                  Dr. Aris Thorne
                </div>
                <div className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                  Senior Counsel, Global Regulations
                  <div className="w-1 h-1 rounded-full bg-surface-container-high"></div>
                  <span className="text-primary">Stanford Law</span>
                </div>
              </div>
              <ArrowRight
                className="ml-auto text-primary/20 group-hover:text-primary group-hover:translate-x-2 transition-all"
                size={24}
              />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const FilterButton = ({ icon, label }) => (
  <button className="flex items-center gap-4 px-8 py-5 bg-white hover:bg-surface-container-low rounded-[1.5rem] transition-all border-2 border-surface-container-high hover:border-primary/20 shadow-sm group">
    <span className="text-on-surface-variant group-hover:text-primary transition-colors">
      {icon}
    </span>
    <span className="text-sm font-black text-on-surface uppercase tracking-widest">
      {label}
    </span>
  </button>
);

const LawyerCard = ({
  name,
  title,
  rating,
  reviews,
  price,
  status,
  image,
  location,
}) => (
  <motion.div
    whileHover={{ y: -12 }}
    className="group relative bg-white rounded-[3rem] overflow-hidden flex flex-col shadow-2xl shadow-primary/5 border border-surface-container-high transition-all duration-500"
  >
    <div className="h-3 bg-linear-to-r from-primary to-primary-dim opacity-80 group-hover:opacity-100 transition-opacity"></div>
    <div className="p-12 flex flex-col h-full">
      <div className="flex items-start justify-between mb-10">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img
            src={image}
            alt={name}
            className="w-28 h-28 rounded-[2rem] object-cover ring-8 ring-surface-container-low transition-all group-hover:ring-primary/10 relative z-10"
          />
          <div
            className={`absolute -right-1 -bottom-1 w-6 h-6 border-4 border-white rounded-full relative z-20 ${status === "online" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-amber-400"}`}
          ></div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-primary">
            <Star size={20} fill="currentColor" />
            <span className="font-black text-2xl tracking-tighter">
              {rating}
            </span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mt-2">
            {reviews} Reviews
          </div>
        </div>
      </div>

      <Heading
        level={3}
        className="mb-2 leading-tight group-hover:text-primary transition-colors"
      >
        {name}
      </Heading>
      <Text variant="detail" className="font-bold mb-4 opacity-80">
        {title}
      </Text>
      <div className="flex items-center gap-2 mb-10 text-on-surface-variant opacity-60">
        <MapPin size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {location}
        </span>
      </div>

      <div className="mt-auto pt-10 border-t border-surface-container-high flex items-center justify-between">
        <div>
          <Text variant="label" className="mb-1 opacity-50">
            Consultation
          </Text>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-on-surface tracking-tighter">
              ${price}
            </span>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
              / session
            </span>
          </div>
        </div>
        <button className="w-16 h-16 bg-surface-container-low text-primary rounded-[1.5rem] hover:bg-primary hover:text-white hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 flex items-center justify-center group/btn border border-surface-container-high/50">
          <ArrowRight
            size={24}
            className="transition-transform group-hover/btn:translate-x-1"
          />
        </button>
      </div>
    </div>
  </motion.div>
);

const MetricCard = ({ icon, label, value, sub }) => (
  <Card
    padding="p-8"
    className="shadow-xl shadow-primary/5 flex flex-col gap-6 group hover:border-primary/20 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/5 rounded-2xl text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        {icon}
      </div>
      <Text
        variant="label"
        className="group-hover:text-primary transition-colors"
      >
        {label}
      </Text>
    </div>
    <div>
      <div className="text-4xl font-black text-on-surface tracking-tighter mb-1">
        {value}
      </div>
      <Text variant="detail" className="opacity-60">
        {sub}
      </Text>
    </div>
  </Card>
);

export default Marketplace;
