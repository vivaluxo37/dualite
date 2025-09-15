const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ'

const supabase = createClient(supabaseUrl, supabaseKey)

// Enhanced blog content formatter
class BlogContentFormatter {
  constructor(seoData) {
    this.seoData = seoData
  }

  generateSEOTitle(baseTitle) {
    const currentYear = new Date().getFullYear()
    const keyword = this.seoData.primaryKeyword
    
    let optimizedTitle = baseTitle
    
    if (!baseTitle.toLowerCase().includes(keyword.toLowerCase())) {
      optimizedTitle = `${keyword}: ${baseTitle}`
    }

    if (!optimizedTitle.includes(currentYear.toString())) {
      optimizedTitle = `${optimizedTitle}: ${currentYear} Guide`
    }

    if (optimizedTitle.length < 50) {
      optimizedTitle += ` - ${currentYear}`
    } else if (optimizedTitle.length > 60) {
      optimizedTitle = optimizedTitle.substring(0, 57) + '...'
    }

    return optimizedTitle
  }

  generateSEODescription(sections) {
    const firstSection = sections[0]
    const introduction = firstSection.content.substring(0, 100)
    const keyword = this.seoData.primaryKeyword
    
    let description = `${introduction}... Learn about ${keyword}`
    
    if (this.seoData.searchIntent === 'informational') {
      description += '. Discover expert tips, strategies, and insights.'
    } else if (this.seoData.searchIntent === 'commercial') {
      description += '. Find the best tools and brokers for your needs.'
    }

    if (description.length > 160) {
      description = description.substring(0, 157) + '...'
    }

    return description
  }

  generateAnchor(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  generatePostStructure(title, sections, faqQuestions) {
    const seoTitle = this.generateSEOTitle(title)
    const seoDescription = this.generateSEODescription(sections)
    const readingTime = Math.ceil(sections.reduce((total, section) => total + section.wordCount, 0) / 225)
    const keyTakeaways = this.generateKeyTakeaways(sections)
    const tableOfContents = this.generateTableOfContents(sections)
    const processedSections = this.processSections(sections)
    const faq = this.generateFAQ(faqQuestions)

    return {
      title,
      seoTitle,
      seoDescription,
      keywords: [this.seoData.primaryKeyword, ...this.seoData.secondaryKeywords],
      readingTime,
      keyTakeaways,
      tableOfContents,
      sections: processedSections,
      faq
    }
  }

  generateKeyTakeaways(sections) {
    const takeaways = []
    
    sections.forEach(section => {
      if (section.keyPoints.length > 0) {
        takeaways.push(section.keyPoints[0])
      }
    })

    while (takeaways.length < 4 && takeaways.length < sections.length) {
      const section = sections[takeaways.length]
      if (section.content.length > 100) {
        takeaways.push(`Learn about ${section.title.toLowerCase()}`)
      }
    }

    return takeaways.slice(0, 5)
  }

  generateTableOfContents(sections) {
    return sections.map((section, index) => ({
      id: `section-${index + 1}`,
      title: section.title,
      level: section.level,
      anchor: this.generateAnchor(section.title)
    }))
  }

  processSections(sections) {
    return sections.map((section, index) => ({
      ...section,
      id: `section-${index + 1}`,
      anchor: this.generateAnchor(section.title),
      content: this.enhanceContentWithKeywords(section.content, section.level)
    }))
  }

  enhanceContentWithKeywords(content, level) {
    if (level !== 2) return content

    const primaryKeyword = this.seoData.primaryKeyword
    const secondaryKeywords = this.seoData.secondaryKeywords
    
    let enhancedContent = content
    
    if (!content.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      enhancedContent = `${primaryKeyword}: ${enhancedContent}`
    }

    if (enhancedContent.length > 300) {
      const keyword = secondaryKeywords[Math.floor(Math.random() * secondaryKeywords.length)]
      if (!enhancedContent.toLowerCase().includes(keyword.toLowerCase())) {
        enhancedContent += ` Understanding ${keyword} is also crucial for success.`
      }
    }

    return enhancedContent
  }

  generateFAQ(questions) {
    return questions.map(question => ({
      question,
      answer: this.generateFAQAnswer(question),
      keywords: [this.seoData.primaryKeyword]
    }))
  }

  generateFAQAnswer(question) {
    const primaryKeyword = this.seoData.primaryKeyword
    
    if (question.toLowerCase().includes('what is')) {
      return `${primaryKeyword} is a comprehensive approach to protecting your trading capital through systematic risk control techniques. It involves setting proper position sizes, using stop-loss orders, and maintaining emotional discipline to preserve your investment.`
    }
    
    if (question.toLowerCase().includes('how much')) {
      return `Professional traders typically risk 1-2% of their trading capital per trade. For example, with a $10,000 account, you should risk no more than $100-$200 per trade. This approach ensures you can survive drawdowns and continue trading.`
    }
    
    if (question.toLowerCase().includes('stop loss')) {
      return `A stop-loss order automatically closes your trade when the price reaches a predetermined level. It's essential for limiting potential losses and should be placed at logical levels based on technical analysis or support/resistance levels.`
    }
    
    return `Effective ${primaryKeyword} requires a combination of proper position sizing, strategic stop-loss placement, emotional discipline, and continuous monitoring of your trading performance and risk exposure.`
  }
}

// Risk management blog post data
const riskManagementBlogData = {
  seoData: {
    primaryKeyword: 'risk management forex',
    secondaryKeywords: ['trading risk', 'position sizing', 'stop loss strategies', 'capital preservation'],
    lsiKeywords: ['money management', 'trading psychology', 'risk per trade', 'drawdown control'],
    searchIntent: 'informational',
    targetAudience: 'beginner',
    contentDepth: 'comprehensive',
    wordCountTarget: 2500
  },
  title: 'Risk Management in Forex Trading',
  sections: [
    {
      title: 'Understanding Risk in Forex Trading',
      level: 2,
      content: `Risk management in forex trading is the cornerstone of sustainable trading success. While many traders focus primarily on finding profitable entry points, the reality is that effective risk control separates professional traders from those who consistently lose money. The forex market's inherent volatility, with leverage ratios often exceeding 100:1, means that poor risk management can lead to catastrophic losses in a matter of minutes.

At its core, risk management forex strategies are designed to protect your capital while allowing your profitable trades to grow. This involves a systematic approach to determining how much capital to risk on each trade, where to place stop-loss orders, and how to manage your overall portfolio risk. Successful traders understand that preserving capital is more important than chasing profits, especially in the early stages of their trading career.

The psychological aspects of risk management cannot be overstated. When you have a solid risk management plan, you trade with greater confidence and emotional stability, knowing that no single trade can significantly damage your account. This mental clarity leads to better decision-making and helps prevent the emotional trading mistakes that plague many inexperienced traders.

Market volatility presents both opportunities and risks. Professional traders embrace volatility as a source of opportunity while implementing robust risk controls to protect against adverse movements. This balanced approach allows them to participate in major market trends while maintaining strict discipline over their risk exposure.`,
      wordCount: 385,
      keyPoints: [
        'Risk management is the cornerstone of sustainable trading success',
        'Effective risk control separates professionals from losing traders',
        'Psychological benefits include confidence and emotional stability',
        'Balancing opportunity with protection is key to professional trading'
      ]
    },
    {
      title: 'The 1% Rule: Professional Risk Management',
      level: 2,
      content: `The 1% rule stands as the gold standard in risk management forex practices. Professional traders consistently risk no more than 1% of their trading capital on any single trade. This conservative approach ensures that even during periods of significant drawdown, your trading account remains intact and capable of recovering.

For example, with a $10,000 trading account, the 1% rule means risking no more than $100 per trade. This allows you to withstand a string of consecutive losses while maintaining sufficient capital to continue trading. The mathematics behind this approach are compelling: if you risk 2% per trade, ten consecutive losses would reduce your account by approximately 18%, whereas with 1% risk, the same losing streak would only reduce your account by about 9%.

Position sizing becomes critical when implementing the 1% rule. You must calculate your position size based on your stop-loss distance and the 1% risk threshold. For instance, if your stop-loss is 50 pips away from your entry, and you're risking $100, your position size should be 2 mini lots (each pip worth approximately $1). This systematic approach ensures consistent risk across all trades regardless of market conditions or currency pair volatility.

Many successful traders actually risk less than 1% per trade, especially when starting out or during periods of high market uncertainty. Some prefer the 0.5% rule, which provides even greater protection against drawdowns. The key is establishing a maximum risk percentage that you never exceed, regardless of how confident you feel about a particular trade setup.`,
      wordCount: 412,
      keyPoints: [
        'Never risk more than 1% of trading capital on any single trade',
        'Position sizing must align with stop-loss distance and risk threshold',
        'Lower risk percentages (0.5%) provide additional protection',
        'Consistent risk application regardless of trade confidence'
      ]
    },
    {
      title: 'Strategic Stop-Loss Placement',
      level: 2,
      content: `Stop-loss orders represent your primary defense against catastrophic losses in forex trading. Proper stop-loss placement requires careful consideration of market structure, volatility, and technical analysis rather than arbitrary percentage-based decisions. Professional traders place stops at logical levels that respect market dynamics while protecting their predetermined risk parameters.

Technical analysis provides several optimal locations for stop-loss placement. Support and resistance levels offer natural boundaries where price reversals are likely to occur. Placing stops just beyond these levels provides logical exit points if the trade thesis proves incorrect. Similarly, trend lines, moving averages, and Fibonacci retracement levels can serve as dynamic stop-loss locations that adapt to changing market conditions.

Volatility-based stop-loss strategies account for current market conditions by adjusting stop distances based on recent price action. The Average True Range (ATR) indicator excels at this approach, helping traders set stops that accommodate normal market fluctuations while protecting against abnormal movements. A common strategy involves placing stops 2-3 times the ATR value away from the entry point.

Time-based stops provide another dimension to risk management by limiting exposure to trades that don't perform as expected within a predetermined timeframe. For example, if a breakout trade doesn't show follow-through within 24-48 hours, it may indicate lack of conviction, warranting an exit regardless of price action. This time element adds an additional layer of risk control beyond pure price-based stops.`,
      wordCount: 397,
      keyPoints: [
        'Place stops at logical technical levels (support/resistance, trend lines)',
        'Use volatility-based stops with indicators like Average True Range (ATR)',
        'Implement time-based stops for trades lacking timely performance',
        'Avoid arbitrary percentage-based stop placement'
      ]
    },
    {
      title: 'Risk-Reward Ratios and Trade Selection',
      level: 2,
      content: `Risk-reward ratios form the foundation of profitable trading systems and should be evaluated before entering any trade. A positive risk-reward ratio means your potential profit exceeds your potential loss, providing a mathematical edge even with a moderate win rate. Professional traders typically seek minimum risk-reward ratios of 1:2, meaning they risk one unit to potentially gain two units.

The mathematics behind risk-reward ratios reveal why they're so crucial. With a 1:2 risk-reward ratio and a 50% win rate, you can still be profitable over time. Ten trades with this profile would result in five wins (+10 units) and five losses (-5 units), yielding a net profit of 5 units. However, with a 1:1 ratio, the same 50% win rate would break even before transaction costs.

Trade selection should incorporate risk-reward analysis as a primary filter. Before entering any trade, identify your logical stop-loss level based on technical analysis, then determine your potential profit target based on market structure. If the resulting risk-reward ratio doesn't meet your minimum threshold (typically 1:2 or higher), pass on the trade regardless of how attractive the setup may appear.

Market conditions affect achievable risk-reward ratios. Trending markets typically offer better ratios as trends can extend for significant distances, while range-bound markets may limit profit potential. Adapting your risk-reward expectations to current market conditions ensures you're not forcing trades in environments where favorable ratios are difficult to achieve.`,
      wordCount: 403,
      keyPoints: [
        'Seek minimum 1:2 risk-reward ratios for profitable trading',
        'Calculate ratios based on technical stop-loss and profit targets',
        'Use risk-reward as a primary filter for trade selection',
        'Adapt ratios to current market conditions (trending vs range-bound)'
      ]
    },
    {
      title: 'Portfolio Risk and Correlation Management',
      level: 2,
      content: `Beyond individual trade risk, successful forex traders must manage overall portfolio risk through diversification and correlation analysis. While forex trading involves currency pairs rather than traditional assets, understanding correlations between different pairs helps prevent overexposure to similar market movements and reduces portfolio volatility.

Currency correlations measure how different pairs move in relation to each other. Positive correlations mean pairs tend to move in the same direction, while negative correlations indicate opposite movements. For example, EUR/USD and GBP/USD typically show positive correlation, while EUR/USD and USD/CHF often move in opposite directions. Monitoring these correlations helps avoid concentrated risk exposure.

Position sizing across correlated pairs requires careful consideration. If you're already long EUR/USD, taking a long position in GBP/USD effectively doubles your exposure to USD weakness. Professional traders either reduce position sizes on correlated trades or seek non-correlated opportunities to achieve true diversification. Some traders set limits on total exposure to correlated currency groups.

Maximum portfolio risk represents another crucial consideration. Beyond the 1% per trade rule, many traders limit total portfolio exposure to 5-10% at any given time. This means even if you identify multiple excellent trade opportunities, you may need to pass on some or reduce position sizes to maintain overall portfolio risk within acceptable limits.

Hedging strategies using negatively correlated pairs can provide additional risk management flexibility. For example, if you're concerned about USD volatility but want to maintain some market exposure, positions in both EUR/USD and USD/CHF could provide natural hedging benefits while still allowing participation in market movements.`,
      wordCount: 418,
      keyPoints: [
        'Understand currency correlations to avoid concentrated risk exposure',
        'Reduce position sizes when trading correlated currency pairs',
        'Limit total portfolio risk to 5-10% of trading capital',
        'Consider hedging strategies using negatively correlated pairs'
      ]
    },
    {
      title: 'Advanced Risk Management Techniques',
      level: 2,
      content: `Professional forex traders employ sophisticated risk management techniques beyond basic stop-loss orders and position sizing. These advanced methods help navigate complex market environments and protect capital during periods of elevated volatility or uncertainty.

Trailing stops dynamically adjust to market movements, locking in profits while allowing winning trades to continue running. A typical trailing stop might maintain a fixed distance below the current price for long positions, moving up as the price advances but never downward. This approach maximizes trend-following potential while protecting accumulated gains.

Scaling in and out of positions provides flexibility in risk management. Rather than entering full position at once, traders might enter in increments as the trade proves correct, reducing initial risk exposure. Similarly, taking partial profits at predetermined levels locks in gains while allowing remaining positions to capture further potential upside.

Multiple time frame analysis enhances risk management by confirming trade setups across different time horizons. For example, a trade might be taken on the 4-hour chart only if it aligns with the daily trend, reducing the likelihood of fighting major market forces. This multi-timeframe approach provides additional confirmation and reduces false signals.

Volatility-adjusted position sizing accounts for changing market conditions by varying position sizes based on current volatility levels. During high volatility periods, positions are reduced to accommodate wider stop-loss distances, while low volatility environments allow larger positions with tighter stops. This dynamic approach maintains consistent dollar risk across varying market conditions.

Risk-on/risk-off analysis helps position trades according to broader market sentiment. During risk-on periods, traders might favor higher-yielding currencies and carry trades, while risk-off environments might see rotation toward safe-haven currencies like USD, JPY, or CHF. Understanding these macro themes helps align trading strategies with prevailing market sentiment.`,
      wordCount: 435,
      keyPoints: [
        'Use trailing stops to lock in profits while allowing trends to develop',
        'Scale in/out of positions to manage risk exposure dynamically',
        'Confirm trades across multiple time frames for higher probability setups',
        'Adjust position sizes based on current market volatility',
        'Consider broader risk-on/risk-off market sentiment in positioning'
      ]
    },
    {
      title: 'Trading Psychology and Emotional Discipline',
      level: 2,
      content: `The psychological aspects of risk management often present the greatest challenge for forex traders. Even with perfect technical analysis and well-defined risk rules, emotional decision-making can undermine the most sophisticated trading strategies. Developing mental discipline is therefore essential for consistent risk management.

Fear of loss typically manifests as premature exit of winning trades or hesitation in taking valid setups. This emotional response often stems from risking too much capital or having unrealistic expectations about market movements. By adhering to the 1% rule and accepting small losses as normal trading costs, traders can reduce fear-based decision-making.

Greed and overconfidence lead to excessive risk-taking and deviation from established risk parameters. After a series of winning trades, traders might increase position sizes beyond their risk limits or abandon stop-loss orders in pursuit of greater profits. This emotional state often precedes significant losses that wipe out previous gains.

Revenge trading represents one of the most destructive emotional behaviors in forex trading. After experiencing a loss, some traders immediately place new trades with larger sizes in an attempt to recover losses quickly. This emotional response typically leads to further losses and can rapidly deplete trading capital.

Maintaining a trading journal helps identify emotional patterns and improve psychological discipline. By documenting not just trade entries and exits, but also the reasoning behind decisions and emotional states during trading, traders can recognize destructive patterns and work to correct them over time.`,
      wordCount: 408,
      keyPoints: [
        'Fear causes premature exits and hesitation in taking valid setups',
        'Greed leads to excessive risk-taking and abandoned risk parameters',
        'Revenge trading after losses typically compounds losses',
        'Trading journals help identify emotional patterns and improve discipline'
      ]
    },
    {
      title: 'Building Your Risk Management Plan',
      level: 2,
      content: `A comprehensive risk management plan serves as your personal constitution for forex trading, providing clear guidelines that govern every trading decision. This written document should be developed before risking real capital and reviewed regularly to ensure ongoing effectiveness.

Maximum risk per trade represents the foundation of your plan, typically set at 1% or less of trading capital. This rule should never be violated regardless of market conditions or trade confidence. Document exactly how you calculate position sizes based on this risk percentage and stop-loss distances.

Stop-loss strategies need explicit definition in your plan. Specify where you place stops based on technical analysis, volatility measurements, or other objective criteria. Your plan should also address trailing stop implementation and conditions for manual stop adjustments during active trades.

Portfolio risk limits establish boundaries for total market exposure. Document your maximum simultaneous exposure, correlation limits between positions, and guidelines for diversification across currency pairs. These parameters prevent overconcentration in any single market direction or currency group.

Trade evaluation criteria help objectively assess whether potential setups meet your risk-reward requirements. Specify minimum risk-reward ratios, confirmation requirements, and market conditions necessary for trade entry. Having these criteria predefined prevents emotional or impulsive trading decisions.

Regular performance review completes the risk management cycle. Your plan should include procedures for analyzing trade results, identifying areas for improvement, and adjusting strategies based on changing market conditions or personal performance. This continuous improvement process keeps your risk management approach effective over time.

Remember that your risk management plan should reflect your personal trading style, risk tolerance, and financial situation. While general principles apply to all traders, the specific implementation should be customized to your individual circumstances and goals.`,
      wordCount: 425,
      keyPoints: [
        'Document maximum risk per trade (typically 1% or less)',
        'Define explicit stop-loss placement strategies and adjustment rules',
        'Establish portfolio risk limits and diversification guidelines',
        'Set objective trade evaluation criteria including minimum risk-reward ratios',
        'Implement regular performance reviews and plan adjustments'
      ]
    }
  ],
  faqQuestions: [
    'What is risk management in forex trading?',
    'How much should I risk per trade in forex?',
    'Where should I place my stop-loss orders?',
    'What is a good risk-reward ratio in forex trading?',
    'How do I calculate position size based on risk?',
    'What are the most common risk management mistakes?',
    'How does leverage affect risk management?',
    'Can I make money with a low win rate using good risk management?'
  ]
}

async function updateRiskManagementBlogPost() {
  try {
    const formatter = new BlogContentFormatter(riskManagementBlogData.seoData)
    const postStructure = formatter.generatePostStructure(
      riskManagementBlogData.title,
      riskManagementBlogData.sections,
      riskManagementBlogData.faqQuestions
    )

    // Create enhanced content with proper structure
    const enhancedContent = `
<!-- SEO Meta Data -->
${postStructure.seoDescription}

<!-- Key Takeaways -->
<h2>Key Takeaways</h2>
<ul>
${postStructure.keyTakeaways.map(takeaway => `<li>${takeaway}</li>`).join('')}
</ul>

<!-- Table of Contents -->
<h2>Table of Contents</h2>
<ol>
${postStructure.tableOfContents.map(item => `<li><a href="#${item.anchor}">${item.title}</a></li>`).join('')}
</ol>

<!-- Main Content -->
${postStructure.sections.map(section => `
<h${section.level} id="${section.anchor}">${section.title}</h${section.level}>
${section.content}

${section.keyPoints.length > 0 ? `
<h4>Key Points:</h4>
<ul>
${section.keyPoints.map(point => `<li>${point}</li>`).join('')}
</ul>
` : ''}
`).join('')}

<!-- FAQ Section -->
<h2>Frequently Asked Questions</h2>
${postStructure.faq.map(faq => `
<h3>${faq.question}</h3>
<p>${faq.answer}</p>
`).join('')}
`

    // Update the blog post
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: postStructure.seoTitle,
        content: enhancedContent,
        excerpt: postStructure.seoDescription,
        updated_at: new Date().toISOString(),
        reading_time: postStructure.readingTime,
        meta_keywords: postStructure.keywords.join(', '),
        meta_description: postStructure.seoDescription,
        seo_title: postStructure.seoTitle,
        seo_description: postStructure.seoDescription,
        seo_keywords: postStructure.keywords.join(', ')
      })
      .eq('slug', 'risk-management-forex-trading')
      .select()

    if (error) {
      console.error('Error updating blog post:', error)
      return
    }

    console.log('✅ Blog post updated successfully!')
    console.log('📝 Title:', postStructure.seoTitle)
    console.log('📊 Word Count:', postStructure.sections.reduce((total, section) => total + section.wordCount, 0))
    console.log('⏱️ Reading Time:', postStructure.readingTime, 'minutes')
    console.log('🔍 Keywords:', postStructure.keywords.join(', '))
    console.log('📄 Description Length:', postStructure.seoDescription.length, 'characters')

  } catch (error) {
    console.error('Error:', error)
  }
}

updateRiskManagementBlogPost()