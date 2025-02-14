const editorElement = document.getElementById("editor");
const preview = document.getElementById("preview");

const editor = CodeMirror.fromTextArea(editorElement, {
  mode: "markdown",
  lineNumbers: true,
  theme: "default",
});

let activeElement = null;

function handlePointerEnter(element) {
  activeElement = element;
}

function handlePointerLeave() {
  activeElement = null;
}

// Настраиваем отслеживание указателя для редактора
editor
  .getWrapperElement()
  .addEventListener("pointerenter", () => handlePointerEnter(editor));
editor
  .getWrapperElement()
  .addEventListener("pointerleave", handlePointerLeave);

// Настраиваем отслеживание указателя для превью
preview.addEventListener("pointerenter", () => handlePointerEnter(preview));
preview.addEventListener("pointerleave", handlePointerLeave);

function syncScroll(from, to) {
  const fromElement = from.getScrollerElement
    ? from.getScrollerElement()
    : from;
  const toElement = to.getScrollerElement ? to.getScrollerElement() : to;

  // Проверяем, что указатель находится над элементом
  if (activeElement !== from) return;



  const ratio =
    fromElement.scrollTop /
    (fromElement.scrollHeight - fromElement.clientHeight);
  toElement.scrollTop =
    ratio * (toElement.scrollHeight - toElement.clientHeight);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function updateURL(text) {
  const compressed = LZString.compressToEncodedURIComponent(text);
  const newURL = `${window.location.origin}${window.location.pathname}#${compressed}`;
  history.replaceState(null, "", newURL);
}

function updateMarkdown() {
  const markdownText = editor.getValue();
  renderMarkdown(markdownText);
  debouncedUpdateURL(markdownText);
}

const debouncedUpdateURL = debounce(updateURL, 500);

function renderMarkdown(text) {
  preview.innerHTML = marked.parse(text, {
    highlight: function (code, lang) {
      return hljs.highlightAuto(code).value;
    },
  });
}

function loadFromURL() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(hash);
      if (decompressed) {
        editor.setValue(decompressed);
        updateMarkdown();
      }
    } catch (e) {
      console.error("Failed to decompress URL data:", e);
    }
  }
}

document.getElementById("share").addEventListener("click", async () => {
  const text = editor.getValue();
  const compressed = LZString.compressToEncodedURIComponent(text);
  const url = `${window.location.origin}${window.location.pathname}#${compressed}`;

  try {
    // Получаем IP адрес пользователя
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const userIp = ipData.ip;

    const response = await fetch(
      "https://shlink.usov-home.ru/rest/v3/short-urls",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "4b209fa0-8230-499a-b77a-22744e926b3c",
        },
        body: JSON.stringify({
          longUrl: url,
          tags: ["md-share", `ip-${userIp}`],
          findIfExists: true
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create/get short URL");
    }

    const data = await response.json();
    const shortUrl = data.shortUrl;

    await navigator.clipboard.writeText(shortUrl);
    alert("Короткая ссылка скопирована в буфер обмена!");
  } catch (err) {
    console.error("Failed to handle short URL:", err);
    // В случае ошибки копируем длинную ссылку
    await navigator.clipboard.writeText(url);
    alert("Не удалось создать короткую ссылку. Скопирована полная ссылка: " + url);
  }
});

document.getElementById("clear").addEventListener("click", () => {
  editor.setValue("");
  updateMarkdown();
});

editor.on("change", updateMarkdown);
editor.on("scroll", () => syncScroll(editor, preview));
preview.addEventListener("scroll", () => syncScroll(preview, editor));
loadFromURL();
