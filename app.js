
const activities = [
  {id:1,image:"images/acuarela.webp",title:"Acuarela para principiantes",category:"Arte",icon:"🎨",duration:"90 min",level:"Inicial",specialist:"Laura Martín",description:"Una primera toma de contacto con la acuarela para experimentar con color, agua y técnicas básicas."},
  {id:2,image:"images/senderismo.webp",title:"Senderismo en la sierra",category:"Naturaleza",icon:"🥾",duration:"2 h",level:"Medio",specialist:"Carlos Peña",description:"Ruta guiada en grupo para disfrutar del entorno, moverse y conocer personas con intereses similares."},
  {id:3,image:"images/cocina.webp",title:"Cocina mediterránea",category:"Gastronomía",icon:"🍳",duration:"2 h",level:"Inicial",specialist:"Marta León",description:"Aprende recetas sencillas y comparte una experiencia práctica alrededor de la cocina."},
  {id:4,image:"images/fotografia.webp",title:"Fotografía urbana",category:"Cultura",icon:"📷",duration:"90 min",level:"Inicial",specialist:"Sergio Mora",description:"Descubre cómo mirar tu ciudad de otra forma y aprende principios básicos de composición."},
  {id:5,image:"images/padel.webp",title:"Iniciación al pádel",category:"Deporte",icon:"🏓",duration:"60 min",level:"Inicial",specialist:"Ana Ruiz",description:"Sesión de iniciación para conocer las reglas, practicar golpes básicos y probar el deporte sin compromiso."},
  {id:6,image:"images/huerto.webp",title:"Huerto urbano",category:"Naturaleza",icon:"🌱",duration:"90 min",level:"Inicial",specialist:"Elena Ríos",description:"Aprende a cultivar aromáticas y pequeños vegetales en casa con materiales sencillos."},
  {id:7,image:"images/baile.webp",title:"Baile en grupo",category:"Música y baile",icon:"💃",duration:"60 min",level:"Inicial",specialist:"Patricia Gómez",description:"Aprende pasos sencillos, disfruta de la música y conoce a otras personas sin necesidad de acudir con pareja."},
  {id:8,image:"images/movil.webp",title:"Aprende a usar tu móvil",category:"Tecnología",icon:"📱",duration:"90 min",level:"Inicial",specialist:"Javier Torres",description:"Descubre funciones prácticas de tu teléfono, aplicaciones cotidianas y consejos básicos de seguridad digital."},
  {id:9,image:"images/ingles.webp",title:"Conversación en inglés",category:"Idiomas",icon:"🗣️",duration:"60 min",level:"Intermedio",specialist:"Clara López",description:"Practica conversaciones cotidianas en inglés con un pequeño grupo y en un ambiente participativo."},
  {id:10,image:"images/lectura.webp",title:"Club de lectura",category:"Cultura",icon:"📚",duration:"90 min",level:"Todos",specialist:"María Sánchez",description:"Comparte opiniones sobre libros y descubre nuevas lecturas en compañía de otras personas."}
];



// Datos informativos ficticios para cada actividad. No representan centros ni ofertas reales.
const extraInfo = {
  1:{location:"Madrid",place:"Centro cultural de Madrid (ficticio)",materials:"Pinceles, papel y acuarelas incluidos",access:"Actividad sentada; consulta necesidades específicas"},
  2:{location:"Guadarrama",place:"Punto de encuentro en la sierra (ficticio)",materials:"Calzado de senderismo y agua propios",access:"Recorrido por senderos con desnivel moderado"},
  3:{location:"Getafe",place:"Aula de cocina de Getafe (ficticia)",materials:"Ingredientes y utensilios incluidos",access:"Trabajo de pie; consultar adaptaciones"},
  4:{location:"Madrid",place:"Punto de encuentro en Madrid centro (ficticio)",materials:"Traer móvil o cámara",access:"Paseo urbano de ritmo tranquilo"},
  5:{location:"Leganés",place:"Polideportivo de Leganés (ficticio)",materials:"Pala y pelotas incluidas; calzado deportivo propio",access:"Actividad con movimiento físico"},
  6:{location:"Getafe",place:"Huerto comunitario de Getafe (ficticio)",materials:"Semillas y herramientas incluidas",access:"Actividad al aire libre; consultar acceso al huerto"},
  7:{location:"Leganés",place:"Centro cultural de Leganés (ficticio)",materials:"Ropa y calzado cómodos",access:"Se pueden adaptar algunos movimientos"},
  8:{location:"Getafe",place:"Aula de formación de Getafe (ficticia)",materials:"Traer teléfono propio",access:"Actividad sentada"},
  9:{location:"Madrid",place:"Centro de idiomas de Madrid (ficticio)",materials:"Material didáctico incluido",access:"Actividad sentada"},
  10:{location:"Leganés",place:"Biblioteca de Leganés (ficticia)",materials:"Lecturas de demostración facilitadas",access:"Actividad sentada"}
};
let favorites=[];
try { const f=JSON.parse(localStorage.getItem('pe_favorites')||'[]'); favorites=Array.isArray(f)?f.filter(id=>activities.some(a=>a.id===id)):[]; } catch {}
let currentActivityTab='reserved';
function isFavorite(id){return favorites.includes(Number(id));}
function saveFavorites(){localStorage.setItem('pe_favorites',JSON.stringify(favorites));}
function toggleFavorite(id){id=Number(id);favorites=isFavorite(id)?favorites.filter(x=>x!==id):[...favorites,id];saveFavorites();renderDynamicViews();if(selectedActivity?.id===id)updateFavoriteButton();}
function updateFavoriteButton(){const btn=document.querySelector('#modal-favorite');if(btn&&selectedActivity)btn.textContent=isFavorite(selectedActivity.id)?'♥':'♡';}
function renderFavorites(){const list=activities.filter(a=>isFavorite(a.id));document.querySelector('#favorite-grid').innerHTML=list.length?list.map(activityCard).join(''):'<div class="empty-state">No tienes favoritos todavía. Puedes guardarlos desde el catálogo.</div>';}
function hasFutureSession(a,dateFrom){const start=new Date(dateFrom+'T00:00'); if(!Number.isFinite(start.getTime()))return true;for(let i=0;i<90;i++){const d=new Date();d.setDate(d.getDate()+i);if(d<start)continue;if(sessionsForDay(a.id,d).some(s=>s.free>0))return true;}return false;}
function updateActivityTabs(){document.querySelectorAll('[data-activity-tab]').forEach(b=>b.classList.toggle('active',b.dataset.activityTab===currentActivityTab));}
function hideMobileNav(){const nav=document.querySelector('#mobile-nav');nav.classList.add('hidden');document.querySelector('#mobile-menu-btn').setAttribute('aria-expanded','false');}

// Cada actividad cuenta con sesiones recurrentes ficticias.
// Día de la semana: 0=domingo, 1=lunes, ... 6=sábado.
const weeklySchedules = {
  1: [[2,"17:00"],[6,"10:00"]],
  2: [[6,"09:30"],[0,"10:00"]],
  3: [[3,"17:00"],[6,"11:00"]],
  4: [[4,"17:30"],[0,"11:00"]],
  5: [[1,"10:00"],[5,"17:00"]],
  6: [[2,"10:30"],[4,"17:00"]],
  7: [[1,"17:30"],[6,"12:00"]],
  8: [[3,"10:00"],[5,"11:00"]],
  9: [[2,"18:00"],[4,"11:00"]],
  10: [[3,"18:00"],[6,"11:30"]]
};
const capacities = {1:10,2:12,3:8,4:10,5:6,6:10,7:12,8:8,9:8,10:10};
const SESSION_LIMIT_DAYS = 90; // Fechas programadas para los próximos 90 días.
let calendarMonth = null;
let selectedSlot = null;
let bookingStep = "calendar";
const pad2 = n => String(n).padStart(2,"0");
const dateKey = d => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
function parseLocalStart(value){
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value || "")) return null;
  const d = new Date(value);
  return Number.isFinite(d.getTime()) && dateKey(d) === value.slice(0,10) &&
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}` === value.slice(11) ? d : null;
}
function sessionsForDay(activityId, day){
  const start = new Date(day.getFullYear(),day.getMonth(),day.getDate());
  const now = new Date();
  const end = new Date(now.getFullYear(),now.getMonth(),now.getDate()+SESSION_LIMIT_DAYS);
  if(start > end) return [];
  return (weeklySchedules[activityId] || [])
    .filter(([weekday]) => weekday === start.getDay())
    .map(([,time]) => {
      const startAt = `${dateKey(start)}T${time}`;
      const occupied = reservations.filter(r=>r.activityId===activityId && r.startAt===startAt).length;
      return {startAt,time,free:Math.max(0,(capacities[activityId]||8)-occupied)};
    }).filter(s=>parseLocalStart(s.startAt)?.getTime()>Date.now());
}
function renderCalendar(){
  if(!selectedActivity || !calendarMonth) return;
  const now = new Date();
  const first = new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1);
  const last = new Date(first.getFullYear(),first.getMonth()+1,0).getDate();
  const offset = (first.getDay()+6)%7;
  const todayMonth = new Date(now.getFullYear(),now.getMonth(),1);
  const limitDate = new Date(now.getFullYear(),now.getMonth(),now.getDate()+SESSION_LIMIT_DAYS);
  const endMonth = new Date(limitDate.getFullYear(),limitDate.getMonth(),1);
  const monthText = new Intl.DateTimeFormat("es-ES",{month:"long",year:"numeric"}).format(first);
  $("#calendar-heading").textContent = monthText.charAt(0).toUpperCase()+monthText.slice(1);
  $("#calendar-prev").disabled = first<=todayMonth;
  $("#calendar-next").disabled = first>=endMonth;
  let cells = '';
  for(let i=0;i<offset;i++) cells += '<span class="calendar-blank"></span>';
  for(let day=1;day<=last;day++){
    const date = new Date(first.getFullYear(),first.getMonth(),day);
    const slots=sessionsForDay(selectedActivity.id,date);
    const free=slots.some(s=>s.free>0 && !reservations.some(r=>r.activityId===selectedActivity.id && r.startAt===s.startAt));
    const selected=selectedSlot?.startAt.startsWith(dateKey(date));
    cells += `<button type="button" class="calendar-day ${free?'has-slots':''} ${selected?'selected':''}" data-calendar-day="${dateKey(date)}" ${free?'':'disabled'} aria-label="${day} de ${monthText}${free?', con horarios disponibles':', sin disponibilidad'}">${day}${free?'<span class="day-dot"></span>':''}</button>`;
  }
  $("#calendar-days").innerHTML=cells;
  renderTimes();
}
function renderTimes(){
  const el=$("#available-times");
  if(!selectedSlot){el.innerHTML='<p class="muted">Selecciona un día marcado para ver sus horas disponibles.</p>';$("#booking-continue").disabled=true;return;}
  const date=parseLocalStart(selectedSlot.startAt);
  const slots=sessionsForDay(selectedActivity.id,date);
  el.innerHTML=slots.map(slot=>`<button type="button" class="time-option ${selectedSlot.startAt===slot.startAt?'selected':''}" data-slot="${slot.startAt}" ${slot.free?'':'disabled'}>${slot.time}<small>${slot.free?`${slot.free} plazas libres`:'Completa'}</small></button>`).join('') || '<p class="muted">No quedan horarios disponibles para este día.</p>';
  $("#booking-continue").disabled=!slots.some(s=>s.startAt===selectedSlot.startAt&&s.free>0);
}
function chooseDay(key){
  const date=new Date(`${key}T12:00`);
  const slots=sessionsForDay(selectedActivity.id,date);
  if(!slots.some(s=>s.free>0 && !reservations.some(r=>r.activityId===selectedActivity.id&&r.startAt===s.startAt)))return;
  selectedSlot={startAt:slots[0].startAt.slice(0,10)+'T00:00',day:key}; // Día elegido, falta escoger hora
  renderCalendar();
  $("#available-times").innerHTML=slots.map(slot=>`<button type="button" class="time-option" data-slot="${slot.startAt}" ${slot.free?'':'disabled'}>${slot.time}<small>${slot.free?`${slot.free} plazas libres`:'Completa'}</small></button>`).join('');
  $("#booking-continue").disabled=true;
}
function chooseSlot(startAt){
  const day=parseLocalStart(startAt);
  const slot=sessionsForDay(selectedActivity.id,day).find(s=>s.startAt===startAt && s.free>0);
  if(!slot)return;
  selectedSlot=slot;
  renderCalendar();
}
function showBookingSummary(){
  if(!selectedActivity || !selectedSlot)return;
  const d=parseLocalStart(selectedSlot.startAt);
  const valid=sessionsForDay(selectedActivity.id,d).some(s=>s.startAt===selectedSlot.startAt&&s.free>0);
  if(!valid){renderCalendar();return;}
  if(reservations.length>=28){alert('No tienes sesiones disponibles.');return;}
  $("#summary-activity").textContent=selectedActivity.title;
  $("#summary-date").textContent=formatDate(selectedSlot.startAt);
  $("#summary-cost").textContent='1 sesión del pasaporte';
  $("#summary-balance").textContent=String(27-reservations.length);
  $("#calendar-stage").classList.add('hidden');
  $("#booking-summary").classList.remove('hidden');
  bookingStep='summary';
}
function backToCalendar(){
  $("#booking-summary").classList.add('hidden');
  $("#calendar-stage").classList.remove('hidden');
  bookingStep='calendar';renderCalendar();
}

const categories = [
  {name:"Cultura",icon:"🏛️"},{name:"Deporte",icon:"👟"},{name:"Arte",icon:"🎨"},{name:"Naturaleza",icon:"🌿"},{name:"Gastronomía",icon:"🍳"},{name:"Música y baile",icon:"💃"},{name:"Tecnología",icon:"📱"},{name:"Idiomas",icon:"🗣️"}
];

// Compatibilidad con las reservas creadas antes de esta versión.
let reservations;
try {
  const saved = JSON.parse(localStorage.getItem("pe_reservations") || "[]");
  reservations = Array.isArray(saved) ? saved.filter(r => activities.some(a => a.id === r.activityId) && r.status !== "cancelled").map(r => ({
    ...r,
    id: r.id || makeId(),
    status: r.status === "completed" ? "completed" : "reserved",
    startAt: r.startAt || (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(r.date || "") ? r.date : null)
  })) : [];
} catch { reservations = []; }
let pendingAction = null;
function makeId(){ return globalThis.crypto?.randomUUID?.() || `pe-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
const formatDate = date => {
  if (!date) return "Fecha sin determinar";
  const d = new Date(date);
  return !Number.isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(date)
    ? new Intl.DateTimeFormat("es-ES", {dateStyle:"medium",timeStyle:"short"}).format(d)
    : date;
};
const statusLabel = {reserved:"Reservada",completed:"Realizada"};
// Solo se completa automáticamente cuando existe una fecha y hora real de inicio.
function syncReservationStatuses(){
  const now = Date.now();
  let changed = false;
  for (const r of reservations){
    if (r.status !== "reserved" || !r.startAt) continue;
    const start = new Date(r.startAt).getTime();
    if (Number.isFinite(start) && start <= now){
      r.status = "completed";
      r.completedAt = new Date().toISOString();
      changed = true;
    }
  }
  if (changed) saveReservations();
}
function localDateTimeNow(){
  const d = new Date();
  const pad = n => String(n).padStart(2,"0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
let selectedActivity = null;
let activeCategory = "Todas";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function saveReservations(){ localStorage.setItem("pe_reservations", JSON.stringify(reservations)); }

function showView(view){
  $$(".view").forEach(v=>v.classList.remove("active"));
  $(`#view-${view}`).classList.add("active");
  $$(".nav-link").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
  hideMobileNav();
  window.scrollTo({top:0,behavior:"smooth"});
  renderDynamicViews();
}
document.addEventListener("click",e=>{
  const target=e.target.closest("[data-view]");
  if(target) showView(target.dataset.view);
});

function categoryCard(c){
  return `<button class="category" data-category="${c.name}">
    <div class="category-icon">${c.icon}</div><strong>${c.name}</strong><span>Explorar actividades</span>
  </button>`;
}

function activityCard(a){
  return `<article class="activity-card">
    <div class="card-image"><img src="${a.image}" alt="${a.title}" loading="lazy"></div>
    <div class="card-body">
      <div class="card-topline"><span class="tag">${a.category}</span><button class="favorite-btn ${isFavorite(a.id)?"is-fav":""}" data-favorite="${a.id}" aria-label="${isFavorite(a.id)?"Quitar de":"Añadir a"} favoritos" title="Favoritos">${isFavorite(a.id)?"♥":"♡"}</button></div>
      <h3>${a.title}</h3>
      <p>${a.description}</p>
      <div class="meta"><span>📍 ${extraInfo[a.id].location}</span><span>⏱ ${a.duration}</span><span>◉ ${a.level}</span><span>👥 Grupo</span></div>
      <div class="card-actions"><button class="secondary-btn" data-detail="${a.id}">Ver actividad</button></div>
    </div>
  </article>`;
}

function renderHome(){
  $("#home-categories").innerHTML=categories.map(categoryCard).join("");
  $("#featured-grid").innerHTML=activities.slice(0,3).map(activityCard).join("");
}

function renderFilters(){
  const all=["Todas",...categories.map(c=>c.name)];
  $("#filter-row").innerHTML=all.map(c=>`<button class="filter-btn ${activeCategory===c?"active":""}" data-filter="${c}">${c}</button>`).join("");
}

function renderExplore(){
  const query=($("#search-input")?.value||"").toLowerCase().trim();
  const location=$("#filter-location").value, level=$("#filter-level").value, from=$("#filter-date").value;
  const filtered=activities.filter(a=>{
    const mc=activeCategory==="Todas"||a.category===activeCategory;
    const mq=!query||`${a.title} ${a.description} ${a.category}`.toLowerCase().includes(query);
    return mc&&mq&&(!location||extraInfo[a.id].location===location)&&(!level||a.level===level)&&(!from||hasFutureSession(a,from));
  });
  $("#activities-grid").innerHTML=filtered.length?filtered.map(activityCard).join(""):`<div class="empty-state">No hemos encontrado actividades con esos filtros.</div>`;
}

function openDetail(id){
  selectedActivity=activities.find(a=>a.id===Number(id));
  if(!selectedActivity) return;
  $("#modal-activity-image").src = selectedActivity.image;
  $("#modal-activity-image").alt = selectedActivity.title;
  $("#modal-category").textContent=selectedActivity.category;
  $("#modal-title").textContent=selectedActivity.title;
  $("#modal-description").textContent=selectedActivity.description;
  $("#modal-duration").textContent=selectedActivity.duration;
  $("#modal-level").textContent=selectedActivity.level;
  $("#modal-specialist").textContent=selectedActivity.specialist;
  const info=extraInfo[selectedActivity.id];
  $("#modal-extra").innerHTML=`<div><b>📍 Lugar</b><span>${info.place}</span></div><div><b>💳 Precio</b><span>1 sesión del pasaporte; sin cobro real</span></div><div><b>🎒 Materiales</b><span>${info.materials}</span></div><div><b>♿ Accesibilidad</b><span>${info.access}</span></div><div><b>👥 Grupo</b><span>Puedes venir sin acompañante · ${capacities[selectedActivity.id]} plazas iniciales</span></div>`;
  updateFavoriteButton();
  calendarMonth = new Date(new Date().getFullYear(),new Date().getMonth(),1);
  selectedSlot = null;
  backToCalendar();
  $("#activity-modal").classList.remove("hidden");
}
function closeModal(){ $("#activity-modal").classList.add("hidden"); selectedActivity=null; }

function showToast(title, message){
  $("#toast").innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  $("#toast").classList.remove("hidden");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => $("#toast").classList.add("hidden"), 3000);
}

function reserve(){
  if(!selectedActivity || bookingStep!=="summary" || !selectedSlot)return;
  syncReservationStatuses();
  const startAt=selectedSlot.startAt;
  const date=parseLocalStart(startAt);
  if(!date || date.getTime()<=Date.now()){alert("La sesión ya ha empezado. Elige otra fecha.");backToCalendar();return;}
  const stillFree=sessionsForDay(selectedActivity.id,date).some(s=>s.startAt===startAt&&s.free>0);
  if(!stillFree){alert("Esta sesión ya no tiene plazas libres.");backToCalendar();return;}
  if(reservations.length>=28){alert("No tienes sesiones disponibles en tu pasaporte.");return;}
  if(reservations.some(r=>r.activityId===selectedActivity.id&&r.startAt===startAt)){
    alert("Ya tienes reservada esta actividad en el mismo horario.");backToCalendar();return;
  }
  reservations.push({id:makeId(),activityId:selectedActivity.id,date:startAt,startAt,reservedAt:new Date().toISOString(),status:"reserved"});
  saveReservations();closeModal();renderDynamicViews();
  showToast("¡Reserva confirmada!","Puedes gestionarla en Mis actividades.");
}

function requestReservationAction(id){
  syncReservationStatuses();
  const reservation = reservations.find(r => r.id === id);
  if(!reservation || reservation.status !== "reserved") { renderDynamicViews(); return; }
  const activity = activities.find(a => a.id === reservation.activityId);
  if(!activity) return;
  pendingAction = {id};
  $("#confirm-title").textContent = "¿Cancelar esta reserva?";
  $("#confirm-description").textContent = `Se eliminará la reserva de «${activity.title}» (${formatDate(reservation.startAt || reservation.date)}). Recuperarás una sesión disponible.`;
  $("#confirm-action").textContent = "Sí, cancelar reserva";
  $("#confirm-action").classList.add("danger-btn");
  $("#confirmation-modal").classList.remove("hidden");
}
function closeConfirmation(){ $("#confirmation-modal").classList.add("hidden"); pendingAction = null; }
function confirmReservationAction(){
  if(!pendingAction) return;
  syncReservationStatuses();
  const index = reservations.findIndex(r => r.id === pendingAction.id && r.status === "reserved");
  if(index < 0){ closeConfirmation(); renderDynamicViews(); return; }
  reservations.splice(index, 1);
  saveReservations(); closeConfirmation(); renderDynamicViews();
  showToast("Reserva cancelada", "Se ha eliminado la reserva y has recuperado una sesión.");
}

function renderPassport(){
  const completed = reservations.filter(r => r.status === "completed").length;
  const reserved = reservations.filter(r => r.status === "reserved").length;
  const remaining = Math.max(0, 28 - completed - reserved);
  $("#remaining-count").textContent = remaining;
  $("#used-count").textContent = completed;
  $("#reserved-count").textContent = reserved;
  $("#metric-sessions").textContent = remaining;
  $("#passport-progress").style.width = `${Math.min(100,(completed / 28)*100)}%`;
  $("#passport-reserved-progress").style.width = `${Math.min(100,(reserved/28)*100)}%`;
  $("#passport-free-progress").style.width = `${Math.min(100,(remaining/28)*100)}%`;
  const history = $("#passport-history");
  if(!reservations.length){
    history.innerHTML = `<div class="empty-state">Todavía no has reservado ninguna actividad. Empieza explorando el catálogo.</div>`;
    return;
  }
  history.innerHTML = reservations.slice().reverse().map(r => {
    const a = activities.find(x => x.id === r.activityId);
    if(!a) return "";
    return `<div class="history-item">
      <div class="left"><div class="mini-icon">${a.icon}</div>
        <div><strong>${a.title}</strong><div class="muted">${formatDate(r.date)}</div></div>
      </div>
      <span class="status-tag status-${r.status}">${statusLabel[r.status]}</span>
    </div>`;
  }).join("");
}

function renderMyActivities(){
  const c = $("#my-activities");
  if(!reservations.length){
    c.innerHTML = `<div class="empty-state">Aún no tienes actividades reservadas. <button class="text-btn" data-view="explore">Explorar actividades →</button></div>`;
    return;
  }
  const order = {reserved:0,completed:1};
  const shown=reservations.filter(r=>r.status===currentActivityTab).sort((a,b)=>currentActivityTab==='reserved'?(a.startAt||'').localeCompare(b.startAt||''):(b.startAt||'').localeCompare(a.startAt||''));
  if(!shown.length){c.innerHTML=`<div class="empty-state">${currentActivityTab==='reserved'?'No tienes próximas reservas.':'Aún no tienes actividades realizadas.'}</div>`;return;}
  c.innerHTML = shown.map(r => {
    const a = activities.find(x => x.id === r.activityId);
    if(!a) return "";
    return `<article class="activity-card reservation-card">
      <div class="reservation-visual"><img src="${a.image}" alt="${a.title}" loading="lazy"></div>
      <div class="card-body">
        <div class="card-topline"><span class="tag">${a.category}</span><span class="status-tag status-${r.status}">${statusLabel[r.status]}</span></div>
        <h3>${a.title}</h3>
        <p>${a.description}</p>
        <div class="meta"><span>📅 ${formatDate(r.date)}</span><span>⏱ ${a.duration}</span></div>
        <div class="card-actions reservation-actions">
          ${r.status === "reserved" ? `<button class="cancel-btn" data-cancel="${r.id}">Cancelar reserva</button>` : `<button class="secondary-btn" data-repeat="${a.id}">Repetir actividad</button>`}
        </div>
      </div>
    </article>`;
  }).join("");
}
function renderDynamicViews(){ syncReservationStatuses(); renderExplore(); renderPassport(); renderMyActivities(); renderFavorites();updateActivityTabs(); }

document.addEventListener("click",e=>{
  const fav=e.target.closest('[data-favorite]');if(fav){toggleFavorite(fav.dataset.favorite);return;}
  const repeat=e.target.closest('[data-repeat]');if(repeat){openDetail(repeat.dataset.repeat);return;}
  const tab=e.target.closest('[data-activity-tab]');if(tab){currentActivityTab=tab.dataset.activityTab;renderMyActivities();updateActivityTabs();return;}
  const cat=e.target.closest("[data-category]");
  if(cat){ activeCategory=cat.dataset.category; showView("explore"); renderFilters(); renderExplore(); }
  const filter=e.target.closest("[data-filter]");
  if(filter){ activeCategory=filter.dataset.filter; renderFilters(); renderExplore(); }
  const detail=e.target.closest("[data-detail]");
  if(detail) openDetail(detail.dataset.detail);
  const cancel = e.target.closest("[data-cancel]");
  if(cancel) requestReservationAction(cancel.dataset.cancel);
});

$("#search-input").addEventListener("input",renderExplore);
['filter-location','filter-level','filter-date'].forEach(id=>document.getElementById(id).addEventListener('change',renderExplore));
$('#clear-filters').addEventListener('click',()=>{$('#search-input').value='';$('#filter-location').value='';$('#filter-level').value='';$('#filter-date').value='';activeCategory='Todas';renderFilters();renderExplore();});
$('#modal-favorite').addEventListener('click',()=>{if(selectedActivity)toggleFavorite(selectedActivity.id);});
$('#mobile-menu-btn').addEventListener('click',()=>{const el=$('#mobile-nav');const opening=el.classList.contains('hidden');el.classList.toggle('hidden',!opening);$('#mobile-menu-btn').setAttribute('aria-expanded',String(opening));});
$('#reset-data').addEventListener('click',()=>{if(!confirm('¿Eliminar todas las reservas y favoritos de prueba? Esta acción no se puede deshacer.'))return;reservations=[];favorites=[];saveReservations();saveFavorites();renderDynamicViews();showToast('Datos restablecidos','Vuelves a tener las 28 sesiones disponibles.');});
$("#modal-close").addEventListener("click",closeModal);
$("#activity-modal").addEventListener("click",e=>{ if(e.target.id==="activity-modal") closeModal(); });
$("#reserve-btn").addEventListener("click",reserve);
$("#booking-continue").addEventListener("click",showBookingSummary);
$("#booking-back").addEventListener("click",backToCalendar);
$("#calendar-prev").addEventListener("click",()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);selectedSlot=null;renderCalendar();});
$("#calendar-next").addEventListener("click",()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);selectedSlot=null;renderCalendar();});
$("#calendar-days").addEventListener("click",e=>{const btn=e.target.closest("[data-calendar-day]");if(btn)chooseDay(btn.dataset.calendarDay);});
$("#available-times").addEventListener("click",e=>{const btn=e.target.closest("[data-slot]");if(btn)chooseSlot(btn.dataset.slot);});
$("#confirm-action").addEventListener("click",confirmReservationAction);
$("#confirm-back").addEventListener("click",closeConfirmation);
$("#confirm-close").addEventListener("click",closeConfirmation);
$("#confirmation-modal").addEventListener("click", e => {
  if(e.target.id === "confirmation-modal") closeConfirmation();
});
document.addEventListener("keydown", e => {
  if(e.key === "Escape") { closeConfirmation(); closeModal(); }
});

renderHome(); renderFilters(); renderDynamicViews();
// La página puede permanecer abierta: comprobar periódicamente el inicio de cada sesión.
setInterval(renderDynamicViews, 30000);
window.addEventListener("focus", renderDynamicViews);
document.addEventListener("visibilitychange", () => { if (!document.hidden) renderDynamicViews(); });
