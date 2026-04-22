import { Plus, Save } from "lucide-react";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { tr } from "../../utils/i18n";

export function TaskComposerPanel({
  users,
  taskForm,
  editingTaskId,
  onChange,
  onCancel,
  onSubmit,
}) {
  return (
    <section className="glass-panel p-6">
      <SectionHeader
        kicker={tr("Task editor", "टास्क एडिटर")}
        title={editingTaskId ? tr("Update task", "टास्क अपडेट करें") : tr("Create task", "टास्क बनाएं")}
        description={tr(
          "Keep this area focused on authoring and task ownership.",
          "यह हिस्सा टास्क लिखने और जिम्मेदारी तय करने पर केंद्रित है।",
        )}
        actions={
          editingTaskId ? (
            <button className="btn-ghost" type="button" onClick={onCancel}>
              {tr("Cancel edit", "एडिट रद्द करें")}
            </button>
          ) : null
        }
      />

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <div>
          <label className="field-label">{tr("Title", "शीर्षक")}</label>
          <input
            className="field-input"
            value={taskForm.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder={tr("Improve workspace onboarding flow", "वर्कस्पेस ऑनबोर्डिंग फ्लो सुधारें")}
            required
          />
        </div>

        <div>
          <label className="field-label">{tr("Description", "विवरण")}</label>
          <textarea
            className="field-input min-h-[110px]"
            value={taskForm.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder={tr(
              "Add implementation details, blockers, or goals",
              "इम्प्लीमेंटेशन विवरण, ब्लॉकर या लक्ष्य जोड़ें",
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="field-label">{tr("Status", "स्टेटस")}</label>
            <select
              className="field-input"
              value={taskForm.status}
              onChange={(event) => onChange("status", event.target.value)}
            >
              <option value="todo">{tr("Todo", "करना है")}</option>
              <option value="in_progress">{tr("In progress", "प्रगति में")}</option>
              <option value="done">{tr("Done", "पूरा")}</option>
            </select>
          </div>

          <div>
            <label className="field-label">{tr("Priority", "प्राथमिकता")}</label>
            <select
              className="field-input"
              value={taskForm.priority}
              onChange={(event) => onChange("priority", event.target.value)}
            >
              <option value="high">{tr("High", "उच्च")}</option>
              <option value="medium">{tr("Medium", "मध्यम")}</option>
              <option value="low">{tr("Low", "कम")}</option>
            </select>
          </div>

          <div>
            <label className="field-label">{tr("Due date", "देय तारीख")}</label>
            <input
              className="field-input"
              type="date"
              value={taskForm.dueDate}
              onChange={(event) => onChange("dueDate", event.target.value)}
            />
          </div>

          <div>
            <label className="field-label">{tr("Assignee", "असाइनी")}</label>
            <select
              className="field-input"
              value={taskForm.assigneeId}
              onChange={(event) => onChange("assigneeId", event.target.value)}
            >
              <option value="">{tr("Assign to creator", "क्रिएटर को असाइन करें")}</option>
              {users.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({tr(member.role, member.role === "admin" ? "एडमिन" : "मेंबर")})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn-primary" type="submit">
          {editingTaskId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingTaskId ? tr("Save changes", "बदलाव सेव करें") : tr("Create task", "टास्क बनाएं")}
        </button>
      </form>
    </section>
  );
}
