browser.commands.onCommand.addListener(async (command) => {
  if (command !== "unload-current-tab") return;

  const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!activeTab) return;

  // Firefox can't unload the tab you're looking at, so switch away first.
  const otherTabs = await browser.tabs.query({ currentWindow: true, active: false, hidden: false });
  if (otherTabs.length === 0) return;

  const lastUsedTab = otherTabs.reduce((mostRecent, tab) =>
    tab.lastAccessed > mostRecent.lastAccessed ? tab : mostRecent
  );

  await browser.tabs.update(lastUsedTab.id, { active: true });
  await browser.tabs.discard(activeTab.id);
});
