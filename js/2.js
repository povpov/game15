let mixItems;
function toMix() {
  mixItems =[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  mixItems.sort(function () {
      return Math.random() - 0.5;
  });
}
function validate() {
  let k;
  while (true) {
    toMix();
    k = 0;
    
    for (let i = 0; i < 15; i++) {
      if (mixItems[i] == 16) {
        k += Math.floor(i / 4) + 1;
        console.log(" Math.floor=", k);
      } else {
        for (let j = i; j < 15; j++) {
          if (mixItems[i] > mixItems[j]) {
            k++;
            console.log("k++", k);
          }
        }
      }
    }
    console.log("валидация", (k % 2 == 0), "k=",k);
    console.log(mixItems);
    if (k % 2 == 0) break;
  }
}
validate();