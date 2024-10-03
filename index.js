let scoreHome = 0
let scoreGuest = 0
let timer = 720 //12*60 NBA
let timerOn = false
let period = 0
let periodOn = false
let intervalId = null
let bDebugMode = false
let bOtherGame = false
let delay = 0
const debugdialog = document.getElementById('debugDialog')
const timerdialog = document.getElementById('timerDialog') 
const gameoverdialog = document.getElementById('gameOver')
const emojiGo = document.getElementById('emoji')
const digitsScore = document.getElementsByClassName('scoreDigits')
const hgButtons = document.getElementsByClassName("hgBtn") 
const buzzer = new Audio("basketball-buzzer.mp3")
const ePeriod = document.getElementById("period")
const eBtnTimer = document.getElementById("btnTimer")

function addPoints(pts, str) {
    if (str == "Home") {
        scoreHome += pts
    } else {
        scoreGuest += pts
    }
    dispScore()
}

function newGame() {
    eBtnTimer.disabled = true
    if (!bOtherGame) {bOtherGame = true} else {delay = 1}
    disableDigitsScore()
    const myTimeout = setTimeout(showDebugDialog, 3200 + 1700*delay) 
    disableHgBtn(true)
    scoreHome = 0
    scoreGuest = 0
    timer = 720
    period = 0
    const myTimeout2 = setTimeout(dispScore, 1 + 1700*delay)
    dispPeriod()
    dispTimer()
    foldEmoji()
    const myTimeout1 = setTimeout(enableDigitsScore, 1 + 1700*delay)
}

function endGame() {
    if (scoreHome > scoreGuest) {changeBckImage(emojiGo,"grinning")}
    if (scoreHome == scoreGuest) {changeBckImage(emojiGo,"confus")}
    if (scoreHome < scoreGuest) {changeBckImage(emojiGo,"colère")}
    unfoldEmoji()
}

function dispScore() {
    document.getElementById("homescore").textContent = scoreHome
    document.getElementById("guestscore").textContent = scoreGuest
    highlightLeader()
}

function dispPeriod() {ePeriod.textContent = period}

function highlightLeader() {
    if (scoreHome == scoreGuest) { changeColors("#EEEEEE", "#EEEEEE") } 
    else if (scoreHome > scoreGuest) { changeColors("lightgreen", "red") } 
    else { changeColors("red", "lightgreen") } 
}

function changeColors(color1, color2) {
    document.getElementById('home').style.color = color1;
    document.getElementById('guest').style.color = color2;
}

function manageTimer() {
    // Vérifier l'état du flag timerOn
    if (!timerOn) {
        timerOn =true
        eBtnTimer.textContent = "stop"
        // Lancer l'intervalle 
        if (!intervalId) {
            intervalId = setInterval(decTimer, 1000);
        }
        disableHgBtn(false)
        if (!periodOn) {
            period++
            periodOn =true
        }  
        dispPeriod()
        dispTimer()
    } else {
        timerOn =false
        disableHgBtn(true)
        eBtnTimer.textContent = "start"
        clearInterval(intervalId)
        intervalId = null
    }
}

function decTimer() {
    // Décrémenter le timer
    bDebugMode ? timer -=30 : timer--
    dispTimer()
    // Gestion fin de période
    if (timer <= 0) {
        timerOn = false
        clearInterval(intervalId)
        intervalId = null
        disableHgBtn(true)
        periodOn = false
        // Faire retentir le buzzer
        buzzer.play();
        // Remettre le bouton du timer à "start"
        document. getElementById("btnTimer").textContent = "start"
        // Afficher le timer et gérer la fin de partie
        if (period == 4) {endGame()}
        else {timer = 720} // Recharger le timer à 12 minutes (720 secondes)
    }
}

function dispTimer() {
    let minutes = parseInt(timer / 60, 10)
    let seconds = parseInt(timer % 60, 10)
    minutes = minutes < 10 ? "0" + minutes : minutes
    seconds = seconds < 10 ? "0" + seconds : seconds
    document.getElementById("timer").textContent  = `${minutes}:${seconds}`
}

function showDebugDialog() {
    debugdialog.showModal();
}

function debug() { 
    debugdialog.close();
    bDebugMode = true
    eBtnTimer.disabled = false
}

function normal() {
    debugdialog.close();
    bDebugMode = false
    eBtnTimer.disabled = false
}

function disableHgBtn(bool) {
    for (const property in hgButtons) {hgButtons[property].disabled = bool}
}

function enableDigitsScore() {
    for (let i = 0; i < 2; i++) {onDigitsScore(digitsScore[i])}
}

function disableDigitsScore() {
    // for (const property in digitsScore) {offDigitsScore(digitsScore[property])}
    for (let i = 0; i < 2; i++) {offDigitsScore(digitsScore[i])}
}

function unfoldEmoji() {if(!emojiGo.classList.contains('unfolded')) {emojiGo.classList.add('unfolded'); }}

function foldEmoji() {emojiGo.classList.remove('unfolded');}

function offDigitsScore(element) {if(!element.classList.contains('off')) {element.classList.add('off'); }}

function onDigitsScore(element) {element.classList.remove('off');}

function changeBckImage(element, emojiName) {element.style.backgroundImage = `url(${emojiName}.svg)`}

