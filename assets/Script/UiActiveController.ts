import { _decorator, CCBoolean, CCString, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UiActiveController')
export class UiActiveController extends Component {
    @property(CCString)
    uiName: String = 'No Name';

    @property(CCBoolean)
    defaultActive: boolean = true;

    start() {
        this.node.on('uiActive', this.uiActive, this);
        this.node.active = this.defaultActive;
    }

    uiActive(name: string, active: boolean) {
        if (name == this.uiName && active) this.node.active = true;
        else this.node.active = false;
    }
}
