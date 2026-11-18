const menuToggle=document.getElementById('menuToggle');
const mainNav=document.getElementById('mainNav');
menuToggle?.addEventListener('click',()=>mainNav.classList.toggle('open'));

const searchToggle=document.getElementById('searchToggle');
const searchPanel=document.getElementById('searchPanel');
searchToggle?.addEventListener('click',()=>{searchPanel.classList.add('open');document.getElementById('searchInput').focus()});
document.getElementById('closeSearch')?.addEventListener('click',()=>searchPanel.classList.remove('open'));
document.getElementById('searchInput')?.addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  document.querySelectorAll('.product-card').forEach(card=>{
    card.style.display=card.innerText.toLowerCase().includes(q)?'':'none';
  });
  updateCount();
});

const toast=document.getElementById('toast');
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2100)}
let bag=0;
document.querySelectorAll('.quick-add').forEach(btn=>btn.addEventListener('click',()=>{
  bag++;document.getElementById('bagCount').textContent=bag;notify('Added to your bag — size selection will be added in the next build.');
}));
document.querySelectorAll('.heart').forEach(btn=>btn.addEventListener('click',()=>{
  btn.classList.toggle('selected');btn.textContent=btn.classList.contains('selected')?'♥':'♡';
  notify(btn.classList.contains('selected')?'Added to wishlist':'Removed from wishlist');
}));

document.querySelectorAll('.filter-heading').forEach(btn=>btn.addEventListener('click',()=>{
  const panel=btn.nextElementSibling;panel.classList.toggle('hidden');
  btn.querySelector('span').textContent=panel.classList.contains('hidden')?'+':'−';
}));
document.getElementById('filterToggle')?.addEventListener('click',()=>document.getElementById('filters').classList.toggle('open'));

function selectedValues(selector){return [...document.querySelectorAll(selector+':checked')].map(x=>x.value)}
function applyFilters(){
  const cats=selectedValues('.category-filter');
  const sizes=selectedValues('.size-filter');
  const price=document.querySelector('input[name="price"]:checked')?.value||'all';
  document.querySelectorAll('.product-card').forEach(card=>{
    const p=Number(card.dataset.price);
    const catOk=!cats.length||cats.includes(card.dataset.category);
    const sizeOk=!sizes.length||sizes.some(size=>card.dataset.size.split(' ').includes(size));
    const priceOk=price==='all'||(price==='under1000'&&p<1000)||(price==='1000to2000'&&p>=1000&&p<=2000)||(price==='above2000'&&p>2000);
    card.style.display=catOk&&sizeOk&&priceOk?'':'none';
  });
  updateCount();
}
function updateCount(){
  const visible=[...document.querySelectorAll('.product-card')].filter(c=>c.style.display!=='none').length;
  document.getElementById('resultCount').textContent=String(visible).padStart(2,'0')+' PRODUCTS';
}
document.querySelectorAll('.category-filter,.size-filter,input[name="price"]').forEach(input=>input.addEventListener('change',applyFilters));
document.getElementById('clearFilters')?.addEventListener('click',()=>{
  document.querySelectorAll('.filters input').forEach(input=>{if(input.type==='radio')input.checked=input.value==='all';else input.checked=false});
  applyFilters();
});
document.getElementById('sortSelect')?.addEventListener('change',e=>{
  const grid=document.getElementById('productGrid');
  const cards=[...grid.querySelectorAll('.product-card')];
  const mode=e.target.value;
  cards.sort((a,b)=>{
    if(mode==='low')return Number(a.dataset.price)-Number(b.dataset.price);
    if(mode==='high')return Number(b.dataset.price)-Number(a.dataset.price);
    if(mode==='new')return Number(b.dataset.new)-Number(a.dataset.new);
    return Number(b.dataset.new)-Number(a.dataset.new);
  }).forEach(card=>grid.appendChild(card));
});
document.querySelectorAll('.category-tile').forEach(tile=>tile.addEventListener('click',()=>{
  const category=tile.dataset.category;
  document.querySelectorAll('.category-filter').forEach(input=>input.checked=input.value===category);
  applyFilters();
}));
document.getElementById('bagButton')?.addEventListener('click',()=>notify(`Your bag has ${bag} item${bag===1?'':'s'}. Checkout is not connected in this prototype.`));
document.querySelector('.wishlist-action')?.addEventListener('click',()=>notify('Wishlist preview — account functionality will be connected later.'));
document.querySelector('.account-action')?.addEventListener('click',()=>notify('Customer accounts are part of the next development phase.'));
