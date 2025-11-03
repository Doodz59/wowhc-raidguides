import { Link } from 'react-router-dom';
import raids from '../data/raids.json'; 

export default function Navbar() {
  const handleUnavailable = (name) => {
    alert(`${name} — Work in progress 🛠️`);
  };

  return (
    <nav className="flex items-center justify-between">
      
     
      <Link to="/" className="text-2xl font-heading text-gold font-bold hover:text-yellow-400 transition-colors">
        WoW Classic Raids
      </Link>

      
    </nav>
  );
}
