import { _decorator, CCFloat, Component, Node, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    private _cameraPosition = v3();
    private _targetPosition = v3();

    @property(Node)
    target: Node;

    @property(CCFloat)
    moveSpeed = 1;

    @property(Vec3)
    offset = v3();

    update(deltaTime: number) {
        if (this.target) {
            this._cameraPosition = this.node.getPosition();
            this._targetPosition = this.target.getPosition().add(this.offset);

            this.node.setPosition(
                this._cameraPosition.lerp(
                    this._targetPosition,
                    deltaTime * this.moveSpeed
                )
            );
        }
    }
}
