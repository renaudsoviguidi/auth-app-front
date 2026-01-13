import Swal from "sweetalert2";

/// - Toast pour les messages de succès
export const successToast = (message) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message || "Opération réussie.",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

/// - Popup pour les messages d'erreur
export const errorToast = (message) => {
  Swal.fire({
    icon: "error",
    title: "Erreur",
    text: message || "Une erreur inattendue est survenue.",
    confirmButtonText: "Ok",
    confirmButtonColor: "#d33",
  });
};

/// - Popup pour les messages de confirmation et d'avertissement
export const warningToast = async (
  message,
  confirmText = "Oui",
  cancelText = "Non"
) => {
  return await Swal.fire({
    icon: "warning",
    title: "Attention",
    text: message || "Voulez-vous confirmer cette action ?",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#f59e0b",
    cancelButtonColor: "#6b7280",
  });
};

export const dangerToast = async (
  message,
  confirmText = "Oui",
  cancelText = "Non"
) => {
  return await Swal.fire({
    icon: "warning",
    title: "Attention",
    text: message || "Cette action est irréversible",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#ff0000",
    cancelButtonColor: "#6b7280",
  });
};
