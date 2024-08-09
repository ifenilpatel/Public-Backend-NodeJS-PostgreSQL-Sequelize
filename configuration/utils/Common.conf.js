const moment = require("moment");

const diffTwoDateTime = (newTime, oldTime) => {
  newTime = moment(newTime);
  oldTime = moment(oldTime);
  const duration = moment.duration(newTime.diff(oldTime));

  return {
    days: duration.asDays(),
    hours: duration.asHours(),
    minutes: duration.asMinutes(),
    months: duration.asMonths(),
  };
};

const convertToDateTime = (value) => {
  let result = moment(value).utc().format("YYYY-MM-DD HH:mm:ss");
  return result;
};

const currentDate = () => {
  let result = moment().utc().format("YYYY-MM-DD HH:mm:ss");
  return result;
};

const randomNumber = (value) => {
  if (value < 1 || value > 6) {
    throw new Error("Value must be between 1 and 6");
  }
  let a = Math.floor(100000 + Math.random() * 900000);
  a = String(a);
  a = a.substring(0, value);
  return a;
};

module.exports = {
  diffTwoDateTime,
  convertToDateTime,
  currentDate,
  randomNumber,
};
