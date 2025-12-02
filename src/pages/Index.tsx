import { useState } from "react";
import { FileText, Shield, Clock, Eye, Check, Archive, FileImage, FileVideo, Link as LinkIcon, LogOut, User } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import FileSettings from "@/components/FileSettings";
import LinkDisplay from "@/components/LinkDisplay";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileSettings, setFileSettings] = useState<{
    password?: string;
    expiryMinutes: number;
  } | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    setUploadedFile(null);
    setFileSettings(null);
    setGeneratedLink(null);
  };
  const [uploadProgress] = useState(100);

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

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return <FileImage className="w-5 h-5 text-primary" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) {
      return <FileVideo className="w-5 h-5 text-primary" />;
    }
    if (['pptx', 'ppt'].includes(ext || '')) {
      return <Archive className="w-5 h-5 text-primary" />;
    }
    return <FileText className="w-5 h-5 text-primary" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-8 py-6 animate-fade-in">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src="/logo.png" alt="GB Transfer Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LadeShare Demo</h1>
              <p className="text-sm text-muted-foreground">Secure File Sharing Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-success/20 border border-success/30 rounded-full animate-pulse-glow">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-success">Live Demo</span>
            </div>
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-muted-foreground scale-hover-sm">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground scale-hover-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-muted-foreground scale-hover-sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-muted-foreground scale-hover-sm">
                    Dashboard
                  </Button>
                </Link>
              </>
            )}
            <Link to="/about">
              <Button variant="ghost" size="sm" className="text-muted-foreground scale-hover-sm">
                About
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card animate-slide-up shadow-card-hover">
            {/* Upload complete status - shown when file is uploaded */}
            {uploadedFile && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Upload complete!</p>
                    <Progress value={uploadProgress} className="h-2 mt-2" />
                  </div>
                </div>
              </div>
            )}

            {/* Upload zone - shown initially */}
            {!uploadedFile && (
              <div className="mb-8">
                <UploadZone onFileUpload={handleFileUpload} />
              </div>
            )}

            {/* File settings - shown after upload */}
            {uploadedFile && !fileSettings && (
              <div className="mb-8">
                <FileSettings
                  file={uploadedFile}
                  onComplete={handleSettingsComplete}
                  onCancel={handleReset}
                />
              </div>
            )}

            {/* Link generation - shown after settings */}
            {uploadedFile && fileSettings && !generatedLink && (
              <div className="mb-8">
                <LinkDisplay
                  file={uploadedFile}
                  settings={fileSettings}
                  onLinkGenerated={handleLinkGenerated}
                />
              </div>
            )}

            {/* Success state - shown after link is generated */}
            {generatedLink && (
              <div className="mb-8 text-center">
                <div className="bg-muted rounded-xl p-6 mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <LinkIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Link Created! 🎉</h3>
                  <p className="text-muted-foreground mb-6">Your file is ready to share</p>
                  <div className="bg-background rounded-lg p-4 mb-4 break-all text-sm font-mono">
                    {generatedLink}
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedLink);
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Copy Link
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      Upload Another
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Two-column layout: Security Features & Recent Files */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Security Features */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Security Features</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between scale-hover-sm shadow-card-hover">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-success" />
                      <span className="font-medium">AES-256 Encryption</span>
                    </div>
                    <span className="status-badge status-active">active</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between scale-hover-sm shadow-card-hover delay-100">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-success" />
                      <span className="font-medium">Auto Expiry (24h)</span>
                    </div>
                    <span className="status-badge status-active">active</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between scale-hover-sm shadow-card-hover delay-200">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Password Protection</span>
                    </div>
                    <span className="status-badge status-optional">optional</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between scale-hover-sm shadow-card-hover delay-300">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-success" />
                      <span className="font-medium">Download Tracking</span>
                    </div>
                    <span className="status-badge status-active">active</span>
                  </div>
                </div>
              </div>

              {/* Recent Files */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Archive className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Recent Files</h3>
                </div>
                <div className="space-y-3">
                  {uploadedFile ? (
                    <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between scale-hover-sm shadow-card-hover">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(uploadedFile.name)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-xl p-8 text-center">
                      <Archive className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground text-sm">No files uploaded yet</p>
                      <p className="text-muted-foreground text-xs mt-1">Upload a file to see it here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="mt-8">
              <Button
                className="w-full bg-white text-black hover:bg-white/90 font-semibold scale-hover shadow-glow-hover"
                onClick={() => {
                  if (uploadedFile && !fileSettings) {
                    // Trigger settings completion with default values
                    handleSettingsComplete({ expiryMinutes: 1440 });
                  }
                }}
              >
                <Archive className="w-4 h-4 mr-2" />
                Generate Secure Link
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;