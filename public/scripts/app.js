const timerButton = document.querySelector('.timer-button');
const timeText = document.querySelector('.time');
const phaseText = document.querySelector('.phase');
let timeStart = localStorage.getItem('PomodoroTimeStart');
let duration = localStorage.getItem('PomodoroDuration');
let phase = localStorage.getItem('PomodoroPhase');

function playSound() {
    const audio = new Audio('assets/sounds/finished.mp3');
    if (!audio) return;
    audio.volume = 0.2;
    audio.currentTime = 0;
    audio.play();
}

function initValues() {
    duration = 1500;
    phase = 'Work Time';
}

function setupPomodoro() {
    let min = duration / 60;
    let sec = duration % 60;
    min = min < 10 ? `0${min}` : min;
    sec = sec < 10 ? `0${sec}` : sec;
    timeText.textContent = `${min}:${sec}`;
    phaseText.textContent = `${phase}`;
}

function toggleButton() {
    if (timerButton.disabled === true) {
        timerButton.disabled = false;
        timerButton.style.background = '#5ab82f';
    } else {
        timerButton.disabled = true;
        timerButton.style.background = '#ffffff';
    }
}

function storeValues() {
    localStorage.setItem('PomodoroTimeStart', timeStart);
    localStorage.setItem('PomodoroDuration', duration);
    localStorage.setItem('PomodoroPhase', phase);
}

function clearValues() {
    localStorage.removeItem('PomodoroTimeStart');
    localStorage.removeItem('PomodoroDuration');
    localStorage.removeItem('PomodoroPhase');
    timeStart = undefined;
}

function checkStored() {
    // eslint-disable-next-line no-restricted-globals
    if (timeStart == null || duration == null || phase == null || isNaN(localStorage.getItem('PomodoroTimeStart'))) {
        return false;
    }
    return true;
}

function resetPomodoro() {
    clearValues();
    initValues();
    setupPomodoro();
    toggleButton();
}

function runningPomodoro() {
    toggleButton();
    let timer = null;
    let difference;
    let minutes;
    let seconds;
    function updateTime() {
        difference = duration - parseInt(((Date.now() - timeStart) / 1000), 10);
        minutes = parseInt(difference / 60, 10);
        seconds = parseInt(difference % 60, 10);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        timeText.textContent = `${minutes}:${seconds}`;
        phaseText.textContent = `${phase}`;
        document.title = `Pomodoro - ${minutes}:${seconds}`;
        if (difference <= 0 && phase === 'Rest Time') {
            clearInterval(timer);
            resetPomodoro();
            playSound();
        }
        if (difference <= 0 && phase === 'Work Time') {
            phase = 'Rest Time';
            duration = parseInt(duration, 10) + 300;
            storeValues();
            playSound();
        }
    }
    updateTime();
    timer = setInterval(updateTime, 1000);
}

function startPomodoro() {
    timeStart = Date.now();
    storeValues();
    runningPomodoro();
}

window.onload = () => {
    if (checkStored() === true) {
        // Continue Running
        setupPomodoro();
        runningPomodoro();
    } else {
        // Initialize
        initValues();
        setupPomodoro();
    }
};

timerButton.addEventListener('click', () => {
    startPomodoro();
});
