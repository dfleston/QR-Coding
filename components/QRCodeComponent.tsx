
import React, { useEffect, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  opacity: number;
}

export const QRCodeComponent: React.FC<QRCodeProps> = ({ 
  value, 
  size, 
  fgColor, 
  bgColor,
  opacity 
}) => {
  return (
    <div 
      style={{ opacity }}
      className="transition-opacity duration-300"
    >
      <QRCodeCanvas
        value={value || "https://google.com"}
        size={size}
        level="H"
        includeMargin={true}
        fgColor={fgColor}
        bgColor={bgColor}
      />
    </div>
  );
};
