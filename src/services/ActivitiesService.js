import http from "./http";

class ActivitiesService {
    stats(token) {
        return http.get("/api/v01/web/activities/activity_stats", {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    list(params = {}, token) {
        return http.get("/api/v01/web/activities/activity_list", {
            params,
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    export_to_excel(token) {
        return http.get("/api/v01/web/activities/export_excel", {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}

export default new ActivitiesService