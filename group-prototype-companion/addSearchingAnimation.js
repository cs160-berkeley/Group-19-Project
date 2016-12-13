import { HeaderWithBack, SCREEN_WIDTH, SCREEN_HEIGHT, whiteSkin, pressButtonSkin } from 'config';
import { PressButton, PressButtonBehavior } from 'pressButton';

//style
let backgroundSkin = new Skin({ fill: "#ffffff"});
let blueSkin = new Skin({ fill: "#393F99"});
let headerSkin = new Skin({ fill: "#413028"});

let greySkin = new Skin({ fill: "#F4F4F4"});

let textStyle = new Style({ font: "16px", color: "white" });
let titleStyle = new Style({ font: "bold 20px", color: "white" });
let blackStyle = new Style({ font: "24px", color: "#4D4D4D" });
let lg_blackStyle = new Style({ font: "bold 16px", color: "#4D4D4D"});

//Rotation
let LayerExample = Layer.template($ => ({ 
    top: $.top, height: 100, left: $.left, width: 100,
    behavior: $.behavior,
    contents: [
        new Picture({left: 0, right: 0, top: 0, bottom: 0, url: "assets/Loading3.png"})
    ]
}));

let rotationLayerBehavior = Behavior({
    onCreate: function(layer, data) {
        layer.rotation = 0;
        layer.origin = {x: Math.floor(layer.width /2 ), y: Math.floor(layer.height / 2)};  // This will make the object spin in place; you can comment out this entire line to see the difference.
        layer.start();
    },
    onTimeChanged: function(layer) {
        layer.rotation = (layer.rotation+4)%360
    }
});

var AnimateContainer = Container.template($ => ({
    top: 60, left: 0, right: 0, bottom: 0,
    name: "animateContainer",
    Behavior: class extends Behavior {
        onCreate(container) {
            var Frame = Picture.template(params => ({
                top: 0, left: 0, right: 0, bottom: 0,
                url: params.url
            }));

            this.images = [];
            this.images.push(new Frame({
                url: "assets/zero.png"
            }));
            this.images.push(new Frame({
                url: "assets/one.png"
            }));
            this.images.push(new Frame({
                url: "assets/two.png"
            }));
            this.images.push(new Frame({
                url: "assets/three.png"
            }));

            this.frameIndex = 0;

            container.add(this.images[this.frameIndex]);

            this.start = Date.now();
            this.interval = 800;
            container.start();
        }

        onTimeChanged(container) {
            var now = Date.now();
            if (now - this.start > this.interval) {
                this.frameIndex = (this.frameIndex + 1) % 4;
                container.empty();
                container.add(this.images[this.frameIndex]);
                
                this.start = now;
            }
        }
    }
}));


//ADDchildScreen
export var SearchingAnimationScreen = Container.template($ => ({
    name: "searchingAnimationScreen",
    top: 0, bottom: 0, left: 0, right: 0, skin: backgroundSkin,
    active: true, state: 0,
    skin: greySkin,
    contents: [
        new HeaderWithBack({
            title: "Pair New Device"
        }),
        //new LayerExample({ top: 60, left: 110, behavior: rotationLayerBehavior }),
        new AnimateContainer(),
        new Label({ left: 0, right: 0, top: SCREEN_HEIGHT * 0.85, bottom: 0, string: "Connecting to device A001" , style: blackStyle})
    ]
}));

