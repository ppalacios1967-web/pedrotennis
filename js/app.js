const header=document.getElementById('header');window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>40));
const toggle=document.querySelector('.menu-toggle'),links=document.querySelector('.nav-links');toggle.addEventListener('click',()=>links.classList.toggle('open'));document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
document.querySelectorAll('.gallery-grid img').forEach(img=>img.addEventListener('click',()=>{const box=document.createElement('div');box.className='lightbox';box.innerHTML=`<button aria-label="Cerrar">×</button><img src="${img.src}" alt="${img.alt}">`;document.body.appendChild(box);box.addEventListener('click',()=>box.remove());}));

const form=document.querySelector('.contact-form');
const question=document.getElementById('captchaQuestion');
const answer=document.getElementById('captchaAnswer');
const statusBox=document.getElementById('formStatus');
let captchaResult=0;
function newCaptcha(){
  const a=Math.floor(Math.random()*8)+2;
  const b=Math.floor(Math.random()*8)+2;
  captchaResult=a+b;
  if(question) question.textContent=`${a} + ${b}`;
  if(answer) answer.value='';
}
newCaptcha();
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    statusBox.className='form-status';
    if(Number(answer.value)!==captchaResult){
      statusBox.textContent='Verificación incorrecta. Intenta nuevamente.';
      statusBox.classList.add('error');
      newCaptcha();
      return;
    }
    const nombre=form.querySelector('[name="nombre"]').value.trim();
    const telefono=form.querySelector('[name="telefono"]').value.trim();
    const nivel=form.querySelector('[name="nivel"]').value.trim();
    const mensaje=form.querySelector('[name="mensaje"]').value.trim();
    const text=`Hola, quiero información sobre clases de tenis.%0A%0ANombre: ${encodeURIComponent(nombre)}%0ATeléfono: ${encodeURIComponent(telefono)}%0ANivel: ${encodeURIComponent(nivel)}%0AMensaje: ${encodeURIComponent(mensaje)}`;
    statusBox.textContent='Verificación correcta. Abriendo WhatsApp...';
    statusBox.classList.add('success');
    setTimeout(()=>{location.href='https://wa.me/525521047277?text='+text;},500);
  });
}
