export class PressButtonBehavior extends Behavior {
	onCreate(button, data) {
		this.button = button;
		//trace(data+"\n");
		this.data = data;
		//trace(JSON.stringify(data, null, 4)+"\n");
		this.upSkin = data.upSkin;
		this.downSkin = data.downSkin;
		this.downImage = data.downImage;

		this.available = true;
		this.unavailableImage = data.unavailableImage;

		this.upImage = button.first;
		button.skin = this.upSkin;
		this.onPostCreate(button, data);
	}

	onPostCreate(container, data) { }

	onTap(content) { }

	onTouchBegan(content) {
		if (!this.available) return;
		content.skin = this.downSkin;
		if (this.downImage) {
			content.empty();
			content.add(this.downImage);
		}
	}

	makeAvailable() {
		if(!this.available) {
			this.button.empty();

			this.button.add(this.upImage);
			this.available = true;
		}
	}

	makeUnavailable() {
		if (this.available && this.unavailableImage) {
			this.button.empty();
			this.button.add(this.unavailableImage);

			this.available = false;
		}
	}

	onTouchEnded(content) {
		if (!this.available) return;
		if (this.downImage) {
			content.empty();
			content.add(this.upImage);
		}
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