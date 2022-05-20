	jQuery( document ).ready(function() {

		//slider bg img portada
		var imgArr = new Array(
			'/wp-content/themes/fincasugalde/images/inmobiliaria-donostia-1.jpg',
			'/wp-content/themes/fincasugalde/images/inmobiliaria-donostia-2.jpg',
			'/wp-content/themes/fincasugalde/images/inmobiliaria-donostia-3.jpg',
			'/wp-content/themes/fincasugalde/images/inmobiliaria-donostia-4.jpg',
			'/wp-content/themes/fincasugalde/images/inmobiliaria-donostia-5.jpg',
			'/wp-content/themes/fincasugalde/images/inmobiliaria-donostia-6.jpg'
		);
		var imgCount = imgArr.length - 1;
		
		var preloadArr = new Array();
		var i;
		
		// preload images
		for(i=0; i < imgArr.length; i++){
			preloadArr[i] = new Image();
			preloadArr[i].src = imgArr[i];
		}
		
		/*
		var currImg = 0;

		jQuery('.galeria-portada').attr('src',preloadArr[currImg%preloadArr.length].src);
		
		var intID = setInterval(changeImg, 6000);
		
		function changeImg(){
			currImg++;
			jQuery('.galeria-portada').animate({opacity: 0}, 2000, function(){
				jQuery(this).attr('src',preloadArr[currImg%preloadArr.length].src);
			}).animate({opacity: 1}, 800);
		}
		function aleatorio() {
			return Math.round(Math.random()*imgCount);
		}
		*/

		var currImg = aleatorio() + 1;
		jQuery('.slide_bg_sup').css('background-image','url(' + preloadArr[currImg%preloadArr.length].src +')');
		jQuery('.slide_bg').css('background-image','url(' + preloadArr[currImg%preloadArr.length].src +')');
		
		var intID = setInterval(changeImg, 9000);
		
		function changeImg(){
			currImg++;
			jQuery('.slide_bg').css('background-image','url(' + preloadArr[currImg%preloadArr.length].src +')');
			jQuery('.slide_bg_sup').animate({opacity: 0}, 2000, function(){
				jQuery(this).css('background-image','url(' + preloadArr[currImg%preloadArr.length].src +')');
			}).animate({opacity: 1}, 500);
		}
		function aleatorio() {
			return Math.round(Math.random()*imgCount);
		}



	});
