'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Download,
  Share2,
  BookmarkPlus,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Book
} from 'lucide-react';

interface FlipbookProps {
  pdfUrl: string;
  title?: string;
  author?: string;
  isOpen?: boolean;
  onClose?: () => void;
  height?: number;
  width?: number;
}

const Flipbook: React.FC<FlipbookProps> = ({
  pdfUrl,
  title = "Khassida",
  author = "Cheikh Ahmadou Bamba",
  isOpen = false,
  onClose,
  height = 600, 
  width = 800 
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Détecter si on est sur mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(3, prev + 0.2));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(0.5, prev - 0.2));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden ${
        isFullscreen ? 'w-full h-full m-2' : 'max-w-6xl max-h-[95vh] w-full mx-2 sm:mx-4'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <div className="flex-1 min-w-0">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold truncate`}>{title}</h2>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-emerald-100 truncate`}>{author}</p>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={toggleFullscreen}
              className={`${isMobile ? 'p-1.5' : 'p-2'} hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors`}
              title={isFullscreen ? "Réduire" : "Plein écran"}
            >
              {isFullscreen ? <Minimize size={isMobile ? 18 : 20} /> : <Maximize size={isMobile ? 18 : 20} />}
            </button>
            
            <button
              onClick={resetZoom}
              className={`${isMobile ? 'p-1.5' : 'p-2'} hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors`}
              title="Réinitialiser le zoom"
            >
              <ZoomOut size={isMobile ? 18 : 20} />
            </button>
            
            <button
              className={`${isMobile ? 'p-1.5' : 'p-2'} hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors hidden sm:inline-flex`}
              title="Télécharger"
            >
              <Download size={isMobile ? 18 : 20} />
            </button>
            
            <button
              className={`${isMobile ? 'p-1.5' : 'p-2'} hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors hidden sm:inline-flex`}
              title="Partager"
            >
              <Share2 size={isMobile ? 18 : 20} />
            </button>
            
            <button
              className={`${isMobile ? 'p-1.5' : 'p-2'} hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors hidden sm:inline-flex`}
              title="Marquer"
            >
              <BookmarkPlus size={isMobile ? 18 : 20} />
            </button>
            
            <button
              onClick={handleClose}
              className={`${isMobile ? 'p-1.5' : 'p-2'} hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors`}
              title="Fermer"
            >
              <X size={isMobile ? 18 : 20} />
            </button>
          </div>
        </div>

        {/* Contenu PDF */}
        <div className={`${isMobile ? 'p-2' : 'p-4'} bg-gray-50 ${isFullscreen ? 'h-full' : 'max-h-[calc(95vh-80px)]'} overflow-hidden`}>
          <div className="flex flex-col items-center justify-center h-full">
            {/* Contrôles de zoom */}
            <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'} ${isMobile ? 'p-1.5' : 'p-2'} mb-3 sm:mb-4 bg-white rounded-lg shadow-md`}>
              <button
                onClick={zoomOut}
                className={`${isMobile ? 'p-1.5' : 'p-2'} bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors`}
                title="Zoom arrière"
              >
                <ZoomOut size={isMobile ? 14 : 16} />
              </button>
              
              <span className={`${isMobile ? 'px-2 py-1.5' : 'px-3 py-2'} bg-gray-100 rounded-lg ${isMobile ? 'min-w-[50px]' : 'min-w-[60px]'} text-center font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {Math.round(zoom * 100)}%
              </span>
              
              <button
                onClick={zoomIn}
                className={`${isMobile ? 'p-1.5' : 'p-2'} bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors`}
                title="Zoom avant"
              >
                <ZoomIn size={isMobile ? 14 : 16} />
              </button>
            </div>

            {/* Viewer PDF */}
            <div 
              className="bg-white rounded-lg shadow-lg overflow-auto w-full"
              style={{ 
                height: isFullscreen ? (isMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 120px)') : (isMobile ? 'calc(100vh - 180px)' : '70vh')
              }}
            >
              <embed
                src={pdfUrl}
                type="application/pdf"
                className="w-full h-full border-0"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  width: `${100/zoom}%`,
                  height: `${100/zoom}%`,
                  minWidth: isMobile ? '280px' : '400px'
                }}
                title={`${title} - PDF Viewer`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flipbook;