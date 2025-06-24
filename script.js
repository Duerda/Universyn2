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

    const changeThemeBtn = document.getElementById('change-theme-btn'); // Novo
    const changeThemeModal = document.getElementById('change-theme-modal'); // Novo
    const closeModalBtnChangeTheme = changeThemeModal.querySelector('.close-button'); // Novo
    const themeOptionsContainer = document.querySelector('.theme-options'); // Novo

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
        // Adicione mais ferramentas aqui com defaultColor
    ];

    // Cores neon disponíveis para os planetas
    const neonColors = ['planet-blue', 'planet-green', 'planet-purple'];

    // Temas disponíveis
    const themes = [
        { id: 'dark-neon', name: 'Dark Neon', previewClass: 'dark-neon-preview' },
        { id: 'blue-galaxy', name: 'Blue Galaxy', previewClass: 'blue-galaxy-preview' },
        { id: 'green-orbit', name: 'Green Orbit', previewClass: 'green-orbit-preview' },
    ];

    // --- Persistência (Local Storage) ---
    const LOCAL_STORAGE_KEY_PLANETS = 'universyn_planets';
    const LOCAL_STORAGE_KEY_THEME = 'universyn_theme';

    function savePlanets() {
        localStorage.setItem(LOCAL_STORAGE_KEY_PLANETS, JSON.stringify(currentPlanets));
    }

    function loadPlanets() {
        const savedPlanets = localStorage.getItem(LOCAL_STORAGE_KEY_PLANETS);
        if (savedPlanets) {
            currentPlanets = JSON.parse(savedPlanets);
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
        localStorage.setItem(LOCAL_STORAGE_KEY_THEME, themeId);
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEY_THEME) || 'dark-neon'; // Default theme
        applyTheme(savedTheme);
    }

    function applyTheme(themeId) {
        document.body.classList.remove(...themes.map(t => `theme-${t.id}`));
        document.body.classList.add(`theme-${themeId}`);
        saveTheme(themeId);
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
            const z = parseInt(win.style.zIndex || 0);
            if (z > maxZ) maxZ = z;
        });
        return maxZ + 1;
    }

    function closeAllToolWindows() {
        document.querySelectorAll('.tool-window').forEach(win => {
            win.classList.remove('active');
            setTimeout(() => win.remove(), 300);
        });
        activeToolWindow = null;
    }

    // --- Funções de Ferramentas Específicas ---
    // Refatorado para um objeto para melhor organização
    const toolFunctions = {
        'todo-list': (toolWindow) => {
            const newTodoInput = toolWindow.querySelector('#new-todo-input');
            const addTodoBtn = toolWindow.querySelector('.add-task-btn');
            const todoItemsList = toolWindow.querySelector('#todo-items');

            const loadTodos = () => {
                const todos = JSON.parse(localStorage.getItem(`todos-${toolWindow.dataset.planetId}`)) || [];
                todoItemsList.innerHTML = '';
                todos.forEach(todo => renderTodoItem(todo.text, todo.completed));
            };

            const saveTodos = () => {
                const todos = [];
                todoItemsList.querySelectorAll('li').forEach(li => {
                    todos.push({
                        text: li.querySelector('span').textContent,
                        completed: li.querySelector('input[type="checkbox"]').checked
                    });
                });
                localStorage.setItem(`todos-${toolWindow.dataset.planetId}`, JSON.stringify(todos));
            };

            const renderTodoItem = (text, completed = false) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" ${completed ? 'checked' : ''}>
                    <span>${text}</span>
                    <button class="delete-task-btn">&times;</button>
                `;
                todoItemsList.appendChild(li);

                li.querySelector('input[type="checkbox"]').addEventListener('change', saveTodos);
                li.querySelector('.delete-task-btn').addEventListener('click', () => {
                    li.remove();
                    saveTodos();
                });
            };

            addTodoBtn.addEventListener('click', () => {
                const text = newTodoInput.value.trim();
                if (text) {
                    renderTodoItem(text);
                    newTodoInput.value = '';
                    saveTodos();
                }
            });
            newTodoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addTodoBtn.click();
                }
            });
            loadTodos();
        },

        'pomodoro': (toolWindow) => {
            const pomodoroTimerDisplay = toolWindow.querySelector('#pomodoro-timer');
            const startBtn = toolWindow.querySelector('[data-action="start"]');
            const pauseBtn = toolWindow.querySelector('[data-action="pause"]');
            const resetBtn = toolWindow.querySelector('[data-action="reset"]');

            let pomodoroInterval;
            let timeLeft = parseInt(localStorage.getItem(`pomodoro-time-${toolWindow.dataset.planetId}`)) || (25 * 60);
            let isRunning = false;

            const updateTimerDisplay = () => {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                pomodoroTimerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                localStorage.setItem(`pomodoro-time-${toolWindow.dataset.planetId}`, timeLeft);
            };

            const startTimer = () => {
                if (isRunning) return;
                isRunning = true;
                pomodoroInterval = setInterval(() => {
                    timeLeft--;
                    updateTimerDisplay();
                    if (timeLeft <= 0) {
                        clearInterval(pomodoroInterval);
                        isRunning = false;
                        alert('Tempo Pomodoro Esgotado!');
                        timeLeft = 25 * 60;
                        updateTimerDisplay();
                    }
                }, 1000);
            };

            const pauseTimer = () => {
                clearInterval(pomodoroInterval);
                isRunning = false;
            };

            const resetTimer = () => {
                clearInterval(pomodoroInterval);
                isRunning = false;
                timeLeft = 25 * 60;
                updateTimerDisplay();
            };

            startBtn.addEventListener('click', startTimer);
            pauseBtn.addEventListener('click', pauseTimer);
            resetBtn.addEventListener('click', resetTimer);
            updateTimerDisplay();
        },

        'notes': (toolWindow) => {
            const notesTextarea = toolWindow.querySelector('#notes-textarea');
            const savedNotes = localStorage.getItem(`notes-${toolWindow.dataset.planetId}`);
            if (savedNotes) {
                notesTextarea.value = savedNotes;
            }
            notesTextarea.addEventListener('input', () => {
                localStorage.setItem(`notes-${toolWindow.dataset.planetId}`, notesTextarea.value);
            });
        },

        'calculator': (toolWindow) => {
            const display = toolWindow.querySelector('.calc-display');
            const buttons = toolWindow.querySelectorAll('.calc-buttons button');
            let currentInput = '0';
            let operator = null;
            let firstOperand = null;
            let waitingForSecondOperand = false;

            const updateDisplay = () => {
                display.value = currentInput;
            };

            const performCalculation = {
                '/': (first, second) => first / second,
                '*': (first, second) => first * second,
                '+': (first, second) => first + second,
                '-': (first, second) => first - second,
                '%': (first, second) => first % second,
            };

            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const value = e.target.textContent;

                    if (value === 'C') {
                        currentInput = '0';
                        operator = null;
                        firstOperand = null;
                        waitingForSecondOperand = false;
                    } else if (value === '←') { // Backspace
                        currentInput = currentInput.slice(0, -1) || '0';
                    } else if (e.target.classList.contains('op')) {
                        if (operator && waitingForSecondOperand) {
                            operator = value;
                            return;
                        }
                        if (firstOperand === null) {
                            firstOperand = parseFloat(currentInput);
                        } else if (operator) {
                            const result = performCalculation[operator](firstOperand, parseFloat(currentInput));
                            currentInput = String(result);
                            firstOperand = result;
                        }
                        operator = value;
                        waitingForSecondOperand = true;
                    } else if (value === '=') {
                        if (operator && firstOperand !== null) {
                            const result = performCalculation[operator](firstOperand, parseFloat(currentInput));
                            currentInput = String(result);
                            firstOperand = null;
                            operator = null;
                            waitingForSecondOperand = false;
                        }
                    } else if (value === '.') {
                        if (!currentInput.includes('.')) {
                            currentInput += '.';
                        }
                    } else {
                        if (waitingForSecondOperand) {
                            currentInput = value;
                            waitingForSecondOperand = false;
                        } else {
                            currentInput = currentInput === '0' ? value : currentInput + value;
                        }
                    }
                    updateDisplay();
                });
            });
            updateDisplay();
        },

        'file-manager': (toolWindow) => {
            const fileList = toolWindow.querySelector('.file-list');
            const newFileNameInput = toolWindow.querySelector('#new-file-name');
            const addFileBtn = toolWindow.querySelector('#add-file-btn');

            const loadFiles = () => {
                const files = JSON.parse(localStorage.getItem(`files-${toolWindow.dataset.planetId}`)) || [];
                fileList.innerHTML = '';
                files.forEach(file => renderFileItem(file.name, file.url));
            };

            const saveFiles = () => {
                const files = [];
                fileList.querySelectorAll('li').forEach(li => {
                    files.push({
                        name: li.querySelector('span').textContent,
                        url: li.querySelector('a') ? li.querySelector('a').href : ''
                    });
                });
                localStorage.setItem(`files-${toolWindow.dataset.planetId}`, JSON.stringify(files));
            };

            const renderFileItem = (name, url = '') => {
                const li = document.createElement('li');
                li.className = 'file-item';
                li.innerHTML = `
                    <span>${name}</span>
                    ${url ? `<a href="${url}" target="_blank">🔗</a>` : ''}
                    <button class="delete-btn">&times;</button>
                `;
                fileList.appendChild(li);

                li.querySelector('.delete-btn').addEventListener('click', () => {
                    li.remove();
                    saveFiles();
                });
            };

            addFileBtn.addEventListener('click', () => {
                const name = newFileNameInput.value.trim();
                if (name) {
                    renderFileItem(name);
                    newFileNameInput.value = '';
                    saveFiles();
                }
            });
            newFileNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addFileBtn.click();
                }
            });
            loadFiles();
        },

        'progress-charts': (toolWindow) => {
            // Placeholder, sem funcionalidade real de gráfico por enquanto
            console.log('Gráficos de Progresso inicializados para', toolWindow.dataset.planetId);
        },

        'converters': (toolWindow) => {
            const converterTypeSelect = toolWindow.querySelector('#converter-type');
            const converterInput = toolWindow.querySelector('#converter-input');
            const converterResult = toolWindow.querySelector('#converter-result');

            const convertValue = () => {
                const type = converterTypeSelect.value;
                const value = parseFloat(converterInput.value);
                if (isNaN(value)) {
                    converterResult.textContent = 'Inválido';
                    return;
                }

                let result = '';
                switch (type) {
                    case 'temp': // Celsius para Fahrenheit
                        result = `${(value * 9/5 + 32).toFixed(2)} °F`;
                        break;
                    case 'weight': // Kg para Libras
                        result = `${(value * 2.20462).toFixed(2)} lbs`;
                        break;
                    case 'currency':
                        result = 'Funcionalidade de moeda em desenvolvimento.';
                        break;
                    default:
                        result = '';
                }
                converterResult.textContent = result;
            };

            converterTypeSelect.addEventListener('change', convertValue);
            converterInput.addEventListener('input', convertValue);
            convertValue();
        },

        'mind-map': (toolWindow) => {
            console.log('Mapa Mental inicializado para', toolWindow.dataset.planetId);
            // Implementação de um mapa mental seria complexa (Canvas, SVG, etc.)
        },

        'flashcards': (toolWindow) => {
            console.log('Flashcards inicializados para', toolWindow.dataset.planetId);
            // Implementação de flashcards com revisão espaçada
        }
    };

    function initializeToolFunctionality(toolId, toolWindow) {
        if (toolFunctions[toolId]) {
            toolFunctions[toolId](toolWindow);
        } else {
            console.warn(`Função de inicialização para a ferramenta ${toolId} não encontrada.`);
        }
    }

    // --- Event Listeners Globais ---

    enterUniverseBtn.addEventListener('click', () => {
        landingPage.classList.remove('active');
        universePage.classList.add('active');
        loadPlanets();
        renderPlanets();
        loadTheme(); // Carrega o tema salvo ao entrar no universo
    });

    backToLandingBtn.addEventListener('click', () => {
        universePage.classList.remove('active');
        landingPage.classList.add('active');
        closeAllToolWindows();
        savePlanets();
    });

    addPlanetBtn.addEventListener('click', () => {
        availableToolsList.innerHTML = '';
        allTools.forEach(tool => {
            const isToolAdded = currentPlanets.some(p => p.toolId === tool.id);
            if (!isToolAdded) {
                const toolOption = document.createElement('div');
                toolOption.className = 'tool-option';
                toolOption.dataset.toolId = tool.id;
                toolOption.innerHTML = `<span class="icon">${tool.icon}</span><h4>${tool.name}</h4>`;
                toolOption.addEventListener('click', () => {
                    const newPlanetId = `planet-${++planetCounter}`;
                    currentPlanets.push({
                        id: newPlanetId,
                        toolId: tool.id,
                        x: Math.random() * (galaxyContainer.offsetWidth - 100),
                        y: Math.random() * (galaxyContainer.offsetHeight - 100),
                        color: tool.defaultColor
                    });
                    renderPlanets();
                    addPlanetModal.classList.remove('active');
                });
                availableToolsList.appendChild(toolOption);
            }
        });
        addPlanetModal.classList.add('active');
    });

    closeModalBtnAddPlanet.addEventListener('click', () => {
        addPlanetModal.classList.remove('active');
    });

    // --- Interações com Planetas (Clique, Drag, Contexto) ---

    galaxyContainer.addEventListener('mousedown', (e) => {
        if (e.target.closest('.planet')) {
            e.preventDefault();
            isDraggingPlanet = true;
            currentDraggedPlanet = e.target.closest('.planet');
            initialPlanetX = currentDraggedPlanet.offsetLeft;
            initialPlanetY = currentDraggedPlanet.offsetTop;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            currentDraggedPlanet.style.zIndex = '100';
            currentDraggedPlanet.style.cursor = 'grabbing';

            contextMenu.style.display = 'none';
        }
    });

    galaxyContainer.addEventListener('click', (e) => {
        const planet = e.target.closest('.planet');
        if (planet && !isDraggingPlanet) {
            openToolWindow(planet.dataset.toolId, planet.id);
        }
        contextMenu.style.display = 'none';
    });

    galaxyContainer.addEventListener('contextmenu', (e) => {
        const planet = e.target.closest('.planet');
        if (planet) {
            e.preventDefault();
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.dataset.targetPlanetId = planet.id;
        } else {
            contextMenu.style.display = 'none';
        }
    });

    contextMenu.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const planetId = contextMenu.dataset.targetPlanetId;
        const planetElement = document.getElementById(planetId);

        if (!planetElement) return;

        switch (action) {
            case 'open':
                openToolWindow(planetElement.dataset.toolId, planetId);
                break;
            case 'change-color':
                targetPlanetForColorChange = planetElement;
                changeColorModal.classList.add('active');
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
                const currentPlanetColorClass = neonColors.find(c => planetElement.classList.contains(c));
                if (currentPlanetColorClass) {
                    const selectedColorOption = document.querySelector(`.color-option[data-color="${currentPlanetColorClass}"]`);
                    if (selectedColorOption) selectedColorOption.classList.add('selected');
                }
                break;
            case 'remove':
                planetElement.remove();
                currentPlanets = currentPlanets.filter(p => p.id !== planetId);
                const toolWindowToRemove = document.querySelector(`.tool-window[data-planet-id="${planetId}"]`);
                if (toolWindowToRemove) {
                    toolWindowToRemove.classList.remove('active');
                    setTimeout(() => toolWindowToRemove.remove(), 300);
                }
                savePlanets();
                break;
        }
        contextMenu.style.display = 'none';
    });

    // --- Modal de Mudar Cor ---
    closeModalBtnChangeColor.addEventListener('click', () => {
        changeColorModal.classList.remove('active');
        targetPlanetForColorChange = null;
    });

    colorPalette.addEventListener('click', (e) => {
        const colorOption = e.target.closest('.color-option');
        if (colorOption && targetPlanetForColorChange) {
            const newColorClass = colorOption.dataset.color;

            neonColors.forEach(c => targetPlanetForColorChange.classList.remove(c));
            targetPlanetForColorChange.classList.add(newColorClass);

            const planetData = currentPlanets.find(p => p.id === targetPlanetForColorChange.id);
            if (planetData) {
                planetData.color = newColorClass;
                savePlanets();
            }

            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            colorOption.classList.add('selected');

            changeColorModal.classList.remove('active');
            targetPlanetForColorChange = null;
        }
    });

    // --- Modal de Mudar Tema ---
    changeThemeBtn.addEventListener('click', () => {
        themeOptionsContainer.innerHTML = '';
        themes.forEach(theme => {
            const themeOptionDiv = document.createElement('div');
            themeOptionDiv.className = 'theme-option';
            themeOptionDiv.dataset.theme = theme.id;
            themeOptionDiv.innerHTML = `
                <div class="theme-preview ${theme.previewClass}"></div>
                <h4>${theme.name}</h4>
            `;
            if (document.body.classList.contains(`theme-${theme.id}`)) {
                themeOptionDiv.classList.add('selected');
            }
            themeOptionDiv.addEventListener('click', () => {
                applyTheme(theme.id);
                // Atualiza a seleção visual no modal
                document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
                themeOptionDiv.classList.add('selected');
                changeThemeModal.classList.remove('active');
            });
            themeOptionsContainer.appendChild(themeOptionDiv);
        });
        changeThemeModal.classList.add('active');
    });

    closeModalBtnChangeTheme.addEventListener('click', () => {
        changeThemeModal.classList.remove('active');
    });

    // Fechar modais clicando fora
    window.addEventListener('click', (event) => {
        if (event.target === addPlanetModal) {
            addPlanetModal.classList.remove('active');
        }
        if (event.target === changeColorModal) {
            changeColorModal.classList.remove('active');
        }
        if (event.target === changeThemeModal) { // Novo
            changeThemeModal.classList.remove('active');
        }
    });

    // --- Drag de Planetas e Janelas ---

    document.addEventListener('mousemove', (e) => {
        if (isDraggingPlanet && currentDraggedPlanet) {
            const dx = e.clientX - initialMouseX;
            const dy = e.clientY - initialMouseY;

            let newX = initialPlanetX + dx;
            let newY = initialPlanetY + dy;

            const containerRect = galaxyContainer.getBoundingClientRect();
            const planetRect = currentDraggedPlanet.getBoundingClientRect();

            newX = Math.max(0, Math.min(newX, containerRect.width - planetRect.width));
            newY = Math.max(0, Math.min(newY, containerRect.height - planetRect.height));

            currentDraggedPlanet.style.left = `${newX}px`;
            currentDraggedPlanet.style.top = `${newY}px`;

            const planetData = currentPlanets.find(p => p.id === currentDraggedPlanet.id);
            if (planetData) {
                planetData.x = newX;
                planetData.y = newY;
            }
        }

        if (isDraggingWindow && currentDraggedWindow) {
            const dx = e.clientX - initialWindowMouseX;
            const dy = e.clientY - initialWindowMouseY;

            let newX = initialWindowX + dx;
            let newY = initialWindowY + dy;

            newX = Math.max(0, Math.min(newX, window.innerWidth - currentDraggedWindow.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - currentDraggedWindow.offsetHeight));

            currentDraggedWindow.style.left = `${newX}px`;
            currentDraggedWindow.style.top = `${newY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDraggingPlanet) {
            isDraggingPlanet = false;
            if (currentDraggedPlanet) {
                currentDraggedPlanet.style.zIndex = '10';
                currentDraggedPlanet.style.cursor = 'grab';
                savePlanets();
                currentDraggedPlanet = null;
            }
        }
        if (isDraggingWindow) {
            isDraggingWindow = false;
            if (currentDraggedWindow) {
                currentDraggedWindow.style.cursor = 'grab';
                currentDraggedWindow = null;
            }
        }
    });

    // --- Outros Controles da Barra Superior ---

    resetGalaxyBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja resetar a galáxia para o layout padrão? Todas as suas personalizações serão perdidas.')) {
            localStorage.removeItem(LOCAL_STORAGE_KEY_PLANETS);
            loadPlanets();
            renderPlanets();
            closeAllToolWindows();
        }
    });

    toggleAnimationsBtn.addEventListener('click', () => {
        const galaxy = document.getElementById('galaxy-container');
        const landingPreviewParticles = document.querySelector('.preview-particles');
        const landingPreviewPlanets = document.querySelectorAll('.preview-planet');

        const isAnimated = galaxy.style.animationPlayState !== 'paused';

        if (isAnimated) {
            galaxy.style.animationPlayState = 'paused';
            landingPreviewParticles.style.animationPlayState = 'paused';
            landingPreviewPlanets.forEach(p => p.style.animationPlayState = 'paused');
            toggleAnimationsBtn.textContent = 'Animações OFF';
        } else {
            galaxy.style.animationPlayState = 'running';
            landingPreviewParticles.style.animationPlayState = 'running';
            landingPreviewPlanets.forEach(p => p.style.animationPlayState = 'running');
            toggleAnimationsBtn.textContent = 'Animações ON';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllToolWindows();
            addPlanetModal.classList.remove('active');
            changeColorModal.classList.remove('active');
            changeThemeModal.classList.remove('active'); // Fecha o modal de tema
            contextMenu.style.display = 'none';
        }
    });

    // Inicializa o tema ao carregar a página
    loadTheme();
});
