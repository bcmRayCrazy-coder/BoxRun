import {
    _decorator,
    CCFloat,
    Component,
    EventMouse,
    Input,
    input,
    v3,
    Vec3,
    Animation,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private _startJump = false;
    private _jumpStep = 0;
    private _currentPosition = v3();
    private _targetPosition = v3();
    private _currentJumpTime = 0;
    private _currentJumpSpeed = 0;
    private _deltaPosition = v3();

    @property(CCFloat)
    jumpTime = 0.1;

    @property(CCFloat)
    jumpScale = 1;

    @property(Animation)
    jumpAnimation: Animation;

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() == EventMouse.BUTTON_LEFT) this.jumpByStep(1);
        else if (event.getButton() == EventMouse.BUTTON_RIGHT)
            this.jumpByStep(2);
    }

    jumpByStep(step: number) {
        if (this._startJump) return;
        if (this.jumpAnimation)
            this.jumpAnimation.play(`${['One', 'Two'][step - 1]}Jump`);
        this._startJump = true;
        this._jumpStep = step;
        this._currentJumpTime = 0;
        this._currentJumpSpeed = this._jumpStep / this.jumpTime;

        this.node.getPosition(this._currentPosition);
        Vec3.add(
            this._targetPosition,
            this._currentPosition,
            v3(this._jumpStep * this.jumpScale, 0, 0)
        );
    }

    update(deltaTime: number) {
        if (this._startJump) {
            this._currentJumpTime += deltaTime;
            if (this._currentJumpTime > this.jumpTime) this.endJump();
            else this.tweenJump(deltaTime);
        }
    }

    endJump() {
        this.node.setPosition(this._targetPosition);
        this._startJump = false;
    }

    tweenJump(deltaTime: number) {
        this.node.getPosition(this._currentPosition);
        this._deltaPosition.x =
            this._currentJumpSpeed * deltaTime * this.jumpScale;
        Vec3.add(
            this._currentPosition,
            this._currentPosition,
            this._deltaPosition
        );
        this.node.setPosition(this._currentPosition);
    }
}
