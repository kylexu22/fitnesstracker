import { ArrowLeft, Play, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { mockTemplates, mockSessions } from "../../data";

export function StartWorkout() {
  const navigate = useNavigate();

  const activeSessions = mockSessions.filter(s => s.status === 'active');

  const handleStartFromTemplate = (templateId: string) => {
    // In a real app, this would create a new session
    navigate(`/session/new-${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-foreground">Start Workout</h2>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Active Sessions</h3>
            <div className="space-y-3">
              {activeSessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => navigate(`/session/${session.id}`)}
                  className="w-full bg-primary/10 border-2 border-primary rounded-xl p-4 text-left hover:bg-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{session.name}</h4>
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Clock className="w-4 h-4" />
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.exercises.length} exercises in progress
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Template Picker */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Choose Template</h3>
          
          {/* Quick Start - No Template */}
          <button
            onClick={() => navigate('/session/new-empty')}
            className="w-full bg-card border-2 border-dashed border-border rounded-xl p-4 mb-3 hover:border-primary/50 transition-colors text-left"
          >
            <h4 className="font-semibold text-foreground mb-1">Quick Start</h4>
            <p className="text-sm text-muted-foreground">Start a blank workout session</p>
          </button>

          {/* Templates */}
          <div className="space-y-3">
            {mockTemplates.map(template => (
              <div
                key={template.id}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <div className="p-4">
                  <h4 className="font-semibold text-foreground mb-1">{template.name}</h4>
                  {template.description && (
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{template.exercises.length} exercises</span>
                  </div>
                  <button
                    onClick={() => handleStartFromTemplate(template.id)}
                    className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
