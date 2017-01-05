/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/web_audio/fx.js
 * ===========================================================================================
 */

const CONVOLVER = [
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/convolver/PlateSuperDry.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/convolver/RoomConcertHall.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/convolver/AirportTerminal.wav'
];

const DRUM = [
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/drum/kick.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/drum/snare.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/drum/close_hat.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/drum/open_hat.wav'
];

const PIANO = [
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-a4.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-a5.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-a6.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-c4.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-c5.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-c6.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-ds4.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-ds5.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-ds6.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-fs4.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-fs5.wav',
	'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-fs6.wav'
];

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/web_audio/scale.js
 * ===========================================================================================
 */

const F_MAJOR = ['F', 'G', 'A', 'A#', 'C', 'D', 'E'];
const D_MINOR = ['D', 'E', 'F', 'G', 'A', 'A#', 'C'];

const C_MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const A_MINOR = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const G_MAJOR = ['G', 'A', 'B', 'C', 'D', 'E', 'F#'];
const E_MINOR = ['E', 'F#', 'G', 'A', 'B', 'C', 'D'];

const D_MAJOR = ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'];
const B_MINOR = ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'];

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SAMPLE_LIBRARY = {
	'Grand Piano': [{
		note: 'A',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-a4.wav'
	}, {
		note: 'A',
		octave: 5,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-a5.wav'
	}, {
		note: 'A',
		octave: 6,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-a6.wav'
	}, {
		note: 'C',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-c4.wav'
	}, {
		note: 'C',
		octave: 5,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-c5.wav'
	}, {
		note: 'C',
		octave: 6,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-c6.wav'
	}, {
		note: 'D#',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-ds4.wav'
	}, {
		note: 'D#',
		octave: 5,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-ds5.wav'
	}, {
		note: 'D#',
		octave: 6,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-ds6.wav'
	}, {
		note: 'F#',
		octave: 4,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-fs4.wav'
	}, {
		note: 'F#',
		octave: 5,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-fs5.wav'
	}, {
		note: 'F#',
		octave: 6,
		file: 'https://cdn.rawgit.com/CandylabS/Lollipop-Forest/master/samples/Grand%20Piano/piano-f-fs6.wav'
	}]
};

// ======================PITCH SHIFT=========================
function flatToSharp(note) {
	switch (note) {
		case 'Bb':
			return 'A#';
		case 'Db':
			return 'C#';
		case 'Eb':
			return 'D#';
		case 'Gb':
			return 'F#';
		case 'Ab':
			return 'G#';
		default:
			return note;
	}
};

function noteValue(note, octave) {
	return octave * 12 + OCTAVE.indexOf(note);
};

function getNoteDistance(note1, octave1, note2, octave2) {
	return noteValue(note1, octave1) - noteValue(note2, octave2);
}

// this is very useful sort
function getNearestSample(sampleBank, note, octave) {
	// didn't quite understand..
	let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
		let distanceA = Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
		let distanceB = Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
		return distanceA - distanceB;
	});
	// console.log("sortedBank " + sortedBank[0].note + sortedBank[0].octave);
	// console.log("atSortedBank" + sampleBank.indexOf(sortedBank[0]));
	return sortedBank[0];
};

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/web_audio/sampler.js
 * ===========================================================================================
 */

// =======================SET AUDIO==============================
let audioContext = new AudioContext();
var gainNode = audioContext.createGain();
var panNode = audioContext.createStereoPanner();
// panNode.pan.value = -0.5;
// gainNode.gain.value = 0.5;

function fetchSample(path) {
	return fetch(decodeURIComponent(path))
		.then(response => response.arrayBuffer())
		.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function getSample(instrument, noteAndOctave) {
	let [, requestedNote, requestedOctave] = /^(\w[b#]?)(\d)$/.exec(noteAndOctave);
	requestedOctave = parseInt(requestedOctave, 10);
	requestedNote = flatToSharp(requestedNote);

	let sampleBank = SAMPLE_LIBRARY[instrument];
	let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
	let distance = getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);
	// let note = SAMPLE_LIBRARY[instrument].indexOf(sample);

	return fetchSample(sample.file).then(audioBuffer => ({
		audioBuffer: audioBuffer,
		distance: distance,
	}));
}

// function getSample(instrument, note, octave) {
// 	let sampleBank = SAMPLE_LIBRARY[instrument];
// 	let sample = getNearestSample(sampleBank, note, octave);
// 	let distance = getNoteDistance(note, octave, sample.note, sample.octave);
// 	// let note = SAMPLE_LIBRARY[instrument].indexOf(sample);

// 	return fetchSample(sample.file).then(audioBuffer => ({
// 		audioBuffer: audioBuffer,
// 		distance: distance,
// 		note: sample.note,
// 		octave: sample.octave
// 	}));
// }

function playPianoSample(instrument, noteAndOctave, gain, pan, convolver, delaySeconds = 0) {
	getSample(instrument, noteAndOctave).then(({
		audioBuffer,
		distance
	}) => {
		let playbackRate = Math.pow(2, distance / 12);
		let bufferSource = audioContext.createBufferSource();
		bufferSource.buffer = audioBuffer;
		bufferSource.playbackRate.value = playbackRate;
		gainNode.gain.value = gain;
		panNode.pan.value = pan;
		if (convolver < 0) {
			bufferSource.connect(panNode);
		} else {
			bufferSource.connect(mConvolver[convolver]);
			mConvolver[convolver].connect(panNode);
		}
		panNode.connect(gainNode);
		gainNode.connect(audioContext.destination);
		bufferSource.start(audioContext.currentTime + delaySeconds);
	});
}

// function playPianoSample(instrument, note, octave, gain, pan, convolver, delaySeconds = 0) {
// 	// let map = getSample(instrument, noteAndOctave)
// 	let bufferSource = audioContext.createBufferSource();
// 	var index = OCTAVE.indexOf(note) * 3 + octave - 4;
// 	bufferSource.buffer = mPiano[octave]; //mPiano[index];
// 	let playbackRate = mShift[octave]; //mShift[index];
// 	console.log("shift: " + mShift[octave]);
// 	// let distance = map[1];
// 	// console.log('note: ' + map[0]);
// 	// console.log('distance: ' + distance);
// 	// let playbackRate = Math.pow(2, distance / 12);
// 	bufferSource.playbackRate.value = playbackRate;
// 	gainNode.gain.value = gain;
// 	panNode.pan.value = pan;
// 	if (convolver < 0) {
// 		bufferSource.connect(panNode);
// 	} else {
// 		bufferSource.connect(mConvolver[convolver]);
// 		mConvolver[convolver].connect(panNode);
// 	}
// 	panNode.connect(gainNode);
// 	gainNode.connect(audioContext.destination);
// 	bufferSource.start(audioContext.currentTime + delaySeconds);
// }

function playDrumSample(note, octave, gain, pan, convolver, delaySeconds = 0) {
	let bufferSource = audioContext.createBufferSource();
	bufferSource.buffer = mDrum[note];
	gainNode.gain.value = gain;
	panNode.pan.value = pan;
	if (convolver < 0) {
		bufferSource.connect(panNode);
	} else {
		bufferSource.connect(mConvolver[convolver]);
		mConvolver[convolver].connect(panNode);
	}
	panNode.connect(gainNode);
	gainNode.connect(audioContext.destination);
	bufferSource.start(audioContext.currentTime + delaySeconds);
}
//****************** Load Samples *********************
var mConvolver = [];
for (var i = 0; i < CONVOLVER.length; i++) {
	fetchSample(CONVOLVER[i]).then(convolverBuffer => {
		let convolver = audioContext.createConvolver();
		convolver.buffer = convolverBuffer;
		mConvolver.push(convolver);
	})
}

var mDrum = [];
for (var i = 0; i < DRUM.length; i++) {
	fetchSample(DRUM[i]).then(audioBuffer => {
		// let bufferSource = audioContext.createBufferSource();
		// bufferSource.buffer = audioBuffer;
		mDrum.push(audioBuffer);
	});
}

// for (var i = 0; i < PIANO.length; i++) {
// 	// console.log('LIBRARY: '+ bank[i].note + bank[i].octave);
// 	fetchSample(PIANO[i]).then(audioBuffer => {
// 		// let bufferSource = audioContext.createBufferSource();
// 		// bufferSource.buffer = audioBuffer;
// 		mPiano.push(audioBuffer);
// 	});
// };

/*
 * ===========================================================================================
 * MERGED: /Users/ssmilkshake/Lollipop-Forest/public/js/web_audio/player.js
 * ===========================================================================================
 */

// percussion
function playDrum(_item, _data) {
	playDrumSample(_item.parent.index - 1, '', _data.gain, _data.pan, _data.reverb);
}

// piano and similar
function playPiano(_item, _data) {
	// console.log(_item.parent.index);
	var keyArray = findKey(_data.key);
	var index = _item.parent.index + _data.root;
	if (index > 7) {
		index -= 8;
		// octave += 1;
	} else {
		index -= 1;
	}
	var note = keyArray[index];
	var octave = _data.octave;
	if (index >= shiftKey(_data.key)) octave += 1;
	console.log('note+octave' + note + octave);
	console.log('reverb' + _data.reverb);
	console.log('gain' + _data.gain);
	playPianoSample('Grand Piano', note + octave, _data.gain, _data.pan, _data.reverb);
}

function findKey(_key) {
	var keyArray;
	switch (_key) {
		case 'F':
			keyArray = F_MAJOR;
			break;
		case 'Dm':
			keyArray = D_MINOR;
			break;
		case 'C':
			keyArray = C_MAJOR;
			break;
		case 'Am':
			keyArray = A_MINOR;
			break;
		case 'G':
			keyArray = G_MAJOR;
			break;
		case 'Em':
			keyArray = E_MINOR;
			break;
		case 'D':
			keyArray = F_MAJOR;
			break;
		case 'Bm':
			keyArray = B_MINOR;
			break;
		default:
			keyArray = [];
	};
	return keyArray;
}

function shiftKey(_key) {
	var shift;
	switch (_key) {
		case 'F':
			shift = 4;
			break;
		case 'Dm':
			shift = 6;
			break;
		case 'C':
			shift = 7;
			break;
		case 'Am':
			shift = 2;
			break;
		case 'G':
			shift = 3;
			break;
		case 'Em':
			shift = 5;
			break;
		case 'D':
			shift = 6;
			break;
		case 'Bm':
			shift = 1;
			break;
		default:
			shift = 7;
	};
	return shift;
};