import { MessageSquareMore, ScrollText, Trash2 } from "lucide-react";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate, formatDateTime } from "../../utils/formatters";
import { tr } from "../../utils/i18n";

export function TaskDetailPanel({
  selectedTask,
  userRole,
  audit,
  comments,
  commentBody,
  onCommentChange,
  onCommentSubmit,
  onDeleteComment,
}) {
  if (!selectedTask) {
    return (
      <section className="glass-panel p-6">
        <EmptyState
          title={tr("Select a task", "एक टास्क चुनें")}
          description={tr(
            "Task detail, audit history, and comments will appear here once you choose an item from the list.",
            "सूची से टास्क चुनने के बाद उसका विवरण, ऑडिट हिस्ट्री और कमेंट यहां दिखेंगे।",
          )}
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="glass-panel p-6">
        <SectionHeader
          kicker={tr("Task detail", "टास्क विवरण")}
          title={selectedTask.title}
          description={selectedTask.description || tr("No description yet.", "अभी कोई विवरण नहीं।")}
        />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold uppercase tracking-widest text-ink-500">{tr("Status", "स्थिति")}</p>
            <StatusBadge value={selectedTask.status} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold uppercase tracking-widest text-ink-500">{tr("Priority", "प्राथमिकता")}</p>
            <StatusBadge value={selectedTask.priority} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold uppercase tracking-widest text-ink-500">{tr("Due Date", "देय तिथि")}</p>
            <p className="text-base font-semibold text-ink-950">{formatDate(selectedTask.dueDate)}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold uppercase tracking-widest text-ink-500">{tr("Assignee", "असाइनी")}</p>
            <p className="text-base font-semibold text-ink-950 truncate">{selectedTask.assigneeName || tr("Unassigned", "असाइन नहीं")}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold uppercase tracking-widest text-ink-500">{tr("Creator", "क्रिएटर")}</p>
            <p className="text-base font-semibold text-ink-950 truncate">{selectedTask.creatorName}</p>
          </div>
        </div>
      </div>

      <section className="glass-panel overflow-hidden">
        <div className="border-b border-line/50 p-6">
          <SectionHeader
            title={tr("Activity & Discussion", "गतिविधि और चर्चा")}
            description={tr("A unified timeline of changes and collaboration.", "बदलावों और सहयोग की एक एकीकृत टाइमलाइन।")}
          />
        </div>

        <div className="divide-y divide-line/50">
          <div className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-ink-500" />
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink-600">{tr("Change History", "बदलाव इतिहास")}</h3>
            </div>
            
            <div className="space-y-6">
              {audit.length ? (
                audit.map((entry, index) => {
                  const hasChanges = entry.changes && entry.changes.before && entry.changes.after;
                  
                  return (
                    <div key={entry.id} className="relative flex gap-4">
                      <div className="relative flex w-6 justify-center">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(234,88,12,0.4)]" />
                        {index !== audit.length - 1 ? (
                          <div className="absolute top-4 h-full w-px bg-line" />
                        ) : null}
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="text-base text-ink-700">
                          <span className="font-bold text-ink-950">{entry.actorName}</span> {entry.action} this task
                        </p>
                        
                        {hasChanges && (
                          <div className="mt-3 overflow-hidden rounded-xl border border-line/40 bg-surface-muted/50 p-3">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-ink-400 uppercase tracking-wider font-bold border-b border-line/40">
                                  <th className="text-left pb-1.5 px-2">Field</th>
                                  <th className="text-left pb-1.5 px-2">Before</th>
                                  <th className="text-left pb-1.5 px-2">After</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-line/20">
                                {Object.keys(entry.changes.after).map(key => {
                                  // Simplified diff: show only if changed
                                  const before = entry.changes.before[key];
                                  const after = entry.changes.after[key];
                                  if (before === after) return null;

                                  return (
                                    <tr key={key}>
                                      <td className="py-2 px-2 font-bold text-ink-600">{key}</td>
                                      <td className="py-2 px-2 text-red-600/70 line-through truncate max-w-[100px]">{String(before || 'None')}</td>
                                      <td className="py-2 px-2 text-green-600 font-semibold truncate max-w-[100px]">{String(after || 'None')}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-ink-400">{formatDateTime(entry.createdAt)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-ink-500 italic">{tr("No changes recorded yet.", "अभी तक कोई बदलाव दर्ज नहीं किया गया है।")}</p>
              )}
            </div>

          </div>

          <div className="p-6 bg-surface-muted/30">
            <div className="mb-6 flex items-center gap-2">
              <MessageSquareMore className="h-4 w-4 text-ink-500" />
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink-600">{tr("Discussion", "चर्चा")}</h3>
            </div>

            <form className="mb-8 space-y-3" onSubmit={onCommentSubmit}>
              <textarea
                className="field-input min-h-[100px] border-line/60 bg-surface shadow-sm"
                value={commentBody}
                onChange={(event) => onCommentChange(event.target.value)}
                placeholder={tr("Type a comment...", "एक कमेंट टाइप करें...")}
              />
              <div className="flex justify-end">
                <button className="btn-primary py-2 text-sm" type="submit">
                  <MessageSquareMore className="h-4 w-4" />
                  {tr("Post comment", "कमेंट पोस्ट करें")}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {comments.length ? (
                comments.map((comment) => (
                  <article key={comment.id} className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink-950">{comment.authorName}</p>
                        <p className="text-xs font-medium text-ink-500">{formatDateTime(comment.createdAt)}</p>
                      </div>
                      <button
                        type="button"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                        title={tr("Delete comment", "कमेंट हटाएं")}
                        onClick={() => onDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2 text-base leading-6 text-ink-700">{comment.body}</p>
                  </article>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-ink-500 italic">{tr("No comments yet.", "अभी कोई कमेंट नहीं।")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
