import React, { useState } from 'react';
import { BookOpen, Users, Volume2, VolumeX, BarChart2, ShieldAlert, Award, FileSpreadsheet, Eye } from 'lucide-react';
import { StudentStats, BADGES } from '../types';

interface TeacherDashboardProps {
  stats: StudentStats;
  history: StudentStats['gameHistory'];
  onResetData: () => void;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  largeTextEnabled: boolean;
  onToggleLargeText: (enabled: boolean) => void;
}

export default function TeacherDashboard({
  stats,
  history,
  onResetData,
  onClose,
  soundEnabled,
  onToggleSound,
  largeTextEnabled,
  onToggleLargeText,
}: TeacherDashboardProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Group stats from history to compute aggregate classroom values
  const totalGames = history.length;
  
  // Compute category averages
  const categories = [
    { key: 'verb-tenses', label: 'Verb Tenses', totalKey: 'vt' },
    { key: 'subject-verb-agreement', label: 'Subject-Verb Agreement', totalKey: 'sva' },
    { key: 'comparatives-superlatives', label: 'Comparatives & Superlatives', totalKey: 'cs' },
    { key: 'prepositions', label: 'Prepositions', totalKey: 'prep' }
  ];

  const categoryAverages = categories.map(cat => {
    const topicGames = history.filter(h => h.topic === cat.key);
    const avgAccuracy = topicGames.length > 0 
      ? Math.round(topicGames.reduce((acc, curr) => acc + curr.accuracy, 0) / topicGames.length)
      : stats.accuracyByTopic[cat.key] 
        ? Math.round((stats.accuracyByTopic[cat.key].correct / Math.max(1, stats.accuracyByTopic[cat.key].total)) * 100)
        : 0;
    
    return {
      ...cat,
      avgAccuracy,
      gamesPlayed: topicGames.length + (stats.accuracyByTopic[cat.key] ? 1 : 0)
    };
  });

  const overallAccuracy = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.accuracy, 0) / history.length)
    : 0;

  const handleExportCSV = () => {
    if (history.length === 0) {
      alert("No results to export yet! Play a round first.");
      return;
    }

    const headers = ["Student Name", "Grammar Topic", "Score", "Accuracy (%)", "Level Reached", "Date Played"];
    const rows = history.map(h => [
      h.playerName,
      h.topic,
      h.score,
      h.accuracy,
      h.level,
      new Date(h.date).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `grammar_moles_results_${stats.playerName || 'class'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border-4 border-slate-700 overflow-hidden text-white shadow-2xl max-w-2xl w-full mx-auto" id="teacher_panel">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/15 rounded-xl border border-white/20 shadow-inner">
              <Users className="w-8 h-8 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                Teacher's Admin Board
              </h2>
              <p className="text-emerald-100 text-xs font-medium">Classroom analytics, audio control, visual accessibility and student results</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold uppercase transition duration-150"
          >
            Back
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Accessibility & Hardware Controls */}
        <div className="space-y-4">
          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-3.5">
            <h3 className="text-xs font-bold font-mono tracking-wider text-teal-400 uppercase">Accessibility Controls</h3>
            
            {/* Audio Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">Mute Classroom Game</p>
                <p className="text-[10px] text-slate-400">Silences retro synthesized sound effects instantly.</p>
              </div>
              <button
                onClick={() => onToggleSound(!soundEnabled)}
                className={`p-2 rounded-lg transition ${
                  soundEnabled 
                    ? 'bg-emerald-600/20 border border-emerald-500/50 text-emerald-400' 
                    : 'bg-red-600/20 border border-red-500/50 text-red-400'
                }`}
                id="btn_teacher_mute"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {/* Text size Toggle */}
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
              <div>
                <p className="text-xs font-bold text-slate-200">Large Readable Text</p>
                <p className="text-[10px] text-slate-400">Increases text sizes for classroom projectors / blackboards.</p>
              </div>
              <button
                onClick={() => onToggleLargeText(!largeTextEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  largeTextEnabled 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                {largeTextEnabled ? 'Large ON' : 'Normal'}
              </button>
            </div>
          </div>

          {/* Quick Classroom Statistics */}
          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold font-mono tracking-wider text-teal-400 uppercase">Grammar Performance</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-950/30 p-2.5 rounded-lg border border-slate-850">
                <div className="text-[10px] text-slate-400 font-mono">Sessions Logged</div>
                <div className="text-lg font-bold text-slate-200">{totalGames}</div>
              </div>
              <div className="bg-slate-950/30 p-2.5 rounded-lg border border-slate-850">
                <div className="text-[10px] text-slate-400 font-mono">Avg Accuracy</div>
                <div className="text-lg font-bold text-emerald-400">{overallAccuracy}%</div>
              </div>
            </div>

            <div className="space-y-1.5 mt-2">
              {categoryAverages.map(cat => (
                <div key={cat.key} className="text-xs">
                  <div className="flex justify-between text-slate-300 font-medium mb-0.5">
                    <span>{cat.label}</span>
                    <span className="font-bold text-teal-400">{cat.avgAccuracy}% ({cat.gamesPlayed} plays)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-teal-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${cat.avgAccuracy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Student Result Logs & Reset */}
        <div className="space-y-4">
          <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col h-[280px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold font-mono tracking-wider text-teal-400 uppercase flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1" /> Student Log Sheet
              </h3>
              <button 
                onClick={handleExportCSV}
                className="text-[10px] font-bold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
                title="Export classroom results to Excel/CSV file"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* List of rounds */}
            <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar text-xs">
              {history.length === 0 ? (
                <div className="text-slate-500 text-center py-12">
                  <p>No student results stored yet.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Play matches and enter names to populate logs.</p>
                </div>
              ) : (
                history.map((record) => (
                  <div key={record.id} className="p-2 bg-slate-900/60 rounded border border-slate-800/80 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200">{record.playerName}</span>
                      <span className="text-[10px] text-slate-500 ml-2">Lvl {record.level}</span>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {record.topic === 'mixed' ? 'Mixed Mode' : record.topic.replace('-', ' ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-emerald-400 font-bold">{record.accuracy}%</span>
                      <div className="text-[9px] text-slate-500 font-mono font-medium">{record.score} pts</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reset Administration Data */}
          <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl">
            {showConfirmReset ? (
              <div className="space-y-2 text-center">
                <p className="text-[11px] text-red-200 font-bold">⚠️ Warning: This will delete ALL student records, coin balances, scores, and shop unlocks!</p>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      onResetData();
                      setShowConfirmReset(false);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold"
                  >
                    Yes, Reset Game
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-red-200 flex items-center">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1 text-red-400" /> Administrative Reset
                  </p>
                  <p className="text-[10px] text-slate-400">Reset the local storage for the next class hour.</p>
                </div>
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="px-2.5 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded text-xs font-bold"
                >
                  Clear Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer statistics */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
        Designed for High School English labs. Offline friendly & safe.
      </div>
    </div>
  );
}
