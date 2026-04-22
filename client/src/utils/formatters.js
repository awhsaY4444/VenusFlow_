import { currentLanguage, tr } from "./i18n";

export function formatDate(value) {
  const locale = "en-IN";
  return value ? new Date(value).toLocaleDateString(locale) : tr("No due date");
}

export function formatDateTime(value) {
  const locale = "en-IN";
  return new Date(value).toLocaleString(locale);
}
