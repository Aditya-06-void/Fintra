import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-trading.jpg";

const Hero = () => {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                Professional Trading Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Trade Smarter with
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> AI-Powered</span> Insights
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Make informed investment decisions with real-time market data, AI analysis, and comprehensive stock insights. 
                Join thousands of traders who trust Fintra for their financial success.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8">
                Start Trading
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">100K+</div>
                <div className="text-sm text-muted-foreground">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">$2.5B+</div>
                <div className="text-sm text-muted-foreground">Volume Traded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur-2xl" />
            <img 
              src={heroImage} 
              alt="Professional trading platform interface"
              className="relative rounded-2xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;