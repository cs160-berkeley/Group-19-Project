import { PressButton, PressButtonBehavior } from 'pressButton';

/* Google Static Maps API Key */
var API_KEY = "AIzaSyC_sRp-r4LtPdDRd6mfTqbmB8uYoy1a73o";

/* Google Static Maps API Url */
var BASE_URL = "https://maps.googleapis.com/maps/api/staticmap?";

var mainContainer = new Container({
	top: 0, left: 0, right: 0, bottom: 0,
	skin: new Skin({fill: "blue"})
})

var mapParams = {
	center: "Shattuck and Hearst, Berkeley, CA",
	zoom: 16,
	size: "600x300",
	maptype: "roadmap",
	/*
	markers: [
		{ color: "blue", label: "S", location: "40.702147,-74.015794" },
		{ color: "green", label: "G", location: "40.711614,-74.012318" },
		{ color: "red", label: "C", location: "40.718217,-73.998284" }
	],*/
};

/* 	Builds an animated Google Map view with zooming features.
	Static map images are preloaded for closeby zoom levels.
	Currently all animations must be passed in on construction for clean 
	queueing of frame changes and preloading of future frames.

	MAPPARAMS: General map params including current center of map, and optional markers.
	ACTIONS: List of actions which describe the animations of markers (see below).
	FRAMERATE: The rate at which markers are animated.

	Actions are defined as an object with the following pairings:
		markerId: the index of the original marker passed in
		deltaLat: change of the latitude of specified marker from previous frame
		deltaLon: change of the longitude of specified marker from previous frame 
*/
export var GoogleMapProvider = function(mapParams, actions=[], frameRate=0.0) {
	var FRAME_SIZE = 5;
	var frameDepth = Math.floor(FRAME_SIZE / 2);

	var sizeSplit = mapParams.size.split("x");
	var width = parseInt(sizeSplit[0]);
	var height = parseInt(sizeSplit[1]);

	var currentParams = mapParams;
	currentParams.key = API_KEY;
	this.frameBuffer = [
		buildFrame(mapParams)
	];

	for (var i = 0; i < actions.length; i += 1) {
		var action = actions[i];

		var markers = currentParams.markers.slice();
		var marker = markers[action.markerId];

		var split = marker.location.split(",");
		var lat = parseFloat(split[0]);
		var lon = parseFloat(split[1]);

		var newLat = lat + action.deltaLat;
		var newLon = lon + action.deltaLon;

		var newLocation = newLat.toString() + "," + newLon.toString();
		markers[action.markerId].location = newLocation;

		currentParams = join(currentParams, { markers: markers });

		var frame = buildFrame(currentParams);
		trace(frame[2].url + "\n");
		this.frameBuffer.push(frame);
	}

	var zoomButtons = new Column({
		bottom: 0, right: 0, height: 134, width: 66,
		contents: [
			new Container({
				top: 0, left: 0, right: 0, height: 67,
				contents: [
					new PressButton({
						top: 12, left: 9, height: 48, width: 48,
						downImage: new Picture({
		                    top: 0, bottom: 0, left: 0, right: 0, url: "assets/zoomButtonDown.png"
		                }),
						Behavior: class extends PressButtonBehavior {
							onTap(container) {
								trace("Zoom in\n");
								updateZoom(1);
							}
						},
						contents: [
							new Picture({
								top: 0, bottom: 0, left: 0, right: 0,
								url: "assets/zoomButtonUp.png"
							})
						]
					})
				]
				}),
			new Container({
				top: 0, left: 0, right: 0, height: 67,
				contents: [
					new PressButton({
						top: 6, left: 9, height: 48, width: 48,
						downImage: new Picture({
		                    top: 0, bottom: 0, left: 0, right: 0, url: "assets/zoomOutButtonDown.png"
		                }),
						Behavior: class extends PressButtonBehavior {
							onTap(container) {
								trace("Zoom out\n");
								updateZoom(-1);
							}
						},
						contents: [
							new Picture({
								top: 0, bottom: 0, left: 0, right: 0,
								url: "assets/zoomOutButtonUp.png"
							})
						]
					})
				]
			})
		]
	});

	this.mapContainer = new Container({
		top: 0, left: 0, width: width, height: height,
		skin: new Skin({
			fill: "black"
		}),
		contents: [
			new Picture({
				top: 0, left: 0, width: width
			}),
			zoomButtons
		]
	});

	Handler.bind("/setTimeout", {
	    onInvoke: function(handler, message){
	        handler.wait(message.requestObject.duration);
	    }
	});

	var setTimeout = function(callback, duration, callbackArgs) {
		new MessageWithObject("/setTimeout", {duration}).invoke().then(() => {
			if (callback) callback(callbackArgs);
		});
	}

	var animate = function(args){
		var buffer = args.buffer;
		var mapContainer = args.mapContainer;

		if (buffer.length <= 0) return;

		var currentFrame = buffer.shift();
		mapContainer.replace(mapContainer.first, currentFrame[2]);

		setTimeout(animate, frameRate, { buffer: buffer, mapContainer: mapContainer });
	}

	// Display initial image
	this.mapContainer.replace(this.mapContainer.first, this.frameBuffer.shift()[2]);

	setTimeout(animate, frameRate, { buffer: this.frameBuffer, mapContainer: this.mapContainer });

	function buildFrame(params) {
		var frame = [];
		var currentFrameDepth = -1 * frameDepth;

		for (var i = 0; i < FRAME_SIZE; i += 1) {
			frame[i] = generateImage(join(params, {zoom: params.zoom + currentFrameDepth}));
			currentFrameDepth += 1;
		}

		return frame;
	}

	function generateImage(params) {
		return new Picture({
			top: 0, left: 0, width: width,
			url: getMapImageUrl(params)
		});
	}

	function getMapImageUrl(params) {
		return BASE_URL + getParameterString(params, ["location"]);
	}

	// Either zooms in or out. DIRECTION should only be -1 or 1. Undefined behavior otherwise.
	let updateZoom = function(direction) {
		currentZoomLevel += direction;

		// If direction == -1, then the user is going lower, so an image with a lower zoom level
		// must be added at the edge.
		// Else, an image with a higher zoom level must be added at the edge.
		var edgeZoomLevel = direction * Math.floor(ZOOM_QUEUE_SIZE / 2);

		var edgeImage = new ZoomImage({
			url: mapProvider.getMapImageUrl({ zoom: edgeZoomLevel })
		});

		if (direction < 0) {
			zoomQueue.splice(ZOOM_QUEUE_SIZE - 1, 1);
			zoomQueue.push(edgeImage);
		} else {
			zoomQueue.pop();
			zoomQueue[ZOOM_QUEUE_SIZE - 1] = edgeImage;
		}

		var currentImage = mapContainer.first;
		mapContainer.replace(currentImage, zoomQueue[2]);
	}
}

/* Creates a string such that each key, value pair in PARAMETERS are url encoded. */
function getParameterString(parameters, omitKeys=[]) {
	var resultUrl = "";
	Object.keys(parameters).forEach(function(key, index) {
		trace("KEY: " + key + "\n");
		var value = parameters[key];
		
		if (Array.isArray(value)) {
			var resultValue = "";
			for (var i = 0; i < value.length; i += 1) {
				if (!contains(omitKeys, key)) {
					resultValue += key + "=";
				}
				resultValue += getPipedParameterString(value[i], omitKeys) + "&"; 
			}
			
			trace("ARRAY VAL: " + resultValue + "\n");
			resultUrl += resultValue;
			return;
		}
		
		value = parameters[key].toString().replace(/ /g, "+");
		trace("VAL: " + value + "\n");
		
		if (!contains(omitKeys, key)) {
			resultUrl += key + "=";
		}
		resultUrl += value + "&";
	});
	return resultUrl.slice(0, -1);
}

/* Creates a string such that each key, value pair in PARAMETERS are piped in url encoding. */
function getPipedParameterString(parameters, omitKeys=[]) {
	var resultUrl = "";
	Object.keys(parameters).forEach(function(key, index) {
		var value = parameters[key].toString();
		if (!contains(omitKeys, key)) {
			resultUrl += key + ":";
		}
		resultUrl += value + "%7C";
	});
	return resultUrl.slice(0, -3);
}

function contains(array, value) {
  return array.indexOf(value) > -1;
}

function join(original, additional) {
	var result = {};
	Object.keys(original).forEach(function(key, index) {
		result[key] = original[key];
	});

	Object.keys(additional).forEach(function(key, index) {

		result[key] = additional[key];

	});
	return result;
}