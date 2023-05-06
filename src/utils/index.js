import dayjs from "dayjs";
import productApi from "../api/productApi";
import imageApi from "../api/imageApi";
import handleAfter from "./handleStore";
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

export function sqlToHHmmDDmmYYYY(date) {
  var myDate = new Date(date);
  let d = myDate.getDate();
  let m = myDate.getMonth() + 1;
  let y = myDate.getFullYear();
  let hh = myDate.getHours();
  let minutes = myDate.getMinutes();
  if (d < 10) {
    d = "0" + d;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (hh < 10) {
    hh = "0" + hh;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return hh + ":" + minutes + " , " + d + "/" + m + "/" + y;
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

export function antdToYmd(date) {
  let d = date.$D < 10 ? "0" + date.$D : date.$D;
  let m = date.$M + 1 < 10 ? "0" + (date.$M + 1) : date.$M + 1;
  let y = date.$y;
  return y + "/" + m + "/" + d;
}

export function getStartToDay() {
  let now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  return now;
}

export function dmyToYmd(dmy) {
  if (dmy) {
    let arr = dmy.split("/");
    return arr[2] + "/" + arr[1] + "/" + arr[0];
  }
  return "";
}

export function convertToVND(value) {
  if (!value && value != 0) {
    return;
  }
  let num = value || 0;
  num = Number(num);
  return num.toLocaleString("it-IT");
}

export function uid() {
  let string =
    Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
  return string.toUpperCase();
}

export function codeVocherGenarate() {
  return (
    "VC" +
    (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 4)
    ).toLocaleUpperCase()
  );
}

export function uidNumber() {
  return `${Math.random()}`.substr(2, 7);
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

  if (y1 < y2) {
    return -1;
  }

  if (y2 == y1) {
    if (m1 < m2) {
      return -1;
    } else if (m2 == m1) {
      if (d1 < d2) {
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

export function formatDateJsToYMD(date) {
  if (date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  } else {
    console.log("date wrong");
  }
}

export function isVietnamesePhoneNumberValid(number) {
  return /0(3|5|7|8|9)+([0-9]{8})\b/.test(number);
}

export function isEmailValid(email) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

export async function getPUTid(productId, utId) {
  if (!productId) return null;
  if (!utId) return null;
  let res = await productApi.findOneById(productId);
  if (!res.isSuccess) {
    return;
  }

  let put = res.product.ProductUnitTypes.filter(
    (item) => item.UnitTypeId == utId
  )[0];
  return put && put.id;
}

export const uploadImage = {
  one: async (file) => {
    if (file) {
      let res = await imageApi.uploadOne(file);
      if (res.uri) {
        return res.uri;
      }
    }
    return "";
  },
  many: async (fileList = []) => {
    let result = [];

    for (const file of fileList) {
      let res = await imageApi.uploadOne(file);
      if (res.uri) {
        result.push(res.uri);
      }
    }
    return result;
  },
};

export function sortData(data = [], key) {
  let newData = [...data];
  function compare(a, b) {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  }

  newData.sort(compare);
  return newData;
}

export { handleAfter };
