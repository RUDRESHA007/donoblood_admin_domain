const circle = document.querySelector('.circle');
let inner_text=90

var progress_start=0;

let progress = setInterval(() => {
    progress_start++;
const degree=progress_start * 3.6;

document.querySelector('.inner_text').innerHTML=`${progress_start}%`

circle.style.background=`conic-gradient(
    white ${degree}deg,
    rgb(0, 0, 0) 0deg
)`
if (progress_start == inner_text) {
    clearInterval(progress);

  }
}, 40);
