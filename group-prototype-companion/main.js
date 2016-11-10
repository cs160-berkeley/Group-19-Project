import { homeContainer, children } from 'home';
import { BuzzScreen } from 'buzz';
import { PanicScreen } from 'panic'; 

import Pins from 'pins';

var screenHistory = [];
var remotePins;
var panic = false;

class AppBehavior extends Behavior {
	onLaunch(application) {
        application.add(homeContainer);
        
        let discoveryInstance = Pins.discover(
            connectionDesc => {
                if (connectionDesc.name == "pins-share-led") {
                    trace("Connecting to remote pins\n");
                    remotePins = Pins.connect(connectionDesc);
                    
                    remotePins.repeat("/panic/read", 200, value => {
		                if (value == 1) {
		                	if (!panic) {
			        			this.moveScreenForward(new PanicScreen({
			        				childName: "Emily",
			        				childImage: "assets/enki.png"
	
			        			}));
			        			panic = true;
		        			}
		                } 
	            	});
                }
            }, 
            connectionDesc => {
                if (connectionDesc.name == "pins-share-led") {
                    trace("Disconnected from remote pins\n");
                    remotePins = undefined;
                }
            }
        );
    }

    moveScreenForward(newScreen) {
    	var currentScreen = application.first;
    	screenHistory.push(currentScreen);
    	application.empty();
    	application.add(newScreen);
    }

    moveScreenBack() {
    	var currentScreen = screenHistory.pop();
    	application.empty();
    	application.add(currentScreen);
    }

    onBuzz(application, childName, childImage) {
    		
        if (remotePins) {
	        remotePins.invoke("/buzz/write", 1);
        	this.moveScreenForward(new BuzzScreen({
        		childName: childName,
        		childImage: childImage
        	}));
        	
	    }
    }
    
    
    
    onStopBuzz(application) {
    	if (remotePins) {
    		remotePins.invoke("/buzz/write", 0);
    		this.moveScreenBack();
    	}
    }
    
    onPanic(application) {
		remotePins.invoke("/panic/write", 0);
        this.moveScreenBack();
    }
    
	onStopPanic() {
		panic = false;
		this.moveScreenBack();
	}
}

application.behavior = new AppBehavior();
