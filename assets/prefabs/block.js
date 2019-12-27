var Config = require('Config');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    onBeginContact(contact, self, other) {
        let group=other.node.group;
        let sP = self.node.parent.convertToWorldSpaceAR(self.node.position);
        let oP = other.node.parent.convertToWorldSpaceAR(other.node.position);
        if (Config.gameSuccess) {
            if(group==='wall'||group==='perfect'){
                this.node.runAction(cc.sequence(
                    cc.delayTime(.01),
                    cc.callFunc(function(){
                        this.breakBlock();
                    },this)
                ))
            }
        }
        if(group==='trap'){
            this.node.runAction(cc.sequence(
                cc.delayTime(.1),
                cc.callFunc(function(){
                    this.breakBlock();
                },this)
            ))
           
        }
        if (sP.sub(oP).mag() > 1.1 * this.node.width) {
            contact.disabledOnce = true;
        }

    },
    breakBlock(){
        this.node.destroy();
        Config.GP.getCoin(1);
    },
    showParticle(){},
    // update (dt) {},
});
