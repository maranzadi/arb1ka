// Masonry para fotos de Ficha
jQuery("body").addClass( "loading" );
//jQuery(".cargando").addClass( "on" );
jQuery('.grid').imagesLoaded( function() {

	jQuery('.grid').masonry({
	  // set itemSelector so .grid-sizer is not used in layout
	  itemSelector: '.grid-item',
	  // use element for option
	  columnWidth: '.grid-sizer',
	  percentPosition: true
})
//jQuery(".cargando").removeClass( "on" );
jQuery("body").removeClass( "loading" );

});
