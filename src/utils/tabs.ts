export const isTabAllowed = (tabName: string, forbiddenTabs: string[]) => {
    return !forbiddenTabs.includes(tabName);
}