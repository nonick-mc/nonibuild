'use client';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant='outline' size='icon' aria-label='テーマを切り替え' />}
      >
        {/* SSRとの不一致を避けるため、表示の切り替えはCSSで行う */}
        <SunIcon className='dark:hidden' />
        <MoonIcon className='hidden dark:block' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value='light'>
            <SunIcon />
            ライト
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='dark'>
            <MoonIcon />
            ダーク
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value='system'>
            <MonitorIcon />
            システム
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
