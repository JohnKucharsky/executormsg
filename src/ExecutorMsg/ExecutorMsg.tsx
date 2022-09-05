import { TabContext, TabList } from "@mui/lab";
import { Button, CircularProgress, Tab, TextField } from "@mui/material";
import { SyntheticEvent, useState, useEffect } from "react";
import Countdown, { CountdownRendererFn } from "react-countdown";
import { format } from "date-fns";
import "./mm.scss";
import {
  svgChangeViewDots,
  svgChangeViewLines,
  svgClocks,
  svgDone,
} from "./Svg";
import { ExecutorMsgProps, ExecutorMsgRes } from "./ExecutorMsg.def";

function ExecutorMsg({
  queryParams,
}: {
  queryParams: {
    id: string;
    token: string;
  };
}) {
  const [tabValue, setTabValue] = useState("1");
  const [changeView, setChangeView] = useState(false);
  const [executorWorks, setExecutorWorks] = useState<ExecutorMsgProps[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function fetchExecutorMsgData() {
      setError(null);
      fetch(
        `https://dev.api.rm.pragma.info/projects/${Number(
          queryParams.id,
        )}/works/msg/executor`,
        {
          headers: {
            Authorization: `Bearer ${queryParams.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data: ExecutorMsgRes) => {
          setExecutorWorks([...data.data]);
        })
        .catch((error) => {
          setError(error);
        });
    }
    fetchExecutorMsgData();
  }, [refresh]);

  function sendFact(e: SyntheticEvent, fact: number | null, workID: number) {
    e.preventDefault();
    async function postReq() {
      setIsLoading(true);
      setError(null);
      const res = await fetch(
        `https://dev.api.rm.pragma.info/projects/${queryParams.id}/works/msg/executor/update-fact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${queryParams.token}`,
          },
          body: JSON.stringify({
            date: format(new Date() as any, "dd.MM.yyyy"),
            fact,
            workID,
          }),
        },
      );

      const json = await res.json();
      if (res.ok) {
        setExecutorWorks([...executorWorks.filter((v) => v.workID !== workID)]);
        setIsLoading(false);
      }
      if (!res.ok) {
        setError(json.error);
      }
    }
    postReq();
    setRefresh(!refresh);
  }

  useEffect(() => {
    console.log(error);
  }, [error]);

  // const navigate = useNavigate();

  const renderer: CountdownRendererFn = ({
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      return <div>Вы уволены</div>;
    } else {
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  function roundLetters(name: string | undefined) {
    if (!name) return;
    return name?.split(" ")[0].split("")[0] + name?.split(" ")[1]?.split("")[0];
  }

  const dateForRenderer = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1,
  );

  if (!executorWorks.length) {
    return <div>Нет работ...</div>;
  }
  return (
    <div className="mm">
      <div className="mm__topbar">
        <TabContext value={tabValue}>
          <TabList
            onChange={(event: React.SyntheticEvent, newValue: string) => {
              setTabValue(newValue);
            }}>
            <Tab label="Ожидают факт отправки" value="1" />
            <Tab label="Факт отправлен" value="2" />
          </TabList>
        </TabContext>
        <div className="mm__levelone--right">
          {svgClocks}
          <Countdown date={dateForRenderer} renderer={renderer} />
        </div>
      </div>
      <div className="mm__container">
        <div className="mm__levelone">
          <div className="mm__levelone--left">
            <div>
              <h5>{roundLetters(executorWorks[0].executorName)}</h5>
            </div>
            <div>
              <h4>{executorWorks[0].executorName}</h4>
              <p>{executorWorks[0].contractorCompany}</p>
            </div>
          </div>
          <div className="mm__levelone--right">
            <span>
              {svgClocks}
              <Countdown date={dateForRenderer} renderer={renderer} />
            </span>
            <span>
              {changeView ? (
                <span onClick={() => setChangeView((prev) => !prev)}>
                  {svgChangeViewLines}
                </span>
              ) : (
                <span onClick={() => setChangeView((prev) => !prev)}>
                  {svgChangeViewDots}
                </span>
              )}
            </span>
          </div>
        </div>
        {/* <div className="mm__leveltwo">
          <p>Название Работы</p>
          <div className="mm__leveltwo--changeview">
            <h4>Код работы</h4>
          </div>
        </div> */}
        {/* mobile  */}
        <div className="mm__levelthree mm__mobile">
          <h4>ОЖИДАЮТ ФАКТ ОТПРАВКИ</h4>
        </div>
        <span className="mm__mobile ">
          <ItemJsx
            isLoading={isLoading}
            execMsgData={executorWorks.filter(
              (v) => v.dailyChart.fact === null,
            )}
            changeView={false}
            sendFact={sendFact}
          />
        </span>
        <div className="mm__levelfour mm__mobile">
          <h4>Факт отправлен</h4>
        </div>
        <span className="mm__mobile">
          <ItemJsx
            isLoading={isLoading}
            execMsgData={executorWorks.filter(
              (v) => v.dailyChart.fact !== null,
            )}
            changeView={false}
            sendFact={sendFact}
            fact
          />
        </span>
        {/* mobile */}
        {/* tablet */}
        <div className="mm__levelthree mm__tablet">
          <h4>ОЖИДАЮТ ФАКТ ОТПРАВКИ</h4>
        </div>
        <span className="mm__tablet">
          <ItemJsx
            isLoading={isLoading}
            execMsgData={executorWorks.filter(
              (v) => v.dailyChart.fact === null,
            )}
            changeView={changeView}
            sendFact={sendFact}
          />
        </span>
        <div className="mm__levelfour mm__tablet">
          <h4>Факт отправлен</h4>
        </div>
        <span className="mm__tablet">
          <ItemJsx
            isLoading={isLoading}
            execMsgData={executorWorks.filter(
              (v) => v.dailyChart.fact !== null,
            )}
            changeView={changeView}
            sendFact={sendFact}
            fact
          />
        </span>
        {/* tablet */}
        {/* desktop */}
        {tabValue === "1" ? (
          <span className="mm__desktop">
            <ItemJsx
              isLoading={isLoading}
              execMsgData={executorWorks.filter(
                (v) => v.dailyChart.fact === null,
              )}
              changeView={false}
              sendFact={sendFact}
            />
          </span>
        ) : (
          <span className="mm__desktop">
            <ItemJsx
              isLoading={isLoading}
              execMsgData={executorWorks.filter(
                (v) => v.dailyChart.fact !== null,
              )}
              changeView={false}
              sendFact={sendFact}
              fact
            />
          </span>
        )}
      </div>
    </div>
  );
}

export default ExecutorMsg;

function ItemJsx({
  changeView,
  execMsgData,
  fact,
  sendFact,
  isLoading,
}: {
  changeView: boolean;
  execMsgData: ExecutorMsgProps[] | undefined;
  fact?: boolean;
  sendFact: (e: SyntheticEvent, fact: number | null, workID: number) => void;
  isLoading: boolean;
}) {
  if (!execMsgData) return <></>;
  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <div
      style={changeView ? { gridTemplateColumns: "1fr" } : {}}
      className="mm__mainsection">
      {execMsgData.map((v) => (
        <ItemJSXSeparateState
          changeView={changeView}
          fact={fact}
          sendFact={sendFact}
          key={v.workID}
          v={v}
        />
      ))}
    </div>
  );
}

interface ItemJSXSeparateStateProps {
  changeView: boolean;
  fact?: boolean;
  sendFact: (e: SyntheticEvent, fact: number | null, workID: number) => void;
  v: ExecutorMsgProps;
}

function ItemJSXSeparateState(props: ItemJSXSeparateStateProps) {
  const { changeView, fact, sendFact, v } = props;
  const [inputFact, setInputFact] = useState<number | null>(null);
  return (
    <div
      className="mm__mainsection--item"
      style={
        changeView
          ? {
              display: "flex",
              alignItems: "top",
              justifyContent: "space-between",
            }
          : {}
      }>
      <div className="mm__mainsection--top">
        <h4>{v.workName}</h4>
      </div>
      <div className="mm__mainsection--bottom">
        <div className="mm__mainsection--tags">
          <span>{v.unit} </span>
          <span>сегодня: {v.dailyChart.plan || "-"} </span>
          <span>план на месяц: {v.planMonth || "-"} </span>
          <span>прогноз: {v.dailyChart.forecast || "-"} </span>
        </div>
        {!fact ? (
          <form
            onSubmit={(e) => {
              sendFact(e, inputFact, v.workID);
              setInputFact(null);
            }}
            className="mm__mainsection--buttons">
            {" "}
            <TextField
              value={inputFact}
              type="number"
              onChange={(e) => setInputFact(Number(e.target.value))}
              sx={{
                width: changeView
                  ? {
                      sm: 200,
                      md: 250,
                    }
                  : 150,
                ".MuiOutlinedInput-root": {
                  fontSize: 12,
                },
                ".MuiOutlinedInput-input": { padding: "0.5rem" },
              }}
              placeholder="Введите факт"
            />
            <Button
              type="submit"
              color="success"
              sx={{
                width: changeView
                  ? {
                      sm: 200,
                      md: 250,
                    }
                  : 150,
                fontSize: 12,
                backgroundColor: "rgba(141, 212, 200, 0.15)",
                color: "#2E7D32",

                boxShadow: "none",
                "&:hover": {
                  backgroundColor: " rgba(141, 212, 200, 0.4)",
                  color: "#2E7D32",
                },
              }}
              variant="contained">
              отправить
            </Button>
          </form>
        ) : (
          <div className="mm__mainsection--buttons">
            <div
              className={`mm__mainsection--fakeinput ${
                changeView && "tabletfakeinputwidth"
              }`}>
              {v.dailyChart.fact} <span>{v.unit}</span>
            </div>
            <Button
              color="success"
              startIcon={svgDone}
              sx={{
                width: changeView
                  ? {
                      sm: 200,
                      md: 250,
                    }
                  : 150,
                fontSize: 12,
                color: "#0288D1",
              }}>
              отправлено
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
