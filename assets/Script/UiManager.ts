import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UiManager')
export class UiManager extends Component {
    @property([Node])
    uiNodes: Node[] = [];

    active(name: string, active: boolean) {
        this.uiNodes.forEach((ui) => ui.emit('uiActive', name, active));
    }
}
