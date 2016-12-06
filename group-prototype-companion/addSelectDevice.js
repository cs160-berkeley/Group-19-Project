import { HeaderWithBack, SCREEN_WIDTH, SCREEN_HEIGHT, whiteSkin, pressButtonSkin } from 'config';
import { PressButton, PressButtonBehavior } from 'pressButton';
import { SearchingAnimationScreen } from 'addSearchingAnimation';

//style
let backgroundSkin = new Skin({ fill: "#ffffff"});
let greySkin = new Skin({ fill: "#F4F4F4"});

let blackStyle = new Style({ font: "20px", color: "black" });


//layout
export var SelectDeviceScreen = Column.template($ => ({
	name: "selectDeviceScreen",
    top: 0, bottom: 0, left: 0, right: 0, skin: whiteSkin, state: 0,
    Behavior: class extends Behavior {
    	onDisplayed(screen) {
    		application.behavior.readyToConnect();
    	}
    },
    contents: [
        new HeaderWithBack({
        	title: "Add Children", transitionBack: true,
        }),
        new Line({
			top: 0, height: 64, width: SCREEN_WIDTH, skin: greySkin,
			contents: [ // Line content begins
	 			new Label({ left: 0, right:0, top: 0, bottom: 0, string: "Device #A001" , style: blackStyle}),
	 			
	 			new PressButton({
		          	top: 13, right: 20, height: 38, width: 72,
	        		upSkin: greySkin,
	        		downSkin: whiteSkin,
	        		Behavior: class extends PressButtonBehavior {
			            onTap() {
			              	application.behavior.moveScreenForwardTransition(new SearchingAnimationScreen({}));
			            }
		          	},
		        	contents: [
		        		new Picture({top: 0, left:0, right:0, bottom: 0, height: 38, width: 72, url: "assets/connect1.png"})
		        	]
		        }),
			] //Line content ends
		})  
    ]
}));

