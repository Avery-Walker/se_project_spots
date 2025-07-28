export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (!btn) return;
  btn.textContent = isLoading ? loadingText : defaultText;
}
