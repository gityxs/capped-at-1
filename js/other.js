function notify(text,type,icon) {
    var n = document.createElement("div")
    n.className = "notify_div "+(type||"success")
    n.innerHTML = `
    ${text}
    `
    document.getElementById("notify").appendChild(n)

    setTimeout(_=>{
        n.remove()
    },6000)
}