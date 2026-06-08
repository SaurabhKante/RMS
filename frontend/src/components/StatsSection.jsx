import {
  Users,
  UtensilsCrossed,
  Clock3,
  LayoutGrid,
} from "lucide-react";

const StatsSection = ({ tables = [] }) => {
  const totalTables = tables.length;

  const occupiedTables = tables.filter(
    (table) => table.status === "Occupied"
  ).length;

  const reservedTables = tables.filter(
    (table) => table.status === "Reserved"
  ).length;

  const occupancyRate =
    totalTables > 0
      ? Math.round((occupiedTables / totalTables) * 100)
      : 0;

  const stats = [
    {
      title: "Occupancy",
      value: `${occupancyRate}%`,
      icon: Users,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-700",
    },
    {
      title: "Occupied Tables",
      value: occupiedTables,
      icon: UtensilsCrossed,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Reservations",
      value: reservedTables,
      icon: Clock3,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Total Tables",
      value: totalTables,
      icon: LayoutGrid,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <Icon
                  size={24}
                  className={stat.iconColor}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsSection;