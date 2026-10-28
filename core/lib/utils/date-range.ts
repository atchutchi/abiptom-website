export interface MonthRange {
  start: string;
  end: string;
}

export function getMonthRange(ano: number, mes: number): MonthRange {
  const month = String(mes).padStart(2, "0");
  const lastDay = new Date(ano, mes, 0).getDate();

  return {
    start: `${ano}-${month}-01`,
    end: `${ano}-${month}-${String(lastDay).padStart(2, "0")}`,
  };
}

export function getMonthRangeFromInput(monthInput?: string): MonthRange | null {
  if (!monthInput || !/^\d{4}-\d{2}$/.test(monthInput)) return null;

  const [ano, mes] = monthInput.split("-").map(Number);
  if (mes < 1 || mes > 12) return null;

  return getMonthRange(ano, mes);
}
