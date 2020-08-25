export default function getDatesBetweenDates(startDate: Date, endDate: Date): Date[] {
  let dates: Date[] = []
  //to avoid modifying the original date
  const theDate = new Date(startDate)
  while (theDate < endDate) {
    dates = [...dates, new Date(theDate)]
    theDate.setDate(theDate.getDate() + 1)
  }
  dates = [...dates, endDate]
  return dates
}
