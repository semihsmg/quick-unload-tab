const UNLOAD_GROUP_MENU_ID = "unload-tab-group";
const NO_GROUP_ID = -1;

browser.runtime.onInstalled.addListener(() => {
  // Firefox doesn't let extensions add items to the tab group's own menu,
  // so this goes in the tab menu and only shows on tabs that are in a group.
  browser.menus.create({
    id: UNLOAD_GROUP_MENU_ID,
    title: "Unload Tabs in Group",
    contexts: ["tab"],
  });
});

browser.menus.onShown.addListener(async (info, tab) => {
  if (!info.contexts.includes("tab")) return;

  await browser.menus.update(UNLOAD_GROUP_MENU_ID, {
    visible: tab.groupId !== NO_GROUP_ID,
  });
  await browser.menus.refresh();
});

browser.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== UNLOAD_GROUP_MENU_ID) return;
  if (tab.groupId === NO_GROUP_ID) return;

  const groupTabs = await browser.tabs.query({ groupId: tab.groupId });
  await unloadTabs(groupTabs);
});

browser.commands.onCommand.addListener(async (command) => {
  if (command !== "unload-current-tab") return;

  const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!activeTab) return;

  await unloadTabs([activeTab]);
});

async function unloadTabs(tabsToUnload) {
  const tabIdsToUnload = tabsToUnload.map((tab) => tab.id);
  const activeTab = tabsToUnload.find((tab) => tab.active);

  if (activeTab) {
    await switchAwayFrom(activeTab, tabIdsToUnload);
  }

  await browser.tabs.discard(tabIdsToUnload);
}

// Firefox can't unload the tab you're looking at, so switch away first.
// Like the built-in "Unload Tab", go to the nearest loaded tab on the right,
// then on the left, and open a new tab if none are left.
async function switchAwayFrom(activeTab, tabIdsToUnload) {
  const loadedTabs = await browser.tabs.query({
    windowId: activeTab.windowId,
    hidden: false,
    discarded: false,
  });
  const candidateTabs = loadedTabs
    .filter((tab) => !tabIdsToUnload.includes(tab.id))
    .sort((a, b) => a.index - b.index);

  const nextTab =
    candidateTabs.find((tab) => tab.index > activeTab.index) ??
    candidateTabs.findLast((tab) => tab.index < activeTab.index);

  if (nextTab) {
    await browser.tabs.update(nextTab.id, { active: true });
  } else {
    await browser.tabs.create({ windowId: activeTab.windowId });
  }
}
