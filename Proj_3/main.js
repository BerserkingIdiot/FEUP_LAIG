//From https://github.com/EvanHahn/ScriptInclude
include=function(){function g(){var a=this.readyState;if(!a||/ded|te/.test(a))b--,!b&&e&&f()}var a=arguments,c=document,b=a.length,f=a[b-1],e=f.call;e&&b--;for(var d=0;d<b;d++)a=c.createElement("script"),a.src=arguments[d],a.async=!0,a.onload=a.onerror=a.onreadystatechange=g,(c.head||c.getElementsByTagName("head")[0]).appendChild(a)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', 'game/GameScene.js', 'MySceneGraph.js', 'MyInterface.js', 'primitives/MyRectangle.js', 'primitives/MyCylinder.js', 'primitives/MyTriangle.js', 'primitives/MySphere.js', 'primitives/MyOctagon.js', 'primitives/MyTorus.js',
        'MyComponent.js', 'animations/MyAnimation.js', 'animations/MyKeyframe.js', 'animations/MyKeyframeAnimation.js', 'animations/MyArcAnimation.js', 'animations/MyDropAnimation.js', 'animations/MyGrowAnimation.js', 'primitives/MyPatch.js', 'primitives/MyPlane.js', 'primitives/MyCylinderNURB.js',
        'game/MyGameOverview.js', 'game/MyGamePiece.js', 'game/MyGameMove.js', 'game/MyGameOrchestrator.js', 'game/MyOctoTile.js', 'game/MySquareTile.js', 'game/MyBoard.js', 'game/MyGameScenes.js', 'game/MyGameState.js', 'game/MyGameAnimator.js',
        'game/MyGameSequence.js', 'prolog/Server.js', 'game/TurnStateMachine.js', 'game/MySquarePiece.js', 'game/MyReplayOrchestrator.js', 'main_menu/MyMainMenu.js' , 'main_menu/MainMenuScene.js', 'main_menu/MenuStateMachine.js', 
        'end_menu/MyEndMenu.js', 'end_menu/EndMenuScene.js', 'Squex.js',

main=function()
{
    let game = new Squex();
    
    game.run();
}

]);