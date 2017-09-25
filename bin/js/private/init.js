$(function(){
    window.iquu = window.iquu || window;
    
    var browser = navigator,
        user_lang = browser.language,
        browser_type = browser.userAgent,
        browser_platform = browser.platform,
        game_lang = "en-GB",
        game_name = "iQuu.io",
        game_version = "1.0.0a",
        doc = document;
    
    /* Message handling */
    msgc = {
        send: function(msg, level){
            switch(level){
                case 'log':
                    console.log('_MSG["log"]: ' + msg)
                    break;
                case 'warn':
                    console.warn('_MSG["warn"]: ' + msg)
                    break;
                case 'error':
                    console.error('_MSG["error"]: ' + msg)
                    break;
                default:
                    throw new Error(alert("Define error level"))
            }
        },
        startScript: function(){msgc.send("Starting " + game_name, 'log');},
        remove: function(){}
    }
    
    msgc.startScript();
    
    window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
        alert('Error: ' + errorMsg + '\nScript: ' + url + '\nLine: ' + lineNumber
            + '\nColumn: ' + column + '\nStackTrace: ' +  errorObj);
    }
    
    function addLoadEvent(func){
    var oldonload = window.iquu.onload;
        if (typeof window.iquu.onload != 'function') {
            window.iquu.onload = func;
        } else {
            window.iquu.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
            }
        }
    }
    addLoadEvent(function() {
        try{init()}catch(e){throw new Error(e)}
        msgc.send(window.iquu, 'log')
        app.chklang()
        app.isMobile()
    })
    
    function init(){
        /* app structure */
        app = {
            isMobile: function(){
                var mobileNav = false;

                function onResize() {
                var helpOuterBox = document.querySelector('#details');
                var mainContent = document.querySelector('#main-content');
                var mediaQuery = '(min-width: 240px) and (max-width: 420px) and ' +
                    '(max-height: 736px) and (min-height: 401px) and ' +
                    '(orientation: portrait), (max-width: 736px) and ' +
                    '(max-height: 420px) and (min-height: 240px) and ' +
                    '(min-width: 421px) and (orientation: landscape)';
                    
                    if (mobileNav != window.matchMedia(mediaQuery).matches) {
                        mobileNav = !mobileNav;

                        // Handle showing the top content / details sections according to state.
                        if (mobileNav) {
                        msgc.send(mediaQuery, 'log')
                        } else if (!mobileNav) {
                        msgc.send("Desktop", 'log')
                        } // end elseif
                    }
                }

                function setupMobileNav() {
                window.addEventListener('resize', onResize);
                onResize();
                }

                document.addEventListener('DOMContentLoaded', setupMobileNav);
            },
            i18n: function(){
                $.getJSON('new/bin/js/private/json/iquu-i18n.json',function (data){
                    var langJsonparser;
                    var language = data.languages.map(function (languages){
                        var langJsonparser = function(){
                            var levelstage = levels.stage; var levelpoints = levels.points; return[levelstage, levelpoints]
                        }
                        var langJsonparser_read = levelJsonparser(); 
                        msgc.send(levelJsonparser_read[0] + ": " + levelJsonparser_read[1], 'log')
                    });
                });
            },
            chklang: function(){
                if(user_lang != game_lang){
                    msgc.send("Language mismatch.\n{\n User language is: " + user_lang + "\n App lang is: " + game_lang + "\n}", 'warn')
                } else {
                    msgc.send("Language match", 'log')
                }
            },
            cloneLogo: function(){
                $("#logo_clone").hide().prependTo("#prependLogo").fadeIn("slow");
            },
            setTitle: function(new_content){
                var getTitle = $(doc).prop("title");
                
                if(new_content != ''){
                    $(doc).prop("title", getTitle + ' > ' + new_content)
                }
            },
            intelPause: function(bit){
                if(bit = true){
                    $(doc).mouseleave(function(e){
                        msgc.send("intelPause: true", 'warn')
                        // Decrease random_balls delay
                    }).mouseover(function(e){
                        msgc.send("intelPause: false", 'warn')
                        // Read delay of random_balls
                    })                    
                }
            }
        }
        
        /* balls structure */
        balls = {
            canvasCreateBShape: function(){
                ballcanvasid.innerHTML = "<div class=\"canvas-b\" id=\"canvas-rb\"><div id=\"prependLogo\"></div><div class=\"initial_ball\"><div class=\"logo\" id=\"logo_clone\">"+game_name+"</div><section class=\"stage\"><figure class=\"ball\"><span class=\"shadow\"></span><span class=\"iris\"></span></figure></section></div></div>";
            },
            ballstart_gradinetcoordinate: function(e){
                ballstart_div.bind("mousemove", function(e){
                    var ballwidth = $(this).width(),
                        ballheight = $(this).height(),
                        mXper = Math.round(e.pageX/ballwidth*100),
                        mYper = Math.round(e.pageY/ballheight*100),
                        gradinetXY = "radial-gradient(circle at " + mXper + "% " + mYper + "%, #fcfcfc, #d7d7d9 66%, #9b5050 100%)";
                    $(this).css("background", gradinetXY)
                    /* msgc.send(".ball: " + gradinetXY, 'log') */
                })
            },
            startTrace: function(){
                var mouseX = 0, mouseY = 0, limitX = 15, limitY = 15;

                // cache the selector
                var follower = null; 
                var xp = 0, yp = 0;

                $(window).mousemove(function(e) {
                    var $elem = $(doc.elementFromPoint(e.pageX, e.pageY));
                    
                    if($elem.attr('class') == 'canvas-b') {
                        var offset = $elem.offset();
                    
                        mouseX = Math.min(e.pageX - offset.left, $elem.width() - limitX);
                        mouseY = Math.min(e.pageY - offset.top, $elem.height() - limitY);
                        
                        if (mouseX < 0) mouseX = 0;
                        if (mouseY < 0) mouseY = 0;
                    
                        
                        // change 12 to alter damping higher is slower
                        xp += (mouseX - xp) / 2;
                        yp += (mouseY - yp) / 2;
                        
                        var loop = setInterval(function() {
                            $elem.find($('.initial_ball')).css({left:xp, top:yp}); 
                        }, 30);
                    }
                });
            },
            randomizeBallsCount: function(ballsCount){
                ballstart_div.bind("click", function(e){
                    /* Tell me how many ballsmax based on screen ratio and send message */
                    msgc.send("Max balls in count: " + ballsCount, 'warn')
                    
                    var offset = $(this).offset(),
                        relativeX = e.pageX,
                        relativeY = e.pageY;
                    
                    function shrink(element){
                        var w = "40px",
                            h = "40px";
                        $('.shadow,.iris').remove();
                        element.animate({
                            width: w,
                            height: h
                        }, 1200, function(){
                            app.cloneLogo()
                            startRandomizing()
                            balls.startTrace()
                            app.intelPause(true)
                            balls.gameLevel("start", false)
                        })
                    }
                    
                    shrink($(this));
                    
                    function startRandomizing(){
                        function makeRandomBalls(){
                            var divsize = Math.floor(Math.random()*201*Math.random(45)).toFixed();
                            var color = '#'+ Math.round(0xffffff * Math.random()).toString(16);
                            $newdiv = $('<div class=\'random_balls\' ball-color=' + color + ' ball-size=' + divsize + '/>').css({
                                'width': divsize + 'px',
                                'height': divsize + 'px',
                                'background-color': color
                            }).attr("id", 'rbp');
                            
                            var posx = (Math.random() * ($(doc).width() - divsize)).toFixed();
                            var posy = (Math.random() * ($(doc).height() - divsize)).toFixed();
                            
                            $newdiv.css({
                                'position': 'absolute',
                                'left': posx + 'px',
                                'top': posy + 'px',
                                'border-radius': '50%',
                                'display': 'none'
                            }).appendTo("#canvas-rb").fadeIn(100).delay(1200).fadeOut(400, function(){
                                $(this).remove().after(makeRandomBalls()); 
                            });
                            
                            $($newdiv).on('mouseover', function(){
                                var pointsup = $(this).attr('ball-size');
                                balls.gameLevel("pointsup", pointsup);
                            }) 
                        };
                        
                        makeRandomBalls();
                    }
                    
                })
            },
            randomizeBallxSize: function(){},
            gameLevel: function(func, pup){
                switch(func){
                    case 'start':
                        $.getJSON('bin/js/private/json/iquu-levels.json',function (data){
                            var levelJsonparser,
                                iquupresetJsonparser;
                                
                            var iquu = data.iquu_data.map(function (iquu_global){
                                var iquupresetJsonparser = function(){
                                    var type = iquu_global.type; var requestor = iquu_global.script_requestor; return[type, requestor]
                                }
                                var iquupresetJsonparser_read = iquupresetJsonparser(); 
                                msgc.send(iquupresetJsonparser_read[0] + ": " + iquupresetJsonparser_read[1], 'log')
                            });
                            /* var level = data.level1.map(function (levels){
                                var levelJsonparser = function(){
                                    var levelstage = levels.stage; var levelpoints = levels.points; return[levelstage, levelpoints]
                                }
                                var levelJsonparser_read = levelJsonparser(); 
                                msgc.send(levelJsonparser_read[0] + ": " + levelJsonparser_read[1], 'log')
                            });
                            */
                            /* if(level.length){
                                var levelJsonparser_read = levelJsonparser(); 
                                msgc.send("Levels: " + levelJsonparser_read[0], 'log')
                            } */
                        });
                        break;
                    case 'pointsup':
                        balls.levelUp(pup)
                        break;
                    default:
                        msgc.send("gamelevel: Set func variable", 'error')
                        return false;
                }
                
                function buildLevel(levelNr) {
                    var gdata = json.game_data["level:"+levelNr];
                    //check if next level exists in game_data object
                    if (!gdata) { 
                        finishGame();
                        return false;
                    }

                    //next level data exists, so build whats in it
                    //clear level from previous stuff
                    clearLevel();//perhaps replace canvas with new one

                    createBoxes( gdata.boxes);
                    createStars( gdata.stars);
                    createPlayer( gdata.player_position);

                    //everything is ready, add listeners / timers etc, and start the game
                }
            },
            levelUp: function(increasingpoints){
                ballstart_div.animate({
                    width: increasingpoints,
                    height: increasingpoints
                })
            },
            scoreBoard: function(tl){       
                $("<div class=\"scoreBoard_css\"><p>Current level:</p><p>Points:</p><p>Total Levels: " + tl + "</div>").appendTo('#canvas-rb');
            },
            getScreenRatio: function(){
                var screenWidth = $(doc).width(),
                    screenHeight = $(doc).height(),
                    max_balls_pr;
                    
                    if (screenWidth = 320){
                        max_balls_pr = 20;
                    } 
                    else if(screenWidth = 480){
                        max_balls_pr = 40; 
                    }
                    else if(screenWidth = 768){
                        max_balls_pr = 60;
                    }
                    else if(screenWidth = 992){
                        max_balls_pr = 80;
                    }
                    else if(screenWidth = 1024){
                        max_balls_pr = 100;
                    }
                    else if(screenWidth = 1200){
                        max_balls_pr = 120;
                    }
                    
                    return max_balls_pr;
            }
        }
        
        /* ball variables*/
        var ballcanvasid = doc.getElementById("app");
            ballcanvasclass = $(".canvas-b"),
            ballimage = balls.canvasCreateBShape(),
            ballstart_div = $(".ball"),
            ballstart_gradinetcoordinate = balls.ballstart_gradinetcoordinate(),
            max_balls = balls.getScreenRatio(), // TODO
            balls_count = balls.randomizeBallsCount(max_balls), // max_balls - Count ok, but to send instruction
            ballx_size = balls.randomizeBallxSize();
        
    };
});