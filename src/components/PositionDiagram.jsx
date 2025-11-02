import { useState } from 'react';
import { useParams } from 'react-router-dom';
import raidData from '../data/molten-core.json';

export default function PositionDiagram() {
  const { bossId } = useParams();
  const boss = raidData.bosses.find((b) => b.id === bossId);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!boss) {
    return (
      <div className="w-full h-64 border border-dashed border-gray-700 rounded-md flex items-center justify-center text-gray-500">
        Boss non trouvé
      </div>
    );
  }

  // On ne prend que les images de position (champ 'position')
  const images = boss.position ?? [];

  if (images.length === 0) {
    return (
      <div className="w-full h-64 border border-dashed border-gray-700 rounded-md flex items-center justify-center text-gray-500">
        Pas d'image de position disponible
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Flèche gauche */}
      {images.length > 1 && (
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
        >
          &#8592;
        </button>
      )}

      {/* Image */}
      <img
        key={currentImage}
        src={currentImage} // champ 'position' directement
        alt={`Diagramme de position pour ${boss.name}`}
        className="max-w-full max-h-full object-contain rounded-md transition-all duration-500"
      />

      {/* Flèche droite */}
      {images.length > 1 && (
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
        >
          &#8594;
        </button>
      )}

      {/* Indicateur */}
      {images.length > 1 && (
        <div className="absolute bottom-2 bg-gray-700 bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
