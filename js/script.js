var flashcard = document.getElementById("flashcard");
var wordElement = document.getElementById("word");
var romajiElement = document.getElementById("romaji");
var meaningElement = document.getElementById("meaning");
var nextBtn = document.getElementById("nextBtn");
var listenBtn = document.getElementById("listenBtn");
var answer1Element = document.getElementById("label1");
var answer2Element = document.getElementById("label2");
var answer3Element = document.getElementById("label3");
var answer4Element = document.getElementById("label4");
var resultElement = document.getElementById("result");

var vocabulary = [];
var currentWord;
var selectedAnswer = false;

function showNextWord() {
  if (vocabulary.length > 0) {
    var randomIndex = Math.floor(Math.random() * vocabulary.length);
    currentWord = vocabulary[randomIndex];
    vocabulary.splice(randomIndex, 1);
    wordElement.innerHTML =
      currentWord.Kanji + "<br>(" + currentWord.Kana + ")";

    romajiElement.textContent = currentWord.Romaji;
    meaningElement.style.display = "none";
    wordElement.addEventListener("click", function () {
      meaningElement.textContent = currentWord["Ý nghĩa"];
      meaningElement.style.display = "block";
    });

    answer1Element.textContent = currentWord["Ý nghĩa"];
    answer2Element.textContent = getRandomMeaning();
    answer3Element.textContent = getRandomMeaning();
    answer4Element.textContent = getRandomMeaning();

    var answerRadios = document.querySelectorAll(
      "#answers input[type='radio']"
    );
    for (var i = 0; i < answerRadios.length; i++) {
      answerRadios[i].checked = false;
    }

    selectedAnswer = false;
    nextBtn.disabled = true;
    resultElement.textContent = "";
    hideErrorMessage();
  } else {
    wordElement.textContent = "Hết từ vựng";
    romajiElement.textContent = "";
    meaningElement.textContent = "";
    nextBtn.disabled = true;
    listenBtn.disabled = true;
  }
}

function getRandomMeaning() {
  var randomIndex = Math.floor(Math.random() * vocabulary.length);
  return vocabulary[randomIndex]["Ý nghĩa"];
}

nextBtn.addEventListener("click", showNextWord);

function parseCSV(csvData) {
  var parsedData = Papa.parse(csvData, { header: true }).data;
  vocabulary = parsedData;
}

function handleFileSelect(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var csvData = e.target.result;
    parseCSV(csvData);
    showNextWord();
  };
  reader.readAsText(file);
}

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect);

listenBtn.addEventListener("click", function () {
  if (currentWord !== undefined) {
    speakKana(currentWord.Kana);
  }
});

function speakKana(kana) {
  if ("speechSynthesis" in window) {
    var utterance = new SpeechSynthesisUtterance(kana);
    utterance.lang = "ja-JP";
    window.speechSynthesis.speak(utterance);
  } else if ("webkitSpeechSynthesis" in window) {
    var utterance = new SpeechSynthesisUtterance(kana);
    utterance.lang = "ja-JP";
    window.webkitSpeechSynthesis.speak(utterance);
  } else if (
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  ) {
    var utterance = new SpeechSynthesisUtterance(kana);
    utterance.lang = "ja-JP";
    var speech = new SpeechSynthesis();
    speech.speak(utterance);
  } else {
    alert("Trình duyệt của bạn không hỗ trợ Text-to-Speech.");
  }
}

var checkBtn = document.getElementById("checkBtn");
var resultElement = document.getElementById("result");
var errorMessageElement = document.getElementById("errorMessage");

function checkAnswer() {
  var answerLabels = document.querySelectorAll("#answers label");
  var selectedAnswer;
  for (var i = 0; i < answerLabels.length; i++) {
    if (document.getElementById("answer" + (i + 1)).checked) {
      selectedAnswer = answerLabels[i].textContent;
      break;
    }
  }

  if (selectedAnswer === undefined) {
    displayErrorMessage("Vui lòng chọn một đáp án trước khi kiểm tra.");
    return;
  }

  resultElement.textContent =
    "Đáp án: " +
    (selectedAnswer === currentWord["Ý nghĩa"]
      ? "Đúng tốt lắm"
      : "Sai cần lưu ý");

  nextBtn.disabled = false;
  hideErrorMessage();
}

checkBtn.addEventListener("click", checkAnswer);

function displayErrorMessage(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";
}

function hideErrorMessage() {
  errorMessageElement.textContent = "";
  errorMessageElement.style.display = "none";
}
