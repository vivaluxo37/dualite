import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, TrendingUp, ExternalLink, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Broker } from '@/types'

export function FeaturedBrokers() {
  const { data: brokers = [], isLoading } = useQuery<Broker[]>({
    queryKey: ['featured-brokers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('is_active', true)
        .order('trust_score', { ascending: false })
        .limit(3)

      if (error) throw error
      return data
    },
  })

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">Top Rated Brokers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our highest-rated brokers based on our comprehensive Trust Score methodology.
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brokers.map((broker, index) => (
              <motion.div
                key={broker.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {broker.logo_url ? (
                            <img src={broker.logo_url} alt={broker.name} className="w-12 h-12 object-contain" />
                          ) : (
                            <TrendingUp className="h-8 w-8 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle>{broker.name}</CardTitle>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {broker.regulations.slice(0, 2).map((reg) => (
                              <Badge key={reg} variant="secondary" className="text-xs">{reg}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {broker.avg_rating.toFixed(1)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="font-medium">Trust Score</span>
                          <span className="font-bold">{broker.trust_score}/100</span>
                        </div>
                        <Progress value={broker.trust_score} className="h-2" indicatorClassName={getTrustScoreColor(broker.trust_score)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">Min. Deposit</div>
                          <div className="font-medium">${broker.min_deposit}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg. Spreads</div>
                          <div className="font-medium">{broker.spreads_avg} pips</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                       <Button asChild className="w-full">
                          <Link to={`/review/${broker.id}`}>Read Review</Link>
                        </Button>
                        {broker.affiliate_url && (
                          <Button variant="outline" className="w-full" asChild>
                            <a href={broker.affiliate_url} target="_blank" rel="noopener noreferrer">
                              Visit Broker <ExternalLink className="ml-2" />
                            </a>
                          </Button>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
         <div className="text-center mt-12">
          <Button variant="secondary" asChild>
            <Link to="/brokers">View All Brokers</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
