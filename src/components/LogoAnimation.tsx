import zedHero from "@/assets/zed-hero-banner.png";

export function LogoAnimation() {
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ZED in Action
          </h2>
          <p className="text-muted-foreground">
            Your AI-powered brand ambassador doing what he does best!
          </p>
        </div>

        {/* ZED Image */}
        <div className="relative inline-block">
          <img 
            src={zedHero} 
            alt="ZED" 
            className="w-64 h-64 object-contain mx-auto"
            style={{
              filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.5))'
            }}
          />
        </div>

        {/* Tagline */}
        <div className="mt-16 space-y-4">
          <h3 className="text-4xl sm:text-5xl font-bold glow-text text-primary">
            AIZboostr
          </h3>
          <p className="text-xl text-muted-foreground">
            AI Powered Brand Building
          </p>
        </div>
      </div>
    </section>
  );
}
