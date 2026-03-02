import { ArrowLeft, TrendingUp, Dumbbell, Calendar } from "lucide-react";
import { useNavigate } from "react-router";
import { mockSessions, mockExercises } from "../../data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export function Analytics() {
  const navigate = useNavigate();

  // Calculate 30-day stats
  const last30Days = mockSessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return sessionDate >= thirtyDaysAgo && session.status === 'completed';
  });

  const totalSessions = last30Days.length;
  const totalSets = last30Days.reduce((acc, session) =>
    acc + session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0), 0
  );
  const totalReps = last30Days.reduce((acc, session) =>
    acc + session.exercises.reduce((sum, ex) =>
      sum + ex.sets.reduce((reps, set) => reps + set.reps, 0), 0), 0
  );
  const totalVolume = last30Days.reduce((acc, session) =>
    acc + session.exercises.reduce((sum, ex) =>
      sum + ex.sets.reduce((vol, set) => vol + (set.weight * set.reps), 0), 0), 0
  );

  // Top exercises by volume
  const exerciseVolumes: { [key: string]: number } = {};
  last30Days.forEach(session => {
    session.exercises.forEach(sessionEx => {
      const volume = sessionEx.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      exerciseVolumes[sessionEx.exerciseId] = (exerciseVolumes[sessionEx.exerciseId] || 0) + volume;
    });
  });

  const topExercises = Object.entries(exerciseVolumes)
    .map(([id, volume]) => ({
      exercise: mockExercises.find(e => e.id === id)?.name || 'Unknown',
      volume
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  // Weekly volume data for chart
  const weeklyData = [
    { week: 'Week 1', volume: 12500 },
    { week: 'Week 2', volume: 15200 },
    { week: 'Week 3', volume: 14800 },
    { week: 'Week 4', volume: 16300 },
  ];

  // Sessions per week
  const sessionsData = [
    { week: 'Week 1', sessions: 3 },
    { week: 'Week 2', sessions: 4 },
    { week: 'Week 3', sessions: 3 },
    { week: 'Week 4', sessions: 4 },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-foreground">Analytics</h2>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* 30-Day Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Last 30 Days</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{totalSessions}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{totalSets}</div>
              <div className="text-sm text-muted-foreground">Total Sets</div>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{totalReps}</div>
              <div className="text-sm text-muted-foreground">Total Reps</div>
            </div>

            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{(totalVolume / 1000).toFixed(1)}k</div>
              <div className="text-sm text-muted-foreground">Tonnage (lbs)</div>
            </div>
          </div>
        </div>

        {/* Top Exercises */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Exercises by Volume</h3>
          <div className="bg-card rounded-xl border border-border p-4">
            {topExercises.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No data available</p>
            ) : (
              <div className="space-y-3">
                {topExercises.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-foreground font-medium">{item.exercise}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {(item.volume / 1000).toFixed(1)}k lbs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Volume Progression Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Volume Progression</h3>
          <div className="bg-card rounded-xl border border-border p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
                <XAxis 
                  dataKey="week" 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#13131a',
                    border: '1px solid #2a2a38',
                    borderRadius: '8px',
                    color: '#e5e5e5'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#8b7aff" 
                  strokeWidth={2}
                  dot={{ fill: '#8b7aff', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sessions per Week Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Training Frequency</h3>
          <div className="bg-card rounded-xl border border-border p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sessionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
                <XAxis 
                  dataKey="week" 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#13131a',
                    border: '1px solid #2a2a38',
                    borderRadius: '8px',
                    color: '#e5e5e5'
                  }}
                />
                <Bar dataKey="sessions" fill="#8b7aff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
