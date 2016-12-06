import { whiteSkin, redSkin, bigRedTextStyle, backgroundSkin, SCREEN_WIDTH, pressButtonSkin } from 'config';
import { PressButton, PressButtonBehavior } from 'pressButton';

//let backgroundSkin = new Skin({ fill : "#202020" });
//let redSkin = new Skin({ fill : "red" });
//let textStyle = new Style({ font: "bold 30px", color: "white" });
//let textStyle2 = new Style({ font: "bold 30px", color: "black" });
let textStyle = new Style({ font: "bold 25px", color: "#595959" });
let panicImageDimension = 201;

//Detach Screen 
export var DetachScreen = Column.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0,  skin: whiteSkin, active: false,
    contents: [
        new Picture({ top: 20, height: panicImageDimension, width: panicImageDimension, url: $.childImage}),

        new Label({
            top: 20, left: 0, right:0,
            style: bigRedTextStyle, string: $.childName + '\'s device has',
        }),
        new Label({
            top: 10, left: 0, right:0,
            style: bigRedTextStyle, string: 'been detached', 
        }),
        new Container({
            top: 30, left: 0, right:0, height: 80, style: textStyle,
            contents: [
				new PressButton({
					top: 0, left: (SCREEN_WIDTH - panicImageDimension)/2, height: 81, width: 81,
					upSkin: new Skin({fill:"transparent"}),
					downSkin: pressButtonSkin,
					Behavior: class extends PressButtonBehavior {
						onTap(container) {
							trace("DIRECTIONS\n");
						}
					},
					contents: [
						new Picture({top: 0, left: 0, height: 81, width: 81, url: "assets/directions.png"})
					]
				}),
				
				new PressButton({
					top: 0, right: (SCREEN_WIDTH - panicImageDimension)/2, height: 81, width: 81,
					upSkin: new Skin({fill:"transparent"}),
					downSkin: pressButtonSkin,
					Behavior: class extends PressButtonBehavior {
						onTap(container) {
							trace("911\n");
						}
					},
					contents: [
						new Picture({top: 0, left: 0, height: 81, width: 81, url: "assets/911.png"})
					]
				}),
            ]
        }),

        new PressButton({ top: 30,
            height: 51, width: 51,
            upSkin: whiteSkin, 
            downSkin: whiteSkin,
            downImage:  new Picture({
                    top: 0, bottom: 0, url: "assets/okClicked.png"
                }),
            Behavior: class extends PressButtonBehavior {
                onTap() {
                    application.behavior.onStopDetach();
                }
            },
            contents: [
                new Picture({
                    top: 0, bottom: 0, url: "assets/ok.png"
                }) 
            ]
        })

        /*
        new Container ({
            left: 0, right: 0, top: 0, bottom: 0, active: true,
            behavior:  Behavior({
                onTouchEnded(container) {  
                    remotePins.invoke("/panic/write", 0);
                }
            }),
            contents: [  new Picture({ top: 0, bottom: 0, url: "assets/ok.png"}) ]
        }),*/
    ],   
}));