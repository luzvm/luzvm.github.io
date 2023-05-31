// Cargar el modelo
async function loadModel() {
  const model = await tf.loadLayersModel('model.json');
  return model;
}

// Preprocesar la imagen
function preprocessImage(image) {
  const resizedImage = tf.image.resizeBilinear(image, [256, 256]);
  const normalizedImage = resizedImage.div(255.0);
  const batchedImage = normalizedImage.expandDims(0);
  return batchedImage;
}

// Realizar la predicción de la imagen
async function predictImage(image) {
  const model = await loadModel();
  const processedImage = preprocessImage(image);
  const predictions = await model.predict(processedImage).data();
  return predictions;
}

// Actualizar los campos de resultados en la página
function updateResultFields(results) {
  const labels = ["Folding marks", "Grain off", "Growth marks", "loose grains", "non defective", "pinhole"];
  for (let i = 0; i < results.length; i++) {
    const probability = results[i].toFixed(4);
    document.getElementById(`class${i + 1}`).textContent = probability;
  }
}

// Manejar la carga de imágenes desde el archivo seleccionado
function handleImageUpload(event) {
  const imageFile = event.target.files[0];
  const imagePreview = document.getElementById("image-preview");

  if (imageFile) {
    const imageElement = new Image();
    imageElement.onload = async () => {
      const results = await predictImage(imageElement);
      updateResultFields(results);
    };
    imageElement.src = URL.createObjectURL(imageFile);
  } else {
    imagePreview.src = "";
    updateResultFields([]);
  }
}

// Manejar la carga de imágenes desde una URL
function loadImageFromURL() {
  const imageUrl = document.getElementById("image-url").value;
  const imagePreview = document.getElementById("image-preview");

  if (imageUrl) {
    const imageElement = new Image();
    imageElement.crossOrigin = "anonymous";
    imageElement.onload = async () => {
      const results = await predictImage(imageElement);
      updateResultFields(results);
    };
    imageElement.src = imageUrl;
  } else {
    imagePreview.src = "";
    updateResultFields([]);
  }
}

// Mostrar una vista previa de la imagen cargada
function showImagePreview(event) {
  const preview = document.getElementById("image-preview");
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onloadend = function() {
    preview.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}
function updateResultFields(results) {
  const labels = ["Folding marks", "Grain off", "Growth marks", "loose grains", "non defective", "pinhole"];
  for (let i = 0; i < results.length; i++) {
    const probability = results[i].toFixed(4);
    document.getElementById(`class${i + 1}`).textContent = probability;
  }

  const maxProbability = Math.max(...results);
  const maxIndex = results.indexOf(maxProbability);
  const predictedLabel = labels[maxIndex];

  alert(`Predicción: ${predictedLabel}`);
}

// Asociar eventos a los elementos de la interfaz
document.getElementById("upload-pc-button").addEventListener("click", function() {
  document.getElementById("upload-pc").click();
});

document.getElementById("upload-pc").addEventListener("change", handleImageUpload);
document.getElementById("upload-button-url").addEventListener("click", loadImageFromURL);
