
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is FundedGiants?",
          answer: "FundedGiants is a divine proprietary trading firm that provides funding up to $200,000 to skilled traders, with the potential to scale up to $1,000,000. We offer two celestial programs: Rhino Rush (instant funding) and Phoenix Rise (two-step evaluation). Our mission is to empower talented traders with the capital they need to achieve their trading goals while maintaining transparent and fair rules."
        },
        {
          question: "How do I get started with FundedGiants?",
          answer: "Getting started is simple:\n1. Choose your divine path from our two programs (Rhino Rush or Phoenix Rise)\n2. Select your preferred account size ($2,500 to $200,000)\n3. Complete the registration and payment process\n4. Receive your trading credentials within 24 hours\n5. Begin trading according to your program's rules\n6. Start earning profits and request withdrawals\n\nOur cosmic support team will guide you through each step of the journey."
        },
        {
          question: "What trading platforms do you support?",
          answer: "We support MetaTrader 4 (MT4) and MetaTrader 5 (MT5) platforms, providing you with professional trading tools worthy of the gods. Both platforms offer:\n- Advanced charting capabilities\n- Multiple timeframes and indicators\n- Expert Advisors (EAs) support\n- Mobile and desktop versions\n- Real-time market data\n- Professional order management tools"
        },
        {
          question: "What markets can I trade?",
          answer: "You can trade a wide variety of financial instruments including:\n- Major, Minor, and Exotic Forex pairs (EUR/USD, GBP/USD, USD/JPY, etc.)\n- Precious Metals (Gold, Silver)\n- Major Stock Indices (S&P 500, NASDAQ, DAX, FTSE, etc.)\n- Commodities (Oil, Natural Gas)\n- Cryptocurrencies (Bitcoin, Ethereum, and other major cryptos)\n\nAll instruments are available with competitive spreads and professional execution."
        }
      ]
    },
    {
      category: "Account Types & Programs",
      questions: [
        {
          question: "What's the difference between Rhino Rush and Phoenix Rise programs?",
          answer: "**Rhino Rush (Instant Funding):**\n- Immediate access to funded account\n- No evaluation phase required\n- Higher entry cost but instant gratification\n- Graduated profit splits: 50% → 60% → 70%\n- Perfect for experienced traders\n\n**Phoenix Rise (2-Step Challenge):**\n- Two evaluation phases\n- Phase 1: 10% profit target, Phase 2: 5% profit target\n- 70% profit split from first payout\n- Lowest entry cost\n- Ideal for new or budget-conscious traders"
        },
        {
          question: "What account sizes are available?",
          answer: "We offer six account sizes across all programs:\n\n- **$2,500 Account**: Perfect for beginners\n- **$5,000 Account**: Popular starter size with scaling potential\n- **$10,000 Account**: Most popular choice\n- **$25,000 Account**: For experienced traders\n- **$50,000 Account**: Professional level\n- **$100,000 Account**: Maximum initial funding\n\nAll accounts can scale up to $1,000,000 through our scaling program after meeting specific payout requirements."
        },
        {
          question: "How does account scaling work?",
          answer: "Account scaling allows you to increase your trading capital:\n\n**Scaling Rules:**\n- Most accounts scale 2x after 10 successful payouts\n- $5,000 accounts scale 2.5x (to $12,500)\n- Scaling continues until maximum limits are reached\n\n**Maximum Scaling Limits:**\n- $2,500 → No scaling\n- $5,000 → $50,000 maximum\n- $10,000 → $100,000 maximum\n- $25,000 → $250,000 maximum\n- $50,000 → $500,000 maximum\n- $100,000 → $1,000,000 maximum\n\n**Example:** A $10,000 account becomes $20,000 after 10 payouts, then $40,000 after 20 payouts, continuing until the $100,000 maximum."
        },
        {
          question: "Can I have multiple accounts?",
          answer: "Yes! Divine traders can manage multiple funded accounts simultaneously, multiplying their cosmic earning potential. \n\n**Multi-Account Rules:**\n- Each account must be traded independently\n- No hedging between accounts allowed\n- Each account follows its own profit/loss calculations\n- Separate withdrawal schedules for each account\n- Maximum of 3 accounts per trader initially\n- Additional accounts available after proven track record\n\n**Benefits:**\n- Diversify trading strategies\n- Increase overall earning potential\n- Reduce risk through portfolio approach"
        }
      ]
    },
    {
      category: "Trading Rules & Risk Management",
      questions: [
        {
          question: "What are the daily drawdown limits and how do they work?",
          answer: "Daily drawdown is limited to 4% of your account balance and is calculated from your current balance, not the starting balance.\n\n**How it works:**\n- 4% of your current account balance\n- Resets every day at 5 PM EST\n- Based on closed equity, not floating P&L\n\n**Example with $10,000 account:**\n- Starting balance: $10,000\n- Daily drawdown limit: $400 (4%)\n- If balance grows to $11,000, new daily limit: $440\n- If balance drops to $9,000, new daily limit: $360\n\n**Breach occurs when:**\nYour closed equity drops below (Current Balance - Daily Drawdown Limit) in a single trading day."
        },
        {
          question: "How does the maximum drawdown work?",
          answer: "Maximum drawdown varies by program and is calculated from your highest balance achieved (high-water mark).\n\n**Drawdown Limits:**\n- **Rhino Rush**: 7% for all account sizes\n- **Phoenix Rise**: 8% for all account sizes\n\n**How it works:**\n- Calculated from your highest closed balance\n- Never resets - always from highest point\n- Based on closed equity, not floating P&L\n\n**Example with $10,000 account (8% max drawdown):**\n- Starting balance: $10,000 → Max drawdown line: $9,200\n- Account grows to $12,000 → New max drawdown line: $11,040\n- Account grows to $15,000 → New max drawdown line: $13,800\n\n**Important:** Your closed equity must never fall below the maximum drawdown line."
        },
        {
          question: "What is the Consistency Rule?",
          answer: "The Consistency Rule ensures sustainable trading practices by requiring consistent risk management.\n\n**Rule Requirements:**\n- Maintain consistent lot sizes relative to account balance\n- Risk per trade should remain proportional\n- At least 70% of trades must follow consistent sizing\n- Prevents 'lottery ticket' trading behavior\n\n**Examples of Consistency:**\n✅ **Good:** Always using 0.1 lots on $10,000 account\n✅ **Good:** Scaling lots proportionally (0.1 lots → 0.2 lots when balance doubles)\n❌ **Bad:** Using 0.1 lots then suddenly 1.0 lots without balance increase\n❌ **Bad:** Inconsistent position sizing without clear risk management\n\n**Purpose:** Ensures traders develop proper risk management habits rather than gambling approaches."
        },
        {
          question: "What are the minimum trading requirements?",
          answer: "**Minimum Trading Days:**\n- Required before first 3 withdrawals: 3 trading days minimum\n- After 3rd withdrawal: No minimum trading days required\n\n**What constitutes a Trading Day:**\n- Place at least one trade\n- Hold the trade for minimum 2 minutes\n- Can be profitable or losing trades\n- Weekend trading not counted\n\n**Trade Duration Requirements:**\n- Minimum hold time: 2 minutes per trade\n- No maximum hold time\n- Positions can be held overnight\n- Positions can be held over weekends\n\n**Example:** If you trade Monday, Wednesday, and Friday (holding each trade for 2+ minutes), you meet the 3 trading days requirement."
        }
      ]
    },
    {
      category: "Prohibited Strategies & Violations",
      questions: [
        {
          question: "What trading strategies are prohibited?",
          answer: "**Strictly Prohibited Strategies:**\n\n1. **High-Frequency Trading (HFT) & Scalping**\n   - Trades held for less than 2 minutes\n   - Excessive trade frequency designed to exploit spreads\n\n2. **Hedging Strategies**\n   - Hedging between multiple accounts\n   - Correlated trades across different instruments\n   - Grid trading systems\n\n3. **Martingale Systems**\n   - Doubling position size after losses\n   - Exponential risk increase strategies\n\n4. **Copy Trading**\n   - Using signal services\n   - Copying other traders' positions\n   - Automated copying systems\n\n5. **News Trading**\n   - Trading 30 minutes before major economic releases\n   - Trading 30 minutes after major economic releases\n   - Exploiting news volatility spikes"
        },
        {
          question: "Why are certain strategies prohibited?",
          answer: "**Reasons for Strategy Restrictions:**\n\n**HFT/Scalping Restrictions:**\n- Can exploit broker spreads unfairly\n- Creates unsustainable profit models\n- Focuses on execution speed rather than skill\n\n**Hedging Restrictions:**\n- Reduces genuine risk exposure\n- Can manipulate drawdown calculations\n- Defeats the purpose of risk assessment\n\n**Martingale Restrictions:**\n- Extremely high risk of catastrophic losses\n- Not sustainable long-term strategy\n- Can quickly breach drawdown limits\n\n**Copy Trading Restrictions:**\n- Doesn't demonstrate personal trading skill\n- We fund individual traders, not systems\n- Creates dependency rather than development\n\n**News Trading Restrictions:**\n- High slippage and execution issues\n- Unpredictable market conditions\n- Can lead to unfair advantages based on connection speed"
        },
        {
          question: "What happens if I violate trading rules?",
          answer: "**Violation Consequences:**\n\n**Minor Violations:**\n- Warning notifications\n- Educational guidance provided\n- Opportunity to correct behavior\n- Account remains active\n\n**Major Violations:**\n- Immediate account review\n- Temporary account suspension\n- Potential account termination\n- Case-by-case evaluation\n\n**Automatic Termination Triggers:**\n- Exceeding daily drawdown limits\n- Exceeding maximum drawdown limits\n- Repeated prohibited strategy usage\n- Fraudulent activity\n\n**Review Process:**\n- All violations reviewed by our cosmic council\n- Detailed explanations provided\n- Appeal process available\n- Fair and transparent decisions\n\n**Second Chances:**\n- Minor violations may receive warnings\n- Educational support provided\n- Account reset options in some cases"
        }
      ]
    },
    {
      category: "Account Add-ons & Enhancements",
      questions: [
        {
          question: "What add-ons are available and how much do they cost?",
          answer: "**Available Add-ons for All Accounts:**\n\n1. **Increased Leverage (1:50)** - +20% fee\n   - Standard: 1:30 leverage\n   - Enhanced: 1:50 leverage\n   - Better position flexibility\n\n2. **Increased Drawdown (+2%)** - +20% fee\n   - Adds 2% to maximum drawdown limit\n   - More room for trade management\n   - Reduces breach risk\n\n3. **Remove Profit Targets** - +30% fee\n   - Removes profit targets from first 3 withdrawals\n   - Eliminates minimum trading days requirement\n   - Immediate withdrawal access\n\n4. **Enhanced Profit Split (80:20)** - +50% fee\n   - Increases to 80% trader, 20% firm\n   - Applies from first payout\n   - Significantly higher earnings\n\n**Combination Pricing:**\n- Add-ons can be combined\n- Each add-on percentage applies to base price\n- Maximum customization available"
        },
        {
          question: "How does the increased leverage add-on work?",
          answer: "**Leverage Enhancement Details:**\n\n**Standard Leverage: 1:30**\n- $10,000 account controls $300,000 in trades\n- Conservative risk management\n- Suitable for most trading styles\n\n**Enhanced Leverage: 1:50** (+20% fee)\n- $10,000 account controls $500,000 in trades\n- More position flexibility\n- Smaller position sizes for same dollar risk\n\n**Practical Benefits:**\n- Trade larger positions with same risk\n- Better position sizing granularity\n- More strategic flexibility\n- Suitable for experienced traders\n\n**Example:**\n- Standard: 0.1 lots = $1,000 position\n- Enhanced: 0.06 lots = $1,000 position\n- More precise risk management possible\n\n**Risk Consideration:**\n- Higher leverage requires more discipline\n- Same drawdown rules apply\n- Position sizing becomes more critical"
        },
        {
          question: "What does the Remove Profit Targets add-on do?",
          answer: "**Standard Requirements:**\n- First 3 withdrawals need profit targets\n- Minimum 3 trading days before withdrawal\n- Specific profit percentages required\n\n**With Remove Profit Targets Add-on (+30% fee):**\n- No profit targets for first 3 withdrawals\n- No minimum trading days requirement\n- Withdraw any amount anytime\n- Complete flexibility from day one\n\n**Benefits:**\n- Immediate access to profits\n- No waiting periods\n- Flexible withdrawal scheduling\n- Perfect for active traders\n- Reduced pressure to hit targets\n\n**Example Scenario:**\n- Standard: Make $500 profit, wait 3 trading days, then withdraw\n- With add-on: Make $100 profit, withdraw immediately\n\n**Who Should Consider:**\n- Traders who prefer frequent smaller withdrawals\n- Those who want immediate access to profits\n- Traders with irregular profit patterns"
        },
        {
          question: "How does the increased drawdown add-on help?",
          answer: "**Standard Drawdown Limits:**\n- Rhino Rush: 7% maximum drawdown\n- Phoenix Rise: 8% maximum drawdown\n\n**With Increased Drawdown Add-on (+20% fee):**\n- Adds 2% to your maximum drawdown limit\n- Rhino Rush: 7% → 9% maximum drawdown\n- Phoenix Rise: 8% → 10% maximum drawdown\n\n**Practical Impact on $10,000 Account:**\n- Standard 8%: $800 maximum loss allowed\n- Enhanced 10%: $1,000 maximum loss allowed\n- Extra $200 buffer for trade management\n\n**Benefits:**\n- More room for drawdown during volatile periods\n- Reduced risk of account termination\n- Better trade management flexibility\n- Suitable for swing traders\n- Handles market volatility better\n\n**Strategic Advantages:**\n- Hold losing positions longer for recovery\n- Weather temporary market storms\n- More aggressive position sizing possible\n- Greater confidence in trading decisions"
        }
      ]
    },
    {
      category: "Withdrawals & Profit Sharing",
      questions: [
        {
          question: "How fast are payouts processed at FundedGiants?",
          answer: "**Payout Processing Speed:**\n- **Maximum processing time:** 24 hours\n- **Typical processing time:** 12-18 hours\n- **Fastest in the industry guarantee**\n- **Business days:** Monday to Friday\n- **Weekend requests:** Processed Monday\n\n**Payment Methods:**\n- Bank wire transfers\n- Cryptocurrency (Bitcoin, Ethereum, USDT)\n- PayPal (for smaller amounts)\n- Skrill/Neteller\n- Local payment methods by region\n\n**Processing Steps:**\n1. Submit withdrawal request\n2. Automatic verification (2-4 hours)\n3. Manual review if needed (4-8 hours)\n4. Payment processing (2-12 hours)\n5. Funds delivered to your account\n\n**Status Updates:**\n- Real-time status tracking\n- Email notifications at each step\n- Customer support available 24/7"
        },
        {
          question: "What are the minimum payout amounts?",
          answer: "**Minimum Payout by Account Size:**\n\n- **$2,500 Account:** $125 minimum (5%)\n- **$5,000 Account:** $250 minimum (5%)\n- **$10,000 Account:** $500 minimum (5%)\n- **$25,000 Account:** $1,250 minimum (5%)\n- **$50,000 Account:** $2,500 minimum (5%)\n- **$100,000 Account:** $5,000 minimum (5%)\n\n**After Third Withdrawal:**\n- Minimum drops to 2% of account balance\n- On-demand payouts available\n- Multiple withdrawals per day allowed\n- No maximum withdrawal limits\n\n**Example for $10,000 Account:**\n- First 3 withdrawals: $500 minimum\n- Subsequent withdrawals: $200 minimum\n- Can withdraw $200, $300, $500+ anytime\n\n**Scaling Account Minimums:**\n- Minimums scale with account size\n- Percentage-based calculations\n- Consistent across all programs"
        },
        {
          question: "How do profit splits work in practice?",
          answer: "**Standard Profit Splits:**\n\n**Rhino Rush Program:**\n- 1st payout: 50% to trader, 50% to firm\n- 2nd payout: 60% to trader, 40% to firm\n- 3rd+ payouts: 70% to trader, 30% to firm\n\n**Phoenix Rise Program:**\n- All payouts: 70% to trader, 30% to firm\n- Consistent from first withdrawal\n\n**With 80:20 Add-on (+50% fee):**\n- All payouts: 80% to trader, 20% to firm\n- Applies from very first withdrawal\n- Significant earning enhancement\n\n**Practical Examples:**\n\n**$1,000 Profit on Phoenix Rise Program:**\n- Standard split: You receive $700, firm keeps $300\n- With 80:20 add-on: You receive $800, firm keeps $200\n\n**$5,000 Profit on Rhino Rush Program:**\n- 1st payout: You receive $2,500, firm keeps $2,500\n- 2nd payout: You receive $3,000, firm keeps $2,000\n- 3rd+ payout: You receive $3,500, firm keeps $1,500\n\n**Calculation Method:**\n- Based on net profits after covering losses\n- Applied to each individual withdrawal\n- Transparent calculation provided"
        },
        {
          question: "Are there any hidden fees or charges?",
          answer: "**No Hidden Fees Guarantee:**\n✅ No withdrawal fees\n✅ No monthly account fees\n✅ No inactivity fees\n✅ No spread markups\n✅ No commission charges\n✅ No surprise deductions\n\n**Only Transparent Costs:**\n1. **Initial Program Fee** (one-time)\n   - Clearly displayed before purchase\n   - No recurring charges\n\n2. **Optional Add-ons** (one-time)\n   - Chosen during account setup\n   - Percentage-based pricing\n   - Optional enhancements only\n\n3. **Profit Split** (from earnings)\n   - Clearly defined percentages\n   - Only applies to profits made\n   - No fees if no profits\n\n**Banking Fees:**\n- Any bank fees are covered by recipient\n- Standard international transfer fees\n- Cryptocurrency transactions: network fees apply\n- Local payment methods: no additional fees\n\n**Commitment:**\n- Complete transparency in all transactions\n- No surprise charges ever\n- What you see is what you pay"
        }
      ]
    },
    {
      category: "Account Management & Support",
      questions: [
        {
          question: "What happens during weekends and market closures?",
          answer: "**Weekend Trading Rules:**\n❌ **Prohibited Activities:**\n- Opening new positions when markets are closed\n- Trading during major holidays\n- Placing pending orders during closure\n\n✅ **Allowed Activities:**\n- Holding positions over weekends\n- Closing existing positions\n- Managing open trades\n- Monitoring account performance\n\n**Market Closure Schedule:**\n- **Forex:** Friday 5 PM EST to Sunday 5 PM EST\n- **Stock Indices:** Varies by market\n- **Commodities:** Varies by instrument\n- **Cryptocurrencies:** 24/7 availability\n\n**Holiday Closures:**\n- Christmas Day\n- New Year's Day\n- Major international holidays\n- Advance notice provided via email\n\n**Violation Prevention:**\n- Trading platform restrictions during closures\n- Automatic monitoring systems\n- Clear notification of trading hours\n\n**Support Availability:**\n- Customer support: 24/5 during market hours\n- Emergency support: Available weekends\n- Technical support: Always available"
        },
        {
          question: "How do I reset my account if I breach rules?",
          answer: "**Account Reset Options:**\n\n**Automatic Reset Scenarios:**\n- Not available for rule breaches\n- Breaches result in account termination\n- Must purchase new challenge to restart\n\n**Reset Request Process:**\n1. Contact customer support immediately\n2. Explain circumstances of breach\n3. Request evaluation review\n4. Await cosmic council decision\n5. Receive decision within 48 hours\n\n**Possible Outcomes:**\n- **Educational Reset:** For minor violations\n- **Partial Reset:** Account restored with conditions\n- **Full Reset:** Purchase new challenge required\n- **Appeal Process:** For disputed breaches\n\n**Reset Eligibility:**\n- First-time minor violations\n- Technical issues causing breach\n- Extenuating circumstances\n- Good trading history\n\n**Prevention Better Than Reset:**\n- Monitor drawdown levels daily\n- Use risk management tools\n- Set account alerts\n- Follow rules strictly\n- Contact support for clarification\n\n**Alternative Options:**\n- Purchase new challenge account\n- Start with smaller account size\n- Consider add-ons for more flexibility"
        },
        {
          question: "What kind of support do you provide?",
          answer: "**Comprehensive Support Services:**\n\n**Customer Support:**\n- **Live Chat:** 24/5 during market hours\n- **Email Support:** support@fundedgiants.com\n- **Response Time:** Under 2 hours average\n- **Languages:** English, Spanish, French, German\n\n**Technical Support:**\n- Platform setup assistance\n- MT4/MT5 configuration help\n- Connection troubleshooting\n- EA installation guidance\n- Mobile app support\n\n**Educational Resources:**\n- Trading rule explanations\n- Risk management guidance\n- Platform tutorials\n- Webinar series\n- Trading psychology support\n\n**Account Management:**\n- Balance and performance tracking\n- Withdrawal assistance\n- Rule clarification\n- Violation prevention guidance\n- Scaling process support\n\n**Cosmic Council Reviews:**\n- Fair evaluation of all issues\n- Transparent decision-making\n- Appeal process available\n- Personalized attention\n- Divine wisdom applied\n\n**Community Support:**\n- Discord community\n- Telegram groups\n- Trading forums\n- Peer-to-peer learning\n- Success story sharing"
        },
        {
          question: "How do I track my account performance?",
          answer: "**Performance Tracking Tools:**\n\n**Real-Time Dashboard:**\n- Live account balance\n- Current drawdown levels\n- Daily/weekly/monthly profits\n- Trade history and analytics\n- Withdrawal status tracking\n\n**Mobile App Features:**\n- Push notifications for important events\n- Quick balance checks\n- Drawdown alerts\n- Withdrawal requests\n- Performance summaries\n\n**Automated Alerts:**\n- Drawdown warnings at 75% of limit\n- Daily profit/loss summaries\n- Withdrawal confirmations\n- Rule violation warnings\n- Scaling milestone notifications\n\n**Detailed Reports:**\n- Weekly performance summaries\n- Monthly profit/loss statements\n- Trade analysis reports\n- Risk management metrics\n- Comparative performance data\n\n**Risk Management Tools:**\n- Drawdown calculators\n- Position size calculators\n- Risk per trade analysis\n- Consistency tracking\n- Performance benchmarking\n\n**Access Methods:**\n- Web-based dashboard\n- Mobile applications\n- Email reports\n- MT4/MT5 plugins\n- API access for advanced users"
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background bg-stars">
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      
      {/* Hero Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ❓ Divine FAQ Realm ❓
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Comprehensive guide to trading with up to $200K funding, scaling to $1M, rules, programs, and divine wisdom for funded traders.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
                <HelpCircle className="h-8 w-8" />
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const itemIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openItem === itemIndex;
                  
                  return (
                    <Card key={faqIndex} className="bg-card/20 backdrop-blur-sm border-primary/30 shadow-xl overflow-hidden">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleItem(itemIndex)}
                          className="w-full text-left p-6 flex items-center justify-between hover:bg-primary/10 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-foreground pr-4">
                            {faq.question}
                          </h3>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border-primary/30 shadow-2xl max-w-3xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-primary mb-6">Still Need Divine Guidance?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Can't find the answer you're looking for? Our cosmic council is here to help you navigate any question about trading with up to $200K funding, scaling to $1M, rules, programs, or account management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-semibold">
                  📧 Contact Support
                </button>
                <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-md font-semibold">
                  💬 Live Chat
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
