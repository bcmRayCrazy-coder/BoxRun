import {
    _decorator,
    Animation,
    CCFloat,
    CCInteger,
    Component,
    instantiate,
    Label,
    Node,
    Prefab,
} from 'cc';
import { PlayerController } from './PlayerController';
import { UiManager } from './UiManager';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE,
    BT_GROUND,
    BT_GROUND_FOREST,
    BT_SWIPER,
    BT_END,
}

enum GameState {
    GS_INIT,
    GS_PLAY,
    GS_END,
}

const DieBlocks = [BlockType.BT_NONE, BlockType.BT_SWIPER];

@ccclass('GameManager')
export class GameManager extends Component {
    private _road: BlockType[] = [];
    private _roadFlag: Node;
    private _currentState = GameState.GS_INIT;

    @property(Prefab)
    groundPrefab: Prefab;

    @property(Prefab)
    groundForestPrefab: Prefab;

    @property(Prefab)
    endPrefab: Prefab;

    @property(Prefab)
    swiperPrefab: Prefab;

    @property(CCInteger)
    roadLength = 50;

    @property(CCFloat)
    blockDistance = 1.5;

    @property(PlayerController)
    playerController: PlayerController;

    @property(UiManager)
    uiManager: UiManager;

    @property(Label)
    stepLabel: Label;

    start() {
        this.setCurrentState(GameState.GS_INIT);

        this.playerController.node.on('JumpEnd', this.checkResult, this);
    }

    init() {
        this.activeUi('Start');
        this.generateRoad();

        this.playerController.setInputActive(false);
        this.stepLabel.string = '0 / ' + this.roadLength;
    }

    generateRoad() {
        this.resetRoad();

        this._road.push(BlockType.BT_GROUND);
        this.randomRoad();
        this._road.push(BlockType.BT_END);
        this._road.push(BlockType.BT_GROUND);

        this.spawnBlocks();
    }

    resetRoad() {
        this.node.removeAllChildren();
        this._road = [];
    }

    randomRoad() {
        for (let i = 1; i < this.roadLength; i++) {
            // @ts-ignore
            if (DieBlocks.includes(this._road[i - 1])) {
                this._road.push(BlockType.BT_GROUND);
            } else {
                this._road.push(Math.floor(Math.random() * 4));
            }
        }
    }

    spawnBlocks() {
        for (let j = 0; j < this._road.length; j++) {
            let block: Node = this.spawnBlockByType(this._road[j]);
            if (block) {
                this.node.addChild(block);
                block.setPosition(j * this.blockDistance, 0, 0);
            }
        }
    }

    spawnBlockByType(type: BlockType) {
        if (!this.groundPrefab) {
            return null;
        }

        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_GROUND:
                block = instantiate(this.groundPrefab);
                break;
            case BlockType.BT_GROUND_FOREST:
                block = instantiate(this.groundForestPrefab);
                break;
            case BlockType.BT_SWIPER:
                block = instantiate(this.swiperPrefab);
                break;
            case BlockType.BT_END:
                block = instantiate(this.endPrefab);
                this._roadFlag = block.getChildByName('flag');
                break;
        }

        return block;
    }

    checkResult(moveIndex: number) {
        console.log('Check result', moveIndex);
        if (moveIndex < this.roadLength) {
            this.stepLabel.string = `${moveIndex} / ${this.roadLength}`;
            // @ts-ignore
            if (DieBlocks.includes(this._road[moveIndex]))
                this.setCurrentState(GameState.GS_INIT);
        } else {
            this.stepLabel.string = `${this.roadLength} / ${this.roadLength}`;
            this.playerController.setInputActive(false);
            this._roadFlag.getComponent(Animation).play('FlagUp');
            this.setCurrentState(GameState.GS_END);
        }
    }

    activeUi(name: string, active = true) {
        this.uiManager.active(name, active);
    }

    onPlayButtonClicked() {
        this.setCurrentState(GameState.GS_PLAY);
    }

    onMenuButtonClicked() {
        this.setCurrentState(GameState.GS_INIT);
    }

    setCurrentState(state: GameState) {
        this._currentState = state;
        switch (state) {
            case GameState.GS_INIT:
                this.init();
                this.playerController.reset();
                break;
            case GameState.GS_PLAY:
                this.activeUi('Start', false);
                setTimeout(
                    () => this.playerController.setInputActive(true),
                    0.1
                );
                break;
            case GameState.GS_END:
                this.activeUi('End');
                break;
        }
    }
}
