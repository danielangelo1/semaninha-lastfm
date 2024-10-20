import { SubmitHandler, useForm } from "react-hook-form";
import { UserRequest } from "../../types/userRequest";
import { getTopAlbums } from "../../services/AlbumService";
import "./UserInput.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Canvas from "../Canvas/Canvas";
import { ApiResponse } from "../../types/apiResponse";
import useLocalStorage from "../../hooks/useLocalStorage";

const UserInput = () => {
  const [albumData, setAlbumData] = useState<ApiResponse | null>(null);
  const [userInput, setUserInput] = useState<UserRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const { getLocalStorage, setLocalStorage } = useLocalStorage();

  const onSubmit: SubmitHandler<UserRequest> = async (data: UserRequest) => {
    try {
      setUserInput(data);
      setLocalStorage(data);
      setLoading(true);
      const response = await getTopAlbums(data);
      setAlbumData(response);
    } catch (error) {
      toast.error("Usuário não encontrado");
      console.error(error);
    }
  };

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRequest>({
    defaultValues: {
      user: getLocalStorage().user || "",
      period: getLocalStorage().period || "1month",
      limit: parseInt(getLocalStorage().limit || "5"),
      showAlbum: getLocalStorage().showAlbum === "true",
      showPlays: getLocalStorage().showPlays === "false",
    },
  });

  useEffect(() => {
    if (errors.user) {
      toast.error("Usuário é obrigatório");
    }
    if (errors.period) {
      toast.error("Período é obrigatório");
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        id="user"
        type="text"
        placeholder="Nome do usuário"
        {...register("user", { required: true })}
      />
      <select
        id="period"
        aria-label="Selecione o período"
        {...register("period", { required: true })}
      >
        <option value="7day">Últimos 7 dias</option>
        <option value="1month">Último mês</option>
        <option value="3month">Últimos 3 meses</option>
        <option value="6month">Últimos 6 meses</option>
        <option value="12month">Último ano</option>
        <option value="overall">Geral</option>
      </select>
      <select
        aria-label="Selecione o tamanho do grid"
        {...register("limit", { required: true })}
      >
        <option value="3">3x3</option>
        <option value="4">4x4</option>
        <option value="5">5x5</option>
        <option value="6">6x6</option>
        <option value="7">7x7</option>
        <option value="8">8x8</option>
        <option value="9">9x9</option>
        <option value="10">10x10</option>
      </select>
      <button type="submit">Gerar</button>
      <div className="optionals">
        <label htmlFor="showAlbum">Exibir nome do album/artista</label>
        <input type="checkbox" id="showAlbum" {...register("showAlbum")} />
        <label htmlFor="showPlays">Exibir quantidade de plays</label>
        <input
          disabled={!watch("showAlbum")}
          type="checkbox"
          id="showPlays"
          {...register("showPlays")}
        />
      </div>
      {albumData && userInput && (
        <Canvas
          data={albumData}
          userInput={userInput}
          loading={loading}
          loadingHandler={setLoading}
        />
      )}
    </form>
  );
};

export default UserInput;
