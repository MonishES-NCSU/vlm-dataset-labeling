"use client";

import { useState, useRef } from "react";
import { FolderOpen, ExternalLink, AlertCircle, Loader2, Upload, X, CheckCircle, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  parseCSV, 
  createBusinessInfoStore, 
  validateBusinessInfoCSV 
} from "@/lib/address-utils";
import { BusinessInfoStore } from "@/lib/types";

interface FolderInputProps {
  onSubmit: (folderUrl: string, businessInfo?: BusinessInfoStore) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function FolderInput({ onSubmit, isLoading = false, error }: FolderInputProps) {
  const [folderUrl, setFolderUrl] = useState("");
  const [businessInfoStore, setBusinessInfoStore] = useState<BusinessInfoStore | null>(null);
  const [businessInfoFileName, setBusinessInfoFileName] = useState<string | null>(null);
  const [businessInfoError, setBusinessInfoError] = useState<string | null>(null);
  const [businessInfoRowCount, setBusinessInfoRowCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateGoogleDriveUrl = (url: string): boolean => {
    // Accept various Google Drive folder URL formats
    const patterns = [
      /^https:\/\/drive\.google\.com\/drive\/folders\/[\w-]+/,
      /^https:\/\/drive\.google\.com\/drive\/u\/\d+\/folders\/[\w-]+/,
      /^https:\/\/drive\.google\.com\/open\?id=[\w-]+/,
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderUrl.trim()) {
      onSubmit(folderUrl.trim(), businessInfoStore || undefined);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous state
    setBusinessInfoError(null);
    setBusinessInfoStore(null);
    setBusinessInfoFileName(null);
    setBusinessInfoRowCount(0);

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      setBusinessInfoError("Please upload a CSV file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setBusinessInfoError("File size must be less than 5MB");
      return;
    }

    try {
      const content = await file.text();
      
      // Validate CSV structure
      const validation = validateBusinessInfoCSV(content);
      if (!validation.isValid) {
        setBusinessInfoError(validation.error || "Invalid CSV file");
        return;
      }

      // Parse and create store
      const parsed = parseCSV(content);
      const store = createBusinessInfoStore(parsed);
      
      const storeSize = Object.keys(store).length;
      if (storeSize === 0) {
        setBusinessInfoError("No valid business entries found in CSV. Make sure each row has an address.");
        return;
      }

      setBusinessInfoStore(store);
      setBusinessInfoFileName(file.name);
      setBusinessInfoRowCount(storeSize);
    } catch (err) {
      setBusinessInfoError(
        err instanceof Error 
          ? `Failed to process file: ${err.message}` 
          : "Failed to process file"
      );
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveBusinessInfo = () => {
    setBusinessInfoStore(null);
    setBusinessInfoFileName(null);
    setBusinessInfoError(null);
    setBusinessInfoRowCount(0);
  };

  const isValidUrl = folderUrl.trim() === "" || validateGoogleDriveUrl(folderUrl);

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Storefront Image Labeling</CardTitle>
          <CardDescription className="text-base">
            Enter your Google Drive folder URL containing the storefront images to begin labeling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="folder-url" className="text-sm font-medium">
                Google Drive Folder URL
              </label>
              <Input
                id="folder-url"
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={folderUrl}
                onChange={(e) => setFolderUrl(e.target.value)}
                className={!isValidUrl ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {!isValidUrl && (
                <p className="text-sm text-destructive">
                  Please enter a valid Google Drive folder URL
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Optional Business Info CSV Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Business Info CSV
                <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <p className="text-xs text-muted-foreground">
                Upload a CSV with business metadata (Name, Address, Type, Rating, Status) to display during labeling.
              </p>
              
              {businessInfoFileName ? (
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      {businessInfoFileName}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ({businessInfoRowCount} businesses)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveBusinessInfo}
                    className="h-6 w-6 p-0 hover:bg-green-200 dark:hover:bg-green-800"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="shrink-0"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              )}
              
              {businessInfoError && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{businessInfoError}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!folderUrl.trim() || !isValidUrl || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading Images...
                </>
              ) : (
                <>
                  Start Labeling
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-3">Instructions</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Make sure the Google Drive folder is shared (at least view access)</li>
              <li>The folder should contain subfolders named by address</li>
              <li>Each address folder should contain storefront images</li>
              <li>All images must be labeled before you can export the CSV</li>
            </ol>
          </div>

          <div className="mt-4 text-center">
            <a 
              href="https://support.google.com/drive/answer/7166529" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              How to share a Google Drive folder
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
