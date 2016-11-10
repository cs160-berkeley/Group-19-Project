import { PressButton, PressButtonBehavior } from 'pressButton';
import { SCREEN_WIDTH, SCREEN_HEIGHT, HeaderWithAdd, pressButtonSkin, APP_TITLE } from 'config';
import { DetailScreen } from 'detailScreen';

// Stores child names and other data
export var children = [
	{ name: "Emily", imageUrl: "assets/enki.png", mapUrl: "assets/orange.png", color: "#F2994A"},
	{ name: "John", imageUrl: "assets/enki.png", mapUrl: "assets/green.png", color: "#6FCF97"}
];

var ChildButton = Container.template(params => ({
	active: true,
	top: params.top, left: params.left, right: params.right,  height: params.height,
	Behavior: class extends PressButtonBehavior {
		onTap(container) {
			var name = children[params.child].name;
			var imageUrl = children[params.child].imageUrl;
			var mapImage = children[params.child].mapUrl;

			application.behavior.moveScreenForward(new DetailScreen({
				childName: name,
				childImage: imageUrl,
				mapImage: mapImage
			}));
		}
	},
	contents: [
		new Picture({
			top: 8, left: 8, width: 48, height: 48,
			url: children[params.child].imageUrl
		}),
		new Label({
			left: 80,
			style: new Style({
				font:"24px bold",
				color: children[params.child].color
			}),
			string: children[params.child].name
		}),
		new PressButton({
			top: 8, right: 8, height: 42, width: 78,
			upSkin: new Skin({fill:"transparent"}),
			downSkin: pressButtonSkin,
			Behavior: class extends PressButtonBehavior {
				onTap(container) {
					var childName = children[params.child].name;
					var childImage = children[params.child].imageUrl;
			      	application.behavior.onBuzz(application, childName, childImage);
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

var childList = new Column({
	top: 0, left: 0, right: 0,
	contents: [
		new ChildButton({
			top: 0, left: 0, right: 0, height: 64,
			child: 0,
			upSkin: new Skin({fill:"transparent"}),
			downSkin: pressButtonSkin
		}),
		new ChildButton({
			top: 0, left: 0, right: 0, height: 64,
			child: 1,
			upSkin: new Skin({fill:"transparent"}),
			downSkin: pressButtonSkin
		})
	]
});


var mapContainer = new Container({
	top: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.6,
	skin: new Skin({
		fill: "black"
	}),
	contents: [
		new Picture({
			top: 0, left: -20, height: 340,
			url: "assets/homeMap.png"
		})
	]
});

var childListContainer = new Container({
	top: 0, height: 192, left: 0, right: 0,
	skin: new Skin({
		fill: "white"
	}),
	contents: [
		childList
	]
});

export var homeContainer = new Column({
	top: 0, left: 0, right: 0, bottom: 0,
	contents: [
		new HeaderWithAdd({
			title: APP_TITLE
		}),
		mapContainer,
		childListContainer
	]
});