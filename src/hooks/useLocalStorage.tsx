import { UserRequest } from "../types/userRequest";

export default function useLocalStorage() {
  const setLocalStorage = (values: UserRequest) => {
    localStorage.setItem("user", values.user);
    localStorage.setItem("period", values.period);
    localStorage.setItem("limit", values.limit.toString());
    localStorage.setItem("showAlbum", values.showAlbum?.toString() || "false");
    localStorage.setItem("showPlays", values.showPlays?.toString() || "false");
    localStorage.setItem("type", values.type || "album");
  };

  const getLocalStorage = () => {
    const user = localStorage.getItem("user");
    const period = localStorage.getItem("period");
    const limit = localStorage.getItem("limit");
    const showAlbum = localStorage.getItem("showAlbum");
    const showPlays = localStorage.getItem("showPlays");
    const type = localStorage.getItem("type");

    return { user, period, limit, showAlbum, showPlays, type };
  };

  return { setLocalStorage, getLocalStorage };
}
