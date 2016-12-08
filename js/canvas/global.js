// lollipop prototype

/********** HIERARCHY *********/
// <layer>
// 	<lollipopContainer>
// 		<dotContainer>
// 			<dot></dot>
// 		</dotContainer>
// 	</lollipopContainer>
// </layer>
var mLayer = new Layer();
var mForest = new Group();
var mBands = new Group();

mLayer.addChild(mForest);
mLayer.addChild(mBands);

/*
_lollipopContainer.data = {
	playback: [0, 1],
	speed: 	[1x, 2x, 3x],
	orientation: [1, -1],
    octave: [2, 3, 4, 5, 6],
    key: 	[C, F, G, A],
    chord: 	[1, 3, 5],
    instrument: ['piano']
};
_dotContainer.data = {
    rod : 0,
    audioBuffer: 'sound.wav',
    reverb: 'room.wav',
    delay: 2s,
    echo: 6s,
    synth: true/false,
    ...
};
*/

/*********** GLOBAL VARIABLES *************/
// common instance
var mLollipopContainer, mDotContainer, mReference;
var circle, mRod, mDot, mTimer;
var _dot = new Path.Circle({
    center: new Point(0, 0),
    radius: 5,
    fillColor: 'white',
    strokeColor: 'black',
    strokeWidth: 0.5
}); // Class for dots, presets
var dot = new SymbolDefinition(_dot); // Create a symbol definition from the path
var _marker = new Path.Star({
    center: new Point(0, 0),
    points: 5,
    radius1: 4,
    radius2: 8,
    strokeColor: 'red',
    strokeWidth: 2
}); // Class for dots, presets
var marker = new SymbolDefinition(_marker);

var intersectionGroup = new Group();
var divisionGroup = new Group();
var lastGeo, div;

// MODE section
var MODE = 0; // if inner cicle can be dragged
var forestButton = 0;
var forestSpeed = 1;
var metaBall;
var meta = false;


// global mouseEvent tools
var draw = new Tool(); //create-lollipop.js
var edit = new Tool(); // edit-lollipop.js
var drawState = false; // use when drawing, if circle is too small then it's not a lollipop

// global color
var mColor = {
        hue: 360 * Math.random(),
        saturation: 0.5,
        brightness: 1,
        alpha: 0.3
    }
    // global styles
mDashArray = [5, 5];

/*********** GLOBAL INITIALIZE *************/
// octave band
var bandNum = 3;
var bandCeil = 6;
var bandWidth = view.size.height / bandNum;
bandsInit(bandNum);

function bandsInit(num) {
    for (var i = 0; i < num; i++) {
        band = new Shape.Rectangle({
            point: [0, bandWidth * i],
            size: [view.size.width, bandWidth],
            fillColor: {
                hue: 43,
                saturation: 6 / 100,
                brightness: (94 - i * 2) / 100
            }
        });
        mBands.addChild(band);
    }
    mBands.visible = false;
}


/********** edit-lollipop.js **********/
// edit tool path editing
var hitOptions = {
    segments: false,
    stroke: true,
    fill: true,
    tolerance: 5
};
var segment, path, hitResult;
var deltaAngle = 0; // use rod position

/*********** metaBalls.js ************/
var connections = new Group();
var handle_len_rate = 2.4;
var circlePaths = [];