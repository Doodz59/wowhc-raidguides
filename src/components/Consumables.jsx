import '../styles/theme.css';

export default function Consumables({ items }) {
  if (!items || !items.length) return null;

  const classIcons = {
    melee: '/images/icons/dps.png',
    tank: '/images/icons/tank.png',
    caster: '/images/icons/caster.png',
    healer: '/images/icons/healer.png',

  };

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item, index) => (
        <div key={index} className="boss-card flex items-center justify-between gap-4">
          <img
            src={item.icon}
            alt={item.name}
            className="w-12 h-12 object-cover rounded-md border border-gray-700 shadow-inner"
          />

          <div className="flex flex-col flex-1 ml-4 text-left">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <span className="text-gray-300 text-sm">x{item.quantity}</span>
          </div>

          <div className="flex gap-2">
            {item.classes?.map((cls) => (
              <img
                key={cls}
                src={classIcons[cls]}
                alt={cls}
                title={cls}
                className="w-6 h-6 rounded-full border border-yellow-500 shadow-md"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
