import React, { useState } from 'react';
import { CLOAK_PROFILES, applyCloak, triggerPanicRedirect } from '../utils/cloak.js';
import {
  X,
  EyeOff,
  AlertTriangle,
  ExternalLink,
  Keyboard,
  Check
} from 'lucide-react';

export const CloakModal = ({
  isOpen,
  onClose,
  activeProfile,
  onSelectProfile,
  panicKey,
  onSetPanicKey,
  panicUrl,
  onSetPanicUrl,
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [isListeningForKey, setIsListeningForKey] = useState(false);

  if (!isOpen) return null;

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const customProfile = {
      id: 'custom-' + Date.now(),
      name: 'Custom Disguise',
      title: customTitle.trim(),
      iconSvg: activeProfile.iconSvg
    };
    applyCloak(customProfile);
    onSelectProfile(customProfile);
    onClose();
  };

  const handleKeyCapture = (e) => {
    if (isListeningForKey) {
      e.preventDefault();
      onSetPanicKey(e.key);
      setIsListeningForKey(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Stealth Tab Cloak</h2>
              <p className="text-xs text-slate-400">Mask browser tab title & favicon to avoid detection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-6 py-4 pr-1">
          {/* Preset Cloaks */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Preset Disguises</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CLOAK_PROFILES.map((profile) => {
                const isActive = activeProfile?.id === profile.id;
                return (
                  <button
                    key={profile.id}
                    onClick={() => {
                      applyCloak(profile);
                      onSelectProfile(profile);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={profile.iconSvg} alt="" className="w-5 h-5 shrink-0 object-contain" />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-white truncate">{profile.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{profile.title}</div>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Cloak Form */}
          <form onSubmit={handleApplyCustom} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <label className="block text-xs font-semibold text-slate-300">Custom Tab Title</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Research Notes - Biology Ch. 4"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                Apply Custom
              </button>
            </div>
          </form>

          {/* Panic Key System */}
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-300">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Instant Panic Button</h3>
            </div>
            <p className="text-xs text-slate-300">
              Pressing the Panic Key anytime on this site immediately redirects to your decoy classroom or search page.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Panic Hotkey</label>
                <div
                  tabIndex={0}
                  onKeyDown={handleKeyCapture}
                  onClick={() => setIsListeningForKey(true)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-center cursor-pointer text-indigo-300 flex items-center justify-center gap-2"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>{isListeningForKey ? 'Press any key...' : `Key: [ ${panicKey} ]`}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Redirect URL</label>
                <input
                  type="url"
                  value={panicUrl}
                  onChange={(e) => onSetPanicUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => triggerPanicRedirect(panicUrl)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Panic Redirect Now</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
