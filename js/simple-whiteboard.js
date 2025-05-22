// Implementação básica de um quadro branco
class SimpleWhiteboard {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.drawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.currentColor = '#000000';
        this.currentSize = 3;
        
        this.init();
    }
    
    init() {
        // Criar o canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.background = '#ffffff';
        this.canvas.style.cursor = 'crosshair';
        this.container.appendChild(this.canvas);
        
        // Obter contexto
        this.ctx = this.canvas.getContext('2d');
        
        // Configurar eventos
        this.setupEvents();
        
        // Criar controles
        this.createControls();
    }
    
    setupEvents() {
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        
        // Eventos de toque para dispositivos móveis
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        // Redimensionar canvas quando a janela for redimensionada
        window.addEventListener('resize', () => {
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.width = this.container.clientWidth;
            this.canvas.height = this.container.clientHeight;
            this.ctx.putImageData(imageData, 0, 0);
        });
    }
    
    startDrawing(e) {
        this.drawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }
    
    draw(e) {
        if (!this.drawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        
        this.lastX = x;
        this.lastY = y;
    }
    
    stopDrawing() {
        this.drawing = false;
    }
    
    createControls() {
        const controls = document.createElement('div');
        controls.style.position = 'absolute';
        controls.style.top = '10px';
        controls.style.left = '10px';
        controls.style.display = 'flex';
        controls.style.gap = '10px';
        controls.style.background = 'rgba(255, 255, 255, 0.8)';
        controls.style.padding = '5px';
        controls.style.borderRadius = '5px';
        controls.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        
        // Seletor de cores
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = this.currentColor;
        colorPicker.addEventListener('change', (e) => {
            this.currentColor = e.target.value;
        });
        controls.appendChild(colorPicker);
        
        // Seletor de tamanho
        const sizeSelector = document.createElement('select');
        [1, 3, 5, 10].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}px`;
            if (size === this.currentSize) {
                option.selected = true;
            }
            sizeSelector.appendChild(option);
        });
        sizeSelector.addEventListener('change', (e) => {
            this.currentSize = parseInt(e.target.value);
        });
        controls.appendChild(sizeSelector);
        
        // Botão de limpar
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Limpar';
        clearBtn.style.border = 'none';
        clearBtn.style.background = '#f44336';
        clearBtn.style.color = 'white';
        clearBtn.style.padding = '5px 10px';
        clearBtn.style.borderRadius = '3px';
        clearBtn.style.cursor = 'pointer';
        clearBtn.addEventListener('click', () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });
        controls.appendChild(clearBtn);
        
        this.container.appendChild(controls);
    }
}

// Verificar se o Excalidraw está disponível
if (!window.ExcalidrawLib) {
    console.log('Excalidraw não disponível, usando SimpleWhiteboard');
    
    // Definir um objeto global simples para evitar erros
    window.ExcalidrawLib = {
        Excalidraw: function(options) {
            console.log('Usando implementação alternativa do quadro branco');
            return new SimpleWhiteboard(options.container);
        }
    };
} 