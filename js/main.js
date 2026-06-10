document.addEventListener('DOMContentLoaded', () => {
    // Simple Countdown Logic
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        function updateCountdown() {
            const targetDate = new Date('July 19, 2027 18:00:00').getTime();
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                daysEl.innerText = days;
                hoursEl.innerText = hours;
                minutesEl.innerText = minutes;
                secondsEl.innerText = seconds;
            } else {
                daysEl.innerText = 0;
                hoursEl.innerText = 0;
                minutesEl.innerText = 0;
                secondsEl.innerText = 0;
            }
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // Reveal on scroll micro-interaction
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(section => {
        section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
        observer.observe(section);
    });

    // Real-time validation for amount input
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const errorMsg = document.getElementById('error-msg');
            if (value >= 100) {
                errorMsg.classList.add('opacity-0');
                this.parentElement.classList.remove('border-error');
                this.parentElement.classList.add('border-primary');
            }
        });
    }

    // Admin Panel Login Toggle
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm && loginSection && dashboardSection && logoutBtn) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate authentication
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            dashboardSection.classList.add('flex');
            loadRsvpsTable();
        });

        logoutBtn.addEventListener('click', () => {
            dashboardSection.classList.add('hidden');
            dashboardSection.classList.remove('flex');
            loginSection.classList.remove('hidden');
            document.getElementById('password').value = '';
        });
    }

    // --- Modais de RSVP e Mapa/Dicas ---
    function injectModals() {
        if (document.getElementById('rsvp-modal')) return;

        const rsvpModalHTML = `
        <div id="rsvp-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-300">
            <div class="bg-surface border border-outline-variant max-w-md w-full rounded-2xl p-6 md:p-8 shadow-2xl relative translate-y-4 transition-all duration-300 modal-content">
                <button id="close-rsvp-modal" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="text-center mb-6">
                    <span class="material-symbols-outlined text-primary text-4xl mb-2">favorite</span>
                    <h3 class="font-headline-h4 text-primary italic">Confirmar Presença</h3>
                    <p class="font-body-md text-on-surface-variant text-sm mt-1">Sua presença é muito importante para nós!</p>
                </div>
                <form id="rsvp-form" class="space-y-4">
                    <div class="flex flex-col gap-1">
                        <label class="font-label-caps text-[10px] text-on-surface-variant" for="rsvp-name">Nome Completo</label>
                        <input required type="text" id="rsvp-name" class="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors" placeholder="Seu nome completo"/>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="font-label-caps text-[10px] text-on-surface-variant" for="rsvp-phone">Telefone / WhatsApp</label>
                        <input required type="tel" id="rsvp-phone" class="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors" placeholder="(00) 00000-0000"/>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="font-label-caps text-[10px] text-on-surface-variant" for="rsvp-email">E-mail</label>
                        <input required type="email" id="rsvp-email" class="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-on-surface transition-colors" placeholder="seu.email@exemplo.com"/>
                    </div>
                    <div class="flex flex-col gap-2 pt-2">
                        <label class="font-label-caps text-[10px] text-on-surface-variant">Você irá ao evento?</label>
                        <div class="flex gap-4">
                            <label class="flex items-center gap-2 cursor-pointer font-body-md text-sm text-on-surface">
                                <input type="radio" name="rsvp-status" value="Confirmado" checked class="text-primary focus:ring-primary border-outline-variant"/>
                                Sim, com certeza!
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer font-body-md text-sm text-on-surface">
                                <input type="radio" name="rsvp-status" value="Não poderei ir" class="text-primary focus:ring-primary border-outline-variant"/>
                                Infelizmente não poderei ir
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="w-full mt-4 bg-primary text-on-primary py-3 rounded-full font-label-caps hover:bg-primary/90 transition-colors shadow-md active:scale-95 transition-all">
                        Confirmar Presença
                    </button>
                </form>
            </div>
        </div>
        `;

        const mapModalHTML = `
        <div id="map-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-300">
            <div class="bg-surface border border-outline-variant max-w-2xl w-full rounded-2xl p-6 md:p-8 shadow-2xl relative translate-y-4 transition-all duration-300 modal-content max-h-[90vh] overflow-y-auto">
                <button id="close-map-modal" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="text-center mb-6">
                    <span class="material-symbols-outlined text-primary text-4xl mb-2">location_on</span>
                    <h3 class="font-headline-h4 text-primary italic">Mapa do Local & Dicas</h3>
                    <p class="font-body-md text-on-surface-variant text-sm mt-1">Como chegar e o que vestir em Acapulco</p>
                </div>
                
                <!-- Google Maps Embed -->
                <div class="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-outline-variant mb-6 shadow-inner">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122295.69830588667!2d-99.9194200840248!3d16.852481691238692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ca5814524be3bf%3A0xe54d32a9a5f7f98e!2sAcapulco%2C%20Guerrero%2C%20M%C3%A9xico!5e0!3m2!1spt-BR!2sbr!4v1689000000000!5m2!1spt-BR!2sbr" 
                        class="w-full h-full border-0" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>

                <!-- Dicas Úteis -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div class="p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                        <div class="flex items-center gap-2 text-primary mb-2">
                            <span class="material-symbols-outlined">styler</span>
                            <span class="font-label-caps font-bold">Traje</span>
                        </div>
                        <p class="text-xs text-on-surface-variant leading-relaxed">
                            <strong>Esporte Fino / Praia Chique:</strong> Tecidos leves (como linho), cores claras ou pastel. Dispensa-se o uso de gravata.
                        </p>
                    </div>
                    <div class="p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                        <div class="flex items-center gap-2 text-primary mb-2">
                            <span class="material-symbols-outlined">device_thermostat</span>
                            <span class="font-label-caps font-bold">Clima</span>
                        </div>
                        <p class="text-xs text-on-surface-variant leading-relaxed">
                            Acapulco em julho é quente e tropical (média de 28°C a 32°C). A brisa do mar ajuda no final do dia, mas opte por tecidos frescos.
                        </p>
                    </div>
                    <div class="p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                        <div class="flex items-center gap-2 text-primary mb-2">
                            <span class="material-symbols-outlined">hotel</span>
                            <span class="font-label-caps font-bold">Hospedagem</span>
                        </div>
                        <p class="text-xs text-on-surface-variant leading-relaxed">
                            Recomendamos os resorts localizados na <strong>Zona Diamante</strong> de Acapulco, que oferece fácil acesso ao local e segurança.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', rsvpModalHTML);
        document.body.insertAdjacentHTML('beforeend', mapModalHTML);
    }

    injectModals();

    const rsvpModal = document.getElementById('rsvp-modal');
    const mapModal = document.getElementById('map-modal');
    const rsvpForm = document.getElementById('rsvp-form');

    // Funções para abrir/fechar Modais
    function openModal(modal) {
        if (!modal) return;
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.classList.remove('translate-y-4');
            content.classList.add('translate-y-0');
        }
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.classList.remove('translate-y-0');
            content.classList.add('translate-y-4');
        }
    }

    // Fechar ao clicar fora do conteúdo
    [rsvpModal, mapModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    // Close buttons
    const closeRsvpBtn = document.getElementById('close-rsvp-modal');
    if (closeRsvpBtn) closeRsvpBtn.addEventListener('click', () => closeModal(rsvpModal));

    const closeMapBtn = document.getElementById('close-map-modal');
    if (closeMapBtn) closeMapBtn.addEventListener('click', () => closeModal(mapModal));

    // Botões gatilho RSVP
    document.querySelectorAll('.btn-rsvp-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(rsvpModal);
        });
    });

    // Botão gatilho Mapa
    const btnMapa = document.getElementById('btn-mapa');
    if (btnMapa) {
        btnMapa.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(mapModal);
        });
    }

    // RSVP Form Submit
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('rsvp-name').value;
            const phone = document.getElementById('rsvp-phone').value;
            const email = document.getElementById('rsvp-email').value;
            const status = rsvpForm.querySelector('input[name="rsvp-status"]:checked').value;

            const newRsvp = { name, phone, email, status, date: new Date().toLocaleDateString('pt-BR') };

            // Salvar no localStorage
            let currentRsvps = JSON.parse(localStorage.getItem('rsvps')) || [];
            currentRsvps.push(newRsvp);
            localStorage.setItem('rsvps', JSON.stringify(currentRsvps));

            // Feedback e limpar formulário
            alert('Presença confirmada com sucesso! Obrigado!');
            rsvpForm.reset();
            closeModal(rsvpModal);

            // Se estiver na tela administrativa, atualiza a tabela na hora
            if (document.getElementById('rsvp-table-body')) {
                loadRsvpsTable();
            }
        });
    }

    // --- Painel Administrativo RSVPs ---
    const rsvpTableBody = document.getElementById('rsvp-table-body');
    const btnClearRsvps = document.getElementById('btn-clear-rsvps');

    window.loadRsvpsTable = function() {
        if (!rsvpTableBody) return;

        let rsvps = JSON.parse(localStorage.getItem('rsvps'));
        
        // Dados mock iniciais se estiver vazio
        if (!rsvps || rsvps.length === 0) {
            rsvps = [
                { name: 'Lucas & Júlia', phone: '(11) 98765-4321', email: 'lucas@gmail.com', status: 'Confirmado', date: '10/06/2026' },
                { name: 'Beatriz Costa', phone: '(21) 99888-7766', email: 'biacosta@yahoo.com.br', status: 'Não poderei ir', date: '09/06/2026' }
            ];
            localStorage.setItem('rsvps', JSON.stringify(rsvps));
        }

        rsvpTableBody.innerHTML = '';
        rsvps.forEach(rsvp => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface transition-colors';
            
            const isConfirmed = rsvp.status === 'Confirmado';
            const statusBadge = isConfirmed 
                ? `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-primary-container bg-primary-container/10 text-primary-container text-xs font-medium">Confirmado</span>`
                : `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-outline text-on-surface-variant text-xs font-medium">Não poderei ir</span>`;

            tr.innerHTML = `
                <td class="py-3 md:py-4 px-4 md:px-6 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        ${rsvp.name.charAt(0)}
                    </div>
                    <span class="font-medium">${rsvp.name}</span>
                </td>
                <td class="py-3 md:py-4 px-4 md:px-6 text-on-surface-variant">${rsvp.phone}</td>
                <td class="py-3 md:py-4 px-4 md:px-6 text-on-surface-variant">${rsvp.email}</td>
                <td class="py-3 md:py-4 px-4 md:px-6">${statusBadge}</td>
            `;
            rsvpTableBody.appendChild(tr);
        });
    }

    if (rsvpTableBody) {
        // Carrega inicialmente
        loadRsvpsTable();
    }

    if (btnClearRsvps) {
        btnClearRsvps.addEventListener('click', () => {
            if (confirm('Tem certeza de que deseja limpar toda a lista de presenças (RSVP)?')) {
                localStorage.setItem('rsvps', JSON.stringify([]));
                loadRsvpsTable();
            }
        });
    }
});

// Global function for form submission
function validateAmount() {
    const input = document.getElementById('amount');
    const errorMsg = document.getElementById('error-msg');
    const value = parseFloat(input.value);

    if (isNaN(value) || value < 100) {
        errorMsg.classList.remove('opacity-0');
        errorMsg.classList.add('opacity-100');
        input.parentElement.classList.add('border-error');
        input.parentElement.classList.remove('border-outline-variant');
    } else {
        errorMsg.classList.add('opacity-0');
        errorMsg.classList.remove('opacity-100');
        input.parentElement.classList.remove('border-error');
        input.parentElement.classList.add('border-primary');
        alert('Obrigado pelo seu carinho! Redirecionando para o pagamento...');
    }
}

