
import HeroSection from "../components/HeroSection";
import FeaturedPlots from "../components/FeaturedProperties";
import Footer from "../components/Footer";

const Home = (plot) => {
  return (
  
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
    
      {/* Adding pt-20 creates a clear gap so the hero section doesn't slide under the navbar */}
      <main className="pt-5"> 
        <HeroSection />
        <FeaturedPlots /> 
      </main>
      <Footer />
    </div>
     
  );
};

export default Home;