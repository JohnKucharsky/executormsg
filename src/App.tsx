import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ExecutorMsg from "./ExecutorMsg/ExecutorMsg";

interface queryParamsProps {
  id: string;
  token: string;
}

function App() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState<queryParamsProps | null>(null);

  function paramsHas() {
    if (searchParams.has("token") && searchParams.has("id")) {
      const token = searchParams.get("token");
      const id = searchParams.get("id");
      return {
        token,
        id,
      };
    }
  }
  function storageHas() {
    const stId = localStorage.getItem("id");
    const stToken = localStorage.getItem("token");
    return {
      stId,
      stToken,
    };
  }

  useEffect(() => {
    function handleParams() {
      if (paramsHas()?.id && paramsHas()?.token) {
        const id = paramsHas()?.id;
        const token = paramsHas()?.token;
        if (!id || !token) return;
        setQueryParams({
          id,
          token,
        });
        localStorage.setItem("id", id);
        localStorage.setItem("token", token);
        searchParams.delete("id");
        searchParams.delete("token");
        setSearchParams(searchParams);
        return;
      }
      if (storageHas().stId && storageHas().stToken) {
        const stId = storageHas().stId;
        const stToken = storageHas().stToken;
        if (!stId || !stToken) return;
        setQueryParams({
          id: stId,
          token: stToken,
        });
        return;
      }
      setQueryParams(null);
    }
    handleParams();
  }, []);

  if (!queryParams) {
    return <div>Нет информации для отображения</div>;
  }

  return <ExecutorMsg queryParams={queryParams} />;
}

export default App;
