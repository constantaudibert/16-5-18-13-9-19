document.addEventListener('DOMContentLoaded', () => {
    const monthsContainer = document.getElementById('heatmap-container');
    const tooltip = document.getElementById('tooltip');
    const decryptBtn = document.getElementById('decrypt-btn');
    const modal = document.getElementById('reveal-modal');
    const closeBtn = document.getElementById('close-modal');
    const postItList = document.getElementById('post-it-list');
    const valHours = document.getElementById('val-hours');

    // --- INTRO SEQUENCE LOGIC ---
    const introOverlay = document.getElementById('intro-overlay');
    const folderTrigger = document.getElementById('folder-trigger');
    if (introOverlay && folderTrigger) {
        folderTrigger.addEventListener('click', () => {
            introOverlay.classList.add('hidden');
        });
    }

    // Events Dictionary
    const events = {};
    const addEvent = (dateStr, type, title, desc, length) => {
        events[dateStr] = { type, title, desc, length };
    };

    // --- CLASSIFIED EVENTS (Based on actual timeline) ---
    addEvent('2025-01-13', 'lv-1', 'Initialisation', 'Téléchargement données brutes S.I.M.O.N.E', 0);

    addEvent('2025-03-12', 'lv-5', 'Test théorique', 'Résultat : Corrompu (Test 1)', 0);
    addEvent('2025-03-22', 'lv-5', 'Test théorique', 'Résultat : Corrompu (Test 2)', 0);
    addEvent('2025-03-28', 'lv-4', 'Test théorique', 'Résultat : Déchiffrement réussi', 0);

    addEvent('2025-04-09', 'lv-3', 'Phase B', 'Reconnaissance terrain initiale', 1);

    // June 2025: 1h
    ['2025-06-10', '2025-06-12', '2025-06-13', '2025-06-17', '2025-06-19', '2025-06-20', '2025-06-24', '2025-06-26', '2025-06-27'].forEach(d => {
        addEvent(d, 'lv-3', 'Opération', 'Entrainement', 1);
    });

    // Sept 2025: 1h
    ['2025-09-02', '2025-09-04', '2025-09-05', '2025-09-11'].forEach(d => {
        addEvent(d, 'lv-3', 'Opération', 'Entrainement', 1);
    });

    // Sept - Nov 2025: 2h
    ['2025-09-18', '2025-09-25', '2025-10-02', '2025-10-09', '2025-10-16', '2025-11-06'].forEach(d => {
        addEvent(d, 'lv-3', 'Opération', 'Entrainement', 2);
    });

    // Nov 2025: 1h
    ['2025-11-13', '2025-11-18'].forEach(d => {
        addEvent(d, 'lv-3', 'Opération', 'Entrainement', 1);
    });

    // Nov 2025: 2h
    addEvent('2025-11-20', 'lv-3', 'Opération', 'Entrainement', 2);

    addEvent('2025-11-24', 'lv-5', 'Opération déviée', 'Statut : Échec critique', 0);

    // Jan 2026: 1h
    ['2026-01-08', '2026-01-15', '2026-01-22', '2026-01-27', '2026-01-28'].forEach(d => {
        addEvent(d, 'lv-3', 'Opération', 'Maintenance', 1);
    });

    // Attempt 2 
    addEvent('2026-01-28', 'lv-5', 'Extraction Principale (v2)', 'Statut : Paramètres instables, échec', 1);

    // Feb 2026
    addEvent('2026-02-12', 'lv-3', 'Opération', 'Entrainement', 1);
    addEvent('2026-02-25', 'lv-3', 'Opération', 'Ultime mise au point', 2);

    // Favorable
    addEvent('2026-02-26', 'lv-4', 'Validation du Dossier', 'Statut : CIBLE ACQUISE. Autorisation délivrée.', 0);

    // --- RENDER CALENDAR ---
    let html = '';

    const startY = 2025;
    const startM = 0; // Jan
    const endY = 2026;
    const endM = 1; // Feb

    let currentY = startY;
    let currentM = startM;
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    while (currentY < endY || (currentY === endY && currentM <= endM)) {
        const label = `${monthNames[currentM]} ${currentY}`;

        const daysInMonth = new Date(Date.UTC(currentY, currentM + 1, 0, 12)).getDate();

        let firstDay = new Date(Date.UTC(currentY, currentM, 1, 12)).getDay();
        firstDay = firstDay === 0 ? 6 : firstDay - 1;

        const prevMonthDays = new Date(Date.UTC(currentY, currentM, 0, 12)).getDate();

        let monthHtml = `<div class="month-block">
            <div class="month-label">${label}</div>
            <div class="month-grid">
                <div class="weekday">L</div><div class="weekday">M</div><div class="weekday">M</div><div class="weekday">J</div><div class="weekday">V</div><div class="weekday">S</div><div class="weekday">D</div>`;

        // Padding from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            monthHtml += `<div class="day-cell off-month">${prevMonthDays - i}</div>`;
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${currentY}-${(currentM + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            let lv = 'lv-0';
            let eventData = null;
            if (events[dateStr]) {
                eventData = events[dateStr];
                lv = eventData.type;
            }
            monthHtml += `<div class="day-cell ${lv}" 
                data-date="${dateStr}" 
                ${eventData ? `data-title="${eventData.title}" data-desc="${eventData.desc}"` : ''}
            >${i}</div>`;
        }

        // Padding for next month
        const totalCells = firstDay + daysInMonth;
        const remainingCells = (7 - (totalCells % 7)) % 7;
        for (let i = 1; i <= remainingCells; i++) {
            monthHtml += `<div class="day-cell off-month">${i}</div>`;
        }

        monthHtml += `</div></div>`;
        html += monthHtml;

        currentM++;
        if (currentM > 11) {
            currentM = 0;
            currentY++;
        }
    }

    if (monthsContainer) {
        monthsContainer.innerHTML = html;
        // Fix the wrapper class
        monthsContainer.className = 'months-container';
    }

    // --- RENDER POST-IT ---
    const drivingDays = Object.keys(events).filter(d => events[d].length > 0).sort();
    let postItHtml = '<ul>';
    let drivingHoursTotal = 0;

    drivingDays.forEach(dStr => {
        const ev = events[dStr];
        const d = new Date(dStr);
        let dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1, -1);
        if (dayName === "Ven") dayName = "Vend";

        const dayNum = d.getDate().toString().padStart(2, '0');
        const monthNum = (d.getMonth() + 1).toString().padStart(2, '0');

        const length = ev.length;
        drivingHoursTotal += length;

        postItHtml += `<li><span>${dayName} ${dayNum}/${monthNum}</span> <span>${length}H</span></li>`;
    });
    postItHtml += `</ul>`;

    if (postItList) postItList.innerHTML = postItHtml;
    if (valHours) valHours.innerText = drivingHoursTotal;

    // --- TOOLTIP LOGIC ---
    const formatFrDate = (dStr) => {
        const d = new Date(dStr);
        return d.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (monthsContainer) {
        monthsContainer.addEventListener('mouseover', (e) => {
            const cell = e.target.closest('.day-cell');
            if (cell) {
                if (cell.classList.contains('off-month')) return;

                const dStr = cell.getAttribute('data-date');
                const title = cell.getAttribute('data-title');
                const desc = cell.getAttribute('data-desc');

                let tooltipHtml = `<div class="tooltip-date">${formatFrDate(dStr)}</div>`;
                if (title) {
                    tooltipHtml += `<div class="tooltip-title">${title}</div>`;
                    tooltipHtml += `<div class="tooltip-desc">${desc}</div>`;
                } else {
                    tooltipHtml += `<div class="tooltip-desc">Aucune donnée de terrain</div>`;
                }

                tooltip.innerHTML = tooltipHtml;
                tooltip.style.opacity = '1';

                if (cell.classList.contains('lv-4') && cell.getAttribute('data-title') === 'Validation du Dossier') {
                    if (!decryptBtn.classList.contains('visible')) {
                        decryptBtn.classList.remove('hidden');
                        decryptBtn.classList.add('visible');
                    }
                }
            }
        });

        monthsContainer.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY - 20) + 'px';
        });

        monthsContainer.addEventListener('mouseout', (e) => {
            const cell = e.target.closest('.day-cell');
            if (cell) {
                tooltip.style.opacity = '0';
            }
        });

        monthsContainer.addEventListener('click', (e) => {
            const cell = e.target.closest('.day-cell');
            if (cell && cell.classList.contains('lv-4') && cell.getAttribute('data-title') === 'Validation du Dossier') {
                decryptBtn.classList.remove('hidden');
                decryptBtn.classList.add('visible');
                modal.classList.add('active');
            }
        });
    }

    if (decryptBtn) {
        decryptBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    const renderParticles = () => {
        const pContainer = document.getElementById('particles');
        let phtml = '';
        for (let i = 0; i < 40; i++) {
            const size = Math.random() * 4 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 20 + 20;
            const delay = Math.random() * 5;
            phtml += `<div style="position:absolute; width:${size}px; height:${size}px; background:var(--accent); border-radius:50%; top:${y}%; left:${x}%; opacity:${Math.random()}; animation: float ${duration}s linear infinite ${delay}s"></div>`;
        }
        if (pContainer) pContainer.innerHTML = phtml;

        const style = document.createElement('style');
        style.innerHTML += `
            @keyframes float {
                0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                50% { opacity: 0.2; }
                100% { transform: translateY(-500px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    };
    renderParticles();
});
