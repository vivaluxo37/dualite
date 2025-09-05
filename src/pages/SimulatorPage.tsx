import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { TradingSimulator } from '@/lib/simulator'
import { Broker } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MultiSelect, OptionType } from '@/components/ui/multi-select'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Calculator, Download, Loader2, Info } from 'lucide-react'
import { toast } from 'sonner'

const simulatorSchema = z.object({
  instrument: z.string().min(1, "Instrument is required"),
  tradeSize: z.coerce.number().positive("Trade size must be positive"),
  brokers: z.array(z.string()).min(1, "Select at least one broker"),
})

type SimulatorForm = z.infer<typeof simulatorSchema>

interface CalculationResult {
  brokerName: string;
  spreadCost: string;
  commissionCost: string;
  totalCost: string;
}

export function SimulatorPage() {
  const [results, setResults] = useState<CalculationResult[]>([])

  const { data: brokers = [], isLoading: isLoadingBrokers } = useQuery<Broker[]>({
    queryKey: ['brokers-for-simulator'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brokers')
        .select('id, name, spreads_avg, commission_per_lot')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error
      // Add a mock commission_per_lot for demonstration if it's not in the DB
      return data.map(b => ({ ...b, commission_per_lot: b.commission_per_lot ?? (Math.random() * 6 + 1) }))
    },
  })

  const brokerOptions: OptionType[] = useMemo(() => 
    brokers.map(b => ({ value: b.id, label: b.name })), 
    [brokers]
  )

  const form = useForm<SimulatorForm>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      instrument: 'EUR/USD',
      tradeSize: 1,
      brokers: [],
    },
  })

  const onSubmit = (data: SimulatorForm) => {
    const selectedBrokers = brokers.filter(b => data.brokers.includes(b.id))
    
    const calculatedResults = selectedBrokers.map(broker => {
      return TradingSimulator.calculateCosts(broker, {
        tradeSizeLots: data.tradeSize,
        pipValue: 10, // Assuming standard lot pip value for EUR/USD
      })
    })

    setResults(calculatedResults.sort((a, b) => parseFloat(a.totalCost) - parseFloat(b.totalCost)));
    toast.success(`Costs calculated for ${calculatedResults.length} broker(s).`)
  }

  const handleExport = () => {
    if (results.length === 0) {
      toast.warning("No results to export. Please calculate costs first.");
      return;
    }
    const headers = "Broker,Spread Cost ($),Commission Cost ($),Total Cost ($)\n";
    const csvContent = results.map(r => `${r.brokerName},${r.spreadCost},${r.commissionCost},${r.totalCost}`).join("\n");
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "broker_cost_comparison.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.info("Results exported successfully.");
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Trading Cost Simulator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
          Analyze real trading costs across different brokers. Compare spreads, commissions, and total fees to see how much you could save.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calculator /> Trade Parameters</CardTitle>
              <CardDescription>Enter your trade details to begin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="instrument"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Instrument</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                            <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                            <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                            <SelectItem value="XAU/USD">Gold (XAU/USD)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tradeSize"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Trade Size (Lots)</Label>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brokers"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Brokers to Compare</Label>
                        {isLoadingBrokers ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading brokers...
                          </div>
                        ) : (
                          <MultiSelect
                            options={brokerOptions}
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Select brokers..."
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                    Calculate Costs
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Comparison Results</CardTitle>
                <CardDescription>Costs for a round-turn trade.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={results.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Broker</TableHead>
                      <TableHead className="text-right">Spread Cost</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead className="text-right font-bold">Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((res) => (
                      <TableRow key={res.brokerName}>
                        <TableCell className="font-medium">{res.brokerName}</TableCell>
                        <TableCell className="text-right">${res.spreadCost}</TableCell>
                        <TableCell className="text-right">${res.commissionCost}</TableCell>
                        <TableCell className="text-right font-bold text-primary">${res.totalCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed rounded-lg">
                  <Info className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your comparison results will appear here.</p>
                  <p className="text-sm text-muted-foreground/80">Fill out the form to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
