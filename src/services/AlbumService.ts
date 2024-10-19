import { ApiResponse } from "../types/apiResponse";
import { UserRequest } from "../types/userRequest";
import { api } from "./api";

const endpoint = "?method=user.gettopalbums&";

export const getTopAlbums = async (data: UserRequest): Promise<ApiResponse> => {
  const gridSize = data.limit * data.limit;
  try {
    const response = await api.get(
      `${endpoint}user=${data.user}&period=${
        data.period
      }&limit=${gridSize}&api_key=${import.meta.env.VITE_API_KEY}&format=json`,
    );

    if (response.status !== 200) {
      throw new Error("Erro na requisição");
    }
    return response.data as ApiResponse;
  } catch (error) {
    throw new Error("Usuário não encontrado");
  }
};
