const dayjs = require('dayjs');
exports.generateDateRangeMonth = () => {
  let endMonth = dayjs().endOf('month').endOf('day');
  const startedDate = new Date(
    `${endMonth.get('year')}-${endMonth.get('month') + 1}-01`
  ).setUTCHours(23, 59, 59, 999);
  const endDate = new Date(endMonth).setUTCHours(23, 59, 59, 999);
  return {
    startedDate,
    endDate,
  };
};
