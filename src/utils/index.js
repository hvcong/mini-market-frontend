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

export function convertToVND(value) {
  value = Number(value);
  return value.toLocaleString("it-IT", { style: "currency", currency: "VND" });
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function compareDMY(jsDate1, jsDate2) {
  let d1 = jsDate1.getDate();
  let m1 = jsDate1.getMonth();
  let y1 = jsDate1.getFullYear();

  let d2 = jsDate2.getDate();
  let m2 = jsDate2.getMonth();
  let y2 = jsDate2.getFullYear();

  if (y1 == y2 && m2 == m1 && d1 == d2) {
    return 0;
  }

  if (y2 > y1) {
    return -1;
  }

  if (y2 == y1) {
    if (m2 > m1) {
      return -1;
    } else if (m2 == m1) {
      if (d2 > d1) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  }

  return 1;
}
