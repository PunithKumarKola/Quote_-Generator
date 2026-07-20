import { useEffect, useState, useCallback } from "react";
import { Quote as QuoteIcon, Copy, Share2, RefreshCw, Check } from "lucide-react";
import { quotes, type Quote } from "@/lib/quotes";
import { cn } from "@/lib/utils";

function randomIndex(exclude: number): number {
  if (quotes.length <= 1) return 0;
  let i = Math.floor(Math.random() * quotes.length);
  while (i === exclude) i = Math.floor(Math.random() * quotes.length);
  return i;
}

export function QuoteCard() {
  const [index, setIndex] = useState<number>(() => Math.floor(Math.random() * quotes.length));
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const quote: Quote = quotes[index];

  const changeQuote = useCallback(() => {
    setVisible(false);
    window.setTimeout(() => {
      setIndex((prev) => randomIndex(prev));
      setVisible(true);
    }, 250);
  }, []);

  useEffect(() => {
    // Trigger initial fade-in
    setVisible(false);
    const t = window.setTimeout(() => setVisible(true), 50);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatted = `"${quote.text}" — ${quote.author}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "A quote for you",
      text: formatted,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      const nav = typeof navigator !== "undefined" ? (navigator as Navigator) : undefined;
      if (nav && typeof nav.share === "function") {
        await nav.share(shareData);
      } else if (nav) {
        await nav.clipboard.writeText(`${formatted}\n${shareData.url}`);
        setShared(true);
        window.setTimeout(() => setShared(false), 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="relative rounded-3xl bg-card text-card-foreground shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] p-8 sm:p-12 border border-border/50">
        <QuoteIcon
          className="absolute -top-5 left-8 h-14 w-14 text-accent fill-accent/40 stroke-primary/60"
          strokeWidth={1}
          aria-hidden
        />

        <div
          className={cn(
            "transition-all duration-500 ease-out min-h-[180px] flex flex-col justify-center",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          )}
        >
          <p className="font-serif-display text-[26px] sm:text-[32px] leading-snug tracking-tight text-foreground">
            {quote.text}
          </p>
          <p className="mt-6 text-right text-sm sm:text-base text-muted-foreground">
            — {quote.author}
          </p>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={changeQuote}
            className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
            New Quote
          </button>

          <div className="flex items-center gap-1">
            <IconButton
              label={copied ? "Copied!" : "Copy quote"}
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </IconButton>
            <IconButton
              label={shared ? "Link copied!" : "Share quote"}
              onClick={handleShare}
            >
              {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  );
}
