(function() {
    'use strict';

    angular.module('app').directive('bloomingMenu', function(){
        return{
            restrict:'E',
            templateUrl:"bloomingMenu.template.html",
            controller:function($scope){
                $scope.active=true;
                console.log(window.innerHeight);
                var winH=window.innerHeight;
                var winW = window.innerWidth;
                $scope.menuDimensions=function(){
                    if($scope.active){
                    return{width:winW,height:winH}
                }
                    var circ1=$scope.circleStyle(1);
                    return{width:circ1.width,height:circ1.height};
                }

                $scope.circleStyle=function(level) {
                    var topSpace=0;
                    var level1Height = winH*.25;
                    var vertOffset = level1Height*.45;

                    var directiveSpace=winH-topSpace-level1Height;
                    var segmentLength=directiveSpace/4;
                    var levelHeight = segmentLength * level;
                    var levelTop=level=== 1? (winH-level1Height)+vertOffset: winH-(level*segmentLength )+ topSpace;
                    var levelLeft= winW - (level*segmentLength);
                    var width=level==1?level1Height:levelHeight*1.7;
                    var height=level==1?level1Height: levelHeight*1.7;

                    return {width:width, height:height, top: levelTop, left:levelLeft}
                };


                $scope.selectme=function(btnText,$event){
                    //iterate through all buttons
                    //we have two identical button containers. (class="button-container")
                    //the first one is what controls the opacity/color of the button.  The second is what has the visible text (always opaque)
                    var firstContainer=$('.button-container').first();
                    $.each(firstContainer.children(),function(btn){
                        var thisTxt = $(this).context.innerText;

                        if(btnText===thisTxt){
                            $(this).addClass('selected-button')
                        }
                        else{
                            $(this).removeClass('selected-button')
                        }

                    })
                    $event.stopPropagation();
                    //console.log(firstContainer);
                    //console.log(btnText)
                }
            },
            link:function(scp,el,attr){


            }
        }
    });


})();
