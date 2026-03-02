import { useState } from "react";
import { ArrowLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router";
import { mockSessions, mockExercises } from "../../data";
import { format } from "date-fns";

export function History() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');

  const filteredSessions = mockSessions
    .filter(session => filterStatus === 'all' || session.status === filterStatus)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate("/")} className="text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-foreground">Workout History</h2>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filterStatus === 'all'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground border border-border"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filterStatus === 'completed'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground border border-border"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filterStatus === 'active'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground border border-border"
            }`}
          >
            Active
          </button>
        </div>
      </div>

      <div className="px-6 mt-6">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((session) => {
              const exerciseCount = session.exercises.length;
              const setCount = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
              const totalVolume = session.exercises.reduce(
                (acc, ex) => acc + ex.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0),
                0
              );

              return (
                <button
                  key={session.id}
                  onClick={() => navigate(`/history/${session.id}`)}
                  className="w-full bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{session.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.startTime), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        session.status === 'completed'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {session.status === 'completed' ? 'Completed' : 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      <span className="text-foreground font-medium">{exerciseCount}</span> exercises
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      <span className="text-foreground font-medium">{setCount}</span> sets
                    </span>
                    {totalVolume > 0 && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                          <span className="text-foreground font-medium">{totalVolume.toLocaleString()}</span> lbs
                        </span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
