export interface ExecutorMsgRes {
  total: number;
  data: ExecutorMsgProps[];
}

export interface ExecutorMsgProps {
  workID: number;
  objName: string;
  rdCode: string;
  contractorCompany: string;
  workName: string;
  unit: string;
  planMonth: number;
  year: number;
  month: number;
  executorId: number;
  executorName: string;
  dailyChart: DailyChart;
}

export interface DailyChart {
  day: number;
  plan: number;
  fact: null;
  forecast: null;
}
