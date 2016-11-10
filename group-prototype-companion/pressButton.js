export class PressButtonBehavior extends Behavior {
	onCreate(container, data) {
		//trace(data+"\n");
		this.data = data;
		//trace(JSON.stringify(data, null, 4)+"\n");
		this.upSkin = data.upSkin;
		this.downSkin = data.downSkin;
		this.downImage = data.downImage;
		container.skin = this.upSkin;
		this.onPostCreate(container, data);
	}

	onPostCreate(container, data) { }

	onTap(content) { }

	onTouchBegan(content) {
		content.skin = this.downSkin;
		if (this.downImage) {
			content.empty();
			content.add(this.downImage);
		}
	}

	onTouchEnded(content) {
		content.skin = this.upSkin;
		this.onTap(content);
	}
}

export var PressButton = Container.template(params => ({
	active: true,
	left: params.left, top: params.top, right: params.right, bottom: params.bottom,
	width: params.width, height: params.height,
	upSkin: params.upSkin,
	downSkin: params.downSkin,
	Behavior: params.Behavior,
	contents: params.contents
}));