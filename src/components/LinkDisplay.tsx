import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import bcrypt from "bcryptjs";
import { useAuth } from "@/hooks/useAuth";

interface LinkDisplayProps {
  file: File;
  settings: {
    password?: string;
    expiryMinutes: number;
  };
  onLinkGenerated: (link: string) => void;
}

const LinkDisplay = ({ file, settings, onLinkGenerated }: LinkDisplayProps) => {
  const [uploading, setUploading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    uploadFile();
  }, []);

  const uploadFile = async () => {
    try {
      // Generate unique link ID
      const linkId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Upload file to storage
      const filePath = `${linkId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("transfers")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Hash password if provided
      let passwordHash: string | undefined;
      if (settings.password) {
        passwordHash = await bcrypt.hash(settings.password, 10);
      }

      // Calculate expiry time
      const expireAt = new Date();
      expireAt.setMinutes(expireAt.getMinutes() + settings.expiryMinutes);

      // Save to database
      const { error: dbError } = await supabase
        .from("files")
        .insert({
          link_id: linkId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || "application/octet-stream",
          file_path: filePath,
          password_hash: passwordHash,
          expire_at: expireAt.toISOString(),
          user_agent: navigator.userAgent,
          user_id: user?.id, // Link to user if authenticated
        });

      if (dbError) throw dbError;

      // Generate shareable link
      const link = `${window.location.origin}/download/${linkId}`;
      onLinkGenerated(link);
      toast.success("File uploaded successfully! 🎉");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center py-12 animate-bounce-in">
      <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
      <h3 className="text-xl font-bold mb-2">Uploading Your File...</h3>
      <p className="text-muted-foreground">Creating your secure transfer link ✨</p>
    </div>
  );
};

export default LinkDisplay;