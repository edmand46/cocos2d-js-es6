cc.game.onStart = function(){
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new MainScene());
    }, this);
};