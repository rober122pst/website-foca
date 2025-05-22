const path = window.location.pathname
const id = path.split('/profile/')[1];

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const res = await fetch(`/api/user/${id}`, { method: 'GET' })
        if(!res.ok) return console.error("Falha ao pegar o user")
        const user = await res.json()

        const banner = document.getElementById('banner');
        const profilePic = document.getElementById('profilePic');
        const username = document.getElementById('username');
        const description = document.getElementById('description');
        const coins = document.getElementById('coins');
        const xp = document.getElementById('xp');

        console.log(user)
        if(user.profile.bannerUrl !== "") banner.src = user.profile.bannerUrl;
        if(user.profile.avatarUrl !== "") profilePic.src = user.profile.avatarUrl;
        username.textContent = user.username;
        if(user.profile.bio !== "") description.textContent = user.profile.bio;
        coins.textContent = formatarPara00_00(user.gamification.coins) + " $";
        xp.textContent = user.gamification.level + " LEVEL";
    } catch (e) {
        console.error("Algum erro aconteceu. ", e)
    }
});