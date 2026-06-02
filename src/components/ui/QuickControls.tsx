import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { useHomeStore } from '../../store/useHomeStore';

export function QuickControls() {
  const { setCameraTarget, rooms, selectRoom } = useHomeStore();

  const roomIcons: Record<string, string> = {
    'Master Bedroom': '🛏️',
    'Bedroom 2': '🛏️',
    'Living Hall': '🛋️',
    'Kitchen': '🍳',
    'Bathroom': '🚿',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      className="fixed bottom-6 right-6 flex flex-col gap-2"
      style={{ zIndex: 950, pointerEvents: 'auto' }}
    >
      {/* Overview/Reset camera */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setCameraTarget('overview');
        }}
        title="Overview — Reset camera"
        className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-xs transition-all shadow-xl cursor-pointer select-none hover:scale-105 active:scale-95"
        style={{
          background: '#1A1A35',
          border: '1px solid #2A2A4A',
          color: '#00BCD4',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      >
        <Compass size={14} />
        Overview
      </button>

      {/* Room shortcuts */}
      {rooms.map((room) => {
        const activeCount = room.devices.filter((d) => d.isOn).length;
        return (
          <button
            key={room.id}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCameraTarget(room.name);
              selectRoom(room);
            }}
            title={room.name}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all shadow-xl cursor-pointer select-none hover:scale-105 active:scale-95"
            style={{
              background: activeCount > 0 ? '#0A1520' : '#0E0E22',
              border: `1px solid ${activeCount > 0 ? '#1E3A4A' : '#1E1E3A'}`,
              color: activeCount > 0 ? '#FFFFFF' : '#888899',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          >
            <span>{roomIcons[room.name] ?? '🏠'}</span>
            <span className="hidden xl:inline">{room.name.split(' ')[0]}</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: '#00BCD4', color: '#000', fontSize: '9px' }}>
                {activeCount}
              </span>
            )}
          </button>
        );
      })}
    </motion.div>
  );
}
