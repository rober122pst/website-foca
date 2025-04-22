let header = document.getElementById('header')

window.addEventListener('scroll', () => {
    navbarColor();
})

function navbarColor() {
    if(window.scrollY >= 10){
        header.style.background = 'var(--color-items-second)';
    }else {
        header.style.background = 'transparent';
    }
}