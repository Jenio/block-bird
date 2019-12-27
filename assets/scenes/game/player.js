var Config=require('Config');
cc.Class({
    extends: cc.Component,

    properties: {
        lastBlock:''
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    onBeginContact(contact, self, other) {
        let sP=self.node.parent.convertToWorldSpaceAR(self.node.position);
        let oP=other.node.parent.convertToWorldSpaceAR(other.node.position);
        let group=other.node.group;
        if(group==='trap'){
            //--- 遇到陷阱 游戏失败
            if(this.lastBlock!='trap'){
            this.gameOver();
            console.log('traped');
            }
        }
        if(group==='goal'){
            //--- 到达终点 游戏结束
            if(other.tag===0){
                this.success();
                contact.disabled=true;
            }else{
            Config.GP.gameSuccess();
            }
        }
   
        if(Config.gameStop){
            this.node.getComponent(cc.RigidBody).linearVelocity=cc.v2(0,0);
        }
        if(sP.sub(oP).mag()>1.3*this.node.width){
            contact.disabledOnce=true;
        }

        if(group==='wall'||group==='rock'){
            if(Math.abs(sP.y-oP.y)<(other.node.height+self.node.height)/2.1){
                console.log('wallrock')
                this.gameOver();
            }
        }
        if(group==='perfect'){
            if(Math.abs(sP.y-oP.y)<(other.node.height+self.node.height)/2.1){
                console.log('perfect')
                this.gameOver();
            }
            if(this.lastBlock!='perfect'){
                this.perfect();
            }
        }
        this.lastBlock=group;

    },
    init(){
        console.log(this.node)
        let rigid=this.node.getComponent(cc.RigidBody);
        rigid.fixedRotation =true;
        rigid.linearVelocity=cc.v2(0,0)
        this.node.position=cc.v2(-138,0);
        this.node.rotation=0;
        Config.GP.moveCamera();
        let boxCollider=this.node.getComponent(cc.PhysicsBoxCollider);
        boxCollider.friction=0;

    },
    perfect(){},
    gameOver(){
        if(Config.gameStop)return;
        console.log('game over11')
        let p=this.node.convertToWorldSpaceAR(cc.v2(70,70));
        let rigid=this.node.getComponent(cc.RigidBody);
        rigid.fixedRotation=false;;
        rigid.linearVelocity=cc.v2(-260,200);
        rigid.angularVelocity=-420;

        Config.GP.gameOver();
    },
    success(){
        Config.gameSuccess=true;
    },
    // onPostSolve(contact, self, other) {
    //     this.node.stopAllActions();
    // }

    // update (dt) {},
});
