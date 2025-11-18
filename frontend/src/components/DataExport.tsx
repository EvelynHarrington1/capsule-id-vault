import { useState } from 'react';
import { Download, FileText, File } from 'lucide-react';
import { Button } from './ui/Button';
import { useDataExport } from '../hooks/useDataExport';
import { useErrorHandler } from '../hooks/useErrorHandler';

export function DataExport() {
  const [isOpen, setIsOpen] = useState(false);
  const { downloadAsJSON, downloadAsCSV, isExporting } = useDataExport();
  const { showSuccess, showWalletError } = useErrorHandler();

  const handleExportJSON = async () => {
    try {
      await downloadAsJSON();
      showSuccess('Export Complete', 'Your health data has been downloaded as JSON.');
      setIsOpen(false);
    } catch (error) {
      showWalletError('Export failed. Please ensure your wallet is connected.');
    }
  };

  const handleExportCSV = async () => {
    try {
      await downloadAsCSV();
      showSuccess('Export Complete', 'Your health data has been downloaded as CSV.');
      setIsOpen(false);
    } catch (error) {
      showWalletError('Export failed. Please ensure your wallet is connected.');
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export Data
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-2">
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              Export as JSON
            </button>
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <File className="w-4 h-4" />
              Export as CSV
            </button>
          </div>
          <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
            Download your encrypted health data
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
