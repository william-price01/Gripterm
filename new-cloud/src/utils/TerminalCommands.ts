import { Terminal } from "xterm";

export interface Command {
  name: string;
  description: string;
  execute: (terminal: Terminal, ...args: string[]) => void;
}

const commands: Command[] = [
  {
    name: "help",
    description: "Show available commands",
    execute: (terminal: Terminal) => {
      const helpText = commands
        .map((cmd) => `${cmd.name}: ${cmd.description}`)
        .join("\n");
      terminal.writeln("Available commands:");
      terminal.writeln(helpText);
    },
  },
  {
    name: "clear",
    description: "Clear the terminal screen",
    execute: (terminal: Terminal) => {
      terminal.clear();
    },
  },
];

export default commands;
