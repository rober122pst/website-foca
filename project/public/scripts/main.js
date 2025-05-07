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

function observeSection() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) { // Trigger when any part of the div is visible
                entry.target.classList.remove('section-hidden');
                entry.target.classList.add('section-show');
            }
        });
    }, { threshold: 0 }); // Threshold 0 means any visible part will trigger

    const sections = document.querySelectorAll('.section-hidden');
    sections.forEach(section => observer.observe(section));
}

observeSection();