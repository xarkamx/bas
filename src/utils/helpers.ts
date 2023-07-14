export function generateRandomString() {
  let time = new Date().getTime();
  time/=10
  
  time = Math.floor(time);
  const timeString = time.toString();
  const timeStringWithComas = timeString.replace(/(\d{2})/g, '$1,');
  
  const timeArray = timeStringWithComas.split(',');
  
  timeArray.reverse();
  const text =timeArray.map(
    (item:any) => {
      item = parseInt(item,10)
      if(isNaN(item)){
        item = 0;
      }

      let pos = (item/100) * 25;
      pos = Math.round(pos);
      return String.fromCharCode(65 + pos)}
  )
  .join('').trimStart().replace(/ /g,'');
  return text;
}

export function snakeCaseReplacer(obj:any) {
  const newObj:any = {};
  Object.keys(obj).forEach((key) => {
    newObj[snakeCase(key)] = obj[key];
  });
  return newObj;
}

export function snakeCase(str:string) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}