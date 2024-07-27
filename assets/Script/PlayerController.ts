import { _decorator, Component, Input, input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    start() {
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchEnd() {}

    update(deltaTime: number) {}
}
