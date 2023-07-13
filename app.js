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
let numPad = document.querySelector('.num-pad')
let atcMode = document.querySelector('[data-atc]');

//stops atcComm if page refresh;
window.speechSynthesis.cancel()

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

//ATC Json
async function getData(url) {
    const response = await fetch(url);
    return response.json();
}
let atc = await getData('./atc.json');

//COUNTDOWN before FIRST ROUND
function countDown() {
    setting.classList.remove('active');
    atcMode.classList.remove('active');
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
                correctAnswers.comm = commGen();
                comm.textContent = correctAnswers.comm;
                break;
            case 'nav':
                correctAnswers.nav = navGen();
                nav.textContent = correctAnswers.nav;
                break;
            default:
                console.log('something went wrong with answerGen');
        }
    })

    //push to answerHistory.correct
    answerHistory.correct.push(correctAnswers);

    //ATC MODE: do not render answer on screen. Script for ATC must be  made HERE. Have it use correctAnswers obj and it will have the difficulty integrarted  alreeady
    if (atcMode.checked == true) {
        let callsignValue = callsign.value.replace(/\s/g, '');
        let correctKeys = Object.keys(correctAnswers).sort(keySort);
        function keySort(a, b) { //from https://stackoverflow.com/questions/53591691/sorting-an-array-in-random-order
            return 0.5 - Math.random()
        }
        let message = '';
        correctKeys.unshift('callsign'); //make sure callsign is always first
        correctKeys.forEach((key) => { //message constructor
            switch (key) {
                case 'callsign':
                    let regexA = /([A-Za-z]+)-*([0-9]+)-*([A-Za-z]*[0-9]*)*/;
                    let matchA = callsignValue.match(regexA);
                    let arrA = Object.keys(atc.airline);
                    if (arrA.indexOf(matchA[1].toLowerCase()) >= 0) {
                        message += `${atc.airline[matchA[1].toLowerCase()]} `;
                    } else {
                        let splitA = matchA[1].split('');
                        splitA.forEach(letter => {
                            message += `${atc.phonetic[letter.toLowerCase()]} `
                        })
                    }
                    message += `${matchA[2].split('').join(' ')} `;
                    if (matchA[3] != undefined) {
                        let splitB = matchA[3].split('');
                        splitB.forEach(letter => {
                            message += `${atc.phonetic[letter.toLowerCase()]} `
                        })
                    }
                    message += '; '
                    break;
                case 'airspeed':
                    message += `maintain ${correctAnswers.airspeed} knots; `
                    break;
                case 'altimeter':
                    let altitudeATC = ['descent and maintain', 'climb and maintain'];
                    message += `${altitudeATC[Math.floor(Math.random() * altitudeATC.length)]} ${correctAnswers.altimeter} feet; `
                    break;
                case 'altSet':
                    message += `altimeter setting ${correctAnswers.altSet.split('').join('  ')} ; `
                    break;
                case 'heading':
                    let arrB = Object.keys(atc.cardinal);
                    //cardinal replacer north, east, south, west
                    if (arrB.indexOf(correctAnswers.heading.toString()) >= 0 && Math.floor(Math.random() * 3) >= 1) {
                        message += `fly ${atc.cardinal[correctAnswers.heading]}bound; `
                    } else {
                        message += `fly heading ${correctAnswers.heading.toString().split('').join(' ')} ; `
                    }
                    break;
                case 'comm':
                    let commATC = ['approach', 'radio', 'control', 'traffic', ''];
                    message += `contact ${commATC[Math.floor(Math.random() * commATC.length)]} ${correctAnswers.comm.split('').join(' ')} ; `
                    break;
                case 'nav':
                    message += `closest Vee Oh R frequency ${correctAnswers.nav.split('').join(' ')} ; `
                    break;
                default:
                    console.log('something wrong with atc-keys')
            }
        })
        //message checker for DEV
        message = message.replace(/ 9 /g, atc.phonetic["9"]);
        message = message.replace(/ \. /g, atc.phonetic["point"][Math.floor(Math.random() * atc.phonetic['point'].length)])
        let atcComm = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(atcComm);

        instrumentIndicators.forEach((indicator) => {
            indicator.classList.remove('active');
        })

        inputBox.forEach((input) => {
            input.classList.add('active');
            input.value = ''
        })

        startBtn.dataset.action = 'submit';
        startBtn.textContent = 'submit'
        startBtn.classList.add('disabled');

        //atcFinished() callback
        atcComm.addEventListener('end', () => {
            atcFinished()
        })

    } else { //rendering in normal mode

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
}

//Memorization TIMER
let memoTimer;
let memoBar = document.createElement('div');
memoBar.classList.add('timer-bar');

function memoTimerON() {
    //render memorization timer
    let memoSec = 10000; //time set to memorize
    workspace.appendChild(memoBar);
    memoBar.style.animationDuration = `${memoSec / 1000}s`;

    startBtn.dataset.action = 'skip';
    startBtn.textContent = 'skip'

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

function atcFinished() { //Memotimer but for ATC Mode
    startBtn.classList.remove('disabled');
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
    for (let i = 0; i < answerHistory.correct.length; i++) {
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
        resultHistory.replaceChildren();
        resultScreen.close();
    });

    //answerHistory reset
    answerHistory.correct = [];
    answerHistory.userInput = [];
    //Main menu restore
    atcMode.classList.add('active')
    title.textContent = 'Pilot Memory Training';
    callsign.readOnly = false;
    setting.classList.add('active');
    instrumentIndicators.forEach((indicator) => {
        indicator.classList.add('active');
    })
    inputBox.forEach((input) => {
        input.classList.remove('active');
        input.value = ''
    });

    startBtn.dataset.action = 'start'
    startBtn.textContent = 'start game'
}

//Multi-functional startBtn
startBtn.addEventListener('click', () => {
    switch (startBtn.dataset.action) {
        case "start":
            if (atcMode.checked == true) {
                let regexTest = /^([A-Za-z]+)-*([0-9]+)-*([A-Za-z]*[0-9]*)*$/;
                if (regexTest.test(callsign.value.replace(/\s/g, '')) == true) {
                    countDown()
                } else {alert('Callsigns are made from: letter - numbers')}
            } else{countDown()}
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


/*WORKBENCH*/
