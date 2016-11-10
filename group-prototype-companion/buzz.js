import { PressButton, PressButtonBehavior } from 'pressButton';
import { whiteSkin, redSkin, HeaderWithBack } from 'config';

let textStyle = new Style({ font: "bold 25px", color: "white" });
let backgroundSkin = new Skin({ fill : "#202020" });
let buzzingTextStyle = new Style({ font: "bold 30px", color: "#595959" });

//Buzz Screen //now buzzing
export var BuzzScreen = Column.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin, active: true,
    contents: [
        new HeaderWithBack({
            title: $.childName
        }),
        new Picture({
            top: 30, width: 201, height: 201,
            url: $.childImage
        }),
        new Label({
            left: 0, right: 0, top: 40,
            style: buzzingTextStyle, string: 'Buzzing ' + $.childName + ' now...', 
        }),
        new PressButton({
            top: 40,
            height: 50, width: 200,
            upSkin: backgroundSkin, 
            downSkin: redSkin,
            Behavior: class extends PressButtonBehavior {
                onTap() {
                    application.behavior.onStopBuzz(application);
                }
            },
            contents: [
                new Label({
                    left: 0, right: 0, top: 0, bottom: 0,
                    style: textStyle,
                    string: 'Stop Buzzing'
                })
            ]
        })

    ],   
}));