'use client';

import React, { useState, useEffect } from 'react';
import { GlossaryItem } from '@/lib/content/schema';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { Search, BookOpen, Sparkles } from 'lucide-react';

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGlossary() {
      try {
        const res = await fetch('/api/content/glossary');
        if (res.ok) {
          const data = await res.json();
          setTerms(data);
        }
      } catch (err) {
        console.error('Failed to load glossary:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGlossary();
  }, []);

  const filteredTerms = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.simple.toLowerCase().includes(search.toLowerCase()) ||
      t.example.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-indigo-600" />
            <h1 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
              Performance Ads Glossary
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Over 80 essential terms explained with everyday Indian examples.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search CPM, Funnel, Pixel..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <PixieMascot mood="thinking" size={54} className="animate-pulse" />
          <p className="text-sm font-semibold text-slate-500">Loading glossary terms...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((item) => (
            <div
              key={item.slug}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-card border border-slate-200/80 dark:border-slate-700 space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-heading font-bold text-base text-indigo-700 dark:text-indigo-300">
                  {item.term}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.simple}
                </p>
              </div>

              <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-2.5 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold">Real Example: </span>
                <span>{item.example}</span>
              </div>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="col-span-2 text-center py-12 text-slate-400">
              No matching terms found for "{search}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
