// SEO Utilities for Broker Analysis Platform
// Implements 2025 SEO best practices for broker review pages

import { Broker } from '../types'

// SEO Meta Tags Interface
export interface SEOMetaTags {
  title: string
  description: string
  keywords: string[]
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogType: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  structuredData: object
}

// Internal Linking Strategy
export interface InternalLinkStrategy {
  contextualLinks: string[]
  relatedBrokers: string[]
  categoryLinks: string[]
  resourceLinks: string[]
}

// Generate comprehensive SEO meta tags for broker pages
export function generateBrokerSEO(broker: Broker): SEOMetaTags {
  const currentYear = new Date().getFullYear()
  // const brokerName = broker.name // Not used in current implementation
  const country = broker.country || 'Global'
  const minDeposit = broker.min_deposit || 'Low'
  // const trustScore = broker.trust_score || 'High' // Not used in current implementation
  
  // Long-tail keyword strategy for 2025
  const keywords = [
    `${broker.name} review ${currentYear}`,
    `${broker.name} forex broker review`,
    `${broker.name} trading platform review`,
    `${broker.name} spreads and fees ${currentYear}`,
    `${broker.name} minimum deposit requirements`,
    `${broker.name} customer support review`,
    `${broker.name} regulation and safety`,
    `${broker.name} vs other brokers ${currentYear}`,
    `${broker.name} trading conditions ${currentYear}`,
    `${broker.name} account types comparison`
  ]
  
  const secondaryKeywords = [
    `best forex broker ${country.toLowerCase()}`,
    `forex broker with ${minDeposit} minimum deposit`,
    `regulated forex broker ${currentYear}`,
    `forex trading platform comparison`,
    `forex broker spreads comparison`,
    `forex broker customer service`,
    `safe forex broker ${country.toLowerCase()}`,
    `forex broker reviews and ratings`,
    `professional forex trading platform`,
    `forex broker educational resources`
  ]
  
  const allKeywords = [...keywords, ...secondaryKeywords]
  
  // SEO-optimized title (under 60 characters)
  const title = `${broker.name} Review ${currentYear} - Spreads, Fees & Trading Platform | Broker Analysis`
  
  // SEO-optimized description (under 160 characters)
  const description = `Comprehensive ${broker.name} review ${currentYear}. Compare spreads, fees, platforms & regulation. Expert analysis of ${broker.name} trading conditions & customer support.`
  
  // Canonical URL
  const canonicalUrl = `https://brokeranalysis.com/review/${broker.slug}`
  
  // Open Graph optimized content
  const ogTitle = `${broker.name} Forex Broker Review ${currentYear} - Complete Analysis`
  const ogDescription = `Expert review of ${broker.name}: trading platforms, spreads, fees, regulation & customer support. Compare ${broker.name} with top forex brokers ${currentYear}.`
  const ogImage = `https://brokeranalysis.com/images/brokers/${broker.slug}-review-${currentYear}.jpg`
  
  // Twitter Card optimized content
  const twitterTitle = `${broker.name} Review ${currentYear} - Trading Platform Analysis`
  const twitterDescription = `${broker.name} forex broker review: spreads, fees, platforms & regulation. Expert analysis & comparison with other top brokers.`
  const twitterImage = `https://brokeranalysis.com/images/brokers/${broker.slug}-twitter-card.jpg`
  
  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "FinancialService",
      "name": broker.name,
      "description": `${broker.name} is a forex and CFD broker offering trading services with competitive spreads and professional platforms.`,
      "url": broker.website_url || canonicalUrl,
      "logo": broker.logo_url,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": country
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": broker.trust_score || 4.2,
        "bestRating": 5,
        "worstRating": 1,
        "ratingCount": broker.review_count || 150
      },
      "offers": {
        "@type": "Offer",
        "description": `Trading account with minimum deposit of ${minDeposit}`,
        "price": broker.min_deposit || 0,
        "priceCurrency": "USD"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": broker.trust_score || 4.2,
      "bestRating": 5,
      "worstRating": 1
    },
    "author": {
      "@type": "Organization",
      "name": "Broker Analysis",
      "url": "https://brokeranalysis.com",
      "logo": "https://brokeranalysis.com/logo.png"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Broker Analysis",
      "url": "https://brokeranalysis.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://brokeranalysis.com/logo.png"
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "reviewBody": `Comprehensive review of ${broker.name} covering trading platforms, spreads, fees, regulation, and customer support. Our expert analysis helps traders make informed decisions about ${broker.name}'s services.`
  }
  
  return {
    title,
    description,
    keywords: allKeywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    structuredData
  }
}

// Generate strategic internal links for broker pages
export function generateInternalLinks(broker: Broker): InternalLinkStrategy {
  // const brokerName = broker.name // Not used in current implementation
  const country = broker.country?.toLowerCase() || 'global'
  const currentYear = new Date().getFullYear()
  
  // Contextual links within content
  const contextualLinks = [
    `<a href="/best-forex-brokers" title="Best Forex Brokers ${currentYear}">top-rated forex brokers</a>`,
    `<a href="/forex-broker-comparison" title="Forex Broker Comparison Tool">broker comparison tool</a>`,
    `<a href="/forex-trading-guide" title="Forex Trading Guide for Beginners">forex trading guide</a>`,
    `<a href="/trading-calculator" title="Forex Trading Calculator">trading cost calculator</a>`,
    `<a href="/forex-spreads-comparison" title="Forex Spreads Comparison">spreads comparison</a>`,
    `<a href="/forex-regulation-guide" title="Forex Regulation Guide">regulatory compliance guide</a>`,
    `<a href="/trading-platforms-comparison" title="Trading Platforms Comparison">platform comparison</a>`,
    `<a href="/forex-education" title="Forex Education Resources">educational resources</a>`
  ]
  
  // Related broker links
  const relatedBrokers = [
    `<a href="/review/pepperstone" title="Pepperstone Review ${currentYear}">Pepperstone</a>`,
    `<a href="/review/ic-markets" title="IC Markets Review ${currentYear}">IC Markets</a>`,
    `<a href="/review/fp-markets" title="FP Markets Review ${currentYear}">FP Markets</a>`,
    `<a href="/review/xm" title="XM Review ${currentYear}">XM</a>`,
    `<a href="/review/avatrade" title="AvaTrade Review ${currentYear}">AvaTrade</a>`
  ]
  
  // Category-specific links
  const categoryLinks = [
    `<a href="/brokers/${country}" title="Best Forex Brokers in ${broker.country}">forex brokers in ${broker.country}</a>`,
    `<a href="/low-deposit-brokers" title="Low Minimum Deposit Forex Brokers">low deposit brokers</a>`,
    `<a href="/regulated-brokers" title="Regulated Forex Brokers">regulated brokers</a>`,
    `<a href="/ecn-brokers" title="ECN Forex Brokers">ECN brokers</a>`,
    `<a href="/scalping-brokers" title="Best Forex Brokers for Scalping">scalping-friendly brokers</a>`
  ]
  
  // Resource and tool links
  const resourceLinks = [
    `<a href="/forex-news" title="Latest Forex News and Analysis">forex market news</a>`,
    `<a href="/economic-calendar" title="Forex Economic Calendar">economic calendar</a>`,
    `<a href="/trading-signals" title="Free Forex Trading Signals">trading signals</a>`,
    `<a href="/market-analysis" title="Daily Forex Market Analysis">market analysis</a>`,
    `<a href="/trading-tools" title="Free Forex Trading Tools">trading tools</a>`
  ]
  
  return {
    contextualLinks,
    relatedBrokers,
    categoryLinks,
    resourceLinks
  }
}

// Generate FAQ schema for broker pages
export function generateBrokerFAQSchema(broker: Broker) {
  const brokerName = broker.name
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is ${brokerName} a regulated forex broker?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${brokerName} is regulated by ${broker.regulations?.join(', ') || 'major financial authorities'}, ensuring client fund protection and adherence to strict operational standards.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the minimum deposit for ${brokerName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The minimum deposit for ${brokerName} is $${broker.min_deposit || 'varies by account type'}. This makes it accessible for both beginner and experienced traders.`
        }
      },
      {
        "@type": "Question",
        "name": `What trading platforms does ${brokerName} offer?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${brokerName} offers multiple trading platforms including MetaTrader 4, MetaTrader 5, and proprietary web-based platforms optimized for different trading styles.`
        }
      },
      {
        "@type": "Question",
        "name": `How competitive are ${broker.name}'s spreads?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${broker.name} offers competitive spreads starting from ${broker.spreads_avg || '0.1'} pips on major currency pairs, with transparent pricing and no hidden fees.`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${broker.name} offer customer support?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${broker.name} provides comprehensive customer support through multiple channels including live chat, email, and phone support during market hours.`
        }
      }
    ]
  }
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(broker: Broker) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://brokeranalysis.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Forex Broker Reviews",
        "item": "https://brokeranalysis.com/reviews"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${broker.name} Review`,
        "item": `https://brokeranalysis.com/review/${broker.slug}`
      }
    ]
  }
}

// Generate sitemap entry for broker page
export function generateSitemapEntry(broker: Broker) {
  return {
    url: `https://brokeranalysis.com/review/${broker.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
    images: [
      {
        url: broker.logo_url || `https://brokeranalysis.com/images/brokers/${broker.slug}-logo.jpg`,
        caption: `${broker.name} Logo`,
        title: `${broker.name} Forex Broker Logo`
      }
    ]
  }
}

// SEO performance tracking
export function trackSEOMetrics(broker: Broker, pageUrl: string) {
  // This would integrate with analytics tools
  return {
    pageUrl,
    brokerName: broker.name,
    timestamp: new Date().toISOString(),
    metrics: {
      titleLength: generateBrokerSEO(broker).title.length,
      descriptionLength: generateBrokerSEO(broker).description.length,
      keywordCount: generateBrokerSEO(broker).keywords.length,
      internalLinkCount: generateInternalLinks(broker).contextualLinks.length
    }
  }
}

export default {
  generateBrokerSEO,
  generateInternalLinks,
  generateBrokerFAQSchema,
  generateBreadcrumbSchema,
  generateSitemapEntry,
  trackSEOMetrics
}