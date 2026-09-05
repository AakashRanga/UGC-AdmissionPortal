export const apiService = {
  // Check backend server health
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Backend API connection error:", e);
    }
    return {
      status: "offline",
      app_mode: "ONLINE",
      ugc_base_url: "http://deb.ugc.ac.in/api/DebUniqueID"
    };
  },

  // Fetch Student Profile by DEB Unique ID
  async fetchStudentDetails(debId, mode = "ONLINE") {
    const startTime = performance.now();
    try {
      const res = await fetch('/api/deb/fetch-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ DEBUniqueID: debId, mode })
      });
      const data = await res.json();
      const latency = Math.round(performance.now() - startTime);
      return { ...data, latency };
    } catch (e) {
      return {
        status: "error",
        message: `Failed to communicate with backend server: ${e.message}`,
        mode,
        latency: Math.round(performance.now() - startTime)
      };
    }
  },

  // Push Admission Data through Reverse API & Save to Database
  async submitAdmission(formData, mode = "ONLINE") {
    const startTime = performance.now();
    const payload = { ...formData, mode };

    try {
      const res = await fetch('/api/deb/submit-admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const latency = Math.round(performance.now() - startTime);
      return { ...data, latency };
    } catch (e) {
      return {
        status: "error",
        message: `Failed to save admission: ${e.message}`,
        latency: Math.round(performance.now() - startTime)
      };
    }
  },

  // Get Stored Admissions from Database
  async getAdmissions(search = "") {
    try {
      const url = search ? `/api/admissions?search=${encodeURIComponent(search)}` : '/api/admissions';
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error fetching admissions:", e);
    }
    return { status: "success", count: 0, data: [] };
  },

  // Delete Record from Database
  async deleteAdmission(id) {
    try {
      const res = await fetch(`/api/admissions/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error("Error deleting record:", e);
    }
    return { status: "error", message: "Failed to delete record" };
  }
};
