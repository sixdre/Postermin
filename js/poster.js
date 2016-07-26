
;(function($){
	var Carousel=function(poster,opts){	//定义一个Carsouel的类
		// alert(poster)
		var _this_=this;
		this.poster=poster;
		this.posterItemMain=poster.find('.poster-list');
		this.posterA=poster.find('a');
		this.posterImg=poster.find('img');
		this.nextBtn=poster.find('.poster-next-btn');
		this.prevBtn=poster.find('.poster-prev-btn');
		this.posterItems=poster.find('li.poster-item');
		this.posterFirstItem=this.posterItems.first();
		this.posterLastItem=this.posterItems.last();
		this.rotateFlag=true;
		this.defaults={			//定义默认的参数
                     "width":800,					//主区域的宽
                     "height":270,					//主区域的高
                     "posterWidth":540,				//第一帧的宽
                     "posterHeight":270,			//第一帧的高
                     "scale":0.8,					//缩放比例
                     "autoPlay":true,				//是否自动播放
                     "delay":2000,					//自动播放延时
                     "speed":300,					//切换速度
                     'verticalType':'middle'		//是否垂直居中
                  },

      this.settings=$.extend({},this.defaults,opts);	//参数
      this.setMainpos();
      this.setPosterPos();
      this.setSettingValue();
      if(this.settings.autoPlay){
			this.autoPlay();
      	this.poster.hover(function(){
      		clearInterval(_this_.timer)
      	},function(){
      		_this_.autoPlay();
      	})
      }
      
      // 点击播放
      
      this.nextBtn.click(function(){	//右点击
      	if(_this_.rotateFlag){
      		_this_.rotateFlag=false;
      		_this_.carouseRotate('left')
      	}
      
      });
       this.prevBtn.click(function(){		//左点击
      	if(_this_.rotateFlag){
      		_this_.rotateFlag=false;
      		_this_.carouseRotate('right')
      	}
      })

	}

	Carousel.prototype={
		//设置定位及样式
		setMainpos:function(){
			var self=this;
			self.poster.css('position','relative');
			self.posterItemMain.css({'position':'absolute','list-style':'none'});
			self.posterItems.css('position','absolute');
			self.nextBtn.css({
					'position':'absolute',
					'top':0,
					'right':0, 
					'cursor':'pointer'
			});
			self.prevBtn.css({
							'position':'absolute',
							'top':0,
							'left':0, 
							'cursor':'pointer'
			});
			self.posterA.css({'display':'block',
							  'width':'100%',
							  'height':'100%'});
			self.posterImg.css({'display':'block',
							  'width':'100%',
							  'height':'100%'})

		},

		//自动播放
		autoPlay:function(){
			var self=this;
			self.timer=setInterval(function(){
				self.nextBtn.click()
			},self.settings.delay)
		},
		//播放
		carouseRotate:function(dir){
			var self=this;
			var zIndexArr=[]
			if(dir==='left'){
				
				this.posterItems.each(function(i){
					var prev=$(this).prev().get(0)?$(this).prev():self.posterLastItem,
					width=prev.width(),
					height=prev.height(),
					zIndex=prev.css('zIndex'),
					left=prev.css('left'),
					top=prev.css('top');
					zIndexArr.push(zIndex);
					$(this).animate({
							'width':width,
							'height':height,
							// 'zIndex':zIndex,
							'left':left,
							'top':top

					},self.settings.speed,function(){
						self.rotateFlag=true
					})

				})
				this.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i])

				})
			}else if(dir==='right'){
				
				this.posterItems.each(function(i){
					var next=$(this).next().get(0)?$(this).next():self.posterFirstItem,
					width=next.width(),
					height=next.height(),
					zIndex=next.css('zIndex'),
					left=next.css('left'),
					top=next.css('top');
					zIndexArr.push(zIndex);
					$(this).animate({
							'width':width,
							'height':height,
							// 'zIndex':zIndex,
							'left':left,
							'top':top

					},self.settings.speed,function(){
						self.rotateFlag=true
					})
				})
				this.posterItems.each(function(i){
					$(this).css('zIndex',zIndexArr[i])

				})
			}

		},

		//设置剩余帧的位置
		setPosterPos:function(){
			var self=this;
			var 	sliceItems  	 = this.posterItems.slice(1),
						sliceSize    = sliceItems.size()/2,
						rightSlice   = sliceItems.slice(0,sliceSize),
						level        = Math.floor(this.posterItems.size()/2),
						leftSlice    =sliceItems.slice(sliceSize);
			// 设置右边帧的位置
			var rw=this.settings.posterWidth,
				 rh=this.settings.posterHeight,
				 gap=((this.settings.width-this.settings.posterWidth)/2)/level;
			var firstLeft = (this.settings.width-this.settings.posterWidth)/2;
			var fixOffsetLeft = firstLeft+rw;
			rightSlice.each(function(i,e){
				level--;
				rw=rw*self.settings.scale;
				rh=rh*self.settings.scale;
				$(this).css({
					'zIndex':level,
					'height':rh,
					'width':rw,
					'left':fixOffsetLeft+(++i)*gap-rw,
					'top':self.setVerticalAlign(rh)

				})
			})
			// 设置左边帧的位置
			var lw=rightSlice.last().width(),
				 lh=rightSlice.last().height();
			leftSlice.each(function(i,e){
				// console.log($(e).html())
				$(this).css({
					'zIndex':i,
					'height':lh,
					'width':lw,
					'left':i*gap,
					'top':self.setVerticalAlign(lh)
				})
				lw=lw/self.settings.scale;
				lh=lh/self.settings.scale;
			})
		},
		//设置对齐方式
		setVerticalAlign:function(h){
			var verticalType=this.settings.verticalType,
					top=0;
			if(verticalType==='top'){
				top=0;
			}else if(verticalType==='bottom'){
				top=(this.settings.height-h)
			}else if(verticalType==='middle'){
				top=(this.settings.height-h)/2
			}else{
				top=(this.settings.height-h)/2
			}

			return top;

		},

		//用设置的参数去控制区域的css样式
		setSettingValue:function(){
			this.poster.css({			//主内容区样式
				'width':this.settings.width,
				'height':this.settings.height
			});
			this.posterItemMain.css({			//ul的样式
				'width':this.settings.width,
				'height':this.settings.height
			});
			var w=(this.settings.width-this.settings.posterWidth)/2
			this.nextBtn.css({			//右边按钮的样式
				'width':w,
				'height':this.settings.height,
				'zIndex':Math.ceil(this.posterItems.size()/2)
			});
			this.prevBtn.css({			//左边按钮的样式
				'width':w,
				'height':this.settings.height,
				'zIndex':Math.ceil(this.posterItems.size()/2)
			});
			this.posterFirstItem.css({		//第一帧的样式
				'width':this.settings.posterWidth,
				'height':this.settings.posterHeight,
				'top':0,
				'left': w,
				'zIndex':Math.floor(this.posterItems.size()/2)

			})
		}
	}

	$.fn.poster=function(mysettings){
		var posters=this;
		var _this_=Carousel;
		var settings=mysettings;
		posters.each(function(){
			return new  _this_($(this),settings)	
		})
	}


/*	Carousel.init=function(posters){			//定义一个函数专门处理页面多个旋转木马的节点
		var _this_=this  							//这个this代表Carsouel
		posters.each(function(){
			return new  _this_($(this))	//这里的this是posters
		})
	}*/

	window.Carousel=Carousel		//Carsouel的类是在闭包环境所以要把他放在window下可全局调用
})(jQuery)
