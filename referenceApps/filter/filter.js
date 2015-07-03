/**
 * Created by Kent on 7/1/2015.
 */
angular.module('filterApp',[])
.controller('myController',myController)
.filter('insertSpace',insertSpace);

function myController (){
 this.orders=[
        {name:'order1',orderid:"abcdefghijkmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"},
        {name:'order1',orderid:"abcdefghijkmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"},
        {name:'order1',orderid:"abcdefghijkmnopqrstuvwxabcdefghijklmnopqrstuvwxyzyz"},
        {name:'order1',orderid:"abcdefghijkmnopqrstuvwxyz"},
        {name:'order1',orderid:"abcdefghijkmnopqrstuvwxabcdefghijklmnopqrstuvwxyzyz"},
        {name:'order1',orderid:"abcdefghijkmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"},
        {name:'order1',orderid:"abcdefghijkmnopqrstuvwxyz"},
        {name:'order1',orderid:"abcdefghijkmnopqrstuvwxyz"}
    ]
}

function insertSpace(){
    return function(txt,segmentLength){
        var rtrnVal = "";
        for(var i = 0; i<txt.length;i++)
        {
            rtrnVal+=txt.charAt(i);
            if((i>0 && (i%segmentLength))===0)
            {
                rtrnVal += " "

            }
            //rtrnVal+=i + ",";
        }

        return rtrnVal;
    };
}

