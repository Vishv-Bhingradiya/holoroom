import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Home, Zap, Play, CheckCircle, Loader, X, ChevronRight } from 'lucide-react';
import { useHomeStore } from '../../store/useHomeStore';
import { SCENES } from '../../data/scenes';
import { useScenePlayer } from '../../hooks/useScenePlayer';

type Tab = 'rooms' | 'scenes';

export function LeftSidebar() {
  const [tab, setTab] = useState<Tab>('rooms');
  const {
    rooms,
    activeScene,
    isPlayingScene,
    sceneStep,
    sceneProgress,
    isEnergyPanelOpen,
    isAutomationOpen,
    toggleEnergyPanel,
    toggleAutomation,
    selectRoom,
    setCameraTarget,
  } = useHomeStore();

  const { playScene, cancelScene } = useScenePlayer();

  const totalActiveDevices = rooms.reduce(
    (acc, r) => acc + r.devices.filter((d) => d.isOn).length,
    0
  );

  return (
    <div
      className="fixed left-0 top-[60px] bottom-0 w-[280px] flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0E0E22 0%, #0A0A1A 100%)',
        borderRight: '1px solid #1E1E3A',
        zIndex: 900,
        pointerEvents: 'auto',
      }}
    >
      {/* Tab switcher */}
      <div className="flex p-2 gap-1" style={{ borderBottom: '1px solid #1E1E3A' }}>
        {(['rooms', 'scenes'] as Tab[]).map((t) => (
          <button
            key={t}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTab(t);
            }}
            className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 cursor-pointer hover:brightness-110 active:brightness-90"
            style={{
              background: tab === t ? '#00BCD4' : '#1A1A35',
              color: tab === t ? '#000' : '#AAAACC',
              border: `1px solid ${tab === t ? '#00BCD4' : '#2A2A4A'}`,
              pointerEvents: 'auto',
            }}
          >
            {t === 'rooms' ? '🏠 Rooms' : '✨ Scenes'}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
        <AnimatePresence mode="wait">
          {tab === 'rooms' ? (
            <div
              className="p-3 space-y-2"
              style={{ pointerEvents: 'auto' }}
            >
              {/* Overview button */}
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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer select-none hover:brightness-110 active:brightness-90"
                style={{ background: '#1A1A35', border: '1px solid #2A2A4A', cursor: 'pointer', pointerEvents: 'auto' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00BCD4, #0088A8)' }}>
                  <Home size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">Overview</div>
                  <div className="text-xs" style={{ color: '#888899' }}>{totalActiveDevices} devices active</div>
                </div>
                <ChevronRight size={14} className="ml-auto" style={{ color: '#444466' }} />
              </button>

              {/* Room list */}
              {rooms.map((room) => {
                const activeCount = room.devices.filter((d) => d.isOn).length;
                const totalCount = room.devices.length;
                const pct = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;
                const roomColors: Record<string, string> = {
                  'Master Bedroom': '#7B68EE',
                  'Bedroom 2': '#20C997',
                  'Living Hall': '#00BCD4',
                  Kitchen: '#FF8C42',
                  Bathroom: '#00E5FF',
                };
                const roomColor = roomColors[room.name] ?? '#00BCD4';

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
                      selectRoom(room);
                      setCameraTarget(room.name);
                    }}
                    className="w-full rounded-xl p-3 transition-all select-none text-left cursor-pointer hover:brightness-110 active:brightness-90"
                    style={{ background: '#131328', border: '1px solid #1E1E3A', cursor: 'pointer', pointerEvents: 'auto' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: roomColor }} />
                        <span className="text-white text-sm font-medium">{room.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold" style={{ color: activeCount > 0 ? '#00FF88' : '#444466' }}>
                          {activeCount}/{totalCount}
                        </span>
                        <span className="text-xs" style={{ color: '#444466' }}>on</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1A1A35' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          borderRadius: '100%',
                          background: `linear-gradient(90deg, ${roomColor}, ${roomColor}AA)`,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>

                    {/* Temperature */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: '#555577' }}>
                        🌡️ {room.temperature}°C
                      </span>
                      <span className="text-xs" style={{ color: '#555577' }}>
                        {room.devices.reduce((s, d) => s + (d.isOn ? d.energyWatts : 0), 0)}W
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              className="p-3 space-y-2"
              style={{ pointerEvents: 'auto' }}
            >
              {/* Active scene progress */}
              <AnimatePresence>
                {isPlayingScene && activeScene && (
                  <div
                    className="rounded-xl p-3 mb-2"
                    style={{ background: '#001520', border: '1px solid #00BCD4' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Loader size={14} className="animate-spin" style={{ color: '#00BCD4' }} />
                        <span className="text-sm font-semibold" style={{ color: '#00BCD4' }}>
                          {SCENES.find((s) => s.id === activeScene)?.emoji}{' '}
                          {SCENES.find((s) => s.id === activeScene)?.name}
                        </span>
                      </div>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          cancelScene();
                        }}
                        style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                        className="hover:brightness-110 active:brightness-90 transition-all"
                      >
                        <X size={14} style={{ color: '#666688', cursor: 'pointer' }} />
                      </button>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1A1A35' }}>
                      <div
                        style={{
                          width: `${sceneProgress}%`,
                          height: '100%',
                          borderRadius: '100%',
                          background: 'linear-gradient(90deg, #00BCD4, #00E5FF)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#888899' }}>
                      Step {sceneStep} of {SCENES.find((s) => s.id === activeScene)?.steps.length}...
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {SCENES.map((scene) => {
                const isActive = activeScene === scene.id;

                return (
                  <div
                    key={scene.id}
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: isActive ? '#001015' : '#131328',
                      border: `1px solid ${isActive ? scene.color : '#1E1E3A'}`,
                      boxShadow: isActive ? `0 0 12px ${scene.color}33` : 'none',
                      pointerEvents: 'auto',
                    }}
                  >
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{scene.emoji}</span>
                        <div>
                          <div className="text-white text-sm font-bold">{scene.name}</div>
                          <div className="text-xs" style={{ color: '#666688' }}>{scene.description}</div>
                        </div>
                        {isActive && !isPlayingScene && (
                          <CheckCircle size={14} className="ml-auto" style={{ color: scene.color }} />
                        )}
                      </div>

                      <div className="text-xs mb-2" style={{ color: '#444466' }}>
                        {scene.deviceCount} devices · {scene.steps.length} steps
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            playScene(scene.id, false);
                          }}
                          disabled={isPlayingScene}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer select-none hover:brightness-110 active:brightness-90"
                          style={{
                            background: '#1A1A35',
                            border: '1px solid #2A2A4A',
                            color: '#AAAACC',
                            opacity: isPlayingScene ? 0.5 : 1,
                            cursor: isPlayingScene ? 'not-allowed' : 'pointer',
                            pointerEvents: 'auto',
                          }}
                        >
                          <Play size={10} />
                          Preview
                        </button>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            playScene(scene.id, true);
                          }}
                          disabled={isPlayingScene}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer select-none hover:brightness-110 active:brightness-90"
                          style={{
                            background: isPlayingScene ? '#1A1A35' : scene.color,
                            color: isPlayingScene ? '#666688' : '#000',
                            opacity: isPlayingScene ? 0.5 : 1,
                            cursor: isPlayingScene ? 'not-allowed' : 'pointer',
                            pointerEvents: 'auto',
                          }}
                        >
                          {isActive && isPlayingScene ? (
                            <><Loader size={10} className="animate-spin" /> Running</>
                          ) : (
                            <><CheckCircle size={10} /> Activate</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom actions */}
      <div className="p-3 space-y-2" style={{ borderTop: '1px solid #1E1E3A', pointerEvents: 'auto' }}>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleEnergyPanel();
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer select-none hover:brightness-110 active:brightness-90"
          style={{
            background: isEnergyPanelOpen ? '#001510' : '#131328',
            border: `1px solid ${isEnergyPanelOpen ? '#00FF88' : '#1E1E3A'}`,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          <Zap size={16} style={{ color: isEnergyPanelOpen ? '#00FF88' : '#666688' }} />
          <span className="text-sm font-medium" style={{ color: isEnergyPanelOpen ? '#00FF88' : '#AAAACC' }}>
            Energy Monitor
          </span>
        </button>

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleAutomation();
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer select-none hover:brightness-110 active:brightness-90"
          style={{
            background: isAutomationOpen ? '#150015' : '#131328',
            border: `1px solid ${isAutomationOpen ? '#9B59B6' : '#1E1E3A'}`,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          <span className="text-base">⚡</span>
          <span className="text-sm font-medium" style={{ color: isAutomationOpen ? '#9B59B6' : '#AAAACC' }}>
            Automation Rules
          </span>
        </button>
      </div>
    </div>
  );
}
