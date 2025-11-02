import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SpellList from '../components/SpellList';
import PositionDiagram from '../components/PositionDiagram';
import BossCard from '../components/BossCard';
import Consumables from '../components/Consumables';
import consumablesDataArray from '../data/consumables.json'; 

export default function Boss() {
  const { raidId, type, bossId } = useParams();
  const [raid, setRaid] = useState(null);
  const [boss, setBoss] = useState(null);
  const [bossIndex, setBossIndex] = useState(-1);

  
  const consumablesData = {};
  consumablesDataArray.forEach(c => { consumablesData[c.id] = c; });

  useEffect(() => {
    let isMounted = true;

    import(`../data/${raidId}.json`)
      .then((module) => {
        if (!isMounted) return;
        const raidData = module.default;
        const list = type === 'trash' ? (raidData.trash || []) : (raidData.bosses || []);
        const index = list.findIndex(b => b.id === bossId);

        setRaid(raidData);
        setBoss(index !== -1 ? list[index] : null);
        setBossIndex(index); 
      })
      .catch(err => {
        console.error(err);
        if (!isMounted) return;
        setRaid(null);
        setBoss(null);
        setBossIndex(-1);
      });

    return () => { isMounted = false; };
  }, [raidId, type, bossId]);

  if (!raid || !boss) return <div className="text-gray-400 p-4">Boss non trouvé.</div>;

  const list = type === 'trash' ? (raid.trash || []) : (raid.bosses || []);
  const prevBoss = bossIndex > 0 ? list[bossIndex - 1] : null;
  const nextBoss = bossIndex >= 0 && bossIndex < list.length - 1 ? list[bossIndex + 1] : null;

  
  const mergedConsumables = (boss.consumables || []).map(item => {
    const global = consumablesData[item.id] || {};
    return {
      id: item.id,
      name: global.name || item.name || 'Unnamed consumable',
      icon: global.icon || item.icon || '/images/consumables/default.png',
      quantity: item.quantity || 0,
      classes: item.classes || global.classes || [] 
    };
  });

  return (
    <div className="p-6 text-gray-200">
      <h1 className="text-3xl font-heading text-gold mb-2">{boss.name}</h1>

      {mergedConsumables.length > 0 && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-4 mb-2">Consumables</h2>
          <Consumables items={mergedConsumables} />
        </>
      )}

      {boss.spells?.length > 0 && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-6 mb-2">Abilities</h2>
          <SpellList spells={boss.spells} />
        </>
      )}

      {boss.strategy && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-6 mb-2">Strategy</h2>
          <p className="mb-6">{boss.strategy}</p>
        </>
      )}

      {boss.position?.length > 0 && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-6 mb-2">Positioning</h2>
          <PositionDiagram />
        </>
      )}

      <div className="mt-8 flex justify-between items-center">
        {prevBoss ? <BossCard boss={prevBoss} raidId={raidId} type={type} /> : <div className="w-40" />}
        <Link to={`/raid/${raidId}`} className="text-gold hover:underline">← Back to {raid.name}</Link>
        {nextBoss ? <BossCard boss={nextBoss} raidId={raidId} type={type} /> : <div className="w-40" />}
      </div>
    </div>
  );
}
