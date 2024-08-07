import imageDrag from "./img-drag.js";
import TextTyper from "./texttyper.js";

//disable right click
document.addEventListener('contextmenu', event => event.preventDefault());

function el(selector){
    return document.querySelector(selector);
}
function els(selector){
    return document.querySelectorAll(selector);
}
function els_act(selector,action){
    let elems = els(selector);
    Array.from(elems).forEach(action);
}

function shuffle(array_or_object) {
    let keys = Object.keys(array_or_object);
    let targetIndex = array_or_object.length;
    let randomIndex;
    // let targetKey;
    // let randomKey;
    // While there remain elements to shuffle.
    while (targetIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * targetIndex);
        targetIndex--;
        // targetKey = keys[targetIndex];
        // randomKey = keys[randomIndex];
        // And swap it with the current element.
        let temp = array_or_object[targetIndex];
        array_or_object[targetIndex] = array_or_object[randomIndex];
        array_or_object[randomIndex] = temp;
    }
    return array_or_object;
}

function fadein(el, time=2, on_fade_in=null){
    el.style.transition = `filter ${time}s`;
    el.style.filter = 'opacity(0)';
    setTimeout(e=>{
        el.style.filter = 'opacity(1)';
    },100);
    setTimeout(on_fade_in, time*1000+100);
}
function fadeout(el, time=2, on_fade_out=null){
    el.style.transition = `filter ${time}s`;
    el.style.filter = 'opacity(1)';
    setTimeout(e=>{el.style.filter = 'opacity(0)';},100);
    setTimeout(on_fade_out, time*1000+100);
}
  

window.model_room = PetiteVue.reactive({
    init: ()=>{
        console.log('init');
        model_room.animation_start();
    },
    vshow:{
        startgame: false,
        1: false,//room scenario 1
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        imglockscreen: true,
        result: false,
        room: false,
        video: false,
        story: false,
        question: false,
        img: false,
        imgs1lockscreen: false,
        imgs1wapopup: false,
        imgs1wabg: false,
        imgs1waopen1: false,
        imgs1waopen2: false,
        imgs2lockscreen: false,
        imgs2emailpopup: false,
        imgs2emailopenbg: false,
        imgs2bgquestion: false,
        imgs3call: false,
        imgs3phoneicon: false,
        imgs3callbg: false,
        imgs4adsbg: false,
        imgs4adsimg: false,
        imgs4adspopup: false,
        imgs4questionbox: false,
        imgs5lockscreen: false,
        forcereset: false,
    },
    room_id: "startgame",//room 0 : start
    score: 0,//current score
    questions: {
        1: {
            question: "Apa yang akan kamu lakukan?",
            choices: [
                {0: "Klik bukti pengiriman paket"},
                {0: "Membalas chat pesan"},
                {100: "Tidak menjawab pesan"},
            ],
        },
        2: {
            question: "Kamu bakal ambil langkah apa?",
            choices: [
                {0: "Isi form data diri"},
                {0: "Klik link formulir"},
                {100: "Report as spam"},
            ],
        },
        3: {
            question: "Kamu bakal ambil langkah apa?",
            choices: [
                {0: "Membiarkan lanjut bicara"},
                {0: "Setuju dengan penawaran"},
                {100: "Langsung tutup telepon"},
            ],
        },
        4: {
            question: "Apa yang akan kamu lakukan?",
            choices: [
                {0: "Langsung klik iklan"},
                {0: "Share iklan ke teman"},
                {100: "Abaikan dan tutup iklan"},
            ],
        },
        5: {
            question: "Apa yang akan kamu lakukan?",
            choices: [
                {0: "Segera klik link aktivasi"},
                {0: "Berikan nomor kartu kredit"},
                {100: "Blok nomor pengirim pesan"},
            ],
        },
        6: {
            question: "Apa yang akan kamu lakukan?",
            choices: [
                {0: "Klik tombol &quot;view&quot;"},
                {0: "Forward pesan"},
                {100: "Blok nomor pengirim"},
            ],
        },
    },
    get_current_question: ()=>{
        //get current questions based on current room_id
        try{
            return model_room.questions[model_room.room_id];
        }catch(e){
            return {question:'',choices:[]};
        }
    },
    get_current_choices_shuffled: ()=>{
        console.log('dipanggil lo');
        try{
            shuffle(model_room.get_current_question().choices);
            return model_room.get_current_question().choices;
        }catch(e){
            return [];
        }
    },
    choice_select(choice){
        let additional_score = Object.keys(choice)[0];
        model_room.score += parseInt(additional_score);
        el('#question-box').classList.add('show-hint');
        setTimeout(()=>{
            el('#question-box').classList.remove('show-hint');
            model_room.next_question();
        }, 2000);
    },
    // room_situation_queue: [1,2,3,4,5,6],
    room_situation_used: [1,4,5,6],
    room_situation_queue: [], // will be Array.from(room_situation_used) on init/reset
    next_question(){
        model_room.vshow[model_room.room_id] = false;//hide previous room
        //set room_id to the next unseen room, and start animation
        model_room.vshow.questionbox = false;

        if (model_room.room_situation_queue.length>0){
            shuffle(model_room.room_situation_queue);
            let target_room_s_id = 
                model_room.room_situation_queue.pop();
            model_room.room_id = target_room_s_id;
            model_room.animation_scene = 0;
            model_room.animation_start();
        }else{
            console.log(model_room.score);
            model_room.room_id = 'result';
            model_room.animation_scene = 0;
            model_room.animation_start();
        }
        el('#audios3-call').pause();
        el('#audios3-call').currentTime = 0;
        model_room.idle_reset();
    },
    temp: null,//temporary variable
    animation_time_start: 0,
    animation_start: ()=>{

        model_room.animation_time_start = new Date().getTime() / 1000;
        try{clearInterval(window.animation_interval);}catch(e){}
        window.animation_interval = setInterval(
            ()=>{model_room.story_loop[model_room.room_id]()},
            200
        )
    },
    animation_stop: ()=>{
        clearInterval(window.animation_interval);
    },
    animation_scene: 0,
    imgPhoneEvent: {
        mouse:0,
        touch:0
    },
    idle_checker: 0,
    idle_reset(){
        console.log('cancel reset, reset in 120s');
        clearTimeout(model_room.idle_checker);
        model_room.idle_checker = setTimeout(()=>{
            model_room.story_reset();
        },120*1000);
    },
    reset_time: 0,
    story_reset: ()=>{
        let current_time = new Date().getTime()/1000;
        if (current_time-model_room.reset_time<5){
            console.log("will not reset repeatedly");
            return;
        }
        model_room.score = 0;
        model_room.reset_time = current_time;
        console.log('reset');
        model_room.room_situation_queue = Array.from(model_room.room_situation_used);
        if (typeof(window.forceroomid_set)=='undefined'){
            try {
                let forceroomid = parseInt(
                    document.location.hash.replace('#','')
                );
                if (
                    isNaN(forceroomid)
                    || typeof(window.forceroomid_set)!='undefined'
                ){}
                else {
                    // model_room.room_id = forceroomid;
                    model_room.room_situation_queue = [forceroomid];
                }
                if (document.location.hash=='#result'){
                    model_room.room_situation_queue = [5];
                }
                window.forceroomid_set = true;
            }catch(e){}
        }
        for (let key in model_room.vshow){
            model_room.vshow[key] = false;
        }
        model_room.vshow.imglockscreen = true;
        model_room.room_id = 'startgame';
        model_room.animation_scene = 0;

        el('#room-start').style.filter = 'opacity(1)';
        el('#room-start').style.top = '0vh';
        el('#imgs4-adsimg').style.filter = 'none';
        el('#result-bg').style.filter = 'none';
        el('#result-call0').style.filter = 'opacity(1)';
        el('#img-start-circle').style.left = '12vw';
        el('#imgs3-phoneicon').style.left = '10.5vw';
        el('#result-subtitle').style.filter = 'none';
        model_room.animation_start();
    },
    story_reset_timer: 60,
    story_loop:{
        startgame: ()=>{
            //start game
            model_room.vshow.startgame = true;
            el('#room-start').style.filter = 'opacity(1)';
            model_room.animation_stop();
            var imgCircle = document.getElementById('img-start-circle');
            let next_room = function(){
                imgCircle.removeEventListener('click', next_room);
                imgCircle.removeEventListener('touchstart', next_room);
                imgCircle.style.left = '72vw';
                el('#room-start').style.top = '-100vh';
                setTimeout(()=>{
                    model_room.vshow.startgame = false;
                    model_room.next_question();
                },1000);
            };
            imageDrag(imgCircle, 12, 72, next_room);
        },
        1: ()=>{
            //situation 1
            model_room.vshow[model_room.room_id] = true;
            model_room.vshow.imgs1lockscreen = true;
            model_room.vshow.imgs1wapopup = true;
            if (model_room.animation_scene==0){
                // el(`#room-s${model_room.room_id}`).style.top = "100vh";
                // el(`#room-s${model_room.room_id}`).style.transition = "top 0.5s";
                // setTimeout(()=>{
                //     el(`#room-s${model_room.room_id}`).style.top = "0vh";
                // },500);
                model_room.animation_stop();
                let wapopup = el('#imgs1-wapopup');
                // wapopup.outerHTML = wapopup.outerHTML;//reset event listener
                // wapopup = el('#imgs1-wapopup');
                model_room.vshow.imgs1wapopup = true;
                el('#audio-notif').play();
                let room1 = el('#room-s1');
                fadein(room1, 2);

                let force_scene1;
                force_scene1 = function(){
                    clearTimeout(model_room.temp);
                    wapopup.removeEventListener('click', force_scene1);
                    wapopup.removeEventListener('touchstart', force_scene1);
                    model_room.animation_scene = 1;
                    model_room.animation_start();
                    console.log('triggered');
                }
                //trigger next scene by timeout
                model_room.temp = setTimeout(force_scene1, 3000);
                //or trigger next scene by click
                wapopup.addEventListener('click', force_scene1);
                wapopup.addEventListener('touchstart', force_scene1);
            }
            else if (model_room.animation_scene==1){
                //showing the whatsapp
                model_room.animation_stop();

                let wa_bg = el('#imgs1-wabg');
                model_room.vshow.imgs1wabg = true;
                fadein(wa_bg, 0.5);
                setTimeout(()=>{
                    model_room.vshow.imgs1waopen1 = true;
                    el('#audio-wa').play();
                },500);
                setTimeout(()=>{
                    model_room.vshow.imgs1waopen2 = true;
                    el('#audio-wa').play();
                    model_room.animation_scene = 2;
                    model_room.animation_start();
                },1000);
            }
            else if (model_room.animation_scene==2){
                //show answer choices
                model_room.animation_stop();
                model_room.vshow.questionbox = true;
                new TextTyper('#question-box .question-text',30);
                els_act('#question-box .choice',(elem,index)=>{
                    elem.style.display = 'none';
                    setTimeout(()=>{
                        elem.style.display = 'list-item';
                    }, (3+index)*400)
                });
            }
        },
        2: ()=>{
            //situation 2
            model_room.vshow[model_room.room_id] = true;
            model_room.animation_stop();
            if (model_room.animation_scene==0){
                // el(`#room-s${model_room.room_id}`).style.top = "100vh";
                // el(`#room-s${model_room.room_id}`).style.transition = "top 0.5s";
                // setTimeout(()=>{
                //     el(`#room-s${model_room.room_id}`).style.top = "0vh";
                // },500);
                model_room.vshow.questionbox = false;
                model_room.vshow.imgs2lockscreen = true;
                let lockscreen = el('#imgs2-lockscreen');
                fadein(lockscreen, 1);
                let emailpopup = el('#imgs2-emailpopup');
                setTimeout(()=>{
                    model_room.vshow.imgs2emailpopup = true;
                    el('#audio-notif').play();
                },1000);


                let force_scene1 = function(){
                    clearTimeout(model_room.temp);
                    emailpopup.removeEventListener('click', force_scene1);
                    emailpopup.removeEventListener('touchstart', force_scene1);
                    model_room.animation_scene = 1;
                    model_room.animation_start();
                    console.log('triggered');
                }
                //trigger next scene by timeout
                model_room.temp = setTimeout(force_scene1, 3000);
                //or trigger next scene by click
                emailpopup.addEventListener('click', force_scene1);
                emailpopup.addEventListener('touchstart', force_scene1);
            }
            if (model_room.animation_scene==1){
                //showing the email
                model_room.vshow.imgs2emailpopup = false;
                model_room.vshow.imgs2emailopenbg = true;
                let emailopenbg = el('#imgs2-emailopenbg');
                fadein(emailopenbg, 0.5);
                let bgquestion = el('#imgs2-bgquestion');
                bgquestion.style.top = '50vh';
                model_room.vshow.imgs2bgquestion = true;
                bgquestion.style.transition = 'top 2s';
                setTimeout(()=>{
                    bgquestion.style.top = '0vh';
                },100);
                setTimeout(()=>{
                    model_room.vshow.questionbox = true;
                    fadein(el('#question-box'), 1);
                },2100);
            }
        },
        3: ()=>{
            //situation 3
            model_room.vshow[model_room.room_id] = true;
            model_room.animation_stop();
            if (model_room.animation_scene==0){
                // el(`#room-s${model_room.room_id}`).style.top = "100vh";
                // el(`#room-s${model_room.room_id}`).style.transition = "top 0.5s";
                // setTimeout(()=>{
                //     el(`#room-s${model_room.room_id}`).style.top = "0vh";
                // },500);
                model_room.vshow.imgs3call = true;
                model_room.vshow.imgs3phoneicon = true;
                fadein(el('#imgs3-call'),1);
                let imgCircle = document.getElementById('imgs3-phoneicon');
                fadein(el('#imgs3-phoneicon'),2);
                el('#audio-ringtone').play();
                let next_animation = ()=>{
                    model_room.vshow.imgs3call = false;
                    model_room.vshow.imgs3callbg = true;
                    model_room.vshow.imgs3phoneicon = false;
                    imgCircle.removeEventListener('touchstart', next_animation);
                    model_room.animation_scene = 1;
                    model_room.animation_start();
                    try{
                        clearTimeout(model_room.temp);
                    }catch(e){}
                };
                // imageDrag(imgCircle, 10.5, 70.5, next_animation);
                model_room.temp = setTimeout(()=>{
                    imgCircle.style.transition = 'left 1.5s';
                    imgCircle.style.left = '70.5vw';
                    setTimeout(next_animation,2000);
                }, 1000);
            }
            if (model_room.animation_scene==1){
                el('#audio-ringtone').pause();
                el('#audio-ringtone').currentTime = 0;
                el('#audios3-call').play();
                model_room.vshow.questionbox = true;
                fadein(el('#question-box'), 1);
            }
        },
        4: ()=>{
            //situation 4
            model_room.vshow[model_room.room_id] = true;
            model_room.animation_stop();
            if (model_room.animation_scene==0){
                // el(`#room-s${model_room.room_id}`).style.top = "100vh";
                // el(`#room-s${model_room.room_id}`).style.transition = "top 0.5s";
                // setTimeout(()=>{
                //     el(`#room-s${model_room.room_id}`).style.top = "0vh";
                // },500);
                model_room.vshow.imglockscreen = false;
                model_room.vshow.imgs4adsbg = true;
                fadein(el('#imgs4-adsbg'),1,()=>{
                    model_room.vshow.imgs4adsimg = true;
                    setTimeout(()=>{
                        model_room.animation_scene = 1;
                        model_room.animation_start();
                        model_room.vshow.imglockscreen = true;
                    },2000)
                });
            }
            if (model_room.animation_scene==1){
                model_room.vshow.imgs4adspopup = true;
                model_room.vshow.imgs4questionbox = true;
                el('#imgs4-adsimg').style.filter =
                    'brightness(0.3) blur(15px)'
                setTimeout(()=>{
                    model_room.vshow.questionbox = true;
                    fadein(el('#question-box'), 1);
                },1000);
            }
        },
        5: ()=>{
            model_room.vshow[model_room.room_id] = true;
            model_room.animation_stop();
            if (model_room.animation_scene==0){
                // el(`#room-s${model_room.room_id}`).style.top = "100vh";
                // el(`#room-s${model_room.room_id}`).style.transition = "top 0.5s";
                // setTimeout(()=>{
                //     el(`#room-s${model_room.room_id}`).style.top = "0vh";
                // },500);
                model_room.vshow.imgs5lockscreen = true;
                fadein(el('#imgs5-lockscreen'),1,()=>{
                    model_room.animation_scene = 1;
                    model_room.animation_start();
                });
            }
            if (model_room.animation_scene==1){
                model_room.vshow.imgs5smspopup = true;
                el('#audio-notif').play();
                let smspopup = el('#imgs5-smspopup');
                model_room.temp = 0;
                let force_scene2 = function(){
                    clearTimeout(model_room.temp);
                    smspopup.removeEventListener('click', force_scene2);
                    model_room.animation_scene = 2;
                    model_room.animation_start();
                };
                model_room.temp = setTimeout(force_scene2, 3000);
                smspopup.addEventListener('click', force_scene2);
                smspopup.addEventListener('touchstart', force_scene2);
            }
            if (model_room.animation_scene==2){
                model_room.vshow.imgs5lockscreen = false;
                model_room.vshow.imgs5smspopup = false;
                model_room.vshow.imgs5smsbg = true;
                model_room.vshow.imgs5smsopen1 = true;
                model_room.vshow.imgs5questionbox = true;
                setTimeout(()=>{
                    model_room.vshow.questionbox = true;
                    fadein(el('#question-box'), 1);
                },1000);
            }
        },
        6: ()=>{
            //situation 6
            model_room.vshow[model_room.room_id] = true;
            model_room.vshow.imgs6lockscreen = true;
            if (model_room.animation_scene==0){
                // el(`#room-s${model_room.room_id}`).style.top = "100vh";
                // el(`#room-s${model_room.room_id}`).style.transition = "top 0.5s";
                // setTimeout(()=>{
                //     el(`#room-s${model_room.room_id}`).style.top = "0vh";
                // },500);
                model_room.animation_stop();
                let wapopup = el('#imgs6-wapopup');
                el('#audio-notif').play();
                // wapopup.outerHTML = wapopup.outerHTML;//reset event listener
                // wapopup = el('#imgs6-wapopup');
                model_room.vshow.imgs6wapopup = true;
                let room1 = el('#room-s6');
                fadein(room1, 2);

                let force_scene1;
                force_scene1 = function(){
                    clearTimeout(model_room.temp);
                    wapopup.removeEventListener('click', force_scene1);
                    wapopup.removeEventListener('touchstart', force_scene1);
                    model_room.animation_scene = 1;
                    model_room.animation_start();
                    console.log('triggered');
                }
                //trigger next scene by timeout
                model_room.temp = setTimeout(force_scene1, 3000);
                //or trigger next scene by click
                wapopup.addEventListener('click', force_scene1);
                wapopup.addEventListener('touchstart', force_scene1);
            }
            else if (model_room.animation_scene==1){
                //showing the whatsapp
                model_room.animation_stop();

                let wa_bg = el('#imgs6-wabg');
                model_room.vshow.imgs6wabg = true;
                fadein(wa_bg, 0.5);
                setTimeout(()=>{
                    model_room.vshow.imgs6waopen1 = true;
                    el('#audio-wa').play();
                    model_room.animation_scene = 2;
                    model_room.animation_start();
                },1000);
            }
            else if (model_room.animation_scene==2){
                //show answer choices
                model_room.animation_stop();
                model_room.vshow.questionbox = true;
                new TextTyper('#question-box .question-text',30);
                els_act('#question-box .choice',(elem,index)=>{
                    elem.style.display = 'none';
                    setTimeout(()=>{
                        elem.style.display = 'list-item';
                    }, (3+index)*400)
                });
            }
        },
        result: ()=>{
            model_room.animation_stop();
            model_room.vshow.question = false;
            model_room.vshow[model_room.room_id] = true;
            if (model_room.animation_scene==0){
                model_room.vshow.result = true;
                model_room.vshow.resultbg = true;
                let result = el('#room-result');
                fadein(result, 2);
                setTimeout(()=>{
                    let bg = el('#result-bg');
                    bg.style.filter = 'blur(15px)';
                    if (model_room.score>=400){
                        model_room.vshow.resultpos = true;
                    }
                    else{
                        model_room.vshow.resultneg = true;
                    }
                },800);
                setTimeout(()=>{
                    model_room.animation_scene = 1;
                    model_room.animation_start();
                },500);
            }
            if (model_room.animation_scene==1){
                model_room.vshow.resultcall0 = true;
                el('#audio-ringtone').play();
                setTimeout(()=>{
                    model_room.animation_scene = 2;
                    model_room.animation_start();
                }, 2000);
            }
            if (model_room.animation_scene==2){
                // model_room.vshow.resultcall0 = false;
                fadeout(el('#result-call0'), 0.5);
                model_room.vshow.resultcall1 = true;
                el('#audio-ringtone').pause();
                el('#audio-ringtone').currentTime = 0;
                setTimeout(()=>{
                    model_room.animation_scene = 3;
                    model_room.animation_start();
                }, 1000);
            }
            if (model_room.animation_scene==3){
                model_room.vshow.resultpos = false;
                model_room.vshow.resultneg = false;
                // model_room.vshow.resulttextneg = true;
                // fadein(el('#result-textneg'), 1);
                // if (model_room.score>=400){
                //     model_room.vshow.resulttextbg = true;
                //     fadein(el('#result-textbg'), 1);
                // }
                // else{
                // }
                // el('#audio-call').play();
                model_room.vshow.resultsubtitle = true;
                el('#result-subtitle').currentTime = 0;
                el('#result-subtitle').play();
                setTimeout(()=>{
                    el('#result-subtitle').pause();
                    fadeout(el('#result-subtitle'), 1);
                    setTimeout(()=>{
                        model_room.vshow.resultsubtitle = false;
                        el('#result-subtitle').currentTime = 0;
                        el('#result-subtitle').style.filter = 'none';
                    },1000);
                    model_room.animation_scene = 4;
                    model_room.animation_start();
                }, 14000);
            }
            if (model_room.animation_scene==4){
                model_room.vshow.resulttextbg = false;
                model_room.vshow.resulttextneg = false;
                model_room.vshow.resultcall0 = false;
                model_room.vshow.resultcall1 = false;
                if (model_room.score>=300){
                    model_room.vshow.resultpos = true;
                }
                else{
                    model_room.vshow.resultneg = true;
                }
                model_room.vshow.resultticket = true;

                model_room.story_reset_timer = 60;
                model_room.temp = setInterval(()=>{
                    model_room.story_reset_timer -= 1;
                    if (model_room.story_reset_timer<=0){
                        model_room.story_reset();
                        clearInterval(model_room.temp);
                    }
                },1000);
            }

        },
    },
});

function main() {
    el('#main').style.visibility = 'visible';
    //all image must not be draggable
    els_act('img', (img)=>{img.draggable = false;});
    //start reactive template
    window.vueapp = PetiteVue.createApp(model_room);
    vueapp.mount('#main');
    //app animation init
    model_room.story_reset();
}

window.on_ready = function on_ready(cb,delay_ms=0){
    let this_ = window.on_ready;
    if (this_.executed==undefined){
        this_.executed = {}
    }
    this_.executed[cb.name] = false;
    let target = ()=>{
        setTimeout(cb,delay_ms)
        this_.executed[cb.name] = true;
    };
    if (document.readyState=="complete"){
        target();
    }
    else{
        document.addEventListener('DOMContentLoaded', target);
    }
    //execution guaranted
    setTimeout(()=>{
        if (this_.executed[cb.name]){
        }
        else {
            cb();
            this_.executed[cb.name] = true;
            console.log('force execution guaranteed ',cb.name)
        }
    },delay_ms+100);
        
}

on_ready(main);