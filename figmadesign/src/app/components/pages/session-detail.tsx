import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { mockSessions, mockExercises } from "../../data";
import { Session } from "../../types";
import { format } from "date-fns";

export function SessionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const found = mockSessions.find(s => s.id === id);
    if (found) {
      setSession(found);
    }
  }, [id]);

  if (!session) {
    return <div className="p-6 text-center text-muted-foreground">Session not found</div>;
  }

  const startTime = new Date(session.startTime);
  const endTime = session.endTime ? new Date(session.endTime) : null;
  const duration = endTime
    ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60)
    : 0;

  const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalVolume = session.exercises.reduce(
    (acc, ex) => acc + ex.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0),
    0
  );

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={() => navigate("/history")} className="text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{session.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{format(startTime, 'MMM d, yyyy')}</span>
            </div>
          </div>
          <span
            className={`text-xs px-3 py-1.5 rounded-full ${
              session.status === 'completed'
                ? 'bg-primary/10 text-primary'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {session.status === 'completed' ? 'Completed' : 'Active'}
          </span>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{duration}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{totalSets}</div>
            <div className="text-xs text-muted-foreground">Total Sets</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <div className="text-2xl font-bold text-foreground mb-1">{(totalVolume / 1000).toFixed(1)}k</div>
            <div className="text-xs text-muted-foreground">Volume (lbs)</div>
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Exercise Breakdown</h3>
          
          {session.exercises.map((sessionEx, exIndex) => {
            const exercise = mockExercises.find(e => e.id === sessionEx.exerciseId);
            if (!exercise) return null;

            const exerciseVolume = sessionEx.sets.reduce(
              (sum, set) => sum + (set.weight * set.reps),
              0
            );

            return (
              <div key={exIndex} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">{exIndex + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exercise.muscleGroup} · {sessionEx.sets.length} sets
                    </p>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground px-2">
                    <span>Set</span>
                    <span>Reps</span>
                    <span>Weight</span>
                    <span>RPE</span>
                    <span>Time</span>
                  </div>
                  {sessionEx.sets.map((set) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-5 gap-2 py-2 px-2 bg-secondary/30 rounded-lg text-sm"
                    >
                      <span className="text-foreground font-medium">{set.setNumber}</span>
                      <span className="text-foreground">{set.reps}</span>
                      <span className="text-foreground">{set.weight}</span>
                      <span className="text-foreground">{set.rpe || '-'}</span>
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(set.timestamp), 'h:mm')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Exercise Summary */}
                <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Volume</span>
                  <span className="text-foreground font-medium">{exerciseVolume.toLocaleString()} lbs</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
