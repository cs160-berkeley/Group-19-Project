import { PressButton, PressButtonBehavior } from 'pressButton';

export var APP_TITLE = "Child Tracker";

export var SCREEN_HEIGHT = 1136 / 2;
export var SCREEN_WIDTH = 640 / 2;

// Solid colors application wide
export var redSkin = new Skin({ fill : "#BC2F2F" });
export var whiteSkin = new Skin({ fill : "white" });
export var pressButtonSkin = new Skin({ fill: "#f9f9f9"});

// Application wide
export var backgroundSkin = new Skin({ fill : "#202020" });

// Panic skins
export var bigRedTextStyle = new Style({ font: "bold 25px", color: "red" });

// Header - Application wide
export var titleStyle = new Style({ font: "bold 22px", color: "white" });
export var backStyle = new Style({ font: "20px", color: "white" });
export var headerSkin = new Skin({ fill: "#4f4f4f"});
export var backPressSkin = new Skin({fill: "#595959"});

export var HeaderWithBack = Line.template($ => ({
    name: 'headerPane',
    left: 0, right: 0, top: 0, height: SCREEN_HEIGHT * 0.1, skin: headerSkin,
    contents: [
   		new PressButton({
   			width: 80, height: SCREEN_HEIGHT * 0.1,
   			upSkin: headerSkin,
   			downSkin: backPressSkin,
   			Behavior: class extends PressButtonBehavior {
   				onTap() {
   					application.behavior.moveScreenBack();
   				}
   			},
   			contents: [
		        new Picture({top:0, bottom:0, left: 10, url: "assets/back.png"}),
                new Label({left: 28, top: 0, bottom: 0, string: "Back" , style: backStyle}),
   			]
   		}),
        new Label({ left: 0, right: 0, top: 0, bottom: 0, string: $.title, style: titleStyle}),
        new Container({
        	left: 0, top: 0, bottom: 0, width: 80, skin: headerSkin
        })
    ]
}));

export var HeaderWithAdd = Line.template($ => ({
    name: 'headerPane',
    left: 0, right: 0, top: 0, height: SCREEN_HEIGHT * 0.1, skin: headerSkin,
    contents: [
    	new Container({
        	left: 0, top: 0, bottom: 0, width: 80, skin: headerSkin
        }),
        new Label({ left: 0, right: 0, top: 0, bottom: 0, string: $.title, style: titleStyle}),
   		new PressButton({
   			width: 80, height: SCREEN_HEIGHT * 0.1,
   			upSkin: headerSkin,
   			downSkin: backPressSkin,
   			Behavior: class extends PressButtonBehavior {
   				onTap() {
   					trace("ADD SCREEN\n");
   				}
   			},
   			contents: [
		        new Picture({top:0, bottom:0, left: 10, url: "assets/Add.png"}),
                new Label({left: 28, top: 0, bottom: 0, string: "Add" , style: backStyle}),
   			]
   		})
    ]
}));