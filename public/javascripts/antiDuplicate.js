$(document).ready(function () {

    $("form").submit(function() {
        $(":submit", this).attr("disabled", "disabled");
        setTimeout(() => {
            $('button').removeAttr('disabled')
        }, 6000);
     });
    
    
});

