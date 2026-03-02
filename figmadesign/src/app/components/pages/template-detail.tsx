import { useState, useEffect } from "react";
import { ArrowLeft, Plus, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { mockTemplates, mockExercises } from "../../data";
import { Template, TemplateExercise } from "../../types";

export function TemplateDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [template, setTemplate] = useState<Template | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [formData, setFormData] = useState({
    exerciseId: "",
    defaultSets: 3,
    repMin: 8,
    repMax: 12,
    notes: ""
  });

  useEffect(() => {
    const found = mockTemplates.find(t => t.id === id);
    if (found) {
      setTemplate(found);
    }
  }, [id]);

  const handleAddExercise = () => {
    if (formData.exerciseId && template) {
      const newExercise: TemplateExercise = {
        exerciseId: formData.exerciseId,
        defaultSets: formData.defaultSets,
        repMin: formData.repMin,
        repMax: formData.repMax,
        notes: formData.notes || undefined
      };
      setTemplate({
        ...template,
        exercises: [...template.exercises, newExercise]
      });
      setFormData({
        exerciseId: "",
        defaultSets: 3,
        repMin: 8,
        repMax: 12,
        notes: ""
      });
      setShowAddExercise(false);
    }
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (!template) return;
    const newExercises = [...template.exercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newExercises.length) return;
    
    [newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]];
    setTemplate({ ...template, exercises: newExercises });
  };

  const removeExercise = (index: number) => {
    if (!template) return;
    setTemplate({
      ...template,
      exercises: template.exercises.filter((_, i) => i !== index)
    });
  };

  if (!template) {
    return <div className="p-6 text-center text-muted-foreground">Template not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={() => navigate("/templates")} className="text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{template.name}</h2>
            {template.description && (
              <p className="text-sm text-muted-foreground">{template.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Add Exercise Button */}
        <button
          onClick={() => setShowAddExercise(!showAddExercise)}
          className="w-full bg-primary text-primary-foreground rounded-xl p-4 flex items-center justify-center gap-2 mb-6 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Exercise to Template</span>
        </button>

        {/* Add Exercise Form */}
        {showAddExercise && (
          <div className="bg-card rounded-xl p-4 border border-border mb-6">
            <h3 className="font-semibold text-foreground mb-4">Add Exercise</h3>
            <div className="space-y-3">
              <select
                value={formData.exerciseId}
                onChange={(e) => setFormData({ ...formData, exerciseId: e.target.value })}
                className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select exercise</option>
                {mockExercises.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Sets</label>
                  <input
                    type="number"
                    value={formData.defaultSets}
                    onChange={(e) => setFormData({ ...formData, defaultSets: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Rep Min</label>
                  <input
                    type="number"
                    value={formData.repMin}
                    onChange={(e) => setFormData({ ...formData, repMin: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Rep Max</label>
                  <input
                    type="number"
                    value={formData.repMax}
                    onChange={(e) => setFormData({ ...formData, repMax: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                </div>
              </div>

              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={2}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleAddExercise}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddExercise(false)}
                  className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2 border border-border hover:border-primary/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exercise List */}
        {template.exercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No exercises yet</h3>
            <p className="text-muted-foreground">Add exercises to build your template</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground mb-3">Exercise Order</h3>
            {template.exercises.map((templateEx, index) => {
              const exercise = mockExercises.find(e => e.id === templateEx.exerciseId);
              if (!exercise) return null;

              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 pt-1">
                      <button
                        onClick={() => moveExercise(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-secondary rounded transition-colors disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => moveExercise(index, 'down')}
                        disabled={index === template.exercises.length - 1}
                        className="p-1 hover:bg-secondary rounded transition-colors disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              #{index + 1}
                            </span>
                            <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {exercise.muscleGroup} · {exercise.equipment}
                          </p>
                        </div>
                        <button
                          onClick={() => removeExercise(index)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>

                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          <span className="text-foreground font-medium">{templateEx.defaultSets}</span> sets
                        </span>
                        <span className="text-muted-foreground">
                          <span className="text-foreground font-medium">{templateEx.repMin}-{templateEx.repMax}</span> reps
                        </span>
                      </div>

                      {templateEx.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{templateEx.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
