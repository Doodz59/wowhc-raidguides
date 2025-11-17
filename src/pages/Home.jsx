import { Link } from "react-router-dom";
import { useState } from "react";
import raids from "../data/raids.json";
import "../styles/theme.css";

export default function Home() {

  return (
    <div className="home-container">
      {/* === Header === */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-heading mb-4 text-gold drop-shadow-lg">
          Hardcore Raid Guides
        </h1>
        <p className="text-gray-400 italic">
          Select a raid to discover key strategies, positions, and mechanics.
        </p>
      </div>

      {/* === Raid Grid === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        {raids.map((raid) => {

          const candidates = [
            `/images/maps/${raid.id}.jpg`,
            `/images/maps/${raid.id}.png`,
            `/images/maps/${raid.id}.jpeg`,
            `/images/maps/${raid.id}.webp`,
          ];

          const [imgSrc, setImgSrc] = useState(candidates[0]);

          const handleError = () => {
            const index = candidates.indexOf(imgSrc);
            const next = candidates[index + 1];
            if (next) setImgSrc(next);
          };

          return (
            <div
              key={raid.id}
              className={`relative rounded-xl overflow-hidden shadow-lg border border-[rgba(212,175,55,0.2)] transition-all duration-300
                ${raid.available ? "hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            >
              {raid.available ? (
                <Link to={`/raid/${raid.id}`}>
                  <div className="w-full h-48 bg-black">
                    <img
                      src={imgSrc}
                      onError={handleError}
                      alt={raid.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-300" />

                  <div className="absolute bottom-0 w-full p-4 bg-black/70 backdrop-blur-sm">
                    <h2 className="text-xl font-heading text-gold">{raid.name}</h2>
                  </div>
                </Link>
              ) : (
                <div className="relative">
                  <div className="w-full h-48 bg-black">
                    <img
                      src={imgSrc}
                      onError={handleError}
                      alt={raid.name}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <span className="text-gray-400 font-semibold text-sm mb-1">
                      🚧 Work in progress
                    </span>
                    <span className="text-gray-500 text-xs italic">
                      Coming soon
                    </span>
                  </div>

                  <div className="absolute bottom-0 w-full p-4 bg-black/70 backdrop-blur-sm">
                    <h2 className="text-xl font-heading text-gray-500">{raid.name}</h2>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
