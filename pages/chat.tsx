import { Answer } from "@/components/Answer/Answer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PGChunk } from "@/types";
import {
  IconArrowRight,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";
import endent from "endent";
import Head from "next/head";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { MutableRefObject } from "react";
import { Message } from "@/types/chat";
import { Send } from "tabler-icons-react";
import MarkdownRenderer from "../components/MarkdownRenderer";

interface Props {
  onSend: (message: Message, plugin: Plugin | null) => void;
  onRegenerate: () => void;
  onScrollDownClick: () => void;
  stopConversationRef: MutableRefObject<boolean>;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  showScrollDownButton: boolean;
}

export default function Chat() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<PGChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [mode, setMode] = useState<"search" | "chat">("chat");
  const [matchCount, setMatchCount] = useState<number>(5);
  const [apiKey, setApiKey] = useState<string>(
    "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"
  );

  // const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const value = e.target.value;
  //   setAnswer(value);
  // };

  const handleAnswer = async () => {
    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");

    setLoading(true);
    setIsStreaming(true);

    // const prompt = endent`
    // You are a Biology teacher now, use the Markdown to format the answer of query do not have limitation on word count: "${query}"
    // `;
    const prompt = query;
    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, apiKey }),
    });

    if (!answerResponse.ok) {
      setLoading(false);
      setIsStreaming(false);
      throw new Error(answerResponse.statusText);
    }

    const data = answerResponse.body;

    if (!data) {
      return;
    }

    setLoading(false);
    setIsStreaming(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer((prev) => prev + chunkValue);
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (mode === "chat") {
        handleAnswer();
      }
    }
  };

  // useEffect(() => {
  //   if (textareaRef && textareaRef.current) {
  //     textareaRef.current.style.height = "inherit";
  //     textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
  //     textareaRef.current.style.overflow = `${
  //       textareaRef?.current?.scrollHeight > 400 ? "auto" : "hidden"
  //     }`;
  //   }
  // }, [query]);
  // `${(query.split("\n").length + 1) * 1.5}em`
  const [height, setHeight] = useState("59px");
  // useEffect(() => {
  //   setHeight(`${textareaRef.current?.scrollHeight}px`);
  // }, [query]);
  useEffect(() => {
    if (textareaRef.current !== null) {
      // Save the current scroll position to avoid jumping
      const scrollTop = window.pageYOffset;
      const scrollLeft = window.pageXOffset;

      // Temporarily set the height to 'auto' and disable transitions
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.transition = "none";

      const newHeight = textareaRef.current.scrollHeight;
      if (newHeight) {
        // Set the new height and re-enable transitions
        textareaRef.current.style.height = `${newHeight + 10}px`;
        textareaRef.current.style.transition = "";
      }

      // Restore the scroll position
      window.scrollTo(scrollLeft, scrollTop);
    }
  }, [query]);

  useEffect(() => {
    if (matchCount > 10) {
      setMatchCount(10);
    } else if (matchCount < 1) {
      setMatchCount(1);
    }
  }, [matchCount]);

  useEffect(() => {
    const PG_KEY = localStorage.getItem("PG_KEY");
    const PG_MATCH_COUNT = localStorage.getItem("PG_MATCH_COUNT");
    const PG_MODE = localStorage.getItem("PG_MODE");

    if (PG_KEY) {
      setApiKey(PG_KEY);
    }

    if (PG_MATCH_COUNT) {
      setMatchCount(parseInt(PG_MATCH_COUNT));
    }

    if (PG_MODE) {
      setMode(PG_MODE as "search" | "chat");
    }

    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Head>
        <title>Luaid</title>
        <meta
          name="description"
          content={`AI-powered search and chat for biology education.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
            {/* <button
              className="mt-4 flex cursor-pointer items-center space-x-2 rounded-full border border-zinc-600 px-3 py-1 text-sm hover:opacity-50"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "Hide" : "Show"} Settings
            </button> */}

            {showSettings && (
              <div className="w-[340px] sm:w-[400px]">
                <div>
                  <div>Mode</div>
                  <select
                    className="max-w-[400px] block w-full cursor-pointer rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    value={mode}
                    onChange={(e) =>
                      setMode(e.target.value as "search" | "chat")
                    }
                  >
                    <option value="search">Search</option>
                    <option value="chat">Chat</option>
                  </select>
                </div>

                <div className="mt-2">
                  <div>Passage Count</div>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={matchCount}
                    onChange={(e) => setMatchCount(Number(e.target.value))}
                    className="max-w-[400px] block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="mt-2">
                  <div>OpenAI API Key</div>
                  <input
                    type="password"
                    placeholder="OpenAI API Key"
                    className="max-w-[400px] block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);

                      if (e.target.value.length !== 51) {
                        setShowSettings(true);
                      }
                    }}
                  />
                </div>

                <div className="mt-4 flex space-x-2 justify-center"></div>
              </div>
            )}

            {apiKey.length === 51 ? (
              <div className="relative w-full mt-4">
                {/* <IconSearch className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" /> */}

                <textarea
                  ref={textareaRef}
                  className=" text-lg h-25 w-full rounded-md border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
                  style={{
                    resize: "none",
                    // bottom: `${textareaRef?.current?.scrollHeight}px`,
                    height: height,
                    minHeight: "min-content",
                    // display: "flex",
                    // alignItems: "center",
                    maxHeight: "200px",
                    paddingTop: "13px", // adjust these values as needed
                    paddingBottom: "10 px",
                    overflow: `${
                      textareaRef.current &&
                      textareaRef.current.scrollHeight > 400
                        ? "auto"
                        : "visible"
                    }`,
                  }}
                  placeholder={"Send a message" || ""}
                  value={query}
                  rows={1}
                  // onCompositionStart={() => setIsTyping(true)}
                  // onCompositionEnd={() => setIsTyping(false)}
                  // onChange={handleChange}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                {/* <button>
                  <Send
                    size={48}
                    strokeWidth={1}
                    onClick={handleAnswer}
                    className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white"
                  />
                </button> */}
                <button
                  className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-sky-300 p-1 hover:cursor-pointer hover:bg-sky-500 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white  flex items-center justify-center"
                  onClick={handleAnswer}
                >
                  {isStreaming ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
                  ) : (
                    <Send size={30} strokeWidth={1} />
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center font-bold text-3xl mt-7">
                Please enter your
                <a
                  className="mx-2 underline hover:opacity-50"
                  href="https://platform.openai.com/account/api-keys"
                >
                  OpenAI API key
                </a>
                in settings.
              </div>
            )}

            {loading ? (
              <div className="mt-6 w-full">
                {mode === "chat" && (
                  <>
                    <div className="font-bold text-2xl">Answer</div>
                    <div className="animate-pulse mt-2">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                      <div className="h-4 bg-gray-300 rounded mt-2"></div>
                    </div>
                  </>
                )}
              </div>
            ) : answer ? (
              <div className="mt-6">
                <div className="font-bold text-2xl mb-2">Answer</div>
                {/* <Answer text={answer} /> */}
                {/* <ReactMarkdown>{answer}</ReactMarkdown> */}
                <MarkdownRenderer content={answer} />
              </div>
            ) : chunks.length > 0 ? (
              <div className="mt-6 pb-16">
                <div className="font-bold text-2xl">Passages</div>
                {chunks.map((chunk, index) => (
                  <div key={index}>
                    <div className="mt-4 border border-zinc-600 rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-bold text-xl">
                            {chunk.essay_title}
                          </div>
                          <div className="mt-1 font-bold text-sm">
                            {chunk.essay_date}
                          </div>
                        </div>
                        <a
                          className="hover:opacity-50 ml-2"
                          href={chunk.essay_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <IconExternalLink />
                        </a>
                      </div>
                      <div className="mt-2">{chunk.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-center text-lg text-gray-300">{`Luaid chat for Biology education.`}</div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
