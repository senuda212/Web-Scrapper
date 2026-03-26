import { create } from "zustand"

const useStore = create((set) => ({
  spiders: [],
  setSpiders: (spiders) => set({ spiders }),
  activeCrawl: null,
  setActiveCrawl: (crawl) => set({ activeCrawl: crawl }),
  crawlLogs: [],
  appendLog: (line) => set((s) => ({ crawlLogs: [...s.crawlLogs.slice(-500), line] })),
  clearLogs: () => set({ crawlLogs: [] }),
  settings: {},
  setSettings: (settings) => set({ settings }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}))

export default useStore
