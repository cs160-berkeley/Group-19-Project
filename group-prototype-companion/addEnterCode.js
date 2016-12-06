import { HeaderWithBack, SCREEN_WIDTH, SCREEN_HEIGHT, whiteSkin, pressButtonSkin } from 'config';
import { PressButton, PressButtonBehavior } from 'pressButton';
import { KeyboardTemplate, readinput} from "keyboard_template/main";

import { EnterNameScreen } from "addEnterName";
import { Push } from "transition";
//import {WrongcodeScreen} from "wrongcode";

//style
let backgroundSkin = new Skin({ fill: "#ffffff"});
let lg_blackStyle = new Style({ font: "22px", color: "#4D4D4D" });

let greySkin = new Skin({ fill: "#F4F4F4"});

var EnterCodePanel = Column.template(params => ({
    name: "enterCodePanel",
    top: 0, left: 0, right: 0, bottom: 0,
    active: true,
    //skin: greySkin,
    contents: [
        new Label({ left: 0, right: 0, top: 100, string: "Enter Code for Device #12:" , style:lg_blackStyle }),
        new KeyboardTemplate(),
        new PressButton({
            top: 40, left: SCREEN_WIDTH * 0.5 - (78 * 0.5), height: 42, width: 78,
            upSkin: new Skin({fill:"transparent"}),
            downSkin: pressButtonSkin,
            Behavior: class extends PressButtonBehavior {
                onTap(panel) {
                    if (readinput == "123") {
                        panel.bubble("onSuccessfulCode");
                        //application.behavior.moveScreenForward(new EnterNameScreen());
                    } else {
                        trace("WRONG CODE\n");
                        //application.behavior.moveScreenForward(new WrongcodeScreen());
                    }
                }

                onSuccessfulCode() {}
            },
            contents: [
                new Picture({
                  top: 0, left: 0, right:0, bottom: 0,height: 42, width: 78,
                  url: "assets/enter.png"
                })
            ]
        })   
    ]
}));

var EnterNamePanel = Column.template(params=> ({
    name: "enterNamePanel",
    top: 0, bottom: 0, left: 0, right: 0,
    active: true,
    //skin: greySkin,
    contents: [
        new Label({ left: 0, right: 0, top: 100, string: "You have successfully connected" , style:lg_blackStyle }),
        new Label({ left: 0, right: 0, top: 12, string: "with Device #A001." , style:lg_blackStyle }),
        new Label({ left: 0, right: 0, top: 12, string: "Please enter child name." , style:lg_blackStyle }),
        new KeyboardTemplate(),
        new PressButton({
          top: 40, left: SCREEN_WIDTH * 0.5 - (78 * 0.5), height: 42, width: 78,
          upSkin: new Skin({fill:"transparent"}),
          downSkin: pressButtonSkin,
          Behavior: class extends PressButtonBehavior {
            onTap(container) {
                container.bubble("onNamed");
            }

            onNamed() {}
          },
          contents: [
            new Picture({
              top: 0, left: 0, right:0, bottom: 0,height: 42, width: 78,
              url: "assets/addbutton.png"
            })
          ]
        })   
    ]
}));

//layout
export var EnterCodeScreen = Column.template($ => ({
    //name: "enterCodeScreen",
    top: 0, bottom: 0, left: 0, right: 0, skin: backgroundSkin,
    active: true, state: 0,
    Behavior: class extends Behavior {
        onCreate(screen) {
            this.screen = screen;
            this.screen.add(new HeaderWithBack({
                title: "Add Children", transitionBack: true,
            }));
            this.screen.add(new EnterCodePanel({}));
        }

        onSuccessfulCode() {
            this.screen.replace(this.screen.enterCodePanel, new EnterNamePanel({}));
        }

        onNamed() {
            var home = application.behavior.screenHistory[0];
            application.behavior.childrenData.push({ 
                name: "Kelly", imageUrl: "assets/sarah.png", 
                color: "#D399E8",
                offset: {
                    lat: 0.0000,
                    lon: 0.0000
                },
                movement: {
                    deltaLat: 0.0,
                    deltaLon: 0.000,
                    baseInterval: 4000
                },
                interval: 4000,
                currentTime: 0,
                lastMoved: Date.now(),
                onMoving: function(childIndex) {}
            });
            home.behavior.addMarker();
            application.run(new Push(), this.screen, home, { duration: 300, direction: "left" });
        }
    }
}));
