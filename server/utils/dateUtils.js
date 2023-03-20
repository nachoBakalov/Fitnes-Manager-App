exports.dateToYYYYMMDDHHMINSEC = (date) => {
  const bufferHours = date.getHours();
  const hours = bufferHours < 10 ? "0" + bufferHours : bufferHours.toString();
  return (
    date.getFullYear() * 1e4 +
    (date.getMonth() + 1) * 100 +
    date.getDate() +
    addLeadingZero(date.getHours()) +
    addLeadingZero(date.getMinutes()) +
    addLeadingZero(date.getSeconds()) +
    ""
  ); // "20211124"
};

function addLeadingZero(number) {
  return number < 10 ? "0" + number : number.toString();
}

exports.incrementMonth = (theDate) => {
  console.log("theDate: ", theDate);
  // const resultDate = new Date(theDate.valueOf());

  let year = theDate.getYear();

  if (theDate.getMonth() == 0 && theDate.getDate() >= 29) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      // If leap year then the end of February is 29, otherwise 28
      theDate.setMonth(theDate.getMonth() + 1, 29);
    } else theDate.setMonth(theDate.getMonth() + 1, 28);
  } else if (
    (theDate.getMonth() == 2 ||
      theDate.getMonth() == 4 ||
      theDate.getMonth() == 7 ||
      theDate.getMonth() == 9) &&
    theDate.getDate() == 31
  ) {
    theDate.setMonth(theDate.getMonth() + 1, 30);
  }
  console.log("theDate: ",theDate);
  // return resultDate;
};

exports.addMonths = (date, months) => {
  const dateCopy = new Date(date);

  dateCopy.setMonth(dateCopy.getMonth() + months);

  return dateCopy;
}

