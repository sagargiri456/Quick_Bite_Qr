'use client';

import { QRCodeCanvas } from 'qrcode.react';

interface QrCodeDisplayProps {
  url: string;
  tableName: string;
}

export default function QrCodeDisplay({ url, tableName }: QrCodeDisplayProps) {
  const downloadQRCode = () => {
    const canvas = document.getElementById(`qr-code-${tableName}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${tableName.replace(/\s+/g, '-')}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
      <QRCodeCanvas id={`qr-code-${tableName}`} value={url} size={128} level={"H"} />
      {/* --- MODIFIED THIS BUTTON'S CLASSES --- */}
      <button
        onClick={downloadQRCode}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full font-semibold transition-colors"
      >
        Download
      </button>
    </div>
  );
}