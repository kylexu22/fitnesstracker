import { useNavigate } from "react-router";
import { Dumbbell, Library, FileText, BarChart3, Clock } from "lucide-react";
import { mockSessions, mockExercises, mockTemplates } from "../../data";
import { format } from "date-fns";

export function Dashboard() {
  const navigate = useNavigate();

  const completedSessions = mockSessions.filter(s => s.status === 'completed').length;
  const activeSessions = mockSessions.filter(s => s.status === 'active').length;
  const totalExercises = mockExercises.length;
  const totalTemplates = mockTemplates.length;

  const recentSessions = mockSessions
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with lavender accent background */}
      <div 
        className="relative px-6 pt-12 pb-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #8b7aff 0%, #6366f1 100%)',
        }}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-60 h-60 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, User</h1>
          <p className="text-white/80">Let's crush today's workout</p>
        </div>
      </div>

      {/* Dashboard Stats Cards - Overlapping header */}
      <div className="px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{totalExercises}</div>
            <div className="text-sm text-muted-foreground">Total Exercises</div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{totalTemplates}</div>
            <div className="text-sm text-muted-foreground">Templates</div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{completedSessions}</div>
            <div className="text-sm text-muted-foreground">Completed Sessions</div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{activeSessions}</div>
            <div className="text-sm text-muted-foreground">Active Sessions</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/start-workout")}
              className="bg-primary text-primary-foreground rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Dumbbell className="w-6 h-6" />
              <span className="text-sm font-medium">Start Workout</span>
            </button>

            <button
              onClick={() => navigate("/templates")}
              className="bg-card text-foreground rounded-xl p-4 flex flex-col items-center gap-2 border border-border hover:border-primary/50 transition-colors"
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm font-medium">Templates</span>
            </button>

            <button
              onClick={() => navigate("/exercises")}
              className="bg-card text-foreground rounded-xl p-4 flex flex-col items-center gap-2 border border-border hover:border-primary/50 transition-colors"
            >
              <Library className="w-6 h-6" />
              <span className="text-sm font-medium">Exercise Library</span>
            </button>

            <button
              onClick={() => navigate("/analytics")}
              className="bg-card text-foreground rounded-xl p-4 flex flex-col items-center gap-2 border border-border hover:border-primary/50 transition-colors"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm font-medium">Analytics</span>
            </button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Sessions</h3>
            <button
              onClick={() => navigate("/history")}
              className="text-sm text-primary hover:text-primary/80"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentSessions.map((session) => {
              const exerciseCount = session.exercises.length;
              const setCount = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
              
              return (
                <button
                  key={session.id}
                  onClick={() => navigate(`/history/${session.id}`)}
                  className="w-full bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{session.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.startTime), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                    {session.status === 'completed' && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{exerciseCount} exercises</span>
                    <span>·</span>
                    <span>{setCount} sets</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}