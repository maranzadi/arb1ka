// Pondremos aquí los JS que necesitemos para Exin 2017
var rutaCodigo='/wp-content/themes/fincasugalde/assets/';

jQuery( document ).ready(function() {

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// EVENTOS AL CARGAR LAS PÁGINAS 
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if (jQuery("body").hasClass("page-template-page-portada"))
	{
		true;
	}
	else if (jQuery("body").hasClass("page-template-page-inmuebles"))
	{
		jQuery(".cargando").addClass( "on" );
		
		// Valores
		var valores={tipo:GetQueryStringParams('tipo'),
			operacion:GetQueryStringParams('operacion'),
			localidad:GetQueryStringParams('localidad'),
			zonas:GetQueryStringParams('zonas'),
			habitaciones:(typeof GetQueryStringParams('habitaciones')!="undefined") ? GetQueryStringParams('habitaciones') : 1,
			//banos:(typeof GetQueryStringParams('banos')!="undefined") ? GetQueryStringParams('banos') : 1,
			banos:(typeof GetQueryStringParams('banos')!="undefined") ? GetQueryStringParams('banos') : 0,
			metrosMin:(typeof GetQueryStringParams('metrosMin')!="undefined") ? GetQueryStringParams('metrosMin') : 0,
			metrosMax:(typeof GetQueryStringParams('metrosMax')!="undefined") ? GetQueryStringParams('metrosMax') : 300,
			precioMin:(typeof GetQueryStringParams('precioMin')!="undefined") ? GetQueryStringParams('precioMin') : 0,
			precioMax:(typeof GetQueryStringParams('precioMax')!="undefined") ? GetQueryStringParams('precioMax') : GetQueryStringParams('operacion')=='Venta' ? 3000000 : 3000,
			orden:(typeof GetQueryStringParams('orden')!="undefined") ? decodeURIComponent(GetQueryStringParams('orden')) : 'precioVenta DESC',
			};
		// Consulta SQL vía AJAX
		jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {

			jQuery( "#listado" ).html(response['html']);

			jQuery(".filter-zona").removeClass( "on" );
			if (response['zonas'].length>0)
			{
				var listaZonas = response['zonas'].split(",");
				var cuantasZonas=listaZonas.length;
				for (x=0;x<cuantasZonas;x++)
				{
					jQuery("#filter-zona-"+listaZonas[x]).addClass( "on" );
				}
			}

			// Muestra resultados y actualizo valores
			actualizaStatus(response);
			if (cuantasZonas>0)
				jQuery("#chivatoZonas").html('<span class="badge">'+cuantasZonas+'</span>');
			else
				jQuery("#chivatoZonas").html('');
		
			}});

			// METROS 
			jQuery('.rango-metros').noUiSlider({
				connect: true,
				behaviour: 'tap-drag',
				step: 10,
				start: [ 0, 300 ],
				format: wNumb({
					mark: ',',
					decimals: 0
				}),
				range: {
					'min': [ 0 ],
					'max': [ 300 ]
				}
			});
			jQuery('.rango-metros').Link('lower').to(jQuery('#filter-metrosMin-valor'));
			jQuery('.rango-metros').Link('upper').to(jQuery('#filter-metrosMax-valor'));
			jQuery(".rango-metros").on({
				slide: function(){
					var texto;
					texto = jQuery('#filter-metrosMin-valor').html() + ' m²';
					jQuery('.filter-metros-min').text(texto);
		
					if( jQuery('#filter-metrosMax-valor').html()=='' || jQuery('#filter-metrosMax-valor').html()==300 ){
						texto = '+300 m²';
					}
					else{
						texto = jQuery('#filter-metrosMax-valor').html() + ' m²';
					}
					jQuery('.filter-metros-max').text(texto);
				},
				set: function(){
					//
				},
				change: function(){
					
				
					jQuery(".cargando").addClass( "on" );
					
					// Extraigo Metros pulsados
					var metrosMin=jQuery('#filter-metrosMin-valor').html();
					var metrosMax=jQuery('#filter-metrosMax-valor').html();
				
					// Valores
					var valores={tipo:GetQueryStringParams('tipo'),
						operacion:GetQueryStringParams('operacion'),
						localidad:GetQueryStringParams('localidad'),
						zonas:GetQueryStringParams('zonas'),
						habitaciones:GetQueryStringParams('habitaciones'),
						banos:GetQueryStringParams('banos'),
						metrosMin:metrosMin,
						metrosMax:metrosMax,
						precioMin:GetQueryStringParams('precioMin'),
						precioMax:GetQueryStringParams('precioMax'),
						orden:decodeURIComponent(GetQueryStringParams('orden')),
						};
					
					// Consulta SQL vía AJAX
					jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
						if (response[0]=='OK')
						{
							jQuery( "#listado" ).html(response['html']);
				
						}
						else if (response[0]=='KO')
						{
							//noData();
						}
						
						// Muestra resultados y actualizo valores
						actualizaStatus(response);
				
					}});
				}
			});
			
	
			// PRECIOS DE VENTA
			jQuery('.rango-preciosVenta').noUiSlider({
				connect: true,
				behaviour: 'tap-drag',
				step: 50000,
				start: [ 0, 3000000 ],
				format: wNumb({
					mark: ',',
					decimals: 0
				}),
				range: {
					'min': [ 0 ],
					'max': [ 3000000 ]
				}
			});
			jQuery('.rango-preciosVenta').Link('lower').to(jQuery('#filter-precioVentaMin-valor'));
			jQuery('.rango-preciosVenta').Link('upper').to(jQuery('#filter-precioVentaMax-valor'));
			jQuery(".rango-preciosVenta").on({
				slide: function(){
					// Formateamos el precioMin
					var formatter = new Intl.NumberFormat('es-ES', {
					  style: 'currency',
					  currency: 'EUR',
					  minimumFractionDigits: 0,
					});
					precioFormateado=formatter.format(jQuery('#filter-precioVentaMin-valor').html());
					jQuery('.filter-precioVenta-min').text(precioFormateado);
	
					// Formateamos el precioMax
					var formatter = new Intl.NumberFormat('es-ES', {
					  style: 'currency',
					  currency: 'EUR',
					  minimumFractionDigits: 0,
					});
					precioFormateado=formatter.format(jQuery('#filter-precioVentaMax-valor').html());
					jQuery('.filter-precioVenta-max').text(precioFormateado);
				},
				set: function(){
					//
				},
				change: function(){

					jQuery(".cargando").addClass( "on" );
					
					// Extraigo Precio pulsado
					var precioMin=jQuery('#filter-precioVentaMin-valor').html();
					var precioMax=jQuery('#filter-precioVentaMax-valor').html();
				
					// Valores
					var valores={tipo:GetQueryStringParams('tipo'),
						operacion:GetQueryStringParams('operacion'),
						localidad:GetQueryStringParams('localidad'),
						zonas:GetQueryStringParams('zonas'),
						habitaciones:GetQueryStringParams('habitaciones'),
						banos:GetQueryStringParams('banos'),
						metrosMin:GetQueryStringParams('metrosMin'),
						metrosMax:GetQueryStringParams('metrosMax'),
						precioMin:precioMin,
						precioMax:precioMax,
						orden:decodeURIComponent(GetQueryStringParams('orden')),
						};
					
					// Consulta SQL vía AJAX
					jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
						if (response[0]=='OK')
						{
							jQuery( "#listado" ).html(response['html']);
							jQuery('.filter-precioVenta-max').text(precioFormateado);
						}
						else if (response[0]=='KO')
						{
							//noData();
						}
						
						// Muestra resultados y actualizo valores
						actualizaStatus(response);
				
					}});

				}
			});
	
			// PRECIOS DE ALQUILER
			jQuery('.rango-preciosAlquiler').noUiSlider({
				connect: true,
				behaviour: 'tap-drag',
				step: 100,
				start: [ 0, 3000 ],
				format: wNumb({
					mark: ',',
					decimals: 0
				}),
				range: {
					'min': [ 0 ],
					'max': [ 3000 ]
				}
			});
			jQuery('.rango-preciosAlquiler').Link('lower').to(jQuery('#filter-precioAlquilerMin-valor'));
			jQuery('.rango-preciosAlquiler').Link('upper').to(jQuery('#filter-precioAlquilerMax-valor'));
			jQuery(".rango-preciosAlquiler").on({
				slide: function(){
					// Formateamos el precioMin
					var formatter = new Intl.NumberFormat('es-ES', {
					  style: 'currency',
					  currency: 'EUR',
					  minimumFractionDigits: 0,
					});
					precioFormateado=formatter.format(jQuery('#filter-precioAlquilerMin-valor').html());
					jQuery('.filter-precioAlquiler-min').text(precioFormateado);
	
					// Formateamos el precioMax
					var formatter = new Intl.NumberFormat('es-ES', {
					  style: 'currency',
					  currency: 'EUR',
					  minimumFractionDigits: 0,
					});
					precioFormateado=formatter.format(jQuery('#filter-precioAlquilerMax-valor').html());
					jQuery('.filter-precioAlquiler-max').text(precioFormateado);
				},
				set: function(){
					//
				},
				change: function(){
		
						jQuery(".cargando").addClass( "on" );
					
					// Extraigo Precio pulsado
					var precioMin=jQuery('#filter-precioAlquilerMin-valor').html();
					var precioMax=jQuery('#filter-precioAlquilerMax-valor').html();
			
					// Valores
					var valores={tipo:GetQueryStringParams('tipo'),
						operacion:GetQueryStringParams('operacion'),
						localidad:GetQueryStringParams('localidad'),
						zonas:GetQueryStringParams('zonas'),
						habitaciones:GetQueryStringParams('habitaciones'),
						banos:GetQueryStringParams('banos'),
						metrosMin:GetQueryStringParams('metrosMin'),
						metrosMax:GetQueryStringParams('metrosMax'),
						precioMin:precioMin,
						precioMax:precioMax,
						orden:decodeURIComponent(GetQueryStringParams('orden')),
						};
					
					// Consulta SQL vía AJAX
					jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
						if (response[0]=='OK')
						{
							jQuery( "#listado" ).html(response['html']);
							jQuery('.filter-precioAlquiler-max').text(precioFormateado);
						}
						else if (response[0]=='KO')
						{
							//noData();
						}
						
						// Muestra resultados y actualizo valores
						actualizaStatus(response);
				
					}});
	
				}
			});
	}


});

// Cierro los filtros si se hace clic fuera de ellos
jQuery('html').click(function() {
	if (jQuery("body").hasClass("page-template-page-portada"))
	{
		//jQuery("#filter-zonas").removeClass( "on");
		jQuery("#filter-tipos").removeClass( "on");
	}
	else
	{
		jQuery("#filter-zonas").removeClass( "on");
		jQuery("#filter-operaciones").removeClass( "on");
		jQuery("#filter-tipos").removeClass( "on");
		jQuery("#filter-avanzados").removeClass( "on");
	}
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE ZONAS 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//jQuery( "#filter-zonas" ).click(function(event){
jQuery( "#filter-zonas-padre" ).click(function(event){
	event.stopPropagation();
	//jQuery(this).toggleClass( "on");
	jQuery("#filter-zonas").toggleClass( "on");
	jQuery("#filter-operaciones").removeClass( "on");
	jQuery("#filter-tipos").removeClass( "on");
	jQuery("#filter-avanzados").removeClass( "on");
});


jQuery( "#filter-zona-todas" ).click(function( event ) {
	event.preventDefault();
	if (jQuery("body").hasClass("page-template-page-portada"))
	{
		true;
	}
	else
	{
		
		event.stopPropagation();
	
		jQuery(".cargando").addClass( "on" );
		
		// Extraigo Localidad porque es Donostia
		var localidad=3163; // Sabemos que tenemos que mostrar Donostia
		var zonas='';
	
		// Valores
		var valores={tipo:GetQueryStringParams('tipo'),
			operacion:GetQueryStringParams('operacion'),
			localidad:localidad,
			//zonas:GetQueryStringParams('zonas'),
			zonas:zonas,
			habitaciones:GetQueryStringParams('habitaciones'),
			banos:GetQueryStringParams('banos'),
			metrosMin:GetQueryStringParams('metrosMin'),
			metrosMax:GetQueryStringParams('metrosMax'),
			precioMin:GetQueryStringParams('precioMin'),
			precioMax:GetQueryStringParams('precioMax'),
			orden:decodeURIComponent(GetQueryStringParams('orden')),
			};
		
		// Consulta SQL vía AJAX
		jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
			if (response[0]=='OK')
			{
				jQuery( "#listado" ).html(response['html']);
				jQuery(".filter-zona").removeClass( "on" );
				jQuery("#filter-zona-todas").addClass("on");
			}
			else if (response[0]=='KO')
			{
				//noData();
			}
			
			jQuery("#chivatoZonas").html('');
			// Muestra resultados y actualizo valores
			actualizaStatus(response);
	
		}});
	}
});

jQuery( ".filter-zona" ).click(function( event ) {
	event.preventDefault();

	if (jQuery("body").hasClass("page-template-page-portada"))
	{
		var valores={origen:'portadaZonas',zona:jQuery(this).prop('id'),zonas:jQuery("#zonasControlFiltros").html()};
		jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
	
			jQuery("#zonasControlFiltros").html(response[1]);

		}});
		jQuery("#filter-zona-todas").removeClass( "on" );
		jQuery(this).toggleClass( "on" );
	}
	else
	{
		event.stopPropagation();
	
		jQuery(".cargando").addClass( "on" );
		
		// Extraigo Localidad pulsada
		var localidad=jQuery(this).prop('id');
		localidad=localidad.split("filter-otra-localidad-")[1];
	
		// Valores
		var valores={tipo:GetQueryStringParams('tipo'),
			operacion:GetQueryStringParams('operacion'),
			localidad:3163, // Sé que es Donostia
			zona:jQuery(this).prop('id'),
			zonas:GetQueryStringParams('zonas'),
			habitaciones:GetQueryStringParams('habitaciones'),
			banos:GetQueryStringParams('banos'),
			metrosMin:GetQueryStringParams('metrosMin'),
			metrosMax:GetQueryStringParams('metrosMax'),
			precioMin:GetQueryStringParams('precioMin'),
			precioMax:GetQueryStringParams('precioMax'),
			orden:decodeURIComponent(GetQueryStringParams('orden')),
			};
		
		jQuery("#filter-zona-todas").removeClass( "on" );
		jQuery(this).toggleClass( "on" );
		// Consulta SQL vía AJAX
		jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {

			jQuery( "#listado" ).html(response['html']);

			jQuery(".filter-zona").removeClass( "on" );
			if (response['zonas'].length>0)
			{
				var listaZonas = response['zonas'].split(",");
				var cuantasZonas=listaZonas.length;
				for (x=0;x<cuantasZonas;x++)
				{
					jQuery("#filter-zona-"+listaZonas[x]).addClass( "on" );
				}
				jQuery("#chivatoZonas").html('<span class="badge">'+cuantasZonas+'</span>');
				
			}
			else
			{
				jQuery("#chivatoZonas").html('');
				jQuery("#filter-zona-todas").addClass( "on" );
			}
			// Muestra resultados y actualizo valores
			actualizaStatus(response);
	
		}});
	}
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE LOCALIDADES 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery( ".filter-otras-localidades" ).click(function(event){
	if (jQuery("body").hasClass("page-template-page-portada"))
	{
		var localidad=jQuery(this).prop('id');
		localidad=localidad.split("filter-otra-localidad-")[1];

		jQuery(".filter-otras-localidades").removeClass( "on");
		jQuery(this).toggleClass( "on");
		jQuery("#localidadControlFiltros").html(localidad);
	}
	else
	{
		event.stopPropagation();
	
		jQuery(".cargando").addClass( "on" );
		
		// Extraigo Localidad pulsada
		var localidad=jQuery(this).prop('id');
		localidad=localidad.split("filter-otra-localidad-")[1];
	
		// Valores
		var valores={tipo:GetQueryStringParams('tipo'),
			operacion:GetQueryStringParams('operacion'),
			localidad:localidad,
			zonas:GetQueryStringParams('zonas'),
			habitaciones:GetQueryStringParams('habitaciones'),
			banos:GetQueryStringParams('banos'),
			metrosMin:GetQueryStringParams('metrosMin'),
			metrosMax:GetQueryStringParams('metrosMax'),
			precioMin:GetQueryStringParams('precioMin'),
			precioMax:GetQueryStringParams('precioMax'),
			orden:decodeURIComponent(GetQueryStringParams('orden')),
			};
		
		// Consulta SQL vía AJAX
		jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
			if (response[0]=='OK')
			{
				jQuery( "#listado" ).html(response['html']);
	
			}
			else if (response[0]=='KO')
			{
				//noData();
			}
			
			// Muestra resultados y actualizo valores
			jQuery("#chivatoZonas").html('');
			jQuery(".filter-zona").removeClass('on');
			
			actualizaStatus(response);
	
		}});
	}
});

jQuery( "#btn-localidades-donostia" ).click(function(event){
    event.stopPropagation();
	jQuery(".localidades-gipuzkoa").removeClass("on");
	jQuery(".localidades-otras").removeClass("on");
	jQuery(".localidades-donostia").toggleClass("on");
});

jQuery( "#btn-localidades-gipuzkoa" ).click(function(event){
    event.stopPropagation();
	jQuery(".localidades-donostia").removeClass("on");
	jQuery(".localidades-otras").removeClass("on");
	jQuery(".localidades-gipuzkoa").toggleClass("on");
});

jQuery( "#btn-localidades-otras" ).click(function(event){
    event.stopPropagation();
	jQuery(".localidades-gipuzkoa").removeClass("on");
	jQuery(".localidades-donostia").removeClass("on");
	jQuery(".localidades-otras").toggleClass("on");
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE TIPOS 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery( "#filter-tipos" ).click(function(event){
    event.stopPropagation();
	jQuery(this).toggleClass( "on");
	jQuery("#filter-zonas").removeClass( "on");
	jQuery("#filter-operaciones").removeClass( "on");
	jQuery("#filter-avanzados").removeClass( "on");
});

jQuery( ".filter-tipo" ).click(function( event ) {

	//event.preventDefault();

	if (jQuery("body").hasClass("page-template-page-portada"))
	{
		event.preventDefault();
		jQuery( ".selector-tipo span" ).html(jQuery(this).html());
		jQuery(".filter-tipo").removeClass( "on" );
		jQuery("#filter-tipo-"+jQuery(this).html().toLowerCase()).addClass("on");
	}
	else if (jQuery("body").hasClass("page-template-page-inmuebles"))
	{

		event.stopPropagation();
	
		jQuery(".cargando").addClass( "on" );
		
		// Extraigo Tipo pulsado
		var 	tipo=jQuery(this).html();
	
		// Valores
		var valores={tipo:tipo,
			operacion:GetQueryStringParams('operacion'),
			localidad:GetQueryStringParams('localidad'),
			zonas:GetQueryStringParams('zonas'),
			habitaciones:GetQueryStringParams('habitaciones'),
			banos:GetQueryStringParams('banos'),
			metrosMin:GetQueryStringParams('metrosMin'),
			metrosMax:GetQueryStringParams('metrosMax'),
			precioMin:GetQueryStringParams('precioMin'),
			precioMax:GetQueryStringParams('precioMax'),
			orden:decodeURIComponent(GetQueryStringParams('orden')),
			};
		
		// Consulta SQL vía AJAX
		jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
			if (response[0]=='OK')
			{
				jQuery( "#listado" ).html(response['html']);
	
			}
			else if (response[0]=='KO')
			{
				//noData();
			}
			
			// Muestra resultados y actualizo valores
			actualizaStatus(response);
	
		}});
	}
	
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE OPERACIONES 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery( "#filter-operaciones" ).click(function(event){
    event.stopPropagation();
	jQuery(this).toggleClass( "on");
	jQuery("#filter-zonas").removeClass( "on");
	jQuery("#filter-tipos").removeClass( "on");
	jQuery("#filter-avanzados").removeClass( "on");
});

jQuery( ".filter-operacion" ).click(function( event ) {

    event.stopPropagation();

	jQuery(".cargando").addClass( "on" );
	
	// Extraigo Operación pulsada
	var operacion=jQuery(this).html();

	// Valores
	var valores={tipo:GetQueryStringParams('tipo'),
		operacion:operacion,
		localidad:GetQueryStringParams('localidad'),
		zonas:GetQueryStringParams('zonas'),
		habitaciones:GetQueryStringParams('habitaciones'),
		banos:GetQueryStringParams('banos'),
		metrosMin:GetQueryStringParams('metrosMin'),
		metrosMax:GetQueryStringParams('metrosMax'),
		precioMin:GetQueryStringParams('precioMin'),
		precioMax:GetQueryStringParams('precioMax'),
		//orden:decodeURIComponent(GetQueryStringParams('orden')),
		orden: 'precio'+operacion+' DESC',
		};
	
	// Consulta SQL vía AJAX
	jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
		if (response[0]=='OK')
		{
			jQuery( "#listado" ).html(response['html']);
			jQuery(".precioVenta").toggleClass( "on" );
			jQuery(".precioAlquiler").toggleClass( "on" );
		}
		else if (response[0]=='KO')
		{
			//noData();
		}
		
		// Muestra resultados y actualizo valores
		actualizaStatus(response);

	}});
});

jQuery( ".filter-operacion" ).click(function() {
	
	jQuery(".filter-operacion").removeClass( "on", function() {
	});
	jQuery(this).toggleClass( "on", function() {
	});

});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE HABITACIONES 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery( ".filter-habitacion" ).click(function( event ) {

    event.stopPropagation();

	jQuery(".cargando").addClass( "on" );
	
	// Extraigo Habitaciones pulsadas
	var habitaciones=jQuery(this).text();

	// Valores
	var valores={tipo:GetQueryStringParams('tipo'),
		operacion:GetQueryStringParams('operacion'),
		localidad:GetQueryStringParams('localidad'),
		zonas:GetQueryStringParams('zonas'),
		habitaciones:jQuery(this).text(),
		banos:GetQueryStringParams('banos'),
		metrosMin:GetQueryStringParams('metrosMin'),
		metrosMax:GetQueryStringParams('metrosMax'),
		precioMin:GetQueryStringParams('precioMin'),
		precioMax:GetQueryStringParams('precioMax'),
		orden:decodeURIComponent(GetQueryStringParams('orden')),
		};
	
	// Consulta SQL vía AJAX
	jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
		if (response[0]=='OK')
		{
			jQuery( "#listado" ).html(response['html']);

		}
		else if (response[0]=='KO')
		{
			//noData();
		}
		
		// Muestra resultados y actualizo valores
		actualizaStatus(response);

	}});
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE BAÑOS 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery( ".filter-bano" ).click(function( event ) {
	
    event.stopPropagation();

	jQuery(".cargando").addClass( "on" );
	
	// Extraigo Baños pulsados
	var banos=jQuery(this).text();

	// Valores
	var valores={tipo:GetQueryStringParams('tipo'),
		operacion:GetQueryStringParams('operacion'),
		localidad:GetQueryStringParams('localidad'),
		zonas:GetQueryStringParams('zonas'),
		habitaciones:GetQueryStringParams('habitaciones'),
		banos:banos,
		metrosMin:GetQueryStringParams('metrosMin'),
		metrosMax:GetQueryStringParams('metrosMax'),
		precioMin:GetQueryStringParams('precioMin'),
		precioMax:GetQueryStringParams('precioMax'),
		orden:decodeURIComponent(GetQueryStringParams('orden')),
		};
	
	// Consulta SQL vía AJAX
	jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
		if (response[0]=='OK')
		{
			jQuery( "#listado" ).html(response['html']);

		}
		else if (response[0]=='KO')
		{
			//noData();
		}
		
		// Muestra resultados y actualizo valores
		actualizaStatus(response);

	}});
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE AVANZADOS 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery( "#filter-avanzados" ).click(function(event){
    event.stopPropagation();
	jQuery(this).toggleClass( "on");
	jQuery("#filter-zonas").removeClass( "on");
	jQuery("#filter-tipos").removeClass( "on");
	jQuery("#filter-operaciones").removeClass( "on");
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE PAGINADORES 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery( ".paginador" ).click(function(event){
    event.stopPropagation();
	jQuery(".cargando").addClass( "on" );

	var valores={localidad:jQuery("#localidadControlFiltros").html(),
	zonas:jQuery( "#zonasControlFiltros" ).html(),
	orden:jQuery( "#ordenControlFiltros" ).html(),
	operacion:jQuery( "#operacionControlFiltros" ).html(),
	tipo:jQuery( "#tipoControlFiltros" ).html(),
	habitaciones:jQuery( "#habitacionesControlFiltros" ).html(),
	banos:jQuery( "#banosControlFiltros" ).html(),
	metrosMin:jQuery( "#metrosminControlFiltros" ).html(),
	metrosMax:jQuery( "#metrosmaxControlFiltros" ).html(),
	precioMin:jQuery( "#preciominControlFiltros" ).html(),
	precioMax:jQuery( "#preciomaxControlFiltros" ).html(),
	paginador:jQuery( "#paginadorControlFiltros" ).html(),
	};
	
	jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
		if (response[0]=='OK')
		{
			var contenido=jQuery( "#listado" ).html();
			 jQuery( "#listado" ).html(contenido+response['html']);
		}
		else if (response[0]=='KO')
		{
			jQuery(".paginador-contenedor").removeClass( "on" );
		}
		actualizaStatus(response);
		jQuery(".cargando").removeClass( "on" );
		jQuery('html, body').animate({
				scrollTop: (jQuery(window).scrollTop()+150)
			}, 900);	

	}});
			
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE ÓRDENES 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery( "#filter-orden-precio-asc" ).click(function(event){

    event.stopPropagation();

	jQuery(".cargando").addClass( "on" );
	
	// Extraigo Orden pulsado
	var orden='precio'+GetQueryStringParams('operacion')+' DESC';

	// Valores
	var valores={tipo:GetQueryStringParams('tipo'),
		operacion:GetQueryStringParams('operacion'),
		localidad:GetQueryStringParams('localidad'),
		zonas:GetQueryStringParams('zonas'),
		habitaciones:GetQueryStringParams('habitaciones'),
		banos:GetQueryStringParams('banos'),
		metrosMin:GetQueryStringParams('metrosMin'),
		metrosMax:GetQueryStringParams('metrosMax'),
		precioMin:GetQueryStringParams('precioMin'),
		precioMax:GetQueryStringParams('precioMax'),
		orden:orden,
		};
	
	// Consulta SQL vía AJAX
	jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
		if (response[0]=='OK')
		{
			jQuery( "#listado" ).html(response['html']);
			jQuery( "#filter-orden-precio-asc" ).toggleClass("on");
			jQuery( "#filter-orden-precio-desc" ).toggleClass("on");
		}
		else if (response[0]=='KO')
		{
			//noData();
		}
		
		// Muestra resultados y actualizo valores
		actualizaStatus(response);
		jQuery('html, body').stop().animate({
			'scrollTop': jQuery( "#main" ).offset().top
			}, 900, 'swing');    
	}});

});

jQuery( "#filter-orden-precio-desc" ).click(function(event){
	
    event.stopPropagation();

	jQuery(".cargando").addClass( "on" );
	
	// Extraigo Orden pulsado
	var orden='precio'+GetQueryStringParams('operacion')+' ASC';

	// Valores
	var valores={tipo:GetQueryStringParams('tipo'),
		operacion:GetQueryStringParams('operacion'),
		localidad:GetQueryStringParams('localidad'),
		zonas:GetQueryStringParams('zonas'),
		habitaciones:GetQueryStringParams('habitaciones'),
		banos:GetQueryStringParams('banos'),
		metrosMin:GetQueryStringParams('metrosMin'),
		metrosMax:GetQueryStringParams('metrosMax'),
		precioMin:GetQueryStringParams('precioMin'),
		precioMax:GetQueryStringParams('precioMax'),
		orden:orden,
		};
	
	// Consulta SQL vía AJAX
	jQuery.ajax({type:'POST', url: rutaCodigo+'consulta-datos.php', data: valores, dataType: "json", success: function(response) {
		if (response[0]=='OK')
		{
			jQuery( "#listado" ).html(response['html']);
			jQuery( "#filter-orden-precio-asc" ).toggleClass("on");
			jQuery( "#filter-orden-precio-desc" ).toggleClass("on");
		}
		else if (response[0]=='KO')
		{
			//noData();
		}
		
		// Muestra resultados y actualizo valores
		actualizaStatus(response);

	}});

});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE FICHA 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

jQuery( ".ficha-galeria-grid-mas" ).click(function(event){
    event.stopPropagation();
	if (jQuery(".ficha-galeria-grid").hasClass("on"))
	{
		jQuery(".ficha-galeria-grid-mas").html( "Mostrar todas las fotos" );
	}
	else
	{
		// jQuery(".ficha-galeria-grid-mas").html( "Mostrar menos fotos" );
		jQuery(".ficha-galeria-grid-mas").html( "" );
	}
	jQuery(".ficha-galeria-grid").toggleClass( "on" );
});

jQuery( "#boton-contacto-agencia" ).click(function(event){
    event.stopPropagation();
	jQuery(".form-ficha").addClass('on');
	jQuery(".contacto-magico").addClass( "on" );
			
});

jQuery( "#boton-cerrar-contacto-agencia" ).click(function(event){
    event.stopPropagation();
	jQuery(".contacto-magico").removeClass( "on" );
	jQuery(".form-ficha-mensaje-ok").removeClass( "on" );
			
});

jQuery( "#boton-enviar-contacto-agencia" ).click(function(event){
    event.stopPropagation();

	jQuery(".cargando").addClass( "on" );
	var valores={correo:jQuery("#correoFormFicha").val(),
		telefono:jQuery("#telefonoFormFicha").val(),
		texto:jQuery("#textoFormFicha").val(),
		referencia:jQuery("#referenciaFormFicha").val(),
		url:jQuery("#URLFormFicha").val(),
		idInmotek:jQuery("#idInmotek").val(),
		};
	
	jQuery.ajax({type:'POST', url: rutaCodigo+'form-ficha.php', data: valores, dataType: "json", success: function(response) {
		if (response[0]=='OK')
		{
			jQuery(".form-ficha").removeClass('on');
			jQuery(".form-ficha-mensaje-ok").addClass('on');
			jQuery("#correoFormFicha").val('');
			jQuery("#telefonoFormFicha").val('');
			jQuery("#textoFormFicha").val('');
			jQuery(".form-ficha-mensaje-ko").removeClass("on");
			
			jQuery(".cargando").removeClass( "on" );
		}
		else if (response[0]=='KO')
		{
			jQuery(".cargando").removeClass( "on" );
			jQuery(".form-ficha-mensaje-ko").html(response['error']);
			jQuery(".form-ficha-mensaje-ko").addClass("on");
		}
	}});
			
});

jQuery( "#rgpd-check" ).click(function(event){
    event.stopPropagation();

	if (jQuery( "#rgpd-check" ).prop('checked') )
		jQuery( "#boton-enviar-contacto-agencia" ).removeAttr('disabled');
	else
		jQuery( "#boton-enviar-contacto-agencia" ).attr('disabled','enabled');
});


jQuery( ".miniatura" ).click(function(event){
    event.stopPropagation();
	jQuery(".cargando").addClass( "on" );
	var valores={activa:jQuery(this).prop('id'),referencia:jQuery("#verMasFotosReferencia").html().trim()};
	
	jQuery.ajax({type:'POST', url: rutaCodigo+'galeria-fotos.php', data: valores, success: function(response) {
		jQuery("#verMasFotos").html(response);
        jQuery(".carousel").addClass( "on" );

		jQuery(".cargando").removeClass( "on" );
	}});
				
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE PORTADA 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

jQuery( "#boton-venta" ).click(function(event){
    event.stopPropagation();
	
	var zonas='';
	
	if (jQuery("#zonasControlFiltros").html().length>0)
		zonas=jQuery("#zonasControlFiltros").html();
	jQuery(location).attr('href', '/inmuebles/?operacion=Venta&tipo='+jQuery( ".selector-tipo span" ).html()+'&localidad='+jQuery("#localidadControlFiltros").html()+'&zonas='+zonas)
		
});

jQuery( "#boton-alquiler" ).click(function(event){
    event.stopPropagation();

	var zonas='';
	if (jQuery("#zonasControlFiltros").html().length>0)
		zonas=jQuery("#zonasControlFiltros").html();
	jQuery(location).attr('href', '/inmuebles/?operacion=Alquiler&tipo='+jQuery( ".selector-tipo span" ).html()+'&localidad=3163&zonas='+zonas);
			
});


function actualizaStatus(response)
{
	//jQuery( ".no-data" ).html('');
	jQuery( ".no-data" ).removeClass("on");
	jQuery( ".inmuebles-encontrados-contador" ).html(response['numInmuebles']);
	jQuery("#numPaginador").html(response['paginador']);

	// Control de paginador
	if ((response['numInmuebles']-(20*(response['paginador'])))>0)
		jQuery(".paginador-contenedor").addClass( "on" );
	else
		jQuery(".paginador-contenedor").removeClass( "on" );

	jQuery( ".inmuebles-encontrados-contador" ).html(response['numInmuebles']);
	
	var salidaTipo=response['tipo'];
	if (response['numInmuebles']==1)
		true;
	else
	{
		if (response['tipo']=="Local")
			salidaTipo=salidaTipo+"es";
		else
			salidaTipo=salidaTipo+"s";		
	}
	
	jQuery( ".inmuebles-encontrados-tipo" ).html(salidaTipo);
	
	// Control de Filtros
	jQuery( "#zonasControlFiltros" ).html(response['zonas'])
	jQuery( "#ordenControlFiltros" ).html(response['orden'])
	jQuery( "#operacionControlFiltros" ).html(response['operacion'])
	jQuery( "#tipoControlFiltros" ).html(response['tipo'])
	jQuery( "#habitacionesControlFiltros" ).html(response['habitaciones'])
	jQuery( "#banosControlFiltros" ).html(response['banos'])
	jQuery( "#metrosminControlFiltros" ).html(response['metrosMin'])
	jQuery( "#metrosmaxControlFiltros" ).html(response['metrosMax'])
	jQuery( "#preciominControlFiltros" ).html(response['precioMin'])
	jQuery( "#preciomaxControlFiltros" ).html(response['precioMax'])
	jQuery( "#paginadorControlFiltros" ).html(response['paginador'])

	// OPERACION
	jQuery("#filter-operacion-"+response['operacion'].toLowerCase()).addClass("on");
	jQuery( ".selector-operacion span" ).html(response['operacion'])
	jQuery("#filter-operaciones").removeClass("on");
	jQuery( ".inmuebles-encontrados-operacion" ).html(response['operacion']);

	// TIPOS
	jQuery( ".selector-tipo span" ).html(response['tipo'])
	jQuery(".filter-tipo").removeClass( "on" );
	jQuery("#filter-tipo-"+response['tipo'].toLowerCase()).addClass("on");
	jQuery("#filter-tipos").removeClass("on");
	
	// LOCALIDAD
	//jQuery("#filter-zonas-padre span").html(response['localidadNombre']);
	jQuery("#label-filter-zonas-padre").html(response['localidadNombre']);
	
	jQuery("#localidadControlFiltros").html(response['localidad']);
	jQuery( ".inmuebles-encontrados-localidad" ).html(response['localidadNombre']);
	
	if (response['zonas'].length>0)
		jQuery( ".inmuebles-encontrados-localidad" ).html(response['localidadNombre']);
	
	// ZONAS
	jQuery("#filter-zonas").removeClass( "on");


	// AVANZADOS
	jQuery("#filter-avanzados").removeClass("on");

	// HABITACIONES
	jQuery( ".filter-habitacion" ).removeClass("on");
	jQuery( "#filter-habitacion-"+response['habitaciones'] ).addClass("on");

	// BAÑOS
	jQuery( ".filter-bano" ).removeClass("on");
	jQuery( "#filter-bano-"+response['banos'] ).addClass("on");
	
	
	if (response[0]=='KO')
	{		
		jQuery( "#listado" ).html('');
		noData();
	}
	else
	{
		jQuery( ".no-data" ).html('');
	}
	
	// MODIFICAMOS LA URL: TÉCNICA ADDRESS	
	var stateObj = { foo: "bar" };
	var nuevaURL='/inmuebles/?operacion='+response['operacion']+
	'&tipo='+response['tipo']+
	'&localidad='+response['localidad']+
	'&zonas='+response['zonas']+
	'&habitaciones='+response['habitaciones']+
	'&banos='+response['banos']+
	'&metrosMin='+response['metrosMin']+
	'&metrosMax='+response['metrosMax']+
	'&orden='+response['orden'];
	history.pushState(stateObj, "", nuevaURL);
	
	jQuery(".cargando").removeClass( "on" );
	
	jQuery(".resultado-pop").addClass("on");
	setTimeout(function () { jQuery(".resultado-pop").removeClass("on") }, 2000);
}

function GetQueryStringParams(sParam)
{
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++)
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam)
		{
			return sParameterName[1];
		}
	}
}

function noData()
{
	jQuery( ".no-data" ).html('<h2>¿Qué estás buscando?</h2><p>Parece que no hemos encontrado lo que buscas.<br>Puedes seguir consultando <a class="enlace" href="/inmuebles/?operacion=Venta&tipo=Piso&localidad=3163&zonas=&habitaciones=1&banos=1&metrosMin=0&metrosMax=300&orden=precioVenta%20DESC">nuestro catálogo inmobiliario</a> o buscar por palabras en <a class="enlace" href="/buscador/">nuestro buscador inteligente</a>.</p>');
	jQuery(".paginador-contenedor").removeClass( "on" );
	jQuery(".no-data").addClass("on");
	jQuery(".cargando").removeClass( "on" );
}

// Animaciones elementos gráficos marca Exin10
function animaciones(selector,inicio,final)
{
	var inicio=inicio;
	var final=final;

	jQuery(selector).css( "top", inicio+"%")

	window.addEventListener('scroll', function() {

		var altura=jQuery(document).scrollTop()*100/jQuery( document ).height();
		altura=(inicio+(final-inicio)*(altura/100))
		
		//console.log("Porcentaje: "+altura+" Altura Window: "+jQuery( window ).height()+" Altura Document: "+jQuery( document ).height()+" Altura al TOP: "+jQuery(window).scrollTop());
		jQuery(selector).css( "top", altura+"%")
		
		// CONTROL DE TOP Y BOTTOM PARA FX
		if (jQuery(document).scrollTop()<200) jQuery("body").removeClass("scroll");
		if (jQuery(document).scrollTop()>200) jQuery("body").addClass("scroll");
		var bottom=jQuery(document).height() - jQuery(this).scrollTop() - jQuery(this).height();
		if (jQuery(window).scrollBottom()<1000) jQuery("body").addClass("bottom");
		if (jQuery(window).scrollBottom()>1000) jQuery("body").removeClass("bottom");

	});
	
}

// CONTROL DE TOP Y BOTTOM PARA FX
jQuery.fn.scrollBottom = function() { 
	return jQuery(document).height() - this.scrollTop() - this.height(); 
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENTOS SOBRE LUPA Y BUSCADOR INTELIGENTE 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

jQuery( "#lupaBuscador, .menu-item-64" ).click(function(event){
	jQuery(".fullscreen-buscador").addClass( "on");
	jQuery(".magic-search").css( "display","block");
	jQuery('input[id=busqueda-inteligente]').focus();
});

jQuery( ".fullscreen-buscador .cerrar" ).click(function(event){
	jQuery(".fullscreen-buscador").removeClass( "on");
});

// JavaScript Document