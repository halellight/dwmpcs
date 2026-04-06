import { TrendingUp, Users, Award, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function Stats() {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Members',
    },
    {
      icon: TrendingUp,
      value: '₦5B+',
      label: 'Loans Disbursed',
    },
    {
      icon: Award,
      value: '15+',
      label: 'Years of Trust',
    },
    {
      icon: Clock,
      value: '24-48hrs',
      label: 'Fast Approval',
    },
  ];

  return (
    <section className="bg-white py-20 relative z-20 -mt-10 lg:-mt-16 mx-4 sm:mx-6 lg:mx-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 max-w-7xl xl:mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 px-6 sm:px-12 py-8">
        {stats.map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index} 
            className="text-center group"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 text-accent rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 shadow-sm">
              <stat.icon size={32} strokeWidth={2.5} />
            </div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary mb-2 tracking-tight">{stat.value}</div>
            <div className="text-muted-foreground font-medium text-sm sm:text-base">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
