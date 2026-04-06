import { FileText, CheckCircle, CreditCard, Banknote } from 'lucide-react';
import { motion } from 'motion/react';

export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: 'Submit Application',
      description: 'Fill out our simple online application form with your basic information and loan requirements.',
      step: '01',
    },
    {
      icon: CheckCircle,
      title: 'Quick Verification',
      description: 'Our team reviews your application and verifies your information within 24 hours.',
      step: '02',
    },
    {
      icon: CreditCard,
      title: 'Get Approved',
      description: 'Receive approval notification and review your personalized loan terms and conditions.',
      step: '03',
    },
    {
      icon: Banknote,
      title: 'Receive Funds',
      description: 'Once accepted, funds are disbursed directly to your account within 24-48 hours.',
      step: '04',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground font-bold text-sm tracking-wide uppercase mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            How It Works
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-secondary mb-6 tracking-tight"
          >
            Get Your Loan in <span className="text-primary">4 Simple Steps</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg sm:text-xl font-medium"
          >
            Our streamlined process ensures you get the funding you need quickly and efficiently, 
            with minimal hassle.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          {/* Connector line (hidden on mobile, shown on desktop for all but last item) */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-border/60 z-0"></div>

          {steps.map((step, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              key={index} 
              className="relative z-10 text-center group"
            >
              <div className="relative inline-flex items-center justify-center w-28 h-28 bg-white border border-border shadow-xl shadow-primary/5 rounded-full mb-8 mx-auto group-hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-white group-hover:bg-primary transition-colors duration-300">
                  <step.icon size={32} />
                </div>
                <span className="absolute -top-1 -right-1 w-10 h-10 bg-accent text-secondary font-bold rounded-full flex items-center justify-center text-sm shadow-md border-2 border-white">
                  {step.step}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-3">{step.title}</h3>
              <p className="text-muted-foreground font-medium px-4">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
