import dayjs from "dayjs";
export function sqlToDDmmYYY(date) {
  var myDate = new Date(date);

  let d = myDate.getDate();
  let m = myDate.getMonth() + 1;
  let y = myDate.getFullYear();

  if (d < 10) {
    d = "0" + d;
  }
  if (m < 10) {
    m = "0" + m;
  }

  return d + "/" + m + "/" + y;
}

// export function ddMMyyToSql(date) {
//   // return new Date(date).toISOString().slice(0, 19).replace("T", " ");
// }

export function sqlToAntd(date) {
  let result = sqlToDDmmYYY(date);
  result = dayjs(result, "DD/MM/YYYY");
  if (isNaN(result.$D)) {
    return "";
  }
  return result;
}

export function dmyToAntd(date) {
  if (date) {
    // check date is dmy format
    let arr = date.split("/");
    if (arr.length == 3) {
      let result = dayjs(date, "DD/MM/YYYY");
      if (isNaN(result.$D)) {
        return "";
      }
      return result;
    } else {
      return sqlToAntd(date);
    }
  }
  return "";
}

export function antdToDmy(date) {
  let d = date.$D < 10 ? "0" + date.$D : date.$D;
  let m = date.$M + 1 < 10 ? "0" + (date.$M + 1) : date.$M + 1;
  let y = date.$y;
  return d + "/" + m + "/" + y;
}

export function dmyToYmd(dmy) {
  if (dmy) {
    let arr = dmy.split("/");
    return arr[2] + "/" + arr[1] + "/" + arr[0];
  }
  return "";
}
