	jQuery( document ).ready(function() {

		//slider bg img portada
		var imgArr = new Array(
			'/wp-content/themes/fincasugalde/images/nosotros-6.jpg',
			'/wp-content/themes/fincasugalde/images/nosotros-2.jpg',
			'/wp-content/themes/fincasugalde/images/nosotros-3.jpg',
			'/wp-content/themes/fincasugalde/images/nosotros-7.jpg',
			'/wp-content/themes/fincasugalde/images/nosotros-5.jpg'
		);
		var imgCount = imgArr.length - 1;
		
		var preloadArr = new Array();
		var i;
		
		// preload images
		for(i=0; i < imgArr.length; i++){
			preloadArr[i] = new Image();
			preloadArr[i].src = imgArr[i];
		}
		
		var currImg = 0;

		jQuery('.galeria-nosotros').attr('src',preloadArr[currImg%preloadArr.length].src);
		
		var intID = setInterval(changeImg, 6000);
		
		function changeImg(){
			currImg++;
			jQuery('.galeria-nosotros').animate({opacity: 0}, 2000, function(){
				jQuery(this).attr('src',preloadArr[currImg%preloadArr.length].src);
			}).animate({opacity: 1}, 800);
		}
		function aleatorio() {
			return Math.round(Math.random()*imgCount);
		}

	});
