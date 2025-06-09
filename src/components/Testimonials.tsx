
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([
    {
      name: "Marcus Johnson",
      role: "Professional Trader",
      content: "FundedGiants transformed my trading career. The instant funding program allowed me to scale quickly without the stress of lengthy evaluations.",
      rating: 5,
      avatar: "MJ"
    },
    {
      name: "Sarah Chen",
      role: "Forex Specialist",
      content: "The transparency and fast payouts are unmatched. I've been with them for 8 months and received every payout within 24 hours.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "David Rodriguez",
      role: "Swing Trader",
      content: "Best prop firm I've worked with. The community support and clear rules make trading stress-free. Already scaled to $100K account.",
      rating: 5,
      avatar: "DR"
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            What Our Traders Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real feedback from real funded traders in our community
          </p>
          
          <Button 
            onClick={() => setIsEditing(!isEditing)} 
            variant="ghost" 
            size="sm"
            className="absolute top-0 right-0 opacity-50 hover:opacity-100"
          >
            {isEditing ? 'Save Testimonials' : 'Edit Testimonials'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={testimonial.content}
                      onChange={(e) => {
                        const newTestimonials = [...testimonials];
                        newTestimonials[index].content = e.target.value;
                        setTestimonials(newTestimonials);
                      }}
                      className="w-full bg-transparent border border-muted rounded p-2 resize-none focus:outline-none"
                      rows={4}
                    />
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => {
                        const newTestimonials = [...testimonials];
                        newTestimonials[index].name = e.target.value;
                        setTestimonials(newTestimonials);
                      }}
                      className="w-full bg-transparent border-b border-primary/50 focus:outline-none font-semibold"
                    />
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => {
                        const newTestimonials = [...testimonials];
                        newTestimonials[index].role = e.target.value;
                        setTestimonials(newTestimonials);
                      }}
                      className="w-full bg-transparent border-b border-muted focus:outline-none text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        <div className="flex gap-1 mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
