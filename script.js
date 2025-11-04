/* script.js - products, cart logic, rendering */
const WHATSAPP_NUMBER = '62811182103'; // replace if needed
const CART_KEY = 'tlc_bakery_cart_v1';

// products array (10 products, images from Unsplash as placeholders)
const products = [
  { id: 'p1', name: 'Brownies Biasa', desc:'Padat & cokelat pekat.', images:[
      'https://images.unsplash.com/photo-1589712235273-8c43b0db6e1f?q=80&w=800',
    ],
    sizes: [{label:'10x10', price:70000},{label:'10x20',price:100000},{label:'20x20',price:130000}]
  },
  { id: 'p2', name: 'Red Velvet Cake', desc:'Lembut & mewah.', images:[
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800'
    ],
    sizes:[{label:'10x10',price:30000},{label:'10x20',price:70000},{label:'20x20',price:130000}]
  },
  { id: 'p3', name: 'Chocolate Croissant', desc:'Lapisan renyah & cokelat.', images:[
      'https://images.unsplash.com/photo-1565958011705-44a2b3b9b8b2?q=80&w=800'
    ],
    sizes:[{label:'Mini',price:15000},{label:'Medium',price:28000},{label:'Large',price:50000}]
  },
  // { id: 'p4', name: 'Cheesecake Lumer', desc:'Creamy dan lembut.', images:[
  //     'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800'
  //   ],
  //   sizes:[{label:'Cup',price:25000},{label:'Medium',price:55000},{label:'Large',price:110000}]
  // },
  // { id: 'p5', name: 'Banana Cake', desc:'Aroma pisang alami.', images:[
  //     'https://images.unsplash.com/photo-1617196034796-73b0b9b64ef7?q=80&w=800'
  //   ],
  //   sizes:[{label:'Mini',price:18000},{label:'Medium',price:40000},{label:'Large',price:80000}]
  // },
  // { id: 'p6', name: 'Chiffon Cake', desc:'Ringan & lembut.', images:[
  //     'https://images.unsplash.com/photo-1607958307347-56e0d4e2b1f4?q=80&w=800'
  //   ],
  //   sizes:[{label:'Mini',price:22000},{label:'Medium',price:48000},{label:'Large',price:95000}]
  // },
  // { id: 'p7', name: 'Cookies Homemade', desc:'Crunchy & manis.', images:[
  //     'https://images.unsplash.com/photo-1604908176997-3b6a5abf9f7d?q=80&w=800'
  //   ],
  //   sizes:[{label:'5 pcs',price:15000},{label:'10 pcs',price:28000},{label:'20 pcs',price:50000}]
  // },
  // { id: 'p8', name: 'Cupcake Vanilla', desc:'Lembut dengan buttercream.', images:[
  //     'https://images.unsplash.com/photo-1623428187969-5b3cc23234e0?q=80&w=800'
  //   ],
  //   sizes:[{label:'1 pcs',price:12000},{label:'6 pcs',price:55000},{label:'12 pcs',price:100000}]
  // },
  // { id: 'p9', name: 'Donut Cokelat', desc:'Glaze cokelat premium.', images:[
  //     'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800'
  //   ],
  //   sizes:[{label:'1 pcs',price:10000},{label:'6 pcs',price:55000},{label:'12 pcs',price:100000}]
  // },
  // { id: 'p10', name: 'Tiramisu', desc:'Kopi & krim mascarpone.', images:[
  //     'https://images.unsplash.com/photo-1617191519105-89d5d1d8a1e0?q=80&w=800'
  //   ],
  //   sizes:[{label:'Cup',price:25000},{label:'Small Box',price:60000},{label:'Big Box',price:120000}]
  // }
];

// Helpers: cart in localStorage
function getCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); refreshCartCount(); }

// Render product grid (menu.html)
function renderProducts(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    // swiper slides
    const swiperId = 'swiper-' + p.id;
    const slides = p.images.slice(0,5).map(src => `<div class="swiper-slide"><img src="${src}" style="width:100%;height:200px;object-fit:cover;border-radius:8px"></div>`).join('');
    const swiperHtml = `<div class="swiper ${swiperId}" style="--swiper-navigation-color:#fff;--swiper-pagination-color:#fff"><div class="swiper-wrapper">${slides}</div><div class="swiper-pagination"></div></div>`;

    const sizeOptions = p.sizes.map(s => `<option value="${s.price}">${s.label} — Rp ${s.price.toLocaleString('id-ID')}</option>`).join('');
    card.innerHTML = `
      ${swiperHtml}
      <div style="padding-top:8px">
        <div class="prod-title">${p.name}</div>
        <div class="prod-desc">${p.desc}</div>
        <label style="display:block;margin-top:10px;font-weight:600">Pilih ukuran</label>
        <select id="size-${p.id}">${sizeOptions}</select>
        <div class="price" id="price-${p.id}">Rp ${p.sizes[0].price.toLocaleString('id-ID')}</div>
        <button class="btn" onclick="addToCart('${p.id}')">+ Tambah Pesanan</button>
      </div>
    `;
    grid.appendChild(card);

    // init swiper
    setTimeout(() => {
      new Swiper('.' + swiperId, { slidesPerView:1, loop: p.images.length>1, pagination:{ el: '.swiper-pagination', clickable:true }});
    }, 0);

    // price change
    const selectEl = card.querySelector('#size-' + p.id);
    selectEl.addEventListener('change', (e) => {
      document.getElementById('price-' + p.id).textContent = 'Rp ' + Number(e.target.value).toLocaleString('id-ID');
    });
  });
}

// CART functions
function refreshCartCount(){
  const cart = getCart();
  const totalQty = cart.reduce((s,i) => s + i.qty, 0);
  const el = document.getElementById('cartCount');
  if(el) el.textContent = totalQty;
}

function addToCart(productId){
  const p = products.find(x=>x.id===productId);
  const select = document.getElementById('size-' + productId);
  const sizeLabel = select.options[select.selectedIndex].text.split(' — ')[0];
  const price = Number(select.value);
  const img = p.images[0] || '';
  let cart = getCart();
  const foundIndex = cart.findIndex(it => it.id===productId && it.size===sizeLabel);
  if(foundIndex>-1) cart[foundIndex].qty += 1;
  else cart.push({ id: productId, name: p.name, size: sizeLabel, price, qty:1, img });
  saveCart(cart);
  showCartPopup();
  // transient message
  showToast(`${p.name} (${sizeLabel}) ditambahkan ke keranjang`);
}

function showToast(msg){
  let t = document.createElement('div');
  t.textContent = msg;
  t.style.position='fixed'; t.style.left='50%'; t.style.transform='translateX(-50%)';
  t.style.bottom='22px'; t.style.background='#222'; t.style.color='#fff'; t.style.padding='10px 16px';
  t.style.borderRadius='12px'; t.style.zIndex=9999; t.style.opacity='0'; t.style.transition='opacity .2s';
  document.body.appendChild(t);
  setTimeout(()=>t.style.opacity='1',10);
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),400); }, 2200);
}

// popup and persistence
const cartPopup = { el:null, open:false };
document.addEventListener('DOMContentLoaded', ()=>{
  cartPopup.el = document.getElementById('cartPopup');
  document.getElementById('openCartBtn')?.addEventListener('click', ()=> showCartPopup());
  document.getElementById('viewCart')?.addEventListener('click', ()=> window.location.href='cart.html');
  document.getElementById('checkoutNow')?.addEventListener('click', ()=> window.location.href='cart.html');
  refreshCartCount();
});

function showCartPopup(){
  const popup = document.getElementById('cartPopup');
  const wrapper = document.getElementById('cartItems');
  const cart = getCart();
  wrapper.innerHTML = '';
  if(cart.length===0){
    wrapper.innerHTML = '<div style="padding:12px;color:#666">Keranjang kosong.</div>';
  } else {
    cart.forEach(it => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `<img src="${it.img}" alt=""><div style="flex:1"><div style="font-weight:700">${it.name}</div><div style="color:#666;font-size:13px">${it.size} • ${it.qty} pcs</div></div><div style="text-align:right"><div style="font-weight:700">Rp ${ (it.price*it.qty).toLocaleString('id-ID') }</div></div>`;
      wrapper.appendChild(div);
    });
  }
  popup.style.display = 'block'; popup.setAttribute('aria-hidden','false');
}

// close popup clicking outside
window.addEventListener('click', (e) => {
  if(!e.target.closest('.cart-wrap') && !e.target.closest('.cart-popup')) {
    document.getElementById('cartPopup')?.style&&(document.getElementById('cartPopup').style.display='none');
  }
});

// CART PAGE logic (cart.html)
function renderCart(){
  const cart = getCart();
  const area = document.getElementById('cartArea');
  if(!area) return;
  if(cart.length===0){
    area.innerHTML = '<p>Keranjang kosong. Kembali ke <a href="menu.html">Menu</a> untuk tambah pesanan.</p>';
    return;
  }
  let html = `<table><thead><tr><th>Produk</th><th>Ukuran</th><th>Qty</th><th>Harga</th><th>Subtotal</th><th></th></tr></thead><tbody>`;
  let total = 0;
  cart.forEach((it, idx) => {
    const subtotal = it.price * it.qty;
    total += subtotal;
    html += `<tr>
      <td><div style="display:flex;gap:8px;align-items:center"><img src="${it.img}" style="width:64px;height:48px;object-fit:cover;border-radius:6px"><div><strong>${it.name}</strong></div></div></td>
      <td>${it.size}</td>
      <td><input type="number" min="1" value="${it.qty}" data-idx="${idx}" class="qty-input"></td>
      <td>Rp ${it.price.toLocaleString('id-ID')}</td>
      <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
      <td><button data-idx="${idx}" class="link remove-btn">Hapus</button></td>
    </tr>`;
  });
  html += `</tbody></table><div style="text-align:right;margin-top:12px">Total: <strong>Rp ${total.toLocaleString('id-ID')}</strong></div>`;
  area.innerHTML = html;

  // attach events
  document.querySelectorAll('.qty-input').forEach(inp => inp.addEventListener('change', (e)=>{
    const idx = Number(e.target.dataset.idx);
    const val = Math.max(1, Number(e.target.value));
    let cart = getCart();
    cart[idx].qty = val;
    saveCart(cart);
    renderCart();
  }));
  document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (e)=>{
    const idx = Number(e.target.dataset.idx);
    let cart = getCart();
    cart.splice(idx,1);
    saveCart(cart);
    renderCart();
  }));
}

// send to whatsapp from cart page
function sendCartToWhatsApp(){
  const cart = getCart();
  if(cart.length===0){ alert('Keranjang kosong.'); return; }
  let msg = `Halo TLC Bakery, saya ingin memesan:%0A`;
  let total = 0;
  cart.forEach(it => {
    const subtotal = it.price * it.qty;
    total += subtotal;
    msg += `- ${it.name} (${it.size}) x${it.qty} = Rp ${subtotal.toLocaleString('id-ID')}%0A`;
  });
  msg += `%0ATotal = Rp ${total.toLocaleString('id-ID')}%0A`;
  msg += 'Nama: %0AAlamat / Catatan: %0ANomor WA:';
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  window.open(waLink, '_blank');
}

// clear cart
function clearCart(){
  if(confirm('Kosongkan keranjang?')){ localStorage.removeItem(CART_KEY); renderCart(); refreshCartCount(); }
}

// init on pages
document.addEventListener('DOMContentLoaded', ()=>{
  refreshCartCount();
  if(document.getElementById('cartArea')) renderCart();
  document.getElementById('sendWA')?.addEventListener('click', sendCartToWhatsApp);
  document.getElementById('clearCart')?.addEventListener('click', clearCart);
});
