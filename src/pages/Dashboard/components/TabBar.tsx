import { Home, Calendar, DollarSign, Users } from "lucide-react";

export type TabId = "home" | "games" | "finance" | "team";

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "games", label: "Games", Icon: Calendar },
  { id: "finance", label: "Finance", Icon: DollarSign },
  { id: "team", label: "Team", Icon: Users },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
      {TABS.map(({ id, label, Icon }) => {
        const active = id === activeTab;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition ${
              active ? "text-green-400" : "text-white/35 hover:text-white/60"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
