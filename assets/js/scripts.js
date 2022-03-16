!function ($) {

	'use strict';

	var ONYX_VERSION = '1.0';

	// Global Onyx object
	var Onyx = Onyx || {};

	// Gobal variables
	var mobileTest,
		sliderRotate,
		slide_interval;


	Onyx = {

	    version: ONYX_VERSION,

        // Define defaults values
        defaults: {
            debug: true,
		    mousewheel_event: 'mousewheel', // We're assigning the event name to variable because this might change between Chrome and Firefox
		    scroll_trigger_limit: 50,
		    scroll_trigger_limit_firefox: 3,
        },


	    /**
		 * Fire all functions
		 */
		init: function() {
			var self = this,
				obj;

			for (obj in self) {
				if ( self.hasOwnProperty(obj)) {
					var _method =  self[obj];
					if ( _method.selector !== undefined && _method.init !== undefined ) {
						if ( $(_method.selector).length > 0 ) {
							_method.init();
						}
					}
				}
			}

            // Detect if Firefox to change the mouse wheel event name
            if ( /Firefox/i.test(navigator.userAgent) ) {
                Onyx.defaults.mousewheel_event = 'DOMMouseScroll';
            }

		},


        /**
         * Function to print results in the console if the above debug is true
         */
        log: function() {
            if (Onyx.defaults.debug === true) {
                var argsArray = [],
                    printOut = 'console.log(args)';

                for ( var i = 0; i < arguments.length; i++ ) {
                    argsArray.push('args[' + i + ']');
                }

                printOut = new Function( 'args', printOut.replace( /args/, argsArray.join(',') ) );

                printOut(arguments);
            }
        },


	    /**
		 * Detect touch devices
		 */
		isTouchSupported: function() {
			var agent = navigator.userAgent.toLowerCase(),
				isChromeDesktop = (agent.indexOf('chrome') > -1 && ((agent.indexOf('windows') > -1) || (agent.indexOf('macintosh') > -1) || (agent.indexOf('linux') > -1)) && agent.indexOf('mobile') < 0 && agent.indexOf('android') < 0);
			return ('ontouchstart' in window && !isChromeDesktop);
		},


		/**
		 * Detect user's platform
		 */
		platformDetect: {
			selector: 'html',
			init: function() {
				var base = this,
					container = $(base.selector);

				if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
					mobileTest = true;
					container.addClass('mobile');
				} else {
					mobileTest = false;
					container.addClass('no-mobile');
				}
				
				var mozillaTest;
				if (/mozilla/.test(navigator.userAgent)) {
					mozillaTest = true;
				} else {
					mozillaTest = false;
				}

				var safariTest;
				if (/safari/.test(navigator.userAgent)) {
					safariTest = true;
				} else {
					safariTest = false;
				}
					
				// Detect touch devices	
				if (!('ontouchstart' in window)) {
					container.addClass('no-touch');
				}

			},
		},


        /**
         * Helpers functions
         */
        helpers: {
            selector: 'body',
            init: function(){
            	var base = this;

                // Add class to empty hrefs and remove #
                $('a[href="#"]').each( function() {
                    //$(this).attr('href', 'javascript: void (0)').addClass('disabled');
                    $(this).attr('href', 'javascript: void (0)');
                });

                // Print current year in footer
                var fullDate = new Date(),
                    fullYear = fullDate.getFullYear();

                // Even if there was a year in the container it will overwrite it
                $('.current-year').html(fullYear);


                /**
                 *	Extend jQuery to add easing function
                 */
                jQuery.extend( jQuery.easing, {
                    easeInOutQuart: function (x, t, b, c, d) {
                        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                        return -c/2 * ((t-=2)*t*t*t - 2) + b;
                    },
                    easeInOutElastic: function (x, t, b, c, d) {
                        var s=1.70158;var p=0;var a=c;
                        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                        if (a < Math.abs(c)) { a=c; var s=p/4; }
                        else var s = p/(2*Math.PI) * Math.asin (c/a);
                        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                    }
                });


                // Scroll down button
                $(".scroll-down, .hero-discover-more").on("click", function(e){

                    e.preventDefault();

                    var section = 0,
                        target = $(this).data("target");

                    if ( typeof target == typeof undefined || target == "" ) {
                    	target = $(this).parent("section").next();
                    }

                    section = $(target).offset().top;

                    $("html, body").animate({ scrollTop: section },1e3,"easeInOutQuart");

                });


				base.sizesParty();

				// Fire functions on resize event
				$(window).resize(function() {
					base.sizesParty();
				});


				/**
				 *	Run the functions that are specific for large screens
				 */
			    if ( $(window).outerWidth() > 992 ) {
					base.notOnMobiles();
				}

				// Fire functions on resize event
				$(window).resize(function() {
				    if ( $(window).outerWidth() > 992 ) {
						base.notOnMobiles();
					} else {
						base.notOnMobiles(true);
					}
				});

            },
			sizesParty:function(){

			    // Check if we want to show discover more button on hero section
			    if ( $('.home-hero').length && $('.home-hero').hasClass('show-discover-more') && $('.home-hero').next().length > 0 ) {
			    	$('.hero-discover-more').show();
			    }

			},
			notOnMobiles:function(reset){

				/**
				 *	Define a reset procedure
				 */
				if ( !reset ) {
				    // Set .body-content margin left
				    /*setTimeout(function() {
						$('.body-content').css('marginLeft',  parseInt( $('.side-menu').outerWidth(), 0));
					}, 300);*/

				    // Set .body-content margin left
					var windowHeight    = $(window).outerHeight(),
						logoHeight      = parseInt( $('.side-menu .logo').outerHeight(), 0),
						copyrightHeight = parseInt( $('.side-menu .copyright').outerHeight(), 0),
						navMarginTop    = parseInt( $('.side-menu nav').css('marginTop'), 0),
						navMarginBottom = parseInt( $('.side-menu nav').css('marginBottom'), 0),
						minusTotals     = logoHeight + copyrightHeight + navMarginTop + navMarginBottom;

				    $('.side-menu nav').height( windowHeight - minusTotals );
				} else {
				    // Set .body-content margin left
					//$('.body-content').css('marginLeft', 'auto');

				    $('.side-menu nav').height('auto');
				}
			}
        },



		/**
		 * Responsive menu
		 */
		mobileMenu: {
			selector: '.responsive-nav-toggle-container',
			init: function(){
				var base = this,
					container = $(base.selector);


			    if ( $(window).outerWidth() <= 992 ) {
					//this.buildUiActions(container);
					base.prepareUI(container);
				}


				// Fire functions on resize event
				$(window).resize(function() {
				    if ( $(window).outerWidth() <= 992 ) {
						base.prepareUI(container);
					} else {
						base.prepareUI(container, true);
					}
				});

			},
			prepareUI:function(container, reset){
				var mainNav = $('.side-menu nav.main-nav').clone(),
					copyright = $('.copyright').clone(),
					topMisc = $('.top-misc').clone(),
					timer;

				/**
				 *	Define a reset procedure
				 */
				if ( !reset && !$('.mobile-menu-container').length ) {

					// Create a new container for our content
					$('.wrapper').prepend('<div class="mobile-menu-container"></div>');
					$('.mobile-menu-container').append(topMisc, mainNav, copyright);


					// Remove socials to another place
					$('.mobile-menu-container .top-misc .socials').insertBefore($('.mobile-menu-container .copyright'));


					// Position our responsive menu toggle to the center of the logo
					container.css('top', parseInt( $('div.logo').outerHeight() / 2 ,10 ));


					// Set padding for mobile menu container to protect logo area
					$('.mobile-menu-container').css('paddingTop', parseInt( $('div.logo').outerHeight(),10 ));


					// Add class to define open from close
					container.addClass("open");


					// Prepare our menu elements' animation
					Onyx.mobileMenu.animateOurMenu(container);


					/* Responsive menu */
					container.not(".disabled").on("click", function() {

						if ( container.hasClass("open") && ! container.hasClass("disabled") ) {
							Onyx.mobileMenu.openMobileMenu(container, timer);
						} else if ( container.hasClass("close") && ! container.hasClass("disabled") ) {
							Onyx.mobileMenu.closeMobileMenu(container, timer);
						}
						
					});
				} else {
					$('.mobile-menu-container').remove();


					// Position our responsive menu toggle to the center of the logo
					container.css('top', parseInt( $('div.logo').outerHeight() / 2 ,10 ));
				}
			},
			openMobileMenu: function(container, timer){

				container.addClass("disabled");

				if ( container.hasClass("open") ) {

					container.removeClass("open");
					container.addClass("close");

					$(".menu-container").css("display", "block");

					timer = setTimeout(function() {
						$("body").addClass("menu-is-open");
					}, 300);

					$(".mobile-menu-container").slideDown(1100, "easeInOutQuart", function(){
						container.removeClass("disabled");
					});
				}

			},
			closeMobileMenu: function(container, timer){

				container.addClass("disabled");

				if ( container.hasClass("close") ) {

					clearTimeout(timer);

					container.removeClass("close");
					container.addClass("open");

					$(".mobile-menu-container").slideUp(1100, "easeInOutQuart", function(){
						container.removeClass("disabled");

						$("body").removeClass("menu-is-open");

						// Close opened .sub-menu
						$('.mobile-menu-container nav.main-nav .active .sub-menu').stop(0,0).slideUp(500,function(){
							$('.mobile-menu-container nav.main-nav .active .sub-menu').css('height','auto');
							$('.mobile-menu-container nav.main-nav .active').removeClass('active');
						});

						// Open submenu for current item
						$('.mobile-menu-container nav.main-nav .current-menu-item.menu-item-has-children .sub-menu').stop(0,0).slideDown(500,function(){
							$('.mobile-menu-container nav.main-nav .current-menu-item.menu-item-has-children .sub-menu').css('height','auto');
							$('.mobile-menu-container .current-menu-item.menu-item-has-children').addClass('active');
						});
					});
				}
			},
			animateOurMenu: function(container){
				var allLi = $('.mobile-menu-container .main-nav > ul > li'),
					delayIterator = 0;

				/**
				 *	Start the loop
				 */
				for (var i = allLi.length - 1; i >= 0; i--) {

					var self = $(allLi[i]),
					animationDelay = delayIterator + "s";

					self.css({
						'-webkit-transition-delay':  animationDelay,
						'-moz-transition-delay':     animationDelay,
						'transition-delay':          animationDelay
					});

					delayIterator += .15;
				}
				
			}
		},


		/**
		 * Submenu functions
		 */
		submenus: {
			selector: '.menu-item-has-children',
			init: function(){

				this.bindUiActions();

			},
			bindUiActions:function(){
				var self = this;

				// Open submenu for current item
				$('nav.main-nav .current-menu-item.menu-item-has-children .sub-menu').stop(0,0).slideDown(500,function(){
					$('nav.main-nav .current-menu-item.menu-item-has-children .sub-menu').css('height','auto');
				});
				$('nav.main-nav .current-menu-item.menu-item-has-children').addClass('active');

				if ( $('html').hasClass('mobile') || $(window).outerWidth() <= 992 ) {

					$('nav.main-nav .menu-item-has-children').on( 'click', function() {
						var currentLi = $(this),
							submenu = currentLi.children('.sub-menu');

						// Detect if another .sub-menu is open
						if ( $('nav.main-nav .active').length ) {

							// Close opened .sub-menu
							$('nav.main-nav .active .sub-menu').stop(0,0).slideUp(500,function(){
								$('nav.main-nav .active .sub-menu').css('height','auto');
							});

							$('nav.main-nav .active').removeClass('active');

							// Open .sub-menu
							currentLi.addClass('active');
							submenu.stop(0,0).slideDown(500,function(){
								submenu.css('height','auto');
							});
							
						} else {
							// Open .sub-menu
							currentLi.addClass('active');
							submenu.stop(0,0).slideDown(500,function(){
								submenu.css('height','auto');
							});
						}
					});
					
				} else {

					var timer;
					$('.menu-item-has-children:not(.current-menu-item)').on( 'mouseenter', function() {
						var currentLi = $(this),
							submenu = currentLi.children('.sub-menu');

						timer = setTimeout(function () {

							currentLi.addClass('active')
							submenu.stop(0,0).slideDown(500,function(){
								submenu.css('height','auto');
							});

						}, 500);

					}).on( 'mouseleave', function() {
							clearTimeout(timer);
							var currentLi = $(this),
								submenu = currentLi.children('.sub-menu');

						// Don't close the .sub-menu if it has .current-menu-item child, it shall stay opened
						if ( currentLi.find('.current-menu-item').length == 0 ) {
							setTimeout(function () {

								currentLi.removeClass('active');
								submenu.stop(0,0).slideUp(500,function(){
									submenu.css('height','auto');
								});

							}, 500);
						}

					});
				}
			}
		},

		/*
		 * Onyx horizontal hero zoom slider
		 */
		zoomSlider: {
			selector: '.onyx-zoom-slider',
			init: function(){
				var base = this,
					container = base.selector;

				if($(container).length > 0){
					Onyx.zoomSlider.sliderCalcs(container);
					Onyx.zoomSlider.sliderTitles(container);
					$(window).resize(function() {
						Onyx.zoomSlider.sliderTitles(container);
						Onyx.zoomSlider.sliderCalcs(container);						
					});
				}

				$(container).each(function(){

					var thisContainer = $(this),
						$slidesLength = $(this).find('.hero-slide').length;


					/**
					 * Autorotate
					 */
					if(thisContainer.attr('data-autorotate') > 0 && thisContainer.attr('data-autorotate') !== 'false') {
						Onyx.zoomSlider.sliderResetRotate(thisContainer);
					}


					/**
					 * Next / Prev
					 */
					if( typeof thisContainer.attr('data-nav') !== typeof undefined && thisContainer.attr('data-nav') !== 'true' ) {
						thisContainer.find('.hero-slider-nav').hide();
					}

					$(this).find('.hero-slider-nav .next').click(function(){
						var clickedBtn = $(this);
						base.goNext(thisContainer, clickedBtn, $slidesLength);
					});

					$(this).find('.hero-slider-nav .prev').click(function(){
						var clickedBtn = $(this);
						base.goPrev(thisContainer, clickedBtn);
					});


					/**
					 * Scroll
					 */
					if( typeof thisContainer.attr('data-activate-scrolling') !== typeof undefined && thisContainer.attr('data-activate-scrolling') == 'true' ) {
						//var timer;
						$('.onyx-zoom-slider').on( Onyx.defaults.mousewheel_event + '.Onyx', function(e) {

							// Awesome solution for multiple scroll actions
							//clearTimeout(timer);
							//timer = setTimeout(function() {

								// Detect if the scroll event is a Chrome or Firefox event
								if ( Onyx.defaults.mousewheel_event == 'DOMMouseScroll' ) {

								    // Detect if the scroll dimension is up or down
								    if ( e.detail >= Onyx.defaults.scroll_trigger_limit_firefox ) {
								        Onyx.log('Scrolling down');
										$('.hero-slider-nav .next').click();
								    } else if ( e.detail <= -Onyx.defaults.scroll_trigger_limit_firefox ) {
								        Onyx.log('Scrolling up');
										$('.hero-slider-nav .prev').click();
								    }

								} else {

								    // Detect if the scroll dimension is up or down
								    if ( e.originalEvent.wheelDelta > Onyx.defaults.scroll_trigger_limit ) {
								        Onyx.log('Scrolling up');
										$('.hero-slider-nav .prev').click();
								    } else if ( e.originalEvent.wheelDelta < -Onyx.defaults.scroll_trigger_limit ) {
								        Onyx.log('Scrolling down');
										$('.hero-slider-nav .next').click();
								    }

								}

								if ( e.target.id == 'el' ) return;

								e.preventDefault();
								e.stopPropagation();

							//}, 35);

						});	
					}


					/**
					 * Enable navigating with keyboard
					 */
					if( typeof thisContainer.attr('data-activate-keypress') !== typeof undefined && thisContainer.attr('data-activate-keypress') == 'true' ) {
				        (document.onkeydown = function(e) {

				            /*
				                Space      => 32
				                Up Arrow   => 38
				                Down Arrow => 40
				                Page Up    => 33
				                Page Down  => 34

				            */
				            if ( $.inArray(e.keyCode, [38, 33, 40, 34]) != -1 ) {

								switch (e.keyCode) {
								    case 38:
								    case 33:
								        Onyx.log('Going up');
										$('.hero-slider-nav .prev').click();
								        break;
								    case 40:
								    case 34:
								        Onyx.log('Going down');
										$('.hero-slider-nav .next').click();
								        break;
								}

				            }

				        });
				    }


					/**
					 * Pagination
					 */
					if( typeof thisContainer.attr('data-pagination') !== typeof undefined && thisContainer.attr('data-pagination') == 'true' ) {
						var slideCount = 1;
						$(this).prepend('<ul class="hero-slider-pagination"></ul>');
						for(var i=0; i < $slidesLength; i++) {
							if(i == 0) {
								$(this).find('.hero-slider-pagination').append(`<li class="active"><a href="#"><span class="slide-title">Slide 0${slideCount}</span><span class="bullet"></span></a></li>`);
							} else {
								$(this).find('.hero-slider-pagination').append(`<li class=""><a href="#"><span class="slide-title">Slide 0${slideCount}</span><span class="bullet"></span></a></li>`);
							}
							slideCount++;
						}
					}

					var dotIndex = 1;

					$(this).find('.hero-slider-pagination > li').click(function(){

						if($(this).hasClass('active')) return;

						//thres
						var that = $(this);
						if(!that.parent().hasClass('timeout')) {
							setTimeout(function(){
								that.parent().removeClass('timeout');
							},1150);
						}

						if($(this).parent().hasClass('timeout')) return;
						$(this).parent().addClass('timeout');

						Onyx.zoomSlider.sliderResetRotate(that.parents(container));

						//switch logic
						$(this).parent().find('li.active').removeClass('active');
						$(this).addClass('active');

						dotIndex = $(this).index() + 1;

						var current = $(this).parents(container).find('.hero-slide.current');
						var sliderInstance = $(this).parents(container);

						var prevIndex = current.index() + 1;

						sliderInstance.find('.hero-slide').removeClass('next').removeClass('prev');

						sliderInstance.find('.hero-slide').each(function(i){
							if(i < dotIndex-1)
								$(this).addClass('prev');
							else
								$(this).addClass('next');
						});


						/**
						 * Go to prev
						 */
						if(prevIndex > dotIndex) {
							sliderInstance.find('.hero-slide').eq(dotIndex-1).addClass('no-trans').addClass('prev').removeClass('next');
							setTimeout(function(){
								sliderInstance.find('.hero-slide').eq(dotIndex-1).removeClass('no-trans').removeClass('next').removeClass('prev').addClass('current');
								current.removeClass('current').addClass('next');
							},30);
						
						} 


						/**
						 * Go to next
						 */
						else {
							sliderInstance.find('.hero-slide').eq(dotIndex-1).addClass('no-trans').addClass('next').removeClass('prev');
							setTimeout(function(){
								sliderInstance.find('.hero-slide').eq(dotIndex-1).removeClass('no-trans').removeClass('next').removeClass('prev').addClass('current');
								current.removeClass('current').addClass('prev');
							},30);

						}
						
					});

				});

			},
			sliderTitles: function(container){
				$(container).each(function(){
					$(this).find('.hero-slide').each(function(i){

						$(this).find('.content .title > span > span.inner').unwrap();

						$(this).find('.content .title > span').each(function(){
							var spantext = $(this).text();
		   					 $(this).replaceWith(spantext);
						});

						var spanInserted = $(this).find('.content .title').html().split(' ').join(' </span> <span>');

						var wrapped = ('<span>').concat(spanInserted, '</span>');

						$(this).find('.content .title').html(wrapped);
						var refPos = $(this).find('.content .title > span:first-child').position().top;
						var newPos;

						$(this).find('.content .title > span').each(function(index) {
							if($(this).text().trim().length > 0) {

							    newPos = $(this).position().top   
			
							    if (index == 0){
							       return;
							    }
							    if (newPos == refPos){
							        $(this).prepend($(this).prev().text());
							        $(this).prev().remove();
							    } 
							    refPos = newPos;
							} else {
								//remove empty space spans
								$(this).remove();
							}
						});

						$(this).find('.content .title > span').wrapInner('<span class="inner" />');

					});
				});
			},
			sliderCalcs: function(container) {
				$(container).each(function(){
					if($(this).parents('.first-section').length > 0) {
						$(this).css('height',$(window).height() - $(this).offset().top);
					} else {
						$(this).css('height',$(window).height());
					}
				});
			},	
			sliderRotate: function(slider){
				var slideLength = slider.find('.hero-slider-pagination > li').length;
				var currentSlide = slider.find('.hero-slider-pagination > li.active').index();
				if( currentSlide+1 == slideLength) {
					slider.find('.hero-slider-pagination > li:first-child').click();
				} else {
					slider.find('.hero-slider-pagination > li.active').next('li').click();
				}
			},
			sliderResetRotate: function(slider){
				clearInterval(sliderRotate);

				// Reinit autorotate
				if(slider.attr('data-autorotate').length > 0) {
					slide_interval = (parseInt(slider.attr('data-autorotate')) < 100) ? 7000 : parseInt(slider.attr('data-autorotate'));
					sliderRotate = setInterval(function(){
						Onyx.zoomSlider.sliderRotate(slider)
					}, slide_interval);
				}
			},
			goPrev: function(thisContainer, clickedBtn = true){

				if ( clickedBtn ) {
					if(!clickedBtn.parent().hasClass('timeout')) {
						setTimeout(function(){
							clickedBtn.parent().removeClass('timeout');
						},1150);
					}

					if(clickedBtn.parent().hasClass('timeout')) return false;
					clickedBtn.parent().addClass('timeout');
				}
				
				Onyx.zoomSlider.sliderResetRotate(thisContainer);

				//switch logic
				var current = thisContainer.find('.hero-slide.current');
				var sliderInstance = thisContainer;

				
				sliderInstance.find('.hero-slide').removeClass('next').removeClass('prev');
				sliderInstance.find('.hero-slide').each(function(i){

					if(i < current.index() || current.index() == 0)
						$(this).addClass('prev');
					else
						$(this).addClass('next');
				});

				if(current.index() == 0)
					sliderInstance.find('.hero-slide:last-child').addClass('no-trans');

				setTimeout(function(){

					if(current.index() == 0) {
						sliderInstance.find('.hero-slide:last-child').removeClass('no-trans').removeClass('next').removeClass('prev').addClass('current');
						sliderInstance.find('.hero-slide:first-child').removeClass('next').removeClass('prev').removeClass('current').addClass('next');
					} else {
						current.prev('.hero-slide').removeClass('next').removeClass('prev').addClass('current');
						current.removeClass('current').addClass('next');
					}


					/**
					 * Update dot nav
					 */
					if(sliderInstance.find('.hero-slider-pagination').length > 0) {
						sliderInstance.find('.hero-slider-pagination li.active').removeClass('active');
						sliderInstance.find('.hero-slider-pagination li:nth-child('+ (sliderInstance.find('.hero-slide.current').index() + 1) +')').addClass('active');
					}

				},30);

				return false;
			},
			goNext: function(thisContainer, clickedBtn = true, $slidesLength){
				if ( clickedBtn ) {
					if(!clickedBtn.parent().hasClass('timeout')) {
						setTimeout(function(){
							clickedBtn.parent().removeClass('timeout');
						},1150);
					}

					if(clickedBtn.parent().hasClass('timeout')) return false;
					clickedBtn.parent().addClass('timeout');
				}
				
				//switch logic
				Onyx.zoomSlider.sliderResetRotate(thisContainer);
				
				var current = thisContainer.find('.hero-slide.current');
				var sliderInstance = thisContainer;

				sliderInstance.find('.hero-slide').removeClass('next').removeClass('prev');
				sliderInstance.find('.hero-slide').each(function(i){

					if(i < current.index()+1 && current.index()+1 < $slidesLength)
						$(this).addClass('prev');
					else
						$(this).addClass('next');
				});

				if(current.index()+1 == $slidesLength) {
					sliderInstance.find('.hero-slide:first-child').addClass('no-trans');
				}

				setTimeout(function(){

					if(current.index()+1 == $slidesLength) {
						sliderInstance.find('.hero-slide:first-child').removeClass('no-trans').removeClass('next').removeClass('prev').addClass('current');
						sliderInstance.find('.hero-slide:last-child').removeClass('next').removeClass('current').addClass('prev');
					} else {
						current.next('.hero-slide').removeClass('next').removeClass('prev').addClass('current');
						current.removeClass('current').addClass('prev');
					}


					/**
					 * Update dot nav
					 */
					if(sliderInstance.find('.hero-slider-pagination').length > 0) {
						sliderInstance.find('.hero-slider-pagination li.active').removeClass('active');
						sliderInstance.find('.hero-slider-pagination li:nth-child('+ (sliderInstance.find('.hero-slide.current').index() + 1) +')').addClass('active');
					}

				},30);

				return false;
			}

		},


		/**
		 * Rating
		 */
		ratingFunctions: {
			selector: '.onyx-rating-holder',
			init: function(){
				var base = this,
					container = base.selector;

	            $(container).each(function() {
	            	// Separate between user interaction rating or just showing rating result
					var ratedAttr = $(this).attr('data-rated');

	            	if ( $(this).find('input.onyx-rating-hidden-input').length > 0 && typeof ratedAttr == typeof undefined ) {
		                base.setCriteriaCommands($(this));
		            } else {
		                base.setRateValue($(this), ratedAttr);
		            }
	            });

			},
			setCriteriaCommands: function(criteriaHolder){
				var emptyStarClass = '', // icon-star-linear
	                fullStarClass = 'passed';

				criteriaHolder.find('.onyx-star')
				.mouseenter(function () {
				    $(this).add($(this).prevAll()).removeClass(emptyStarClass).addClass(fullStarClass);
				    $(this).nextAll().removeClass(fullStarClass).addClass(emptyStarClass);
				})
				.click(function() {
				    criteriaHolder.find('.onyx-rating-hidden-input').val($(this).index()+1);
				});

				criteriaHolder.mouseleave(function() {
				    var inputValue = criteriaHolder.find('.onyx-rating-hidden-input').val();

				    inputValue = inputValue === "" ? 0 : parseInt(inputValue,10);

				    criteriaHolder.find('.onyx-star').each(function(i) {
				        $(this).removeClass((i < inputValue) ? emptyStarClass : fullStarClass).addClass((i < inputValue) ? fullStarClass : emptyStarClass);
				    });

				}).trigger('mouseleave');
			},
			setRateValue: function(criteriaHolder, ratedAttr){
				for (var i = 0; i < ratedAttr; i++) {
					criteriaHolder.find('.onyx-star').eq(i).addClass('passed')
				}
			}
		},


		/**
		 * Date countdown
		 */
		dateCountDown: {
			selector: '.offer-counter',
			init: function(){
				var base = this,
					container = base.selector;

				const second = 1000,
					  minute = second * 60,
					  hour = minute * 60,
					  day = hour * 24;

				//let countDown = new Date('Sep 30, 2018 00:00:00').getTime();
				let countDown = new Date( $(container).parents('.deal-of-the-day').attr('data-end-date') ).getTime(),

				x = setInterval(function() {

					let now = new Date().getTime(),
					distance = countDown - now;

					$(container).find('.days > .number').html( Math.floor(distance / (day)) ),
					$(container).find('.hours > .number').html( Math.floor((distance % (day)) / (hour)) ),
					$(container).find('.minutes > .number').html( Math.floor((distance % (hour)) / (minute)) ),
					$(container).find('.seconds > .number').html( Math.floor((distance % (minute)) / second) );

					// Do something later when date is reached
					if (distance < 0) {
						clearInterval(x);
						console.log("Offer has ended");
						$(container).parents('.deal-of-the-day').addClass('offer-has-ended');

						// Reset counters to 0
						$(container).find('.days > .number').html( 0 ),
						$(container).find('.hours > .number').html( 0 ),
						$(container).find('.minutes > .number').html( 0 ),
						$(container).find('.seconds > .number').html( 0 );
					}

				}, second)

			}
		},


		/**
		 * Multi image product loop
		 */
		multiImageProductLoop: {
			selector: '.product-container .multi-image',
			init: function(){
				var base = this,
					container = base.selector;

				var owl = $(container).owlCarousel({
					items: 1,
					autoplay: true,
					autoplayTimeout: 1500,
					autoplayHoverPause: true,
					//lazyLoad: true,
					loop: true,
					nav: true,
					margin: 0,
					dots: true,
					mouseDrag: true,
					touchDrag: true,
					dotsContainer: $(container).find('.slider-pagination')
				});


				/**
				 *	Create dots according to slides count
				 */
				// Prevent conflicting
				$(container).each( function(){
					for(let i = 0, length1 = $(this).find('.owl-item:not(.cloned)').length; i < length1; i++){
						// Create dots
						$(this).parents('.product-container').find('.slider-pagination').prepend('<a href="#"></a>');
					}
					$(this).parents('.product-container').find('.slider-pagination > *').eq(0).addClass('active');

					$(this).parents('.product-container').find('.slider-pagination > *').on('click', function(e){
						e.preventDefault();
						owl.trigger('to.owl.carousel', [$(this).index(), 300]);
					});
					$(this).parents('.product-container').find('.slider-pagination > *').on( 'mouseenter', function() {
						owl.trigger('stop.owl.autoplay');
					}).on( 'mouseleave', function() {
						owl.trigger('play.owl.autoplay');
					});
				});

				// Add .active to current dot
				owl.on('changed.owl.carousel', function(property) {
						var current = property.item.index;

						$(this).parents('.product-container').find('.slider-pagination > *.active').removeClass('active');
						$(this).parents('.product-container').find('.slider-pagination > *').eq(current-2).addClass('active');
				});

			}
		},


		/**
		 * Logos slider
		 */
		logosSlider: {
			selector: '.logos-slider-container',
			init: function(){
				var base = this,
					container = base.selector;

				var owl = $(container).find('.owl-carousel').owlCarousel({
					items: 4,
					autoplay: true,
					autoplayTimeout: 5000,
					autoplayHoverPause: true,
					loop: true,
					nav: false,
					margin: 0,
					dots: true,
					mouseDrag: true,
					touchDrag: true,
					dotsContainer: $(container).find('.slider-pagination')
				});

			}
		},


		/**
		 * Footer Instagram Feed
		 */
		footerInstagramFeed: {
			selector: 'footer .insta-imgs',
			init: function(){
				var base = this,
					container = base.selector;

				base.setGridLayout(container);
			},
			setGridLayout: function(container){
				// init Masonry
				var $grid = $(container).masonry({
					columnWidth: '.grid-sizer',
					itemSelector: '.grid-item',
					percentPosition: true,
					gutter: 0
				});
				// layout Masonry after each image loads
				$grid.imagesLoaded().progress( function() {
					$grid.masonry();
				});
			}
		},


		/**
		 * Instagram Feed Section
		 */
		instagramFeed: {
			selector: '.instagram-feed',
			init: function(){
				var base = this,
					container = base.selector;

				base.setGridLayout(container);
			},
			setGridLayout: function(container){
				// Init Isotope
				/*$(container).masonry({
					itemSelector: '[class*="col-lg"]',
					percentPosition: true,
					gutter: 0
				});*/

				// init Masonry
				var $grid = $(container).masonry({
					columnWidth: '.grid-sizer',
					itemSelector: '.grid-item',
					percentPosition: true,
					gutter: 0
				});
				// layout Masonry after each image loads
				$grid.imagesLoaded().progress( function() {
					$grid.masonry();
				});

			}
		}

	}
	
	$(document).ready(function() {
		Onyx.init();
	});


}(jQuery);

/************************************* 
		Slider TESTIMONIALS 
**************************************/

// Get array for items
const slide_items = Array.from(document.querySelectorAll('#slider-img>div'));
const slide_text = Array.from(document.querySelectorAll('#slide_text>div'));

// Number of Slider
var slider_count = slide_items.length;

//Set Curent Slide
var curent_slide = 1;


//Buuton Next & Prev
var next_button = document.querySelector('#next');
var prev_button = document.querySelector('#prev');

//Handel Click of next & prev Buuto
next_button.addEventListener('click' , nextSlider);
prev_button.addEventListener('click' , prevSlider);

//Tarrget The Checker
checker();
//Function NextSlider
function nextSlider(){
    if(next_button.classList.contains('disabal')){
        return false;

    } else{
        curent_slide++;
        checker();
    };
};
// Slider click img
for(let i= 0; i< slider_count; i++){
    slide_items[i].onclick =function pov(){
        curent_slide = parseInt(this.getAttribute('data-index'));
        checker();
    };
}
//Function PrevSlider
function prevSlider(){
    if(prev_button.classList.contains('disabal')){
        return false;

    } else{
        curent_slide--;
        checker();
    };
};

function dataImg(){
    var img = Array.from(document.querySelectorAll('.person-img a img'));
    // Get Data Imags
    var data_img = document.querySelector('#data_img h4');
    var data_discribtion = document.querySelector('#data_img p');
    var name_img = img[curent_slide -1].alt;
    var discrbtion_img = img[curent_slide -1].getAttribute('data-dis');
    data_img.innerHTML= `${name_img}`;
    data_discribtion.innerHTML= `${discrbtion_img}`;
};
//Function The Checker 
function checker(){
    removeClass();
    slide_items[curent_slide -1].classList.add('select-img');
	slide_text[curent_slide -1].classList.add('active');
    dataImg();
    // Check first or last
    if(curent_slide == 1){
        prev_button.classList.add('disabal');
    } else{
        prev_button.classList.remove('disabal');
    };

    if(curent_slide == slider_count){
        next_button.classList.add('disabal');
    } else{
        next_button.classList.remove('disabal');
    };
};
// Remove Class 
function removeClass(){
    slide_items.forEach(function(img){
        img.classList.remove('select-img');
    });
	slide_text.forEach(function(p){
        p.classList.remove('active');
    });
}

