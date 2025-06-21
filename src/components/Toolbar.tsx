import { useMarkdown } from "../context/MarkdownContext";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import { MdShare, MdDelete, MdDownload } from "react-icons/md";
import { Modal } from "./Modal";

export const Toolbar = () => {
  const { content, setContent, createShortUrl } = useMarkdown();
  const { theme, setTheme, asSelectedTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const handleThemeChange = () => {
      document.documentElement.setAttribute("data-theme", theme);
    };

    handleThemeChange();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, [theme]);

  const handleShare = async () => {
    try {
      const shortUrl = await createShortUrl();
      await navigator.clipboard.writeText(shortUrl);
      setModalMessage("Ссылка скопирована в буфер обмена!");
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to share:", error);
      setModalMessage("Не удалось создать ссылку");
      setModalOpen(true);
    }
  };

  const handleClear = () => {
    setModalMessage("Вы уверены, что хотите очистить редактор?");
    setShowClearConfirm(true);
    setModalOpen(true);
  };

  const handleConfirmClear = () => {
    setContent("");
    setModalOpen(false);
    setShowClearConfirm(false);
  };

  const getDefaultFileName = () => {
    if (!content) return "document";

    // Берем первую строку
    const firstLine = content.split("\n")[0].trim();
    if (!firstLine) return "document";

    // Транслитерация кириллицы
    const translit: Record<string, string> = {
      а: "a",
      б: "b",
      в: "v",
      г: "g",
      д: "d",
      е: "e",
      ё: "yo",
      ж: "zh",
      з: "z",
      и: "i",
      й: "y",
      к: "k",
      л: "l",
      м: "m",
      н: "n",
      о: "o",
      п: "p",
      р: "r",
      с: "s",
      т: "t",
      у: "u",
      ф: "f",
      х: "h",
      ц: "ts",
      ч: "ch",
      ш: "sh",
      щ: "sch",
      ъ: "",
      ы: "y",
      ь: "",
      э: "e",
      ю: "yu",
      я: "ya",
    };

    const result = firstLine
      .toLowerCase()
      .split("")
      .map((char) => translit[char] || char)
      .join("")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    return result || "document";
  };

  const handleDownloadClick = () => {
    const defaultName = getDefaultFileName() + ".md";
    setFileName(defaultName);
    setShowDownloadModal(true);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadModal(false);
  };

  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost m-1">
          {asSelectedTheme === "light" && <span>☀️</span>}
          {asSelectedTheme === "dark" && <span>🌙</span>}
          {asSelectedTheme === "system" && <span>💻</span>}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a
              onClick={() => setTheme("light")}
              className={theme === "light" ? "active" : ""}
            >
              Светлая ☀️
            </a>
          </li>
          <li>
            <a
              onClick={() => setTheme("dark")}
              className={theme === "dark" ? "active" : ""}
            >
              Темная 🌙
            </a>
          </li>
          <li>
            <a
              onClick={() => setTheme("system")}
              className={asSelectedTheme === "system" ? "active" : ""}
            >
              Системная 💻
            </a>
          </li>
        </ul>
      </div>
      <button
        className="btn btn-primary m-1"
        onClick={handleShare}
        disabled={!content}
        title="Поделиться"
      >
        <MdShare size={20} />
      </button>
      <button
        className="btn btn-secondary m-1"
        onClick={handleClear}
        disabled={!content}
        title="Очистить"
      >
        <MdDelete size={20} />
      </button>
      <button
        className="btn btn-accent m-1"
        onClick={handleDownloadClick}
        disabled={!content}
        title="Скачать"
      >
        <MdDownload size={20} />
      </button>
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (showClearConfirm) {
            setShowClearConfirm(false);
          }
        }}
        message={modalMessage}
        confirmAction={showClearConfirm ? handleConfirmClear : undefined}
      />
      <Modal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        message={
          <div className="flex flex-col gap-2 ">
            <span>Название файла:</span>
            <input
              type="text"
              className="input input-bordered w-full"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
        }
        confirmAction={handleDownload}
        confirmText="Скачать"
      />
    </div>
  );
};
