import { PressButton, PressButtonBehavior } from 'pressButton';

var WIDTH = 320;
var HEIGHT = 380;

var FRAME_SIZE = 5;
var FRAME_BUFFER_SIZE = 5;

var ZOOM_FLOOR = 13;
var ZOOM_CEILING = 16;
var frameDepth = Math.floor(FRAME_SIZE / 2);

var BUBBLE_DIMENSIONS = 58;

/* Google Static Maps API Key */
var API_KEY = "AIzaSyC_sRp-r4LtPdDRd6mfTqbmB8uYoy1a73o";

/* Google Static Maps API Url */
var BASE_URL = "https://maps.googleapis.com/maps/api/staticmap?";

function coordinateToPixels(lat, lon) {
	return [
		Math.ceil(lat * 40000),
		Math.ceil(lon * -40000)
	];
}

//function pixelsToCoordinate(centerLat, centerLon, centerX, centerY, )

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
	var completeParams = join(params, { key: API_KEY });
	return new Picture({
		name: "mapTexture",
		top: 0, left: 0, right: 0,
		url: getMapImageUrl(completeParams),
		mapParams: completeParams,

		Behavior: class extends Behavior {
			onCreate(picture) {
				this.mapParams = completeParams;
			}
		}
	});
}

export var coordinatesFromLocationString = function(string) {
	var splits = string.split(",");
	return {
		lat: parseFloat(splits[0]), lon: parseFloat(splits[1])
	};
}

function getMapImageUrl(params) {
	return BASE_URL + getParameterString(params, ["location"]);
}

export var getLocationString = function(lat, lon) {
	return lat.toString() + "," + lon.toString();
}

function roundToFour(num) {    
    return +(Math.round(num + "e+4")  + "e-4");
}

function buildMarker(index, centerLat, centerLon) {
	var markerData = application.behavior.childrenData[index];

	var puckEffect = new Effect;
	puckEffect.colorize(markerData.color, 1);

	var shadowEffect = new Effect;
	shadowEffect.colorize(markerData.color, 0.5);

	var marker = new Container({
		top: 0, left: 0,
		height: BUBBLE_DIMENSIONS + 12, width: BUBBLE_DIMENSIONS, active: true,
		/*
		skin: new Skin({
			fill: "transparent",
			borders: {top: 2, left: 2, right: 2, bottom: 2},
			stroke: "orange"
		}),*/
		Behavior: class extends Behavior {
			onCreate(marker) {
				this.initialized = false;
				this.data = markerData;
				
				/*
				this.startTime = Date.now();
				this.interval = markerData.movement.interval;
				this.data = markerData;

				this.lat = centerLat + markerData.startOffset.lat;
				this.lon = centerLon + markerData.startOffset.lon;

				//debugger;

				this.deltaLat = markerData.movement.deltaLat;
				this.deltaLon = markerData.movement.deltaLon;*/

				marker.start();
			}

			onTouchEnded(marker) {
				application.behavior.pinPressed(index);
			}

			onDisplayed(marker) {
				if (!this.initialized) {
					this.updatePosition(marker);

					this.initialized = true;
				}
			}

			updatePosition(marker) {
				var markerPlane = marker.container;

				var planeCenterX = markerPlane.x + markerPlane.width * 0.5;
				var planeCenterY = markerPlane.y + markerPlane.height * 0.5;

				var pixelOffsets = coordinateToPixels(markerData.offset.lat, markerData.offset.lon);
				marker.x = planeCenterX + pixelOffsets[0];
				marker.y = planeCenterY + pixelOffsets[1];

				// Center bottom
				marker.x -= marker.width * 0.5;
				marker.y -= BUBBLE_DIMENSIONS;
			}

			onTimeChanged(marker) {
				this.updatePosition(marker);			
			}
		},
		contents: [
			new Picture({
				name: "shadow",
				bottom: 0, left: 17, height: 24, width: 24,
				effect: shadowEffect,
				url: "assets/puck.png"
			}),
			new Picture({
				name: "puck",
				bottom: 2, left: 19, height: 20, width: 20,
				effect: puckEffect,
				url: "assets/puck.png"
			}),		
			new Picture({
				name: "bubble",
				top: 0, left: 1, height: BUBBLE_DIMENSIONS, width: BUBBLE_DIMENSIONS,
				url: "assets/bubble.png"
			}),
			new Picture({
				name: "childImage",
				height: 39, width: 39, left: 10, top: 5,
				url: markerData.imageUrl
			})
		]
	});

	return marker;
}

// Outer map view
	// Marker plane
	// Map texture
	// Zoom button
	// Focus button

var ZoomButtons = Column.template(params => ({
	bottom: 3, right: 3, height: 100, width: 50,
	name: "zoomButtons",
	contents: [
		new Container({
			top: 0, left: 0, right: 0, height: 50,
			
			contents: [
				new PressButton({
					top: 5, left: 5, height: 40, width: 40,
					downImage: new Picture({
	                    top: 0, bottom: 0, left: 0, right: 0, url: "assets/zoomButtonDown.png"
	                }),
	                unavailableImage: null,
					Behavior: class extends PressButtonBehavior {
						onTap(container) {
							var buttons = container.container.container;
							buttons.bubble("zoomIn");
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
			top: 0, left: 0, right: 0, height: 50,
			contents: [
				new PressButton({
					top: 5, left: 5, height: 40, width: 40,
					downImage: new Picture({
	                    top: 0, bottom: 0, left: 0, right: 0, url: "assets/zoomOutButtonDown.png"
	                }),
					Behavior: class extends PressButtonBehavior {
						onTap(container) {
							var buttons = container.container.container;
							buttons.bubble("zoomOut");
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
	],
	Behavior: class extends Behavior {
		zoomIn() { }
		zoomOut() { }
	}
}));

export var GoogleMapView = Container.template(params => ({
	top: 0, left: 0, width: params.width, height: params.height,
	Behavior: class extends Behavior {
		onCreate(view) {
			this.initialized = false;
		}

		onDisplaying(view) {
			if (!this.initialized) {
				this.view = view; 

				var mapHeight = params.height + 24;
				var mapSize = params.width.toString() + "x" + mapHeight.toString();

				this.mapParams = join(params.mapParams, { center: application.behavior.yourPosition, size: mapSize });
				
				this.currentZoom = this.mapParams.zoom;

				var centerSplit = application.behavior.yourPosition.split(",");
				this.centerLat = parseFloat(centerSplit[0]);
				this.centerLon = parseFloat(centerSplit[1]);

				this.frame = buildFrame(this.mapParams);

				this.view.add(this.frame[2]);

				var effect = new Effect;
				effect.colorize("green", 0.95);

				this.markerPlane = new Container({
					name: "markerPlane",
					width: WIDTH, height: HEIGHT,
					Behavior: class extends Behavior {
						onTouchEnded(plane) {
							//plane.bubble("zoomOut");
						}

						zoomOut() {}
					}
				});
				var markerPlane = this.markerPlane;

				
				for (var i = 0; i < application.behavior.childrenData.length; i += 1) {
					//var markerData = data.markers[i];
					var marker = buildMarker(i, this.centerLat, this.centerLon);
					markerPlane.add(marker);
				}

				this.view.add(new Picture({
					top: this.view.width * 0.5 - 16, left: this.view.height * 0.5 - 16,
					height: 32, width: 32,
					url: "assets/centerPuck.png"
				}));

				this.view.add(markerPlane);

				this.view.add(new ZoomButtons());

				this.initialized = true;
			}

			application.behavior.moveCallback = false;
		}

		zoomIn() {
			trace("View zoom in\n");
			this.updateZoom(1);
		}

		zoomOut() {
			trace("View zoom out\n");
			this.updateZoom(-1);
		}

		addMarker() {
			var marker = buildMarker(application.behavior.childrenData.length - 1, this.centerLat, this.centerLon);
			this.markerPlane.add(marker);
		}

		updateZoom(direction) {
			var potentialZoom = this.currentZoom + direction;
			if (potentialZoom < ZOOM_FLOOR || potentialZoom > ZOOM_CEILING) return;

			this.currentZoom = potentialZoom;
			var minusButton = this.view.zoomButtons.last.first;
			var plusButton = this.view.zoomButtons.first.first;
			if (this.currentZoom == ZOOM_FLOOR) {
				minusButton.behavior.makeUnavailable();
			} else {
				minusButton.behavior.makeAvailable();
			}

			if (this.currentZoom == ZOOM_CEILING) {
				plusButton.behavior.makeUnavailable();
			} else {
				plusButton.behavior.makeAvailable();
			}

			// If direction == -1, then the user is going lower, so an image with a lower zoom level
			// must be added at the edge.
			// Else, an image with a higher zoom level must be added at the edge.
			var edgeZoomLevel = direction * Math.floor(FRAME_SIZE / 2);

			var edgeTexture = generateImage(join(this.mapParams, { 
				zoom: this.currentZoom + edgeZoomLevel 
			}));

			// Update frame
			if (direction < 0) {
				this.frame.splice(FRAME_SIZE - 1, 1);
				this.frame.unshift(edgeTexture);
			} else {
				this.frame.shift();
				this.frame.push(edgeTexture);
			}

			var markerPlane = this.view.markerPlane;
			var marker = markerPlane.first;

			// Update marker positions
			adjustMarker(marker, direction, markerPlane);

			// Update map scale
			var currentTexture = this.view.mapTexture;
			this.view.replace(currentTexture, this.frame[2]);
		}

		getMarker(index) {
			if (index >= this.view.markerPlane.length) return null;

			var current = this.view.markerPlane.first;
			var i = index;
			while (i < index) {
				current = current.next;
				i += 1;
			}
			return current;
		}
	}
}));

export var GoogleMapCenteredView = Container.template(params => ({
	top: 0, left: 0, width: Math.ceil(params.width), height: Math.ceil(params.height),
	Behavior: class extends Behavior {
		onCreate(view) {
			this.initialized = false;
		}

		onDisplaying(view) {
			if (!this.initialized) {
				this.view = view; 
				this.currentZoom = params.mapParams.zoom;

				this.childIndex = params.childIndex;

				this.data = application.behavior.childrenData[this.childIndex];

				var mapHeight = Math.ceil(params.height + 24);
				this.mapSize = params.width.toString() + "x" + mapHeight.toString();
				
				// Get an oversized image vertically to cover up Google Maps logos
				var parentCenter = coordinatesFromLocationString(application.behavior.yourPosition);
				this.centerLat = parentCenter.lat + this.data.offset.lat;
				this.centerLon = parentCenter.lon + this.data.offset.lon;

				this.baseParams = join(params.mapParams, {
					center: getLocationString(this.centerLat, this.centerLon),
					size: this.mapSize
				});

				//this.deltaLon = params.deltaLon;
				//this.deltaLat = params.deltaLat;

				this.frameBuffer = [
					buildFrame(this.baseParams)
				];

				//debugger;

				// Fill frame buffer for smooth future animations
				
				this.edgeLat = this.centerLat;
				this.edgeLon = this.centerLon;

				for (var i = 0; i < FRAME_BUFFER_SIZE - 1; i += 1) {
					this.addToFrameBuffer();
				}
							
				// Centered marker
				/*
				var marker = new Container({
					top: params.height * 0.5 - (BUBBLE_DIMENSIONS + 12) * 0.5, left: params.width * 0.5 - BUBBLE_DIMENSIONS * 0.5,
					height: BUBBLE_DIMENSIONS + 12, width: BUBBLE_DIMENSIONS,
					skin: new Skin({
						fill: "transparent",
						borders: {top: 2, left: 2, right: 2, bottom: 2},
						stroke: "orange"
					}),
					contents: [
						new Picture({
							top: 0, left: 0, right: 0, bottom: 0,
							url: "assets/zoomButtonDown.png"
						}),
						new Picture({
							top: 4, left: 4, width: 32, height: 32,
							url: "assets/enki.png"
						})
					]
				});*/
				var puckEffect = new Effect;
				puckEffect.colorize(this.data.color, 1);

				var shadowEffect = new Effect;
				shadowEffect.colorize(this.data.color, 0.5);

				var marker = new Container({
					top: params.height * 0.5 - (BUBBLE_DIMENSIONS + 8), left: params.width * 0.5 - BUBBLE_DIMENSIONS * 0.5,
					height: BUBBLE_DIMENSIONS + 12, width: BUBBLE_DIMENSIONS,
					skin: new Skin({
						fill: "transparent",
						borders: {top: 2, left: 2, right: 2, bottom: 2},
						stroke: "orange"
					}),
					contents: [
						new Picture({
							name: "shadow",
							bottom: 0, left: 17, height: 24, width: 24,
							effect: shadowEffect,
							url: "assets/puck.png"
						}),
						new Picture({
							name: "puck",
							bottom: 2, left: 19, height: 20, width: 20,
							effect: puckEffect,
							url: "assets/puck.png"
						}),		
						new Picture({
							name: "bubble",
							top: 0, left: 1, height: BUBBLE_DIMENSIONS, width: BUBBLE_DIMENSIONS,
							url: "assets/bubble.png"
						}),
						new Picture({
							name: "childImage",
							height: 39, width: 39, left: 10, top: 5,
							url: this.data.imageUrl
						})
					]
				});

				this.view.add(this.frameBuffer[0][2]);
				this.view.add(marker);
				this.view.add(new ZoomButtons());

				var behavior = this;
				this.data.onMoving = function(index) {
					behavior.frameBuffer.shift();
					view.replace(view.mapTexture, behavior.frameBuffer[0][2]);
					
					behavior.addToFrameBuffer();
				};

				this.initialized = true;
			}

			application.behavior.moveCallback = true;
		}

		addToFrameBuffer() {
			this.edgeLat += this.data.movement.deltaLat;
			this.edgeLon += this.data.movement.deltaLon;

			var newParams = join(this.baseParams, { 
				center: getLocationString(this.edgeLat, this.edgeLon),
				zoom: this.currentZoom,
				size: this.mapSize
			});

			var newFrame = buildFrame(newParams);
			this.frameBuffer.push(newFrame);
		}

		onTimeChanged(view) {
			/*
			var currentTime = Date.now();
			if (currentTime - this.startTime > this.interval) {
				this.frameBuffer.shift();
				view.replace(view.mapTexture, this.frameBuffer[0][2]);

				this.startTime = currentTime;

				this.addToFrameBuffer();
			}*/
		}

		zoomIn() {
			trace("View zoom in\n");
			this.updateZoom(1);
		}

		zoomOut() {
			trace("View zoom out\n");
			this.updateZoom(-1);
		}

		updateZoom(direction) {
			var potentialZoom = this.currentZoom + direction;
			if (potentialZoom < ZOOM_FLOOR || potentialZoom > ZOOM_CEILING) return;

			this.currentZoom = potentialZoom;
			var minusButton = this.view.zoomButtons.last.first;
			var plusButton = this.view.zoomButtons.first.first;
			if (this.currentZoom == ZOOM_FLOOR) {
				minusButton.behavior.makeUnavailable();
			} else {
				minusButton.behavior.makeAvailable();
			}

			if (this.currentZoom == ZOOM_CEILING) {
				plusButton.behavior.makeUnavailable();
			} else {
				plusButton.behavior.makeAvailable();
			}

			// If direction == -1, then the user is going lower, so an image with a lower zoom level
			// must be added at the edge.
			// Else, an image with a higher zoom level must be added at the edge.
			var edgeZoomLevel = direction * Math.floor(FRAME_SIZE / 2);

			for (var i = 0; i < this.frameBuffer.length; i += 1) {
				var frame = this.frameBuffer[i];

				var frameParams = frame[2].behavior.mapParams;
				var edgeTexture = generateImage(join(frameParams, { 
					zoom: this.currentZoom + edgeZoomLevel 
				}));

				if (direction < 0) {
					frame.splice(FRAME_SIZE - 1, 1);
					frame.unshift(edgeTexture);
				} else {
					frame.shift();
					frame.push(edgeTexture);
				}
			}

			var scalar = direction > 0 ? 2 : 0.5;
			this.interval /= scalar;

			//var markerPlane = this.view.markerPlane;
			//var marker = markerPlane.first;

			//adjustMarker(marker, direction, markerPlane);

			var currentTexture = this.view.mapTexture;
			this.view.replace(currentTexture, this.frameBuffer[0][2]);
		}
	}
}));

// Determine quadrant using center
function adjustMarker(marker, direction, markerPlane) {
	var scalar = direction > 0 ? 2 : 0.5;

	var markerCenterX = marker.x + marker.width * 0.5;
	var markerCenterY = marker.y + BUBBLE_DIMENSIONS;

	var centerX = markerPlane.x + markerPlane.width * 0.5;
	var centerY = markerPlane.y + markerPlane.height * 0.5;

	var xDiff = markerCenterX - centerX;
	var yDiff = markerCenterY - centerY;

	var xAbsDiff = Math.abs(xDiff);
	var yAbsDiff = Math.abs(yDiff);

	var xScale = xAbsDiff / (markerPlane.width * 0.5);
	var yScale = yAbsDiff / (markerPlane.height * 0.5);

	var newPlaneWidth = markerPlane.width * scalar;
	var newPlaneHeight = markerPlane.height * scalar;

	var xOffset = xScale * newPlaneWidth * 0.5;
	var yOffset = yScale * newPlaneHeight * 0.5;

	markerPlane.width = Math.ceil(markerPlane.width * scalar);
	markerPlane.height = Math.ceil(markerPlane.height * scalar);

	// Quadrant 1:
	if (xDiff >= 0 && yDiff < 0) {
		marker.x = centerX + xOffset;
		marker.y = centerY - yOffset;
	}
	// Quadrant 2: relative to upper left corner
	else if (xDiff < 0 && yDiff < 0) {
		marker.x = centerX - xOffset;
		marker.y = centerY - yOffset;
	}
	// Quadrant 3: relative to lower left corner
	else if (xDiff < 0 && yDiff >= 0) {
		marker.x = centerX - xOffset;
		marker.y = centerY + yOffset;
	}
	// Quadrant 4: relative to lower right corner
	else if (xDiff >= 0 && yDiff >= 0) {
		marker.x = centerX + xOffset;
		marker.y = centerY + yOffset;
	}

	// Center bottom

	marker.x -= marker.width * 0.5;
	marker.y -= BUBBLE_DIMENSIONS;

	marker.behavior.interval /= scalar;
}

/*Handler.bind("/setTimeout", {
    onInvoke: function(handler, message){
        handler.wait(message.requestObject.duration);
    }
});

let setTimeout = function(callback, duration, callbackArgs) {
	new MessageWithObject("/setTimeout", {duration}).invoke().then(() => {
		if (callback) callback(callbackArgs);
	});
}

var mapParams = {
	center: "37.874118, -122.266336",
	zoom: 16,
	maptype: "roadmap"
};

class AppBehavior extends Behavior {
	onLaunch(application) {
		application.add(new GoogleMapCenteredView({
			width: WIDTH, height: HEIGHT, mapParams: mapParams,
			deltaLat: 0.0001, deltaLon: 0.0001,
			interval: 2000
		}));
	}
}

application.behavior = new AppBehavior();*/

/* Creates a string such that each key, value pair in PARAMETERS are url encoded. */
function getParameterString(parameters, omitKeys=[]) {
	var resultUrl = "";
	Object.keys(parameters).forEach(function(key, index) {
		var value = parameters[key];
		
		if (Array.isArray(value)) {
			var resultValue = "";
			for (var i = 0; i < value.length; i += 1) {
				if (!contains(omitKeys, key)) {
					resultValue += key + "=";
				}
				resultValue += getPipedParameterString(value[i], omitKeys) + "&"; 
			}
			
			resultUrl += resultValue;
			return;
		}
		
		value = parameters[key].toString().replace(/ /g, "+");
		
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