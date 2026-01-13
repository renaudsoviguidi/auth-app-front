import http from "./http";

class RolesService {
    index(token) {
        return http.get("/api/v01/web/settings/roles/index", {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    store(data, token) {
        return http.post("/api/v01/web/settings/roles/store", data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    show(token) {
        return http.get("/api/v01/web/settings/roles/show", {
            headers: { Authorization: `Bearer ${token}` },
        })
    }

    update(ref, data, token) {
        return http.put(`/api/v01/web/settings/roles/${ref}/update`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    delete(ref, token) {
        return http.delete(`/api/v01/web/settings/roles/${ref}/destroy`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    }
}

export default new RolesService