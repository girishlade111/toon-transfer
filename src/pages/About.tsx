import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-sm hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="space-y-12 animate-slide-up">
          {/* Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-glow">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              About GB Transfer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fast, smooth, and secure file sharing with a delightful toon-vibed experience
            </p>
          </div>

          {/* Mission */}
          <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-toon">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-secondary" />
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              GB Transfer is created to make file sharing simple, secure, and fun. 
              We believe that transferring files shouldn't be complicated or boring. 
              That's why we've built a platform that combines powerful features with 
              a playful, modern design that makes every interaction delightful.
            </p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">What Makes Us Special</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-toon bounce-hover">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Upload and share files in seconds with our optimized infrastructure
                </p>
              </div>
              
              <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-toon bounce-hover">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure by Default</h3>
                <p className="text-muted-foreground">
                  Optional password protection and automatic expiry keep your files safe
                </p>
              </div>
              
              <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-toon bounce-hover">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Any File Type</h3>
                <p className="text-muted-foreground">
                  From videos to documents, code to music - we handle it all
                </p>
              </div>
            </div>
          </div>

          {/* Creator */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-border rounded-3xl p-8 shadow-toon">
            <h2 className="text-3xl font-bold mb-4">Meet the Creator</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                <span className="font-bold text-foreground">GB Transfer</span> is created by{" "}
                <span className="font-bold text-primary">Girish Lade</span> — an engineer, 
                UI/UX designer, developer, and creator who blends simplicity with powerful tech.
              </p>
              <p>
                He builds tools that feel smooth, modern, and fun. GB Transfer reflects his 
                mission to deliver clean, accessible, intelligent online utilities for everyone.
              </p>
              <p className="italic">
                "Technology should be powerful yet playful, serious yet delightful."
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Transfer?</h2>
            <p className="text-muted-foreground mb-6">
              Start sharing files with style and security
            </p>
            <Link to="/">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 bounce-hover text-lg px-8">
                Create Your First Transfer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;