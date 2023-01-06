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
let startBtn = document.querySelector('[data-action]');
let workspace = document.querySelector('.workspace');
let callsign = document.querySelector('#callsign-input');
let instrumentIndicators = document.querySelectorAll('[data-instrument]');
let inputBox = document.querySelectorAll('[data-user-answer]');

//Game stats
let timer = undefined; //GLOBAL timer... sets the length for the WHOLE game. Must be used for render at gamestart() and for result page at submitBtn
let answerHistory = {
    correct: [],
    userInput: []
};
let score = 0; //Have it declared inside result()

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

function gameStart() { //must have the whole game's timer about 1min or so
    //TIMER var must be global. Timer ELEM has to be rendered HERE
    startBtn.dataset.action = 'submit';
    callsign.readOnly = true;
    console.log(`the game has  started booi`)
    answerGen()
}

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
    //push to answerHistory
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

    //disable submit btn
    startBtn.classList.add('disabled');


    //render memorization timer
    let memoTimer = document.createElement('div');
    memoTimer.classList.add('timer-bar');
    workspace.appendChild(memoTimer);
    memoTimer.style.animationDuration = '5s';

    setTimeout(() => {
        memoTimer.remove();
        instrumentIndicators.forEach((indicator) => {
            indicator.classList.toggle('active');
        })
        inputBox.forEach((input) => {
            input.classList.toggle('active');
            input.value = ''
        })
        startBtn.classList.remove('disabled');
    }, 5000);

}

function inputSubmit() { //captures user's input / answers
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

    //push to answerHistory
    answerHistory.userInput.push(userAnswer)
    console.log(answerHistory)
    //callback answerGen() || resultScreen()
    answerGen();
    //resultScreen();
}


//Need to makee  diferent funnction for the same btn depending  onn data-action
startBtn.addEventListener('click', () => {
    switch (startBtn.dataset.action) {
        case "start":
            console.log(`Start the game`);
            countDown()
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