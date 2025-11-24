'use client';

import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6  ">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search employees, documents..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-zinc-100 ">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-600"></span>
        </button>

        <button className="flex items-center gap-2 rounded-full p-2 hover:bg-zinc-100 ">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 ">
            <User className="h-4 w-4" />
          </div>
        </button>
      </div>
    </header>
  );
}

