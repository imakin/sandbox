function el(selector){
    return document.querySelector(selector);
}

window.model_room = PetiteVue.reactive({
    init: ()=>{
        console.log('init');
        model_room.animation_start();
    },
    vshow:{
        video: false,
        story: false,
        question: false,
        img: false,
    },
    room_id: 0,
    story:[
        {
            narative:`
                <p>
                    Ada panggilan masuk yang bilang kartu kreditmu terblokir.
                    Cara untuk aktivasinya lagi adalah kirim nomor Kartu
                    Kredit dan CVC/CVV.
                </p>
                <p class="quote">
                    “KARTU KREDIT ANDA TERBLOKIR
                    untuk aktifasi ulang silahkan tulis no. kartu kredit dan
                    CVC/CVV anda.“
                </p>
                `,
            question:`
                <p>Apa yang kamu lakukan?</p>
            `,
            choices:[
                'Kirim nomor kartu dan CVC/CVV',
                'Cek status kartu kredit dari aplikasi',
                'Block nomor pengirim pesan',
            ]
        },
        {
            narative: `
                <p>
                    Sekarang lagi tanggal tua, nominal di rekeningmu
                    seadanya. Tiba-tiba, teman kamu pakai nomor barunya
                    kasih kabar ada lowongan kerja. Syaratnya tinggal
                    klik link di pesannya.
                </p>
                <p class="quote">
                    “Hi, gue Andika dan gue lagi cari orang yang mau
                    duit tambahan sekarang juga cuma kerjanya isi survey
                    di sini”
                </p>`,
            question: `
                <p>Apa yang kamu lakukan?</p>
            `,
        }
    ],
    animation_time_start: 0,
    animation_start: ()=>{
        model_room.animation_time_start = new Date().getTime() / 1000;
        window.animation_interval = setInterval(model_room.story_loop[0],500)
    },
    animation_scene: 0,
    imgPhoneEvent: {
        mouse:0,
        touch:0
    },
    story_loop:[
        ()=>{
            //1st story
            let currentstep = new Date().getTime() / 1000 - model_room.animation_time_start;
            if (model_room.animation_scene==0){
                console.log('check');
                model_room.vshow.img = true;
                let img = el('#img-svg');
                let img_wrapper = img.parentElement;
                img.src = document.location.href+'src/asset/call-start.svg';
                img_wrapper.style.top = '5vh';

                //answer phone drag
                var imgPhone = document.getElementById('img-phone');
                lib.imageDrag(imgPhone, 24, 60);
                
                let on_mouse_up = (e)=>{
                    let posx_px = imgPhone.offsetLeft;
                    let posx = 100*posx_px/window.innerWidth;//in vw
                    console.log(posx)
                    if (posx>=30){
                        imgPhone.style.left = '60vw';
                        //do 2nd scene
                        model_room.animation_scene = 1;
                        document.removeEventListener('mouseup', on_mouse_up);
                        document.removeEventListener('touchend', on_mouse_up);
                    }
                    else {
                        imgPhone.style.left = '24vw';
                    }
                };

                model_room.imgPhoneEvent.mouse = document.addEventListener('mouseup',on_mouse_up)
                model_room.imgPhoneEvent.touch = document.addEventListener('touchend',on_mouse_up)
            }
            else if (model_room.animation_scene==1){
                //1st scene
                console.log('check')
                setTimeout(()=>{el('#img-wrapper').style.top = '0vh';},100);
                el('#story').classList.add('down');
                document.body.classList.remove('bg-black');
                document.body.classList.add('bg-blue');
                el('#img-svg').src = document.location.href+'src/asset/call-on.svg';
                el('#img-phone').remove();
                setTimeout(()=>{
                    model_room.animation_scene = 2;
                }, 500);
            }
            if (model_room.animation_scene==2){
                //2nd scene
                console.log('check')
                el('#img-wrapper').style.top = '-40vh';
                el('#story').classList.add('absolute');
                model_room.vshow.story = true;
                model_room.vshow.question = true;
                setTimeout(()=>{el('#question').style.bottom = '0vh';},100);
            }
        },
    ]
});

function main() {
    window.vueapp = PetiteVue.createApp(model_room);
    vueapp.mount();    
    model_room.animation_start();

}

window.on_ready = function on_ready(cb,delay_ms=0){
    let this_ = this;
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