browser.commands.onCommand.addListener(async (command) => {
  if (command !== "unload-current-tab") return;

  const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!activeTab) return;

  // Firefox can't unload the tab you're looking at, so switch away first.
  // Like the built-in "Unload Tab", skip tabs that are already unloaded and
  // open a new tab if none are left.
  const loadedTabs = await browser.tabs.query({
    currentWindow: true,
    active: false,
    hidden: false,
    discarded: false,
  });

  if (loadedTabs.length === 0) {
    await browser.tabs.create({});
  } else {
    const lastUsedTab = loadedTabs.reduce((mostRecent, tab) =>
      tab.lastAccessed > mostRecent.lastAccessed ? tab : mostRecent
    );
    await browser.tabs.update(lastUsedTab.id, { active: true });
  }

  await browser.tabs.discard(activeTab.id);
});
