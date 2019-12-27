
cc.Class({
    extends: cc.Component,

    properties: {
        skins:[cc.SpriteFrame],
        target:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setSkin(n){
        this.target.getComponent(cc.Sprite).spriteFrame=this.skins[n];
    }
    // update (dt) {},
});
