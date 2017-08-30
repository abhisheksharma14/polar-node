$.extend( $.ui.slider.prototype.options, { 
    animate: 300
});
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

// used to mantain ongoing ajax status
var currentRequest = null;

// initial search with default values 0,360
currentRequest = $.ajax({
    type: 'GET',
    data: '',
    url: '/search/hue/0/360',
    dataType: 'json',
    beforeSend : function() {
        if(currentRequest != null) {
            currentRequest.abort();
        }
    },
    success: function(data) {
        if (data.response == 1) {
            renderGallery(data.result);
        }
    },
    error:function(e){
      console.log(e);
    }
});

$("#scale-slider")
    .slider({
        max: 360,
        min: 0,
        values: [0, 360],
        range: true,
        change: function(event, ui) {
            var values = $("#scale-slider").slider('values');
            currentRequest = $.ajax({
                type: 'GET',
                data: '',
                url: '/search/hue/'+values[0]+"/"+values[1],
                dataType: 'json',
                beforeSend : function()    {           
                    if(currentRequest != null) {
                        currentRequest.abort();
                    }
                },
                success: function(data) {
                    if (data.response == 1) {
                        renderGallery(data.result);
                    }
                },
                error:function(e){
                  console.log(e);
                }
            });
        }
    })
    .slider("pips", {
        rest: "label"
    });

popup = {
  init: function(){  
    $('figure').click( function(event){
        popup.open($(this));
    });  
    $(document).on('click', '.popup img', function(){
      return false;
    }).on('click', '.popup', function(){
      popup.close();
    })
  },
  open: function($figure) {
    $('.gallery').addClass('pop');
    $popup = $('<div class="popup" />').appendTo($('body'));
    $fig = $figure.clone().appendTo($('.popup'));
    $bg = $('<div class="bg" />').appendTo($('.popup'));
    $close = $('<div class="close"><svg><use xlink:href="#close"></use></svg></div>').appendTo($fig);
    $shadow = $('<div class="shadow" />').appendTo($fig);
    src = $('img', $fig).attr('src');
    $shadow.css({backgroundImage: 'url(' + src + ')'});
    $bg.css({backgroundImage: 'url(' + src + ')'});
    setTimeout(function(){
      $('.popup').addClass('pop');
    }, 10);
  },
  close: function(){
    $('.gallery, .popup').removeClass('pop');
    setTimeout(function(){
      $('.popup').remove()
    }, 100);
  }
};

popup.init();

// render search result
function renderGallery(images){
    var gallery = $(".content .gallery");
    gallery.html('');
    var count = 0;
    for (var i = images.length - 1; i >= 0; i--) {
        var img = images[i];
        if (img.length>0) {
            for (var j = 0; j < img.length; j++) {
                var imgHtml = '<figure>\
                            <img src="/images/'+img[j]+'" alt="" />\
                            <figcaption>Caption: <small>HUE: '+i+'</small></figcaption>\
                        </figure>' ;
                gallery.append(imgHtml);
                count += 1;
            }
        }
    }
    $(".content span.alert").html(count+" Images Found");
    popup.init();
};




