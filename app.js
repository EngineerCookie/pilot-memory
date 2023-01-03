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

//funcRepeater(40)

/*######
RENDER
########*/
let airspeed = document.querySelector('[data-airspeed]');
let altimeter = document.querySelector('[data-altimeter]');
let altSet = document.querySelector('[data-altsetting]');
let heading = document.querySelector('[data-heading]');
let comm = document.querySelector('[data-comm]');
let nav = document.querySelector('[data-nav]');

let instrumentSetter = () => {
    let regex = /([0-9]+)([0-9]{3})/;
    let altResult = altitudeGen().toString() //PLACEHOLDER
    let altFormat = altResult.match(regex); 
    airspeed.textContent = airspeedGen();
    altimeter.innerHTML = `${altFormat[1]}<sup>${altFormat[2]}</sup>`;
    altSet.textContent = altSetGen();
    heading.textContent = headingGen();
    comm.textContent = commGen();
    nav.textContent = navGen();
}

//instrumentSetter()
/*
let inputTest = document.querySelector('input')
inputTest.value="OLI"
inputTest.readOnly = true;
console.log(inputTest)
*/
let gameStart = () => {

}

/*WORKSHOP*/
