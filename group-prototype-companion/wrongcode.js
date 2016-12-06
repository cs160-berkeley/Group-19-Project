/*
 *     Copyright (C) 2010-2016 Marvell International Ltd.
 *     Copyright (C) 2002-2010 Kinoma, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { HeaderWithBack, SCREEN_WIDTH, SCREEN_HEIGHT, whiteSkin, pressButtonSkin } from 'config';
import { PressButton, PressButtonBehavior } from 'pressButton';
import { KeyboardTemplate, readinput} from "keyboard_template/main";
//import {EnternameScreen} from "entername";

//style
let backgroundSkin = new Skin({ fill: "#ffffff"});
let headerSkin = new Skin({ fill: "#413028"});

let redStyle = new Style({ font: "14px", color: "red" });
let textStyle = new Style({ font: "16px", color: "white" });
let titleStyle = new Style({ font: "bold 20px", color: "white" });
let blackStyle = new Style({ font: "14px", color: "black" });
let lg_blackStyle = new Style({ font: "bold 16px", color: "black" });
//variable

//input 
import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';



let nameInputSkin = new Skin({ borders: { left: 2, right: 2, top: 2, bottom: 2 }, stroke: 'gray' });
let fieldStyle = new Style({ color: 'black', font: 'bold 24px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });
let fieldHintStyle = new Style({ color: '#aaa', font: '24px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });
let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });

let MyField = Container.template($ => ({ 
    width: 250, height: 36, skin: nameInputSkin, contents: [
        Scroller($, { 
            left: 4, right: 4, top: 4, bottom: 4, active: true, 
            Behavior: FieldScrollerBehavior, clip: true, 
            contents: [
                Label($, { 
                    left: 0, top: 0, bottom: 0, skin: fieldLabelSkin, 
                    style: fieldStyle, anchor: 'NAME',
                    editable: true, string: $.name,
                    Behavior: class extends FieldLabelBehavior {
                        onEdited(label) {
                            let data = this.data;
                            data.name = label.string;
                            label.container.hint.visible = (data.name.length == 0);
                            trace(data.name+"\n");
                        }
                    },
                }),
                Label($, {
                    left: 4, right: 4, top: 4, bottom: 4, style: fieldHintStyle,
                    string: "Tap to add text...", name: "hint"
                }),
            ]
        })
    ]
}));

let MainContainerTemplate = Container.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0, 
    skin: whiteSkin, active: true,
    contents: [
        new MyField({name: ""})
    ],
    Behavior: class extends Behavior {
        onTouchEnded(content) {
            SystemKeyboard.hide();
            content.focus();
        }
    }
}));



//layout
export var WrongcodeScreen = Column.template($ => ({
    top: 0, bottom: 0, left: 0, right: 0, skin: backgroundSkin,
    active: true, state: 0,
    contents: [
        new HeaderWithBack({
          title: "Add Children"
        }),
		new Label({ left: 0, right: 0, top: 3, string: "The code is wrong." , style:redStyle }),
		new Label({ left: 0, right: 0, top: 10, string: "Please try again." , style:redStyle }),
        new Label({ left: 0, right: 0, top: 70, string: "Enter Code for Device #12" , style:lg_blackStyle }),
        new KeyboardTemplate(),
        new PressButton({
          top: 100, left: 0, right:0, height: 42, width: 78,
          upSkin: new Skin({fill:"transparent"}),
          downSkin: pressButtonSkin,
          Behavior: class extends PressButtonBehavior {
            onTap(container) {
                if (readinput == "123") {
                	application.behavior.moveScreenForward(new EnternameScreen());
                }
                
            }
          },
          contents: [
            new Picture({
              top: 0, left: 0, right:0, bottom: 0,height: 42, width: 78,
              url: "assets/enter.png"
            })
          ]
        })
        
    ],
    behavior: Behavior({

    }),
}));

