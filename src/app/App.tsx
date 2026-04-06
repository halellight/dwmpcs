import { Header } from './components/header';
import { Hero } from './components/hero';
import { Stats } from './components/stats';
import { About } from './components/about';
import { Services } from './components/services';
import { HowItWorks } from './components/how-it-works';
import { CTA } from './components/cta';
import { Footer } from './components/footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Services />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
