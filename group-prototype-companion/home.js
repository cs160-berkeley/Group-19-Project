import { PressButton, PressButtonBehavior } from 'pressButton';
import { SCREEN_WIDTH, SCREEN_HEIGHT, HeaderWithAdd, pressButtonSkin, APP_TITLE, splashHeader } from 'config';
import { DetailScreen } from 'detailScreen';
import { GoogleMapView } from 'map';
import { GoogleMapProvider } from 'googleMaps';

//var mapProvider = new GoogleMapProvider(mapParams, actions, 3000);
var mapContainer = new GoogleMapView({
	width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 192 - 58,
	mapParams: {
		//center: "37.874123,-122.266294",
		zoom: 16,
		maptype: "roadmap"
	}
});

var ChildButton = Container.template(params => ({
	active: true,
	top: 0, left: 0, right: 0,  height: 64,
	Behavior: class extends PressButtonBehavior {
		onTap(container) {
			application.behavior.moveScreenForwardTransition(new DetailScreen({
			//application.behavior.moveScreenForward(new DetailScreen({
				childName: params.childName, childImage: params.childImage,
				childIndex: params.childIndex
			}));
		}
	},
	contents: [
		new Picture({
			top: 8, left: 8, width: 48, height: 48,
			url: params.childImage
		}),
		new Label({
			left: 80,
			style: new Style({
				font:"24px bold",
				color: params.color
			}),
			string: params.childName
		}),
		new PressButton({
			top: 8, right: 8, height: 42, width: 78,
			upSkin: new Skin({fill:"white"}),
			downSkin: pressButtonSkin,
			Behavior: class extends PressButtonBehavior {
				onTap(container) {
			      	application.behavior.onBuzz(application, params.childName, params.childImage);
				}
			},
			contents: [
				new Picture({
					top: 0, left: 0, height: 42, width: 78,
					url: "assets/buzzWritten.png"
				})
			]
		})
	]
}));

export var homeContainer = new Column({
	name: "home",
	top: 0, left: 0, right: 0, bottom: 0,
	contents: [
		splashHeader,
		mapContainer
	],
	Behavior: class extends Behavior {
		onCreate(home) {
			this.initialized = false;
		}

		addMarker() {
			var index = application.behavior.childrenData.length - 1;
			var data = application.behavior.childrenData[index];
			this.childList.add(new ChildButton({
				upSkin: new Skin({borders: { bottom: 1 }, stroke: "#D9D6D6"}),
				downSkin: pressButtonSkin,
				childIndex: index, childName: data.name, childImage: data.imageUrl, color: data.color,
			}));
			mapContainer.behavior.addMarker();
		}

		onDisplaying(home) {
			if (!this.initialized) {
				var childList = new Column({
					top: 0, left: 0, right: 0
				});
				this.childList = childList;

				var childrenData = application.behavior.childrenData;
				for (var i = 0; i < childrenData.length; i += 1) {
					var data = childrenData[i];

					var name = data.name;
					var imageUrl = data.imageUrl;
					var color = data.color;

					childList.add(new ChildButton({
						upSkin: new Skin({borders: { bottom: 1 }, stroke: "#D9D6D6"}),
						downSkin: pressButtonSkin,
						childIndex: i, childName: name, childImage: imageUrl, color: color
					}));
				}

				var childListContainer = new Container({
					top: 0, height: 196, left: 0, right: 0,
					skin: new Skin({ fill: "#F4F4F4", borders: { top: 1 }, stroke: "#D9D6D6" })
				});
				childListContainer.add(childList);

				home.add(childListContainer);
			}

			application.behavior.screenHistory = [];
		}
	}
});




