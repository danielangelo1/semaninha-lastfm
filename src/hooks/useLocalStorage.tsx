import { UserRequest } from "../types/userRequest";

export default function useLocalStorage() {
  const setLocalStorage = (values: UserRequest) => {
    localStorage.setItem("user", values.user);
    localStorage.setItem("period", values.period);
    localStorage.setItem("limit", values.limit.toString());
    localStorage.setItem("showAlbum", values.showAlbum?.toString() || "false");
    localStorage.setItem("showPlays", values.showPlays?.toString() || "false");
  };

  const getLocalStorage = () => {
    const user = localStorage.getItem("user");
    const period = localStorage.getItem("period");
    const limit = localStorage.getItem("limit");
    const showAlbum = localStorage.getItem("showAlbum");
    const showPlays = localStorage.getItem("showPlays");

    return { user, period, limit, showAlbum, showPlays };
  };

  return { setLocalStorage, getLocalStorage };
}
