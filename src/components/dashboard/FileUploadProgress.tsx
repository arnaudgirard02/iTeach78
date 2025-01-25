import React from 'react';
import { Loader, FileText } from 'lucide-react';

interface Props {
  file: File;
  isProcessing: boolean;
}

export default function FileUploadProgress({ file, isProcessing }: Props) {
  return (
    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
      <div className="flex-shrink-0">
        {isProcessing ? (
          <Loader className="h-5 w-5 text-indigo-600 animate-spin" />
        ) : (
          <FileText className="h-5 w-5 text-indigo-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-indigo-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-indigo-700">
          {isProcessing ? 'Analyse en cours...' : 'En attente'}
        </p>
      </div>
    </div>
  );
}