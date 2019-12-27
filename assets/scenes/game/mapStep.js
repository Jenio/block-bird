
cc.Class({
    extends: cc.Component,

    properties: {
        xx: 10,
        yy: 22,
        blockSize: 75,
        _blockArr: [],
        blockPrefab:[cc.Prefab],

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.on('touchmove',function(e){
            let delta=e.touch._point.sub(e.touch._prevPoint);
            this.node.position.add(delta)
        },this)
    },
    stepinit(initInfo, x, y) {
       
        let mapInfo = initInfo.mapInfo;
        let moveInfo = initInfo.moveInfo;
        let moveMode = initInfo.moveMode;
        this.xx=mapInfo.length/22;
        let startPosition = cc.v2(this.blockSize / 2, this.yy / 2 * this.blockSize);

        this.node.width=this.xx*this.blockSize;
        // let startPosition = cc.v2(-this.xx / 2 * this.blockSize, this.yy / 2 * this.blockSize);
        for (let i = 0; i < mapInfo.length; i++) {
            if(!mapInfo[i])continue;
            let x = i % this.xx;
            let y = Math.floor(i / this.xx);
            let item = cc.instantiate(this.blockPrefab[mapInfo[i]-1]);
            item.parent = this.node;
            //--- position=cc.v2(x*100,y*100)


            // let node=new cc.Node();
            // let label=node.addComponent(cc.Label);
            // label.string=i;
            // node.parent=item;
            if (moveMode === 'default') {
                item.position = startPosition.add(cc.v2(x * this.blockSize, -y * this.blockSize));
                if (moveInfo[i]) {
                    item.action = cc.moveBy(0.5, moveInfo[i].mulSelf(this.blockSize))
                }
            } else {

                //--- reserve
                item.position = startPosition.add(cc.v2(x * this.blockSize, -y * this.blockSize));
                if (moveInfo[i]) {
                    item.position.add(moveInfo[i].mulSelf(this.blockSize));
                    item.action = cc.moveBy(0.5, moveInfo[i].mulSelf(this.blockSize).negSelf())
                }
            }
            // item.getComponent(cc.RigidBody).linearVelocity=cc.v2(-200,0)
            this._blockArr.push(item);
        }
        // console.log('stepInit,xy',this.xx,this.yy)
        return this.blockSize * this.xx;
    },
    moveBlocks() {
        for (let i = 0; i < this._blockArr.length; i++) {
            let item = this._blockArr[i];
            if (item.action) {
                item.runAction(action);
            }
        }
    },
    // update (dt) {},
});
