// Tailwind CSS script for responsive behavior

const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu-btn');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});



// Send form details script

document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    document.getElementById('popup').classList.remove('hidden');
});

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}