import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export function CTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1632647895256-3f75c1865a0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzbWlsaW5nJTIwdXNpbmclMjBsYXB0b3AlMjBmaW5hbmNlfGVufDF8fHx8MTc3Mzk1Mjk2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Person smiling using laptop finance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/95 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-white space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-accent font-bold text-sm tracking-wide uppercase">
              Get Started Today
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Ready to Achieve Your <span className="text-primary relative inline-block">
                Financial Goals?
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 font-medium max-w-lg leading-relaxed">
              Join thousands of satisfied members who have transformed their lives with DWMPCS. 
              Apply now and get approved within 24-48 hours.
            </p>
            
            <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all inline-flex items-center gap-2 group shadow-xl shadow-primary/20 hover:-translate-y-1">
              Apply for a Loan Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </motion.div>

          {/* Right Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
            
            <h3 className="text-3xl font-bold text-secondary mb-4">Get in Touch</h3>
            <p className="text-muted-foreground font-medium mb-10 text-lg">
              Have questions? Our friendly team is here to help you make the right financial decision.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                  <Phone className="text-accent group-hover:text-white transition-colors" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-secondary mb-1 text-lg">Phone Support</h4>
                  <p className="text-muted-foreground font-medium">+234 800 000 0000</p>
                  <p className="text-sm text-gray-400 mt-1">Mon-Fri: 8am - 5pm</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                  <Mail className="text-accent group-hover:text-white transition-colors" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-secondary mb-1 text-lg">Email Us</h4>
                  <p className="text-muted-foreground font-medium">info@dwmpcs.com</p>
                  <p className="text-muted-foreground font-medium">support@dwmpcs.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                  <MapPin className="text-accent group-hover:text-white transition-colors" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-secondary mb-1 text-lg">Office Address</h4>
                  <p className="text-muted-foreground font-medium">Lagos, Nigeria</p>
                  <p className="text-sm text-gray-400 mt-1">Main Headquarters</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border/50">
              <p className="text-sm font-medium text-muted-foreground">
                For more information, visit our main website at{' '}
                <a href="https://www.de-wisdommpcs.com/" className="text-primary hover:underline font-bold" target="_blank" rel="noopener noreferrer">
                  www.de-wisdommpcs.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
