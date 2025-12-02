import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Download as DownloadIcon, Lock, FileText, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bcrypt from "bcryptjs";

const Download = () => {
  const { linkId } = useParams();
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState<any>(null);
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);

  useEffect(() => {
    fetchFileData();
  }, [linkId]);

  const fetchFileData = async () => {
    try {
      // Only select safe columns (exclude user_agent and file_path for security)
      const { data, error } = await supabase
        .from("files")
        .select("id, link_id, file_name, file_size, file_type, expire_at, download_count, password_hash, created_at")
        .eq("link_id", linkId)
        .maybeSingle();

      if (error) throw error;

      // Check if expired
      if (new Date(data.expire_at) < new Date()) {
        setExpired(true);
      } else {
        setFileData(data);
        setNeedsPassword(!!data.password_hash);
      }
    } catch (error) {
      console.error("Error fetching file:", error);
      toast.error("File not found");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatTimeRemaining = (expireAt: string) => {
    const now = new Date();
    const expiry = new Date(expireAt);
    const diff = expiry.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  };

  const handleDownload = async () => {
    if (needsPassword && fileData.password_hash) {
      const isValid = await bcrypt.compare(password, fileData.password_hash);
      if (!isValid) {
        toast.error("Incorrect password!");
        return;
      }
    }

    setDownloading(true);
    try {
      // Fetch file_path securely after authentication
      const { data: fileRecord, error: fetchError } = await supabase
        .from("files")
        .select("file_path")
        .eq("id", fileData.id)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase.storage
        .from("transfers")
        .download(fileRecord.file_path);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileData.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Update download count
      await supabase
        .from("files")
        .update({ download_count: fileData.download_count + 1 })
        .eq("id", fileData.id);

      toast.success("Download started! 🎉");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-bounce-in text-center">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md animate-bounce-in">
          <div className="w-20 h-20 bg-destructive/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Oops! Link Expired 👀✨</h1>
          <p className="text-muted-foreground mb-6">
            This transfer link has reached its expiry time and is no longer available.
          </p>
          <Link to="/">
            <Button className="bg-primary text-white hover:bg-primary/90 bounce-hover">
              Create New Transfer
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 text-sm hover:text-primary transition-colors">
          ← Back to Home
        </Link>

        <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-toon animate-bounce-in">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
              <DownloadIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Download Ready!</h1>
          </div>

          {/* File info */}
          <div className="bg-muted rounded-xl p-4 mb-6 space-y-2">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{fileData.file_name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(fileData.file_size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
              <Clock className="w-4 h-4" />
              <span>Expires in {formatTimeRemaining(fileData.expire_at)}</span>
            </div>
          </div>

          {/* Password input */}
          {needsPassword && (
            <div className="mb-6 animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-secondary" />
                <Label htmlFor="password" className="font-semibold">This file is password protected</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to download"
                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
              />
            </div>
          )}

          {/* Download button */}
          <Button
            onClick={handleDownload}
            disabled={downloading || (needsPassword && !password)}
            className="w-full bg-primary text-white hover:bg-primary/90 bounce-hover"
          >
            {downloading ? "Downloading..." : "Download File"}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Downloaded {fileData.download_count} time{fileData.download_count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Download;