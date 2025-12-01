import React from 'react';
import { Camera, Download, ExternalLink } from 'lucide-react';

interface ImagePlaceholderProps {
  title: string;
  filename: string;
  dimensions: string;
  category?: string;
  className?: string;
}

/**
 * ImagePlaceholder Component
 * Shows where images should be placed with helpful information
 * 
 * Usage:
 * <ImagePlaceholder 
 *   title="Hero Image" 
 *   filename="hero-table-tennis.jpg"
 *   dimensions="1920x1080"
 * />
 */
export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  title,
  filename,
  dimensions,
  category = 'General',
  className = '',
}) => {
  const searchQuery = title.toLowerCase().replace('image', 'table tennis');
  const unsplashUrl = `https://unsplash.com/s/photos/${encodeURIComponent(searchQuery)}`;
  
  return (
    <div className={`relative bg-gradient-to-br from-muted/30 via-muted/50 to-background border-2 border-dashed border-primary/30 rounded-xl overflow-hidden group hover:border-primary/50 transition-all ${className}`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-4">
          <Camera className="w-16 h-16 text-primary/40 mx-auto animate-pulse" />
        </div>
        
        <h3 className="font-semibold text-foreground mb-2">\ud83d\udcf8 {title}</h3>
        
        <div className="space-y-1 mb-4 text-sm text-muted-foreground">
          <p>
            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
              {filename}
            </span>
          </p>
          <p className="text-xs">Recommended: {dimensions}px</p>
          <p className="text-xs text-muted-foreground/70">
            Location: <span className="font-mono">src/assets/images/</span>
          </p>
        </div>
        
        <a
          href={unsplashUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20"
        >
          <Download className="w-3 h-3" />
          Find on Unsplash
          <ExternalLink className="w-3 h-3" />
        </a>
        
        <div className="mt-3 text-xs text-muted-foreground/60">
          Category: {category}
        </div>
      </div>
    </div>
  );
};

export default ImagePlaceholder;
