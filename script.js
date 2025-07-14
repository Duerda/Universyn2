document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos DOM ---
    const landingPage = document.getElementById('landing-page');
    const universePage = document.getElementById('universe-page');
    const enterUniverseBtn = document.getElementById('enter-universe-btn');
    const backToLandingBtn = document.getElementById('back-to-landing-btn');
    const galaxyContainer = document.getElementById('galaxy-container');
    const addPlanetBtn = document.getElementById('add-planet-btn');
    const addPlanetModal = document.getElementById('add-planet-modal');
    const closeModalBtnAddPlanet = addPlanetModal.querySelector('.close-button');
    const availableToolsList = document.getElementById('available-tools-list');
    const contextMenu = document.getElementById('context-menu');
    const resetGalaxyBtn = document.getElementById('reset-galaxy-btn');
    const toggleAnimationsBtn = document.getElementById('toggle-animations-btn');

    const changeColorModal = document.getElementById('change-color-modal');
    const closeModalBtnChangeColor = changeColorModal.querySelector('.close-button');
    const colorPalette = document.querySelector('.color-palette');

    const changeThemeBtn = document.getElementById('change-theme-btn');
    const changeThemeModal = document.getElementById('change-theme-modal');
    const closeModalBtnChangeTheme = changeThemeModal.querySelector('.close-button');
    const themeOptionsContainer = document.querySelector('.theme-options');

    const saveGalaxyBtn = document.getElementById('save-galaxy-btn');
    const loadGalaxyBtn = document.getElementById('load-galaxy-btn');
    const manageGalaxiesModal = document.getElementById('manage-galaxies-modal');
    const closeModalBtnManageGalaxies = manageGalaxiesModal.querySelector('.close-button');
    const saveGalaxyNameInput = document.getElementById('save-galaxy-name');
    const confirmSaveGalaxyBtn = document.getElementById('confirm-save-galaxy-btn');
    const savedGalaxiesList = document.getElementById('saved-galaxies-list');

    // --- Variáveis de Estado ---
    let activeToolWindow = null;
    let isDraggingPlanet = false;
    let currentDraggedPlanet = null;
    let initialPlanetX, initialPlanetY;
    let initialMouseX, initialMouseY;

    let isDraggingWindow = false;
    let currentDraggedWindow = null;
    let initialWindowX, initialWindowY;
    let initialWindowMouseX, initialWindowMouseY;

    let planetCounter = 0;
    let targetPlanetForColorChange = null;
    let currentPlanets = [];
    let animationsEnabled = true;

    // --- Dados das Ferramentas ---
    const allTools = [
        { id: 'todo-list', name: 'To-do List', icon: '📝', defaultColor: 'planet-blue', content: '<div class="todo-list"><h3>Minhas Tarefas</h3><div style="display:flex; margin-bottom:10px;"><input type="text" id="new-todo-input" placeholder="Adicionar nova tarefa..." style="flex-grow:1;"><button class="add-task-btn">Add</button></div><ul id="todo-items"></ul></div>' },
        { id: 'pomodoro', name: 'Pomodoro', icon: '⏰', defaultColor: 'planet-green', content: '<div class="pomodoro"><h3>Cronômetro Pomodoro</h3><p id="pomodoro-timer">25:00</p><div class="pomodoro-controls"><button class="pomodoro-btn" data-action="start">Iniciar</button><button class="pomodoro-btn" data-action="pause">Pausar</button><button class="pomodoro-btn" data-action="reset">Resetar</button></div></div>' },
        { id: 'notes', name: 'Notas Rápidas', icon: '🗒️', defaultColor: 'planet-purple', content: '<div class="notes"><textarea id="notes-textarea" placeholder="Escreva suas notas aqui..." style="width:100%; height:150px; background:rgba(255,255,255,0.1); border:1px solid var(--neon-purple); color:var(--text-light); padding:10px; border-radius:4px;"></textarea></div>' },
        { id: 'calculator', name: 'Calculadora', icon: '🧮', defaultColor: 'planet-blue', content: '<div class="calculator"><h3>Calculadora</h3><input type="text" class="calc-display" value="0" readonly><div class="calc-buttons"><button>C</button><button>&larr;</button><button class="op">%</button><button class="op">/</button><button>7</button><button>8</button><button>9</button><button class="op">*</button><button>4</button><button>5</button><button>6</button><button class="op">-</button><button>1</button><button>2</button><button>3</button><button class="op">+</button><button class="zero">0</button><button>.</button><button class="eq">=</button></div></div>' },
        { id: 'file-manager', name: 'Gerenciador de Arquivos', icon: '📁', defaultColor: 'planet-green', content: '<div class="file-manager"><h3>Meus Arquivos</h3><ul class="file-list"></ul><div class="add-file-input"><input type="text" id="new-file-name" placeholder="Nome do arquivo/link"><button id="add-file-btn">Add</button></div></div>' },
        { id: 'progress-charts', name: 'Gráficos de Progresso', icon: '📊', defaultColor: 'planet-purple', content: '<div class="progress-charts"><h3>Meu Progresso</h3><div class="chart-placeholder"><span>Gráfico de progresso (placeholder)</span></div><p style="margin-top:15px; color:var(--text-medium);">Dados de tarefas e pomodoro seriam exibidos aqui.</p></div>' },
        { id: 'converters', name: 'Conversores', icon: '🔄', defaultColor: 'planet-blue', content: '<div class="converters"><h3>Conversores</h3><select id="converter-type" style="width:100%; padding:8px; margin-bottom:10px; background:rgba(255,255,255,0.1); border:1px solid var(--neon-blue); color:var(--text-light); border-radius:4px;"><option value="temp">Temperatura</option><option value="weight">Peso</option><option value="currency">Moeda (placeholder)</option></select><input type="number" id="converter-input" placeholder="Valor" style="width:100%; padding:8px; margin-bottom:10px; background:rgba(255,255,255,0.1); border:1px solid var(--neon-blue); color:var(--text-light); border-radius:4px;"><p>Resultado: <span id="converter-result" style="color:var(--neon-green);"></span></p></div>' },
        { id: 'mind-map', name: 'Mapa Mental', icon: '🧠', defaultColor: 'planet-green', content: '<div class="mind-map"><h3>Mapa Mental Visual</h3><p style="color:var(--text-medium);">Crie conexões visuais para suas ideias.</p><div style="background:rgba(255,255,255,0.1); height:150px; border-radius:4px; display:flex; justify-content:center; align-items:center;"><span>Área de desenho (placeholder)</span></div></div>' },
        { id: 'flashcards', name: 'Flashcards', icon: '🎴', defaultColor: 'planet-purple', content: '<div class="flashcards"><h3>Flashcards Inteligentes</h3><p style="color:var(--text-medium);">Revisão espaçada para memorização.</p><div style="background:rgba(255,255,255,0.1); height:100px; border-radius:4px; display:flex; justify-content:center; align-items:center;"><span>Card (placeholder)</span></div><div style="display:flex; justify-content:space-around; margin-top:10px;"><button class="pomodoro-btn">Próximo</button><button class="pomodoro-btn">Revisar</button></div></div>' },
        { id: 'daily-journal', name: 'Diário', icon: '✍️', defaultColor: 'planet-blue', content: '<div class="daily-journal"><h3>Diário Pessoal</h3><textarea id="journal-entry" placeholder="Escreva sobre seu dia..." style="width:100%; height:150px; background:rgba(255,255,255,0.1); border:1px solid var(--neon-blue); color:var(--text-light); padding:10px; border-radius:4px;"></textarea><button id="save-journal-btn" style="margin-top:10px; background-color:var(--neon-green); color:var(--bg-dark); border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">Salvar Entrada</button></div>' },
        { id: 'moodboard', name: 'Moodboard', icon: '🖼️', defaultColor: 'planet-green', content: '<div class="moodboard"><h3>Moodboard de Inspirações</h3><p style="color:var(--text-medium);">Colecione imagens e ideias.</p><div style="background:rgba(255,255,255,0.1); height:150px; border-radius:4px; display:flex; justify-content:center; align-items:center;"><span>Área de imagens (placeholder)</span></div></div>' },
    ];

    // Cores neon disponíveis para os planetas
    const neonColors = ['planet-blue', 'planet-green', 'planet-purple'];

    // Temas disponíveis
    const themes = [
        { id: 'dark-neon', name: 'Dark Neon', previewClass: 'dark-neon-preview' },
        { id: 'blue-galaxy', name: 'Blue Galaxy', previewClass: 'blue-galaxy-preview' },
        { id: 'green-orbit', name: 'Green Orbit', previewClass: 'green-orbit-preview' },
    ];

    // --- Persistência (Variáveis em memória) ---
    let savedPlanets = [];
    let currentTheme = 'dark-neon';
    let savedGalaxies = {};

    function savePlanets() {
        savedPlanets = JSON.parse(JSON.stringify(currentPlanets));
    }

    function loadPlanets() {
        if (savedPlanets.length > 0) {
            currentPlanets = JSON.parse(JSON.stringify(savedPlanets));
            const maxId = currentPlanets.reduce((max, p) => {
                const num = parseInt(p.id.split('-')[1]);
                return num > max ? num : max;
            }, 0);
            planetCounter = maxId;
        } else {
            currentPlanets = [
                { id: 'planet-1', toolId: 'todo-list', x: 200, y: 150, color: 'planet-blue' },
                { id: 'planet-2', toolId: 'pomodoro', x: 500, y: 100, color: 'planet-green' },
                { id: 'planet-3', toolId: 'notes', x: 350, y: 400, color: 'planet-purple' },
                { id: 'planet-4', toolId: 'file-manager', x: 100, y: 300, color: 'planet-green' },
                { id: 'planet-5', toolId: 'calculator', x: 600, y: 250, color: 'planet-blue' },
            ];
            planetCounter = 5;
        }
    }

    function saveTheme(themeId) {
        currentTheme = themeId;
    }

    function loadTheme() {
        applyTheme(currentTheme);
    }

    function applyTheme(themeId) {
        document.body.classList.remove(...themes.map(t => `theme-${t.id}`));
        document.body.classList.add(`theme-${themeId}`);
        saveTheme(themeId);
    }

    function saveGalaxy(name) {
        savedGalaxies[name] = JSON.parse(JSON.stringify(currentPlanets));
        alert(`Galáxia "${name}" salva com sucesso!`);
        renderSavedGalaxiesList();
    }

    function loadGalaxy(name) {
        if (savedGalaxies[name]) {
            currentPlanets = JSON.parse(JSON.stringify(savedGalaxies[name]));
            closeAllToolWindows();
            renderPlanets();
            alert(`Galáxia "${name}" carregada!`);
            manageGalaxiesModal.classList.remove('active');
        } else {
            alert('Galáxia não encontrada.');
        }
    }

    function deleteGalaxy(name) {
        if (confirm(`Tem certeza que deseja deletar a galáxia "${name}"?`)) {
            delete savedGalaxies[name];
            renderSavedGalaxiesList();
            alert(`Galáxia "${name}" deletada.`);
        }
    }

    function renderSavedGalaxiesList() {
        savedGalaxiesList.innerHTML = '';
        const galaxyNames = Object.keys(savedGalaxies);

        if (galaxyNames.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Nenhuma galáxia salva ainda.';
            li.style.color = 'var(--text-medium)';
            li.style.textAlign = 'center';
            savedGalaxiesList.appendChild(li);
            return;
        }

        galaxyNames.forEach(name => {
            const li = document.createElement('li');
            li.className = 'saved-list-item';
            li.innerHTML = `
                <span>${name}</span>
                <div class="actions">
                    <button class="load-btn" data-galaxy-name="${name}">Carregar</button>
                    <button class="delete-btn" data-galaxy-name="${name}">&times;</button>
                </div>
            `;
            savedGalaxiesList.appendChild(li);

            li.querySelector('.load-btn').addEventListener('click', (e) => {
                loadGalaxy(e.target.dataset.galaxyName);
            });
            li.querySelector('.delete-btn').addEventListener('click', (e) => {
                deleteGalaxy(e.target.dataset.galaxyName);
            });
        });
    }

    // --- Funções de Renderização ---

    function renderPlanets() {
        galaxyContainer.innerHTML = '';
        currentPlanets.forEach(planetData => {
            const tool = allTools.find(t => t.id === planetData.toolId);
            if (tool) {
                const planetDiv = document.createElement('div');
                planetDiv.className = `planet ${planetData.color}`;
                planetDiv.id = planetData.id;
                planetDiv.style.left = `${planetData.x}px`;
                planetDiv.style.top = `${planetData.y}px`;
                planetDiv.innerHTML = `<span class="icon">${tool.icon}</span><br>${tool.name}`;
                planetDiv.dataset.toolId = tool.id;
                galaxyContainer.appendChild(planetDiv);
            }
        });
        savePlanets();
    }

    function openToolWindow(toolId, planetId) {
        const tool = allTools.find(t => t.id === toolId);
        if (!tool) return;

        const existingWindow = document.querySelector(`.tool-window[data-tool-id="${toolId}"]`);
        if (existingWindow) {
            existingWindow.style.zIndex = getNextZIndex();
            existingWindow.classList.add('active');
            return;
        }

        const toolWindow = document.createElement('div');
        toolWindow.className = 'tool-window';
        toolWindow.dataset.toolId = toolId;
        toolWindow.dataset.planetId = planetId;

        const planetElement = document.getElementById(planetId);
        if (planetElement) {
            const rect = planetElement.getBoundingClientRect();
            let initialLeft = rect.left + rect.width / 2 - 150;
            let initialTop = rect.top + rect.height / 2 - 100;

            initialLeft = Math.max(20, Math.min(initialLeft, window.innerWidth - 320));
            initialTop = Math.max(20, Math.min(initialTop, window.innerHeight - 220));

            toolWindow.style.left = `${initialLeft}px`;
            toolWindow.style.top = `${initialTop}px`;
        } else {
            toolWindow.style.left = 'calc(50% - 150px)';
            toolWindow.style.top = 'calc(50% - 100px)';
        }
        toolWindow.style.zIndex = getNextZIndex();

        toolWindow.innerHTML = `
            <div class="tool-window-header">
                <span>${tool.name}</span>
                <button class="close-btn">&times;</button>
            </div>
            <div class="tool-window-content ${toolId}">
                ${tool.content}
            </div>
        `;
        universePage.appendChild(toolWindow);

        setTimeout(() => toolWindow.classList.add('active'), 10);

        toolWindow.querySelector('.close-btn').addEventListener('click', () => {
            toolWindow.classList.remove('active');
            setTimeout(() => toolWindow.remove(), 300);
            if (activeToolWindow === toolWindow) activeToolWindow = null;
        });

        toolWindow.querySelector('.tool-window-header').addEventListener('mousedown', (e) => {
            isDraggingWindow = true;
            currentDraggedWindow = toolWindow;
            initialWindowMouseX = e.clientX;
            initialWindowMouseY = e.clientY;
            initialWindowX = toolWindow.offsetLeft;
            initialWindowY = toolWindow.offsetTop;
            currentDraggedWindow.style.zIndex = getNextZIndex();
            currentDraggedWindow.style.cursor = 'grabbing';
        });

        toolWindow.addEventListener('mousedown', () => {
            toolWindow.style.zIndex = getNextZIndex();
        });

        initializeToolFunctionality(toolId, toolWindow);
    }

    function getNextZIndex() {
        let maxZ = 0;
        document.querySelectorAll('.tool-window').forEach(win => {
            const z = parseInt(win.style.zIndex) || 0;
            if (z > maxZ) maxZ = z;
        });
        return maxZ + 1;
    }

    function initializeToolFunctionality(toolId, toolWindow) {
        switch (toolId) {
            case 'todo-list':
                initializeTodoList(toolWindow);
                break;
            case 'pomodoro':
                initializePomodoro(toolWindow);
                break;
            case 'calculator':
                initializeCalculator(toolWindow);
                break;
            case 'file-manager':
                initializeFileManager(toolWindow);
                break;
            case 'converters':
                initializeConverters(toolWindow);
                break;
            case 'daily-journal':
                initializeDailyJournal(toolWindow);
                break;
        }
    }

    function initializeTodoList(toolWindow) {
        const input = toolWindow.querySelector('#new-todo-input');
        const addBtn = toolWindow.querySelector('.add-task-btn');
        const todoList = toolWindow.querySelector('#todo-items');

        function addTodo() {
            const text = input.value.trim();
            if (text) {
                const li = document.createElement('li');
                li.className = 'todo-item';
                li.innerHTML = `
                    <input type="checkbox">
                    <span>${text}</span>
                    <button class="delete-todo">&times;</button>
                `;
                todoList.appendChild(li);
                input.value = '';

                li.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                    li.classList.toggle('completed', e.target.checked);
                });

                li.querySelector('.delete-todo').addEventListener('click', () => {
                    li.remove();
                });
            }
        }

        addBtn.addEventListener('click', addTodo);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });
    }

    function initializePomodoro(toolWindow) {
        const timerDisplay = toolWindow.querySelector('#pomodoro-timer');
        const buttons = toolWindow.querySelectorAll('.pomodoro-btn');
        let minutes = 25;
        let seconds = 0;
        let isRunning = false;
        let intervalId = null;

        function updateDisplay() {
            const min = minutes.toString().padStart(2, '0');
            const sec = seconds.toString().padStart(2, '0');
            timerDisplay.textContent = `${min}:${sec}`;
        }

        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                intervalId = setInterval(() => {
                    if (seconds === 0) {
                        if (minutes === 0) {
                            // Timer finished
                            isRunning = false;
                            clearInterval(intervalId);
                            alert('Pomodoro finalizado!');
                            minutes = 25;
                            seconds = 0;
                        } else {
                            minutes--;
                            seconds = 59;
                        }
                    } else {
                        seconds--;
                    }
                    updateDisplay();
                }, 1000);
            }
        }

        function pauseTimer() {
            isRunning = false;
            clearInterval(intervalId);
        }

        function resetTimer() {
            isRunning = false;
            clearInterval(intervalId);
            minutes = 25;
            seconds = 0;
            updateDisplay();
        }

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                switch (action) {
                    case 'start':
                        startTimer();
                        break;
                    case 'pause':
                        pauseTimer();
                        break;
                    case 'reset':
                        resetTimer();
                        break;
                }
            });
        });
    }

    function initializeCalculator(toolWindow) {
        const display = toolWindow.querySelector('.calc-display');
        const buttons = toolWindow.querySelectorAll('.calc-buttons button');
        let currentInput = '0';
        let previousInput = '';
        let operation = '';
        let shouldResetDisplay = false;

        function updateDisplay() {
            display.value = currentInput;
        }

        function handleNumber(number) {
            if (shouldResetDisplay) {
                currentInput = '';
                shouldResetDisplay = false;
            }
            currentInput = currentInput === '0' ? number : currentInput + number;
            updateDisplay();
        }

        function handleOperation(op) {
            if (previousInput !== '' && operation !== '' && !shouldResetDisplay) {
                calculate();
            }
            previousInput = currentInput;
            operation = op;
            shouldResetDisplay = true;
        }

        function calculate() {
            let result;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);

            if (isNaN(prev) || isNaN(current)) return;

            switch (operation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    result = prev / current;
                    break;
                default:
                    return;
            }

            currentInput = result.toString();
            operation = '';
            previousInput = '';
            shouldResetDisplay = true;
            updateDisplay();
        }

        function clear() {
            currentInput = '0';
            previousInput = '';
            operation = '';
            shouldResetDisplay = false;
            updateDisplay();
        }

        function backspace() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.textContent;

                if (text >= '0' && text <= '9') {
                    handleNumber(text);
                } else if (text === '.') {
                    if (currentInput.indexOf('.') === -1) {
                        currentInput += '.';
                        updateDisplay();
                    }
                } else if (text === 'C') {
                    clear();
                } else if (text === '←') {
                    backspace();
                } else if (text === '=') {
                    calculate();
                } else if (['+', '-', '*', '/', '%'].includes(text)) {
                    handleOperation(text);
                }
            });
        });
    }

    function initializeFileManager(toolWindow) {
        const fileList = toolWindow.querySelector('.file-list');
        const input = toolWindow.querySelector('#new-file-name');
        const addBtn = toolWindow.querySelector('#add-file-btn');
        let files = [];

        function addFile() {
            const fileName = input.value.trim();
            if (fileName) {
                files.push(fileName);
                renderFileList();
                input.value = '';
            }
        }

        function renderFileList() {
            fileList.innerHTML = '';
            files.forEach((fileName, index) => {
                const li = document.createElement('li');
                li.className = 'file-item';
                li.innerHTML = `
                    <span>${fileName}</span>
                    <button class="delete-file">&times;</button>
                `;
                fileList.appendChild(li);

                li.querySelector('.delete-file').addEventListener('click', () => {
                    files.splice(index, 1);
                    renderFileList();
                });
            });
        }

        addBtn.addEventListener('click', addFile);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addFile();
        });
    }

    function initializeConverters(toolWindow) {
        const typeSelect = toolWindow.querySelector('#converter-type');
        const input = toolWindow.querySelector('#converter-input');
        const result = toolWindow.querySelector('#converter-result');

        function convert() {
            const type = typeSelect.value;
            const value = parseFloat(input.value);

            if (isNaN(value)) {
                result.textContent = 'Valor inválido';
                return;
            }

            switch (type) {
                case 'temp':
                    result.textContent = `${((value * 9/5) + 32).toFixed(2)}°F`;
                    break;
                case 'weight':
                    result.textContent = `${(value * 2.205).toFixed(2)} lbs`;
                    break;
                case 'currency':
                    result.textContent = 'Funcionalidade em desenvolvimento';
                    break;
            }
        }

        input.addEventListener('input', convert);
        typeSelect.addEventListener('change', convert);
    }

    function initializeDailyJournal(toolWindow) {
        const textarea = toolWindow.querySelector('#journal-entry');
        const saveBtn = toolWindow.querySelector('#save-journal-btn');

        saveBtn.addEventListener('click', () => {
            const content = textarea.value.trim();
            if (content) {
                alert('Entrada do diário salva!');
                // Aqui você poderia implementar lógica para salvar no armazenamento
            }
        });
    }

    function closeAllToolWindows() {
        document.querySelectorAll('.tool-window').forEach(window => {
            window.classList.remove('active');
            setTimeout(() => window.remove(), 300);
        });
    }

    // --- Event Listeners ---

    // Navegação entre páginas
    enterUniverseBtn.addEventListener('click', () => {
        landingPage.classList.remove('active');
        universePage.classList.add('active');
    });

    backToLandingBtn.addEventListener('click', () => {
        universePage.classList.remove('active');
        landingPage.classList.add('active');
        closeAllToolWindows();
    });

    // Botões da barra superior
    addPlanetBtn.addEventListener('click', () => {
        renderAvailableTools();
        addPlanetModal.classList.add('active');
    });

    resetGalaxyBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja resetar a galáxia?')) {
            currentPlanets = [];
            closeAllToolWindows();
            renderPlanets();
        }
    });

    toggleAnimationsBtn.addEventListener('click', () => {
        animationsEnabled = !animationsEnabled;
        if (animationsEnabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    });

    changeThemeBtn.addEventListener('click', () => {
        renderThemeOptions();
        changeThemeModal.classList.add('active');
    });

    saveGalaxyBtn.addEventListener('click', () => {
        renderSavedGalaxiesList();
        manageGalaxiesModal.classList.add('active');
    });

    loadGalaxyBtn.addEventListener('click', () => {
        renderSavedGalaxiesList();
        manageGalaxiesModal.classList.add('active');
    });

    // Salvar nova galáxia
    confirmSaveGalaxyBtn.addEventListener('click', () => {
        const name = saveGalaxyNameInput.value.trim();
        if (name) {
            saveGalaxy(name);
            saveGalaxyNameInput.value = '';
        }
    });

    // Fechar modais
    [closeModalBtnAddPlanet, closeModalBtnChangeColor, closeModalBtnChangeTheme, closeModalBtnManageGalaxies].forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });

    // Fechar modais clicando fora
    [addPlanetModal, changeColorModal, changeThemeModal, manageGalaxiesModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Arrastar planetas
    galaxyContainer.addEventListener('mousedown', (e) => {
        if (e
