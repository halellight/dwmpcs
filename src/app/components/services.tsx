import { Briefcase, Home, GraduationCap, Heart, Car, Smartphone, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Services() {
  const services = [
    {
      icon: Briefcase,
      title: 'Business Loans',
      description: 'Expand your business with our flexible business loans designed for entrepreneurs and SMEs.',
    },
    {
      icon: Home,
      title: 'Personal Loans',
      description: 'Quick access to funds for your personal needs with competitive rates and flexible terms.',
    },
    {
      icon: GraduationCap,
      title: 'Education Loans',
      description: 'Invest in your future or your children\'s education with our special education financing.',
    },
    {
      icon: Heart,
      title: 'Medical Loans',
      description: 'Emergency medical financing to ensure you and your family get the care you need.',
    },
    {
      icon: Car,
      title: 'Asset Financing',
      description: 'Purchase vehicles or other assets with our convenient asset financing options.',
    },
    {
      icon: Smartphone,
      title: 'Emergency Loans',
      description: 'Fast approval for urgent financial needs with minimal documentation required.',
    },
  ];

  return (
    <section id="services" className="py-24 sm:py-32 bg-muted relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-primary font-bold text-sm tracking-wide uppercase mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Our Services
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-secondary mb-6 tracking-tight"
          >
            Comprehensive Loan Solutions <br /> for Every Need
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg sm:text-xl font-medium"
          >
            We offer personalized loan options designed to meet the diverse needs of our members, 
            with fast approval and competitive rates.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 group hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <service.icon className="text-primary group-hover:text-white transition-colors" size={32} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">{service.title}</h3>
              <p className="text-muted-foreground font-medium leading-relaxed mb-8">{service.description}</p>
              
              <button className="flex items-center gap-2 text-primary font-bold group/btn">
                Learn more 
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
