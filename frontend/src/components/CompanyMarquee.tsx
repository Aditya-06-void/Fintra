const CompanyMarquee = () => {
  const companies = [
    "Bloomberg", "Reuters", "Goldman Sachs", "JP Morgan", "Morgan Stanley", 
    "BlackRock", "Vanguard", "Fidelity", "Charles Schwab", "E*TRADE"
  ];

  return (
    <section className="py-12 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-muted-foreground font-medium">Trusted by leading financial institutions</p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...companies, ...companies].map((company, index) => (
              <div key={index} className="mx-8 text-2xl font-bold text-muted-foreground/60 hover:text-primary transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyMarquee;