import { ImageWithFallback } from './figma/ImageWithFallback';
import { CheckCircle2, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export function About() {
  const features = [
    'Registered & regulated association',
    'Dedicated to Nigerian workers',
    'Transparent & fair lending',
    'Competitive interest rates',
    'Member-focused approach',
    'Flexible repayment terms',
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl z-10">
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 rounded-3xl"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzczODg5MTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern office workspace"
                className="w-full h-[500px] lg:h-[650px] object-cover"
              />
            </div>
            
            {/* Overlay Card */}
            <div className="absolute -bottom-8 -right-8 bg-secondary text-white p-8 rounded-2xl shadow-2xl max-w-xs z-20 border border-white/10">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} className="text-white" />
              </div>
              <p className="font-medium text-lg leading-relaxed">
                "Empowering Nigerian workers with accessible financial solutions since <span className="text-accent font-bold">2009</span>"
              </p>
            </div>
            
            {/* Decorative bg block */}
            <div className="absolute top-8 -left-8 w-full h-full bg-accent/10 rounded-3xl -z-10"></div>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8 lg:pl-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              About Us
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary leading-tight tracking-tight">
              Built on Trust, <br />
              <span className="text-primary relative inline-block">
                Driven by Excellence
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed font-medium">
              <p>
                DWMPCS is more than just a loan provider. We are a registered association 
                dedicated to empowering Nigerian workers and professionals with accessible, 
                transparent, and reliable financial solutions.
              </p>
              <p>
                Our mission is to help our members achieve their financial aspirations through 
                personalized loan options, straightforward processes, and fast approval times. 
                We understand the unique needs of Nigerian workers and have tailored our services 
                to provide maximum benefit and convenience.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 pt-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-primary" size={16} strokeWidth={3} />
                  </div>
                  <span className="text-secondary font-bold text-[15px]">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
