import { SiGithub } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ThemeToggle } from './theme-toggle';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

type NavbarProps = {
  page?: string;
  children?: ReactNode;
};

export function Navbar({ page, children }: NavbarProps) {
  return (
    <header id='nd-nav' className='sticky top-0 z-40 h-14'>
      <div className='border-b bg-background/80 backdrop-blur-lg transition-colors'>
        <nav className='mx-auto flex h-14 w-full max-w-350 items-center justify-between px-6'>
          <div className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src='https://github.com/nonick-mc.png' alt="nonick's icon" />
            </Avatar>
            <p className='font-logo text-lg select-none'>
              <Link href={'/'}>nonibuild</Link>
              {page && (
                <>
                  <span className='mx-1 text-muted-foreground'>/</span>
                  <span className='text-muted-foreground'>{page}</span>
                </>
              )}
            </p>
          </div>
          <div className='flex gap-1'>
            {children}
            <Button
              render={
                <a
                  href='https://github.com/nonick-mc/nonibuild'
                  target='_blank'
                  rel='noreferrer'
                  aria-label='GitHub'
                />
              }
              variant='outline'
              size='icon'
              nativeButton={false}
            >
              <SiGithub />
            </Button>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
