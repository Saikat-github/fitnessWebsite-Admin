const converDate = (date) => {
  const newDate = new Date(date);
  const formattedDate = newDate.toLocaleString('en-GB', {
    day: 'numeric',  // e.g., "16"
    month: 'long',   // e.g., "June"
    year: 'numeric', // e.g., "2025"
    hour: '2-digit', // e.g., "09"
    minute: '2-digit', // e.g., "30"
  })
  return formattedDate
}

const converToJustDate = (date) => {
  const newDate = new Date(date);
  const formattedDate = newDate.toLocaleString('en-GB', {
    day: 'numeric',  // e.g., "16"
    month: 'long',   // e.g., "June"
    year: 'numeric', // e.g., "2025"
  })
  return formattedDate
}


const getStartEndDate = (filter) => {
  const today = new Date();
  let startDate, endDate;

  switch (filter) {
    case "today":
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date();
      break;
    case "thisWeek":
      startDate = new Date(today.setDate(today.getDate() - today.getDay())); // Start of week (Sunday)
      endDate = new Date();
      break;
    case "lastWeek":
      startDate = new Date(today.setDate(today.getDate() - today.getDay() - 7)); // Start of last week
      endDate = new Date(today.setDate(today.getDate() + 6));
      break;
    case "thisMonth":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date();
      break;
    case "lastMonth":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "thisYear":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date();
      break;
    case "lastYear":
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
    default:
      return { startDate: null, endDate: null }; // "All Time" option
  }

  startDate = startDate.toISOString()
  endDate = endDate.toISOString()
  return { startDate, endDate };
};





export {converDate, converToJustDate, getStartEndDate};