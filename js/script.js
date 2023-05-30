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
var errorMessageElement = document.getElementById("errorMessage");

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

function handleJSONData(data) {
  vocabulary = data;
  showNextWord();
}

function handleFileSelect(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var jsonData = e.target.result;
    vocabulary = JSON.parse(jsonData);
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

function loadJSON(callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", "./data/bai1.json", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}

function handleFileSelect(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var jsonData = e.target.result;
    vocabulary = JSON.parse(jsonData);
    loadBtn.disabled = false;
  };
  reader.readAsText(file);
}

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect);

loadBtn.addEventListener("click", function () {
  if (vocabulary.length === 0) {
    displayErrorMessage(
      "Không có dữ liệu từ vựng. Vui lòng chọn tệp tin JSON."
    );
    return;
  }

  showNextWord();
});

// Thay đổi danh sách bài tập
var exerciseSelect = document.getElementById("exerciseSelect");
exerciseSelect.addEventListener("change", function (event) {
  var selectedOption = event.target.value;
  if (selectedOption === "") {
    vocabulary = [];
    loadBtn.disabled = true;
  } else {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", selectedOption, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        vocabulary = JSON.parse(xhr.responseText);
        loadBtn.disabled = false;
      }
    };
    xhr.send(null);
  }
});

// Đọc nội dung của thư mục "data"
fetch("./data/")
  .then((response) => response.text())
  .then((data) => {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(data, "text/html");

    // Trích xuất danh sách các tệp tin JSON trong thư mục
    var fileLinks = htmlDoc.querySelectorAll("a[href$='.json']");
    fileLinks.forEach((fileLink) => {
      var option = document.createElement("option");
      option.value = fileLink.getAttribute("href");
      option.text = fileLink.textContent;
      exerciseSelect.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Lỗi khi đọc nội dung thư mục:", error);
  });
function handleFileSelect(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var jsonData = e.target.result;
    vocabulary = JSON.parse(jsonData);
    saveToLocalStorage(vocabulary);
    showNextWord();
  };
  reader.readAsText(file);
}

function saveToLocalStorage(data) {
  var jsonData = JSON.stringify(data);
  localStorage.setItem("vocabularyData", jsonData);
}

// ...

// Load dữ liệu từ local storage (nếu có)
function loadFromLocalStorage() {
  var jsonData = localStorage.getItem("vocabularyData");
  if (jsonData) {
    vocabulary = JSON.parse(jsonData);
    showNextWord();
  }
}

loadFromLocalStorage();
