import { useMarkdown } from "../context/MarkdownContext";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";

export const Toolbar = () => {
  const { content, setContent, createShortUrl } = useMarkdown();
  const { theme, setTheme, asSelectedTheme } = useTheme();

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
      alert("Ссылка скопирована в буфер обмена!");
    } catch (error) {
      console.error("Failed to share:", error);
      alert("Не удалось создать ссылку");
    }
  };

  const handleClear = () => {
    if (window.confirm("Вы уверены, что хотите очистить редактор?")) {
      setContent("");
    }
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
      >
        Поделиться
      </button>
      <button
        className="btn btn-ghost m-1"
        onClick={handleClear}
        disabled={!content}
      >
        Очистить
      </button>
    </div>
  );
};
