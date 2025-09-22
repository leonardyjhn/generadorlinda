document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const manualModeBtn = document.getElementById('manualModeBtn');
    // Nuevos elementos para división
const splitGridCheckbox = document.getElementById('splitGrid');
const downloadSplitBtn = document.getElementById('downloadSplitBtn');
    const manualControls = document.getElementById('manualControls');
    const preview = document.getElementById('preview');
    
    // Elementos de controles
    const fontSizeInput = document.getElementById('fontSize');
    const fontColorInput = document.getElementById('fontColor');
    const columnsInput = document.getElementById('columns');
    const cellSizeInput = document.getElementById('cellSize');
    const cellWidthInput = document.getElementById('cellWidth');
const cellHeightInput = document.getElementById('cellHeight')
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
            let status = parts[1].trim().toLowerCase();
            
            // Convertir "abonado" a "apartado"
            if (status === 'abonado') {
                status = 'apartado';
            }
            
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
    const cellWidth = parseInt(cellWidthInput.value);
    const cellHeight = parseInt(cellHeightInput.value);
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
    const splitGrid = splitGridCheckbox.checked;
    
    // Mostrar/ocultar botón de descarga dividida
    downloadSplitBtn.style.display = splitGrid ? 'inline-block' : 'none';
    downloadBtn.textContent = splitGrid ? 'Descargar Imagen Completa' : 'Descargar Imagen';
    
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
    
    if (splitGrid) {
    generateSplitGrid(filteredData, fontSize, fontColor, columns, cellWidth, cellHeight, 
                     availableColor, reservedColor, paidColor, borderColor, 
                     borderWidth, titleText, titleFontSize, titleColor);
} else {
    generateSingleGrid(filteredData, fontSize, fontColor, columns, cellWidth, cellHeight, 
                      availableColor, reservedColor, paidColor, borderColor, 
                      borderWidth, titleText, titleFontSize, titleColor);
}
}

// Generar cuadrícula única (comportamiento original)
function generateSingleGrid(data, fontSize, fontColor, columns, cellWidth, cellHeight, 
                           availableColor, reservedColor, paidColor, borderColor, 
                           borderWidth, titleText, titleFontSize, titleColor) {
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
        img.style.width = `${imageWidthInput.value}px`;
        img.style.height = 'auto';
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
    grid.style.gridTemplateColumns = `repeat(${columns}, ${cellWidth}px)`;
    
    // Llenar la cuadrícula con celdas
    data.forEach(item => {
        const cell = createCell(item, cellWidth, cellHeight, fontSize, fontColor, borderColor, borderWidth, 
                       availableColor, reservedColor, paidColor);
        grid.appendChild(cell);
    });
    
    container.appendChild(grid);
    preview.appendChild(container);
}

// Generar cuadrícula dividida
function generateSplitGrid(data, fontSize, fontColor, columns, cellWidth, cellHeight, 
                          availableColor, reservedColor, paidColor, borderColor, 
                          borderWidth, titleText, titleFontSize, titleColor) {
    // Dividir datos en dos grupos: 000-499 y 500-999
    const firstHalf = data.filter(item => parseInt(item.number) < 500);
    const secondHalf = data.filter(item => parseInt(item.number) >= 500);
    
    // Crear contenedor principal para ambas cuadrículas
    const splitContainer = document.createElement('div');
    splitContainer.className = 'split-preview';
    
    // Generar primera mitad (000-499)
    if (firstHalf.length > 0) {
        const firstGridContainer = createSplitGridContainer(
            firstHalf, 'Números 000 - 499', fontSize, fontColor, columns, cellWidth, cellHeight,
            availableColor, reservedColor, paidColor, borderColor, borderWidth,
            titleText, titleFontSize, titleColor
        );
        splitContainer.appendChild(firstGridContainer);
    }
    
    // Generar segunda mitad (500-999)
    if (secondHalf.length > 0) {
        const secondGridContainer = createSplitGridContainer(
            secondHalf, 'Números 500 - 999', fontSize, fontColor, columns, cellWidth, cellHeight,
            availableColor, reservedColor, paidColor, borderColor, borderWidth,
            titleText, titleFontSize, titleColor
        );
        splitContainer.appendChild(secondGridContainer);
    }
    
    preview.appendChild(splitContainer);
}

// Crear contenedor para cada cuadrícula dividida
function createSplitGridContainer(data, rangeTitle, fontSize, fontColor, columns, cellWidth, cellHeight,
                                 availableColor, reservedColor, paidColor, borderColor,
                                 borderWidth, titleText, titleFontSize, titleColor) {
    const container = document.createElement('div');
    container.className = 'split-container';
    
    // Agregar imagen del negocio si existe (más pequeña para división)
    if (businessImageInput.files.length > 0) {
        const imageUrl = URL.createObjectURL(businessImageInput.files[0]);
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Imagen del negocio';
        img.className = 'business-image';
        img.style.width = `${parseInt(imageWidthInput.value) * 0.7}px`; // 70% del tamaño original
        img.style.height = 'auto';
        container.appendChild(img);
    }
    
    // Agregar título principal
    if (titleText) {
        const title = document.createElement('h2');
        title.className = 'title';
        title.textContent = titleText;
        title.style.fontSize = `${titleFontSize * 0.8}px`; // 80% del tamaño original
        title.style.color = titleColor;
        container.appendChild(title);
    }
    
    // QUITAMOS EL TÍTULO DEL RANGO (000-499 y 500-999)
    // Esta parte se eliminó para quitar el espacio extra
    
    // Crear cuadrícula
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = `repeat(${columns}, ${cellWidth}px)`;
    
    // Llenar la cuadrícula con celdas
    data.forEach(item => {
        const cell = createCell(item, cellWidth, cellHeight, fontSize, fontColor, borderColor, borderWidth,
                       availableColor, reservedColor, paidColor);
        grid.appendChild(cell);
    });
    
    container.appendChild(grid);
    return container;
}

// Función auxiliar para crear celdas
function createCell(item, cellWidth, cellHeight, fontSize, fontColor, borderColor, borderWidth,
                   availableColor, reservedColor, paidColor) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = item.number;
    cell.style.width = `${cellWidth}px`;
    cell.style.height = `${cellHeight}px`;
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
    
    return cell;
}
    
    // Descargar la imagen
function downloadImage() {
    if (preview.children.length === 0) {
        alert('Primero genera una cuadrícula');
        return;
    }
    
    const splitGrid = splitGridCheckbox.checked;
    
    if (splitGrid) {
        downloadCompleteGrid();
    } else {
        downloadSingleImage();
    }
}

// Descargar imagen única
function downloadSingleImage() {
    const container = preview.querySelector('div');
    
    html2canvas(container, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: container.offsetWidth,
        height: container.offsetHeight
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'rifa_completa.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// Descargar cuadrícula completa (cuando está dividida)
function downloadCompleteGrid() {
    html2canvas(preview, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'rifa_completa.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// Descargar imágenes divididas
function downloadSplitImages() {
    if (!splitGridCheckbox.checked) {
        alert('Active la opción "Dividir cuadrícula" primero');
        return;
    }
    
    const splitContainers = preview.querySelectorAll('.split-container');
    
    if (splitContainers.length === 0) {
        alert('Primero genera una cuadrícula dividida');
        return;
    }
    
    // Descargar cada contenedor individualmente
    splitContainers.forEach((container, index) => {
        html2canvas(container, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            const link = document.createElement('a');
            const range = index === 0 ? '000-499' : '500-999';
            link.download = `rifa_${range}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
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
    let status = manualStatusInput.value;
    
    // Convertir "abonado" a "apartado" también en modo manual
    if (status === 'abonado') {
        status = 'apartado';
    }
    
    if (isNaN(totalNumbers) || totalNumbers < 1) {
        alert('Ingrese una cantidad válida de números');
        return;
    }
    
    // Limpiar datos manuales
    manualData = [];
    
    // Generar todos los números disponibles primero
    for (let i = 0; i < totalNumbers; i++) {
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
    downloadSplitBtn.addEventListener('click', downloadSplitImages);

// Event listener para el checkbox de división
splitGridCheckbox.addEventListener('change', generateGrid);
    generateManualBtn.addEventListener('click', generateManualGrid);
    clearAllBtn.addEventListener('click', clearAllManualNumbers);
    
    // Event listeners para regenerar la cuadrícula cuando cambian los parámetros
    [
    fontSizeInput, fontColorInput, columnsInput, cellWidthInput, cellHeightInput,
    availableColorInput, reservedColorInput, paidColorInput,
    borderColorInput, borderWidthInput, showAvailableInput,
    showReservedInput, showPaidInput, titleTextInput,
    titleFontSizeInput, titleColorInput, businessImageInput,
    imageWidthInput, imageHeightInput, splitGridCheckbox
].forEach(input => {
    input.addEventListener('change', generateGrid);
});
    
    // Inicializar con algunos datos de ejemplo si no hay CSV cargado
    if (raffleData.length === 0 && !isManualMode) {
        // Puedes agregar algunos datos de ejemplo aquí si lo deseas
    }

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registrado con éxito');
      })
      .catch(err => {
        console.log('Error al registrar ServiceWorker:', err);
      });
  });
}

});

