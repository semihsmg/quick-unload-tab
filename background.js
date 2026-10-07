browser.commands.onCommand.addListener(async (command) => {
  if (command !== "unload-current-tab") return;

  const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!activeTab) return;

  // Firefox can't unload the tab you're looking at, so switch away first.
  // Like the built-in "Unload Tab", go to the nearest loaded tab on the right,
  // then on the left, and open a new tab if none are left.
  const loadedTabs = await browser.tabs.query({
    currentWindow: true,
    active: false,
    hidden: false,
    discarded: false,
  });
  loadedTabs.sort((a, b) => a.index - b.index);

  const nextTab =
    loadedTabs.find((tab) => tab.index > activeTab.index) ??
    loadedTabs.findLast((tab) => tab.index < activeTab.index);

  if (nextTab) {
    await browser.tabs.update(nextTab.id, { active: true });
  } else {
    await browser.tabs.create({});
  }

  await browser.tabs.discard(activeTab.id);
});
