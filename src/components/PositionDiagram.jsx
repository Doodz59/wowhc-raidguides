import { useState, useEffect } from 'react';

export default function PositionDiagram({ boss }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = boss?.position ?? [];

  // Reset l'image courante chaque fois que le boss change
  useEffect(() => {
    setCurrentIndex(0);
  }, [boss]);

  if (!boss) {
    return (
      <div className="w-full h-64 border border-dashed border-gray-700 rounded-md flex items-center justify-center text-gray-500">
        Boss not found
      </div>
    );
  }

  if (images.length === 0) {
    console.log("No position images found for boss:", boss.name);
    console.log("Expected image URLs:", boss.position);
    return (
      <div className="w-full h-64 border border-dashed border-gray-700 rounded-md flex items-center justify-center text-gray-500">
        no images yet
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full flex items-center justify-center">
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
          >
            &#8592;
          </button>
        )}

        <img
          key={currentImage}
          src={currentImage}
          alt={`Diagramme de position pour ${boss.name}`}
          className="max-w-full max-h-full object-contain rounded-md transition-all duration-500"
          
        />

        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
          >
            &#8594;
          </button>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 bg-gray-700 bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-400">
        made with{' '}
        <a
          href="https://raidplan.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-600"
        >
          raidplan.io
        </a>
      </div>
    </div>
  );
}
