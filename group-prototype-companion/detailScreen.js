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

//style
let backgroundSkin = new Skin({ fill: "#ffffff"});
let headerSkin = new Skin({ fill: "#413028"});
let waterSkin = new Skin({ fill: "#C7B9AC"});
let foodSkin = new Skin({ fill: "#C7B9AC"});
let foodbarSkin = new Skin({ fill: "#8b5028"});
let buttonSkin = new Skin({ fill: "#41410F"});
var foodborderedSkin = new Skin({
    borders: {left: 1, right: 1, top: 1, bottom: 1}, 
    stroke: "#8b5028"
});
let waterbarSkin = new Skin({ fill: "#009EDF"});
var waterborderedSkin = new Skin({
    borders: {left: 1, right: 1, top: 1, bottom: 1}, 
    stroke: "#009EDF"
});

let textStyle = new Style({ font: "16px", color: "white" });
let titleStyle = new Style({ font: "bold 20px", color: "white" });
let blackStyle = new Style({ font: "14px", color: "black" });
let lg_blackStyle = new Style({ font: "bold 16px", color: "black" });
//variable

let DetailsPane = Container.template($ => ({
  name: 'detailsPane',
  left: 0, right: 0, top: 0, height: 70, skin: whiteSkin,
  contents: [
    new Picture({top: 0, left: 20, width: 70, height: 70, url: $.childImage}),
    new Line({
      top: 0, height: 70, right: 20,
      contents: [
        new PressButton({
          top: 0, left: 20, width: 70, height: 70,
          upSkin: whiteSkin,
          downSkin: pressButtonSkin,
          Behavior: class extends PressButtonBehavior {
            onTap() {
              application.distribute("onBuzz", $.childName, $.childImage);
            }
          },
          contents: [
            new Picture({left: 0, right: 0, top: 0, bottom: 0, url: "assets/buzz.png"})
          ]
        }),

        new PressButton({
          top: 0, left: 20, width: 70, height: 70,
          upSkin: whiteSkin,
          downSkin: pressButtonSkin,
          Behavior: class extends PressButtonBehavior {
            onTap() {
              trace("DIRECTIONS\n");
            }
          },
          contents: [
            new Picture({left: 0, right: 0, top: 0, bottom: 0, url: "assets/directions.png"})
          ]
        })
      ]
    })
  ]
}));

let ActivityPane = Column.template($ => ({
    top: 50, left: 0, right: 0, bottom: 0, skin: backgroundSkin,
    active: true, state: 0,
    contents: [
      new Label({ left: 0, right: 0, top: 0, bottom: 0, string: "Recent Activity" , style:lg_blackStyle }),
      new Label({ left: 70, top: 20, bottom: 0, string: "12:30                  Arrived at Home" , style: blackStyle}),
      new Label({ left: 70, top: 5, bottom: 0, string: "12:00                  Left Park" , style: blackStyle}),
      new Label({ left: 70, top: 5, bottom: 70, string: "11:34                  Arrived at Park" , style: blackStyle}),
    ]
}));

let BuzzButton = Container.template($ => ({
  left: 0, right:0, top: 0, bottom: 0, 
  active: true,state:0,
  contents: [
    new Picture({left: -40, right: 0, top: 10, height: 70, url: "assets/buzz.png"}),
  ],
  behavior: Behavior({
    onCreate(container, data) {
      this.childName = data.childName;
      this.childImage = data.childImage;
    },
    onTouchEnded(container) {
      application.delegate('onBuzz', this.childName, this.childImage);
    }
  })
}));


let DirectionsButton = Container.template($ => ({
  left: 0, right:0, top: 0, bottom: 0, 
  active: true,state:0,
  contents: [
      new Picture({left: -20, right: 0,top: 10, height: 70, url: "assets/directions.png"}),
  ],
  behavior: Behavior({
    onTouchBegan(container) {
    },
    onTouchEnded(container) {
    }
  })
}));
//layout
export var DetailScreen = Column.template($ => ({
    top: 0, bottom: 0, left: 0, right: 0, skin: backgroundSkin,
    active: true, state: 0,
    contents: [
        new HeaderWithBack({
          title: $.childName
        }),
        new Picture({top: -20, width: SCREEN_WIDTH , url: $.mapImage}),
        new DetailsPane({
          childName: $.childName,
          childImage: $.childImage
        }),
        new ActivityPane(),
    ],
    behavior: Behavior({

    }),
}));

//application.add(new MainContainer());