import { homeContainer } from 'home';
import { BuzzScreen } from 'buzz';
import { PanicScreen } from 'panic'; 
import { EnterCodeScreen } from 'addEnterCode';
import { Push } from 'transition';
import { DetailScreen } from 'detailScreen';
import { SearchingAnimationScreen } from 'addSearchingAnimation';
import { DetachScreen } from 'detach';

import Pins from 'pins';

var remotePins;
var panic = false;
var detach = false;

var add = false; /* MERGE */
Handler.bind("/setTimeout", {
    onInvoke: function(handler, message){
        handler.wait(message.requestObject.duration);
    }
});

let setTimeout = function(callback, duration, callbackArgs) {
    new MessageWithObject("/setTimeout", {duration}).invoke().then(() => {
        if (callback) callback(callbackArgs);
    });
};


class AppBehavior extends Behavior {
    onCreate(application) {
        
    }

    pinPressed(index) {
        application.behavior.moveScreenForwardTransition(new DetailScreen({
            childName: this.childrenData[index].name, childImage: this.childrenData[index].imageUrl,
            childIndex: index
        }));
    }

    onTimeChanged(application) {
        var now = Date.now();
        for (var i = 0; i < this.childrenData.length; i += 1) {
            var currentChild = this.childrenData[i];

            currentChild.currentTime = now - currentChild.lastMoved;
            if (currentChild.currentTime > currentChild.interval) {
                currentChild.offset.lat += currentChild.movement.deltaLat;
                currentChild.offset.lon += currentChild.movement.deltaLon;

                currentChild.currentTime = 0;
                if(this.moveCallback) {
                    currentChild.onMoving(i);
                }
                currentChild.lastMoved = Date.now();
            }
        }
    }

	onLaunch(application) {
        //application.add(homeContainer);
        application.name = "application";

        this.screenHistory = [];
        this.backOmissions = [
            "searchingAnimationScreen"
        ];
        this.yourPosition = "37.874123,-122.266294";

        this.startTime = Date.now();
        this.moveCallback = false;
        this.childrenData = [
            { 
                name: "Emily", imageUrl: "assets/enki.png", 
                color: "#F2994A",
                offset: {
                    lat: 0.0006,
                    lon: 0.0006
                },
                movement: {
                    deltaLat: 0.000025,
                    deltaLon: 0.000025,
                    baseInterval: 4000
                },
                interval: 4000,
                currentTime: 0,
                lastMoved: Date.now(),
                onMoving: function(childIndex) {}
            },
            { 
                name: "John", imageUrl: "assets/isaac.png", 
                color: "#6FCF97",
                offset: {
                    lat: -0.002,
                    lon: 0.0007
                },
                movement: {
                    deltaLat: 0.0000,
                    deltaLon: 0.0000,
                    baseInterval: 4000
                },
                interval: 4000,
                currentTime: 0,
                lastMoved: Date.now(),
                onMoving: function(childIndex) {}
            }
        ];
        application.start();

        application.add(homeContainer);
        //application.add(new EnterCodeScreen({}));

        let discoveryInstance = Pins.discover(
            connectionDesc => {
                if (connectionDesc.name == "pins-share-led") {
                    trace("Countdown began\n");

                    var behavior = this;

                    setTimeout(function() {
                        trace("Connecting to remote pins\n");

                        remotePins = Pins.connect(connectionDesc);
                    
                        remotePins.repeat("/panic/read", 200, value => {
                            if (value == 1) {
                                if (!panic) {
                                    behavior.moveScreenForward(new PanicScreen({
                                        childName: "Emily",
                                        childImage: "assets/enki.png"
        
                                    }));
                                    panic = true;
                                }
                            } 
                        });

                        remotePins.repeat("/detach/read", 200, value => {
                            if (value == 1) {
                                if (!detach) {
                                    behavior.moveScreenForward(new DetachScreen({
                                        childName: "John",
                                        childImage: "assets/isaac.png"
                                    }));
                                }
                                detach = true;
                            }
                        });

                        /* MERGE */
                        remotePins.repeat("/addchild/read", 200, value => {
                            if (value == 1) {
                                if (!add && application.first.name == "searchingAnimationScreen") {
                                    behavior.moveScreenForwardTransition(new EnterCodeScreen({}));
                                }   
                                add = true;
                            }
                            
                        }); 
                    }, 15000, {});

                    
                    /* END MERGE */
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

    moveScreenBackTransition() {
        var previousScreen = this.screenHistory.pop();
        //debugger;
        while (contains(this.backOmissions, previousScreen.name)) {
            //trace("CURRENT: " + application.first.name + "\n");
            //trace(application.length + "\n");
            previousScreen = this.screenHistory.pop();
        }
        //printHistory();

        //trace("CURRENT AFTER ")
        application.run(new Push(), application.first, previousScreen, { duration: 300, direction: "right" });
    }

    moveScreenForwardTransition(nextScreen) {
        var currentScreen = application.first;
        //trace("FIRST BEFORE FWD " + currentScreen.name + "\n");
        //trace("LAST BEFORE FWD" + application.last.name + "\n");
        
        /*
        trace("CURRENTS CONTAINER: " + currentScreen.container.name + "\n");
        if (nextScreen.container != null) {
            trace("NEXTS CONTAINER: " + nextScreen.container.name + "\n");
        }
        if (nextScreen.container == null) {
            trace("NEXTS CONTAINER: null \n");
        }*/
        this.screenHistory.push(currentScreen);

        //printHistory();
        //application.empty();

        //application.add(dummy);
        //trace(dummy.container + "\n");

        application.run(new Push(), currentScreen, nextScreen, { duration: 300, direction: "left" });
    }

    moveScreenForward(newScreen) {
    	var currentScreen = application.first;
    	this.screenHistory.push(currentScreen);
    	application.empty();
    	application.add(newScreen);
    }

    moveScreenBack() {
    	var previousScreen = this.screenHistory.pop();
        while (contains(this.backOmissions, previousScreen.name)) {
            previousScreen = this.screenHistory.pop();
        }
    	application.empty();
    	application.add(previousScreen);
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

    //add should become false when back button is clicked and when connect is clicked
    /* MERGE */
    readyToConnect() {
        add = false;
    } /* END MERGE */
    
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

    onStopDetach() {
        detach = false;
        this.moveScreenBack();
    }
    
	onStopPanic() {
		panic = false;
		this.moveScreenBack();
	}
}

application.behavior = new AppBehavior();

function contains(array, value) {
  return array.indexOf(value) > -1;
}

function printHistory() {
    var history = application.behavior.screenHistory;
    var string = "[ ";
    for (var i = 0; i < history.length; i += 1) {
        var current = history[i];
        string += current.name + " ";
    }
    string += "]\n";
    trace(string);
}
