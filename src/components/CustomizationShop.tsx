import React, { useState } from 'react';
import { ShoppingBag, Coins, Sparkles, Check, Lock, Palette } from 'lucide-react';
import { AVATARS, HAMMERS, MOLES, BGS, TRAILS, CustomizationItem, StudentStats } from '../types';
import { playSound } from '../audio';

interface CustomizationShopProps {
  stats: StudentStats;
  onUpdateStats: (newStats: Partial<StudentStats>) => void;
  onClose: () => void;
}

export default function CustomizationShop({ stats, onUpdateStats, onClose }: CustomizationShopProps) {
  const [activeCategory, setActiveCategory] = useState<'avatar' | 'hammer' | 'mole' | 'bg' | 'trail'>('avatar');

  // Map category to static lists
  const getCategoryItems = (): CustomizationItem[] => {
    switch (activeCategory) {
      case 'avatar': return AVATARS;
      case 'hammer': return HAMMERS;
      case 'mole': return MOLES;
      case 'bg': return BGS;
      case 'trail': return TRAILS;
      default: return [];
    }
  };

  const isPurchased = (itemId: string): boolean => {
    // Default items (cost 0) are automatically purchased
    const item = [...AVATARS, ...HAMMERS, ...MOLES, ...BGS, ...TRAILS].find(i => i.id === itemId);
    if (item && item.cost === 0) return true;
    return stats.purchasedItems.includes(itemId);
  };

  const isEquipped = (itemId: string): boolean => {
    return (
      stats.equippedAvatar === itemId ||
      stats.equippedHammer === itemId ||
      stats.equippedMole === itemId ||
      stats.equippedBg === itemId
    );
  };

  const handlePurchaseOrEquip = (item: CustomizationItem) => {
    playSound('click');
    const purchased = isPurchased(item.id);

    if (purchased) {
      // Equip item
      const update: Partial<StudentStats> = {};
      if (item.type === 'avatar') update.equippedAvatar = item.id;
      else if (item.type === 'hammer') update.equippedHammer = item.id;
      else if (item.type === 'mole') update.equippedMole = item.id;
      else if (item.type === 'bg') update.equippedBg = item.id;
      // Note: trail is visual-only and equipped by default if selected or can be handled globally
      onUpdateStats(update);
    } else {
      // Check if user has enough coins
      if (stats.coins >= item.cost) {
        playSound('coin');
        const updatedPurchased = [...stats.purchasedItems, item.id];
        const update: Partial<StudentStats> = {
          coins: stats.coins - item.cost,
          purchasedItems: updatedPurchased
        };

        // Auto equip upon purchase
        if (item.type === 'avatar') update.equippedAvatar = item.id;
        else if (item.type === 'hammer') update.equippedHammer = item.id;
        else if (item.type === 'mole') update.equippedMole = item.id;
        else if (item.type === 'bg') update.equippedBg = item.id;

        // Check for Style Icon badge (unlock 5 or more custom shop items)
        // Default items don't count towards the 5 purchased items
        const nonFreePurchasedCount = updatedPurchased.filter(id => {
          const matchedItem = [...AVATARS, ...HAMMERS, ...MOLES, ...BGS, ...TRAILS].find(i => i.id === id);
          return matchedItem && matchedItem.cost > 0;
        }).length;

        if (nonFreePurchasedCount >= 5 && !stats.badges.includes('customizer')) {
          update.badges = [...stats.badges, 'customizer'];
        }

        onUpdateStats(update);
      } else {
        // Play wrong sound to indicate not enough coins
        playSound('wrong');
        alert("Not enough coins! Play more levels to earn coins. 🪙");
      }
    }
  };

  const categories = [
    { id: 'avatar', name: 'Avatars', icon: '🧑‍🎓' },
    { id: 'hammer', name: 'Hammers & Tools', icon: '🔨' },
    { id: 'mole', name: 'Mole Skins', icon: '🦦' },
    { id: 'bg', name: 'Garden Backgrounds', icon: '🌳' },
    { id: 'trail', name: 'Hit Trails', icon: '✨' }
  ];

  return (
    <div className="glass-panel rounded-2xl border-2 border-emerald-800/80 overflow-hidden text-white shadow-2xl max-w-2xl w-full mx-auto" id="shop_panel">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/15 rounded-xl border border-white/20 shadow-inner">
              <ShoppingBag className="w-8 h-8 text-yellow-300 animate-bounce-small" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                Rigo's Toy & Skin Shop
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </h2>
              <p className="text-rose-100 text-xs font-medium">Use earned coins to unlock customizable tools, avatars, backgrounds, and trail effects!</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold uppercase transition duration-150 shadow"
          >
            Back
          </button>
        </div>

        {/* Currency Display */}
        <div className="mt-4 flex items-center justify-between bg-black/30 backdrop-blur px-4 py-2 rounded-xl border border-white/10 w-fit">
          <div className="flex items-center space-x-2 text-yellow-400 font-extrabold font-mono text-lg">
            <Coins className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{stats.coins}</span>
          </div>
          <span className="text-white/70 text-[10px] uppercase tracking-wider font-mono ml-3 font-semibold">Coins Available</span>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/50 p-2 gap-1.5 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { playSound('click'); setActiveCategory(cat.id as any); }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat.id 
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="p-5 max-h-[350px] overflow-y-auto custom-scrollbar bg-slate-950/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {getCategoryItems().map((item) => {
            const purchased = isPurchased(item.id);
            const equipped = isEquipped(item.id);

            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl flex items-center justify-between transition border ${
                  equipped 
                    ? 'bg-rose-500/10 border-rose-500/50 ring-1 ring-rose-500/20' 
                    : purchased 
                      ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/60 hover:border-slate-600' 
                      : 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/50'
                }`}
              >
                {/* Visual Icon and Details */}
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-xl bg-slate-950 border border-slate-800/50 flex items-center justify-center text-2xl shadow-inner relative overflow-hidden`}>
                    {/* Background indicator block if item type is background */}
                    {item.type === 'bg' && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.visual} opacity-60`}></div>
                    )}
                    <span className="relative z-10">{item.visual}</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                      {item.name}
                      {equipped && (
                        <span className="text-[9px] bg-rose-500 text-white px-1 py-0.5 rounded uppercase font-mono font-bold tracking-tight scale-90">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed max-w-[180px]">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Purchase or Equip Button */}
                <div>
                  <button
                    onClick={() => handlePurchaseOrEquip(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                      equipped
                        ? 'bg-rose-600 text-white cursor-default'
                        : purchased
                          ? 'bg-slate-700 text-white hover:bg-slate-600'
                          : stats.coins >= item.cost
                            ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-md shadow-yellow-500/10'
                            : 'bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {equipped ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Equipped</span>
                      </>
                    ) : purchased ? (
                      <span>Equip</span>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-slate-950 opacity-60" />
                        <span>{item.cost}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer statistics */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div>
          Unlocked: <span className="text-slate-300 font-bold">{stats.purchasedItems.length + 5}</span> cosmetics
        </div>
        <div>
          Earn more coins in <b>Arcade</b> and <b>Mission</b> rounds!
        </div>
      </div>
    </div>
  );
}
