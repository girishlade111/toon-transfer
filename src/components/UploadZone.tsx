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
        relative border-2 border-dashed rounded-xl p-12 
        transition-all duration-200 cursor-pointer
        ${isDragActive
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-card/50"
        }
        shadow-card
      `}
    >
      <input {...getInputProps()} />
      <div className="text-center space-y-4">
        <div className={`
          w-20 h-20 mx-auto rounded-full flex items-center justify-center
          ${isDragActive ? "bg-primary" : "bg-muted"}
          transition-all duration-200
        `}>
          {isDragActive ? (
            <FileText className="w-10 h-10 text-white" />
          ) : (
            <Upload className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            {isDragActive ? "Drop it here!" : "Drop your file here"}
          </h3>
          <p className="text-sm text-muted-foreground">
            or click to browse • Any file type • Max 100MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;