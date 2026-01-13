import http from "./http";

class UsersService {
    index(token) {
        return http.get("/api/v01/web/users/index", {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    store(data, token) {
        return http.post("/api/v01/web/users/store", data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    show(token) {
        return http.get("/api/v01/web/users/show", {
            headers: { Authorization: `Bearer ${token}` },
        })
    }

    update(ref, data, token) {
        return http.put(`/api/v01/web/users/${ref}/update`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    delete(ref, token) {
        return http.delete(`/api/v01/web/users/${ref}/destroy`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    }

    count(token) {
        return http.get("/api/v01/web/users/count", {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}

export default new UsersService