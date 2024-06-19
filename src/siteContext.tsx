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
    title: "Book Title",
    desc: "No description",
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
  awaiting: false,
  awaitMsg: "Waiting",
  setFocusView: (bool: boolean) => {
    console.log(bool);
  },
  setCurrentPage: (num: number) => {
    console.log("setCurrentPage ", num);
  },
  addPage: () => {
    console.log("addPage ");
  },
  deletePage: (index: number) => {
    console.log(`Delete page: ${index}`);
  },
  updateBook: (book: IBook) => {
    console.log("updateBook", book);
  },
  updatePage: (page: IPage, index: number) => {
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
    title: "Story Title",
    desc: "No description",
    pages: 0,
  });
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
  const [awaiting, setAwaiting] = useState(false);
  const [awaitMsg, setAwaitMsg] = useState("Please Wait");
  //Cursor
  const [cursor, setCursor] = useState({
    currCursorX: 0,
    currCursorY: 0,
    prevCursorX: 0,
    prevCursorY: 0,
    mouseDown: false,
  });

  function saveToLocal(currbook: IBook, pages: IPage[]) {
    console.log("saving local");
    const book = { meta: currbook, pages: pages };
    const bookJSON = JSON.stringify(book);
    localStorage.setItem("book", bookJSON);
    // console.log(bookJSON)
  }

  function loadFromLocal() {
    const bookJSON = localStorage.getItem("book");
    if (bookJSON != null || bookJSON == "{}") {
      console.log("loading local save");
      const savedBook = JSON.parse(bookJSON);
      setCurrentBook(savedBook.meta);
      console.log(savedBook)
      setPages(savedBook.pages);
    }
  }

  useEffect(() => {
    async function fetchBook(local: boolean) {
      if (local) {
        loadFromLocal();
        return;
      }
      console.log("Fetching Book");
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

    fetchBook(true);
  }, []);

  function updateBook(book: IBook) {
    setCurrentBook(book);
    saveToLocal(book, pages);
  }

  function updatePage(page: IPage, index: number) {
    const updatedPages = [...pages];
    updatedPages[index] = page;
    console.log("test up");
    console.log(pages);
    setPages(updatedPages);
    console.log(pages);
    // console.log(updatedPages)
    saveToLocal(currentBook, updatedPages);
  }

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function postPrompt(prompt: string) {
    if (prompt.length < 3) {
      setAwaiting(true);
      console.log("Prompt too short");
      setAwaitMsg("Prompt too short");
      await delay(1000); // Wait for 1 second
      setAwaiting(false);
      return;
    }
    console.log(prompt);
    setAwaiting(true);
    setAwaitMsg("Generating image");
    try {
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
        setAwaitMsg("Failed to create image \n Check connection");
        await delay(1000); // Wait for 1 second
        setAwaiting(false);
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
      saveToLocal(currentBook, updatedPages);
      setAwaiting(false);
      
    } catch (error) {
      console.error("Failed to connect to server");
      setAwaitMsg("Failed to connect to server \n Check connection");
      await delay(1000); // Wait for 1 second
      setAwaiting(false);
      return;
    }
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
    const pos = currentPage + 1;
    const newPage = {
      name: "Empty Page",
      prompt: "",
      image: "",
      drawing: "",
      drawJSON: "",
      useDrawing: false,
      position: pos,
    };
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    saveToLocal(currentBook, updatedPages);
  };

  function deletePage(index: number) {
    const updatedPages = [...pages];
    if (index >= 0 && index < updatedPages.length) {
      updatedPages.splice(index, 1);

      // Check if the deleted page was the last one
      if (updatedPages.length === 0) {
        console.log("reset");
        const newPos = currentPage + 1;
        const newPage = {
          name: "Empty Page",
          prompt: "",
          image: "",
          drawing: "",
          drawJSON: "",
          useDrawing: false,
          position: newPos,
        };
        updatedPages.push(newPage);
        setCurrentPage(0);
      } else if (index == 0) {
        console.log("delete first")
        setCurrentPage(0);
      } else {
        console.log("delete mid")
        setCurrentPage(currentPage - 1);
      }

      console.log("delete page", currentPage);

      setPages(updatedPages);
      saveToLocal(currentBook, updatedPages);
    }
  }
  return (
    <SiteContext.Provider
      value={{
        cursor,
        pages,
        currentPage,
        currentBook,
        focusView,
        awaiting,
        awaitMsg,
        updateBook,
        setFocusView,
        setCurrentPage,
        postPrompt,
        addPage,
        deletePage,
        updatePage,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}
