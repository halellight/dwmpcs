import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function Hero() {
  return (
    <section id="home" className="relative bg-secondary text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Zap size={16} className="text-accent" />
              <span>Welcome to DWMPCS</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] font-bold tracking-tight"
            >
              Your Trusted Partner in <span className="text-primary">Financial Solutions</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-300 max-w-2xl font-medium leading-relaxed"
            >
              DWMPCS is a duly registered Association providing tailored financial benefits and reliable loans to members and interested Nigerian workers.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1">
                Get Started Today
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <ShieldCheck size={20} className="text-accent" />
                Learn More
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="pt-8 flex items-center gap-6 text-sm text-gray-400 font-medium"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden bg-gray-800">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Member" className="w-full h-full object-cover opacity-80" />
                  </div>
                ))}
              </div>
              <p>Trusted by <span className="text-white font-bold">10,000+</span> active members</p>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:ml-10"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent z-10"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758518730384-be3d205838e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1lZXRpbmclMjBoYW5kc2hha2V8ZW58MXx8fHwxNzczODgzMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Business professionals shaking hands"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              
              {/* Floating Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl z-20 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-secondary">
                    <Zap size={24} className="fill-current" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Fast Approvals</h3>
                    <p className="text-gray-300 text-sm font-medium">Get funded within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative pattern */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
