import { BarChart3, Brain, Shield, Zap, Globe, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Access live market data, advanced charts, and comprehensive financial metrics for informed trading decisions."
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Our AI agent Zeal provides intelligent stock predictions and market analysis to maximize your returns."
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your investments are protected with enterprise-grade security and encrypted data transmission."
    },
    {
      icon: Zap,
      title: "Lightning Fast Execution",
      description: "Execute trades in milliseconds with our high-performance trading infrastructure and low latency."
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Trade across multiple international markets with comprehensive coverage and competitive rates."
    },
    {
      icon: Users,
      title: "Expert Community",
      description: "Connect with professional traders and access exclusive market insights from industry experts."
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Powerful Features for 
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Professional Trading</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make informed investment decisions and execute successful trades.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 hover:border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;