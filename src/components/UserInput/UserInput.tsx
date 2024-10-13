import { SubmitHandler, useForm } from "react-hook-form";
import { UserRequest } from "../../types/userRequest";
import { getTopAlbums } from "../../services/AlbumService";
import "./UserInput.css";

const UserInput = () => {
  const onSubmit: SubmitHandler<UserRequest> = (data: UserRequest) => {
    getTopAlbums(data);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRequest>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        id="user"
        type="text"
        placeholder="Nome do usuário"
        {...register("user", { required: true })}
      />
      {errors.user && <span>Nome é obrigatório</span>}
      <select id="period" {...register("period", { required: true })}>
        <option value="7day">Últimos 7 dias</option>
        <option value="1month">Último mês</option>
        <option value="3month">Últimos 3 meses</option>
        <option value="6month">Últimos 6 meses</option>
        <option value="12month">Último ano</option>
        <option value="overall">Geral</option>
      </select>
      {errors.period && <span>Período é obrigatório</span>}
      <select {...register("limit", { required: true })}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
      </select>
      <button type="submit">Gerar</button>
    </form>
  );
};

export default UserInput;
