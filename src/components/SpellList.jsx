export default function SpellList({spells}){
  if(!spells || spells.length === 0) return <div className="text-gray-400">No spells listed.</div>
  return (
    <ul className="list-inside list-disc space-y-2">
      {spells.map(s => (
        <li key={s.id}>
          <strong className="text-gold">{s.name}</strong>: <span className="text-gray-200">{s.desc}</span>
        </li>
      ))}
    </ul>
  )
}
