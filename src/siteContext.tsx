import { createContext, useEffect, useState } from "react";
import { IPage } from "./types";

export type SiteContextType = {
  cursor: {
    prevCursorX: number;
    prevCursorY: number;
    currCursorX: number;
    currCursorY: number;
    mouseDown: boolean;
  };
  pages: IPage[];
  postPrompt: (userPrompt: string) => Promise<void>;
};

export interface Cursor {
  currCursorX: number;
  currCursorY: number;
  prevCursorX: number;
  prevCursorY: number;
  mouseDown: boolean;
}

export const SiteContext = createContext({
  cursor: {
    currCursorX: 0,
    currCursorY: 0,
    prevCursorX: 0,
    prevCursorY: 0,
    mouseDown: false,
  },
  pages: [
    {
      name: "Page Title",
      prompt: "A viking sits on a large throne",
      image: "",
      position: 1,
    },
  ] as IPage[],
  currentPage: 0,
  setCurrentPage: (num: number) => {
    console.log("setCurrentPage ", num);
  },
  addPage: () => {
    console.log("addPage ");
  },
  postPrompt: async (userPrompt: string) => {
    console.log(`Received prompt: ${userPrompt}`);
  },
});

export default function SiteContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pages, setPages] = useState<IPage[]>([
    {
      name: "Empty Page",
      prompt: "",
      image: "",
      position: 1,
    },
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  //Cursor
  const [cursor, setCursor] = useState({
    currCursorX: 0,
    currCursorY: 0,
    prevCursorX: 0,
    prevCursorY: 0,
    mouseDown: false,
  });

  useEffect(() => {
    console.log("Fetching Book");
    async function fetchBook() {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/book`
      );
      const book = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch book");
        return;
      }

      console.log("Book fetched successfully");
      console.log(book.pages);
      setPages(book.pages);
    }

    fetchBook();
  }, []);

  async function postPrompt(prompt: string) {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/api/ai`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      console.error("Failed to create image");
      return;
    }
    console.log("ai image created");
    const data = await response.json();
    console.log(data);

    const newPage = pages[currentPage] as IPage;
    newPage.image = data.images[0];
    const updatedPages = [...pages];
    updatedPages[currentPage] = newPage;
    setPages(updatedPages);
  }

  // Cursor tracking
  useEffect(() => {
    const dispatchMousemove = (e: MouseEvent) => {
      setCursor((prev) => ({
        ...prev,
        prevCursorX: prev.currCursorX,
        prevCursorY: prev.currCursorY,
        currCursorX: e.clientX,
        currCursorY: e.clientY,
      }));
    };
    document.addEventListener("mousemove", dispatchMousemove);

    const dispatchMouseDown = () => {
      setCursor((prev) => ({
        ...prev,
        mouseDown: true,
      }));
    };
    document.addEventListener("mousedown", dispatchMouseDown);

    const dispatchMouseUp = () => {
      setCursor((prev) => ({
        ...prev,
        mouseDown: false,
      }));
    };
    document.addEventListener("mouseup", dispatchMouseUp);

    return () => {
      document.removeEventListener("mousemove", dispatchMousemove);
      document.removeEventListener("mousedown", dispatchMouseDown);
      document.removeEventListener("mouseup", dispatchMouseUp);
    };
  }, [cursor]);

  const addPage = () => {
    const pos = currentPage + 1
    const newPage = {
      name: "Empty Page",
      prompt: "",
      image: "",
      position: pos,
    }
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
  }

  return (
    <SiteContext.Provider
      value={{ cursor, pages, currentPage, setCurrentPage, postPrompt, addPage }}
    >
      {children}
    </SiteContext.Provider>
  );
}
