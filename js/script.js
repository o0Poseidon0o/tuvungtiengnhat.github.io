var flashcard = document.getElementById("flashcard");
var wordElement = document.getElementById("word");
var romajiElement = document.getElementById("romaji");
var meaningElement = document.getElementById("meaning");
var nextBtn = document.getElementById("nextBtn");

var vocabulary = [];

function showNextWord() {
  if (vocabulary.length > 0) {
    var randomIndex = Math.floor(Math.random() * vocabulary.length);
    var currentWord = vocabulary[randomIndex];
    vocabulary.splice(randomIndex, 1); // Xóa từ vựng đã được hiển thị khỏi danh sách
    wordElement.textContent = currentWord.Kanji + " (" + currentWord.Kana + ")";
    romajiElement.textContent = currentWord.Romaji;
    meaningElement.style.display = "none"; // Ẩn nghĩa của từ
    wordElement.addEventListener("click", function () {
      meaningElement.textContent = currentWord["Ý nghĩa"];
      meaningElement.style.display = "block"; // Hiển thị nghĩa của từ khi click vào từ
    });
    speakKana(currentWord.Kana); // Thêm phần này để phát ra âm thanh
  } else {
    wordElement.textContent = "Hết từ vựng";
    romajiElement.textContent = "";
    meaningElement.textContent = "";
    nextBtn.disabled = true;
  }
}

nextBtn.addEventListener("click", showNextWord);

function parseCSV(csvData) {
  var parsedData = Papa.parse(csvData, { header: true }).data;
  vocabulary = parsedData;
  nextBtn.disabled = false;
}

function handleFileSelect(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var csvData = e.target.result;
    parseCSV(csvData);
  };
  reader.readAsText(file);
}

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect);

function speakKana(kana) {
  var utterance = new SpeechSynthesisUtterance(kana);
  utterance.lang = "ja-JP";
  speechSynthesis.speak(utterance);
}
