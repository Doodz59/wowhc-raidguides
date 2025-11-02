import { Link } from 'react-router-dom'
export default function RaidCard({raid}){
  return (
    <Link to={`/raid/${raid.id}`} className="card-parchment p-4 rounded-md hover:shadow-lg block">
      <div className="h-36 bg-[url('/images/raids/molten-core.jpg')] bg-cover rounded-md mb-3" />
      <h3 className="text-xl font-heading text-gold">{raid.name}</h3>
      <p className="text-sm text-gray-300">{raid.short}</p>
    </Link>
  )
}
