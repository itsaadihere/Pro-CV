export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sophi",
  "alternateName": "JoinSophi",
  "url": "https://joinsophi.com",
  "logo": "https://joinsophi.com/logo.png",
  "description": "AI-powered CV builder for Pakistani professionals. ATS-optimized resumes, cover letters, and LinkedIn optimization powered by Kimi AI.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "availableLanguage": ["English", "Urdu"]
  },
  "sameAs": [
    "https://twitter.com/JoinSophi",
    "https://linkedin.com/company/joinsophi",
    "https://instagram.com/joinsophi"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Sophi",
  "url": "https://joinsophi.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://joinsophi.com/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Sophi AI CV Builder",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "description": "Upload your existing CV and receive an AI-rewritten, ATS-optimized career document with LinkedIn optimizer, cover letter, and professional PDF export.",
  "offers": {
    "@type": "Offer",
    "price": "1500",
    "priceCurrency": "PKR",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247",
    "bestRating": "5"
  },
  "featureList": [
    "ATS Score Analysis (5 dimensions)",
    "AI CV Rewriting powered by Kimi AI",
    "Keyword Intelligence (12 industries, 500+ keywords)",
    "LinkedIn Profile Optimizer",
    "AI Cover Letter Generator",
    "Gap Analysis with Quick Wins",
    "49 Professional CV Templates",
    "PDF Export (3 template styles)",
    "Multi-language (EN/AR/FR/ES)",
    "Email delivery"
  ]
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Sophi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sophi is an AI-powered CV builder for Pakistani professionals. You upload your existing CV, and Kimi AI rewrites it into a fully ATS-optimized career document including a professional summary, achievement-based bullets, LinkedIn optimizer, cover letter, and gap analysis — all for 1500 PKR."
      }
    },
    {
      "@type": "Question",
      "name": "How does Sophi's AI improve my CV?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sophi uses Kimi AI (moonshot-v1-32k) to analyze your existing CV across 5 ATS dimensions: keyword density, formatting compliance, semantic relevance, skills alignment, and achievement clarity. It then rewrites every bullet using the STAR-Metric formula, injects 500+ industry-specific keywords, and generates a 2026-formula professional summary."
      }
    },
    {
      "@type": "Question",
      "name": "What is an ATS score and why does it matter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An ATS (Applicant Tracking System) score measures how well your CV passes automated screening software that 98% of large companies use. A low ATS score means your CV gets filtered out before any human sees it. Sophi scores your CV across 5 dimensions and rewrites it to maximize your score."
      }
    },
    {
      "@type": "Question",
      "name": "How much does Sophi cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sophi costs 1500 PKR per CV transformation. This includes the full ATS audit report, AI-rewritten CV, LinkedIn optimizer, cover letter, gap analysis with quick wins, PDF export in 49 professional templates, and email delivery of your finished document."
      }
    },
    {
      "@type": "Question",
      "name": "How do I pay for Sophi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sophi accepts payment via JazzCash and Easypaisa — Pakistan's most popular mobile payment platforms. No credit card required."
      }
    },
    {
      "@type": "Question",
      "name": "How long does Sophi take to rewrite my CV?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sophi typically completes your full CV transformation in under 60 seconds. You receive an instant PDF download on the dashboard and a copy delivered to your email."
      }
    },
    {
      "@type": "Question",
      "name": "Is Sophi available in Urdu?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sophi's interface is in English, but the platform supports CV output in English, Arabic, French, and Spanish — covering major job markets for Pakistani professionals. Urdu support is on the roadmap."
      }
    },
    {
      "@type": "Question",
      "name": "What CV file formats does Sophi accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sophi accepts PDF and DOCX (Microsoft Word) files up to 5MB. These cover the two most common CV formats used by Pakistani professionals."
      }
    }
  ]
};

export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Transform Your CV with Sophi AI",
  "description": "Use Sophi's AI to rewrite your CV into an ATS-optimized professional document in 3 steps",
  "totalTime": "PT5M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "PKR",
    "value": "1500"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Pay 1500 PKR via JazzCash or Easypaisa",
      "text": "Complete a one-time payment of 1500 PKR using JazzCash or Easypaisa. Your account is instantly unlocked after payment confirmation.",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "Upload your existing CV",
      "text": "Upload your current CV in PDF or DOCX format. Select your target industry, paste an optional job description, and choose your preferred language.",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "Download your AI-rewritten CV",
      "text": "In under 60 seconds, receive your ATS-optimized CV, LinkedIn optimizer, cover letter, and gap analysis. Download as PDF or receive via email.",
      "position": 3
    }
  ]
};

export function blogPostSchema(post: {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt: string
  authorName: string
  imageUrl: string
  wordCount: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "url": `https://joinsophi.com/blog/${post.slug}`,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.authorName,
      "url": "https://joinsophi.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sophi",
      "logo": {
        "@type": "ImageObject",
        "url": "https://joinsophi.com/logo.png"
      }
    },
    "image": post.imageUrl,
    "wordCount": post.wordCount,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://joinsophi.com/blog/${post.slug}`
    }
  };
}
