import { useState } from "react";
import { Upload, FileText, Shield, Clock, Link2 } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import FileSettings from "@/components/FileSettings";
import LinkDisplay from "@/components/LinkDisplay";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileSettings, setFileSettings] = useState<{
    password?: string;
    expiryMinutes: number;
  } | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setFileSettings(null);
    setGeneratedLink(null);
  };

  const handleSettingsComplete = (settings: { password?: string; expiryMinutes: number }) => {
    setFileSettings(settings);
  };

  const handleLinkGenerated = (link: string) => {
    setGeneratedLink(link);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setFileSettings(null);
    setGeneratedLink(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            GB Transfer
          </h1>
        </div>
        <nav className="flex gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="bounce-hover">
              Dashboard
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" className="bounce-hover">
              About
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Share Files Like a Pro ✨
          </h2>
          <p className="text-xl text-muted-foreground">
            Fast, smooth, and secure file transfers with a toon-vibed twist
          </p>
        </div>

        {/* Features */}
        {!uploadedFile && (
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-bounce-in">
            <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-toon bounce-hover">
              <Upload className="w-10 h-10 text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">Any File Type</h3>
              <p className="text-sm text-muted-foreground">
                Upload videos, docs, code, music - anything!
              </p>
            </div>
            <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-toon bounce-hover">
              <Shield className="w-10 h-10 text-secondary mb-3" />
              <h3 className="font-bold text-lg mb-2">Password Lock</h3>
              <p className="text-sm text-muted-foreground">
                Protect your files with optional passwords
              </p>
            </div>
            <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-toon bounce-hover">
              <Clock className="w-10 h-10 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Auto-Expiry</h3>
              <p className="text-sm text-muted-foreground">
                Files disappear after your chosen time
              </p>
            </div>
          </div>
        )}

        {/* Upload flow */}
        <div className="space-y-8">
          {!uploadedFile && (
            <UploadZone onFileUpload={handleFileUpload} />
          )}

          {uploadedFile && !fileSettings && (
            <FileSettings
              file={uploadedFile}
              onComplete={handleSettingsComplete}
              onCancel={handleReset}
            />
          )}

          {uploadedFile && fileSettings && !generatedLink && (
            <LinkDisplay
              file={uploadedFile}
              settings={fileSettings}
              onLinkGenerated={handleLinkGenerated}
            />
          )}

          {generatedLink && (
            <div className="text-center space-y-4 animate-bounce-in">
              <div className="bg-card border-2 border-primary rounded-2xl p-8 shadow-glow">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Link2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Link Created! 🎉</h3>
                <p className="text-muted-foreground mb-6">
                  Your file is ready to share
                </p>
                <div className="bg-muted rounded-xl p-4 mb-4 break-all text-sm font-mono">
                  {generatedLink}
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink);
                    }}
                    className="bg-primary text-white hover:bg-primary/90 bounce-hover"
                  >
                    Copy Link
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="bounce-hover">
                    Upload Another
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;