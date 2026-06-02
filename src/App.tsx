import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SceneCanvas } from './components/3d/SceneCanvas';
import { TopBar } from './components/ui/TopBar';
import { LeftSidebar } from './components/ui/LeftSidebar';
import { RightPanel } from './components/ui/RightPanel';
import { EnergyPanel } from './components/ui/EnergyPanel';
import { AutomationBuilder } from './components/ui/AutomationBuilder';
import { NotificationsPanel } from './components/ui/NotificationsPanel';
import { SettingsPage } from './components/ui/SettingsPage';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { QuickControls } from './components/ui/QuickControls';
import { useHomeStore } from './store/useHomeStore';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { closePanel } = useHomeStore();

  const handleLoadDone = useCallback(() => {
    setIsLoading(false);
  }, []);

  // ESC key closes panel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closePanel]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#060612', position: 'fixed', width: '100vw', height: '100vh' }}>
      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onDone={handleLoadDone} />}
      </AnimatePresence>

      {/* Main app (renders underneath loading screen) */}
      <AnimatePresence>
        {!isLoading && (
          <>
            {/* 3D Canvas — full screen background FIRST (behind everything) */}
            <div className="fixed inset-0" style={{ zIndex: 0, pointerEvents: 'none' }}>
              <SceneCanvas />
            </div>

            {/* TopBar - ONLY at top, NOT covering whole screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                zIndex: 50,
                pointerEvents: 'auto',
              }}
            >
              <TopBar />
            </motion.div>

            {/* Main Layout - Flexbox below TopBar */}
            <div
              style={{
                position: 'fixed',
                top: '60px',
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              {/* LeftSidebar */}
              <div style={{ width: '280px', zIndex: 40, pointerEvents: 'auto', position: 'relative' }}>
                <LeftSidebar />
              </div>

              {/* Center area for Energy/Automation panels */}
              <div style={{ flex: 1, zIndex: 45, pointerEvents: 'auto', position: 'relative' }}>
                <EnergyPanel />
                <AutomationBuilder />
              </div>

              {/* RightPanel */}
              <div style={{ zIndex: 50, pointerEvents: 'auto', position: 'relative' }}>
                <RightPanel />
              </div>
            </div>

            {/* Quick Controls - Bottom right */}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 30, pointerEvents: 'auto' }}>
              <QuickControls />
            </div>

            {/* Notifications Panel - Top right */}
            <div style={{ position: 'fixed', top: '68px', right: '14px', zIndex: 60, pointerEvents: 'auto' }}>
              <NotificationsPanel />
            </div>

            {/* Settings Modal - Center */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 65, pointerEvents: 'auto' }}>
              <SettingsPage />
            </div>

            {/* Hint text at bottom center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs pointer-events-none text-center px-4"
              style={{ color: '#444466', maxWidth: '600px', zIndex: 5 }}
            >
              <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                💡 <span className="font-semibold text-cyan-400">Tip:</span> Click any device in 3D to control it • Drag to rotate • Scroll to zoom • Press ESC to close panels
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
