'use client';

import Image from 'next/image'; // Use the Next.js Image component

interface QrCodeDisplayProps {
  url: string;
  tableName: string;
}

export default function QrCodeDisplay({ url, tableName }: QrCodeDisplayProps) {
  // This function now simply creates a link to the image URL for downloading
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = url;
    // Add the 'download' attribute to prompt a download
    link.setAttribute('download', `${tableName.replace(/\s+/g, '-')}-qr-code.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50">
      {/* Display the QR code using a standard Image component */}
      <div className="relative h-32 w-32">
        <Image 
          src={url} 
          alt={`QR Code for ${tableName}`} 
          layout="fill" 
          objectFit="contain" 
        />
      </div>
      <button
        onClick={downloadQRCode}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full font-semibold transition-colors"
      >
        Download
      </button>
    </div>
  );
}