import '../styles/theme.css';

export default function Items({ items }) {
  if (!items || !items.length) return null;

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

            {!item.unique && (
              <span className="text-gray-300 text-sm">x{item.quantity}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
