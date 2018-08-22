$(function() { 
  
    var anim_id;
    
      //saving dom objects to variables
      var container = $('#game-div');
      var trash = $('#trash_1');
      var rb_area = $('#game-rb-area');//div with all the RB
      var moveCompleted = true;
      var laneTracker = 0;
  
      var cont_combo = 0;//counts the no missing strike
      var cont_multiplicador = 1;//counts the combo
    
      var playerscore = 0;
      var playerscorehtml= $('#playerscore');
      var visual_help_1 = $('#guide_1');
      var visual_help_2 = $('#guide_2');
      var visual_help_3 = $('#guide_3');
      var timer = $('#time');
      var extraTimeImage = $('#extraTimeImage');
      var imgscore= $('#imgscore');
      var scorecontainer= $('#scorecontainer');
      var imgCombo= $('#imgCombo');
    
      //saving some initial setup
      var container_left = parseInt(container.css('left'));
      var my_collision = false;
      var container_width = 0;
      var container_height = 0;
      var trash_width = parseInt(trash.width());
      var trash_height = parseInt(trash.height());
    
      //some other declarations
      var game_over = false;
      var max_lane = 4;
      var max_good = 5;
      var max_combo = 4; //starts from 0
      var speed = 1;
      var max_trash = 3;//handles the amount of trash needed to fill up the RB
      var timeDate = new Date();

      //Data Structures
      var comboUrls = ["https://image.ibb.co/gvGUJo/combos_2.png","https://image.ibb.co/eGjGyo/combos_3.png", "https://image.ibb.co/isYWW8/combos_4.png", "https://image.ibb.co/fSiWW8/combos_5.png", "https://image.ibb.co/enBJB8/combos_6.png", "https://image.ibb.co/g7rwyo/combos_7.png"];
      var timeUrls = ["https://image.ibb.co/eLDFr8/seconds_5.png", "https://image.ibb.co/iza6yo/seconds_10.png", "https://image.ibb.co/iXX8B8/seconds_15.png"];
      var trash_container = {
        "trash": [
           //{ "name":"Eaten Apple", "speed":2, "url": "images/trash/01_eaten_apple_game.png", "correct_lane":0, "visual_guide":"images/trash/01_eaten_apple.png"},
           //{ "name":"Plastic Bottle", "speed":3, "url": "images/trash/02_plastic_bottle_game.png", "correct_lane":1, "visual_guide":"images/trash/02_plastic_bottle.png"},
          //{ "name":"Aluminum Can", "speed":2, "url": "images/trash/03_lata_game.png", "correct_lane":2, "visual_guide":"images/trash/03_lata.png"},
          //{ "name":"Paper Ball", "speed":1, "url": "images/trash/04_paper_ball_game.png", "correct_lane":3, "visual_guide":"images/trash/04_paper_ball.png"},
          { "name":"apple", "speed":1, "url": "images/trash/01_apple_game.png", "correct_lane":0, "visual_guide":"images/trash/01_apple.png"},
          { "name":"banana", "speed":2, "url": "images/trash/01_banana_game.png", "correct_lane":0, "visual_guide":"images/trash/01_banana.png"},
          { "name":"sandia", "speed":3, "url": "images/trash/01_sandia_game.png", "correct_lane":0, "visual_guide":"images/trash/01_sandia.png"},
          { "name":"botella", "speed":3, "url": "images/trash/02_botella_game.png", "correct_lane":1, "visual_guide":"images/trash/02_botella.png"},
          { "name":"botellon", "speed":2, "url": "images/trash/02_botellon_game.png", "correct_lane":1, "visual_guide":"images/trash/02_botellon.png"},
          { "name":"juice_box", "speed":1, "url": "images/trash/02_juice_box_game.png", "correct_lane":1, "visual_guide":"images/trash/02_juice_box.png"},
          { "name":"beans_can", "speed":3, "url": "images/trash/03_beans_can_game.png", "correct_lane":2, "visual_guide":"images/trash/03_beans_can.png"},
          { "name":"soda", "speed":1, "url": "images/trash/03_soda_game.png", "correct_lane":2, "visual_guide":"images/trash/03_soda.png"},
          { "name":"tuna_can", "speed":2, "url": "images/trash/03_tuna_can_game.png", "correct_lane":2, "visual_guide":"images/trash/03_tuna_can.png"},
          { "name":"carton_bag", "speed":1, "url": "images/trash/04_carton_bag_game.png", "correct_lane":3, "visual_guide":"images/trash/04_carton_bag.png"},
          { "name":"carton_box", "speed":3, "url": "images/trash/04_carton_box_game.png", "correct_lane":3, "visual_guide":"images/trash/04_carton_box.png"},
          { "name":"folders", "speed":2, "url": "images/trash/04_folders_game.png", "correct_lane":3, "visual_guide":"images/trash/04_folders.png"},

        ]
      }; //contains everything I need to know about the trash to display it randomly or by type
      //correct lane starts at 0.

      var trash_bag = "images/trash/Trash_Bag_Black.png";
  
      var recycle_bins_container = {
        "dumpsters": [
          { "name":"Green", "status":false, "rb_lane":1, "space": max_trash },
          { "name":"Blue", "status":false, "rb_lane":2, "space": max_trash },
          { "name":"Yellow", "status":false, "rb_lane":3, "space": max_trash },
          { "name":"Gray", "status":false, "rb_lane":4, "space": max_trash },
          { "name":"Black", "status":false, "rb_lane":5, "space": max_trash },
          { "name":"Red", "status":false, "rb_lane":6, "space": max_trash },
          { "name":"Orange", "status":false, "rb_lane":7, "space": max_trash },
          { "name":"Brown", "status":false, "rb_lane":8, "space": max_trash }
        ]
      }; //contains the info of the RB

      var trash_helper = [];
      var time_to_add = [];
  
      //this is the info of the current falling trash
      var trash_info_name = "";
      var trash_info_speed = 0;
      var trash_info_url = "";
      var trash_info_cl = 0; //correct lane
      var trash_info_status = true; //if it needs change or not
  
      //This is like an init to set up the initial values of the visual aid.      
      setLidsHTML();
      addRandomTrash();
      addRandomTrash();
      addRandomTrash();
      reAssignHelp();
      nextTrash();
    
      //-------------------------------------------//Change the lane of the trash//-------------------------------------------//
    
    anim_id = requestAnimationFrame(repeat);
    initTimer();


    /*MOTOR!!!*/
    function repeat() {
  
        trash_down(trash);
        anim_id = requestAnimationFrame(repeat);
      }
    
    //FUNCTION TO BE REPEATED - TRASH DOWN //This is the loop/engine
      function trash_down(trashy) {
        //trashy handles the movement of elements with the CSS atrributes
          var trash_current_top = parseInt(trashy.css('top'));
          var trash_current_bottom = parseInt(trashy.css('bottom'));
          var trash_current_left = parseInt(trashy.css('left'));
          var rb_area_height = parseInt(rb_area.height());
          var trash_in = rb_area_height-(rb_area_height*0.4); //.4 of the trash is inside the RB
          var trash_away = rb_area_height-(rb_area_height*0.7);//.7 of the trash is inside the RB
          setGameDimension();
        
        document.getElementById("myoutput").innerHTML = "container height: "+ container_height;
        document.getElementById("myoutput2").innerHTML = "Bottom: "+ trash_current_bottom +" Top: "+ trash_current_top +" Left: "+ trash_current_left + " Speed: "+speed +" CL: "+laneTracker+" RBH: "+rb_area_height;
        
        //635 this is near the RB 
        if (parseInt(trashy.css('top'))>=container_height){ 
          speed = 1;
          trash_info_status = true; //now it needs change because it has reached the RB... //I think I don't need this
        } 
        if (trash_current_bottom <= trash_in && my_collision == false) {
            //trash bottom possition vs Recycle Bins Heights 
            //alert('K');//once this validation has been done, then it won't be possible to move the trash! #todo
            my_collision = true;
            collision();

        }
        if (trash_current_bottom <= trash_away) {
            //alert("entro");
              trash_current_top = -100;
              my_collision = false;
              var trash_left = parseInt(Math.random() * (container_width - trash_width));
            //container width = 368
            
            //document.getElementById("myoutput3").innerHTML = "New Lane: 50 ";
            
             // trashy.css('left', trash_left);
             trashy.css('left', newLane(container_width, max_lane));
                                                            //here is where the new Y position is being defined...
            //trashy.css('left', 50);
            nextTrash(); //sets the next current trash values
          }
          trashy.css('top', trash_current_top + speed);
      }
    
    
    function newLane (game_max_width, max_lane) {
      //alert ("max width: " +game_max_width);//332
      var laneSize = Math.floor(game_max_width/max_lane);//55.3
      var nextRandomLane = Math.floor(Math.random() * max_lane);//nums from 0 up to 5/8
      //alert ("Next Random Lane: " + nextRandomLane);//
      var randomLaneMax = laneSize * nextRandomLane; //6 * 55.3
      
      laneTracker = nextRandomLane;
      return randomLaneMax;
      //returns a random value for the next lane
      
    }

    function setGameDimension(){
        //to redefine game dimension, its being called on the motor, therefor its constantly checking.
        container_width = parseInt(container.width());
        container_height = parseInt(container.height());
    }
    
    function nextTrash () {
    
        trash_info_name = trash_helper[0].name;
        trash_info_speed = trash_helper[0].speed;
        trash_info_url = trash_helper[0].url;
        trash_info_cl = trash_helper[0].correct_lane;
        speed = trash_info_speed;
        
        //trash_helper.shift()
        trash_helper.shift();
        addRandomTrash();
        //alert(trash_helper[0].name + trash_helper[1].name + trash_helper[2].name   )
        
        //document.getElementById("trash_1").width = "66";
        //document.getElementById("trash_1").height = "66";
        document.getElementById("trash_1").style.backgroundImage = "url('"+trash_info_url+"')";
        document.getElementById("myoutput4").innerHTML = "T: " + trash_info_name +" Speed: "+ trash_info_speed +" CL:  "+ trash_info_cl;
      
        reAssignHelp()
    }
    
    function addRandomTrash(){
      var nextRandomTrash = Math.floor(Math.random() * trash_container.trash.length);//Empieza en 1 //Hay 4 para version 1
      trash_helper.push(trash_container.trash[nextRandomTrash]);
    }
    
    function reAssignHelp(){
      visual_help_1.attr("src", trash_helper[0].visual_guide);
      visual_help_2.attr("src", trash_helper[1].visual_guide);
      visual_help_3.attr("src", trash_helper[2].visual_guide);
    }
  
  document.addEventListener("keydown", function(){
  //tracks any keydown from the keyboard
    var inputKey = uniKeyCode(event);
    switch(inputKey) {
      case 39:  
      case 68:
          text = "Change to Right Lane";
        if (moveCompleted){
          toRight(trash);  
        }  
        
          //trashy.css('left', container_width+66);
        break;
      case 37:
      case 65:
          text = "Change to Left Lane";
        if (moveCompleted){
          toLeft(trash);  
        }    
        break;
      case 38:
      case 87:
          text = "Activate Power Up";
          empty_trash();
        break;
      case 40:
      case 83:
          text = "Make fall faster";
          fallFaster(trash);
        break;
      case 32:
      case 13:
         text = "Empty RB";
        break;
        default:
         text = "Somethings is wrong";
    } // close switch keydown
    document.getElementById("myoutput3").innerHTML = "Desktop : "+ text;
  
  });

    function fallFaster(){
      speed = 10;
      
    }
  
  function toRight(trashy){
      var trash_current_left = parseInt(trashy.css('left'));
      
      //alert(trash_current_right); //this works
      //alert(container_width);//331
      var laneSize = Math.floor(container_width/max_lane);//55.3
      var maxLaneY = Math.floor(laneSize*(max_lane-1)); //its the last columb or lane to the right //275
      if(trash_current_left < maxLaneY){
        //trashy.css('left', trash_current_left+laneSize); //old way to move via css\
        moveCompleted = false;
        trashy.animate({left: trash_current_left+laneSize}, 100, null, function(){
          moveCompleted = true;
        }); //jquery way to move via csss
        //alert("current left: "+trash_current_left+"max left "+maxLaneY);
        laneTracker ++;
        //alert ("new lane: "+laneTracker);
      }
  }
  
      function toLeft(trashy){
        var trash_current_left = parseInt(trashy.css('left'));
        //alert(trash_current_right); //this works
        //alert(container_width);//331
        var laneSize = Math.floor(container_width/max_lane);//55
        var maxLaneY = Math.floor(laneSize*(max_lane-1)); //its the last columb or lane to the right //275
        var minLaneY = 0; //its the last columb or lane to the right //275
        if(trash_current_left > minLaneY){
            //trashy.css('left', trash_current_left-laneSize); 
            moveCompleted = false;
            trashy.animate({left: trash_current_left-laneSize}, 100, null, function(){
            moveCompleted = true;
            });
            //alert("current left: "+trash_current_left+"max left "+maxLaneY);
            laneTracker --;
            //alert ("new lane: "+laneTracker);
        }
    }
  
  
  function uniKeyCode(event) {
  //returns the value of the key pressed
    var key = event.keyCode;
    //document.getElementById("myActions").innerHTML = "Pressed Key " + key;
  return key;
  }
  
  function collision() {
    //check if trash is on the right lane at the moment of the collision.:
    if(laneTracker == trash_info_cl && !is_full_bin(trash_info_cl)){
        //trash is in the correct lane.:
        //alert("+ Puntos: " + trash_info_speed * 100)
        incCombo();
        setIncresePoints ( trash_info_speed * 100);
        add_trash(trash_info_cl);
        
        $( "#image-rb-"+(trash_info_cl+1) ).effect( "bounce", {times:3}, "down", 420); //this will bounce the wrong RB
    }else{
        //trash is not in the correct lane.:
        //alert("- Puntos: " + trash_info_speed * 100)
        var max_points = 400;
        resetCombo();
        setReducePoints ( max_points - (trash_info_speed * 100));
        $( "#image-rb-"+(laneTracker+1) ).effect( "shake", {times:3}, "down", 420); //this will shake the wrong RB
    }

    playerscorehtml.text(parseInt(playerscore));
  }


    function setIncresePoints(plusscore)   {
        var scorecontainer= $('#scorecontainer'); // div con tag de imagen
        var imgscore= $('#imgscore'); //imagen
        
        if(plusscore==100){
            imgscore.attr('src','https://image.ibb.co/c0KGyo/puntos100.png')
        }
        if(plusscore==200){
            imgscore.attr('src','https://image.ibb.co/esHrW8/puntos200.png')
        }
        if(plusscore==300){
            imgscore.attr('src','https://image.ibb.co/jMz5r8/puntos300.png')
        }
        
        if(cont_multiplicador>=2){
            playerscore+=plusscore*cont_multiplicador;   
            console.log("x "+cont_multiplicador +" suma: "+ plusscore*cont_multiplicador);
        }else{
            playerscore+=plusscore;
        }
        scorecontainer.fadeIn(100);
        scorecontainer.fadeOut(1000);
    }

  function setReducePoints(substractscore)   {
  
  if(substractscore==100){
    imgscore.attr('src','https://image.ibb.co/isL6yo/puntosmenos100.png')
  }
  if(substractscore==200){
    imgscore.attr('src','https://image.ibb.co/eA7myo/puntosmenos200.png')
  }
  if(substractscore==300){
    imgscore.attr('src','https://image.ibb.co/cs0jjT/puntosmenos300.png')
  }
  
  scorecontainer.fadeIn(1000);
    if(substractscore>playerscore){
        playerscore=0;
    }else{
        playerscore-= substractscore;
    }
  scorecontainer.fadeOut(1000);
}


//Time Functions
function initTimer(){
  timeDate.setSeconds(0);
  timeDate.setMinutes(1);
  //timer.html(timeDate.toLocaleTimeString('it-IT').replace(/\u200E/g,"").substring(3,8));
  timer.html(timeDate.toLocaleTimeString('it-IT').substring(3,8));//is this the IE fix?
  setTimeout(decTime, 1000);
}

function decTime(){
  var currentSecs = timeDate.getMinutes() * 60 + timeDate.getSeconds() - 1;
  if(currentSecs < 0){
    currentSecs = 0;
    stop_the_game();
  }
  timeDate.setMinutes(0);
  timeDate.setSeconds(currentSecs);
  //timer.html(timeDate.toLocaleTimeString('it-IT').replace(/\u200E/g,"").substring(3,8));
  timer.html(timeDate.toLocaleTimeString('it-IT').substring(3,8));
  setTimeout(decTime, 1000);
}

function addTime(plusTime){
  extraTimeImage.attr("src", timeUrls[plusTime/5-1]);
  var currentSecs = timeDate.getMinutes() * 60 + timeDate.getSeconds() + plusTime;
  timeDate.setMinutes(0);
  timeDate.setSeconds(currentSecs);
  //timer.html(timeDate.toLocaleTimeString('it-IT').replace(/\u200E/g,"").substring(3,8));
  timer.html(timeDate.toLocaleTimeString('it-IT').substring(3,8));
  extraTimeImage.animate({width:"50px", height:"25px"}, 400, null, function(){
    setTimeout(function(){extraTimeImage.animate({width:"0px", height:"0px"}, 400, null, function(){
      var time = time_to_add.pop();
      if(time){
        addTime(time);
      }
    })}, 500);
  });
}

//Stop Game
function stop_the_game() {
    game_over = true;
    cancelAnimationFrame(anim_id);
    //restart_div.slideDown();
    //restart_btn.focus();
}

function add_trash(bin_index){
  var trash_bin = recycle_bins_container.dumpsters[bin_index];
  trash_bin.space--;
  if(is_full_bin(bin_index)){
    putLid(bin_index);
  }
}

function empty_trash(){
  var trash_emptied = false;
  for(var i = 0; i < recycle_bins_container.dumpsters.length; i++){
    if(is_full_bin(i)){
      takeLid(i);
      time_to_add.push(15);
      recycle_bins_container.dumpsters[i].space = max_trash;
      trash_emptied = true;
    }
  }
  
  if(trash_emptied){
    addTime(time_to_add.pop());
  }
  
}

function is_full_bin(bin_index){
  return !recycle_bins_container.dumpsters[bin_index].space;
}

function putLid(index){
    var laneSize = Math.floor(container_width/max_lane);
    var lid_html = $('#recycle_full_' + index);
    lid_html.css('left',laneSize * index + 2);
    lid_html.css('bottom', 7);
    lid_html.css('visibility', 'visible');
  }

function takeLid(index){    
  var elements = {
    lid  : $("#recycle_full_"+ index), // get element to fly
    timer : $('#time') // get destination
  };

  var options = {
    position : {
      origin: {
          // get initial position on document
        initial: elements.lid.offset(),
          // amout of pixels to move the cloned element from the original before moving to timer
        offset: { x: 5, y: 15 }
      },
      destination: {
          // get initial position on document
        initial: elements.timer.offset()
      }
    }
  };
  
  var cloneLid = elements.lid.clone();
  cloneLid.attr("src", trash_bag);
  //alert("Cloned: "+cloneLid);  //meterle la imagen nueva de la basura aqui!
  cloneLid.appendTo('body').css('position','absolute').css('top',options.position.origin.initial.top)
    .css('left',options.position.origin.initial.left);

  
  elements.lid.css('visibility', 'hidden');
  
 cloneLid.animate(
      { top: options.position.origin.initial.top - options.position.origin.offset.y, left: options.position.origin.initial.left - options.position.origin.offset.x }, 400,
      function(){
        cloneLid.delay(100).animate(
          { top: options.position.destination.initial.top, left: options.position.destination.initial.left, width: '20px', height: '20px' }, 750, null,
          function(){
            cloneLid.fadeOut(500, function(){
              elements.timer.effect( "bounce", "slow" );
            });
          }
        );
      }
    );
  
}

 function setLidsHTML(){
  var trash_lids = $('#trash_lids');
  var innerHTML = "";
  for(var i = 0; i < max_lane; i++){
    innerHTML+= '<img id="recycle_full_'+i+'" src="https://image.ibb.co/nkVOdo/basura_llena.png" class="fullTrash">';
  }
  trash_lids.html(innerHTML);
}
  

//Combo Functionalities
  function incCombo(){
        cont_combo++;
    
    if (cont_combo % max_good == 0) { //5 good throws in a row will increase the combo.
        if(cont_multiplicador<=max_combo){ //max combo, starts counting from 0 so 4=5
           cont_multiplicador++;
        }
        //validate not going over x5 combo
        //alert ("Combo x"+cont_multiplicador);
        imgCombo.attr('src', comboUrls[cont_multiplicador-2]); //the -2 its because at cont_mult at 2 that will mean to display the img from comboUrls at position 0.
        
    }
    document.getElementById("myoutput5").innerHTML = "Current Strike: "+cont_combo;
  }

  function resetCombo(){
    cont_combo=0;
    cont_multiplicador=1;
    //alert ("Combo reiniciado a "+cont_multiplicador);
    imgCombo.attr('src', ""); //the -2 its because at cont_mult at 2 that will mean to display the img from comboUrls at position 0.
  }


  
  }); //end main function
  
  
  
  //REF
  //jQueryAnimate //https://www.w3schools.com/jquery/jquery_animate.asp
  //Json Arrays //https://www.w3schools.com/js/js_json_arrays.asp