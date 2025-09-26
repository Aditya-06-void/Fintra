import Navbar from "./Navbar";
import Hero from "./Hero";
import CompanyMarquee from "./CompanyMarquee";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <CompanyMarquee />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
};

export default LandingPage;