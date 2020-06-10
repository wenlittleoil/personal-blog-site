
window.addEventListener('DOMContentLoaded', () => {
  console.log('dom content has been loaded!');
});
window.addEventListener('load', () => {
  console.log('resource has been loaded!');
});

const div = document.querySelector('.lovers');
const imgs = [
  './imgs/qw1.jpeg',
  './imgs/qw2.jpeg',
  './imgs/qw3.jpeg',
  './imgs/qw4.jpg',
];
imgs.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.style.width = '500px';
  img.style.height = 'auto';
  img.style.marginTop = '20px';
  div.appendChild(img);
});
