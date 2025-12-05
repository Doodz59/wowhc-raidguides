import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BossCard from '../components/BossCard';
import RaidMap from '../components/RaidMap';
import Consumables from '../components/Consumables';
import LinkifyText from "../components/LinkifyText";
import consumablesDataArray from '../data/consumables.json';
import Items from "../components/Items";
import itemsDataArray from "../data/items.json";

export default function Raid() {
  const { raidId } = useParams();
  const [raid, setRaid] = useState(null);
  const [loading, setLoading] = useState(true);

  const consumablesData = {};
  consumablesDataArray.forEach(c => {
    consumablesData[c.id] = c;
  });

  const itemsData = {};
  itemsDataArray.forEach(i => {
    itemsData[i.id] = i;
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    import(`../data/${raidId}.json`)
      .then(module => {
        if (!isMounted) return;
        setRaid(module.default);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        if (!isMounted) return;
        setRaid(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [raidId]);

  if (loading) return <div className="text-gray-400 p-4">Loading raid...</div>;
  if (!raid) return <div className="text-gray-400 p-4">Raid not found.</div>;

  // 🟡 Detection World Boss
  const isWorldBoss = raid.id === "world-boss";

  // 🟡 WORLD BOSS MODE : simple display only bosses + description
  if (isWorldBoss) {
    return (
      <div className="p-6 text-gray-200">

        <div className="p-6 text-gray-200 leading-relaxed text-justify space-y-4">
          <h1 className="text-3xl font-heading text-gold mb-4">{raid.name}</h1>
          <p className="mb-6">
            <LinkifyText text={raid.description} raid={raid} />
          </p>
        </div>

        {raid.bosses?.length > 0 && (
          <>
            <h2 className="text-2xl font-heading text-gold mt-6 mb-4">World Bosses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {raid.bosses.map(boss => (
                <BossCard key={boss.id} boss={boss} raidId={raid.id} type="boss" />
              ))}
            </div>
          </>
        )}

        <div className="mt-8">
          <Link to="/" className="text-gold hover:underline">← Back to Raids</Link>
        </div>
      </div>
    );
  }

  // 🟢 NORMAL RAID MODE
  const consumablesMap = {};
  const itemsMap = {};

  const addConsumables = (items = []) => {
    items?.forEach(item => {
      const global = consumablesData[item.id] || {};
      const key = item.id;

      const entry = {
        id: key,
        name: global.name || item.name || 'Unnamed consumable',
        icon: global.icon || item.icon || '/images/consumables/default.png',
        classes: item.classes || global.classes || [],
      };

      if (!consumablesMap[key]) {
        consumablesMap[key] = { ...entry, quantity: item.quantity || 0 };
      } else {
        consumablesMap[key].quantity += item.quantity || 0;

        const prevClasses = Array.isArray(consumablesMap[key].classes)
          ? consumablesMap[key].classes
          : [];
        const newClasses = Array.isArray(entry.classes)
          ? entry.classes
          : [];
        consumablesMap[key].classes = Array.from(new Set([...prevClasses, ...newClasses]));
      }
    });
  };

  const addItems = (items = []) => {
    items?.forEach(item => {
      const global = itemsData[item.id] || {};
      const key = item.id;

      const entry = {
        id: key,
        name: global.name || item.name || "Unnamed item",
        icon: global.icon || item.icon || "/images/items/default.png",
        unique: global.unique ?? item.unique ?? true,
      };

      if (entry.unique) {
        if (!itemsMap[key]) itemsMap[key] = { ...entry, quantity: 1 };
        return;
      }

      if (!itemsMap[key]) {
        itemsMap[key] = { ...entry, quantity: item.quantity || 0 };
      } else {
        itemsMap[key].quantity += item.quantity || 0;
      }
    });
  };

  // Global + bosses + trash
  addConsumables(raid.consumables);
  addItems(raid.items);

  const allBosses = [...(raid.bosses || []), ...(raid.trash || [])];
  allBosses.forEach(boss => {
    addConsumables(boss.consumables);
    addItems(boss.items);
  });

  const totalConsumables = Object.values(consumablesMap);

  return (
    <div className="p-6 text-gray-200">
      <div className="p-6 text-gray-200 leading-relaxed text-justify space-y-4">
        <h1 className="text-3xl font-heading text-gold mb-4">{raid.name}</h1>
        <p className="mb-6">
          <LinkifyText text={raid.description} raid={raid} />
        </p>
      </div>

      {totalConsumables.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3">Raid consumables</h2>
          <Consumables items={totalConsumables} />
        </div>
      )}

      {Object.values(itemsMap).length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Raid items</h2>
          <Items items={Object.values(itemsMap)} />
        </div>
      )}

      <h2 className="text-2xl font-heading text-gold mt-10 mb-4">Interactive Map</h2>
      <RaidMap raidId={raid.id} raid={raid} />

      {raid.bosses?.length > 0 && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-6 mb-4">Bosses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {raid.bosses.map(boss => (
              <BossCard key={boss.id} boss={boss} raidId={raid.id} type="boss" />
            ))}
          </div>
        </>
      )}

      {raid.trash?.length > 0 && (
        <>
          <h2 className="text-2xl font-heading text-gold mt-10 mb-4">Trash</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {raid.trash.map(trash => (
              <BossCard key={trash.id} boss={trash} raidId={raid.id} type="trash" />
            ))}
          </div>
        </>
      )}

      <div className="mt-8">
        <Link to="/" className="text-gold hover:underline">← Back to Raids</Link>
      </div>
    </div>
  );
}
