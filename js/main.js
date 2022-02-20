// Global variables

var nCollumns = 20;
var nRows = 20;

var collumns;
var rows;

$(document).ready(function () {
    // Configuration of Web Speech AI
    var voiceConfiguration = initVoiceRecognition();

    // Creating object containing the canvases 
    // TOFIX: Transform it into an array
    var canvasList = { canvas: $('#myCanvas')[0], txtCanvasH: $('#textCanvasH')[0], txtCanvasV: $('#textCanvasV')[0] };

    // Initializing all the canvases (setting width and height of all canvases)
    initCanvas(canvasList);

    // Retrieving the alphabet letters for coordinates
    let letters = getAlphabet();

    // Configuring the size of collumns and rows (in pixel)
    collumns = canvasList.canvas.width / nCollumns;
    rows = canvasList.canvas.height / nRows;

    // Setting up the Grid
    setGrid(canvasList, letters);

    // OnClick event -> Activate microphone and retrieve the input
    $('#activateMic').click(() => {
        onMicActive(voiceConfiguration.recognition, canvasList.canvas.getContext("2d"));
    })
})

function initVoiceRecognition() {
    var SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    var shapes = ['square', 'circle'];
    var grammar = '#JSGF V1.0; grammar shapes; public <shapes> = ' + shapes.join(' | ') + ' ;'

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    return {
        'speechRecognition': SpeechRecognition,
        'speechGrammarList': SpeechGrammarList,
        'speechRecognitionEvent': SpeechRecognitionEvent,
        'shapes': shapes,
        'grammar': grammar,
        'recognition': recognition,
        'speechRecognitionList': speechRecognitionList
    };
}

function initCanvas(canvasList) {
    canvasList.canvas.width = $('#main-container').width() / 100 * 70;
    canvasList.canvas.height = $('#main-container').height() / 100 * 90;

    canvasList.txtCanvasH.width = canvasList.canvas.width;
    canvasList.txtCanvasH.height = $('#main-container').height() / 100 * 5;

    canvasList.txtCanvasV.width = $('#main-container').width() / 100 * 5;
    canvasList.txtCanvasV.height = canvasList.canvas.height;
}

function getAlphabet() {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
}

function setGrid(canvasList, letters) {
    // Retrieving context 2d
    var ctx = canvasList.canvas.getContext("2d");
    var txtCtxH = canvasList.txtCanvasH.getContext("2d");
    var txtCtxV = canvasList.txtCanvasV.getContext("2d");
    // Drawing Collumns of the grid
    for (let i = 0; i <= nCollumns; i++) {
        ctx.beginPath();
        // adding Collumns headers (numbers) 
        txtCtxH.font = '20px serif';
        txtCtxH.fillText(i + 1, collumns * i + collumns / 2, 30);
        ctx.moveTo(collumns * i, 0);
        ctx.lineTo(collumns * i, canvasList.canvas.height);
        ctx.stroke();
    }
    // Drawing rows of the grid
    for (let i = 0; i <= nRows; i++) {
        ctx.beginPath();
        // adding rows headers (letters) 
        txtCtxV.font = '20px serif';
        txtCtxV.fillText(letters[i], 30, rows * i + rows / 2);
        ctx.moveTo(0, rows * i);
        ctx.lineTo(canvasList.canvas.width, rows * i);
        ctx.stroke();
    }
}


function onMicActive(recognition, ctx) {
    // Acrivation of microphone
    recognition.start();
    console.log('Ready to receive a draw command.');

    recognition.onresult = function (event) {
        // Evaluating the shape received
        var shape = event.results[0][0].transcript;

        // Shape Draw logic
        if (shape == 'Square') {
            ctx.beginPath();
            ctx.rect(Math.floor(Math.random() * 10 - 1) * collumns, Math.floor(Math.random() * 10) * rows, 100, 100);
            ctx.stroke();
        } else if (shape = 'Circle') {
            ctx.beginPath();
            ctx.arc(Math.floor(Math.random() * 10 - 1) * collumns, Math.floor(Math.random() * 10) * rows, 50, 0, Math.PI * 2, true);
            ctx.stroke();
        }
        console.log('shape: ' + shape);
    }

    recognition.onspeechend = function () {
        recognition.stop();
    }

    // TODO

    recognition.onerror = function(event) {
        console.debug("error");
      }

}