
/*function checkPassword() {
    const password = document.getElementById('pass-input').value;
    const errMsg = document.getElementById('err-msg');
    
    const secureHash = "a310f1a29b3965c7bafc0451ba005fb6d24cf27d3080991e797973334ebb70c4"; 


    const inputHash = CryptoJS.SHA256(password).toString();

    if (inputHash === secureHash) {
    
        document.getElementById('password-overlay').style.display = 'none';
        document.body.style.overflow = 'auto'; 
    
        updateTimelinePath();
    } else {
        errMsg.style.display = 'block';
        errMsg.textContent = "Invalid password";
    }
}


document.getElementById('pass-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});
document.body.style.overflow = 'hidden';
*/

window.onload = function() {
    // On attend un tout petit délai pour s'assurer que le rendu est fini
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant' // 'instant' évite de voir la page défiler vers le haut
        });
    }, 10);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function toggleExpand(btn) {
    const content = btn.parentElement;
    
    
    content.classList.toggle('expanded');

    
    
    let duration = 500;
    let start = null;

    function animate(timestamp) {
        if (!start) start = timestamp;
        updateTimelinePath(); 
        if (timestamp - start < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function toggleZoom(media) {
    const isZoomed = media.classList.contains('zoomed');
    
    if (isZoomed) {
        media.classList.remove('zoomed');
        document.body.style.overflow = '';
    } else {
        
        document.querySelectorAll('.zoomed').forEach(el => el.classList.remove('zoomed'));
        
        media.classList.add('zoomed');
        document.body.style.overflow = 'hidden';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const vObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            const container = video.parentElement;

            if (entry.isIntersecting) {
                // 1. Si la source n'est pas encore mise, on l'injecte (Lazy Loading)
                if (!video.src) {
                    video.src = video.dataset.src;
                    video.load();
                }

                // 2. Lancer la lecture
                video.play().catch(() => {});

                // 3. Masquer le spinner quand la vidéo est prête à jouer
                video.oncanplay = () => {
                    video.classList.add('ready');
                    container.classList.add('loaded');
                };
            } else {
                // Hors écran : on met en pause (sauf si zoomée, pour ton cas précis)
                if (!video.classList.contains('zoomed')) {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.2 }); // Se déclenche quand 20% de la vidéo est visible

    // On applique l'observateur à toutes les vidéos concernées
    document.querySelectorAll('.lazy-video').forEach(v => vObserver.observe(v));
});

function updateTimelinePath() {
    const path = document.querySelector('.timeline-path');
    const ribbon = document.querySelector('.timeline-ribbon');
    const svg = document.querySelector('.timeline-svg');
    const hero = document.getElementById('hero');
    
    
    const sections = document.querySelectorAll('.step');
    
    if(!path || !ribbon || !hero || sections.length === 0) return;

    const totalHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight
    );
    const width = window.innerWidth;
    
    svg.setAttribute('width', width);
    svg.setAttribute('height', totalHeight);
    svg.setAttribute('viewBox', `0 0 ${width} ${totalHeight}`);

    let currentY = hero.offsetHeight * 0.5;
    
    
    let lineData = `M ${width / 2} 0 L ${width / 2} ${currentY}`;
    
    
    
    
    let ribbonData = `M ${width / 2} 0 L ${width} 0 L ${width} ${currentY} L ${width / 2} ${currentY} Z`;
    
    
    ribbonData += ` M ${width / 2} ${currentY}`;

    sections.forEach((section, index) => {
        const sectionY = section.offsetTop + (section.offsetHeight / 2);
        
        
        const isTextLeft = (index % 2 === 0);
        const targetX = isTextLeft ? (width * 0.75) : (width * 0.25);
        const edgeX = isTextLeft ? width : 0;
        
        const midY = currentY + (sectionY - currentY) / 2;
        
        
        const segment = ` C ${width / 2} ${midY}, ${targetX} ${midY}, ${targetX} ${sectionY}`;
        
        lineData += segment;

        
        ribbonData += segment;
        ribbonData += ` L ${edgeX} ${sectionY} L ${edgeX} ${currentY} Z`;
        ribbonData += ` M ${targetX} ${sectionY}`;
        
        currentY = sectionY;
    });

    
    lineData += ` L ${width / 2} ${totalHeight}`;

    path.setAttribute('d', lineData);
    ribbon.setAttribute('d', ribbonData);
}


window.addEventListener('load', updateTimelinePath);
window.addEventListener('resize', updateTimelinePath);


setTimeout(updateTimelinePath, 1000);

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Initialisation au scroll avec Intersection Observer
const observerOptions = { threshold: 0.5 };
const scrambleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.scrambled) {
      const fx = new TextScramble(entry.target);
      fx.setText(entry.target.innerText);
      entry.target.dataset.scrambled = "true"; // Pour ne le faire qu'une fois
    }
  });
}, observerOptions);

// On cible les titres H1 du hero et les titres des steps
document.querySelectorAll('.step-content h2').forEach(h => scrambleObserver.observe(h));

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 80; // Nombre de points (ajuste selon tes besoins)
const connectionDistance = 120; // Distance max pour tracer une ligne
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Interaction avec la souris (les particules s'écartent légèrement)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8'; // Ton bleu ciel
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(56, 189, 248, ${1 - distance / connectionDistance - 0.5})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

init();
animate();