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


// Foro Pedro Tennis: publicaciones locales + envío por WhatsApp
(function(){
  const forumForm=document.getElementById('forumForm');
  if(!forumForm) return;
  const topics=document.getElementById('forumTopics');
  const status=document.getElementById('forumStatus');
  const waBtn=document.getElementById('sendForumWhatsApp');
  const storeKey='pedroTennisForumPosts';
  function escapeHtml(str){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function readPosts(){try{return JSON.parse(localStorage.getItem(storeKey)||'[]')}catch(e){return []}}
  function savePosts(posts){localStorage.setItem(storeKey,JSON.stringify(posts.slice(0,30)));}
  function renderPost(post){
    const card=document.createElement('article');
    card.className='topic-card user-topic';
    card.innerHTML=`<span>${escapeHtml(post.categoria)}</span><h3>${escapeHtml(post.titulo)}</h3><p>${escapeHtml(post.mensaje)}</p><small>Publicado por ${escapeHtml(post.nombre)} · ${escapeHtml(post.fecha)}</small>`;
    topics.prepend(card);
  }
  readPosts().reverse().forEach(renderPost);
  function formData(){
    return {
      nombre:forumForm.nombre.value.trim(),
      categoria:forumForm.categoria.value,
      titulo:forumForm.titulo.value.trim(),
      mensaje:forumForm.mensaje.value.trim(),
      fecha:new Date().toLocaleDateString('es-MX',{year:'numeric',month:'short',day:'numeric'})
    };
  }
  forumForm.addEventListener('submit',e=>{
    e.preventDefault();
    const post=formData();
    if(!post.nombre||!post.titulo||!post.mensaje){return;}
    const posts=readPosts();
    posts.unshift(post);savePosts(posts);renderPost(post);forumForm.reset();
    status.textContent='Tu publicación quedó guardada en este navegador. Para que Pedro la confirme, envíala también por WhatsApp.';
    status.className='form-status success';
  });
  waBtn.addEventListener('click',()=>{
    const post=formData();
    if(!post.nombre||!post.titulo||!post.mensaje){
      status.textContent='Completa nombre, título y mensaje antes de enviar por WhatsApp.';
      status.className='form-status error';
      return;
    }
    const text=`Hola, quiero publicar en la Comunidad Pedro Tennis.%0A%0ANombre: ${encodeURIComponent(post.nombre)}%0ACategoría: ${encodeURIComponent(post.categoria)}%0ATítulo: ${encodeURIComponent(post.titulo)}%0AMensaje: ${encodeURIComponent(post.mensaje)}`;
    window.open('https://wa.me/525521047277?text='+text,'_blank','noopener');
  });
})();
