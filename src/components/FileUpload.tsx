
'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn, formatFileSize, isValidFileType } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  selectedFile: File | null
  isProcessing?: boolean
}

export function FileUpload({ 
  onFileSelect, 
  onFileRemove, 
  selectedFile, 
  isProcessing = false 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      if (isValidFileType(file.name)) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    disabled: isProcessing
  })

  const handleRemoveFile = () => {
    onFileRemove()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
              "hover:border-primary/50 hover:bg-primary/5",
              isDragActive && !isDragReject && "dropzone-active",
              isDragReject && "dropzone-reject",
              isProcessing && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className={cn(
                "p-4 rounded-full",
                isDragActive ? "bg-primary/10" : "bg-secondary"
              )}>
                <Upload className={cn(
                  "h-8 w-8",
                  isDragActive ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {isDragActive 
                    ? isDragReject 
                      ? "Invalid file type" 
                      : "Drop your document here"
                    : "Upload your document"
                  }
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isDragActive 
                    ? isDragReject 
                      ? "Please upload a PDF, DOCX, or DOC file"
                      : "Release to upload"
                    : "Drag and drop your document here, or click to browse"
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOCX, DOC (Max 10MB)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isProcessing ? (
                  <div className="flex items-center space-x-2 text-primary">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm">Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Ready</span>
                  </div>
                )}
                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {!isValidFileType(selectedFile.name) && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">
                  Invalid file type. Please upload a PDF, DOCX, or DOC file.
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 