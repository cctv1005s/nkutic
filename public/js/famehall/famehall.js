;(function () {
    

    // iPad and iPod detection  
    var isiPad = function(){
        return (navigator.platform.indexOf("iPad") != -1);
    };

    var isiPhone = function(){
        return (
            (navigator.platform.indexOf("iPhone") != -1) || 
            (navigator.platform.indexOf("iPod") != -1)
        );
    };

    // OffCanvass
    
    var offCanvass = function() {
        $('body').on('click', '.js-fh5co-menu-btn', function(){
            $('.guideBar').toggleClass('guideBar-hidden');
        });
    };

    // Click outside of offcanvass
    var mobileMenuOutsideClick = function() {
        $(document).click(function (e) {
        // var container = $(".guideBar");
        // if (!container.is(e.target) && container.has(e.target).length === 0) {
        //     if ( $('.guideBar').hasClass('guideBar-hidden') ) {
        //         $('.guideBar').removeClass('guideBar-hidden');
        //     }
        // }
        });

        $(window).scroll(function(){
            if ( $(window).scrollTop() > 500 ) {
                if ( $('#fh5co-offcanvass').hasClass('fh5co-awake') ) {
                    $('#fh5co-offcanvass').removeClass('fh5co-awake');
                }
            }
        });
    };

    // Magnific Popup
    
    var magnifPopup = function() {
        $('.image-popup').click(function(event) {
            /* Act on the event */
            event.preventDefault();
        });
    };


    var animateBoxWayPoint = function() {

        if ($('.animate-box').length > 0) {
            $('.animate-box').waypoint( function( direction ) {

                if( direction === 'down' && !$(this).hasClass('animated') ) {
                    $(this.element).addClass('bounceIn animated');
                }

            } , { offset: '75%' } );
        }

    };

    $(function(){
        magnifPopup();
        offCanvass();
        mobileMenuOutsideClick();
        animateBoxWayPoint();

        $('.guideBar').addClass('guideBar-hidden');
    });


}());