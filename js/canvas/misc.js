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
}