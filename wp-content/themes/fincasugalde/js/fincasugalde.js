jQuery(document).ready(function(){
});

jQuery( ".menu-toggle" ).click(function( event ) {
  jQuery(".menu-movil").toggleClass( "on" );
});

// Controles sobre el mapa de Contacto: INICIO
jQuery('.maps iframe').css("pointer-events", "none");
jQuery('.maps').click(function () {
    jQuery('.maps iframe').css("pointer-events", "auto");
});

jQuery( ".maps" ).mouseleave(function() {
  jQuery('.maps iframe').css("pointer-events", "none"); 
});
// Controles sobre el mapa de Contacto: FIN
