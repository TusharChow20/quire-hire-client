const BASE = process.env.NEXT_PUBLIC_API_URL;

// -------------------- Public --------------------

export async function fetchJobs(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/api/jobs?${qs}`);
  return res.json();
}

export async function fetchJob(id) {
  const res = await fetch(`${BASE}/api/jobs/${id}`);
  return res.json();
}

export async function fetchFeaturedJobs() {
  const res = await fetch(`${BASE}/api/jobs/featured`);
  return res.json();
}

export async function fetchLatestJobs() {
  const res = await fetch(`${BASE}/api/jobs/latest`);
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/api/jobs/categories`);
  return res.json();
}

export async function submitApplication(data) {
  const res = await fetch(`${BASE}/api/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchUserApplications(email) {
  const res = await fetch(
    `${BASE}/api/applications/user/me?email=${encodeURIComponent(email)}`,
  );
  return res.json();
}

// -------------------- Bookmarks --------------------

export async function fetchBookmarks(userId) {
  const res = await fetch(`${BASE}/api/bookmarks/${userId}`);
  return res.json();
}

export async function addBookmark(userId, jobId) {
  const res = await fetch(`${BASE}/api/bookmarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, job_id: jobId }),
  });
  return res.json();
}

export async function removeBookmark(userId, jobId) {
  const res = await fetch(`${BASE}/api/bookmarks`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, job_id: jobId }),
  });
  return res.json();
}

// -------------------- Admin --------------------

export async function adminFetchStats() {
  const res = await fetch(`${BASE}/api/admin/stats`);
  return res.json();
}

export async function adminFetchGrowth(days = 30) {
  const res = await fetch(`${BASE}/api/admin/growth?days=${days}`);
  return res.json();
}

export async function adminFetchApplications(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/api/applications?${qs}`);
  return res.json();
}

export async function adminCreateJob(data) {
  const res = await fetch(`${BASE}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminUpdateJob(id, data) {
  const res = await fetch(`${BASE}/api/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteJob(id) {
  const res = await fetch(`${BASE}/api/jobs/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function adminToggleFeatured(id, isFeatured) {
  const res = await fetch(`${BASE}/api/jobs/${id}/featured`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isFeatured }),
  });
  return res.json();
}

export async function adminUpdateApplicationStatus(id, status) {
  const res = await fetch(`${BASE}/api/applications/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

// -------------------- User --------------------

export async function updateUserProfile(id, data) {
  const res = await fetch(`${BASE}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
