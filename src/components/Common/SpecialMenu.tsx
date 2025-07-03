import React, { useState, useEffect } from 'react';
import { X, Star, Zap, Crown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpecialMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  rarity: 'legendary' | 'epic' | 'rare';
  power: string;
}

interface SpecialMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpecialMenu: React.FC<SpecialMenuProps> = ({ isOpen, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<SpecialMenuItem | null>(null);

  const specialItems: SpecialMenuItem[] = [
    {
      id: 'jedi-elixir',
      name: 'Jedi Master\'s Elixir',
      description: 'A mystical blue beverage that enhances focus and clarity. Infused with rare galactic herbs.',
      price: 299,
      image_url: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg',
      rarity: 'legendary',
      power: '+50 Focus, +30 Wisdom'
    },
    {
      id: 'sith-feast',
      name: 'Dark Lord\'s Feast',
      description: 'A powerful meal that grants strength and determination. Prepared with ancient Sith recipes.',
      price: 499,
      image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      rarity: 'legendary',
      power: '+100 Strength, +25 Dark Energy'
    },
    {
      id: 'force-crystal-cake',
      name: 'Force Crystal Cake',
      description: 'A shimmering dessert that sparkles with the power of the Force. Extremely rare and delicious.',
      price: 399,
      image_url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
      rarity: 'epic',
      power: '+75 Force Sensitivity, +40 Joy'
    },
    {
      id: 'rebel-ration',
      name: 'Rebel Alliance Ration',
      description: 'A hearty meal that boosts morale and endurance. Favored by freedom fighters across the galaxy.',
      price: 199,
      image_url: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
      rarity: 'rare',
      power: '+60 Endurance, +35 Morale'
    },
    {
      id: 'droid-oil-smoothie',
      name: 'Droid Oil Smoothie',
      description: 'A metallic-tasting smoothie that enhances technical abilities. Not actually made from droid oil.',
      price: 149,
      image_url: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg',
      rarity: 'rare',
      power: '+45 Tech Skills, +20 Logic'
    },
    {
      id: 'cantina-special',
      name: 'Mos Eisley Cantina Special',
      description: 'The legendary drink that started it all. A mysterious concoction with unknown effects.',
      price: 777,
      image_url: 'https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg',
      rarity: 'legendary',
      power: '??? Mystery Effect ???'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-5 h-5" />;
      case 'epic': return <Zap className="w-5 h-5" />;
      case 'rare': return <Star className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto galactic-card rounded-2xl p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  🤖 Secret Galactic Menu
                </h2>
                <p className="text-gray-300">
                  Exclusive items discovered by our droid friend. These legendary foods grant special powers!
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Special Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="special-menu-item rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Rarity Badge */}
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-2 right-2 bg-gradient-to-r ${getRarityColor(item.rarity)} px-3 py-1 rounded-full flex items-center space-x-1`}>
                      {getRarityIcon(item.rarity)}
                      <span className="text-xs font-bold text-white uppercase">{item.rarity}</span>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                      <span className="text-yellow-400 font-bold">₹{item.price}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-blue-400 font-medium">
                        {item.power}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-yellow-400">Special</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fun Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center p-6 bg-gradient-to-r from-royal-900/30 to-sith-900/30 rounded-xl border border-royal-500/20"
            >
              <div className="text-2xl mb-2">🌟</div>
              <p className="text-gray-300 text-sm">
                <strong className="text-royal-400">Easter Egg Unlocked!</strong> You've discovered the secret droid menu. 
                These items don't actually exist, but wouldn't it be cool if they did? 
                The droid will remember you found this! 🤖✨
              </p>
            </motion.div>
          </motion.div>

          {/* Item Detail Modal */}
          <AnimatePresence>
            {selectedItem && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-4 bg-black/90 backdrop-blur-sm rounded-2xl p-8 flex items-center justify-center"
                onClick={() => setSelectedItem(null)}
              >
                <div className="max-w-md w-full galactic-card rounded-xl p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${getRarityColor(selectedItem.rarity)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {getRarityIcon(selectedItem.rarity)}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedItem.name}</h3>
                  <p className="text-gray-300 mb-4">{selectedItem.description}</p>
                  <div className="text-blue-400 font-medium mb-4">{selectedItem.power}</div>
                  <div className="text-2xl font-bold text-yellow-400 mb-4">₹{selectedItem.price}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('This is just a fun easter egg! These items aren\'t real... or are they? 🤖');
                    }}
                    className="royal-button px-6 py-2 rounded-lg text-white font-medium"
                  >
                    Order (Just Kidding!)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpecialMenu;