function buildStartEndDate(startHour: string, date?: string ): [Date, Date] {
  if(!date){
    date = "2024-06-01";
  }
  else
  date = date;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = startHour.split(":").map(Number);
  const start = new Date(year, month - 1, day, hour, minute);
  const end = new Date(start.getTime() + 90 * 60000); // 1.5h pozniej
  return [start, end];
}

export default buildStartEndDate