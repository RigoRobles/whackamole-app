import React, { useState } from 'react';
import { Trophy, Calendar, BookOpen, Star, Sparkles, Medal, Award, Search, RefreshCw } from 'lucide-react';
import { StudentStats } from '../types';

interface LeaderboardViewProps {
  history: StudentStats['gameHistory'];
  playerName: string;
  onClose: () => void;
  onClearHistory?: () => void;
}

export default function LeaderboardView({ history, playerName, onClose, onClearHistory }: LeaderboardViewProps) {
  const [activeTab, setActiveTab] = useState<'all-time' | 'today' | 'topic'>('all-time');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Local fake/seed records to make the leaderboard look lively and active, mixed with actual history
  const seedRecords = [
    { id: "seed_1", playerName: "Carlos (Pro)", score: 1450, accuracy: 100, topic: "verb-tenses", level: 8, date: new Date().toISOString() },
    { id: "seed_2", playerName: "Ana_S", score: 1120, accuracy: 92, topic: "subject-verb-agreement", level: 6, date: new Date().toISOString() },
    { id: "seed_3", playerName: "Teacher Rigo (Boss)", score: 2500, accuracy: 100, topic: "mixed", level: 8, date: new Date(Date.now() - 3600000).toISOString() },
    { id: "seed_4", playerName: "Luis_G", score: 980, accuracy: 85, topic: "prepositions", level: 4, date: new Date(Date.now() - 86400000).toISOString() },
    { id: "seed_5", playerName: "Maria_V", score: 1250, accuracy: 95, topic: "comparatives-superlatives", level: 7, date: new Date(Date.now() - 172800000).toISOString() },
    { id: "seed_6", playerName: "Mateo_R", score: 780, accuracy: 80, topic: "verb-tenses", level: 3, date: new Date(Date.now() - 259200000).toISOString() }
  ];

  // Combine real user history with seeded records
  const allRecords = [...history, ...seedRecords];

  // Filters
  const filteredRecords = allRecords.filter(record => {
    // Search filter
    const matchesSearch = record.playerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Topic filter
    const matchesTopic = selectedTopic === 'all' || record.topic === selectedTopic;

    // Time filter
    let matchesTime = true;
    if (activeTab === 'today') {
      const todayStr = new Date().toDateString();
      const recordStr = new Date(record.date).toDateString();
      matchesTime = todayStr === recordStr;
    }

    return matchesSearch && matchesTopic && matchesTime;
  });

  // Sort by score descending
  const sortedRecords = [...filteredRecords].sort((a, b) => b.score - a.score);

  const getTopicLabel = (topic: string) => {
    switch (topic) {
      case 'verb-tenses': return 'Verb Tenses';
      case 'subject-verb-agreement': return 'Subject-Verb';
      case 'comparatives-superlatives': return 'Comparatives';
      case 'prepositions': return 'Prepositions';
      case 'mixed': return 'Mixed Mode';
      default: return topic;
    }
  };

  return (
    <div className="glass-panel rounded-2xl border-2 border-emerald-800/80 overflow-hidden text-white shadow-2xl max-w-2xl w-full mx-auto" id="leaderboard_panel">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/20 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/15 rounded-xl border border-white/20 shadow-inner">
              <Trophy className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                Grammar Arena Hall of Fame
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </h2>
              <p className="text-indigo-100 text-xs font-medium">Top student scores from current and past classroom sessions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold uppercase transition duration-150"
            id="btn_close_leaderboard"
          >
            Back
          </button>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-3">
        {/* Row 1: Time Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1.5 bg-slate-850 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => { setActiveTab('all-time'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${activeTab === 'all-time' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              All Time
            </button>
            <button
              onClick={() => { setActiveTab('today'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${activeTab === 'today' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Today
            </button>
            <button
              onClick={() => { setActiveTab('topic'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${activeTab === 'topic' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              By Topic
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono">Current User: <b className="text-indigo-400">{playerName || 'Guest'}</b></span>
          </div>
        </div>

        {/* Row 2: Search & Select Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Topic Selector */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <BookOpen className="w-4 h-4" />
            </span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
            >
              <option value="all">All Grammar Topics</option>
              <option value="verb-tenses">Verb Tenses</option>
              <option value="subject-verb-agreement">Subject-Verb Agreement</option>
              <option value="comparatives-superlatives">Comparatives & Superlatives</option>
              <option value="prepositions">Prepositions</option>
              <option value="mixed">Mixed Mode</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scrollbar bg-slate-950/20">
        {sortedRecords.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-3 stroke-[1.5]" />
            <p className="text-sm">No scores found matching your filters.</p>
            <p className="text-xs text-slate-600 mt-1">Play a match to post your very first arcade record!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedRecords.map((record, index) => {
              const isCurrentUser = record.playerName.split(" ")[0] === playerName && !record.id.startsWith('seed_');
              const isFirst = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;

              let rankBadge = null;
              let rowStyle = "bg-slate-900/50 border border-slate-800/60";
              
              if (isFirst) {
                rankBadge = <Medal className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
                rowStyle = "bg-yellow-500/10 border-2 border-yellow-500/50";
              } else if (isSecond) {
                rankBadge = <Medal className="w-5 h-5 text-slate-300 fill-slate-300" />;
                rowStyle = "bg-slate-400/10 border border-slate-400/40";
              } else if (isThird) {
                rankBadge = <Medal className="w-5 h-5 text-amber-600 fill-amber-700" />;
                rowStyle = "bg-amber-700/10 border border-amber-700/30";
              }

              if (isCurrentUser) {
                rowStyle += " ring-2 ring-indigo-500 bg-indigo-500/5";
              }

              return (
                <div 
                  key={record.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition hover:bg-slate-800/40 ${rowStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Rank indicator */}
                    <div className="w-7 h-7 flex items-center justify-center font-bold text-xs font-mono">
                      {rankBadge || <span className="text-slate-400">#{index + 1}</span>}
                    </div>

                    {/* Name / Category */}
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-sm font-bold ${isCurrentUser ? 'text-indigo-300' : 'text-slate-100'}`}>
                          {record.playerName}
                        </span>
                        {isCurrentUser && (
                          <span className="bg-indigo-600/30 border border-indigo-500/50 text-indigo-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase font-mono tracking-tight">
                            You
                          </span>
                        )}
                        {record.id.startsWith('seed_') && (
                          <span className="bg-slate-800 text-slate-400 text-[8px] px-1.5 py-0.5 rounded font-mono">
                            NPC
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-400">
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-medium">
                          {getTopicLabel(record.topic)}
                        </span>
                        <span>•</span>
                        <span>Level {record.level}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-0.5 text-slate-500" />
                          {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score & Accuracy metrics */}
                  <div className="text-right flex items-center space-x-4">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Accuracy</div>
                      <div className={`text-xs font-bold ${record.accuracy >= 90 ? 'text-emerald-400' : record.accuracy >= 75 ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {record.accuracy}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Score</div>
                      <div className="text-md font-extrabold text-yellow-400 font-display tracking-tight flex items-center justify-end">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                        {record.score}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer statistics */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div>
          Total Records: <span className="text-slate-200 font-bold">{allRecords.length}</span> (User: {history.length})
        </div>
        {history.length > 0 && onClearHistory && (
          <button 
            onClick={onClearHistory}
            className="text-[10px] text-slate-500 hover:text-red-400 transition"
          >
            Reset local scores
          </button>
        )}
      </div>
    </div>
  );
}
