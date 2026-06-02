import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useHomeStore } from '../../store/useHomeStore';
import { DeviceControlPanel } from './DeviceControlPanel';
import { RoomControlPanel } from './RoomControlPanel';

export function RightPanel() {
  const { isPanelOpen, panelType, selectedDevice, selectedRoom, closePanel } = useHomeStore();

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop blur overlay */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closePanel();
            }}
            className="fixed inset-0 cursor-pointer"
            style={{
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(2px)',
              zIndex: 820,
              pointerEvents: 'auto',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-[60px] bottom-0 flex flex-col overflow-hidden"
            style={{
              width: '320px',
              background: 'linear-gradient(180deg, #0D0D20 0%, #0A0A1A 100%)',
              borderLeft: '1px solid #1E1E3A',
              backdropFilter: 'blur(20px)',
              zIndex: 850,
              pointerEvents: 'auto',
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid #1E1E3A' }}>
              <div>
                <div className="text-white font-bold">
                  {panelType === 'device' ? selectedDevice?.name : selectedRoom?.name}
                </div>
                <div className="text-xs" style={{ color: '#888899' }}>
                  {panelType === 'device' ? 'Device Control' : 'Room Control'}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closePanel();
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer select-none hover:scale-110 active:scale-90"
                style={{ background: '#1A1A35', border: '1px solid #2A2A4A', cursor: 'pointer', pointerEvents: 'auto' }}
              >
                <X size={16} style={{ color: '#AAAACC' }} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4" style={{ pointerEvents: 'auto' }}>
              {panelType === 'device' && selectedDevice && (
                <DeviceControlPanel device={selectedDevice} />
              )}
              {panelType === 'room' && selectedRoom && (
                <RoomControlPanel room={selectedRoom} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
