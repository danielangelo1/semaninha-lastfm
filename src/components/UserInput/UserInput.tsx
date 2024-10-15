import { SubmitHandler, useForm } from "react-hook-form";
import { UserRequest } from "../../types/userRequest";
import { getTopAlbums } from "../../services/AlbumService";
import "./UserInput.css";
import { toast } from "react-toastify";
import { useEffect } from "react";

const UserInput = () => {
  const onSubmit: SubmitHandler<UserRequest> = (data: UserRequest) => {
    getTopAlbums(data);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRequest>();

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
      <select id="period" {...register("period", { required: true })}>
        <option value="7day">Últimos 7 dias</option>
        <option value="1month">Último mês</option>
        <option value="3month">Últimos 3 meses</option>
        <option value="6month">Últimos 6 meses</option>
        <option value="12month">Último ano</option>
        <option value="overall">Geral</option>
      </select>
      <select {...register("limit", { required: true })}>
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
        <input type="checkbox" {...register("showAlbum")} />
        <label htmlFor="showPlays">Exibir quantidade de plays</label>
        <input type="checkbox" {...register("showPlays")} />
      </div>
    </form>
  );
};

export default UserInput;
