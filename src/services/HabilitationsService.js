import http from "./http";

class HabilitationsService {
    index(token) {
        return http.get("/api/v01/web/settings/habilitations/index", {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    store(data, token) {
        return http.post("/api/v01/web/settings/habilitations/store", data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    show(token) {
        return http.get("/api/v01/web/settings/habilitations/show", {
            headers: { Authorization: `Bearer ${token}` },
        })
    }

    update(ref, data, token) {
        return http.put(`/api/v01/web/settings/habilitations/${ref}/update`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    delete(ref, token) {
        return http.delete(`/api/v01/web/settings/habilitations/${ref}/destroy`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    }

}

export default new HabilitationsService