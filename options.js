const collapseGroupCheckbox = document.getElementById("collapse-group");

browser.storage.sync.get(DEFAULT_SETTINGS).then((settings) => {
  collapseGroupCheckbox.checked = settings.collapseGroupAfterUnload;
});

collapseGroupCheckbox.addEventListener("change", () => {
  browser.storage.sync.set({ collapseGroupAfterUnload: collapseGroupCheckbox.checked });
});
