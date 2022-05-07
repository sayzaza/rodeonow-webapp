
/*
 * format date display
 */
function convertTimeToDate(date) {
  let options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
  };
  return new Date(date).toLocaleDateString("en-us", options);
}
module.exports.convertTimeToDate = convertTimeToDate;
/*
 * minimized datetime
 */
function convertTimeToDateMin(date) {
  let options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
  };
  return new Date(date).toLocaleDateString("en-us", options);
}
module.exports.convertTimeToDateMin = convertTimeToDateMin;

function getNowTimeString() {
  let options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
  };
  return new Date().toLocaleDateString("en-us", options);
}
module.exports.getNowTimeString = getNowTimeString;


function getNowTimeMinString() {
  let options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      //second: "2-digit",
      //hour12: true,
  };
  return new Date().toLocaleDateString("en-us", options);
}
module.exports.getNowTimeMinString = getNowTimeMinString;


/**
 * Get number of days between two time stamps
 * @param {Date} startTime
 * @param {Date} endTime
 * @returns {int} Number of days between startTime and endTime
 */
function getNumDays(startTime, endTime) {
    return Math.round((endTime - startTime) / (24 * 60 * 60 * 1000));
}
module.exports.getNumDays = getNumDays;

/*
 * returns how to style x-axis ticks
 */
function getTimeTicks(timeRangeDifference){
    // time ranges (in seconds * ms)
    const oneMinute = 60 * 1000;
    const tenMinutes = 10 * oneMinute;
    const oneHour = 6 * tenMinutes;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    // const twoWeek = 2 * oneWeek;
    const oneMonth = 31 * oneDay;
    const threeMonths = 3 * oneMonth;
    const sixMonths = 6 * oneMonth;
    const oneYear = 12 * oneMonth;

    // less than 1 minute
    if(timeRangeDifference < oneMinute){
        return "%H:%M:%S";
    }
    // less than 10 minutes
    else if(timeRangeDifference < tenMinutes){
        return "%H:%M:%S";
    }
    // less than 1 hour
    else if(timeRangeDifference < oneHour){
        return "%H:%M:%S";
    }
    // less than 1 day
    else if(timeRangeDifference < oneDay){
        return "%H:%M";
    }
    // less than 1 week
    else if(timeRangeDifference < oneWeek){
        return "%m/%d/%y %H:%M";
    }
    // less than 2 weeks
    // else if(timeRangeDifference < oneDay){
    //     return "%m/%d/%y %H:%M";
    // }
    // less than 1 month
    else if(timeRangeDifference < oneMonth){
        return "%m/%d/%y";
    }
    // less than 3 months
    else if(timeRangeDifference < threeMonths){
        return "%m/%d/%y";
    }
    // less than 6 months
    else if(timeRangeDifference < sixMonths){
        return "%m/%d/%y";
    }
    // less than 1 year
    else if(timeRangeDifference < oneYear){
        return "%m/%d/%y";
    }
    // over a year
    else{
        return "%m/%d/%y";
    }
}
module.exports.getTimeTicks = getTimeTicks;
