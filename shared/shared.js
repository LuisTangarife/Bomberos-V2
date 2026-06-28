document.addEventListener("DOMContentLoaded",()=>{

const menu=document.getElementById("menuButton");

const sidebar=document.getElementById("sidebar");

if(menu){

menu.onclick=()=>{

sidebar.classList.toggle("show");

};

}

const clock=document.getElementById("clock");

function updateClock(){

if(!clock) return;

const now=new Date();

clock.innerHTML=now.toLocaleString("es-CO",{

dateStyle:"full",

timeStyle:"short"

});

}

updateClock();

setInterval(updateClock,60000);

});
