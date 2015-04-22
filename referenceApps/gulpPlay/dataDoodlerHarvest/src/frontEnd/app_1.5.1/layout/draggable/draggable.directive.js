(function () {
    'use strict';
    angular.module('layout.module')
        .directive('draggable',['$document',function($document){
            return {
                restrict:'A',

                link:function(scope,element,attr){
                    //If you want to select from the element in a directive's link function you need to access the DOM reference instead of the the jqLite reference - element[0] instead of element:
                    //http://stackoverflow.com/questions/23609171/how-to-get-element-by-classname-or-id
                    var queryResult = element[0].getElementsByClassName('.section-pad-header')
                    var draghandle=angular.element(queryResult);
                    console.log('element',element)
                    console.log('queryResult',queryResult)
                    console.log('draghandle',draghandle)
                    var startX = 0, startY = 0, x = 0, y = 0;
                    element.css({
                        position: 'absolute',
                        //border: '1px solid red',
                        //backgroundColor: 'lightgrey',
                        cursor: 'pointer',
                        display: 'block',
                        //width: '65px'
                    });
                    draghandle.on('mousedown', function(event) {
                        // Prevent default dragging of selected content
                        event.preventDefault();
                        startX = event.screenX - x;
                        startY = event.screenY - y;
                        $document.on('mousemove', mousemove);
                        $document.on('mouseup', mouseup);
                    });

                    function mousemove(event) {
                        y = event.screenY - startY;
                        x = event.screenX - startX;
                        element.css({
                            top: y + 'px',
                            left:  x + 'px'
                        });
                    }

                    function mouseup() {
                        $document.off('mousemove', mousemove);
                        $document.off('mouseup', mouseup);
                    }
                }
            }
        }])
}());
