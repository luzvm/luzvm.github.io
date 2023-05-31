async function predictImage(imageElement) {
  const model = await tf.loadLayersModel('model.json');
  const metadata = {
    tfjsVersion: "1.3.1",
    tmVersion: "2.4.5",
    packageVersion: "0.8.4-alpha2",
    packageName: "@teachablemachine/image",
    timeStamp: "2023-05-31T04:07:27.234Z",
    userMetadata: {},
    modelName: "tm-my-image-model",
    labels: ["Folding marks", "Grain off", "Growth marks", "loose grains", "non defective", "pinhole"],
    imageSize: 224
  };

  const image = tf.browser.fromPixels(imageElement).toFloat().expandDims();
  const normalizedImage = image.div(255.0);

  const predictions = await model.predict(normalizedImage).data();

  const classes = metadata.labels;
  const results = Array.from(predictions).map((prediction, index) => ({
    className: classes[index],
    probability: prediction.toFixed(4)
  }));

  return results;
}

function updateResultFields(results) {
  document.getElementById('pliegues').textContent = results[0].probability;
  document.getElementById('class2').textContent = results[1].probability;
  document.getElementById('class3').textContent = results[2].probability;
  document.getElementById('class4').textContent = results[3].probability;
  document.getElementById('class5').textContent = results[4].probability;
  document.getElementById('class6').textContent = results[5].probability;
}

document.getElementById("upload-pc-button").addEventListener("click", function() {
  document.getElementById("upload-pc").click();
});

document.getElementById("upload-pc").addEventListener("change", handleImageUpload);
document.getElementById("upload-button-url").addEventListener("click", loadImageFromURL);

function handleImageUpload(event) {
  const imageFile = event.target.files[0];
  const imagePreview = document.getElementById("image-preview");

  if (imageFile) {
    showImagePreview(event);

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

function showImagePreview(event) {
  var preview = document.getElementById("image-preview");
  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onloadend = function () {
    preview.src = reader.result;
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
  }
}

function loadImageFromURL() {
  var imageUrl = document.getElementById("image-url").value;
  var imagePreview = document.getElementById("image-preview");

  if (imageUrl) {
    showImagePreviewURL(imageUrl);

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

function showImagePreviewURL(url) {
  var preview = document.getElementById("image-preview");
  preview.src = url;
}
