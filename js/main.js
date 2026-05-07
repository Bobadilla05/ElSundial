// --- MENÚ HAMBURGUESA RESPONSIVE ---
function initNavHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navUl     = document.querySelector('nav ul');
    if (!hamburger || !navUl) return;

    hamburger.addEventListener('click', () => {
        navUl.classList.toggle('abierto');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            navUl.classList.remove('abierto');
            const icon = hamburger.querySelector('i');
            if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
        }
    });
}

// --- LINK ACTIVO EN NAV ---
function setNavActivo() {
    const pagina = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === pagina) link.classList.add('activo');
    });
}

// --- PARTÍCULAS EN EL ENCABEZADO ---
function initParticulas() {
    const container = document.querySelector('.encabezado-particles');
    if (!container) return;

    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 60 + 20;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 15 + 10}s;
            animation-delay: ${Math.random() * 10}s;
        `;
        container.appendChild(p);
    }
}

// --- ANIMACIÓN AL HACER SCROLL ---
function initScrollAnimaciones() {
    const elementos = document.querySelectorAll(
        '.contenido, .actividad-card, .resena-card, .contacto-card, .instalacion-item, .stat-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elementos.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// --- CONTADOR ANIMADO EN STATS ---
function animarContador(el, destino, sufijo = '') {
    const duracion = 1800;
    const inicio = performance.now();
    const inicioVal = 0;

    function paso(ahora) {
        const progreso = Math.min((ahora - inicio) / duracion, 1);
        const easing = 1 - Math.pow(1 - progreso, 3);
        el.textContent = Math.floor(inicioVal + (destino - inicioVal) * easing) + sufijo;
        if (progreso < 1) requestAnimationFrame(paso);
    }

    requestAnimationFrame(paso);
}

function initContadores() {
    const stats = document.querySelectorAll('.stat-numero[data-target]');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const sufijo = el.dataset.sufijo || '';
                animarContador(el, target, sufijo);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
}

// --- LIGHTBOX PARA GALERÍA ---
function initGaleria() {
    const imgs = document.querySelectorAll('.grid img');
    if (!imgs.length) return;

    const overlay = document.createElement('div');
    overlay.id = 'lightbox';
    overlay.style.cssText = `
        display:none; position:fixed; inset:0; background:rgba(0,0,0,0.9);
        z-index:9999; align-items:center; justify-content:center; cursor:zoom-out;
    `;
    const img = document.createElement('img');
    img.style.cssText = 'max-width:90vw; max-height:90vh; border-radius:12px; box-shadow:0 0 60px rgba(0,0,0,0.5);';
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    imgs.forEach(i => {
        i.style.cursor = 'zoom-in';
        i.addEventListener('click', () => {
            img.src = i.src;
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { overlay.style.display = 'none'; document.body.style.overflow = ''; }
    });
}

// --- FORMULARIO DE COMENTARIOS ---
function initFormulario() {
    const form = document.getElementById('form-comentario');
    if (!form) return;

    const STORAGE_KEY = 'sundial_resenas';

    function cargarResenas() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch { return []; }
    }

    function guardarResenas(arr) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }

    function coloresAvatar() {
        const cols = ['#1a3d2b','#2e6b47','#1e8fa5','#c9a84c','#4a9e6b','#1a5c6b'];
        return cols[Math.floor(Math.random() * cols.length)];
    }

    function renderizarResenas(arr) {
        const lista = document.getElementById('lista-resenas');
        const sinResenas = document.getElementById('sin-resenas');

        if (!arr.length) {
            if (sinResenas) sinResenas.style.display = 'block';
            return;
        }

        if (sinResenas) sinResenas.style.display = 'none';

        lista.innerHTML = arr.slice().reverse().map(r => `
            <div class="resena-card" style="animation: entrar 0.5s ease both">
                <div class="resena-header">
                    <div class="resena-autor">
                        <div class="avatar" style="background:${r.color}">${r.nombre.charAt(0).toUpperCase()}</div>
                        <div>
                            <div class="resena-nombre">${r.nombre}</div>
                            <div class="resena-fecha">${r.fecha}</div>
                        </div>
                    </div>
                    <div class="estrellas-display">${'★'.repeat(r.estrellas)}${'☆'.repeat(5 - r.estrellas)}</div>
                </div>
                <p class="resena-texto">"${r.comentario}"</p>
            </div>
        `).join('');
    }

    function mostrarAlerta(tipo, msg) {
        const alerta = document.getElementById('alerta-form');
        if (!alerta) return;
        alerta.className = `alerta alerta-${tipo}`;
        alerta.textContent = msg;
        alerta.style.display = 'block';
        setTimeout(() => alerta.style.display = 'none', 3500);
    }

    renderizarResenas(cargarResenas());

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre   = form.nombre.value.trim();
        const visita   = form.visita ? form.visita.value : '';
        const estrellas = parseInt(form.querySelector('input[name="estrellas"]:checked')?.value || '0');
        const comentario = form.comentario.value.trim();

        if (!nombre || !comentario || !estrellas) {
            mostrarAlerta('error', ' Por favor completa todos los campos y selecciona una calificación.');
            return;
        }

        const nueva = {
            nombre,
            visita,
            estrellas,
            comentario,
            color: coloresAvatar(),
            fecha: new Date().toLocaleDateString('es-MX', { year:'numeric', month:'long', day:'numeric' })
        };

        const arr = cargarResenas();
        arr.push(nueva);
        guardarResenas(arr);
        renderizarResenas(arr);

        mostrarAlerta('exito', ' ¡Gracias por tu comentario! Tu reseña ha sido publicada.');
        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavHamburger();
    setNavActivo();
    initParticulas();
    initScrollAnimaciones();
    initContadores();
    initGaleria();
    initFormulario();
});
