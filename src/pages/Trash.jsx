import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BossCard from "../components/BossCard"; // On réutilise la même carte
import SpellList from "../components/SpellList"; // Si jamais tu veux l’étendre plus tard

export default function Trash() {
  const { raidId, trashId } = useParams();
  const [raid, setRaid] = useState(null);
  const [trash, setTrash] = useState(null);
  const [trashIndex, setTrashIndex] = useState(null);

  useEffect(() => {
    import(`../data/${raidId}.json`)
      .then((module) => {
        const raidData = module.default;
        const list = raidData.trash;
        const index = list.findIndex((t) => t.id === trashId);

        setRaid(raidData);
        setTrash(list[index] || null);
        setTrashIndex(index !== -1 ? index : null);
      })
      .catch((err) => {
        console.error("Erreur de chargement du raid :", err);
        setRaid(null);
        setTrash(null);
      });
  }, [raidId, trashId]);

  if (!raid || !trash) {
    return <div className="text-gray-400 p-4">Trash non trouvé.</div>;
  }

  const prevTrash = trashIndex > 0 ? raid.trash[trashIndex - 1] : null;
  const nextTrash =
    trashIndex < raid.trash.length - 1 ? raid.trash[trashIndex + 1] : null;

  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-3xl font-heading text-gold mb-2">{trash.name}</h1>

           {/* Strategy */}
      {trash.strategy && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-6 mb-2">Strategy</h2>
          <p className="mb-6">{trash.strategy}</p>
        </>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center">
        {prevTrash ? (
          <BossCard boss={prevTrash} raidId={raidId} type="trash" />
        ) : (
          <div className="w-40" />
        )}

        <Link to={`/raid/${raidId}`} className="text-gold hover:underline">
          ← Back to {raid.name}
        </Link>

        {nextTrash ? (
          <BossCard boss={nextTrash} raidId={raidId} type="trash" />
        ) : (
          <div className="w-40" />
        )}
      </div>
    </div>
  );
}
