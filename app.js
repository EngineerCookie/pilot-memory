//TEXT TO SPEECH FOR ATC MODE
/*
let atc = 'COPA one two three, maintain 150 knots, climb and maintain one three thousand feet altimeter setting two niner niner five, heading three six zero. Contact approach one two two point six. Vee Oh R frequency one one seven point one. '
let msg = new SpeechSynthesisUtterance(atc);
window.speechSynthesis.speak(msg)
*/

/*#######
RANDOM GENERATORS
#########*/
function airspeedGen() {
    let result = Math.floor((Math.random() * 16) + 10);
    return result * 10;
}

function altitudeGen() {
    let result = Math.floor((Math.random() * 130) + 50);
    return result * 100;
}

function headingGen() {
    let result = (Math.ceil((Math.random() * 72))) * 5;
    let cardinals = {
        '360': 'North',
        '090': 'East',
        '180': 'South',
        '270': 'West'
    }
    switch (result.toString().length) {
        case 1:
            result = result.toString().split('');
            result.push('0');
            result.unshift('0');
            result = result.join('');
            break;
        case 2:
            result = result.toString().split('');
            result.unshift('0');
            result = result.join('');
            break;
        case 3:
            break;
    }
    /*if (cardinals.hasOwnProperty(result)) { //THIS IS FOR ATC MODE
        result = cardinals[result];
    }*/
    return result;
}

function commGen() {
    let a, b;
    a = Math.round(Math.random() * 3) + 118;
    if (a == 121) {
        b = [((Math.round(Math.random() * 8)) * 5) / 10].toString().split('.').join('')
    } else {
        b = [((Math.round(Math.random() * 10)) * 5) / 10].toString().split('.').join('')
    }
    return `${a}.${b}`;
}

function navGen() {
    let a, b;
    a = Math.round(Math.random() * 9) + 108;
    b = [((Math.round(Math.random() * 10)) * 5) / 10].toString().split('.').join('');
    return `${a}.${b}`;
}

function altSetGen() {
    let result = `${Math.round(Math.random() * 400) + 2750}`;
    let a = result.substring(0, 2), b = result.substring(2, 4)
    return `${a}.${b}`;
}

/*########
GAME START
##########*/
let title = document.querySelector('h1');
let startBtn = document.querySelector('[data-action]');
let workspace = document.querySelector('.workspace');
let setting = document.querySelector('.setting');
let callsign = document.querySelector('#callsign-input');
let instrumentIndicators = document.querySelectorAll('[data-instrument]');
let inputBox = document.querySelectorAll('[data-user-answer]');

//Game stadistics
let roundLimit; //This is set in gameStart()

let answerHistory = {
    correct: [],
    userInput: []
};

/////settings: difficulty
let difficultySetting = {
    easy: ['airspeed', 'altimeter', 'heading'],
    normal: ['airspeed', 'altimeter', 'heading', 'altSet'],
    hard: ['airspeed', 'altimeter', 'heading', 'altSet', 'comm'],
    all: ['airspeed', 'altimeter', 'heading', 'altSet', 'comm', 'nav']
}
let activeInstrument = ['airspeed', 'altimeter', 'heading', 'altSet', 'comm', 'nav'];
let difficultySelection = document.querySelectorAll('[data-difficulty]');
difficultySelection.forEach((option) => {
    option.addEventListener('click', () => {
        if (option.checked === true) {
            activeInstrument = [...difficultySetting[option.dataset.difficulty]]
            instrumentIndicators.forEach((indicator) => {
                indicator.classList.add('disable');
                if (activeInstrument.indexOf(indicator.dataset.instrument) >= 0) {
                    indicator.classList.remove('disable')
                }
            });
            inputBox.forEach((input) => {
                input.classList.add('disable');
                if (activeInstrument.indexOf(input.dataset.userAnswer) >= 0) {
                    input.classList.remove('disable')
                }
            });
        }
    })
})
let timeInterval, time; //time in minutes and second. STRING

function stopWatch() {
    title.textContent = '00:00'
    let seconds = 0, minutes = 0;
    timeInterval = setInterval(() => {
        seconds++
        if (seconds >= 60) { //minute tracker
            seconds = 0
            minutes++
        }
        if (seconds <= 9) { //adds left 0 on seconds
            time = `${minutes}:0${seconds}`
        } else { time = `${minutes}:${seconds}` } //updates global time
        title.textContent = time;
    }, 1000)
}


//COUNTDOWN before FIRST ROUND
function countDown() {
    setting.classList.remove('active');
    let countdown = document.createElement('div')
    countdown.classList.add('countdown');
    let countTimer = document.createElement('div');
    countTimer.textContent = 3 //Default 3. Change 1 for DEV
    countdown.appendChild(countTimer);
    workspace.appendChild(countdown)

    let interval = setInterval(() => {
        if (countTimer.textContent <= 1) {
            clearInterval(interval)
            countdown.remove()
            gameStart()
        } else { countTimer.textContent -= 1 }
    }, 1000)
}

//START ROUND 1
function gameStart() {
    let roundSelect = document.querySelector('[data-round]:checked');
    roundLimit = roundSelect.dataset.round //SETS THE ROUND LIMIT
    console.log(roundLimit)
    callsign.readOnly = true;
    answerGen() //this actually starts the round 1
    stopWatch() //starts stopwatch
}

//Round generator
function answerGen() { //Generates the correct answers
    let airspeed = document.querySelector('[data-instrument="airspeed"]');
    let altimeter = document.querySelector('[data-instrument="altimeter"]');
    let altSet = document.querySelector('[data-instrument="altSet"]');
    let heading = document.querySelector('[data-instrument="heading"]');
    let comm = document.querySelector('[data-instrument="comm"]');
    let nav = document.querySelector('[data-instrument="nav"]');
    let correctAnswers = {};

    activeInstrument.forEach((instrument) => {
        switch (instrument) {
            case 'airspeed':
                correctAnswers.airspeed = airspeedGen();
                airspeed.textContent = correctAnswers.airspeed;
                break;
            case 'altimeter':
                let regex = /([0-9]+)([0-9]{3})/;
                correctAnswers.altimeter = altitudeGen();
                let altFormat = correctAnswers.altimeter.toString().match(regex);
                altimeter.innerHTML = `${altFormat[1]}<sup>${altFormat[2]}</sup>`;
                break;
            case 'heading':
                correctAnswers.heading = headingGen();
                heading.textContent = correctAnswers.heading;
                break;
            case 'altSet':
                correctAnswers.altSet = altSetGen();
                altSet.textContent = correctAnswers.altSet;
                break;
            case 'comm':
                correctAnswers.comm =  commGen();
                comm.textContent = correctAnswers.comm;
                break;
            case 'nav':
                correctAnswers.nav  = navGen();
                nav.textContent = correctAnswers.nav;
                break;
            default:
                console.log('something went wrong with answerGen');
        }
    })

    //push to answerHistory.correct
    answerHistory.correct.push(correctAnswers);
    //render answers on screen
    instrumentIndicators.forEach((indicator) => {
        indicator.classList.add('active');
    })
    inputBox.forEach((input) => {
        input.classList.remove('active');
    })
    //DEV ONLY answers to console.log
    //console.log(correctAnswers)

    //Callback to MemotimerON()
    memoTimerON()
}

//Memorization TIMER
let memoTimer;
let memoBar = document.createElement('div');
memoBar.classList.add('timer-bar');

function memoTimerON() {
    startBtn.dataset.action = 'skip';
    startBtn.textContent = 'skip'

    //render memorization timer
    let memoSec = 10000; //time set to memorize
    workspace.appendChild(memoBar);
    memoBar.style.animationDuration = `${memoSec / 1000}s`;

    memoTimer = setTimeout(() => {
        memoBar.remove();
        instrumentIndicators.forEach((indicator) => {
            indicator.classList.toggle('active');
        })
        inputBox.forEach((input) => {
            input.classList.toggle('active');
            input.value = ''
        })
        startBtn.dataset.action = 'submit';
        startBtn.textContent = 'submit'
    }, memoSec);
}

function memoTimerOFF() { //memorization timer skip
    clearTimeout(memoTimer);
    memoBar.remove();
    instrumentIndicators.forEach((indicator) => {
        indicator.classList.toggle('active');
    })
    inputBox.forEach((input) => {
        input.classList.toggle('active');
        input.value = ''
    })
    startBtn.dataset.action = 'submit';
    startBtn.textContent = 'submit'
}

//captures user's input / answers
function inputSubmit() {
    let userAnswer = {};

    //get value from input and assign to userAnswer
    inputBox.forEach(box => {
        userAnswer[box.dataset.userAnswer] = box.value
    })

    //push to answerHistory.userInput
    answerHistory.userInput.push(userAnswer)

    //callback answerGen() || resultScreen()
    if (roundLimit == 1) {
        resultScreen()
    } else {
        roundLimit--
        answerGen(); //triggers next round
    }
}

function resultScreen() {
    //Variables
    let score = 0;
    function scoreCalc(answer, correct) { //to calculate score
        if (answer == correct) {
            score++
            return 'correct'
        } else { return 'wrong' }
    }

    //Stop the stopwatch lel
    clearInterval(timeInterval);

    //render elements; answer history, score calculation and right||wrong checker
    let resultHistory = document.querySelector('.result-history');
    for (i = 0; i < answerHistory.correct.length; i++) {
        let entry = document.createElement('div');
        entry.setAttribute('data-history', i);
        Object.keys(answerHistory.correct[i]).forEach((key) => {
            let entryText = document.createElement('p');
            entryText.classList.add('result-entry');
            //entryText.setAttribute('data-result', key);
            entryText.setAttribute('data-score', scoreCalc(answerHistory.userInput[i][key], answerHistory.correct[i][key]));
            entryText.textContent = `${key}: `;

            let entryUser = document.createElement('span');
            entryUser.setAttribute('data-user-answer', key);
            entryUser.textContent = answerHistory.userInput[i][key];

            let entryCorrect = document.createElement('span');
            entryCorrect.setAttribute('data-correct-answer', key);
            entryCorrect.textContent = answerHistory.correct[i][key];

            entryText.appendChild(entryUser);
            entryText.appendChild(entryCorrect);
            entry.appendChild(entryText);

        })
        resultHistory.appendChild(entry);
    }

    //score and elapsed time
    let scoreSpan = document.querySelector('[data-result-score]');
    let timeSpan = document.querySelector('[data-result-time]');

    scoreSpan.textContent = score;
    timeSpan.textContent = time;

    //open result window dialog
    let resultScreen = document.querySelector('.result-window');
    resultScreen.showModal();

    //close btn
    let btn = document.getElementById('result-close');
    btn.addEventListener('click', () => {
        resultScreen.close()
    })

    //Main menu restore
    title.textContent = 'Pilot Memory Training';
    callsign.readOnly = false;
    setting.classList.add('active')
    instrumentIndicators.forEach((indicator) => {
        indicator.classList.add('active');
    })
    inputBox.forEach((input) => {
        input.classList.remove('active');
        input.value = ''
    })
    startBtn.dataset.action = 'start'
    startBtn.textContent = 'start game'
}

//Multi-functional startBtn
startBtn.addEventListener('click', () => {
    switch (startBtn.dataset.action) {
        case "start":
            countDown()
            break;
        case "skip": //skips the memorization timer
            memoTimerOFF()
            break;
        case "submit":
            inputSubmit()
            break;
        default:
            console.log(`Something wrong  with  the action btn`)
    }
})


/*WORKSHOP*/
/*
    ATC MODE NOTES
- ATC memoTimerON() starts the moment it start speaking and ends the instant the voice stops. It can't be skipped.
- During memoTimerON(), no  instrument will be shown.
- Evaluate if you want to allow inputBox active during speaking.
- Must detect and repeat callsign upon every answerGen().
- Every letter must be phonetic and said individually.
- Callsign must be able to distinguish common airline callsign. I.e. COPA 1-2-3 instead of Charlie Oscar Papa Alpha 1-2-3.
- Must have different order and style for each instrument information.
- Must follow correct ATC structure:
    - Callsign must be the first thing said.
    - Airspeed is said completly, and specify 'maintain' at the start and 'knots' at the end.
    - Altitude must depict 'thousands' and 'hundred' feets.
    - Altitude can either be 'climb and maintain' or 'decend and mantain'.
    - Altimeter setting is always right after altitude.
    - Altimeter setting has to be said number by number. Decimal separation must be said as either 'point' or 'decimal'.
    - Heading must start  with 'heading' before saying the number.
    - Heading has to be said number by number,  including any left-side zeroes (0).
    - Heading can be said as 'North, 'East', 'South', or 'West' instead of their corresponding cardinal number.
    - Comm and Nav must be said number by number. Decimal sparation must be said as eitheer 'point' or 'decimal'
*/