import { UserRequest } from "../types/userRequest";
import { api } from "./api";

const endpoint = "?method=user.gettopalbums&";

export const getTopAlbums = async (data: UserRequest) => {
  try {
    const response = await api.get(
      `${endpoint}user=${data.user}&period=${data.period}&limit=${
        data.limit
      }&api_key=${import.meta.env.VITE_API_KEY}&format=json`,
    );
    return response.data;
  } catch (error) {
    return { message: "Ocorreu um erro durante a requisição" };
  }
};
