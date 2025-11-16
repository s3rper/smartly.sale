import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this to your newsletter service
    console.log('Newsletter signup:', email);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#FF6600] to-orange-600 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Never Miss a Viral Deal!
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Get the hottest Shopee finds and exclusive deals delivered straight to your inbox. 
            Join 10,000+ smart shoppers today!
          </p>
        </div>

        {/* Newsletter Form with margin-bottom */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-4 rounded-full bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group mb-4"
              >
                Subscribe
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-white/70 text-sm mt-4 text-center">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        ) : (
          <div className="max-w-2xl mx-auto mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                <Check className="w-8 h-8 text-[#FF6600]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                You're All Set! 🎉
              </h3>
              <p className="text-white/90">
                Check your email to confirm your subscription and start receiving exclusive deals.
              </p>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { emoji: "⚡", text: "Flash Deals First" },
            { emoji: "🎁", text: "Exclusive Discounts" },
            { emoji: "📱", text: "Weekly Roundups" }
          ].map((benefit, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
            >
              <div className="text-3xl mb-2">{benefit.emoji}</div>
              <div className="text-white font-semibold">{benefit.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
