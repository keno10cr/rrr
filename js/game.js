$(function() { 
  
    var anim_id;
    
      //saving dom objects to variables
      var container = $('#game-div');
      var trash = $('#trash_1');
      var rb_area = $('#game-rb-area');//div with all the RB
      var moveCompleted = true;
      var laneTracker = 0;
      var ft=true; //first trash.. 

  
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
      var max_lane = 4;//starts from 1
      var max_good = 5;
      var max_combo = 4; //starts from 0
      var speed = 1;
      var max_trash = 3;//handles the amount of trash needed to fill up the RB
      var timeDate = new Date();
      var game_over_speed = 1500;

      //Data Structures
      var comboUrls = ["images/combos-2.png","images/combos-3.png", "images/combos-4.png", "images/combos-5.png", "images/combos-6.png", "images/combos-7.png"];
      var timeUrls = ["images/seconds-5.png", "images/seconds-10.png", "images/seconds-15.png"];
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
          { "name":"Green", "status":false, "rb_lane":1, "space": max_trash, "rb_coordinates":"0", nImage: 'images/01_verde.png', fImage: 'images/01_verde-f.png'},
          { "name":"Blue", "status":false, "rb_lane":2, "space": max_trash, "rb_coordinates":"0", nImage: 'images/02_azul.png', fImage: 'images/02_azul-f.png'},
          { "name":"Yellow", "status":false, "rb_lane":3, "space": max_trash, "rb_coordinates":"0", nImage: 'images/03_amarillo.png', fImage: 'images/03_amarillo-f.png'},
          { "name":"Gray", "status":false, "rb_lane":4, "space": max_trash, "rb_coordinates":"0", nImage: 'images/04_gris.png', fImage: 'images/04_gris-f.png'},
          { "name":"Black", "status":false, "rb_lane":5, "space": max_trash, "rb_coordinates":"0" },
          { "name":"Red", "status":false, "rb_lane":6, "space": max_trash, "rb_coordinates":"0" },
          { "name":"Orange", "status":false, "rb_lane":7, "space": max_trash, "rb_coordinates":"0" },
          { "name":"Brown", "status":false, "rb_lane":8, "space": max_trash, "rb_coordinates":"0" }
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
      addRandomTrash();
      addRandomTrash();
      addRandomTrash();
      reAssignHelp();
      nextTrash();

      $("#reset_button").click(function() {
          $('#main_results_div').animate({'height': 0}, game_over_speed, null, function(){
              restartGame();
              $('#main_results_div').css('display', 'none');
          }); 
      });
    
      //-------------------------------------------//Change the lane of the trash//-------------------------------------------//
    
    gameInitCountDown();


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
        
          if(ft){ //sets the position of the first trash, 
            var new_lane_pos = 0;
            var first_trash=Math.floor(Math.random() * max_lane);
            new_lane_pos = recycle_bins_container.dumpsters[first_trash].rb_coordinates;
            laneTracker = first_trash;
            trashy.css('left', new_lane_pos);
            ft=false;
          }
          
           
        //document.getElementById("myoutput").innerHTML = "GW: "+ container_width + " RB1:<i>"+recycle_bins_container.dumpsters[0].rb_coordinates + "</i> RB2:<i>"+recycle_bins_container.dumpsters[1].rb_coordinates + "</i> RB3:<i>"+recycle_bins_container.dumpsters[2].rb_coordinates + "</i> RB4:<i>"+recycle_bins_container.dumpsters[3].rb_coordinates+"</i>";
        //document.getElementById("myoutput2").innerHTML = "L: "+ trash_current_left + " Speed: "+speed +" CL: "+laneTracker+" RBH: "+rb_area_height +" RBW:"+ $("#image-rb-1").width() +" B: "+ trash_current_bottom +" T: "+ trash_current_top;
        
        //635 this is near the RB 
        if (parseInt(trashy.css('top'))>=container_height){ 
          speed = 1;
          trash_info_status = true; //now it needs change because it has reached the RB... //I think I don't need this
        } 
        if (trash_current_bottom <= trash_in && my_collision == false) {
            //trash bottom possition vs Recycle Bins Heights 
            //once this validation has been done, then it won't be possible to move the trash! #todo
            my_collision = true;
            collision();

        }
        if (trash_current_bottom <= trash_away) {
            trash_current_top = -100;
            my_collision = false;
            trashy.css('left', newLane());//here is where the new Y position is being defined...
            nextTrash(); //sets the next current trash values
          }
          trashy.css('top', trash_current_top + speed); //this is what moves trash down.:
      }
    
    
    function newLane () {
      var nextRandomLane = Math.floor(Math.random() * (max_lane-1));//so that I can start couting from 0, up to 3
      laneTracker = nextRandomLane;
      var randomLaneMax = recycle_bins_container.dumpsters[nextRandomLane].rb_coordinates;//25
      
      return randomLaneMax;
      //returns a random value for the next lane 
    }
          
    function flexLanes (){
      //this method sets the new coordinates on the JSON of the RB.. TODO: move right and left according these values.
       //v2. this function will generate the lanes of the trash via an operation. this also will fill up a global object with the game coordinates
      var cont_RB=0;
      $('div', '#wrapper-table-rb').each(function () {
        cont_RB+=1;//0,1,2,3
      });
      var lane_size = container_width/cont_RB;//200
      var lane_half = lane_size/2;
      var rb_width = $("#image-rb-1").width()*0.75;
      $("#trash_1").width(rb_width);
      $("#trash_1").height(rb_width);
      for (i = 0; i < cont_RB; i++) {
        if(i==0){
          var temp= lane_half-($("#trash_1").width()/2);//esta bien
          //console.log("lane 1:"+temp); annoying
          recycle_bins_container.dumpsters[i].rb_coordinates = lane_half-($("#trash_1").width()/2);//70
          //alert(i+" New Coordinates "+ recycle_bins_container.dumpsters[i].rb_coordinates);
        }else{
          recycle_bins_container.dumpsters[i].rb_coordinates = (lane_size*i)+(lane_half-($("#trash_1").width()/2));
          //alert(i+" New Coordinates "+ recycle_bins_container.dumpsters[i].rb_coordinates);
        }  
      }
    }

    function setGameDimension(){
        //to redefine game dimension, its being called on the motor, therefor its constantly checking.
        container_width = parseInt(container.width());//game-div
        container_height = parseInt(container.height());
        flexLanes();
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
        
        //to display data on the temp console.
        //document.getElementById("myoutput4").innerHTML = "T: " + trash_info_name +" Speed: "+ trash_info_speed +" CL:  "+ trash_info_cl;
        
      
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
    
     //to display data on the temp console.
    //document.getElementById("myoutput3").innerHTML = "Desktop : "+ text;
  
  });

    function fallFaster(){
      speed = 10;
      
    }

      function toRight(trashy){
          moveCompleted = false;
          
          if(laneTracker<max_lane && laneTracker+1 !=max_lane){
            //alert("RIGHT! "+laneTracker +" Max Lane: "+max_lane);
            laneTracker ++;
            }
            trashy.animate({left: recycle_bins_container.dumpsters[laneTracker].rb_coordinates}, 100, null, function(){
              moveCompleted = true;
            });     
          
      }

    function toLeft(trashy){
      moveCompleted = false;
      
      if(laneTracker>0){
        //alert("LT TO LEFT: "+laneTracker);
        laneTracker --;
      }
        trashy.animate({left: recycle_bins_container.dumpsters[laneTracker].rb_coordinates}, 100, null, function(){
        moveCompleted = true;
      });
      
    
        
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
            imgscore.attr('src','images/puntos100.png')
        }
        if(plusscore==200){
            imgscore.attr('src','images/puntos200.png')
        }
        if(plusscore==300){
            imgscore.attr('src','images/puntos300.png')
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
    imgscore.attr('src','images/puntosmenos100.png')
  }
  if(substractscore==200){
    imgscore.attr('src','images/puntosmenos200.png')
  }
  if(substractscore==300){
    imgscore.attr('src','images/puntosmenos300.png')
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
  timeDate.setSeconds(1);
  timeDate.setMinutes(0);
  //timer.html(timeDate.toLocaleTimeString('it-IT').replace(/\u200E/g,"").substring(3,8));
  timer.html(timeDate.toLocaleTimeString('it-IT').substring(3,8));//is this the IE fix?
  setTimeout(decTime, 1000);
}

function decTime(){
  var currentSecs = timeDate.getMinutes() * 60+ timeDate.getSeconds() - 1;
  if(currentSecs < 0){
    currentSecs = 0;
    stop_the_game();
  } else {
    timeDate.setMinutes(0);
    timeDate.setSeconds(currentSecs);
    //timer.html(timeDate.toLocaleTimeString('it-IT').replace(/\u200E/g,"").substring(3,8));
    timer.html(timeDate.toLocaleTimeString('it-IT').substring(3,8));
    setTimeout(decTime, 1000);
  }
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
    cancelAnimationFrame(anim_id);
    $('#main_results_div').animate({'opacity': 'show', 'height': container.height() 
      + 5}, game_over_speed); // + 5 to alway cover the entire game div

    var results_score = $('#results_score').html() + playerscore;
    $('#results_score').html(results_score);

    getPlayer();

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
      time_to_add.push(5);
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
	$('#image-rb-' + (index + 1)).attr('src',recycle_bins_container.dumpsters[index].fImage);
  }

function takeLid(index){    
	var elements = {
		lid  : $("#image-rb-"+ (index + 1)), // get element to fly
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

	elements.lid.attr('src',recycle_bins_container.dumpsters[index].nImage);

	var cloneLid = elements.lid.clone();
	cloneLid.css('height', elements.lid.height()).css('width', elements.lid.width());
	cloneLid.attr("src", trash_bag);
	//alert("Cloned: "+cloneLid);  //meterle la imagen nueva de la basura aqui!
	cloneLid.appendTo('body').css('position','absolute').css('top',options.position.origin.initial.top)
		.css('left',options.position.origin.initial.left).css('z-index', 4);


	cloneLid.animate(
		{ top: options.position.origin.initial.top - options.position.origin.offset.y, left: options.position.origin.initial.left - options.position.origin.offset.x }, 400,
			function(){
				cloneLid.delay(100).animate(
					{ top: options.position.destination.initial.top, left: options.position.destination.initial.left, width: '20px', height: '20px' }, 750, null,
						function(){
							cloneLid.fadeOut(500, function(){
								elements.timer.effect( "bounce", "slow" );
							});
						});
					});
  
}

//Combo Functionalities
  function incCombo(){
        cont_combo++;
    
    if (cont_combo % max_good == 0) { //5 good throws in a row will increase the combo.
        if(cont_multiplicador<=max_combo){ //max combo, starts counting from 0 so 4=5
           cont_multiplicador++;
        }
        //validate not going over x5 combo
        imgCombo.attr('src', comboUrls[cont_multiplicador-2]); //the -2 its because at cont_mult at 2 that will mean to display the img from comboUrls at position 0.
        
    }
    
    //to display data on the temp console.
    //document.getElementById("myoutput5").innerHTML = "Current Strike: "+cont_combo;
  }

  function resetCombo(){
    cont_combo=0;
    cont_multiplicador=1;
    //alert ("Combo reiniciado a "+cont_multiplicador);
    imgCombo.attr('src', ""); //the -2 its because at cont_mult at 2 that will mean to display the img from comboUrls at position 0.
  }

  function restartGame(){ // needs refinement
      playerscore = 0;
      trash.css('top', -100);
      for(var i = 0; i < max_lane; i ++){
        recycle_bins_container.dumpsters[i].space = max_trash;
        $('#recycle_full_'+i).css('visibility', 'hidden');
      }
      resetCombo();

      addRandomTrash();
      addRandomTrash();
      addRandomTrash();
      reAssignHelp();
      nextTrash();    
      gameInitCountDown();
      $('#results_score').html("Score: ");

    }

    function gameInitCountDown(){
    	var counter = $('#startCounter');
    	counter.html('3');
    	counter.css('visibility', 'visible');
    	setTimeout(function(){
    		counter.html('2');
    		setTimeout(function(){
    			counter.html('1');
    			setTimeout(function(){
    				counter.html('0');
    				anim_id = requestAnimationFrame(repeat);
      				initTimer();
      				counter.css('visibility', 'hidden');
    			}, 1000)
    		},1000)
    	},1000)
    }


  
  }); //end main function
  
  
  
  //REF
  //jQueryAnimate //https://www.w3schools.com/jquery/jquery_animate.asp
  //Json Arrays //https://www.w3schools.com/js/js_json_arrays.asp


function getPlayer(){
	var test = "A8RZYZZ3";
	const http = new XMLHttpRequest();
	const url='http://localhost:3001/getUser/A8RZYZZ3';
	http.open("GET", url);
	http.send();
	http.onreadystatechange= function(){
		if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
			var jsonResponse = JSON.parse(http.responseText);
			if(!jsonResponse.length){
				console.log("add new player");
				insertPlayer();
			} else {
				var player = jsonResponse[0];
				if(player.high_score < playerscore){
					player.high_score = playerscore;
				}

				player.total_trash = player.total_trash + 10 // aqui seria el acumulado de trash correct?

				//updatePlayer
				//load highscores
			}
	  	}
	}
}


function insertPlayer(){
	var params = 'u_id='+'A8RZYZZ4'+'&high_score='+236+'&total_trash='+20; // aqui seria el acumulado de trash correct?
	console.log(params);
	const http = new XMLHttpRequest();
	const url='http://localhost:3001/createUser';
	http.open("POST", url, true);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(params);
	http.onreadystatechange= function(){
		if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
			console.log(http.responseText);
	  	}
	}

}

function updatePlayer(){
    var params = 'u_id='+'A8RZYZZ4'+'&high_score='+236+'&total_trash='+20; // aqui seria el acumulado de trash correct?
    console.log(params);
    const http = new XMLHttpRequest();
    const url='http://localhost:3001/updateUser';
    http.open("POST", url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
    http.onreadystatechange= function(){
        if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
            console.log(http.responseText);
        }
    }

}

function getHighScores(){
    const http = new XMLHttpRequest();
    const url='http://localhost:3001/getHghscores?amount=' + 10; // valor alambrado, se puede cambiar
    http.open("GET", url, true);
    http.send(params);
    http.onreadystatechange= function(){
        if(http.readyState === XMLHttpRequest.DONE && http.status === 200) {
            var jsonResponse = JSON.parse(http.responseText);
            // loopear en el array de highscores, vienen en orden
        }
    }
}

