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
serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyInterface.js', 'primitives/MyRectangle.js', 'primitives/MyCylinder.js', 'primitives/MyTriangle.js', 'primitives/MySphere.js', 'primitives/MyOctagon.js', 'primitives/MyTorus.js',
        'MyComponent.js', 'animations/MyAnimation.js', 'animations/MyKeyframe.js', 'animations/MyKeyframeAnimation.js', 'primitives/MyPatch.js', 'primitives/MyPlane.js', 'primitives/MyCylinderNURB.js',
        'MySecurityCamera.js', 'game/MyPiece.js', 'game/MyGameMove.js', 'game/MyTile.js', 'game/MyBoard.js',

main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    var filename= getUrlVars()['file'] || "demo.xml";

	// create and load graph, and associate it to scene. 
	// Check console for loading errors
	var myGraph = new MySceneGraph(filename, myScene);
	
	// start
    app.run();
}

]);