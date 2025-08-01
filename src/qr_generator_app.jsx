import React, { useState, useEffect, useRef } from 'react';
import { Download, X, Zap } from 'lucide-react';

export default function QRCodeGenerator() {
  const [inputText, setInputText] = useState('');
  const [qrValue, setQrValue] = useState('https://example.com');
  const qrRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Load QR.js library from CDN
    if (!window.QR) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
      script.onload = () => generateQRCode();
      document.head.appendChild(script);
    } else {
      generateQRCode();
    }
  }, [qrValue]);

const generateQRCode = () => {
  if (window.QRious && canvasRef.current) {
    try {
      const qrSize = 300;
      const qr = new window.QRious({
        element: canvasRef.current,
        value: qrValue,
        size: qrSize,
        background: 'white',
        foreground: 'black',
        level: 'M'
      });

      // Load your logo
      const logo = new Image();
      logo.src = null; 

      logo.onload = () => {
        const ctx = canvasRef.current.getContext('2d');
        const logoSize = qrSize * 0.3; // 20% of QR code size
        const x = (qrSize - logoSize) / 2;
        const y = (qrSize - logoSize) / 2;

        // Draw the logo on top
        ctx.drawImage(logo, x, y, logoSize, logoSize);
      };

      logo.onerror = (err) => {
        console.error('Logo failed to load:', err);
      };
    } catch (error) {
      console.error('QR Code generation error:', error);
    }
  }
};


  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    setQrValue(value || 'Enter text to generate QR code');
  };

  const handleClear = () => {
    setInputText('');
    setQrValue('Enter text to generate QR code');
  };

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
     <div>
           <h1 className="text-2xl font-bold p-1 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
           <span>QR-Gen.</span>
        </h1>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            QR Code Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform any text, URL, or message into a scannable QR code instantly. 
            Perfect for sharing links, contact info, or any quick information.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <label htmlFor="qr-input" className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter Text or URL
                </label>
                <div className="relative">
                  <textarea
                    id="qr-input"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Type your text, URL, or message here..."
                    className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
                  />
                  {inputText && (
                    <button
                      onClick={handleClear}
                      className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Clear input"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                {/* Character count */}
                <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                  <span>{inputText.length} characters</span>
                  <span className={inputText.length > 1000 ? 'text-amber-600' : 'text-gray-400'}>
                    {inputText.length > 1000 ? 'Long text may create complex QR codes' : 'Optimal length'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={downloadQRCode}
                  disabled={!inputText}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Download PNG
                </button>
                
                <button
                  onClick={handleClear}
                  disabled={!inputText}
                  className="px-6 py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* QR Code Preview Section */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                  QR Code Preview
                </h3>
                
                <div 
                  ref={qrRef}
                  className="flex justify-center items-center bg-gray-50 rounded-xl p-6 min-h-[340px]"
                >
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto drop-shadow-sm bg-white rounded-lg"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                
                {/* QR Code Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    {inputText ? 
                      `QR code contains: "${inputText.length > 50 ? inputText.substring(0, 50) + '...' : inputText}"` :
                      'Enter text above to generate your QR code'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Examples */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setInputText('https://github.com');
                setQrValue('https://github.com');
              }}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="text-sm font-semibold text-gray-700 mb-1">Website URL</div>
              <div className="text-xs text-gray-500">https://github.com</div>
            </button>
            
            <button
              onClick={() => {
                setInputText('mailto:hello@example.com');
                setQrValue('mailto:hello@example.com');
              }}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="text-sm font-semibold text-gray-700 mb-1">Email Address</div>
              <div className="text-xs text-gray-500">mailto:hello@example.com</div>
            </button>
            
            <button
              onClick={() => {
                setInputText('Welcome to our restaurant! Scan for our menu and special offers.');
                setQrValue('Welcome to our restaurant! Scan for our menu and special offers.');
              }}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="text-sm font-semibold text-gray-700 mb-1">Custom Message</div>
              <div className="text-xs text-gray-500">Welcome message</div>
            </button>
          </div>

          {/* Usage Tips */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">💡 Usage Tips</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>URLs:</strong> Include https:// for web links to work properly when scanned.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Contact Info:</strong> Use vCard format for contact details that phones can save directly.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>File Size:</strong> Keep text under 1000 characters for best scanning results.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full bg-gray-900 text-gray-400 py-4 flex justify-center">
      <p className="text-center text-sm">
        © 2025 Developed by <span className="text-[#1ed760] font-semibold">Leomar Abad</span>
      </p>
    </footer>
    </div>
  );
}