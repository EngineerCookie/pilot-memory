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
let callsign = document.querySelector('#callsign-input');
let instrumentIndicators = document.querySelectorAll('[data-instrument]');
let inputBox = document.querySelectorAll('[data-user-answer]');

//Game stadistics
let roundLimit = 5; //Set game limit by stages. Ie. 10 rounds, 5 rounds, etc. SET 3 FOR DEV

let answerHistory = {
    correct: [],
    userInput: []
};

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
    callsign.readOnly = true;
    console.log(`the game has  started booi`);
    roundLimit = 3 //RESETS THE ROUND LIMIT
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
    let correctAnswers = {
        airspeed: airspeedGen(),
        heading: headingGen(),
        altimeter: altitudeGen(),
        altSet: altSetGen(),
        comm: commGen(),
        nav: navGen()
    };
    //push to answerHistory.correct
    answerHistory.correct.push(correctAnswers);

    //render answers on screen
    let regex = /([0-9]+)([0-9]{3})/;
    let altFormat = correctAnswers.altimeter.toString().match(regex);

    airspeed.textContent = correctAnswers.airspeed;
    altimeter.innerHTML = `${altFormat[1]}<sup>${altFormat[2]}</sup>`;
    altSet.textContent = correctAnswers.altSet;
    heading.textContent = correctAnswers.heading;
    comm.textContent = correctAnswers.comm;
    nav.textContent = correctAnswers.nav;

    instrumentIndicators.forEach((indicator) => {
        indicator.classList.add('active');
    })
    inputBox.forEach((input) => {
        input.classList.remove('active');
    })
    //DEV ONLY answers to console.log
    console.log(correctAnswers)

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
    for (i = 0; i < answerHistory.userInput.length; i++) {
        let entry = document.createElement('div');
        entry.setAttribute('data-history', i);
        Object.keys(answerHistory.userInput[i]).forEach((key) => {
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
    title.textContent = 'Pilot Memory Training (WIP)';
    callsign.readOnly = false;
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
//Difficulty Setting
/*
Difficulty setting will only show  certain  instruments.

Easy: airspeed, altimeter, headin
Normal: airspeed, altimeter, heading, altset
Hard: airspeed, altimeter, heading, altset, comm
All: airspeed, altimeter, heading, altset, comm, nav


All-mode will recommend  note-taking.

*/
let difficultyTest =  {
    easy: ['airspeed', 'altimeter', 'heading'],
    normal: ['airspeed', 'altimeter', 'heading', 'altset'],
    hard: ['airspeed', 'altimeter', 'heading', 'altset', 'comm'],
    all: ['airspeed', 'altimeter', 'heading', 'altset', 'comm', 'nav']
}

/*
If I were to use this,  I will need to change answerGen() where:
    - I need a  function that will get the values inside de difficultyARR and Map them against each generator
    - correctAnswers must be empty. the function above must update this object.
    - instrumentIndicators must only show those inside the difficultyARR. The ones not mentioned must remain hidden.
    - inputBox render must happen in inputSubmit().

changes in inputSubmit():
    - inputBox render  must happen in this function.
    - difficultyARR must map each inputBox and activated only those present. Those not mentioned must remain hidden.
*/