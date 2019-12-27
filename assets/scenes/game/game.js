var Config = require("Config");
var stepConst = require('stepConst');
var missionInfo = require('missionInfo');
cc.Class({
    extends: cc.Component,

    properties: {
        UIManager: cc.Node,
        camera: cc.Node,
        bg: cc.Node,
        playground: cc.Node,
        player: cc.Node,
        blockPrefab: cc.Prefab,
        distance: 0,
        mapStepPrefab: cc.Prefab,
        _mapArr: [],
        _block: [],
        selectionContent: cc.Node,
        selectionItemPrefab: cc.Prefab,
        coin:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        this.node.on('touchend', this.touchendHandler, this);
        Config.GP = this;
    },
    touchendHandler(e) {
        if (Config.gameSuccess) return;
        if (Config.gameStop) return;
        //--- 射线检测
        let p1 = this.player.position.add(cc.v2(this.player.width / 2, 0));
        let p2 = this.player.position.add(cc.v2(-this.player.width / 2, 0));

        let p3 = this.player.parent.convertToWorldSpaceAR(p1);
        let p4 = this.player.parent.convertToWorldSpaceAR(p2);
        var results1 = cc.director.getPhysicsManager().rayCast(p3, p3.add(cc.v2(0, this.player.height * 1.5)), cc.RayCastType.Any);
        var results2 = cc.director.getPhysicsManager().rayCast(p4, p4.add(cc.v2(0, this.player.height * 1.5)), cc.RayCastType.Any);

        for (var i = 0; i < results1.length; i++) {
            var result = results1[i];
            var collider = result.collider;
            let node = collider.body.node;
            console.log(result, 'ray')
            let group = collider.node.group;
            //-- 若上方有障碍物，则不位移且不生成方块
            if (group === 'wall' || group === 'perfect' || group === 'rock') return;
        }
        for (var i = 0; i < results2.length; i++) {
            var result = results2[i];
            var collider = result.collider;
            let node = collider.body.node;
            console.log(result, 'ray')
            let group = collider.node.group;
            //-- 若上方有障碍物，则不位移且不生成方块
            if (group === 'wall' || group === 'perfect' || group === 'rock') return;
        }
        this.player.runAction(cc.sequence(
            cc.moveBy(.1, 0, 76),
            cc.callFunc(function () {
                this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(Config.playerSpeed, 0);
                let block = cc.instantiate(this.blockPrefab);
                block.parent = this.player.parent;
                block.position = this.player.position.add(cc.v2(0, -20));
                block.scale = .1;
                block.runAction(cc.scaleTo(.08, 1, 1));
                block.getComponent(cc.RigidBody).linearVelocity = cc.v2(Config.playerSpeed, 0);
                this._block.push(block);
            }, this)
        ));
    },
    start() {

        let that = this;
        Config.gameStop = true;
        cc.loader.loadResDir('', cc.SpriteAtlas, function (e, f) {

        });
        this.selectionInit();
        this.selectionRefresh();
        // this.startLevel(1);
    },
    gameSceneInit(data) {
        for (let i = 0; i < this._mapArr.length; i++) {
            this._mapArr[i].destroy();
        }
        this._mapArr = [];
        // this.missionData = ['a101',  'a002'];
        // this.missionData = ['a101', 'a101','a323', 'a101', 'a324', 'a101','a202', 'a101', 'a302', 'a101', 'a302', 'a101', 'a302', 'a101', 'a302', 'a101', 'a002'];
        this.missionData = data;
        let firstMap = cc.instantiate(this.mapStepPrefab);
        firstMap.parent = this.playground;
        let distance = 760;
        firstMap.x = -distance / 2
        firstMap.getComponent('mapStep').stepinit(stepConst['a001']);

        this.distance = distance / 2;
        this.mapStepInit();
        this._mapArr.push(firstMap);
    },
    mapStepInit() {
        if (this.missionData.length <= 0) return;
        let firstMap = cc.instantiate(this.mapStepPrefab);
        firstMap.parent = this.playground;
        firstMap.x = this.distance;
        let distance = firstMap.getComponent('mapStep').stepinit(stepConst[this.missionData[0]]);
        this.missionData.shift();

        this.distance += distance;

        this._mapArr.push(firstMap);

    },
    selectionInit() {
        let startPosition = cc.v2(-this.selectionContent.width / 2 + 100 + 32, this.selectionContent.height / 2 - 100 - 150);
        let deltaX = 154;
        let deltaY = 157;
        let rol = 4;
        for (let i = 0; i < 20; i++) {
            let item = cc.instantiate(this.selectionItemPrefab);
            let x = i % rol;
            let y = Math.floor(i / rol);
            item.getChildByName('label').getComponent(cc.Label).string = i + 1;
            item.parent = this.selectionContent;
            item.position = startPosition.add(cc.v2(x * deltaX, -y * deltaY));
            item.index = i;
            item.on('touchend', this.selectionTouch, this);
        }


    },
    selectionTouch(e) {
        this.startLevel(e.target.index + 1);
    },
    selectionRefresh() {
        let info = this.getMissionInfo();
        let children = this.selectionContent.children;
        console.log('refresh:info,', info)
        for (let i = 0; i < children.length; i++) {
            let item = children[i];
            if (info[i].unLock) {
                item.getChildByName('lock').active = false;
                // item.getChildByName('stars').active=true;
                // let stars= item.getChildByName('stars').children;
                // if(info[i].isComplete){
                //     for(let j = 0;j<3;j++){
                //         stars[j].active=j<info[i].startNumbers;
                //     }
                // }
            } else {
                item.getChildByName('lock').active = true;
                // item.getChildByName('stars').active=false;
            }
        }
        console.log(this.selectionContent)
    },
    gameStart() {
        this.UIManager.getComponent('UIManager').showGameScene();
        this.player.getComponent(cc.PhysicsBoxCollider).friction = 0;

        Config.gameStop = false;
        Config.gameSuccess = false;
        this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(Config.playerSpeed, 0)
        for (let i = 0; i < this._block.length; i++) {
            let item = this._block[i];
            if (item && item.isValid) {
                item.destroy();
            }
        }
        this._block = [];


    },
    gameRestart() {

        this.gameStart();
    },
    gamePause() {
        cc.game.pause();
    },
    gameOver() {
        Config.gameStop = true;
        this.UIManager.getComponent('UIManager').showGameOverPanel();
        for (let i = 0; i < this._block.length; i++) {
            let item = this._block[i];
            if (item && item.isValid) {
                item.getComponent(cc.RigidBody).linearVelocity = cc.v2();
            }
        }
    },
    gameSuccess() {
        Config.gameStop = true;
        this.UIManager.getComponent('UIManager').showSuccessPanel();
        let levelIndex = this.level - 1;
        let info = this.getMissionInfo();
        info[levelIndex].isComplete = true;
        if (info[levelIndex + 1]) info[levelIndex + 1].unLock = true;
        this.setMissionInfo(info);
    },
    startLevel(n) {
        this.level = n;
        let levelIndex = n - 1;
        let data = missionInfo[levelIndex].data;
        // this.player.runAction(cc.moveTo(.1,-138,0))
        this.player.getComponent('player').init();
        this.gameSceneInit(data);
        this.UIManager.getComponent('UIManager').showReadyScene();
    },
    levelCompelete() {
        let mission = this.getMissionInfo();
        mission[this.level - 1].isComplete = true;
        if (mission[this.level]) {
            mission[this.level].unlock = true;
        }
        this.setMissionInfo(mission);
    },
    nextLevel() {
        if (this.level === missionInfo.length) {
            this.UIManager.getComponent('UIManager').showMenuScene();
        } else {
            this.startLevel(this.level + 1);
        }
    },
    update(dt) {
        if (Config.gameStop) return;
        if (this.player.x > this.distance - cc.winSize.width) this.mapStepInit();
        if (this._mapArr.length > 0) {
            if (this._mapArr[0].x < -2000) {
                let map = this._mapArr.shift();
                map.destroy();
            }

        }
        this.moveCamera();

    },
    moveCamera() {
        this.camera.x = this.player.x + 138;
        this.bg.x = this.camera.x;
    },
    setMissionInfo(info) {
        localStorage.setItem('missionInfo', JSON.stringify(info));
    },
    getMissionInfo() {
        let info = localStorage.getItem('missionInfo');
        if (info) {
            info = JSON.parse(info);
        } else {
            info = missionInfo;
        }
        return info;
    },
    getCoin(n){
        this.coin+=n;
        // this.coinLabel.string=this.coin;
        localStorage.setItem('coin',this.coin);
    },
});
