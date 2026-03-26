import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
})

export const spidersApi = {
  list: () => api.get("/api/spiders"),
  get: (id) => api.get(`/api/spiders/${id}`),
  create: (data) => api.post("/api/spiders", data),
  update: (id, data) => api.put(`/api/spiders/${id}`, data),
  delete: (id) => api.delete(`/api/spiders/${id}`),
}

export const crawlsApi = {
  list: (spiderId) => api.get("/api/crawls", { params: { spider_id: spiderId } }),
  get: (id) => api.get(`/api/crawls/${id}`),
  start: (spiderId) => api.post(`/api/crawls/start/${spiderId}`),
  stop: (jobId) => api.post(`/api/crawls/stop/${jobId}`),
  delete: (id) => api.delete(`/api/crawls/${id}`),
}

export const dataApi = {
  query: (params) => api.get("/api/data", { params }),
  deleteCrawl: (jobId) => api.delete(`/api/data/crawl/${jobId}`),
  deleteAll: () => api.delete("/api/data/all"),
}

export const exportApi = {
  json: (params) => `http://localhost:8000/api/export/json?${new URLSearchParams(params)}`,
  csv: (params) => `http://localhost:8000/api/export/csv?${new URLSearchParams(params)}`,
  xlsx: (params) => `http://localhost:8000/api/export/xlsx?${new URLSearchParams(params)}`,
}

export const aiApi = {
  fetchPage: (url) => api.post("/api/ai/fetch-page", { url }),
  generateSelectors: (data) => api.post("/api/ai/generate-selectors", data),
  generateSpiderCode: (data) => api.post("/api/ai/generate-spider-code", data),
}

export const proxyApi = {
  list: () => api.get("/api/proxies"),
  add: (data) => api.post("/api/proxies", data),
  importFree: () => api.post("/api/proxies/import-free"),
  test: (id) => api.post(`/api/proxies/test/${id}`),
  delete: (id) => api.delete(`/api/proxies/${id}`),
}

export const settingsApi = {
  getAll: () => api.get("/api/settings"),
  set: (key, value) => api.post("/api/settings", { key, value }),
}

export const schedulerApi = {
  list: () => api.get("/api/scheduler"),
  create: (data) => api.post("/api/scheduler", data),
  delete: (id) => api.delete(`/api/scheduler/${id}`),
}

export default api
