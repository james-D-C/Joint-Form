
( function( TJ, $, undefined ){
    
    TJ.getTemplate = function( templateId, data ){
            
        var template = '';
        var html = '';

        template = $( templateId ).html();
        template = Handlebars.compile( template );

        html = template( data );

        return html;
    };
    
    TJ.scroll = function(id){
        $( 'html,body' ).animate( { scrollTop : $( id ).offset().top }, 'fast' );
    };
    
    TJ.hamburger = function(){
        
        $( '#main-nav' ).on( 'click', function( e ){
            if( ! $( e.target ).is( $( this ) ) )
            {
                return;
            }
            $( 'body' ).removeClass( 'main-nav-open' );
        } );
        
        $( '#hamburger a' ).on( 'click', function( e ){
            e.preventDefault();
            var $this = $( this );
            $( 'body' ).addClass( 'main-nav-open' );
        } );
        
    };
    
    TJ.maps = function(){
        $( '.map' ).each( function(){
            
            var $this = $( this );
            var latitude = $this.attr( 'data-latitude' );
            var longitude = $this.attr( 'data-longitude' );
            var icon = $this.attr( 'data-icon' );
            
            console.log( icon );
            
            if( latitude && longitude )
            {
                var myLatlng = new google.maps.LatLng( latitude, longitude );
                var mapOptions = {
                        center: myLatlng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true
                };
                
                map = new google.maps.Map($this.get( 0 ), mapOptions);

                var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        icon: {
                            url: icon,
                            size: new google.maps.Size(24, 26),
                            origin: new google.maps.Point(0,0),
                            anchor: new google.maps.Point(14,36)
                        }
                });   
            }
            
        } );
    };
    
    TJ.toggle = function(){
        var control = $( '.clinic-metadata .toggle-control' );
        
        $( '#hours' ).on( 'show.bs.collapse', function(){
            control.html( control.attr( 'data-hide' ) );
            $( '#holiday-hours' ).collapse( 'hide' );
        } );
        
        $( '#hours' ).on( 'hide.bs.collapse', function(){
            control.html( control.attr( 'data-show' ) );
            $( '#holiday-hours' ).collapse( 'show' );
        } );
    };
    
    TJ.selects = function(){
        $( '.form-select' ).each( function(){
            var $this = $( this );
            $this.css( 'width', '100%' );

            $this.select2( {
              minimumResultsForSearch: Infinity
            } );

        } );
    };
    
    TJ.youtube = function(){
        $( '.youtube' ).each( function(){
            var $this = $( this );
            var id = $this.attr( 'data-embed-id' );
            
            $this.on( 'click', function( e ){
                e.preventDefault();
                $this.find( 'a' ).html( '<iframe src="https://www.youtube.com/embed/' + id + '?rel=0&showinfo=0&autoplay=1" frameborder="0" allowfullscreen></iframe>' );
            } )

        } );
    };
    
    TJ.handleHash = function(){
        var hash = window.location.hash;
        hash && $('ul.nav-tabs-nostyle a[href="' + hash + '"]').tab('show');
    };

    TJ.stateRegionsChanged = function() {

        if($('.js-lookup-regions').length > 0) {
            // Bind events
            $('.js-lookup-regions').change(function () {

                var stateSelectedOption = $('.js-lookup-regions option:selected').val();

                $('.js-lookup-clinics option[data-region]').remove();
                $('.js-clinics option[data-clinic]').remove();

                var params = {
                    country_state_id: stateSelectedOption,
                    task: 'json.get_regions_by_country_state_id'
                };
                // Load state options
                $.post(
                    '/ajax',
                    params,
                    function (response) {
                        if(response.success) {
                            var data = response.data;
                            for(i=0;i<data.length; i++) {
                                var option = $('<option>');
                                option.text(data[i].name)
                                option.val(data[i].id);
                                option.attr('data-region','1');
                                $('.js-lookup-clinics').append(option);
                            }
                        }else{

                        }
                    },
                    'json'
                );

            });
        }

    };

    TJ.regionClinicsChanged = function() {

        if($('.js-lookup-clinics').length > 0) {
            // Bind events
            $('.js-lookup-clinics').change(function () {

                var regionSelectedOption = $('.js-lookup-clinics option:selected').val();
                // Load state options
                $('.js-clinics option[data-clinic]').remove();

                var params = {
                    region_id: regionSelectedOption,
                    task: 'json.get_clinics_by_region_id'
                };
                $.post(
                    '/ajax',
                    params,
                    function (response) {
                        console.log(response);
                        if(response.success) {
                            var data = response.data;
                            for(i=0;i<data.length; i++) {
                                var option = $('<option>');
                                option.text('Clinic #' + data[i].number + ': ' + data[i].name)
                                option.val(data[i].id);
                                option.attr('data-clinic','1');
                                console.log(option);
                                $('.js-clinics').append(option);
                            }
                        }else{

                        }
                    },
                    'json'
                );

            });
        }

    };

    $( function(){
        
        TJ.hamburger();
        TJ.maps();
        TJ.toggle();
        TJ.selects();
        TJ.youtube();
        TJ.handleHash();
        TJ.stateRegionsChanged();
        TJ.regionClinicsChanged();

    } );
    
}( window.TJ = window.TJ || {}, $, undefined ) );
