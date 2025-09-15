import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { ValuePropositions } from "@/components/landing/ValuePropositions";
import { FeaturedBrokers } from "@/components/landing/FeaturedBrokers";
import { ForexBrokersSection } from "@/components/landing/ForexBrokersSection";
import { LatestBlogPosts } from "@/components/blog/LatestBlogPosts";
import { Faq } from "@/components/landing/Faq";

export function HomePage() {
  const [siteUrl, setSiteUrl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setSiteUrl(window.location.origin);
    setCurrentUrl(window.location.href);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BrokerAnalysis - Forex Broker Reviews & Comparison",
    "description": "Comprehensive forex broker reviews, comparison tools, and trading education. Find the best forex broker for your trading needs.",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/brokers?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "author": {
      "@type": "Organization",
      "name": "BrokerAnalysis",
      "url": siteUrl
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      }
    ]
  };

  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dualite",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Leading forex broker comparison and review platform",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://twitter.com/brokeranalysis",
      "https://linkedin.com/company/brokeranalysis"
    ]
  };

  return (
    <>
      <SEO
        title="BrokerAnalysis - Best Forex Broker Reviews & Comparison 2025"
        description="Compare top forex brokers with in-depth reviews, ratings, and analysis. Find regulated brokers, compare spreads, and choose the best platform for your trading needs."
        keywords="forex brokers, broker reviews, forex trading, compare brokers, regulated brokers, trading platforms, forex broker comparison, best forex brokers 2025"
        canonicalUrl={currentUrl}
        ogType="website"
        ogTitle="BrokerAnalysis - Best Forex Broker Reviews & Comparison 2025"
        ogDescription="Compare top forex brokers with in-depth reviews, ratings, and analysis. Find regulated brokers, compare spreads, and choose the best platform for your trading needs."
        ogImage={`${siteUrl}/og-image.jpg`}
        twitterCard="summary_large_image"
        structuredData={[structuredData, breadcrumbStructuredData, organizationStructuredData]}
        additionalMetaTags={[
          { name: "viewport", content: "width=device-width, initial-scale=1" },
          { name: "robots", content: "index, follow" },
          { name: "googlebot", content: "index, follow" },
          { name: "author", content: "BrokerAnalysis" },
          { name: "language", content: "English" },
          { name: "geo.region", content: "US" },
          { name: "geo.placename", content: "United States" }
        ]}
      />
      <div className="overflow-x-hidden">
        <Hero />
        <Stats />
        <ValuePropositions />
        <FeaturedBrokers />
        <Features />
        <Testimonials />
        <ForexBrokersSection />
        <LatestBlogPosts limit={3} />
        <Faq />
      </div>
    </>
  );
}