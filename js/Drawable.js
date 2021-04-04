/*
 * This file is part of the Education Network Simulator project and covered 
 * by GPLv3 license. See full terms in the LICENSE file at the root folder
 * or at http://www.gnu.org/licenses/gpl-3.0.html.
 * 
 * (c) 2015 Jorge García Ochoa de Aspuru
 * bardok@gmail.com
 * 
 * Images are copyrighted by their respective authors and have been 
 * downloaded from http://pixabay.com/
 * 
 */

var Drawable = function(c_owner) 
{
    this.id = getNextID();
    var X = 0;
    var Y = 0;
    var image = null;
    var owner = c_owner;
    var rect = new UIRectangle(null, null, this, 0, 0, 0, 0, 0, false);
    uimanager.addClickable(rect);
    var observers = [];
    
    this.save = function() 
    {
        var result = {};
        result.version = 1;
        result.id = this.id;
        result.X = X;
        result.Y = Y;
        
        return result;
    };
    
    this.load = function(data) 
    {
        X = data.X;
        Y = data.Y;
        this.id = data.id;
        notifyObservers();
    };
    
    this.setPosition = function(x, y) 
    {
        X = x;
        Y = y;
        if (image !== null) 
        {
            rect.setCoords(X, Y, image.width, image.height, 0);
        }
        notifyObservers();
    };
    
    this.getX = function() 
    {
        return X;
    };
    
    this.getY = function() 
    {
        return Y;
    };
    
    this.getCenterX = function() 
    {
        return X + image.width / 2;
    };
    
    this.getCenterY = function() 
    {
        return Y + image.height / 2;
    };
    
    this.setImage = function(img) 
    {
        image = img;
        if (image !== null) 
        {
            rect.setCoords(X, Y, image.width, image.height, 0);
        }
        notifyObservers();
    };
    
    function drawInfo(d) 
    {
        var parts = owner.getStrInfo().split("\n");
        for (var i = 0; i < parts.length; i++) 
        {
	    var p = document.createElement("p");
	    p.innerHTML = parts[i];
            div.appendChild(p);
        }
    }
    
    this.draw = function() 
    {
	var d = document.createElement("div");
	d.setAttribute("style", "position: fixed; top: "+ Y +"px; left: "+ X +"px;");
	var i = document.createElement("img");
	i.setAttribute("src", image.src);
	d.appendChild(i);
	drawInfo(d);
	document.body.appendChild(d);
    };
    
    this.getOwner = function() 
    {
        return owner;
    };
    
    this.getRect = function() 
    {
        var data = {};
        data.x = X;
        data.y = Y;
        data.width = image.width;
        data.height = image.height;
        
        return data;
    };
    
    this.addObserver = function(obs) 
    {
        observers.push(obs);
    };
    
    this.deleteObserver = function(obs) 
    {
        var pos = observers.indexOf(obs);
        observers.splice(pos, 1);
    };
    
    function notifyObservers() 
    {
        if (image !== null) 
        {
            for (var i = 0; i < observers.length; i++) 
            {
                observers[i].drawableChanged();
            }
        }
    }

    this.dispose = function()
    {
        uimanager.removeClickable(rect);
    };
};
