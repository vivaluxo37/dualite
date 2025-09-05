import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Users, Database, Globe, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Link } from 'react-router-dom'

const lastUpdated = 'January 15, 2025'

const privacySections = [
  {
    id: 'information-collection',
    title: 'Information We Collect',
    icon: Database,
    content: [
      {
        subtitle: 'Personal Information',
        text: 'When you create an account or use our services, we may collect personal information such as your name, email address, phone number, and country of residence. This information is collected when you voluntarily provide it to us.'
      },
      {
        subtitle: 'Usage Data',
        text: 'We automatically collect information about how you interact with our website, including pages visited, time spent on pages, browser type, device information, and IP address. This helps us improve our services and user experience.'
      },
      {
        subtitle: 'Cookies and Tracking',
        text: 'We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can control cookie settings through your browser preferences.'
      },
      {
        subtitle: 'Third-Party Information',
        text: 'We may receive information about you from third-party sources, such as broker partners or social media platforms, when you interact with our content or services through these channels.'
      }
    ]
  },
  {
    id: 'information-use',
    title: 'How We Use Your Information',
    icon: Eye,
    content: [
      {
        subtitle: 'Service Provision',
        text: 'We use your information to provide and maintain our services, including broker comparisons, educational content, trading tools, and personalized recommendations.'
      },
      {
        subtitle: 'Communication',
        text: 'We may use your contact information to send you important updates about our services, respond to your inquiries, and provide customer support.'
      },
      {
        subtitle: 'Personalization',
        text: 'Your information helps us personalize your experience, including customized broker recommendations, relevant educational content, and tailored trading tools.'
      },
      {
        subtitle: 'Analytics and Improvement',
        text: 'We analyze usage patterns and user feedback to improve our website functionality, develop new features, and enhance the overall user experience.'
      },
      {
        subtitle: 'Legal Compliance',
        text: 'We may use your information to comply with legal obligations, enforce our terms of service, and protect the rights and safety of our users and the public.'
      }
    ]
  },
  {
    id: 'information-sharing',
    title: 'Information Sharing and Disclosure',
    icon: Users,
    content: [
      {
        subtitle: 'Broker Partners',
        text: 'When you express interest in a broker through our platform, we may share relevant information with that broker to facilitate your inquiry. This is done only with your explicit consent.'
      },
      {
        subtitle: 'Service Providers',
        text: 'We may share information with trusted third-party service providers who assist us in operating our website, conducting business, or serving our users, provided they agree to keep this information confidential.'
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information when required by law, court order, or government regulation, or when we believe disclosure is necessary to protect our rights or the safety of others.'
      },
      {
        subtitle: 'Business Transfers',
        text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction, subject to the same privacy protections.'
      },
      {
        subtitle: 'Aggregated Data',
        text: 'We may share aggregated, non-personally identifiable information for research, marketing, or other business purposes without restriction.'
      }
    ]
  },
  {
    id: 'data-security',
    title: 'Data Security and Protection',
    icon: Lock,
    content: [
      {
        subtitle: 'Security Measures',
        text: 'We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.'
      },
      {
        subtitle: 'Data Retention',
        text: 'We retain your personal information only as long as necessary to fulfill the purposes outlined in this privacy policy, comply with legal obligations, or resolve disputes.'
      },
      {
        subtitle: 'Access Controls',
        text: 'Access to your personal information is restricted to authorized personnel who need the information to perform their job functions and are bound by confidentiality obligations.'
      },
      {
        subtitle: 'Incident Response',
        text: 'In the unlikely event of a data breach, we have procedures in place to respond quickly, assess the impact, and notify affected users and relevant authorities as required by law.'
      }
    ]
  },
  {
    id: 'user-rights',
    title: 'Your Rights and Choices',
    icon: Shield,
    content: [
      {
        subtitle: 'Access and Correction',
        text: 'You have the right to access, update, or correct your personal information. You can do this through your account settings or by contacting our support team.'
      },
      {
        subtitle: 'Data Portability',
        text: 'You may request a copy of your personal information in a structured, machine-readable format, and you have the right to transmit this data to another service provider.'
      },
      {
        subtitle: 'Deletion Rights',
        text: 'You can request the deletion of your personal information, subject to certain legal and contractual obligations. We will respond to such requests within a reasonable timeframe.'
      },
      {
        subtitle: 'Marketing Communications',
        text: 'You can opt out of receiving marketing communications from us at any time by using the unsubscribe link in our emails or updating your communication preferences in your account.'
      },
      {
        subtitle: 'Cookie Management',
        text: 'You can control and manage cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our website.'
      }
    ]
  },
  {
    id: 'international-transfers',
    title: 'International Data Transfers',
    icon: Globe,
    content: [
      {
        subtitle: 'Cross-Border Processing',
        text: 'Your information may be processed and stored in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws.'
      },
      {
        subtitle: 'Safeguards',
        text: 'When transferring data internationally, we implement appropriate safeguards such as standard contractual clauses, adequacy decisions, or other legally recognized transfer mechanisms.'
      },
      {
        subtitle: 'EU-US Data Transfers',
        text: 'For transfers from the European Union to the United States, we comply with applicable frameworks and regulations to ensure adequate protection of personal data.'
      }
    ]
  }
]

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us your privacy questions',
    contact: 'privacy@brokeranalysis.com',
    action: 'mailto:privacy@brokeranalysis.com'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak with our privacy team',
    contact: '(801) 893-2577',
    action: 'tel:+18018932577'
  }
]

export function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">
          At Broker Analysis, we are committed to protecting your privacy and ensuring the security of your personal information. This privacy policy explains how we collect, use, and safeguard your data.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline">Last Updated: {lastUpdated}</Badge>
          <Badge variant="secondary">GDPR Compliant</Badge>
        </div>
      </motion.div>

      {/* Quick Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Privacy at a Glance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <Database className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Data Collection</h3>
                <p className="text-xs text-muted-foreground">Only what's necessary for our services</p>
              </div>
              <div className="text-center">
                <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Security</h3>
                <p className="text-xs text-muted-foreground">Industry-standard encryption</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Sharing</h3>
                <p className="text-xs text-muted-foreground">Only with your consent</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Your Rights</h3>
                <p className="text-xs text-muted-foreground">Full control over your data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Table of Contents */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {privacySections.map((section) => {
                  const Icon = section.icon
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors text-sm"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span>{section.title}</span>
                    </a>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Privacy Policy Content */}
        <div className="lg:col-span-3 space-y-8">
          {privacySections.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (sectionIndex + 3) }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h4 className="font-semibold mb-2 text-primary">{item.subtitle}</h4>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Questions About Privacy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about this privacy policy or how we handle your personal information, please don't hesitate to contact us.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon
                    return (
                      <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold text-sm">{method.title}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{method.description}</p>
                          <a 
                            href={method.action}
                            className="text-sm text-primary hover:underline"
                          >
                            {method.contact}
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-2">Mailing Address</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>Broker Analysis</p>
                    <p>30 N Gould St Ste R</p>
                    <p>Sheridan, WY 82801, US</p>
                    <p>EIN: 384298140</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/terms-of-service">Terms of Service</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Policy Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Policy Updates</h3>
                <p className="text-sm text-muted-foreground">
                  We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. 
                  We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date. 
                  Your continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}