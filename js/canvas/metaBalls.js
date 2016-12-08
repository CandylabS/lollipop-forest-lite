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
}