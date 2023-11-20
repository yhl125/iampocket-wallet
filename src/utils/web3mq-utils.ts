export function getShortAddress(
  address: string = '',
  num: number = 5,
  endNum = 4,
) {
  let strLength = address.length;
  return (
    address.substring(0, num) +
    '...' +
    address.substring(strLength - endNum, strLength)
  );
}

// date-fns
/**
 * 日期格式化
 * @param time
 * @param format
 */
export function dateFormat(time: number, format?: string) {
  const t = new Date(time);
  format = format || 'Y-m-d h:i:s';
  let year = t.getFullYear();
  let month = t.getMonth() + 1;
  let day = t.getDate();
  let hours = t.getHours();
  let minutes = t.getMinutes();
  let seconds = t.getSeconds();

  const hash = {
    y: year,
    m: month,
    d: day,
    h: hours,
    i: minutes,
    s: seconds,
  };
  // 是否补 0
  const isAddZero = (o: string) => {
    return /M|D|H|I|S/.test(o);
  };
  return format.replace(/\w/g, (o) => {
    // @ts-ignore
    let rt = hash[o.toLocaleLowerCase()];
    return rt >= 10 || isAddZero(o) ? rt : `0${rt}`;
  });
}
