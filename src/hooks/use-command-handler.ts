'use client';
import { useState } from 'react';
import { fileSystem, getPath } from '@/lib/file-system';

type CommandOutput = string;

const HELP_TEXT = `
ArchSim v1.0.0 - Available commands:

  \x1b[38;2;138;173;244mhelp\x1b[0m          - Show this help message
  \x1b[38;2;138;173;244mls [path]\x1b[0m     - List directory contents
  \x1b[38;2;138;173_244mcd <dir>\x1b[0m      - Change directory
  \x1b[38;2;138;173;244mcat <file>\x1b[0m    - Display file content
  \x1b[38;2;138;173;244mfastfetch\x1b[0m   - Display system information
  \x1b[38;2;138;173;244mpwd\x1b[0m           - Print name of current/working directory
  \x1b[38;2;138;173;244mwhoami\x1b[0m        - Print effective user id
  \x1b[38;2;138;173;244mclear\x1b[0m         - Clear the terminal screen
  
Try '\x1b[38;2;169;222;157mls projects\x1b[0m' or '\x1b[38;2;169;222;157mcat about.txt\x1b[0m' to get started.
`;


export const useCommandHandler = () => {
  const [cwd, setCwd] = useState<string[]>([]);

  const formatFastFetch = () => {
    const archLogo = [
        "\x1b[38;2;129;161;193m                   -`",
        "\x1b[38;2;129;161;193m                  .o+`",
        "\x1b[38;2;129;161;193m                 `ooo/",
        "\x1b[38;2;129;161;193m                `+oooo:",
        "\x1b[38;2;129;161;193m               `+oooooo:",
        "\x1b[38;2;129;161;193m               -+oooooo+:",
        "\x1b[38;2;129;161;193m             `/:-:++oooo+.",
        "\x1b[38;2;129;161;193m            `/++++/+++++++:",
        "\x1b[38;2;129;161;193m           `/++++++++++++++:",
        "\x1b[38;2;129;161;193m          `/+++o\x1b[38;2;94;129;172m+++++++++++++:",
        "\x1b[38;2;94;129;172m         `      \x1b[38;2;129;161;193m/+++o\x1b[38;2;94;129;172m++++++++++++:",
        "\x1b[38;2;94;129;172m        \x1b[38;2;129;161;193m.+++\`   \x1b[38;2;94;129;172m`\`/+++++++++++++/",
        "\x1b[38;2;94;129;172m       \x1b[38;2;129;161;193m/+++/      \x1b[38;2;94;129;172m.+++++++++++++/",
        "\x1b[38;2;94;129;172m      /+++/         \x1b[38;2;94;129;172m.++++++:+++++/",
        "\x1b[38;2;94;129;172m     /+++/             \x1b[38;2;94;129;172m`     `-.`",
        "\x1b[38;2;94;129;172m    /+++/",
        "\x1b[38;2;94;129;172m   `---`",
    ];

    const systemInfo = [
        `\x1b[1;38;2;129;161;193mdeadbeef\x1b[0m@\x1b[1;38;2;129;161;193marchlinux\x1b[0m`,
        `------------------`,
        `\x1b[1;38;2;129;161;193mOS\x1b[0m: Arch Linux x86_64`,
        `\x1b[1;38;2;129;161;193mHost\x1b[0m: XPS 13 9340`,
        `\x1b[1;38;2;129;161;193mKernel\x1b[0m: 6.9.10-arch1-1`,
        `\x1b[1;38;2;129;161;193mUptime\x1b[0m: 16 days, 15 hours, 4 mins`,
        `\x1b[1;38;2;129;161;193mPackages\x1b[0m: 876 (pacman)`,
        `\x1b[1;38;2;129;161;193mShell\x1b[0m: zsh 5.9`,
        `\x1b[1;38;2;129;161;193mDisplay\x1b[0m: 1920x1200 @ 60Hz`,
        `\x1b[1;38;2;129;161;193mWM\x1b[0m: Hyprland`,
        `\x1b[1;38;2;129;161;193mTerminal\x1b[0m: kitty`,
        `\x1b[1;38;2;129;161;193mCPU\x1b[0m: Intel Ultra 7 155H`,
        `\x1b[1;38;2;129;161;193mGPU\x1b[0m: Intel Arc Graphics`,
        `\x1b[1;38;2;129;161;193mMemory\x1b[0m: 27.64GiB / 62.43GiB`,
    ];
    
    const colorBlocks = "  \x1b[48;2;59;66;82m   \x1b[48;2;191;97;106m   \x1b[48;2;163;190;140m   \x1b[48;2;235;203;139m   \x1b[48;2;129;161;193m   \x1b[48;2;180;142;173m   \x1b[48;2;136;192;208m   \x1b[48;2;229;233;240m   \x1b[0m";


    const maxLines = Math.max(archLogo.length, systemInfo.length);
    let output = '';

    for (let i = 0; i < maxLines; i++) {
        const logoLine = archLogo[i] || '';
        const infoLine = systemInfo[i] || '';
        output += `${logoLine.padEnd(35, ' ')} ${infoLine}\n`;
    }
    output += `\n${''.padEnd(35, ' ')} ${colorBlocks}\n`;
    return `\n${output}\n`;
  };

  const execute = (commandStr: string): CommandOutput => {
    const [command, ...args] = commandStr.trim().split(' ').filter(s => s);

    switch (command) {
      case undefined: // Empty command
        return '';

      case 'help':
        return HELP_TEXT;

      case 'clear':
        return ''; // Special case handled by terminal component

      case 'fastfetch':
      case 'neofetch':
        return formatFastFetch();

      case 'whoami':
        return 'deadbeef';
      
      case 'pwd':
        return `/${cwd.join('/')}`;

      case 'ls': {
        const targetPathStr = args[0] || '.';
        let targetPath: string[];

        if (targetPathStr.startsWith('/')) {
            targetPath = targetPathStr.split('/').filter(p => p);
        } else {
            const tempPath = [...cwd];
            targetPathStr.split('/').forEach(part => {
                if (part === '..') {
                    if (tempPath.length > 0) tempPath.pop();
                } else if (part !== '.') {
                    tempPath.push(part);
                }
            });
            targetPath = tempPath;
        }

        const node = getPath(targetPath, fileSystem);
        if (node && node.type === 'directory') {
          return Object.keys(node.children)
            .map(key => {
              const child = node.children[key];
              return child.type === 'directory'
                ? `\x1b[1;34m${key}/\x1b[0m`
                : key;
            })
            .join('  ');
        }
        return `ls: cannot access '${args[0] || '.'}': No such file or directory`;
      }

      case 'cd': {
        const newPathStr = args[0] || '~';

        if (newPathStr === '~' || newPathStr === '~/') {
            setCwd([]);
            return '';
        }

        let newPath: string[];
        if (newPathStr.startsWith('/')) {
            newPath = newPathStr.split('/').filter(p => p);
        } else {
            newPath = [...cwd];
            newPathStr.split('/').forEach(part => {
                if (part === '..') {
                    if (newPath.length > 0) newPath.pop();
                } else if (part !== '.') {
                    newPath.push(part);
                }
            });
        }
        
        const node = getPath(newPath, fileSystem);

        if (node && node.type === 'directory') {
          setCwd(newPath);
          return '';
        }
        return `cd: no such file or directory: ${newPathStr}`;
      }

      case 'cat': {
        const filePathStr = args[0];
        if (!filePathStr) return 'cat: missing operand';

        let targetPath : string[];
        if (filePathStr.startsWith('/')) {
            targetPath = filePathStr.split('/').filter(p=>p);
        } else {
            targetPath = [...cwd, ...filePathStr.split('/')];
        }
        
        const node = getPath(targetPath, fileSystem);
        if (node && node.type === 'file') {
          return node.content;
        }
        return `cat: ${filePathStr}: No such file or directory`;
      }

      default:
        return `zsh: command not found: ${command}`;
    }
  };

  const getPrompt = () => {
    return `\x1b[38;2;138;173;244m~\x1b[0m `;
  };

  return { execute, getPrompt };
};
