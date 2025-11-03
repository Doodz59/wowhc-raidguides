import { Link } from "react-router-dom";
import raids from "../data/raids.json"; 
import "../styles/theme.css"; 

export default function Home() {
 
  const availableRaids = ["molten-core"];

  return (
    <div className="home-container">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-heading mb-4">Hardcore Raid Guides</h1>
        <p className="text-gray-400">
         Select a raid to discover key strategies, positions, and mechanics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {raids.map((raid) => {
          const isAvailable = availableRaids.includes(raid.id);
          const imageUrl = `/images/maps/${raid.id}.jpg`;

          return (
            <div
              key={raid.id}
              className={`rounded-lg overflow-hidden shadow-lg relative group transition-all duration-300 
                ${isAvailable ? "hover:scale-105 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            >
              {isAvailable ? (
                <Link to={`/raid/${raid.id}`}>
                  <div
                    className="w-full h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition duration-200" />
                  <div className="absolute bottom-0 w-full p-4 bg-black/70 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-gold">{raid.name}</h2>
                  </div>
                </Link>
              ) : (
                <div>
                  <div
                    className="w-full h-48 bg-cover bg-center grayscale"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-semibold">
                      🚧 Work in progress
                    </span>
                  </div>
                  <div className="absolute bottom-0 w-full p-4 bg-black/70 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-gold">{raid.name}</h2>
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
