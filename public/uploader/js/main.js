/*
 * jQuery File Upload Plugin JS Example
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global $, window */
// adding csrf token to ajax request 
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(function () {
    'use strict';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: '/uploadImage'
    });

    // Enable iframe cross-domain access via redirect option:
    $('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );

    // on file add evend listener (calculates avg hue value of an image as soon as uploaded)
    $('#fileupload').bind('fileuploadadd', function (e, data) {
        var reader = new FileReader();
        reader.readAsDataURL(data.files[0]);
        reader.data = data;
        reader.file = data.files[0];
        reader.onload = readerOnload;
    });

    // add avgH value to the form data before submit / upload
    $('#fileupload').bind('fileuploadsubmit', function(e, data) {
        data.formData = {hue: data.files[0].hue};
    });

    // Load existing files:
    // $('#fileupload').addClass('fileupload-processing');
    // $.ajax({
    //     // Uncomment the following to send cross-domain cookies:
    //     // xhrFields: {withCredentials: true},
    //     url: $('#fileupload').fileupload('option', 'url'),
    //     dataType: 'json',
    //     context: $('#fileupload')[0],
    // }).always(function () {
    //     $(this).removeClass('fileupload-processing');
    // }).done(function (result) {
    //     $(this).fileupload('option', 'done')
    //         .call(this, $.Event('done'), {result: result});
    // });

    // convert RGB to HSL values
    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [ h, s, l ];
    };



    function imageOnload(){
        var image = this;
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        var hsl = [];
        var totalH = 0;
        for(var i=0; i<imageData.length; i+=4) {
            var hslVal = rgbToHsl(imageData[i], imageData[i+1], imageData[i+2]);
            totalH += hslVal[0]; 
            hsl.push(hslVal[0]);
        }
        var avgH = 360 * totalH/hsl.length;
        image.data.files[0].hue = avgH;
    };

    function readerOnload(_file) {
        var image = new Image();
        image.file = this.file;
        image.data = this.data;
        image.src = _file.target.result;
        image.onload = imageOnload;
        image.onerror = function () {
            alert("Please select a valid image file (jpg and png are allowed)");
        };
    };

});


