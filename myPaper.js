/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/global.js
 * ===========================================================================================
 */

// lollipop prototype

/********** HIERARCHY *********/
// <layer>
// 	<lollipopContainer>
// 		<dotContainer>
// 			<dot></dot>
// 		</dotContainer>
// 	</lollipopContainer>
// </layer>
var mGUI = new Layer();
var mLayer = new Layer();
var mForest = new Group();
var mBands = new Group();

mLayer.addChild(mForest);
mLayer.addChild(mBands);

/*
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
    radius: 7,
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
        saturation: 0.35,
        brightness: 0.98,
        alpha: 0.4
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

// gui
var text;
var isNew;

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/geometry.js
 * ===========================================================================================
 */

//definition of mGeometry Group
// mGeometry.style = {
// 	visible: false;
// }

// generate instances of unit polygon
// for (var i = 3; i < 8; i++) {
// 	_geometry = new Path.RegularPolygon(center, i, 1);
// };

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/misc.js
 * ===========================================================================================
 */

function path2rod(_path) {
	return doubleFirstChild(tripleParent(_path));
}

function dot2rod(_dot) {
	return doubleFirstChild(doubleParent(_dot));
}

function doubleParent(_item) {
	return _item.parent.parent;
}

function tripleParent(_item) {
	return _item.parent.parent.parent;
}

function doubleFirstChild(_item) {
	return _item.firstChild.firstChild;
}

function tripleLastChild(_item) {
	return _item.lastChild.lastChild.lastChild;
}

function setPlayback(_lollipopContainer, _playback) {
	_lollipopContainer.data.playback = _playback;
}

function setSpeed(_lollipopContainer, _speed) {
	if (_speed > 0)
		_lollipopContainer.data.speed = _speed;
}

function setOrientation(_lollipopContainer) {
	_lollipopContainer.data.orientation *= -1;
}

function drawDot(_point, _path) {
	// Move the circle to the nearest point:
	mDot = new SymbolItem(dot);
	mDot.removeOnDrag();
	mDot.position = _point;
	mDot.visible = false;
	mDot.data.hit = false;
	mDot.data.initAngle = (mDot.position - _path.position).angle; // - tripleParent(_path).data.rod;
	console.log(mDot.data.initAngle);

	if (tripleParent(hitResult.item).data.dotNum == 0) {
		//drawVeryFristDot();
		var startPoint = new SymbolItem(marker);
		startPoint.name = 'start';
		// startPoint.scale(1.1);
		// startPoint.visible = false;
		startPoint.position = _point;
		startPoint.data.initAngle = mDot.data.initAngle;
		tripleParent(hitResult.item).firstChild.appendTop(startPoint);
		console.log("start point " + startPoint.data.initAngle);

		var len = tripleParent(hitResult.item).children.length;
		for (var i = 1; i < len; i++) {
			addReference(tripleParent(hitResult.item).children[i])
		}
	}

	// form a group
	console.log(hitResult.item);
	doubleParent(hitResult.item).appendBottom(mDot);
	mDot.name = 'dot';
	doubleParent(hitResult.item).data.dotNum += 1;
	tripleParent(hitResult.item).data.dotNum += 1;
	console.log("dotRemain: " + tripleParent(path).data.dotNum);
}

function addCircle() {
	console.log(hitResult.item.parent);
	// console.log(hitResult.item.parent.children.length);
	circle = tripleLastChild(tripleParent(hitResult.item)).clone();
	circle.name = 'circle';
	circle.scale(0.85);
	// var angle = tripleParent(hitResult.item).children[1].firstChild.rotation;
	// console.log("angle: " + angle);
	referenceInit();
	dotContainerInit();
	tripleParent(hitResult.item).appendTop(mDotContainer);
	if (tripleParent(hitResult.item).data.dotNum > 0) {
		addReference(mDotContainer);
	}
}

function removeCircle() {
	if (tripleParent(hitResult.item).children.length <= 2) {
		circlePaths.splice(tripleParent(hitResult.item).index, 1);
		tripleParent(hitResult.item).remove();
		if (mGUI.visible) closeGUI();
		draw.activate(); // when there is no lollipop, switch into draw tool
	} else {
		// var index = tripleParent(hitResult.item).children.length - 1;
		tripleParent(hitResult.item).data.dotNum -= doubleParent(hitResult.item).data.dotNum;
		doubleParent(hitResult.item).data.dotNum = 0;
		if (doubleParent(hitResult.item).children.length > 1)
			doubleParent(hitResult.item).removeChildren(0, doubleParent(hitResult.item).children.length - 1);
		if (tripleParent(hitResult.item).data.dotNum <= 0) {
			tripleParent(hitResult.item).firstChild.lastChild.remove(); // remove startpoint
			tripleParent(hitResult.item).data.dotNum = 0;
		}
	}
}

function deleteAll() {
	circlePaths.splice(tripleParent(hitResult.item).index, 1);
	tripleParent(hitResult.item).remove();
	draw.activate();
}

// initialization
function lollipopInit() {
	mLollipopContainer = new Group();
	mLollipopContainer.addChild(mDotContainer);
	mLollipopContainer.data = {
		rod: 90,
		playback: 1,
		speed: forestSpeed,
		orientation: 1,
		dotNum: 0,
		wait: false,
		mute: false,
		zoomed: false,
		// instrument: 'piano'
		key: 'C',
		root: 0,
		gain: 0.5,
		reverb: -1
	}
	setPan(mLollipopContainer);
	setOctave(mLollipopContainer);
	console.log("octave: " + mLollipopContainer.data.octave);

	mRod = createRod(mLollipopContainer);
	mTimer = new Group();
	mTimer.addChild(mRod);
	mLollipopContainer.appendBottom(mTimer);
}

function dotContainerInit() {
	mDotContainer = new Group();
	mDotContainer.addChild(mReference);
	mDotContainer.data = {
		dotNum: 0
	};
	// var offset = mReference.firstChild.length / 3;
	// var center = circle.getNearestPoint(mReference.firstChild.getPointAt(offset));
	// var beginner = new Path.Star({
	// 	center: center,
	// 	points: 5,
	// 	radius1: 1,
	// 	radius2: 10,
	// 	fillColor: 'red'
	// });
	// beginner.name = 'cross';
	// mDotContainer.appendBottom(beginner);
}

function referenceInit() {
	mReference = new Group();
	mReference.addChild(circle);
}

function addReference(_dotContainer) {
	var ref = _dotContainer.parent.firstChild.lastChild;
	console.log(ref.name);
	var rotation = ref.data.initAngle + ref.rotation + 90;
	circle = _dotContainer.lastChild.lastChild;
	var center = circle.position;
	var rad = circle.bounds.width / 2; // must be ceiled to make sure reference touch with outer circle
	for (var i = 7; i >= 3; i--) {
		var center = circle.position;
		geometry = new Path.RegularPolygon(center, i, rad);
		geometry.strokeColor = "black";
		geometry.visible = false;
		if (i == 4) geometry.rotate(45);
		geometry.rotate(rotation, circle.position);
		_dotContainer.lastChild.appendBottom(geometry);
	}
}

function showGeo(_item, _index) {
	hideGeo();
	_index = (_index + 5) % 5; // do not exceed bounds
	var ref = _item.parent.children[_index];
	// console.log("geolength: " + _item.parent.children.length);
	if (!ref.visible) {
		ref.visible = true;
		lastGeo = ref;
		// console.log(ref.radius);
	}
}

function hideGeo() {
	var ref = lastGeo;
	if (ref) {
		if (ref.visible) {
			ref.visible = false;
		}
		if (intersectionGroup.hasChildren()) intersectionGroup.removeChildren(); // make sure all reference dots are removed)
	}
}


function createRod(_lollipopContainer) {
	var length = circle.toShape(false).radius;
	var angle = _lollipopContainer.data.rod;
	var from = _lollipopContainer.position;
	var to = new Point(from.x + length * 1.8, from.y);
	// to.rotate(angle, from);
	console.log("from, to: " + from + '-' + to);
	var mRod = new Path.Line(from, to).rotate(angle, from);
	mRod.style = {
		strokeColor: '#676161',
		dashArray: mDashArray,
		visible: true
	}
	mRod.name = 'rod';
	return mRod;
}

function rotateRod() {
	if (hitResult) {
		if (Key.isDown('up')) {
			path2rod(hitResult.item).rotate(-1, tripleLastChild(tripleParent(hitResult.item)).position);
			tripleParent(hitResult.item).data.rod -= 1;
		}
		if (Key.isDown('down')) {
			path2rod(hitResult.item).rotate(1, tripleLastChild(tripleParent(hitResult.item)).position);
			tripleParent(hitResult.item).data.rod += 1;
		}
	}
	// console.log("deltaAngle: " + deltaAngle);
	// _lollipopContainer.firstChild.rotate(_deltaAngle, _lollipopContainer.firstChild.data.from);
}

function setOctave(_lollipopContainer) {
	_lollipopContainer.data.octave = bandCeil - Math.floor(tripleLastChild(_lollipopContainer).position.y / bandWidth);
}

function setPan(_lollipopContainer) {
	_lollipopContainer.data.pan = (tripleLastChild(_lollipopContainer).position.x - view.center.x) / view.size.width * 2;
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/create-lollipop.js
 * ===========================================================================================
 */

// draw lollipop outline
draw.onMouseDrag = function(event) {
    circle = new Path.Circle({
        center: event.downPoint,
        radius: (event.downPoint - event.point).length,
        fillColor: mColor,
        name : 'circle'
    });
    // Remove this path on the next drag event:
    circle.removeOnDrag();
    if (circle.area > 1000) drawState = true;
}

draw.onMouseUp = function(event) {
    // set container
    if (drawState) {
        referenceInit();
        dotContainerInit();
        lollipopInit();
        mForest.addChild(mLollipopContainer);
        circlePaths.push(circle);
        drawState = false;
    }
    console.log(project.layers);
    // change tool to edit mode
    edit.activate();
    showGUI(true);
}

// change color on next lollipop
draw.onMouseDown = function(event) {
    mColor.hue = 360 * Math.random();
    mColor.brightness = 0.98;
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/edit-lollipop.js
 * ===========================================================================================
 */

edit.onMouseDown = function(event) {
    segment = path = null;
    hitResult = project.hitTest(event.point, hitOptions);

    // if (event.modifiers.shift) {
    //     if (hitResult.type == 'segment') {
    //         hitResult.segment.remove();
    //     };
    //     return;
    // }

    if (hitResult) {
        path = hitResult.item;
        if (path.name == 'circle') {
            if (hitResult.type == 'segment') {
                segment = hitResult.segment;
            } else if (hitResult.type == 'stroke') {
                var location = hitResult.location;
                segment = path.insert(location.index + 1, event.point);
                path.smooth();
            }
            hitResult.item.bringToFront();

            if (!tripleParent(hitResult.item).data.zoomed) {
                // draw dots
                if (Key.modifiers.shift) {
                    console.log("bounds: " + path.bounds.width);
                    if (intersectionGroup.hasChildren())
                        for (var i = 0; i < intersectionGroup.children.length; i++) {
                            if (event.point.isClose(intersectionGroup.children[i].position, path.bounds.width / 5)) {
                                var nearestPoint = path.getNearestPoint(intersectionGroup.children[i].position);
                                drawDot(nearestPoint, path);
                            }
                        }
                    if (divisionGroup.hasChildren())
                        for (var i = 0; i < divisionGroup.children.length; i++) {
                            if (event.point.isClose(divisionGroup.children[i].position, path.bounds.width / 10)) {
                                var nearestPoint = divisionGroup.children[i].position;
                                drawDot(nearestPoint, path);
                            }
                        }
                        // var nearestPoint = path.getNearestPoint(event.point);
                    console.log('shift!');
                } else {
                    var nearestPoint = path.getNearestPoint(event.point);
                    drawDot(nearestPoint, path);
                }
            } else {
                tripleParent(hitResult.item).data.mute = !tripleParent(hitResult.item).data.mute;
                if (tripleParent(hitResult.item).data.mute) {
                    var mask = hitResult.item.clone();
                    mask.fillColor = 'white';
                    mask.opacity = 0.5;
                    mask.removeOnDown();
                }
            }

        } else if (path.name == 'dot') {
            // remove dots
            path.parent.data.dotNum -= 1;
            doubleParent(path).data.dotNum -= 1;
            console.log("dotRemain: " + doubleParent(path).data.dotNum);
            if (doubleParent(hitResult.item).data.dotNum <= 0) {
                doubleParent(hitResult.item).firstChild.lastChild.remove(); // remove startpoint
                doubleParent(hitResult.item).data.dotNum = 0;
            }
            path.remove();
        }
    }
}

edit.onMouseMove = function(event) {
    hitResult = project.hitTest(event.point, hitOptions);
    project.activeLayer.selected = false;
    /*** FOR LATER USE ONLY ***/
    // This is for dragging event
    if (hitResult && hitResult.item) {
        if (hitResult.item.name == 'dot' || hitResult.item.name == 'circle')
            hitResult.item.selected = true;
    }
}

// if (tripleParent(hitResult.item).data.playback == 0)

edit.onMouseDrag = function(event) {
    if (!mGUI.visible) {
        mBands.visible = true;
        mBands.sendToBack();
    }
    if (path && path.name == 'circle') {
        if (MODE == 1) {
            doubleParent(path).position += event.delta;
        } else {
            tripleParent(path).position += event.delta;
        }
    }
}

edit.onMouseUp = function(event) {
    mBands.visible = false;
    if (path && path.name == 'circle') {
        setOctave(tripleParent(path));
        setPan(tripleParent(path));
        console.log("octave: " + tripleParent(path).data.octave);
        console.log("pan: " + tripleParent(path).data.pan);
        if (mDot) mDot.visible = true;
    }
}

// add circle and remove circle
edit.onKeyDown = function(event) {
    if (event.key == 'enter') {
        draw.activate();
    }
    //test key
    if (event.key == 'o') {
        console.log("init rotation " + metaBall.data.delta);
    }
    if (hitResult && hitResult.item.name == 'circle') {
        if (event.key == 'backspace') {
            deleteAll();
        }
        // add circle
        if (event.key == '=') {
            addCircle();
        }
        // remove circle
        if (event.key == '-') {
            removeCircle();
        }
        // stop playing
        if (event.key == 'space') {
            // playback: 1-play, 0-pause
            setPlayback(tripleParent(hitResult.item), 1 - tripleParent(hitResult.item).data.playback);
        }
        // reverse playing
        if (event.key == 'r') {
            setOrientation(tripleParent(hitResult.item));
        }
        // speed up
        if (event.key == 'a') {
            var speed = tripleParent(hitResult.item).data.speed + 0.1;
            setSpeed(tripleParent(hitResult.item), speed);
        }
        // speed down
        if (event.key == 'z') {
            var speed = tripleParent(hitResult.item).data.speed - 0.1;
            setSpeed(tripleParent(hitResult.item), speed);
        }
        // zoom in/out
        if (event.key == 'control') {
            if (tripleParent(hitResult.item).data.zoomed) {
                tripleParent(hitResult.item).scale(2);
                tripleParent(hitResult.item).data.zoomed = false;
            } else {
                tripleParent(hitResult.item).scale(0.5);
                tripleParent(hitResult.item).data.zoomed = true;
            }
        }
        // meta ball sync
        if (Key.isDown('b')) {
            if (!meta) {
                generateMeta(hitResult.item.position);
                console.log("metaBall!");
            }
            meta = !meta;
        }
        // show menu
        if (Key.isDown('m')) {
            mLollipopContainer = tripleParent(hitResult.item);
            showGUI(false);
        }

        // press shift to show reference
        if (Key.modifiers.shift) {
            var index = (lastGeo) ? (lastGeo.index) : 0;
            div = 1;
            if (Key.isDown('left')) {
                index -= 1;
            } else if (Key.isDown('right')) {
                index += 1;
            }
            if (Key.isDown('@')) {
                div = 2;
                console.log('2');
            }
            if (Key.isDown('#')) {
                div = 3;
            }
            if (Key.isDown('$')) {
                div = 4;
            }
            hitResult.item.selected = false;
            showGeo(hitResult.item, index);
        }

    } else if (!hitResult) {
        if (event.key == 'space') {
            console.log('start or stop all');
            for (var i = 0; i < mForest.children.length; i++) {
                setPlayback(mForest.children[i], forestButton);
            }
            forestButton = 1 - forestButton;
        }
        if (event.key == 'a') {
            forestSpeed += 0.1;
            for (var i = 0; i < mForest.children.length; i++) {
                setSpeed(mForest.children[i], forestSpeed)
            }
        }
        if (event.key == 'z') {
            forestSpeed -= 0.1;
            for (var i = 0; i < mForest.children.length; i++) {
                setSpeed(mForest.children[i], forestSpeed)
            }
        }
    }
}

// press shift to hide reference
edit.onKeyUp = function(event) {
    if (!Key.modifiers.shift) {
        if (hitResult) hitResult.item.selected = true;
        hideGeo();
    }
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/animation.js
 * ===========================================================================================
 */

function onFrame(event) {
	// iterate each lollipop in the view
	rotationLoop(mForest); // defalut
	rotateRod(); // when key == "up" || key == "down"
	setMetaData();
	intersections(); // when key.modifier.shift
}

function rotationLoop(_item) {
	if (_item.hasChildren()) {
		for (var i = 0; i < _item.children.length; i++) {
			rotationLoop(_item.children[i]);
		}
	} else {
		rotationStep(_item);
	}
}

function rotationStep(_item) {
	// all components rotate other than
	if (doubleParent(_item) != null) {
		// this is inside reference group, but do not rotate rod 
		if (_item.name != 'rod') {
			if (_item.name == 'dot') {
				_item.rotate(angularPerFrame(doubleParent(_item)), _item.parent.lastChild.position);
				hitDot(_item);
			} else if (_item.name == 'start') {
				_item.rotate(angularPerFrame(doubleParent(_item)), doubleParent(_item).lastChild.lastChild.position);
				if (_item.intersects(dot2rod(_item))) doubleParent(_item).data.wait = false;
			} else {
				_item.rotate(angularPerFrame(tripleParent(_item)), _item.parent.lastChild.position);
			}
		}
	}
}

// when a dot is hit..
function hitDot(_item) {
	if (_item.intersects(dot2rod(_item))) {
		if (!_item.data.hit) {
			// dot2rod(_item).visible = true;
			dot2rod(_item).dashArray = [];
			if ((!doubleParent(_item).data.wait) && (!doubleParent(_item).data.mute)) {
				_item.data.hit = true;
				if (doubleParent(_item).data.instrument == 'drum') playDrum(_item, doubleParent(_item).data);
				else if (doubleParent(_item).data.instrument == 'piano') playPiano(_item, doubleParent(_item).data);
			}
			console.log('hit');
			console.log(_item.rotation + _item.data.initAnge);
		}
	} else if (_item.data.hit) {
		_item.data.hit = false;
		// dot2rod(_item).visible = false;
		dot2rod(_item).dashArray = mDashArray;
	}
}

function angularPerFrame(_item) {
	var playback = _item.data.playback;
	var orientation = _item.data.orientation;
	var speed = _item.data.speed;
	return playback * orientation * speed;
}



function intersections() {
	intersectionGroup.removeChildren();
	divisionGroup.removeChildren();
	if (hitResult && hitResult.item.name == 'circle') {
		if (Key.modifiers.shift) {
			// reference geometry vertex points
			var index = (lastGeo) ? (lastGeo.index + 3) : 3;
			var path1 = hitResult.item.parent.children[index - 3]; // triangle is the first one
			var path2 = hitResult.item;
			var offset1 = path1.length / index;
			var offset2 = path2.length / (index * div);

			for (var i = 0; i < index; i++) {
				// var center = path1.getPointAt(offset1 * i)
				var map;
				switch (index) {
					case 5:
						map = 2;
						break;
					case 7:
						map = 3;
						break;
					default:
						map = 1;
				};
				var intersectionPath = new Path.Circle({
					center: path1.getPointAt(offset1 * i),
					radius: 4,
					parent: intersectionGroup
				});
				intersectionPath.fillColor = (i == map) ? 'red' : 'white';
				if (div > 1) {
					var start = path2.getOffsetOf(path2.getNearestPoint(path1.getPointAt(offset1 * i)));
					for (var j = 1; j < div; j++) {
						start = ((start + offset2 * j) > path2.length) ? (start - path2.length) : start;
						var divisionPath = new Path.Circle({
							center: path2.getPointAt(start + offset2 * j),
							radius: 3,
							fillColor: 'white',
							parent: divisionGroup
						});
					}
				}
			}
		}
	}
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/metaBalls.js
 * ===========================================================================================
 */

// metaballs
function generateMeta(_center) {
    metaBall = new Path.Circle({
        center: _center,
        radius: 35,
        fillColor: 'white',
        opacity: 0.5
    });
    metaBall.data.fire = false;
    metaBall.onMouseMove = function(event) {
        this.position = event.point;
        generateConnections(circlePaths);
        console.log("circlepath: " + circlePaths.length);
    }
    metaBall.onClick = function(event) {
        metaBall.remove();
        connections.removeChildren();
        meta = !meta;
    }
}

function initMetaData(_path) {
    if (tripleParent(_path).data.dotNum > 0) {
        var ref = tripleParent(_path).firstChild.lastChild;
        if (!metaBall.data.fire) {
            metaBall.data.delta = tripleParent(_path).data.rod - (ref.data.initAngle + ref.rotation);
            metaBall.data.orientation = tripleParent(_path).data.orientation;
            metaBall.data.playback = tripleParent(_path).data.playback;
            metaBall.data.speed = tripleParent(_path).data.speed;
            console.log("meta delta: " + metaBall.data.delta);
            console.log("meta playback: " + metaBall.data.playback);
            console.log("meta speed: " + metaBall.data.playback);
            metaBall.data.fire = true;
        } else {
            var ori = metaBall.data.orientation * tripleParent(_path).data.orientation;
            var angle = metaBall.data.delta * ori + (ref.data.initAngle + ref.rotation);
            path2rod(_path).rotate(angle - tripleParent(_path).data.rod, tripleLastChild(tripleParent(_path)).position);
            tripleParent(_path).data.rod = angle;
            tripleParent(_path).data.playback = metaBall.data.playback;
            tripleParent(_path).data.speed = metaBall.data.speed;
            tripleParent(_path).data.wait = true;
        }
    }
}

function setMetaData() {
    if (meta && metaBall.data.fire) {
        metaBall.data.delta -= metaBall.data.playback * metaBall.data.speed;
        metaBall.data.delta = (metaBall.data.delta + 360) % 360; // how many angles before hit the rod
    }
}

var connections = new Group();

function generateConnections(paths) {
    // Remove the last connection paths:
    connections.removeChildren();
    // var i = paths.length-1;
    // for (var i = 0, l = paths.length; i < l; i++) {
    for (var i = 0; i < paths.length; i++) {
        var path = metaball(paths[i], metaBall, 0.5, handle_len_rate, 300);
        if (path) {
            connections.appendTop(path);
            path.removeOnMove();
            initMetaData(paths[i]);
        }
    }
    // }
}

function metaball(ball1, ball2, v, handle_len_rate, maxDistance) {
    var center1 = ball1.position;
    var center2 = ball2.position;
    var radius1 = ball1.bounds.width / 2;
    var radius2 = ball2.bounds.width / 2;
    var pi2 = Math.PI / 2;
    var d = center1.getDistance(center2);
    var u1, u2;

    if (radius1 == 0 || radius2 == 0)
        return;

    if (d > maxDistance || d <= Math.abs(radius1 - radius2)) {
        return;
    } else if (d < radius1 + radius2) { // case circles are overlapping
        u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) /
            (2 * radius1 * d));
        u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) /
            (2 * radius2 * d));
    } else {
        u1 = 0;
        u2 = 0;
    }

    var angle1 = (center2 - center1).getAngleInRadians();
    var angle2 = Math.acos((radius1 - radius2) / d);
    var angle1a = angle1 + u1 + (angle2 - u1) * v;
    var angle1b = angle1 - u1 - (angle2 - u1) * v;
    var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
    var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
    var p1a = center1 + getVector(angle1a, radius1);
    var p1b = center1 + getVector(angle1b, radius1);
    var p2a = center2 + getVector(angle2a, radius2);
    var p2b = center2 + getVector(angle2b, radius2);

    // define handle length by the distance between
    // both ends of the curve to draw
    var totalRadius = (radius1 + radius2);
    var d2 = Math.min(v * handle_len_rate, (p1a - p2a).length / totalRadius);

    // case circles are overlapping:
    d2 *= Math.min(1, d * 2 / (radius1 + radius2));

    radius1 *= d2;
    radius2 *= d2;

    var path = new Path({
        segments: [p1a, p2a, p2b, p1b],
        style: ball1.style,
        closed: true
    });
    var segments = path.segments;
    segments[0].handleOut = getVector(angle1a - pi2, radius1);
    segments[1].handleIn = getVector(angle2a + pi2, radius2);
    segments[2].handleOut = getVector(angle2b - pi2, radius2);
    segments[3].handleIn = getVector(angle1b + pi2, radius1);
    return path;
}

// ------------------------------------------------
function getVector(radians, length) {
    return new Point({
        // Convert radians to degrees:
        angle: radians * 180 / Math.PI,
        length: length
    });
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/canvas/gui.js
 * ===========================================================================================
 */

var menu = new Group();
var panel = new Path.Rectangle({
	topLeft: view.center - 300,
	bottomRight: view.center + 300,
	radius: 10,
	fillColor: 'White',
	opacity: 0.5
});
panel.seleted = false;
var close = new Path.Circle({
	center: view.center - 285,
	radius: 5,
	fillColor: 'red'
});
var keySelector = new Path.Rectangle({
	topLeft: view.center + new Point(-22, -22),
	bottomRight: view.center + new Point(22, 22),
	radius: 5,
	strokeColor: 'red',
	strokeWidth: 3,
	visible: false
});
var rootSelector = new Path.Circle({
	center: view.center,
	radius: 10,
	fillColor: 'red',
	visible: false
});
var reverbSelector = new Path.Rectangle({
	topLeft: view.center + new Point(-22, -22),
	bottomRight: view.center + new Point(42, 22),
	radius: 5,
	strokeColor: 'red',
	strokeWidth: 3,
	visible: false
});
menu.addChildren([panel, close, keySelector, rootSelector, reverbSelector]);
mGUI.addChild(menu);
mGUI.visible = false;

var steps;
// first step:
function selectInstrument() {
	text = new PointText({
		point: view.center - new Point(0, 200),
		justification: 'center',
		content: 'Choose your instrument',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	var mStep = new Group();
	mStep.addChild(text);
	// drum
	var drum = createInstrumentButton('drum', '#ECE9E6', view.center + new Point(0, -120));
	mStep.addChildren(drum);
	// piano
	var piano = createInstrumentButton('piano', '#ECE9E6', view.center + new Point(0, -20));
	mStep.addChildren(piano);
	// other
	var other = createInstrumentButton('other', '#ECE9E6', view.center + new Point(0, 80));
	mStep.addChildren(other);
	// menu old
	if (isNew) {
		var next = createNextButton('next', '#ECE9E6', view.center + new Point(0, 240), 0);
		mStep.addChildren(next);
	}
	// show current menu
	steps.push(mStep);
	keySelector.visible = false;
	rootSelector.visible = false;
	if (isNew) menu.addChild(steps[0]);
	else {
		menu.lastChild.remove();
		menu.addChild(steps[2]);
	}
}

// second step
function selectScale() {
	text = new PointText({
		point: view.center - new Point(0, 200),
		justification: 'center',
		content: 'Choose your key',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	var mStep = new Group();
	mStep.addChild(text);
	var next = createNextButton('next', '#ECE9E6', view.center + new Point(0, 240), 1);
	mStep.addChildren(next);
	// keys
	var keys = [];
	keys.push(createKeyButton('F', view.center + new Point(-120, -120)));
	keys.push(createKeyButton('Dm', view.center + new Point(-120, -60)));
	keys.push(createKeyButton('C', view.center + new Point(-40, -120)));
	keys.push(createKeyButton('Am', view.center + new Point(-40, -60)));
	keys.push(createKeyButton('G', view.center + new Point(40, -120)));
	keys.push(createKeyButton('Em', view.center + new Point(40, -60)));
	keys.push(createKeyButton('D', view.center + new Point(120, -120)));
	keys.push(createKeyButton('Bm', view.center + new Point(120, -60)));
	for (var i = 0; i < keys.length; i++) mStep.addChildren(keys[i]);
	// roots
	var middleText = text.clone();
	middleText.content = 'and starting note';
	middleText.point = view.center + new Point(0, 50);
	mStep.addChild(middleText);
	var roots = [];
	var scaleNum = 7;
	for (var i = 0; i < scaleNum; i++) {
		roots.push(createRootButton(i, view.center + new Point(-120 + i * 40, 120)));
		mStep.addChild(roots[i]);
	}
	// show current menu2
	steps.push(mStep);
	reverbSelector.visible = false;
	menu.lastChild.remove();
	menu.addChild(steps[1]);
}

function selectBPM() {
	text = new PointText({
		point: view.center - new Point(0, 200),
		justification: 'center',
		content: 'Drag to adjust volume',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	var mStep = new Group();
	mStep.addChild(text);
	var scaling = mLollipopContainer.data.gain * 1.5 + 0.3;
	var volume = new Path.Circle({
		center: view.center + new Point((scaling - 1) * 200, -100),
		radius: 30 * scaling,
		fillColor: '#cbe86b',
		alpha: 0.7
	});
	// Install a drag event handler that moves the path along.
	volume.onMouseDrag = function(event) {
		volume.position.x += event.delta.x;
		if (volume.position.x > (view.center.x + 120)) volume.position.x = view.center.x + 120;
		if (volume.position.x < (view.center.x - 120)) volume.position.x = view.center.x - 120;
		volume.scale(1 / scaling); // 0.4~1.6, -0.6 + 0.6
		scaling = 1 + (volume.position.x - view.center.x) / 200;
		volume.scale(scaling);
	}
	volume.onMouseUp = function(event) {
		mLollipopContainer.data.gain = (scaling - 0.3) / 1.5;
	}
	mStep.addChild(volume);
	text = new PointText({
		point: view.center + new Point(0, 50),
		justification: 'center',
		content: 'Choose Reverb',
		fillColor: 'black',
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 18
	});
	mStep.addChild(text);
	// reverb
	var reverbs = [];
	reverbs.push(createReverbButton('None', -1, view.center + new Point(-180, 120)));
	reverbs.push(createReverbButton('Dry', 0, view.center + new Point(-60, 120)));
	reverbs.push(createReverbButton('Hall', 1, view.center + new Point(60, 120)));
	reverbs.push(createReverbButton('Space', 2, view.center + new Point(180, 120)));
	for (var i = 0; i < reverbs.length; i++) mStep.addChildren(reverbs[i]);
	// old menu
	if (!isNew) {
		var next = createNextButton('next', '#ECE9E6', view.center + new Point(0, 240), 0);
		mStep.addChildren(next);
	}

	steps.push(mStep);
	keySelector.visible = false;
	rootSelector.visible = false;
	if (isNew) {
		menu.lastChild.remove();
		menu.addChild(steps[2]);
	} else menu.addChild(steps[0]);
}

function showGUI(_isNew) {
	mGUI.visible = true;
	mGUI.bringToFront();
	steps = [];
	isNew = _isNew;
	if (_isNew) selectInstrument();
	else selectBPM();
}

close.onMouseDown = function() {
	closeGUI();
}

var closeGUI = function() {
	menu.lastChild.remove();
	mGUI.visible = false;
	mGUI.sendToBack();
}

var updateInstrument = function(_ins) {
	_item = mLollipopContainer;
	if (_ins == 'drum') {
		_item.data.instrument = 'drum';
		mColor.hue = 28;
		mColor.brightness = 0.2;
	} else if (_ins == 'piano') {
		_item.data.instrument = 'piano';
		mColor.hue = 1;
		mColor.brightness = 0.98;
	} else {
		_item.data.instrument = 'other';
		mColor.hue = 255;
		mColor.brightness = 0.5;
	}
	for (var i = 1; i < _item.children.length; i++)
		_item.children[i].lastChild.lastChild.fillColor = mColor;
	// mColor.saturation = 0.2;
}

var updateRoot = function(_root) { // name 
	_item = mLollipopContainer;
	switch (_root) {
		case 'C':
			mColor.hue = 1;
			break;
		case 'C#':
			mColor.hue = 10;
			break;
		case 'D':
			mColor.hue = 28;
			break;
		case 'E':
			mColor.hue = 50;
			break;
		case 'F':
			mColor.hue = 88;
			break;
		case 'F#':
			mColor.hue = 100;
			break;
		case 'G':
			mColor.hue = 200;
			break;
		case 'A':
			mColor.hue = 330;
			break;
		case 'A#':
			mColor.hue = 300;
			break;
		case 'B':
			mColor.hue = 240;
			break;
		default:
			mColor.hue = 52;
	};
	for (var i = 1; i < _item.children.length; i++)
		_item.children[i].lastChild.lastChild.fillColor = mColor;
	// mColor.saturation = 0.2;
}


function createInstrumentButton(_name, _color, _center) {
	var _button = new Path.Rectangle({
		topLeft: _center + new Point(-50, -20),
		bottomRight: _center + new Point(50, 20),
		radius: 5,
		fillColor: _color
	});
	var _text = text.clone();
	_text.content = _name;
	_text.point = _center + new Point(0, 5);
	_button.onClick = function() {
		updateInstrument(_name);
	}
	_text.onClick = function() {
		updateInstrument(_name);
	}
	return [_button, _text];
}

function createNextButton(_name, _color, _center, _id) {
	var _button = new Path.Rectangle({
		topLeft: _center + new Point(-50, -20),
		bottomRight: _center + new Point(50, 20),
		radius: 5,
		fillColor: _color
	});
	var _text = text.clone();
	_text.content = _name;
	_text.point = _center + new Point(0, 5);
	if (_id == 1) {
		if (isNew) {
			_button.onClick = function() {
				selectBPM();
			}
			_text.onClick = function() {
				selectBPM();
			}
		} else {
			_button.onClick = function() {
				selectInstrument();
			}
			_text.onClick = function() {
				selectInstrument();
			}
		}
	} else {
		_button.onClick = function() {
			selectScale();
		}
		_text.onClick = function() {
			selectScale();
		}
	}
	return [_button, _text];
}

function createKeyButton(_name, _center) {
	var _button = new Path.Rectangle({
		topLeft: _center + new Point(-20, -20),
		bottomRight: _center + new Point(20, 20),
		radius: 5,
		strokeColor: '#ECE9E6',
		strokeWidth: 2
	});
	var _text = text.clone();
	_text.content = _name;
	_text.point = _center + new Point(0, 5);
	if (mLollipopContainer.data.key == _name) {
		keySelector.position = _center;
		keySelector.visible = true;
	}
	_text.onClick = function() {
		keySelector.position = _center;
		mLollipopContainer.data.key = _text.content;
	}
	return [_button, _text];
}

function createRootButton(_index, _center) {
	var _button = new Path.Circle({
		center: _center,
		radius: 6,
		fillColor: 'black',
	});
	var _text = text.clone();
	_text.content = _index;
	_text.point = _center + new Point(0, -15);
	_text.visible = false;
	_button.onMouseEnter = function() {
		var keyArray = findKey(mLollipopContainer.data.key);
		_text.content = keyArray[_index];
		_text.visible = true;
	}
	_button.onMouseLeave = function() {
		_text.visible = false;
	}
	if (mLollipopContainer.data.root == _index) {
		rootSelector.position = _center;
		rootSelector.visible = true;
	}
	_button.onClick = function() {
		rootSelector.position = _center;
		mLollipopContainer.data.root = _index;
		var keyArray = findKey(mLollipopContainer.data.key);
		updateRoot(keyArray[_index]);
	}
	return _button;
}

function createReverbButton(_name, _index, _center) {
	var _button = new Path.Rectangle({
		topLeft: _center + new Point(-30, -20),
		bottomRight: _center + new Point(30, 20),
		radius: 5,
		strokeColor: '#ECE9E6',
		strokeWidth: 2
	});
	_button.data.index = _index;
	var _text = text.clone();
	_text.content = _name;
	_text.point = _center + new Point(0, 5);
	if (mLollipopContainer.data.reverb == _index) {
		reverbSelector.position = _center;
		reverbSelector.visible = true;
	}
	_text.onClick = function() {
		reverbSelector.position = _center;
		mLollipopContainer.data.reverb = _button.data.index;
	}
	return [_button, _text];
};