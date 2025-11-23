import { useCallback, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
}

const UploadZone = ({ onFileUpload }: UploadZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
    setIsDragActive(false);
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-4 border-dashed rounded-3xl p-12 
        transition-all duration-300 cursor-pointer
        ${isDragActive 
          ? "border-primary bg-primary/5 scale-105" 
          : "border-border hover:border-primary/50 hover:bg-primary/5"
        }
        shadow-toon hover:shadow-glow
        animate-bounce-in
      `}
    >
      <input {...getInputProps()} />
      <div className="text-center space-y-4">
        <div className={`
          w-20 h-20 mx-auto rounded-full flex items-center justify-center
          ${isDragActive ? "bg-primary scale-110" : "bg-muted"}
          transition-all duration-300
        `}>
          {isDragActive ? (
            <FileText className="w-10 h-10 text-white animate-bounce" />
          ) : (
            <Upload className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">
            {isDragActive ? "Drop it here! 🎯" : "Drop your file here"}
          </h3>
          <p className="text-muted-foreground">
            or click to browse • Any file type • Max 100MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;