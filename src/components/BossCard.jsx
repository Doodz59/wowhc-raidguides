import { Link } from 'react-router-dom';

export default function BossCard({ boss, raidId, type = 'boss' }) {
  const imageUrl =
    Array.isArray(boss.image) && boss.image.length > 0
      ? boss.image[0]
      : '/images/default-boss.png'; // fallback image

  return (
    <Link to={`/raid/${raidId}/${type}/${boss.id}`} className="boss-card block">
      <div className="flex items-center gap-4 hover:scale-105 transition-transform duration-200">
        <div
          className="w-20 h-20 bg-cover bg-center rounded-md shadow-md"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div>
          <h4 className="font-heading text-lg">{boss.name}</h4>
          {boss.subtitle && <div className="text-sm text-gray-300">{boss.subtitle}</div>}
        </div>
      </div>
    </Link>
  );
}
