
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Scroll, Crown, Shield } from 'lucide-react';

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is FundedGiants?",
          answer: "FundedGiants is a divine proprietary trading firm that provides funding up to $200,000 to skilled traders. We offer three celestial programs: Heracles (instant funding), Orion (one-step evaluation), and Zeus (two-step evaluation)."
        },
        {
          question: "How do I get started?",
          answer: "Choose your divine path from our three programs, complete the registration, and begin your evaluation or receive instant funding depending on your chosen program. Our cosmic council will guide you through each step."
        },
        {
          question: "What trading platforms do you support?",
          answer: "We support MetaTrader 4 (MT4) and MetaTrader 5 (MT5) platforms, providing you with professional trading tools worthy of the gods."
        }
      ]
    },
    {
      category: "Trading Programs",
      questions: [
        {
          question: "What's the difference between Heracles, Orion, and Zeus programs?",
          answer: "Heracles offers instant funding with no evaluation, Orion requires one evaluation phase, and Zeus requires two evaluation phases. Each has different fee structures and profit splits."
        },
        {
          question: "What is the maximum funding available?",
          answer: "The maximum divine funding available is $200,000 across all our programs, allowing you to trade with the power of the cosmic giants."
        },
        {
          question: "What are the profit splits?",
          answer: "All programs offer up to 70% profit split to the trader, with the remaining 30% going to FundedGiants. This can be enhanced with add-ons to achieve 80:20 split from onset."
        }
      ]
    },
    {
      category: "Trading Rules & Risk Management",
      questions: [
        {
          question: "What are the daily drawdown limits and how do they work?",
          answer: "Daily drawdown is limited to 4% of your account balance. This is a balance-based drawdown, meaning it's calculated from your current account balance, not the starting balance. For example, if you have a $10,000 account and your balance grows to $11,000, your daily drawdown limit becomes $440 (4% of $11,000). If your equity drops below $10,560 on any given day, you would breach the daily drawdown rule."
        },
        {
          question: "How does the maximum drawdown work?",
          answer: "Maximum drawdown varies by program (7-8% depending on account size). This is calculated from your highest balance achieved. For example, with a $10,000 account at 8% max drawdown: if your account grows to $12,000, your maximum drawdown line becomes $11,040 (8% below $12,000). Your equity must never fall below this level."
        },
        {
          question: "What is the Consistency Rule and how is it calculated?",
          answer: "The Consistency Rule requires traders to maintain fixed risk exposure consistently - your lot size vs percent risk per trade must be consistent at least 70% of the time. For example, if you typically risk 1% per trade with 0.1 lots, you cannot suddenly risk 5% with 0.5 lots. This prevents lottery-style trading and ensures sustainable risk management practices."
        },
        {
          question: "What are the withdrawal requirements?",
          answer: "First, Second, and Third Withdrawals require a minimum of 3 trading days before you can request payout. After the third withdrawal, subsequent withdrawals are available on-demand (multiple times daily). Trading days are defined as days where you place at least one trade and hold it for a minimum duration."
        }
      ]
    },
    {
      category: "Prohibited Trading Strategies",
      questions: [
        {
          question: "What trading strategies are prohibited?",
          answer: "We prohibit: 1) High-Frequency Trading (HFT) and scalping strategies that hold positions for less than 2 minutes, 2) Hedging between accounts or instruments, 3) Martingale strategies (doubling position size after losses), 4) Grid trading (placing multiple pending orders in both directions), 5) Copy trading or using signal services, 6) News trading during high-impact events (30 minutes before and after major economic releases)."
        },
        {
          question: "Can you explain why certain strategies are prohibited?",
          answer: "These restrictions ensure fair trading and sustainable profits: HFT/scalping can exploit broker spreads unfairly; hedging reduces genuine risk exposure; martingale strategies can lead to catastrophic losses; grid trading often results in multiple small losses and rare large wins; copy trading doesn't demonstrate personal skill; news trading during volatile events can lead to unpredictable slippage and execution issues."
        },
        {
          question: "What happens if I violate trading rules?",
          answer: "Rule violations may result in account suspension or termination depending on severity. Minor violations might receive warnings, while major violations (like exceeding drawdown limits) result in immediate account termination. Our divine council reviews each case fairly and provides detailed explanations for any decisions."
        }
      ]
    },
    {
      category: "Account Add-ons & Enhancements",
      questions: [
        {
          question: "What add-ons are available and how much do they cost?",
          answer: "Available add-ons for all accounts: 1) Increase Leverage to 1:50 (+20% fee), 2) Increase DrawDown by 2% (+20% fee), 3) Remove Profit Target from 1st, 2nd, and 3rd Withdrawals (+30% fee - also removes minimum trading days), 4) Increase Profit Split to 80:20 from onset (+50% fee). These can be combined for maximum flexibility."
        },
        {
          question: "How does the increased leverage add-on work?",
          answer: "The standard leverage is 1:30, but with the +20% add-on, you can increase it to 1:50. For example, with a $10,000 account at 1:50 leverage, you can control up to $500,000 in trading volume. This allows for smaller position sizes while maintaining the same dollar risk, providing more flexibility in trade management."
        },
        {
          question: "What does removing profit targets mean?",
          answer: "By default, you need to achieve specific profit targets (5-10% depending on phase) before withdrawals. The +30% add-on removes these requirements for your first three withdrawals AND eliminates the minimum 3 trading days requirement. This means you can withdraw profits immediately after earning them, providing maximum flexibility for your trading strategy."
        },
        {
          question: "How does the increased drawdown add-on help?",
          answer: "The +20% add-on increases your maximum drawdown by 2%. For example, if your account normally has 8% max drawdown, it becomes 10%. On a $10,000 account, this means your maximum loss limit increases from $800 to $1,000, giving you more room for trade management and reducing the risk of hitting drawdown limits during volatile market conditions."
        }
      ]
    },
    {
      category: "Payouts & Profit Sharing",
      questions: [
        {
          question: "How fast are payouts processed?",
          answer: "All withdrawal requests are approved and paid within 24 hours maximum from the time of request - the fastest in the divine trading realm. We process payouts via bank transfer, cryptocurrency, or other preferred methods."
        },
        {
          question: "What are the minimum payout amounts for each account size?",
          answer: "Minimum payout varies by account size: $2,500 accounts: $125 minimum, $5,000 accounts: $250 minimum, $10,000 accounts: $500 minimum, $25,000 accounts: $1,250 minimum, $50,000 accounts: $2,500 minimum, $100,000+ accounts: $5,000 minimum. After your third withdrawal, you can request on-demand payouts multiple times daily."
        },
        {
          question: "Are there any payout fees?",
          answer: "No hidden fees! We believe in transparent divine transactions with no surprise charges on your cosmic profits. The only costs are the initial program fees and any optional add-ons you choose."
        },
        {
          question: "How do profit splits work in practice?",
          answer: "Standard profit splits are 70:30 (trader:firm). For example, if you make $1,000 profit, you receive $700 and we keep $300. With the 80:20 add-on, you would receive $800 from the same $1,000 profit. Profit splits apply to all withdrawals and are calculated on net profits after covering any losses."
        }
      ]
    },
    {
      category: "Account Management & Scaling",
      questions: [
        {
          question: "Can I trade multiple accounts simultaneously?",
          answer: "Yes, divine traders can manage multiple funded accounts simultaneously, multiplying their cosmic earning potential. Each account must be traded independently with no hedging between accounts. This allows skilled traders to scale their operations significantly."
        },
        {
          question: "How does account scaling work?",
          answer: "Account scaling varies by program: Most accounts can scale 2x after 10 successful payouts, with some accounts (like $5,000) scaling 2.5x. Maximum scaling limits range from $50,000 to $1,000,000 depending on your starting account size. Scaling is automatic once you meet the payout requirements."
        },
        {
          question: "Can I reset my account if I breach rules?",
          answer: "Account resets may be available depending on your program and circumstances. Typically, you would need to purchase a new challenge to restart. However, our cosmic support team reviews each case individually and may offer reset options in certain situations."
        },
        {
          question: "What happens during weekends and market closures?",
          answer: "Trading is prohibited when markets are closed (weekends and major holidays). Any trades held over weekends are acceptable, but opening new positions during market closure will result in rule violations. Our systems monitor trading activity 24/7 to ensure compliance."
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background bg-cosmic-stars">
      <div className="absolute inset-0 bg-divine-gradient"></div>
      
      {/* Divine Hero Section */}
      <section className="relative py-40 px-4">
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="flex items-center justify-center gap-6 mb-8">
            <Crown className="h-16 w-16 text-primary animate-lightning-pulse" />
            <Scroll className="h-20 w-20 text-accent animate-lightning-pulse" style={{animationDelay: '0.5s'}} />
            <Crown className="h-16 w-16 text-primary animate-lightning-pulse" style={{animationDelay: '1s'}} />
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-10 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent cinzel-font text-divine-glow">
            📜 DIVINE CODEX 📜
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed font-medium">
            Sacred knowledge and divine laws for warriors of the trading realm.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <div className="flex items-center gap-4 mb-10">
                <Shield className="h-10 w-10 text-primary animate-lightning-pulse" />
                <h2 className="text-4xl font-black text-primary cinzel-font text-divine-glow">
                  {category.category}
                </h2>
              </div>
              <div className="space-y-6">
                {category.questions.map((faq, faqIndex) => {
                  const itemIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openItem === itemIndex;
                  
                  return (
                    <Card key={faqIndex} className="card-divine shadow-2xl overflow-hidden group hover:border-primary/60 transition-all duration-300">
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleItem(itemIndex)}
                          className="w-full text-left p-8 flex items-center justify-between hover:bg-primary/5 transition-colors group"
                        >
                          <h3 className="text-xl font-bold text-foreground pr-6 cinzel-font group-hover:text-primary transition-colors">
                            {faq.question}
                          </h3>
                          <div className="bg-primary/20 p-2 rounded-full group-hover:bg-primary/30 transition-colors">
                            {isOpen ? (
                              <ChevronUp className="h-6 w-6 text-primary flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-6 w-6 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-8 pb-8">
                            <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg border-l-4 border-primary">
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                                {faq.answer}
                              </p>
                            </div>
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

      {/* Divine Contact CTA */}
      <section className="py-24 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <Card className="card-divine shadow-2xl max-w-4xl mx-auto border-divine-glow">
            <CardContent className="p-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <Crown className="h-12 w-12 text-primary animate-lightning-pulse" />
                <Scroll className="h-16 w-16 text-accent animate-lightning-pulse" style={{animationDelay: '0.5s'}} />
                <Crown className="h-12 w-12 text-primary animate-lightning-pulse" style={{animationDelay: '1s'}} />
              </div>
              <h2 className="text-4xl font-black text-primary mb-8 cinzel-font text-divine-glow">
                SEEK DIVINE GUIDANCE?
              </h2>
              <p className="text-muted-foreground mb-12 text-xl leading-relaxed">
                Cannot find the sacred knowledge you seek? Our divine council of trading gods awaits to guide you through any mysteries of rules, programs, or account management.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="btn-divine px-12 py-4 text-xl font-bold cinzel-font shadow-xl">
                  📧 SUMMON DIVINE COUNCIL
                </button>
                <button className="btn-war px-12 py-4 text-xl font-bold cinzel-font shadow-xl">
                  💬 ENTER SACRED CHAMBER
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
