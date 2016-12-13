import { HeaderWithBack, SCREEN_WIDTH, SCREEN_HEIGHT, whiteSkin, pressButtonSkin } from 'config';
import { PressButton, PressButtonBehavior } from 'pressButton';
import { KeyboardTemplate, readinput} from "keyboard_template/main";

import { EnterNameScreen } from "addEnterName";
import { Push } from "transition";
import { homeContainer } from 'home';
//import {WrongcodeScreen} from "wrongcode";

//style
let backgroundSkin = new Skin({ fill: "#ffffff"});
let largeStyle = new Style({ font: "28px", color: "#4D4D4D" });
let subStyle = new Style({ font: "22px", color: "#4D4D4D" });

let greySkin = new Skin({ fill: "#F4F4F4"});


let successStyle = new Style({ font: '22px', color: '#6FCF97'});

let wrongStyle = new Style({ font: '18px', color: '#BC2F2F'});

var WrongCode = Label.template(params => ({
    name: "error",
    left: 0, right: 0, top: 14, style: wrongStyle,
    string: "Code does not match. Please try again."
}));

var EnterCodePanel = Container.template(params => ({
    name: "enterCodePanel",
    top: 0, left: 0, right: 0, bottom: 0,
    active: true,
    skin: greySkin,
    contents: [
        new Column({
            name: "inputColumn",
            left: 0, right: 0, top: 80, 
            contents: [
                 new Label({ left: 0, right: 0, top: 0, string: "Pairing", style: subStyle }),
                 new Label({ left: 0, right: 0, top: 12, string: "Device #A001", style: largeStyle }),
                 new KeyboardTemplate({ left: 0, right: 0, top: 20, fieldWidth: 140, hint: "Enter code"}),
            ]
        }),
        new PressButton({
            top: 260, left: SCREEN_WIDTH * 0.5 - (78 * 0.5), height: 42, width: 78,
            upSkin: new Skin({fill: "white" }),
            downSkin: pressButtonSkin,
            Behavior: class extends PressButtonBehavior {
                onTap(button) {
                    var inputColumn = button.previous;
                    if (readinput == "123") {
                        button.bubble("onSuccessfulCode");
                        if (inputColumn.error) {
                            inputColumn.remove(inputColumn.error);
                        }
                    } else {
                        trace("WRONG CODE\n");
                        if (!inputColumn.error) {
                            inputColumn.add(new WrongCode());
                        }
                    }
                }

                onSuccessfulCode() {}
            },
            contents: [
                new Picture({
                  top: 0, left: 0, right: 0, bottom: 0,height: 42, width: 78,
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
    skin: greySkin,
    contents: [
        new Picture({ top: 30, width: 140, height: 140, left: SCREEN_WIDTH * 0.5 - 70, url: "assets/paired.png"}),
        new Label({ left: 0, right: 0, top: 20, string: "Device successfully paired!" , style: successStyle }),
        //new Label({ left: 0, right: 0, top: 12, string: "Device #A001" , style: largeStyle }),
        new KeyboardTemplate({ left: 0, right: 0, top: 20, fieldWidth: 260, hint: "Enter child name"}),
        new PressButton({
          top: 20, left: SCREEN_WIDTH * 0.5 - (78 * 0.5), height: 42, width: 78,
          upSkin: new Skin({fill:"white"}),
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
                title: "Pair New Device", transitionBack: true,
            }));
            this.screen.add(new EnterCodePanel({}));
        }

        onSuccessfulCode() {
            this.screen.replace(this.screen.enterCodePanel, new EnterNamePanel({}));
        }

        onNamed() {
            var home = application.behavior.screenHistory[0];
            application.behavior.childrenData.push({ 
                name: readinput, imageUrl: "assets/isaac.png", 
                color: "#6FCF97",
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
            //KEYBOARD.hide();
            application.empty();
            application.add(home);
            //application.replace(this.screen, home);

            //application.run(new Push(), this.screen, home, { duration: 300, direction: "left" });
        }
    }
}));
