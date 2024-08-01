import { _decorator, CCString, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UiActiveController')
export class UiActiveController extends Component {
    @property(CCString)
    uiName: String = 'No Name';

    start() {
        this.node.on('uiActive', this.uiActive, this);
    }

    uiActive(name: string, active: boolean) {
        if (name == this.uiName && active) this.node.active = true;
        else this.node.active = false;
    }
}
