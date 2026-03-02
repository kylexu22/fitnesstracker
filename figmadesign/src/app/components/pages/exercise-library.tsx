import { useState } from "react";
import { ArrowLeft, Search, Plus, Edit, Archive } from "lucide-react";
import { useNavigate } from "react-router";
import { mockExercises } from "../../data";
import { Exercise } from "../../types";

export function ExerciseLibrary() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    muscleGroup: "",
    equipment: "",
    notes: ""
  });

  const muscleGroups = ["all", ...Array.from(new Set(mockExercises.map(e => e.muscleGroup)))];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = selectedMuscleGroup === "all" || exercise.muscleGroup === selectedMuscleGroup;
    return matchesSearch && matchesMuscleGroup && !exercise.archived;
  });

  const handleAddExercise = () => {
    if (formData.name && formData.muscleGroup && formData.equipment) {
      const newExercise: Exercise = {
        id: String(exercises.length + 1),
        ...formData
      };
      setExercises([...exercises, newExercise]);
      setFormData({ name: "", muscleGroup: "", equipment: "", notes: "" });
      setShowAddForm(false);
    }
  };

  const handleArchive = (id: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, archived: true } : ex
    ));
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate("/")} className="text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-foreground">Exercise Library</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto mt-3 pb-2 scrollbar-hide">
          {muscleGroups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedMuscleGroup(group)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedMuscleGroup === group
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground border border-border"
              }`}
            >
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Add Exercise Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-primary text-primary-foreground rounded-xl p-4 flex items-center justify-center gap-2 mb-6 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Exercise</span>
        </button>

        {/* Add Exercise Form */}
        {showAddForm && (
          <div className="bg-card rounded-xl p-4 border border-border mb-6">
            <h3 className="font-semibold text-foreground mb-4">New Exercise</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Exercise name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Muscle group"
                value={formData.muscleGroup}
                onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Equipment"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddExercise}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors"
                >
                  Add Exercise
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2 border border-border hover:border-primary/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exercise List */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No exercises found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{exercise.name}</h4>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-primary">{exercise.muscleGroup}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{exercise.equipment}</span>
                    </div>
                    {exercise.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{exercise.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => handleArchive(exercise.id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Archive className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
