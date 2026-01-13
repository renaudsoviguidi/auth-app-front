import axios from "axios";
import { store } from "../app/store";
import { resetAuthData, updateToken } from "../app/providers/authSlice";

var app_url =
  import.meta.env.NODE_ENV === "production"
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_DEV_API_URL;
export { app_url };

const http = axios.create({
  baseURL: app_url,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});


// Fonction pour afficher le popup
function showPopup() {
  const popup = document.getElementById("custom-popup");
  if (popup) {
    popup.style.display = "flex";
  }
}

// Fonction pour masquer le popup
function hidePopup() {
  const popup = document.getElementById("custom-popup");
  if (popup) {
    popup.style.display = "none";
  }
}

// Créez une variable pour suivre l'état du chargement
let isLoading = false;

//créer un intercepteur
http.interceptors.request.use(
  (config) => {
    // Vérifiez si le chargement est déjà en cours
    if (!isLoading) {
      // Afficher le loader
      showPopup();
      // Mettre à jour l'état du chargement
      isLoading = true;
    }

    const state = store.getState();
    const token = state?.auth?.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Add a response interceptor
http.interceptors.response.use(
  (response) => {
    // Masquer le loader
    setTimeout(() => {
      hidePopup();
      // Mettre à jour l'état du chargement
      isLoading = false;
    }, 2000);
    return response;
  },
  async (error) => {
    //Récupérer la requette initiale
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      // Afficher le loader pour l'actualisation du token
      showPopup();

      return new Promise((resolve, reject) => {
        axios
          .post(`${app_url}api/v01/web/auth/refresh-token`, { refreshToken })
          .then(({ data }) => {
            store.dispatch(updateToken(data));
            http.defaults.headers.common["Authorization"] =
              "Bearer " + data.token;
            originalRequest.headers["Authorization"] = "Bearer " + data.token;
            processQueue(null, data.token);
            resolve(http(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            store.dispatch(resetAuthData());
            window.location.href = "/";
            reject(err);
          })
          .finally(() => {
            // Masquer le loader après l'actualisation du token
            hidePopup();
            isRefreshing = false;
          });
      });
    }
    // Masquer le loader
    hidePopup();
    // Mettre à jour l'état du chargement
    isLoading = false;

    return Promise.reject(error);
  }
);

export default http;
