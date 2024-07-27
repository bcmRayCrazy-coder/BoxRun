import {
    _decorator,
    CCFloat,
    CCInteger,
    Component,
    instantiate,
    Node,
    Prefab,
} from 'cc';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE,
    BT_GROUND,
    BT_GROUND_FOREST,
    BT_SWIPER,
}

const DieBlocks = [BlockType.BT_NONE, BlockType.BT_SWIPER];

@ccclass('GameManager')
export class GameManager extends Component {
    private _road: BlockType[] = [];

    @property(Prefab)
    groundPrefab: Prefab;

    @property(Prefab)
    groundForestPrefab: Prefab;

    @property(Prefab)
    swiperPrefab: Prefab;

    @property(CCInteger)
    roadLength = 50;

    @property(CCFloat)
    blockDistance = 1.5;

    start() {
        this.generateRoad();
    }

    generateRoad() {
        this.resetRoad();
        this._road.push(BlockType.BT_GROUND);

        this.randomRoad();
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
        }

        return block;
    }
}
