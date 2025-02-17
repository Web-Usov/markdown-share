import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  compressText,
  decompressText,
  createShareableUrl,
  useCachedState,
} from "../utils";

interface MarkdownContextType {
  content: string;
  setContent: (content: string) => void;
  shareableUrl: string;
  createShortUrl: () => Promise<string>;
  userIp: string;
}

const MarkdownContext = createContext<MarkdownContextType | undefined>(
  undefined
);

interface MarkdownProviderProps {
  children: ReactNode;
}

export const MarkdownProvider = ({ children }: MarkdownProviderProps) => {
  const [content, setContent] = useCachedState<string>("markdown:content", "");
  const [shareableUrl, setShareableUrl] = useState("");
  const [userIp, setUserIp] = useState("");

  // Получаем IP пользователя при загрузке
  useEffect(() => {
    const fetchUserIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setUserIp(data.ip);
      } catch (error) {
        console.error("Failed to fetch user IP:", error);
      }
    };
    fetchUserIp();
  }, []);

  // При загрузке приложения извлекаем контент из URL
  useEffect(() => {
    const hash = window.location.hash.slice(1);

    if (hash) {
      try {
        const decompressed = decompressText(hash);
        if (decompressed) {
          setContent(decompressed);
        } else {
          console.warn("Decompressed content is empty");
        }
      } catch (e) {
        console.error("Failed to decompress URL data:", e);
      }
    }
  }, []);

  // При изменении контента обновляем URL
  useEffect(() => {
    if (content) {
      const compressed = compressText(content);
      window.history.replaceState(null, "", `#${compressed}`);
      setShareableUrl(createShareableUrl(content));
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [content]);

  // Функция для создания короткой ссылки через shlink.io
  const createShortUrl = async (): Promise<string> => {
    try {
      const response = await fetch(
        "https://shlink.usov-home.ru/rest/v2/short-urls",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": import.meta.env.VITE_SHLINK_API_KEY || "",
          },
          body: JSON.stringify({
            longUrl: shareableUrl,
            tags: ["md-share", `ip-${userIp}`],
            findIfExists: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create short URL");
      }

      const data = await response.json();
      return data.shortUrl;
    } catch (error) {
      console.error("Error creating short URL:", error);
      return shareableUrl; // возвращаем оригинальную ссылку в случае ошибки
    }
  };

  const value = {
    content,
    setContent,
    shareableUrl,
    createShortUrl,
    userIp,
  };

  return (
    <MarkdownContext.Provider value={value}>
      {children}
    </MarkdownContext.Provider>
  );
};

export const useMarkdown = (): MarkdownContextType => {
  const context = useContext(MarkdownContext);
  if (context === undefined) {
    throw new Error("useMarkdown must be used within a MarkdownProvider");
  }
  return context;
};
