import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SpellList from "../components/SpellList";
import PositionDiagram from "../components/PositionDiagram";
import BossCard from "../components/BossCard";
import Consumables from "../components/Consumables";
import consumablesDataArray from "../data/consumables.json";

export default function Boss() {
  const { raidId, type, bossId } = useParams();
  const [raid, setRaid] = useState(null);
  const [boss, setBoss] = useState(null);
  const [bossIndex, setBossIndex] = useState(-1);

  const consumablesData = {};
  consumablesDataArray.forEach((c) => {
    consumablesData[c.id] = c;
  });

  useEffect(() => {
    let isMounted = true;

    import(`../data/${raidId}.json`)
      .then((module) => {
        if (!isMounted) return;
        const raidData = module.default;
        const list = type === "trash" ? raidData.trash || [] : raidData.bosses || [];
        const index = list.findIndex((b) => b.id === bossId);

        setRaid(raidData);
        setBoss(index !== -1 ? list[index] : null);
        setBossIndex(index);

        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.error(err);
        if (!isMounted) return;
        setRaid(null);
        setBoss(null);
        setBossIndex(-1);
      });

    return () => {
      isMounted = false;
    };
  }, [raidId, type, bossId]);

  if (!raid || !boss) return <div className="text-gray-400 p-4">Boss non trouvé.</div>;

  const list = type === "trash" ? raid.trash || [] : raid.bosses || [];
  const prevBoss = bossIndex > 0 ? list[bossIndex - 1] : null;
  const nextBoss = bossIndex >= 0 && bossIndex < list.length - 1 ? list[bossIndex + 1] : null;

  const mergedConsumables = (boss.consumables || []).map((item) => {
    const global = consumablesData[item.id] || {};
    return {
      id: item.id,
      name: global.name || item.name || "Unnamed consumable",
      icon: global.icon || item.icon || "/images/consumables/default.png",
      quantity: item.quantity || 0,
      classes: item.classes || global.classes || [],
    };
  });

  return (
    <div className="p-6 text-gray-200 overflow-x-hidden">
  
      <h1 className="text-3xl font-heading text-gold mb-2">{boss.name}</h1>
    
      {mergedConsumables.length > 0 && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-4 mb-2">Consumables</h2>
          <Consumables items={mergedConsumables} />
        </>
      )}

      {boss.spells?.length > 0 && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-6 mb-2">
            {boss.name}'s Abilities
          </h2>
          <SpellList spells={boss.spells} />
        </>
      )}
 
      {boss.adds?.length > 0 &&
        boss.adds.map((add, i) => (
          <div key={i}>
            <h2 className="text-2xl font-heading text-yellow-400 mt-6 mb-2">
              {add.name}'s Abilities
            </h2>
            <SpellList spells={add.spells || []} />
          </div>
        ))}

         {boss.strategy && (
        <>
          <h2 className="text-2xl  font-heading text-gold mt-6 mb-2">Strategy</h2>
          <p className="mb-6 whitespace-pre-line">{boss.strategy}</p>
        </>
      )}
{boss.roles?.length > 0 && (
  <>
    <h2 className="text-2xl font-heading text-gold mt-6 mb-4">Role Responsibilities</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {boss.roles.map((role, index) => {
        const classColors = {
          Hunter: 'text-green-400',
          Priest: 'text-blue-300',
          Warrior: 'text-red-500',
          Mage: 'text-sky-400',
          Rogue: 'text-yellow-300',
          Warlock: 'text-purple-400',
          Druid: 'text-orange-400',
          Paladin: 'text-pink-300',
          Shaman: 'text-cyan-400',
        };

        return (
          <div
            key={index}
            className="flex flex-col bg-gray-800/70 rounded-xl p-3 shadow-lg border border-gray-700 hover:border-yellow-400 transition-colors"
          >
            <div className="flex flex-wrap items-center mb-2">
              {role.classes.map((cls) => (
                <div key={cls} className="flex items-center mr-3 mb-2">
                  <img
                    src={`/images/icons/${cls.toLowerCase()}.png`}
                    alt={cls}
                    className="w-8 h-8 mr-2 rounded-full border border-gray-600"
                  />
                  <span className={`${classColors[cls] || 'text-gold'} font-semibold text-lg`}>
                    {cls}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-gray-300 text-sm">{role.desc}</p>
          </div>
        );
      })}
    </div>
  </>
)}

      {boss.position?.length > 0 && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-6 mb-2">Positioning</h2>
          <PositionDiagram />
        </>
      )}
      
      <div className="mt-8 flex justify-between items-center">
        {prevBoss ? (
          <BossCard boss={prevBoss} raidId={raidId} type={type} />
        ) : (
          <div className="w-40" />
        )}
        <Link to={`/raid/${raidId}`} className="text-gold hover:underline">
          ← Back to {raid.name}
        </Link>
        {nextBoss ? (
          <BossCard boss={nextBoss} raidId={raidId} type={type} />
        ) : (
          <div className="w-40" />
        )}
      </div>
    </div>
  );
}
