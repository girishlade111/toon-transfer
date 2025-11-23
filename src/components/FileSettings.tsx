import { useState } from "react";
import { FileText, Lock, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FileSettingsProps {
  file: File;
  onComplete: (settings: { password?: string; expiryMinutes: number }) => void;
  onCancel: () => void;
}

const FileSettings = ({ file, onComplete, onCancel }: FileSettingsProps) => {
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState(15);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleComplete = () => {
    onComplete({
      password: usePassword ? password : undefined,
      expiryMinutes,
    });
  };

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-toon animate-bounce-in">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        Configure Your Transfer
      </h3>

      {/* File info */}
      <div className="bg-muted rounded-xl p-4 mb-6">
        <p className="font-semibold truncate">{file.name}</p>
        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>

      {/* Password protection */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-secondary" />
            <Label htmlFor="password-toggle" className="font-semibold">Password Protection</Label>
          </div>
          <Switch
            id="password-toggle"
            checked={usePassword}
            onCheckedChange={setUsePassword}
          />
        </div>

        {usePassword && (
          <div className="animate-slide-up">
            <Label htmlFor="password">Enter Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a secure password"
              className="mt-2"
            />
          </div>
        )}
      </div>

      {/* Expiry time */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          <Label htmlFor="expiry" className="font-semibold">Expiry Time</Label>
        </div>
        <Select value={expiryMinutes.toString()} onValueChange={(v) => setExpiryMinutes(parseInt(v))}>
          <SelectTrigger id="expiry">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 minute</SelectItem>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="15">15 minutes (default)</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="360">6 hours</SelectItem>
            <SelectItem value="1440">1 day</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleComplete}
          disabled={usePassword && !password}
          className="flex-1 bg-primary text-white hover:bg-primary/90 bounce-hover"
        >
          <Check className="w-4 h-4 mr-2" />
          Generate Link
        </Button>
        <Button variant="outline" onClick={onCancel} className="bounce-hover">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default FileSettings;