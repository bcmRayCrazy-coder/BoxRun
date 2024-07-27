import {
    _decorator,
    CCFloat,
    Component,
    EventMouse,
    Input,
    input,
    v3,
    Vec3,
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

    @property(Vec3)
    jumpVector = v3(1, 0, 0);

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseUp(event: EventMouse) {
        this.jumpByStep(1);
    }

    jumpByStep(step: number) {
        if (this._startJump) return;
        this._startJump = true;
        this._jumpStep = step;
        this._currentJumpTime = 0;
        this._currentJumpSpeed = this._jumpStep / this.jumpTime;

        this.node.getPosition(this._currentPosition);
        Vec3.add(
            this._targetPosition,
            this._currentPosition,
            this.jumpVector.multiplyScalar(this._jumpStep)
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
        Vec3.scaleAndAdd(
            this._currentPosition,
            this._currentPosition,
            this.jumpVector,
            deltaTime * this._currentJumpSpeed
        );

        console.log(deltaTime, this._deltaPosition);

        this.node.setPosition(this._currentPosition);
    }
}
