'use client';

import Image from 'next/image';

interface QrCodeDisplayProps {
  url: string;
  tableName: string;
}

export default function QrCodeDisplay({ url, tableName }: QrCodeDisplayProps) {
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = url;
    // FIXED: Corrected template literal syntax for the filename
    link.setAttribute('download', `${tableName.replace(/\s+/g, '-')}-qr-code.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50">
      <div className="relative h-32 w-32">
        <Image
          src={url}
          // FIXED: Corrected template literal syntax for the alt text
          alt={`QR Code for ${tableName}`}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <button
        onClick={downloadQRCode}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full font-semibold transition-colors"
      >
        Download
      </button>
    </div>
  );
}