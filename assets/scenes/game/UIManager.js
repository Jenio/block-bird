var Config=require('Config');
cc.Class({
    extends: cc.Component,

    properties: {
     gameScene:cc.Node,
     readyScene:cc.Node,
     selectionScene:cc.Node,
     menuScene:cc.Node,
     gameOverPanelPrefab:cc.Prefab,
     gameSuccessPanelPrefab:cc.Prefab,
     gamePausePanelPrefab:cc.Prefab,
     activePanel:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    showMenuScene(){
        this.closeAllScene();
        this.menuScene.active=true;
    },
    showGameScene(){
        this.closeAllScene();
        this.gameScene.active=true;
    },
    showSelectionScene(){
        Config.GP.selectionRefresh();
        this.closeAllScene();
        this.selectionScene.active=true;
    },
    showReadyScene(){
        this.closeAllScene();
        this.readyScene.active=true;
    },
    showGameOverPanel(){
        let gameover=cc.instantiate(this.gameOverPanelPrefab);
        gameover.parent=this.node;
        gameover.position=Config.GP.camera.position;
        this.activePanel=gameover;
        gameover.getChildByName('close').on('touchend',function(){
            this.showMenuScene();
            Config.GP.player.getComponent('player').init();
            console.log(gameover)

            gameover.removeFromParent();
            gameover.destroy();
        },this)


        gameover.getChildByName('replay').on('touchend',function(e){
            Config.GP.player.getComponent('player').init();
            Config.GP.gameStart();
            gameover.destroy();
            gameover.removeFromParent();
            e.stopPropagation(); 
        },this)
    },
    showSuccessPanel(){
        let gameover=cc.instantiate(this.gameSuccessPanelPrefab);
        gameover.parent=this.node;
        gameover.position=Config.GP.camera.position;
        this.activePanel=gameover;
        gameover.getChildByName('close').on('touchend',function(){
            this.showMenuScene();
            Config.GP.player.getComponent('player').init();
            console.log(gameover)

            gameover.removeFromParent();
            gameover.destroy();
        },this)


        gameover.getChildByName('replay').on('touchend',function(e){
            Config.GP.player.getComponent('player').init();
            Config.GP.gameStart();
            gameover.destroy();
            gameover.removeFromParent();
            e.stopPropagation(); 
        },this)


        gameover.getChildByName('next').on('touchend',function(e){
            Config.GP.player.getComponent('player').init();
            Config.GP.nextLevel();
            gameover.destroy();
            gameover.removeFromParent();
            e.stopPropagation(); 
        },this)
    },
    showGamePausePanel(){
        let gamePause=cc.instantiate(this.gamePausePanelPrefab);
        gamePause.parent=this.node;
        gamePause.getChildByName('close').on('touchend',function(){
            gamePause.destroy();
        },this)
    },
    closeAllScene(){
        this.menuScene.active=false;
        this.readyScene.active=false;
        this.selectionScene.active=false;
        if(this.activePanel){
            console.log('close activePanel:',this.activePanel.name)

            this.activePanel.destroy();
            this.activePanel=null;

        }
    },
    // update (dt) {},
});
