"use client";
import { useState } from "react";
import { Copy, Link, Zap, Check, ExternalLink } from "lucide-react";
import { shortenUrl } from "@/lib/api";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent | React.MouseEvent) {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setIsLoading(true);
    try {
      const result = await shortenUrl(longUrl);
      setShortUrl(result.short_url);
    } catch (err) {
      console.error(err);
      alert("Error shortening URL");
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              NanoLink
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            Fast • Simple • Reliable
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Shorten URLs with
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
              NanoLink
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Transform long, complex URLs into clean, shareable links in seconds.
            Fast, reliable, and beautifully simple.
          </p>
        </div>

        {/* URL Shortener Form */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="relative">
              <div className="flex gap-3 p-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
                <div className="flex-1 relative">
                  <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="Paste your long URL here..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 text-lg focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !longUrl.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Shortening...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Shorten
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Result */}
          {shortUrl && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400 mb-2">Your shortened URL:</p>
                  <div className="flex items-center gap-3">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-mono text-lg break-all flex items-center gap-2 group"
                    >
                      {shortUrl}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 text-white" />
                      <span className="text-white text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Get your shortened URL in milliseconds with our optimized infrastructure.</p>
          </div>

          <div className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Clean Links</h3>
            <p className="text-gray-400">Beautiful, memorable URLs that are perfect for sharing anywhere.</p>
          </div>

          <div className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Copy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Easy Sharing</h3>
            <p className="text-gray-400">One-click copying makes sharing your links effortless across all platforms.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center p-8 border-t border-white/10">
        <p className="text-gray-400">
          © 2025 NanoLink All rights reserved •
          <span className="ml-2">Shorten smarter, share better</span>
        </p>
      </footer>
    </div>
  );
}