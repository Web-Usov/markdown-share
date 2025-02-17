import { useMarkdown } from "../context/MarkdownContext";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";
import { MdShare, MdDelete } from "react-icons/md";
import { Modal } from "./Modal";

export const Toolbar = () => {
  const { content, setContent, createShortUrl } = useMarkdown();
  const { theme, setTheme, asSelectedTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
        <span className="hidden sm:inline">Поделиться</span>
        <span className="sm:hidden">
          <MdShare size={20} />
        </span>
      </button>
      <button
        className="btn btn-secondary m-1"
        onClick={handleClear}
        disabled={!content}
        title="Очистить"
      >
        <span className="hidden sm:inline">Очистить</span>
        <span className="sm:hidden">
          <MdDelete size={20} />
        </span>
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
    </div>
  );
};
