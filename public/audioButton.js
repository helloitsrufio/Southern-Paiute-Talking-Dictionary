let audio = document.querySelector('audio')

document.querySelector('.audio-button').addEventListener('click', audioButton)

let icon = document.querySelector('.audio-button i')

function audioButton(){
    if(audio.paused){
        audio.play()
        icon.classList.add('fa-pause')
        icon.classList.remove('fa-play')
    }else{
        audio.pause()
    } 
}

audio.onpause = () => {
    icon.classList.add('fa-play')
    icon.classList.remove('fa-pause')
}