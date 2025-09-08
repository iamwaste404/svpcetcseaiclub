import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Trophy } from "lucide-react";
import heroBackground from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-poppins text-primary-foreground animate-fade-in">
            Welcome to{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Coding Club
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90 font-medium animate-fade-in">
            One Platform. Many Clubs. Endless Opportunities.
          </p>
          
          <p className="text-lg md:text-xl mb-12 text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            From technology and coding to arts, sports, business, and culture – discover your club, join events, and grow together with fellow students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in">
            <Button asChild variant="hero" size="lg" className="text-lg px-8 py-4">
              <Link to="/auth" className="flex items-center gap-2">
                Join Now <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button asChild variant="default" size="lg" className="text-lg px-8 py-4">
              <Link to="/clubs">Explore Clubs</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-in">
            <div className="text-center p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl border border-primary-foreground/20">
              <Users className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary-foreground mb-1">8+</div>
              <div className="text-primary-foreground/80">Active Clubs</div>
            </div>
            
            <div className="text-center p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl border border-primary-foreground/20">
              <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary-foreground mb-1">50+</div>
              <div className="text-primary-foreground/80">Events Yearly</div>
            </div>
            
            <div className="text-center p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl border border-primary-foreground/20">
              <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary-foreground mb-1">500+</div>
              <div className="text-primary-foreground/80">Active Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-10 w-6 h-6 bg-accent/30 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-8 h-8 bg-secondary/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-20 w-4 h-4 bg-accent/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default HeroSection;