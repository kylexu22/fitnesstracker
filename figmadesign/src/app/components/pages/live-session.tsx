import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Plus, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { mockSessions, mockExercises, mockTemplates } from "../../data";
import { Session, WorkoutSet } from "../../types";
import { format } from "date-fns";

export function LiveSession() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState<Session | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [newSet, setNewSet] = useState({
    reps: 10,
    weight: 0,
    rpe: 7,
    notes: ""
  });

  useEffect(() => {
    if (id?.startsWith('new-')) {
      // Create new session
      const templateId = id.replace('new-', '');
      const template = mockTemplates.find(t => t.id === templateId);
      
      const newSession: Session = {
        id: `session-${Date.now()}`,
        name: template?.name || 'Workout Session',
        templateId: template?.id,
        startTime: new Date().toISOString(),
        status: 'active',
        exercises: template ? template.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: []
        })) : []
      };
      setSession(newSession);
    } else {
      const found = mockSessions.find(s => s.id === id);
      if (found) {
        setSession(found);
      }
    }
  }, [id]);

  const handleAddSet = (exerciseIndex: number) => {
    if (!session) return;
    
    const newSessions = { ...session };
    const currentExercise = newSessions.exercises[exerciseIndex];
    const setNumber = currentExercise.sets.length + 1;
    
    const set: WorkoutSet = {
      id: `set-${Date.now()}`,
      setNumber,
      reps: newSet.reps,
      weight: newSet.weight,
      rpe: newSet.rpe,
      notes: newSet.notes || undefined,
      timestamp: new Date().toISOString()
    };
    
    currentExercise.sets.push(set);
    setSession(newSessions);
    setNewSet({ reps: newSet.reps, weight: newSet.weight, rpe: 7, notes: "" });
  };

  const handleFinishSession = () => {
    // In a real app, this would save the session
    navigate('/history');
  };

  if (!session) {
    return <div className="p-6 text-center text-muted-foreground">Loading...</div>;
  }

  const startTime = new Date(session.startTime);
  const duration = Math.floor((Date.now() - startTime.getTime()) / 1000 / 60);

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={() => navigate("/start-workout")} className="text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{session.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{format(startTime, 'h:mm a')}</span>
              <span>·</span>
              <span>{duration} min</span>
            </div>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            Active
          </span>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Exercise Blocks */}
        {session.exercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No exercises</h3>
            <p className="text-muted-foreground">Add exercises to your workout</p>
          </div>
        ) : (
          <div className="space-y-6">
            {session.exercises.map((sessionEx, exIndex) => {
              const exercise = mockExercises.find(e => e.id === sessionEx.exerciseId);
              if (!exercise) return null;

              return (
                <div key={exIndex} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{exIndex + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">{exercise.muscleGroup}</p>
                    </div>
                  </div>

                  {/* Completed Sets Table */}
                  {sessionEx.sets.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground mb-2 px-2">
                        <span>Set</span>
                        <span>Reps</span>
                        <span>Weight</span>
                        <span>RPE</span>
                        <span></span>
                      </div>
                      {sessionEx.sets.map((set) => (
                        <div
                          key={set.id}
                          className="grid grid-cols-5 gap-2 py-2 px-2 bg-secondary/50 rounded-lg mb-2 text-sm"
                        >
                          <span className="text-foreground font-medium">{set.setNumber}</span>
                          <span className="text-foreground">{set.reps}</span>
                          <span className="text-foreground">{set.weight}</span>
                          <span className="text-foreground">{set.rpe || '-'}</span>
                          <Check className="w-4 h-4 text-primary justify-self-end" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Set Form */}
                  <div className="space-y-3 pt-3 border-t border-border">
                    <p className="text-sm font-medium text-foreground">Log Set {sessionEx.sets.length + 1}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Reps</label>
                        <input
                          type="number"
                          value={newSet.reps}
                          onChange={(e) => setNewSet({ ...newSet, reps: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-input rounded-lg border border-border text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Weight (lbs)</label>
                        <input
                          type="number"
                          value={newSet.weight}
                          onChange={(e) => setNewSet({ ...newSet, weight: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-input rounded-lg border border-border text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">RPE</label>
                        <input
                          type="number"
                          value={newSet.rpe}
                          onChange={(e) => setNewSet({ ...newSet, rpe: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-input rounded-lg border border-border text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddSet(exIndex)}
                      className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 hover:bg-primary/90 transition-colors"
                    >
                      Log Set
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Finish Session Button */}
        <div className="sticky bottom-20 mt-6 mb-6 bg-background pt-4">
          <button
            onClick={handleFinishSession}
            className="w-full bg-primary text-primary-foreground rounded-xl p-4 hover:bg-primary/90 transition-colors shadow-xl"
          >
            Finish Session
          </button>
        </div>
      </div>
    </div>
  );
}