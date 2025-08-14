import { SubmitHandler, useForm } from "react-hook-form";
import { UserRequest } from "../../types/userRequest";
import "./UserInput.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Canvas from "../Canvas/Canvas";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useLastFmData } from "../../hooks/useLastFmData";
import { TIME_PERIODS, CONTENT_TYPES, GRID_SIZES, DEFAULT_VALUES, ERROR_MESSAGES } from "../../constants";

const UserInput = () => {
  const [userInput, setUserInput] = useState<UserRequest | null>(null);
  const { getLocalStorage, setLocalStorage } = useLocalStorage();
  const { albumData, artistData, fetchData } = useLastFmData();

  const onSubmit: SubmitHandler<UserRequest> = async (data: UserRequest) => {
    setUserInput(data);
    setLocalStorage(data);
    await fetchData(data);
  };

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserRequest>({
    defaultValues: {
      user: getLocalStorage().user || "",
      period: getLocalStorage().period || DEFAULT_VALUES.PERIOD,
      limit: parseInt(getLocalStorage().limit || DEFAULT_VALUES.LIMIT.toString()),
      showAlbum: getLocalStorage().showAlbum === "true",
      showPlays: getLocalStorage().showPlays === "false",
      type: getLocalStorage().type || DEFAULT_VALUES.TYPE,
    },
  });

  const showAlbum = watch("showAlbum");

  useEffect(() => {
    if (!showAlbum) {
      setValue("showPlays", false);
    }
  }, [showAlbum, setValue]);

  useEffect(() => {
    if (errors.user) {
      toast.error(ERROR_MESSAGES.USER_REQUIRED);
    }
    if (errors.period) {
      toast.error(ERROR_MESSAGES.PERIOD_REQUIRED);
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="user-input">
        <label htmlFor="user">Nome do usuário</label>
        <input
          id="user"
          type="text"
          placeholder="Digite o nome do LastFM"
          {...register("user", { required: true })}
        />
      </div>
      <div className="select-options">
        <div className="select">
          <label htmlFor="period">Período</label>
          <select
            id="period"
            aria-label="Selecione o período"
            {...register("period", { required: true })}
          >
            {TIME_PERIODS.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
        <div className="select">
          <label htmlFor="limit">Tamanho</label>
          <select
            aria-label="Selecione o tamanho do grid"
            {...register("limit", { required: true })}
          >
            {GRID_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
        <div className="select">
          <label htmlFor="type">Tipo</label>
          <select
            aria-label="Selecione o tipo de imagem"
            {...register("type", { required: true })}
          >
            {CONTENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="optionals">
        <label htmlFor="showAlbum">Exibir nome do album/artista</label>
        <input type="checkbox" id="showAlbum" {...register("showAlbum")} />
        <label htmlFor="showPlays">Exibir quantidade de plays</label>
        <input
          disabled={!watch("showAlbum")}
          checked={watch("showAlbum") && watch("showPlays")}
          type="checkbox"
          id="showPlays"
          {...register("showPlays")}
        />
        <button type="submit">Gerar</button>
      </div>
      {userInput && (
        <>
          {albumData ? (
            <Canvas
              data={albumData}
              userInput={userInput}
            />
          ) : artistData ? (
            <Canvas
              data={artistData}
              userInput={userInput}
            />
          ) : null}
        </>
      )}
    </form>
  );
};

export default UserInput;
