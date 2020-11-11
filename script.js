let slider = [];

let removeArrowLeft;
let removeArrowRight;
let removeFullScreen;
let slideShow;
let animation;
let seconds;
let intWarning;
const arrowLeft = document.querySelector('.arrowleft');
const arrowRight = document.querySelector('.arrowright');
const sliderFrame = document.querySelector('.slider');
const fullScreenButton = document.querySelector('.fullscreenbutton')

function sliderInit(){
    let slides = document.querySelectorAll('.slide');

    slides.forEach(item => {
        item.onload = () => {}
        slider.push(item.src);
        item.remove();
    })
}

if(!localStorage.getItem('seconds')) {
    seconds = 3;
} else {
    seconds = +localStorage.getItem('seconds');
}

if(JSON.parse(localStorage.getItem('animation')) === true){
    animation = true;
    play(seconds * 1000);
} else {
    animation = false;
}

sliderInit();

document.querySelector('.intdesc span').innerText = seconds;

let step = (slider.length - 1);

function draw(offSet, direction, fullScreen) {
    if(slider.length === 0){
        document.querySelector('.noimages').classList.add('_active');
        document.querySelector('.play').classList.add('_inactive');
        return new Promise(res => {
            res();
        })
    }
    document.querySelector('.noimages').classList.remove('_active');
    document.querySelector('.play').classList.remove('_inactive');
    let img = document.createElement('img');
    if(direction === 'next'){
        img.src = slider[step];
    } else if (direction === 'prev'){
        if(step < 4){
            img.src = slider[slider.length - 4 + step];
        } else {
            img.src = slider[step - 4];
        }
    }
    img.classList.add('slide');
    if(fullScreen === true){
        img.style.transform = 'translate(calc(-50% + (' + offSet * screen.width + 'px)), -50%)';
        img.addEventListener('load', () => {
            if((img.width / img.height) > (screen.width / screen.height)){
                img.style.width = screen.width + 'px';
                img.style.height = 'auto';
            } else {
                img.style.height = '100vh';
                img.style.width = 'auto';
            }
        })
    } else {
        img.style.transform = 'translate(calc(-50% + (' + offSet * 1024 + 'px)), -50%)';
        img.addEventListener('load', () => {
            if((img.width / img.height) > (1024 / 520)){
                img.style.width = 1024 + 'px';
                img.style.height = 'auto';
            } else {
                img.style.height = '520px';
                img.style.width = 'auto';
            }
        })
    }
    if(direction === 'next'){
        if(step === (slider.length - 1)){
            step = 0;
        } else {
            step++;
        }
    } else if(direction === 'prev'){
        if(step === 0){
            step = slider.length - 1;
        } else {
            step--;
        }
    }
    return new Promise((res) => {
        img.addEventListener('load', () => {
            if(direction === 'next'){
                document.querySelector('.slider1').append(img);
                res();
            } else if(direction === 'prev'){
                document.querySelector('.arrowright').after(img);
                res();
            }
        })
        img.addEventListener('error', () => {
            if(direction === 'next'){
                document.querySelector('.slider1').append(img);
                res();
            } else if(direction === 'prev'){
                document.querySelector('.arrowright').after(img);
                res();
            }
        })
    })

    /*if(fullScreen === true){
        if(img.width > screen.width){
            img.style.width = screen.width + 'px';
            img.style.height = 'auto';
        }
    } else {
        if(img.width > 1024){
            img.style.width = 1024 + 'px';
            img.style.height = 'auto';
        }
    }*/
    
}

function drawAll(){
    let d = draw(-1, 'next');
    d.then(() => {
        let t = draw(0, 'next');
        t.then(() => {
            draw(1, 'next');
        })
    })
}
function drawAllFull(){
    let d = draw(-1, 'next', true);
    d.then(() => {
        let t = draw(0, 'next', true);
        t.then(() => {
            draw(1, 'next', true);
        })
    })
}

function nextSlide(){
    if(slider.length === 0) {
        return
    }
    let currentSlides = document.querySelectorAll('.slide');

    let offSet = -1;

    if(document.querySelector('.container').classList.contains('_fullscreen')){
        currentSlides.forEach(item => {
            item.style.transform = 'translate(calc(-50% + (' + offSet * screen.width + 'px) -  ' + screen.width + 'px),  -50%)';
            offSet++;
        })
        currentSlides[0].remove();
        draw(1, 'next', true);
    } else {
        currentSlides.forEach(item => {
            item.style.transform = 'translate(calc(-50% + (' + offSet * 1024 + 'px) - 1024px),  -50%)';
            offSet++;
        })
        currentSlides[0].remove();
        draw(1, 'next');
    }
}

function prevSlide(){
    if(slider.length === 0) {
        return
    }

    let currentSlides = document.querySelectorAll('.slide');

    let offSet = -1;

    if(document.querySelector('.container').classList.contains('_fullscreen')){
        currentSlides.forEach(item => {
            item.style.transform = 'translate(calc(-50% + (' + offSet * screen.width + 'px) + ' + screen.width + 'px),  -50%)';
            offSet++;
        })
        currentSlides[currentSlides.length - 1].remove();
        draw(-1, 'prev', true);
    } else {
        currentSlides.forEach(item => {
            item.style.transform = 'translate(calc(-50% + (' + offSet * 1024 + 'px) + 1024px),  -50%)';
            offSet++;
        })
        currentSlides[currentSlides.length - 1].remove();
        draw(-1, 'prev');
    }
}

function arrowHide(){
    clearTimeout(removeArrowLeft);
    clearTimeout(removeArrowRight);
    clearTimeout(removeFullScreen);
    document.querySelectorAll('.slider1 > button').forEach(item => {
        item.classList.add('_active');
    })
    removeArrowLeft = setTimeout(() => {
        arrowLeft.classList.remove('_active');
    }, 3000)
    removeArrowRight = setTimeout(() => {
        arrowRight.classList.remove('_active');
    }, 3000)
    removeFullScreen = setTimeout(() => {
        fullScreenButton.classList.remove('_active');
    }, 3000)
}

function play(interval){
    animation = true;
    localStorage.setItem('animation', JSON.stringify(animation));
    document.querySelector('.play').innerHTML = '<i class="fas fa-pause"></i>';
    document.querySelector('.intdesc').classList.add('_active');
    slideShow = setInterval(nextSlide, interval);
}

function stop(){
    animation = false;
    localStorage.setItem('animation', JSON.stringify(animation));
    document.querySelector('.play').innerHTML = '<i class="fas fa-play"></i>';
    document.querySelector('.intdesc').classList.remove('_active');
    clearInterval(slideShow);
}

function notTooFast(){
    if(animation === true){
        stop();
        play(seconds * 1000)
    }
}

drawAll();

arrowLeft.addEventListener('click', () => {
    prevSlide();
    notTooFast();
});
arrowRight.addEventListener('click', () => {
    nextSlide();
    notTooFast();
});

document.addEventListener('keyup', event => {
    if(event.key === 'ArrowLeft'){
        prevSlide();
        notTooFast();
    }
    if(event.key === 'ArrowRight'){
        nextSlide();
        notTooFast();
    }
})

sliderFrame.addEventListener('mousemove', arrowHide);
document.querySelectorAll('.slider1 > button').forEach(ele => {
    ele.addEventListener('click', arrowHide);
})

document.querySelector('.secondsok').addEventListener('click', () => {
    if(+document.querySelector('.seconds').value >= 1 && +document.querySelector('.seconds').value < 10000){
        seconds = +document.querySelector('.seconds').value;
        document.querySelector('.intdesc span').innerText = seconds;
        localStorage.setItem('seconds', seconds.toString());
        notTooFast();
        document.querySelector('.seconds').value = '';
        document.querySelector('.interror').classList.remove('_active');
    } else if(document.querySelector('.seconds').value === ''){
        seconds = 3;
        document.querySelector('.intdesc span').innerText = seconds;
        localStorage.setItem('seconds', seconds.toString());
        notTooFast();
        document.querySelector('.seconds').value = '';
        document.querySelector('.interror').classList.remove('_active');
    } else {
        if(document.querySelector('.interror').classList.contains('_active')){
            clearTimeout(intWarning);
        }
        document.querySelector('.interror').classList.add('_active');
        intWarning = setTimeout(() => {
            document.querySelector('.interror').classList.remove('_active');
        }, 3000)
    }
})

document.querySelector('.play').addEventListener('click', () => {
    if(slider.length === 0){
        return
    }
    if(animation === false){
        play(seconds * 1000);
    } else if (animation === true){
        stop();
    }
});

document.querySelector('.seconds').addEventListener('focus', () => {
    document.querySelector('.seconds').classList.add('_focused');
}, true);
document.querySelector('.seconds').addEventListener('blur', () => {
    document.querySelector('.seconds').classList.remove('_focused');
}, true);

document.addEventListener('keyup', event => {
    if(document.querySelector('.seconds').classList.contains('_focused')){
        if(event.key === 'Enter'){
            document.querySelector('.secondsok').click();
        }
    }
})
fullScreenButton.addEventListener('click', () => {
    if(document.querySelector('.container').classList.contains('_fullscreen')){
        document.querySelector('.container').classList.remove('_fullscreen');
        document.webkitCancelFullScreen();
        if(step < 3){
            step = slider.length - (3 - step);
        } else {
            step = step - 3;
        }
        let slides = document.querySelectorAll('.slide');
        slides.forEach(item => {
            item.remove();
        })
        drawAll();
        fullScreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        return
    }
    document.querySelector('.container').classList.add('_fullscreen');
    sliderFrame.requestFullscreen();
    if(step < 3){
        step = slider.length - (3 - step);
    } else {
        step = step - 3;
    }
    let slides = document.querySelectorAll('.slide');
    slides.forEach(item => {
        item.remove();
    })
    drawAllFull();
    fullScreenButton.innerHTML = '<i class="fas fa-compress"></i>';
})
document.addEventListener('fullscreenchange', () => {
    if(!document.fullscreenElement && document.querySelector('.container').classList.contains('_fullscreen')){
        fullScreenButton.click();
    } 
})
document.addEventListener('keyup', event => {
    if(event.key === ' ' && !document.querySelector('.seconds').classList.contains('_focused')){
        document.querySelector('.play').click();
    }
})
document.addEventListener('keyup', event => {
    if(event.key === ' '){
        event.preventDefault();
    }
})