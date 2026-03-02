import { useState } from "react";
import { ArrowLeft, Plus, Edit } from "lucide-react";
import { useNavigate } from "react-router";
import { mockTemplates } from "../../data";
import { Template } from "../../types";

export function TemplatesList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const handleCreateTemplate = () => {
    if (formData.name) {
      const newTemplate: Template = {
        id: String(templates.length + 1),
        name: formData.name,
        description: formData.description,
        exercises: []
      };
      setTemplates([...templates, newTemplate]);
      setFormData({ name: "", description: "" });
      setShowCreateForm(false);
      navigate(`/templates/${newTemplate.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-foreground">Workout Templates</h2>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Create Template Button */}
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full bg-primary text-primary-foreground rounded-xl p-4 flex items-center justify-center gap-2 mb-6 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Template</span>
        </button>

        {/* Create Template Form */}
        {showCreateForm && (
          <div className="bg-card rounded-xl p-4 border border-border mb-6">
            <h3 className="font-semibold text-foreground mb-4">New Template</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Template name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-input rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateTemplate}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors"
                >
                  Create & Edit
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2 border border-border hover:border-primary/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Templates List */}
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-6">Create your first workout template to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => navigate(`/templates/${template.id}`)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-muted-foreground">
                    {template.exercises.length} exercises
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/templates/${template.id}`)}
                  className="w-full bg-primary/10 text-primary rounded-lg py-2 hover:bg-primary/20 transition-colors"
                >
                  View & Edit Template
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}