import React, { useState, useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight, Calendar, TrendingUp, BookOpen, Dumbbell, Download, Upload } from 'lucide-react';

const workoutPlan = {
  1: [
    { name: 'Standard Pull-Ups', sets: 5, reps: 8, rest: 90, tempo: '30X1' },
    { name: 'Band Assisted Dips', sets: 4, reps: 8, rest: 60, tempo: '31X1' },
    { name: 'Hollow Body Hold', sets: 4, time: 20, rest: 30, tempo: null },
    { name: 'Bar Lean Overs', sets: 4, reps: 6, rest: 45, tempo: '2121' },
    { name: 'Plank Holds', sets: 3, time: 40, rest: 30, tempo: null }
  ],
  2: [
    { name: 'Chest-to-Bar Pull-Ups', sets: 5, reps: 5, rest: 90, tempo: '20X1' },
    { name: 'Bar Lean Overs', sets: 4, reps: 6, rest: 45, tempo: '2121' },
    { name: 'Standard Pull-Ups', sets: 4, reps: 4, rest: 90, tempo: '30X1' },
    { name: 'Plank Holds', sets: 4, time: 40, rest: 30, tempo: null },
    { name: 'Hollow Body Hold', sets: 3, time: 20, rest: 30, tempo: null }
  ],
  3: [
    { name: 'Rest Day', sets: null, reps: null, rest: null, tempo: null }
  ],
  4: [
    { name: 'Negative Dips', sets: 4, reps: 6, rest: 60, tempo: '4010' },
    { name: 'Band Assisted Dips', sets: 3, reps: 8, rest: 60, tempo: '31X1' },
    { name: 'Bar Lean Overs', sets: 4, reps: 6, rest: 45, tempo: '2121' },
    { name: 'Plank Holds', sets: 4, time: 40, rest: 30, tempo: null },
    { name: 'Hollow Body Hold', sets: 3, time: 20, rest: 30, tempo: null }
  ],
  5: [
    { name: 'Negative Dips', sets: 4, reps: 5, rest: 90, tempo: '5010' },
    { name: 'Bar Lean Overs', sets: 4, reps: 6, rest: 45, tempo: '2121' },
    { name: 'Standard Pull-Ups', sets: 4, reps: 5, rest: 90, tempo: '30X1' },
    { name: 'Hollow Body Hold', sets: 4, time: 20, rest: 30, tempo: null },
    { name: 'Plank Holds', sets: 3, time: 40, rest: 30, tempo: null }
  ]
};

export default function CalisthenicsTracker() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentDay, setCurrentDay] = useState(1);
  const [setsData, setSetsData] = useState({});
  const [notes, setNotes] = useState({});
  const [weekHistory, setWeekHistory] = useState({});
  const [activeExercise, setActiveExercise] = useState(null);
  const [view, setView] = useState('workout');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedSets = localStorage.getItem('calisthenics-sets');
      const savedNotes = localStorage.getItem('calisthenics-notes');
      const savedHistory = localStorage.getItem('calisthenics-history');
      
      if (savedSets) setSetsData(JSON.parse(savedSets));
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      if (savedHistory) setWeekHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('calisthenics-sets', JSON.stringify(setsData));
    } catch (e) {
      console.error('Error saving sets:', e);
    }
  }, [setsData]);

  useEffect(() => {
    try {
      localStorage.setItem('calisthenics-notes', JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving notes:', e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('calisthenics-history', JSON.stringify(weekHistory));
    } catch (e) {
      console.error('Error saving history:', e);
    }
  }, [weekHistory]);

  const exportData = () => {
    const data = {
      setsData,
      notes,
      weekHistory,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.setsData) setSetsData(data.setsData);
        if (data.notes) setNotes(data.notes);
        if (data.weekHistory) setWeekHistory(data.weekHistory);
        alert('Data imported successfully!');
      } catch (e) {
        alert('Error importing data. Please check the file.');
      }
    };
    reader.readAsText(file);
  };

  const updateSet = (day, exerciseIndex, setIndex, reps) => {
    const key = `${currentWeek}-${day}-${exerciseIndex}`;
    setSetsData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [setIndex]: reps
      }
    }));
  };

  const updateNote = (week, day, exerciseIndex, exerciseName, note) => {
    const key = `${week}-${day}-${exerciseIndex}`;
    setNotes(prev => ({
      ...prev,
      [key]: {
        note,
        week,
        day,
        exerciseName,
        timestamp: new Date().toISOString()
      }
    }));
  };

  const getExerciseData = (day, exerciseIndex) => {
    const key = `${currentWeek}-${day}-${exerciseIndex}`;
    return setsData[key] || {};
  };

  const getNote = (week, day, exerciseIndex) => {
    const key = `${week}-${day}-${exerciseIndex}`;
    return notes[key]?.note || '';
  };

  const isExerciseComplete = (day, exerciseIndex, exercise) => {
    const data = getExerciseData(day, exerciseIndex);
    if (!exercise.sets) return false;
    
    for (let i = 0; i < exercise.sets; i++) {
      if (!data[i] || data[i] === 0) return false;
    }
    return true;
  };

  const completeDay = () => {
    const exercises = workoutPlan[currentDay];
    const allCompleted = exercises.every((ex, idx) => isExerciseComplete(currentDay, idx, ex));

    if (allCompleted) {
      const dayKey = `${currentWeek}-${currentDay}`;
      setWeekHistory(prev => ({
        ...prev,
        [dayKey]: new Date().toISOString().split('T')[0]
      }));
      
      if (currentDay < 5) {
        setCurrentDay(currentDay + 1);
      }
    }
  };

  const getWeekProgress = () => {
    let completed = 0;
    for (let day = 1; day <= 5; day++) {
      const dayKey = `${currentWeek}-${day}`;
      if (weekHistory[dayKey]) completed++;
    }
    return { completed, total: 5 };
  };

  const getAllNotes = () => {
    return Object.values(notes)
      .filter(n => n.note.trim())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const exercises = workoutPlan[currentDay] || [];
  const isRestDay = currentDay === 3;
  const progress = getWeekProgress();
  const allNotes = getAllNotes();

  if (view === 'notes') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Training Notes</h1>
              <div className="flex gap-2">
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                  title="Export data"
                >
                  <Download size={20} />
                </button>
                <label className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors cursor-pointer">
                  <Upload size={20} />
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
                <button
                  onClick={() => setView('workout')}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Dumbbell size={20} />
                  <span>Workout</span>
                </button>
              </div>
            </div>
          </div>

          {allNotes.length === 0 ? (
            <div className="bg-slate-800/50 p-8 rounded-lg text-center">
              <BookOpen size={48} className="mx-auto mb-4 text-slate-500" />
              <p className="text-slate-400">No notes yet. Add notes during workouts to track progress.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allNotes.map((noteData, idx) => (
                <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{noteData.exerciseName}</h3>
                      <p className="text-sm text-slate-400">
                        Week {noteData.week} • Day {noteData.day} • {new Date(noteData.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-300 mt-2">{noteData.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Calisthenics Tracker</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('notes')}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
              >
                <BookOpen size={20} />
                <span className="hidden sm:inline">Notes</span>
                {allNotes.length > 0 && (
                  <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded-full">{allNotes.length}</span>
                )}
              </button>
              <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
                <Calendar size={20} />
                <span className="font-semibold">Week {currentWeek}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Week Progress</span>
              <span className="text-sm font-semibold">{progress.completed}/{progress.total} days</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(day => {
            const dayKey = `${currentWeek}-${day}`;
            const isDone = weekHistory[dayKey];
            return (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`p-3 rounded-lg font-semibold transition-all ${
                  currentDay === day
                    ? 'bg-emerald-600 scale-105'
                    : isDone
                    ? 'bg-emerald-800/50'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                Day {day}
                {isDone && <Check size={16} className="mx-auto mt-1" />}
              </button>
            );
          })}
        </div>

        {isRestDay && (
          <div className="bg-slate-800/50 p-8 rounded-lg text-center">
            <TrendingUp size={48} className="mx-auto mb-4 text-emerald-500" />
            <h2 className="text-2xl font-bold mb-2">Rest Day</h2>
            <p className="text-slate-300">Recovery is growth. Take it easy today.</p>
          </div>
        )}

        {!isRestDay && (
          <div className="space-y-3 mb-6">
            {exercises.map((exercise, idx) => {
              const exerciseData = getExerciseData(currentDay, idx);
              const isComplete = isExerciseComplete(currentDay, idx, exercise);
              const isActive = activeExercise === idx;
              const currentNote = getNote(currentWeek, currentDay, idx);
              const hasNote = currentNote.trim().length > 0;

              return (
                <div
                  key={idx}
                  className={`bg-slate-800/50 p-4 rounded-lg transition-all ${
                    isComplete ? 'border-2 border-emerald-500' : 'border-2 border-transparent'
                  } ${hasNote ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setActiveExercise(isActive ? null : idx)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-lg mb-2 ${isComplete ? 'text-emerald-400' : ''}`}>
                          {exercise.name}
                        </h3>
                        {hasNote && <BookOpen size={16} className="text-blue-400 mb-2" />}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                        {exercise.sets && <span>Sets: {exercise.sets}</span>}
                        {exercise.reps && <span>Target: {exercise.reps} reps</span>}
                        {exercise.time && <span>Time: {exercise.time}s</span>}
                        {exercise.rest && <span>Rest: {exercise.rest}s</span>}
                        {exercise.tempo && <span>Tempo: {exercise.tempo}</span>}
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isComplete ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}>
                      {isComplete && <Check size={20} />}
                    </div>
                  </div>

                  {isActive && exercise.sets && exercise.reps && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="grid grid-cols-5 gap-2">
                        {[...Array(exercise.sets)].map((_, setIdx) => {
                          const reps = exerciseData[setIdx] || '';
                          const isDone = reps > 0;
                          
                          return (
                            <div key={setIdx} className="flex flex-col gap-1">
                              <label className="text-xs text-slate-400 text-center">Set {setIdx + 1}</label>
                              <input
                                type="number"
                                inputMode="numeric"
                                value={reps}
                                onChange={(e) => updateSet(currentDay, idx, setIdx, parseInt(e.target.value) || 0)}
                                className={`w-full p-2 rounded text-center font-semibold transition-all ${
                                  isDone 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-slate-700 text-slate-300'
                                }`}
                                placeholder={exercise.reps}
                              />
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-3 flex justify-between text-sm text-slate-400">
                        <span>
                          Total: {Object.values(exerciseData).reduce((sum, val) => sum + (val || 0), 0)} / {exercise.sets * exercise.reps}
                        </span>
                        <span>
                          Sets: {Object.values(exerciseData).filter(v => v > 0).length} / {exercise.sets}
                        </span>
                      </div>
                    </div>
                  )}

                  {isActive && exercise.sets && exercise.time && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex gap-2 flex-wrap">
                        {[...Array(exercise.sets)].map((_, setIdx) => {
                          const isDone = exerciseData[setIdx];
                          
                          return (
                            <button
                              key={setIdx}
                              onClick={() => updateSet(currentDay, idx, setIdx, isDone ? 0 : 1)}
                              className={`flex-1 min-w-[60px] p-3 rounded font-semibold transition-all ${
                                isDone 
                                  ? 'bg-emerald-600' 
                                  : 'bg-slate-700 hover:bg-slate-600'
                              }`}
                            >
                              {isDone ? <Check size={20} className="mx-auto" /> : `Set ${setIdx + 1}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <label className="text-sm text-slate-400 mb-2 block">Notes (optional)</label>
                      <textarea
                        value={currentNote}
                        onChange={(e) => updateNote(currentWeek, currentDay, idx, exercise.name, e.target.value)}
                        placeholder="Failed last set due to fatigue, form breaking down, felt strong, etc."
                        className="w-full bg-slate-700 text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isRestDay && (
          <button
            onClick={completeDay}
            disabled={!exercises.every((ex, idx) => isExerciseComplete(currentDay, idx, ex))}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed p-4 rounded-lg font-semibold transition-colors"
          >
            Complete Day {currentDay}
          </button>
        )}
      </div>
    </div>
  );
}
