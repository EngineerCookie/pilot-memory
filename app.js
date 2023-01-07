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
//Function  Repeater  for accuracy  check. DELETE WHEN FINISHED
let funcRepeater = (times) => {
    for (; times > 0; times--) {
        console.log(altSetGen())
    }
}

//funcRepeater(40)

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
let roundLimit = 3; //Set game limit by stages. Ie. 10 rounds, 5 rounds, etc. SET 3 FOR DEV
let answerHistory = {
    correct: [],
    userInput: []
};
let timeInterval, time; //time in minutes and second. STRING

function stopWatch() {
    let seconds = 0, minutes = 0;
    timeInterval = setInterval(() => {
        seconds++
        if (seconds >= 60) { //adds left 0 on seconds
            seconds = 0
            minutes++
        }
        if (seconds <= 9) { //updates global time
            time = `${minutes}:0${seconds}`
        } else { time = `${minutes}:${seconds}` }
        title.textContent = time;
    }, 1000)
}


//COUNTDOWN before FIRST ROUND
function countDown() {
    let countdown = document.createElement('div')
    countdown.classList.add('countdown');
    let countTimer = document.createElement('div');
    countTimer.textContent = 1 //Default 3. Change 1 for DEV
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
    console.log(`the game has  started booi`)
    answerGen() //this actually starts the round 1
    stopWatch() //starts stopwatch
}

//Round generator
function answerGen() { //Generates the correct answers || will have timer about 5s or 10s
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

function memoTimerOFF() {
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
    let userAnswer = {
        "airspeed": undefined,
        "heading": undefined,
        "altimeter": undefined,
        "altSet": undefined,
        "comm": undefined,
        "nav": undefined
    }

    //get value from input and assign to userAnswer
    inputBox.forEach(box => {
        userAnswer[box.dataset.userAnswer] = box.value
    })

    //push to answerHistory.userInput
    answerHistory.userInput.push(userAnswer)

    //callback answerGen() || resultScreen()
    answerGen(); //triggers next round
}

function resultScreen() {
    let score = 0; 
    console.log('Showing Result  Screen')

    //Variables

    //set startBtn.dataset.action = 'menu'
    //PLACEHOLDER startBtn.textContent = 'back to main menu'

    //render result history
    ////wrong answers must have the correct answer to the side

    //render score and elapsed time
}

//Need to makee  diferent funnction for the same btn depending  onn data-action
startBtn.addEventListener('click', () => {
    switch (startBtn.dataset.action) {
        case "start":
            console.log(`Start the game`);
            countDown()
            break;
        case "skip": //skips the memorization timer
            memoTimerOFF()
            break;
        case "submit":
            console.log(`Submit answer`);
            inputSubmit()
            break;
        case "menu":
            console.log(`Return to Main Menu`); //must set Instrument Span class Active
            break;
        default:
            console.log(`Something wrong  with  the action btn`)
    }
})


/*WORKSHOP*/
let scoreTest = 0; //MUST UPDATE THHIS THING
let arrTest = {
    correct: [
        { //{0}
            a: 1,
            b: 2,
            c: 3,
            d: 4
        },
        { //{1}
            a: 1,
            b: 2,
            c: 3,
            d: 4
        },
        { //{2}
            a: 1,
            b: 2,
            c: 3,
            d: 4
        },
        { //{3}
            a: 1,
            b: 2,
            c: 3,
            d: 4
        }
    ],
    userInput: [
        { //{0}
            'a': '10',
            'b': '2',
            'c': '3',
            'd': '20'
        },
        { //{1}
            'a': '1',
            'b': '9',
            'c': '36',
            'd': '41'
        },
        { //{2}
            'a': '90',
            'b': '88',
            'c': '35',
            'd': '20000'
        },
        { //{3}
            'a': '1',
            'b': '256',
            'c': '300',
            'd': '4'
        },
    ]
};


for (i = 0; i < arrTest.correct.length; i++) {
    let keys = Object.keys(arrTest.correct[i]);
    keys.forEach((key) => {
        if (arrTest.correct[i][key] == arrTest.userInput[i][key]) {
            scoreTest ++
        }
    })    
};
console.log(scoreTest)

/* TEST RESULTS MUST BE:
    {0} = 2 CORRECTS
    {1} = 1 CORRECTS
    {2} = 0 CORRECTS
    {4} = 4 CORRECTS

    scoreTest = 7

Structure:
arrTest = {[correct], [userInput]}
correct||userInput = [{0}, {1}, {2}]
*/