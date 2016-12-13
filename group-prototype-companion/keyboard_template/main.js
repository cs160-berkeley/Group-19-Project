import KEYBOARD from 'keyboard';import {    FieldScrollerBehavior,    FieldLabelBehavior} from 'field';export var readinput;let nameInputSkin = new Skin({ borders: { left: 2, right: 2, top: 2, bottom: 2 }, stroke: 'gray', fill: "white" });let fieldStyle = new Style({ color: 'black', font: 'bold 24px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let fieldHintStyle = new Style({ color: '#aaa', font: '24px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let whiteSkin = new Skin({ fill: "white" });let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });let MyField = Container.template($ => ({     width: $.width, height: 40, skin: nameInputSkin, contents: [        Scroller($, {             left: 4, right: 4, top: 4, bottom: 4, active: true,             Behavior: FieldScrollerBehavior, clip: true,             contents: [                Label($, {                     left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,                     style: fieldStyle, anchor: 'NAME',                    editable: true, string: $.name,                    Behavior: class extends FieldLabelBehavior {                        onEdited(label) {                            let data = this.data;                            //read data                            readinput = label.string;                                                             data.name = label.string;                            label.container.hint.visible = (data.name.length == 0);                            //trace(data.name+"\n");                        }                    },                }),                Label($, {                    left: 4, right: 4, top: 4, bottom: 4, style: fieldHintStyle,                    string: $.hint, name: "hint"                }),            ]        })    ]}));export var KeyboardTemplate = Container.template($ => ({    left: $.left, right: $.right, top: $.top,    active: true,    contents: [        new MyField({name: "", width: $.fieldWidth, hint: $.hint})    ],    Behavior: class extends Behavior {        onTouchEnded(content) {            KEYBOARD.hide();            content.focus();        }    }}));