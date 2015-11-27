        //This portion sets up the Intro Menu and the Calibration process with the Drag-Resize Box
        var keyboardX = 400;
        var keyboardY = 300;
        var keyboardSX = 450*800/1920;
        var keyboardSY = 100*600/1080;

        interact('.resize-drag')
          .draggable({
            onmove: window.dragMoveListener
          })
          .resizable({
            preserveAspectRatio: false,
            edges: { left: true, right: true, bottom: true, top: true }
          })
          .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style
            target.style.width  = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            keyboardSX = event.rect.width  * 800 / 1920;
            keyboardSY = event.rect.height  * 600 / 1080;

            console.log('width='+keyboardSX+' height='+ keyboardSY);

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            keyboardX = x * 800 / 1920 + keyboardSX / 2 +10;
            keyboardY = y * 600 / 1080 + keyboardSY / 2 +15;

            console.log('x='+keyboardX+' y='+ keyboardY);

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            target.textContent = "Drag and Resize me over your keyboard. (size:" + Math.round(event.rect.width) + '×' + Math.round(event.rect.height) + ')';
          });

          interact('.draggable')
          .draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
              restriction: "parent",
              endOnly: true,
              elementRect: { top: 0, left: 0, bottom: 50, right: 200 }
            },
            // enable autoScroll
            autoScroll: true,

            // call this function on every dragmove event
            onmove: dragMoveListener,
            // call this function on every dragend event
            onend: function (event) {}
          });

          function dragMoveListener (event) {

            $("#startPlay").fadeIn(2000);

            var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            keyboardX = x * 800 / 1920 + keyboardSX / 2+10;
            keyboardY = y * 600 / 1080 + keyboardSY / 2+15;

            console.log('x='+keyboardX+' y='+ keyboardY);
            // translate the element
            target.style.webkitTransform =
            target.style.transform =
              'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);

            target.textContent = "Drag and Resize me over your keyboard. (x:" + Math.round(keyboardX) + ' y:' + Math.round(keyboardY) + ')'
          }

          // this is used later in the resizing and gesture demos
          window.dragMoveListener = dragMoveListener;

          $(document).ready(function(){
            
            $("#preparation").hide();
            $("#calibration").hide();
            $(".resize-container").hide();
            $("#play").hide();
            $("#backToCalibration").hide();
            $("#keyboardLight").hide();


            $("#startPreparation").click(function(){
                $("#home").hide();
                $("#preparation").fadeIn(500);
            });

            $("#startCalibration").click(function(){
                $("#preparation").hide();
                $("#calibration").fadeIn(500);
                $("#startPlay").hide();
                $(".resize-container").fadeIn(500);
                
            });

            $("#startPlay").click(function(){
                $("#keyboardLight").css({   top: (keyboardY - keyboardSY/2)* 1080/600,
                                            left: (keyboardX - keyboardSX/2)* 1920/800,
                                            width: keyboardSX* 1920/800,
                                            height: keyboardSY* 1080/600 + 1,
                                            position:'absolute'});
                $("#keyboardLight_print").css({   top: (keyboardY - keyboardSY/2)* 1080/600,
                                            left: (keyboardX - keyboardSX/2)* 1920/800,
                                            width: keyboardSX* 1920/800,
                                            height: keyboardSY* 1080/600 + 1,
                                            position:'absolute'});
                $("#keyboardLight_print").fadeIn(500);
                $("#calibration").hide();
                $("#social-box").fadeOut(500);
                $(".resize-container").hide();
                $("#play").fadeIn(500);                
                $("#backToCalibration").fadeIn(500);
                $("#footer").fadeOut(500);
            });

            $("#backToCalibration").click(function(){
                $("#social-box").fadeIn(500);
                $("#footer").fadeIn(500);
                $("#calibration").fadeIn(500);
                $(".resize-container").fadeIn(500);
                $("#play").hide(); 
                $("#backToCalibration").fadeOut(500);
                $("#keyboardLight").hide();
                $("#keyboardLight_print").hide();
            });
        });