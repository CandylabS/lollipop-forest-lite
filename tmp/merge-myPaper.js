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
	mDot.data.initAngle = (mDot.position - _path.position).angle;// - tripleParent(_path).data.rod;
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
	console.log("dotRemain: "+ tripleParent(path).data.dotNum);
}

function addCircle() {
	console.log(hitResult.item.parent);
	// console.log(hitResult.item.parent.children.length);
	circle = tripleLastChild(tripleParent(hitResult.item)).clone();
	circle.name = 'circle';
	circle.scale(0.8);
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
		tripleParent(hitResult.item).remove();
		if (!mForest.hasChildren()) draw.activate(); // when there is no lollipop, switch into draw tool
	} else {
		var index = tripleParent(hitResult.item).children.length - 1;
		tripleParent(hitResult.item).data.dotNum -= tripleParent(hitResult.item).children[index].data.dotNum;
		tripleParent(hitResult.item).removeChildren(index);
		if (tripleParent(hitResult.item).data.dotNum <= 0) {
			tripleParent(hitResult.item).firstChild.lastChild.remove(); // remove startpoint
			tripleParent(hitResult.item).data.dotNum = 0;
		}
	}
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
		mute: false
	}
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
		strokeColor: '#9C9C9A',
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
	_lollipopContainer.data.octave = bandCeil - Math.round(tripleLastChild(_lollipopContainer).position.y / bandWidth);
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
}

// change color on next lollipop
draw.onMouseDown = function(event) {
    mColor.hue = 360 * Math.random();
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
                        if (event.point.isClose(divisionGroup.children[i].position, path.bounds.width / 5)) {
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
            // console.log(tripleParent(path).children.length);
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
    mBands.visible = true;
    mBands.sendToBack();
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
        console.log("octave: " + tripleParent(path).data.octave);
        if (mDot) mDot.visible = true;
    }
}

// add circle and remove circle
edit.onKeyDown = function(event) {
    if (event.key == 'enter') {
        draw.activate();
    }
    if (Key.modifiers.control) {
        if (Key.isDown('m')) {
            if (meta) {
                metaBall.remove();
            } else {
                generateMeta();
                console.log("metaBall!");
            }
            meta = !meta;
        }
    }
    //test key
    if (event.key == 'o') {
        console.log("init rotation " + metaBall.data.delta);
    }
    if (hitResult && hitResult.item.name == 'circle') {
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

        if (event.key == 'a') {
            var speed = tripleParent(hitResult.item).data.speed + 0.1;
            setSpeed(tripleParent(hitResult.item), speed);
        }
        if (event.key == 'z') {
            var speed = tripleParent(hitResult.item).data.speed - 0.1;
            setSpeed(tripleParent(hitResult.item), speed);
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
				if (_item.intersects(dot2rod(_item))) doubleParent(_item).data.mute = false;
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
			if (!doubleParent(_item).data.mute) {
				_item.data.hit = true;
				if (doubleParent(_item).data.octave == 4) {
					playSample('Grand Piano', 'F4', audioContext.destination);
				} else if (doubleParent(_item).data.octave == 5) {
					playSample('Grand Piano', 'F5', audioContext.destination);
				} else {
					playSample('Grand Piano', 'F6', audioContext.destination);
				}
			}
			console.log('hit');
			console.log(_item.rotation + _item.data.initAngle);
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
function generateMeta() {
    metaBall = new Path.Circle({
        center: view.center,
        radius: 50,
        fillColor: 'white',
        opacity: 0.5
    });
    metaBall.data.fire = false;
    metaBall.onMouseMove = function(event) {
        this.position = event.point;
        generateConnections(circlePaths);
        console.log("circlepath: " + circlePaths.length);
    }
}

function initMetaData(_path) {
    if (tripleParent(_path).data.dotNum > 0) {
        var ref = tripleParent(_path).firstChild.lastChild;
        if (!metaBall.data.fire) {
            metaBall.data.delta = tripleParent(_path).data.rod - (ref.data.initAngle + ref.rotation);
            metaBall.data.playback = tripleParent(_path).data.playback;
            metaBall.data.speed = tripleParent(_path).data.speed;
            console.log("meta delta: " + metaBall.data.delta);
            console.log("meta playback: " + metaBall.data.playback);
            console.log("meta speed: " + metaBall.data.playback);
            metaBall.data.fire = true;
        } else {
            var angle = metaBall.data.delta + (ref.data.initAngle + ref.rotation);
            path2rod(_path).rotate(angle - tripleParent(_path).data.rod, tripleLastChild(tripleParent(_path)).position);
            tripleParent(_path).data.rod = angle;
            tripleParent(_path).data.playback = metaBall.data.playback;
            tripleParent(_path).data.speed = metaBall.data.speed;
            tripleParent(_path).data.mute = true;
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