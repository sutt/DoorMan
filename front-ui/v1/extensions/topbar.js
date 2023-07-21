
// these methods don't work
// window.onload = function () {
    // alert("hello topbar")
// }
// document.addEventListener("DOMContentLoaded", function() {
//     alert("red!")
//   });
setTimeout(function() {
    
    console.log("topbar.js, adding doorman views -------")
    
    var targetElem = document.getElementById("quicksettings")
    if (targetElem == null) {
        console.log("topbar.js, targetElem is null")
        return
    } 
    
    var section = document.createElement("div")
    section.classList = "svelte-15lo0d8 compact"
    
    var link = document.createElement("a")
    link.href = "/home"
    var label = document.createElement("label")
    var span = document.createElement("span")
    span.innerHTML = "Doorman"
    label.appendChild(span)
    link.appendChild(label)

    section.appendChild(link)

    targetElem.appendChild(section)

}, 3000);
