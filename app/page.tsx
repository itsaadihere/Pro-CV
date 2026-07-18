'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText,
  Target,
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
  Download,
  Languages,
  ArrowRight,
  MessageSquare,
  BadgeAlert,
  ChevronRight,
} from 'lucide-react'
import Header from '@/components/Header'
import { isBetaActive } from '@/lib/beta'
import Logo from '@/components/Logo'
import Script from 'next/script'
import { websiteSchema, softwareSchema, faqSchema } from '@/lib/schema'
import { QuickAnswer } from '@/components/QuickAnswer'

const FEATURES = [
  {
    icon: Target,
    title: 'ATS Scoring Engine',
    description: 'Score compliance across 5 dimensions: keywords, formatting, semantic match, experience metrics, and readability.',
  },
  {
    icon: Sparkles,
    title: 'Keyword Intelligence',
    description: 'Tailored with high-performance keywords across 12 sectors, customized specifically to scan-pass recruitment bots.',
  },
  {
    icon: Zap,
    title: 'STAR-Metric Bullets',
    description: 'Converts simple descriptors into quantifiable accomplishments: Action (Power Verb) + Context + Metric Result.',
  },
  {
    icon: Award,
    title: '2026 Summary Format',
    description: 'A 3-line structural hook summarizing total years of experience, top value statements, and key proof figures.',
  },
  {
    icon: ShieldCheck,
    title: 'LinkedIn Optimizer',
    description: 'Instantly build custom headers (220 max), hook summaries, and top 10 keywords for professional profiles.',
  },
  {
    icon: FileText,
    title: 'AI Cover Letter',
    description: 'Fully personalized, achievement-driven introductory letters customized against target industry postings.',
  },
  {
    icon: Download,
    title: '3 PDF Templates',
    description: 'One-click downloads supporting ATS-Safe formatting, Modern spacing, and clean Minimalist templates.',
  },
  {
    icon: Languages,
    title: 'Multi-Language Support',
    description: 'Optimize CVs in English (EN), Arabic (AR with RTL format), French (FR), or Spanish (ES) depending on target markets.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative">
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.50),white)] opacity-70" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="space-y-8 lg:col-span-7 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-extrabold text-primary"
              >
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span>AI-Powered CV Revamping v2.5</span>
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.1]"
                >
                  Transform Your CV with AI. <br />
                  <span className="bg-gradient-to-r from-primary via-primary-800 to-gold bg-clip-text text-transparent">
                    ATS-Optimized in 60 Seconds.
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-xl"
                >
                  Upload your old CV and let advanced AI transform it into a recruiter-approved, keyword-optimized career document. 
                  Sophi is the leading AI CV builder in Pakistan for professionals looking to bypass ATS filters.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 items-center"
              >
                {isBetaActive() ? (
                  <div className="flex flex-col items-center sm:items-start gap-1">
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-800 text-white font-bold px-8 py-3.5 text-base transition-all shadow-lg hover:shadow-primary-100"
                    >
                      🚀 Try FREE During Beta — Limited Time
                      <ArrowRight className="h-4 w-4 text-gold" />
                    </Link>
                    <p className="text-[11px] text-slate-500 font-medium">
                      No payment. No credit card. Just upload your CV.
                    </p>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-800 hover:shadow-lg hover:shadow-primary-100"
                  >
                    <span>Transform My CV — 1500 PKR</span>
                    <ArrowRight className="h-4 w-4 text-gold" />
                  </Link>
                )}
                <a
                  href="#how-it-works"
                  className="flex items-center justify-center rounded-xl border border-slate-205 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 h-[48px]"
                >
                  <span>See How It Works</span>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-gold shrink-0" />
                  <span>ATS-Safe Layout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-gold shrink-0" />
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4.5 w-4.5 text-gold shrink-0" />
                  <span>Instant PDF downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-gold shrink-0" />
                  <span>Email Delivery</span>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative w-full max-w-[420px] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl shadow-slate-200/50"
              >
                <div className="absolute -top-4 -left-4 h-12 w-12 rounded-xl bg-blue-100/60 blur-lg" />
                <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-xl bg-indigo-100/60 blur-lg" />
                
                <img
                  src="/images/cv_hero.png"
                  alt="Sophi AI CV builder dashboard showing ATS score and rewritten resume"
                  className="rounded-xl w-full object-cover border border-slate-100 shadow-sm"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              How Sophi Works
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Get an interview-ready job profile package in under 60 seconds.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary font-bold text-base">
                01
              </div>
              <h3 className="text-base font-bold text-slate-850">Pay 1500 PKR</h3>
              <p className="text-xs leading-relaxed text-slate-550">
                Unlock full access securely via JazzCash or Easypaisa card checkouts. Simple slot credits activation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary font-bold text-base">
                02
              </div>
              <h3 className="text-base font-bold text-slate-850">Upload Original CV</h3>
              <p className="text-xs leading-relaxed text-slate-550">
                Upload your PDF or Word document. Choose target sector preferences and insert job descriptions to customize.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary font-bold text-base">
                03
              </div>
              <h3 className="text-base font-bold text-slate-850">Download in 60s</h3>
              <p className="text-xs leading-relaxed text-slate-550">
                Instantly retrieve your rewritten CV, score analysis, matching tags, cover letter, and LinkedIn headline card.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              What You Get with Sophi
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Our AI optimization pipeline leverages industry-standard recruitment benchmarks.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm space-y-4 hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{feat.title}</h3>
                  <p className="text-[11.5px] leading-relaxed text-slate-500">{feat.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Pricing — 1500 PKR, Everything Included
            </h2>
            <p className="text-sm text-slate-500">
              No subscription fees. Pay only for what you revamp.
            </p>
          </div>

          {isBetaActive() ? (
            <div className="mx-auto max-w-md rounded-2xl border-2 border-gold-450 bg-white p-8 shadow-md relative overflow-hidden ring-1 ring-gold-500/5">
              <div className="absolute top-0 right-0 rounded-bl-lg bg-gold px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                Free Beta
              </div>
              
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Single Revamp</span>
              <span className="mt-2 block text-4.5xl font-black text-gold">FREE</span>
              <span className="block text-xs text-slate-400 line-through mt-0.5 font-bold">1,500 PKR</span>
              
              <ul className="mt-6 space-y-3.5 text-left border-t border-slate-100 pt-6 text-xs text-slate-655 font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>AI Revamped CV (ATS-optimized)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>ATS keyword scoring and formatting audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>LinkedIn headline and bio optimization tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>Job Description targeted Cover Letter</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>49 Professional CV Templates export</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/login"
                  className="flex w-full justify-center items-center gap-1 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-800 shadow-md shadow-primary-100"
                >
                  <span>Get My Free CV Now</span>
                  <ChevronRight className="h-4 w-4 text-gold" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border border-primary-200 bg-white p-8 shadow-md relative overflow-hidden ring-1 ring-primary-500/5">
              <div className="absolute top-0 right-0 rounded-bl-lg bg-primary px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                Popular
              </div>
              
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Single Revamp</span>
              <span className="mt-2 block text-4xl font-black text-slate-900">1,500 PKR</span>
              
              <ul className="mt-6 space-y-3.5 text-left border-t border-slate-100 pt-6 text-xs text-slate-600 font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>AI Revamped CV (ATS-optimized)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>ATS keyword scoring and formatting audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>LinkedIn headline and bio optimization tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>Job Description targeted Cover Letter</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span>49 Professional CV Templates export</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/login"
                  className="flex w-full justify-center items-center gap-1 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary-800 shadow-md shadow-primary-100"
                >
                  <span>Get Started Now</span>
                  <ChevronRight className="h-4 w-4 text-gold" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section with Golden Answer Format */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Everything you need to know about our AI CV builder.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">What is Sophi?</h3>
              <QuickAnswer 
                question="What is Sophi?"
                answer="Sophi is an AI-powered CV builder for Pakistani professionals. You upload your existing CV, and our AI rewrites it into a fully ATS-optimized career document including a professional summary, achievement-based bullets, LinkedIn optimizer, cover letter, and gap analysis — all for 1500 PKR." 
              />
              <p className="text-sm text-slate-600">
                Built specifically for the Pakistani job market, Sophi ensures your application passes digital screening and reaches human eyes. Our customized AI models target over 12 sectors with specifically crafted keywords and formatting.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">What is an ATS score and why does it matter?</h3>
              <QuickAnswer 
                question="What is an ATS score and why does it matter?"
                answer="An ATS (Applicant Tracking System) score measures how well your CV passes automated screening software that 98% of large companies use. A low ATS score means your CV gets filtered out before any human sees it. Sophi scores your CV across 5 dimensions and rewrites it to maximize your score." 
              />
              <p className="text-sm text-slate-600">
                ATS scoring algorithms read for keyword density, layout compliance, and semantic relevance. Without optimization, highly qualified candidates fail screening simply because of poor formatting.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">How do I pay for Sophi?</h3>
              <QuickAnswer 
                question="How do I pay for Sophi?"
                answer="Sophi accepts payment via JazzCash and Easypaisa — Pakistan's most popular mobile payment platforms. No credit card required." 
              />
              <p className="text-sm text-slate-600">
                You can directly pay via our integrated checkout securely. Your account is activated instantly after the payment completes, providing you immediate access to your revamped career documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Logo width={64} height={64} showTagline={true} />
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} JoinSophi.com AI CV Platform. Powered by Moonshot API. All rights reserved.
          </p>

          <a
            href="https://wa.me/923000000000?text=I%20have%2520a%2520question%2520about%2520Sophi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          >
            <MessageSquare className="h-4 w-4 text-gold" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </footer>
    </div>
  )
}
