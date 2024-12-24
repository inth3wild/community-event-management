/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload } from 'lucide-react';

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect: (file: File | null) => void;
  previewUrl?: string;
  onClear?: () => void;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onFileSelect, previewUrl, onClear, ...props }, _ref) => {
    const [preview, setPreview] = React.useState<string | undefined>(
      previewUrl
    );
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleClear = () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setPreview(undefined);
      onFileSelect(null);
      onClear?.();
    };

    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Image
          </Button>
          {preview && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4 mr-2" />
              Remove Image
            </Button>
          )}
        </div>
        <Input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          {...props}
        />
        {preview && (
          <div className="relative w-full max-w-md">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';
