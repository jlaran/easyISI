(function(window, undefined){
	var EasyISI = function(ISIConfig){
		this.initializeISI(ISIConfig);
	}

	EasyISI.prototype = {
		generalNodes : function(){
			this.isiContainerNode = document.getElementById(this.isiContainer);
			this.isiTextContainer = document.getElementById(this.isiTextContainer);
		},
		setConfig : function(ISIConfig){
			this.isiContainer = ISIConfig.isiContainer || undefined;
			this.isiTextContainer = ISIConfig.isiTextContainer || undefined;
			this.isiAutoScroll = ISIConfig.isiAutoScroll || false;
			this.isiHeight = ISIConfig.isiHeight || 300;
			this.isiWidth = ISIConfig.isiWidth || 300;
			this.isiIncludeArrows = ISIConfig.isiIncludeArrows || false;
			this.isiIncludeLine = ISIConfig.isiIncludeLine || false;
			this.isiTotalTime = ISIConfig.isiTotalTime || 10;
			this.isiStartDelay = ISIConfig.isiStartDelay || 1;
			this.isiMargins = ISIConfig.isiMargins || [0,0,0,0];
		},
		gobalVariables : function(){
			this._scrollerBeingDragged = false;
			this._scroller;
			this._scrollerline;
			this._arrowup;
			this._arrowdown;
			this._normalizedPosition;
			this._contentPosition = 0;
		},
		initializeISI : function(ISIConfig){
			this.setConfig(ISIConfig);
			this.gobalVariables();
			this.generalNodes();
			this.builder();
			this.initializeListeners();
		},
		initializeListeners : function(){
			var that = this;
			this._scroller.addEventListener('mousedown', function(evt){
				that.startDrag(evt, that);
			});
			window.addEventListener('mouseup', function(evt){
				that.stopDrag(evt, that);
			});
			window.addEventListener('mousemove', function(evt){
				that.knobSroll(evt, that);
			});
			window.addEventListener('mousewheel', function(){
				that.destroy();
			});
			window.addEventListener('DOMMouseScroll', function(){
				that.destroy();
			});
			this.isiTextContainer.addEventListener('click', function(){
				that.destroy();
			});
			this.isiTextContainer.addEventListener('scroll', function(evt){
				that.moveScroller(evt, that);
			});
		},
		builder : function(){
			// INITIATE HERE
			console.log("Builded");

			var that = this;
			this._scroller = document.createElement("div");
			this._scroller.className = 'scroller';
		    this.isiContainerNode.appendChild(this._scroller);
		    this._scroller.style.height = this.calculateKnobHeight() +'px';
		   	this.isiTextContainer.style.width = this.isiContainerNode.offsetWidth - this.isiMargins[1] + 'px';
		    this.isiTextContainer.style.height = this.isiContainerNode.offsetHeight - this.isiMargins[2]/2 + 'px';

		    if(this.isiIncludeLine == true){
		    	console.log("Lines Included");

				this._scrollerline = document.createElement("div");
			    this._scrollerline.className ='isiLine';
			    this.isiContainerNode.appendChild(this._scrollerline);
			   	this._scrollerline.style.top = this.isiMargins[0]+'px';
			   	this._scrollerline.style.height = this.isiTextContainer.offsetHeight - this._scroller.offsetHeight-this.isiMargins[2] +'px';
		    }

		   	if(this.isiIncludeArrows == true){
		    	console.log("Arrows Included");

		    	this.arrowup = document.createElement("div");
		    	this.arrowdown = document.createElement("div");
		    	this.arrowup.className = 'arrow-up';
		    	this.arrowdown.className = 'arrow-down';
		    	this.isiContainerNode.appendChild(this.arrowup);
		    	this.isiContainerNode.appendChild(this.arrowdown);
		    	this.arrowup.addEventListener('click',function(){
		    		that.isiTextContainer.scrollTop -= 10;
		    		that.destroy();
		    	});
		    	this.arrowdown.addEventListener('click',function(){
		    		that.isiTextContainer.scrollTop += 10;
		    		that.destroy();
		    	});
		    }

		    if(this.isiAutoScroll == true){ 
				setTimeout(function(){ 
					TweenMax.to(that.isiTextContainer, that.isiTotalTime,{
						scrollTo:'max', ease: Power0.easeNone, delay: that.isiStartDelay
					});
				}, 1000);	    	
		    };
		},
		calculateKnobHeight : function(){
			var visibleRatio = this.isiContainerNode.offsetHeight / this.isiTextContainer.scrollHeight;
			return visibleRatio * this.isiContainerNode.offsetHeight
		},
		startDrag : function(evt, that) {
		    that._normalizedPosition = evt.pageY;
		    that._contentPosition = that.isiTextContainer.scrollTop;
		    that._scrollerBeingDragged = true;
		},
		stopDrag : function(evt, that) {
			that._scrollerBeingDragged = false;
		},
		destroy : function(){
			// console.log("Destroy ISI");
		},
		knobSroll : function(evt, that) {
		    if (that._scrollerBeingDragged === true) {
				var mouseDifferential = evt.pageY - that._normalizedPosition;
				var scrollEquivalent = mouseDifferential * (that.isiTextContainer.scrollHeight / that.isiContainerNode.offsetHeight);
				that.isiTextContainer.scrollTop = that._contentPosition + scrollEquivalent;
		    }
		},
		moveScroller : function(evt, that) {
			console.log(evt.target.scrollTop);
		    var scrollPercentage = evt.target.scrollTop / that.isiTextContainer.scrollHeight;
		    var _topPosition = scrollPercentage * (that.isiContainerNode.offsetHeight - that.isiMargins[2] - that.isiMargins[0]); 
		    that._scroller.style.top = _topPosition + that.isiMargins[0] + 'px';
		}
	}

	window.EasyISI = EasyISI;
})(window);