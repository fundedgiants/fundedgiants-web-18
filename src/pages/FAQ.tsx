
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
          answer: "All programs offer up to 70% profit split to the trader, with the remaining 30% going to FundedGiants. This can be enhanced with add-ons."
        }
      ]
    },
    {
      category: "Trading Rules",
      questions: [
        {
          question: "What are the daily drawdown limits?",
          answer: "Daily drawdown is limited to 4% of the account balance across all programs to ensure responsible risk management."
        },
        {
          question: "What is the maximum drawdown?",
          answer: "Maximum drawdown varies by program but ranges from 7-8% depending on the account size and program type."
        },
        {
          question: "Are there any prohibited trading strategies?",
          answer: "We prohibit news trading, hedging between accounts, and high-frequency scalping. All other legitimate trading strategies are welcome in our divine realm."
        }
      ]
    },
    {
      category: "Payouts",
      questions: [
        {
          question: "How fast are payouts processed?",
          answer: "All withdrawal requests are approved and paid within 24 hours maximum from the time of request - the fastest in the divine trading realm."
        },
        {
          question: "What is the minimum payout amount?",
          answer: "The minimum payout varies by account size but starts at $125 for smaller accounts and $5,000 for larger funded accounts."
        },
        {
          question: "Are there any payout fees?",
          answer: "No hidden fees! We believe in transparent divine transactions with no surprise charges on your cosmic profits."
        }
      ]
    },
    {
      category: "Account Management",
      questions: [
        {
          question: "Can I trade multiple accounts?",
          answer: "Yes, divine traders can manage multiple funded accounts simultaneously, multiplying their cosmic earning potential."
        },
        {
          question: "What happens if I violate a rule?",
          answer: "Rule violations may result in account suspension or termination depending on severity. However, our divine council reviews each case fairly."
        },
        {
          question: "Can I reset my account?",
          answer: "Account resets may be available depending on your program and circumstances. Contact our cosmic support for specific cases."
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
            Seek wisdom from our cosmic knowledge base. Find answers to all your divine trading questions.
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
                            <p className="text-muted-foreground leading-relaxed">
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
                Can't find the answer you're looking for? Our cosmic council is here to help you navigate any question.
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
