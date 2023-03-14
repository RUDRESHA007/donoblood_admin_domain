const message = document.querySelector('.success')
console.log(message.children[0].innerHTML.length);
if(message.children[0].innerHTML.length<=100  ){
    message.style.display='none'
}
else{
 
    message.style.display='block'
    setInterval(() => {
        message.style.display='none'

    }, 3000);
}
const char =message.children[0].innerHTML
if (char.search("Token")>=0 ) {
    message.style.backgroundColor='#f45d52'
    message.style.color='#9b1107'

}
else if(char.search("approved")>=0) {
    message.style.backgroundColor='#25b569';
    message.style.color='#022809'


}
console.log(char);
// window.alert(char)
// alert()
