//TEXT TO SPEECH FOR ATC MODE
/*
let atc = 'COPA one two three, maintain 150 knots, climb and maintain one three thousand feet altimeter setting two niner niner five, heading three six zero. Contact approach one two two point six. Vee Oh R frequency one one seven point one. '
let msg = new SpeechSynthesisUtterance(atc);
window.speechSynthesis.speak(msg)
*/

/*WORKSHOP*/
let airspeed = document.querySelector('[data-airspeed]');
let altimeter = document.querySelector('[data-altimeter]');
let altSet = document.querySelector('[data-altsetting]');
let heading = document.querySelector('[data-heading]');
let comm = document.querySelector('[data-comm]');
let nav = document.querySelector('[data-nav]');


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
    a = Math.round(Math.random()*3) + 118;
    if (a == 121) {
        b = [((Math.round(Math.random()*8))*5)/10].toString().split('.').join('')
    } else {
        b = [((Math.round(Math.random()*10))*5)/10].toString().split('.').join('')
    }
    return `${a}.${b}`;
}

function navGen() {
    let a, b;
    a = Math.round(Math.random()*9) + 108;
    b = [((Math.round(Math.random()*10))*5)/10].toString().split('.').join('');
    return `${a}.${b}`;
}

function altSetGen()  {
    let result = `${Math.round(Math.random()*400) + 2750}`;
    let a = result.substring(0, 2), b = result.substring(2, 4)
    return `${a}.${b}`;
}
//Function  Repeater  for accuracy  check
let funcRepeater = (times) => {
    for (; times > 0; times--) {
        console.log(altSetGen())
    }
}

funcRepeater(40)
//console.log([0].toString().split('.'))
/*
let  testing = '2992';
console.log(`${testing.substring(0,2)}.${testing.substring(2,4)}`)*/