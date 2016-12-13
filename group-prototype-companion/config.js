import { PressButton, PressButtonBehavior } from 'pressButton';
import { SelectDeviceScreen } from 'addSelectDevice';

export var APP_TITLE = "Child Tracker";

export var SCREEN_HEIGHT = 1136 / 2;
export var SCREEN_WIDTH = 640 / 2;

export var greyBackground = new Skin({ fill: "#F4F4F4" });

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
export var headerSkin = new Skin({ fill: "#0082AD"});
export var backPressSkin = new Skin({fill: "#006080"});

export var HeaderWithBack = Line.template($ => ({
    name: 'headerPane',
    left: 0, right: 0, top: 0, height: SCREEN_HEIGHT * 0.1, skin: headerSkin,
    Behavior: class extends Behavior {
        onCreate(header) {
            this.transitionBack = $.transitionBack;
            var backBehavior;
            if (this.transitionBack) {
                backBehavior = class extends PressButtonBehavior {
                    onTap() {
                        //application.behavior.onConnect();
                        //debugger;
                        application.behavior.moveScreenBackTransition();
                        //application.behavior.moveScreenBack();
                    }
                };
            } else {
                backBehavior = class extends PressButtonBehavior {
                    onTap() {
                        //application.behavior.onConnect();
                        application.behavior.moveScreenBack();
                    }
                };
            }

            var backButton = new PressButton({
                name: "backButton",
                width: 80, height: SCREEN_HEIGHT * 0.1,
                upSkin: headerSkin,
                downSkin: backPressSkin,
                Behavior: backBehavior,
                contents: [
                    new Picture({top:0, bottom:0, left: 10, url: "assets/back.png"}),
                    new Label({left: 28, top: 0, bottom: 0, string: "Back" , style: backStyle}),
                ]
            });
            header.add(backButton);

            var titleLabel = new Label({
                name: "title",
                left: 0, right: 0, top: 0, bottom: 0, 
                string: $.title, style: titleStyle
            });
            header.add(titleLabel);

            var spacer = new Container({
                left: 0, top: 0, bottom: 0, width: 80, skin: headerSkin
            });
            header.add(spacer);
        }
    }
}));

/* MERGE */
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
   					trace("Add child\n")
   					application.behavior.moveScreenForward(new AddchildScreen({}));
   				}
   			},
   			contents: [
		        new Picture({top:0, bottom:0, left: 10, url: "assets/Add.png"}),
            //new Label({left: 28, top: 0, bottom: 0, string: "Add" , style: backStyle}),
   			]
   		})
    ]
}));
/* END MERGE */

var addButton = new PressButton({
    width: 80, height: SCREEN_HEIGHT * 0.1,
    upSkin: headerSkin,
    downSkin: backPressSkin,
    Behavior: class extends PressButtonBehavior {
        onDisplayed(button) {
            button.opacity = 0;
            button.start();
        }

        onTimeChanged(button) {
            button.opacity += 0.05;
        }

        onTap() {
            trace(application.behavior.screenHistory.length + "\n");
            application.behavior.moveScreenForwardTransition(new SelectDeviceScreen({}));
            //application.behavior.moveScreenForward(new SelectDeviceScreen({}));
        }
    },
    contents: [
        new Picture({top:0, bottom:0, left: 20, url: "assets/Add.png"}),
        new Label({left: 38, top: 0, bottom: 0, string: "Add" , style: backStyle}),
    ]
});

var homeHeaderLine = new Line({
    top: 0, left: 0, right: 0, bottom: 0,
    /*
    skin: new Skin({
        borders: { top: 2, right: 2, bottom: 2, left: 2 },
        stroke: "orange"
    }), */
    contents: [
        new Container({
            left: 0, top: 0, bottom: 0, width: 80, skin: headerSkin
        }),
        new Picture({
            name: "logo",
            left: 0, right: 0,
            url: "assets/offspring-logo.png"
        }),
        new Layer({
            width: 80, height: SCREEN_HEIGHT * 0.1,
            contents: [
                addButton
            ],
            Behavior: class extends Behavior {
                onCreate(layer) {
                    layer.opacity = 0;
                    layer.start();
                }

                onTimeChanged(layer) {
                    if (layer.opacity >= 1) return;
                    layer.opacity += 0.1;
                }
            }
        })
    ]
});

export var splashHeader = new Container({
    top: 0, left: 0, height: SCREEN_HEIGHT, width: SCREEN_WIDTH,
    skin: new Skin({
        fill: "#0082ad"
    }),
    Behavior: class extends Behavior {
        onCreate(screen) {
            this.screenInterval = 2000;
            this.start = Date.now();
            this.shouldAnimate = false;

            this.animateStartTime = 0;

            this.duration = 400;

            this.finished = false;
            screen.start();
        }

        onTimeChanged(screen) {
            if (this.finished) return;

            if (!this.shouldAnimate && Date.now() - this.start > this.screenInterval) {
                this.shouldAnimate = true;
            }

            var time = screen.time - this.screenInterval;
            //trace(time.toString() + "\n");
            if (time > this.duration) {
                screen.replace(screen.first, homeHeaderLine);

                this.finished = true;
                return;
            }

            if (this.shouldAnimate) {
                var fraction = 1 - time / this.duration;
                var distance = SCREEN_HEIGHT - 60;

                var screenHeightOffset = fraction * fraction * fraction * distance;
                screen.height = 60 + screenHeightOffset;
            }
        }
    },
    contents: [
        new Picture({
            left: 80, right: 80,
            url: "assets/offspring-logo.png"
        })
    ]
});
