import { Link } from 'react-router-dom';
import raids from '../data/raids.json'; // JSON de tous les raids

export default function Navbar() {
  return (
    <nav className=" px-6 py-3 flex items-center justify-between">
      <div className="text-2xl font-heading text-gold font-bold">WoW Classic Raids</div>

      <ul className="flex items-center gap-6">
        {/* Onglet Raid avec menu déroulant */}
        <li className="relative group">
          <button className="font-heading text-gold hover:text-yellow-400 font-semibold">
            Raids ▼
          </button>

          {/* Menu déroulant */}
          <ul className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
            {raids.map((raid) => (
              <li key={raid.id} className="border-b border-gray-700 last:border-b-0">
                <Link
                  to={`/raid/${raid.id}`}
                  className="block px-5 py-2 hover:bg-gray-700 hover:text-yellow-400 font-heading text-gold"
                >
                  {raid.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>

        {/* Autres onglets */}
        <li>
          <Link to="/" className="font-heading text-gold hover:text-yellow-400 font-semibold">Accueil</Link>
        </li>
     
      </ul>
    </nav>
  );
}
