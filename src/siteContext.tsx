import { createContext, useEffect, useState } from "react";
import { IBook, IPage } from "./types";

// export type SiteContextType = {
//   cursor: {
//     prevCursorX: number;
//     prevCursorY: number;
//     currCursorX: number;
//     currCursorY: number;
//     mouseDown: boolean;
//   };
//   pages: IPage[];
//   postPrompt: (userPrompt: string) => Promise<void>;
// };

export interface Cursor {
  currCursorX: number;
  currCursorY: number;
  prevCursorX: number;
  prevCursorY: number;
  mouseDown: boolean;
}

export const SiteContext = createContext({
  focusView: false,
  cursor: {
    currCursorX: 0,
    currCursorY: 0,
    prevCursorX: 0,
    prevCursorY: 0,
    mouseDown: false,
  },
  currentBook: {
    title:"Book Title",
    desc:"No description",
    pages: 0,
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
  setFocusView: (bool: boolean) => {console.log(bool);},
  setCurrentPage: (num: number) => {
    console.log("setCurrentPage ", num);
  },
  addPage: () => {
    console.log("addPage ");
  },
  updatePage: (page: IPage,index: number) => {
    console.log("updatePage ", page, index);
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
  const [currentBook, setCurrentBook] = useState<IBook>({
    title:"Book Title",
    desc:"No description",
    pages: 0,
  })
  const [pages, setPages] = useState<IPage[]>([
    {
      name: "Empty Page",
      prompt: "",
      image: "",
      position: 1,
      drawing: "",
      drawJSON: "",
      useDrawing: false,
    },
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [focusView, setFocusView] = useState(false);
  //Cursor
  const [cursor, setCursor] = useState({
    currCursorX: 0,
    currCursorY: 0,
    prevCursorX: 0,
    prevCursorY: 0,
    mouseDown: false,
  });

  function saveToLocal() {
    const book = {meta: currentBook, pages: pages}
    const bookJSON = JSON.stringify(book)
    localStorage.setItem("book", bookJSON)
    // console.log(book.pages[0].drawing)
  }

  function loadFromLocal() {
    const bookJSON = localStorage.getItem("book")
    if (bookJSON != null) {
      const book = JSON.parse(bookJSON)
      setCurrentBook(book.meta)
      setPages(book.pages)
    }
  }

  useEffect(() => {
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
    
    console.log("Fetching Book");
    fetchBook();
    // loadFromLocal()
  }, []);

  function updatePage(page:IPage, index:number) {
    const updatedPages = [...pages];
    updatedPages[index] = page;
    setPages(updatedPages);
    saveToLocal()
  }

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
    newPage.prompt = prompt;
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
      drawing: "",
      drawJSON: "",
      useDrawing: false,
      position: pos,
    }
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
  }

  return (
    <SiteContext.Provider
      value={{ cursor, pages, currentPage, currentBook, focusView, setFocusView, setCurrentPage, postPrompt, addPage, updatePage }}
    >
      {children}
    </SiteContext.Provider>
  );
}
