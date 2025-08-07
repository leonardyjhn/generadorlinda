document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const manualModeBtn = document.getElementById('manualModeBtn');
    const manualControls = document.getElementById('manualControls');
    const preview = document.getElementById('preview');
    
    // Elementos de controles
    const fontSizeInput = document.getElementById('fontSize');
    const fontColorInput = document.getElementById('fontColor');
    const columnsInput = document.getElementById('columns');
    const cellSizeInput = document.getElementById('cellSize');
    const availableColorInput = document.getElementById('availableColor');
    const reservedColorInput = document.getElementById('reservedColor');
    const paidColorInput = document.getElementById('paidColor');
    const borderColorInput = document.getElementById('borderColor');
    const borderWidthInput = document.getElementById('borderWidth');
    const showAvailableInput = document.getElementById('showAvailable');
    const showReservedInput = document.getElementById('showReserved');
    const showPaidInput = document.getElementById('showPaid');
    const titleTextInput = document.getElementById('titleText');
    const titleFontSizeInput = document.getElementById('titleFontSize');
    const titleColorInput = document.getElementById('titleColor');
    const businessImageInput = document.getElementById('businessImage');
    const imageWidthInput = document.getElementById('imageWidth');
    const imageHeightInput = document.getElementById('imageHeight');
    
    // Elementos del modo manual
    const manualNumberInput = document.getElementById('manualNumber');
    const manualStatusInput = document.getElementById('manualStatus');
    const addNumberBtn = document.getElementById('addNumberBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const manualNumbersList = document.getElementById('manualNumbersList');
    
    // Datos de la rifa
    let raffleData = [];
let manualData = [];
let isManualMode = false;

// Nuevos elementos del DOM (agregar al inicio con los otros elementos)
const totalNumbersInput = document.getElementById('totalNumbers');
const reservedNumbersInput = document.getElementById('reservedNumbers');
const generateManualBtn = document.getElementById('generateManualBtn');
    
    // Eventos de arrastrar y soltar
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length && files[0].name.endsWith('.csv')) {
            fileInput.files = files;
            handleFileSelect({ target: fileInput });
        }
    }
    
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            processCSV(contents);
        };
        reader.readAsText(file);
    }
    
    function processCSV(csv) {
        const lines = csv.split('\n');
        raffleData = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const parts = lines[i].split(',');
            if (parts.length >= 2) {
                const number = parts[0].trim();
                const status = parts[1].trim().toLowerCase();
                
                if (['disponible', 'apartado', 'pagado'].includes(status)) {
                    raffleData.push({ number, status });
                }
            }
        }
        
        if (!isManualMode) {
            generateGrid();
        }
    }
    
    // Generar la cuadrícula
    function generateGrid() {
        // Limpiar vista previa
        preview.innerHTML = '';
        
        // Obtener configuraciones
        const fontSize = parseInt(fontSizeInput.value);
        const fontColor = fontColorInput.value;
        const columns = parseInt(columnsInput.value);
        const cellSize = parseInt(cellSizeInput.value);
        const availableColor = availableColorInput.value;
        const reservedColor = reservedColorInput.value;
        const paidColor = paidColorInput.value;
        const borderColor = borderColorInput.value;
        const borderWidth = parseInt(borderWidthInput.value);
        const showAvailable = showAvailableInput.checked;
        const showReserved = showReservedInput.checked;
        const showPaid = showPaidInput.checked;
        const titleText = titleTextInput.value;
        const titleFontSize = parseInt(titleFontSizeInput.value);
        const titleColor = titleColorInput.value;
        
        // Filtrar datos según lo que se debe mostrar
        const dataToShow = isManualMode ? manualData : raffleData;
        const filteredData = dataToShow.filter(item => {
            if (item.status === 'disponible' && showAvailable) return true;
            if (item.status === 'apartado' && showReserved) return true;
            if (item.status === 'pagado' && showPaid) return true;
            return false;
        });
        
        // Ordenar los números
        filteredData.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        
        // Crear contenedor para la imagen, título y cuadrícula
        const container = document.createElement('div');
        container.style.display = 'inline-block';
        container.style.textAlign = 'center';
        
        // Agregar imagen del negocio si existe
        if (businessImageInput.files.length > 0) {
    const imageUrl = URL.createObjectURL(businessImageInput.files[0]);
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Imagen del negocio';
    img.className = 'business-image';
    
    // Solo establece el ancho, la altura se ajustará automáticamente
    img.style.width = `${imageWidthInput.value}px`;
    img.style.height = 'auto'; // Mantiene la proporción
    
    container.appendChild(img);
}
        
        // Agregar título
        if (titleText) {
            const title = document.createElement('h2');
            title.className = 'title';
            title.textContent = titleText;
            title.style.fontSize = `${titleFontSize}px`;
            title.style.color = titleColor;
            container.appendChild(title);
        }
        
        // Crear cuadrícula
        const grid = document.createElement('div');
        grid.className = 'grid';
        grid.style.gridTemplateColumns = `repeat(${columns}, ${cellSize}px)`;
        
        // Llenar la cuadrícula con celdas
        filteredData.forEach(item => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = item.number;
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.fontSize = `${fontSize}px`;
            cell.style.color = fontColor;
            cell.style.borderColor = borderColor;
            cell.style.borderWidth = `${borderWidth}px`;
            
            // Establecer color de fondo según el estado
            if (item.status === 'disponible') {
                cell.style.backgroundColor = availableColor;
            } else if (item.status === 'apartado') {
                cell.style.backgroundColor = reservedColor;
            } else if (item.status === 'pagado') {
                cell.style.backgroundColor = paidColor;
            }
            
            grid.appendChild(cell);
        });
        
        container.appendChild(grid);
        preview.appendChild(container);
    }
    
    // Descargar la imagen
    function downloadImage() {
        if (preview.children.length === 0) {
            alert('Primero genera una cuadrícula');
            return;
        }
        
        // Usamos html2canvas para convertir el HTML a imagen
        const container = preview.querySelector('div');
        
        html2canvas(container, {
            scale: 2, // Mayor calidad
            logging: false,
            useCORS: true,
            allowTaint: true,
            width: container.offsetWidth,
            height: container.offsetHeight
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'rifa.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
    
    // Modo manual
    function toggleManualMode() {
        isManualMode = !isManualMode;
        manualControls.style.display = isManualMode ? 'block' : 'none';
        manualModeBtn.textContent = isManualMode ? 'Modo CSV' : 'Modo Manual';
        
        if (isManualMode) {
            generateGrid();
        } else {
            generateGrid();
        }
    }
    
    function generateManualGrid() {
    const totalNumbers = parseInt(totalNumbersInput.value);
    const reservedNumbersText = reservedNumbersInput.value;
    const status = manualStatusInput.value;
    
    if (isNaN(totalNumbers) || totalNumbers < 1) {
        alert('Ingrese una cantidad válida de números');
        return;
    }
    
    // Limpiar datos manuales
    manualData = [];
    
    // Generar todos los números disponibles primero
    for (let i = 1; i <= totalNumbers; i++) {
        const number = i.toString().padStart(3, '0');
        manualData.push({ number, status: 'disponible' });
    }
    
    // Procesar números apartados/pagados
    if (reservedNumbersText.trim() !== '') {
        // Separar números por comas, espacios o puntos
        const numbersArray = reservedNumbersText.split(/[, .]+/).filter(n => n.trim() !== '');
        
        numbersArray.forEach(numStr => {
            const num = numStr.trim().padStart(3, '0');
            // Buscar el número en los datos y cambiar su estado
            const found = manualData.find(item => item.number === num);
            if (found) {
                found.status = status;
            }
        });
    }
    
    generateGrid();
}
    


    
    // Event listeners
    generateBtn.addEventListener('click', generateGrid);
    downloadBtn.addEventListener('click', downloadImage);
    manualModeBtn.addEventListener('click', toggleManualMode);
    generateManualBtn.addEventListener('click', generateManualGrid);
    clearAllBtn.addEventListener('click', clearAllManualNumbers);
    
    // Event listeners para regenerar la cuadrícula cuando cambian los parámetros
    [
        fontSizeInput, fontColorInput, columnsInput, cellSizeInput,
        availableColorInput, reservedColorInput, paidColorInput,
        borderColorInput, borderWidthInput, showAvailableInput,
        showReservedInput, showPaidInput, titleTextInput,
        titleFontSizeInput, titleColorInput, businessImageInput,
        imageWidthInput, imageHeightInput
    ].forEach(input => {
        input.addEventListener('change', generateGrid);
    });
    
    // Inicializar con algunos datos de ejemplo si no hay CSV cargado
    if (raffleData.length === 0 && !isManualMode) {
        // Puedes agregar algunos datos de ejemplo aquí si lo deseas
    }
});