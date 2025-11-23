import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, Lock, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
    
    // Set up real-time subscription
    const channel = supabase
      .channel("files-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "files",
        },
        () => {
          fetchFiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
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
    
    if (diff < 0) return "Expired";
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  const handleCopyLink = (linkId: string) => {
    const link = `${window.location.origin}/download/${linkId}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      // Delete from storage
      await supabase.storage.from("transfers").remove([filePath]);
      
      // Delete from database
      await supabase.from("files").delete().eq("id", id);
      
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-bounce-in">
          <p className="text-xl font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your file transfers</p>
          </div>
          <Link to="/">
            <Button className="bg-primary text-white hover:bg-primary/90 bounce-hover">
              New Transfer
            </Button>
          </Link>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-12 bg-card border-2 border-dashed border-border rounded-3xl">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No transfers yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first file to get started
            </p>
            <Link to="/">
              <Button className="bg-primary text-white hover:bg-primary/90 bounce-hover">
                Create Transfer
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-card border-2 border-border rounded-2xl p-6 shadow-toon hover:shadow-glow transition-all bounce-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate mb-1">{file.file_name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeRemaining(file.expire_at)}
                      </span>
                      {file.password_hash && (
                        <span className="flex items-center gap-1 text-secondary">
                          <Lock className="w-3 h-3" />
                          Protected
                        </span>
                      )}
                      <span>Downloads: {file.download_count}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyLink(file.link_id)}
                      className="bounce-hover"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(file.id, file.file_path)}
                      className="bounce-hover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;