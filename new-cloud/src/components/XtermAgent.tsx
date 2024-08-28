import React, { useRef, useEffect, useCallback } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useResponse } from "../contexts/ResponseContext";
import commands from "../utils/TerminalCommands";
interface XTermAgentTerminalProps {
  style?: React.CSSProperties;
}
const COLORS = {
  RESET: "\x1b[0m",
  BRIGHT: "\x1b[1m",
  DIM: "\x1b[2m",
  UNDERSCORE: "\x1b[4m",
  BLINK: "\x1b[5m",
  REVERSE: "\x1b[7m",
  HIDDEN: "\x1b[8m",
  FG_BLACK: "\x1b[30m",
  FG_RED: "\x1b[31m",
  FG_GREEN: "\x1b[32m",
  FG_YELLOW: "\x1b[33m",
  FG_BLUE: "\x1b[34m",
  FG_MAGENTA: "\x1b[35m",
  FG_CYAN: "\x1b[36m",
  FG_WHITE: "\x1b[37m",
};
const XTermAgentTerminal: React.FC<XTermAgentTerminalProps> = ({ style }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const inputBufferRef = useRef<string>("");
  const { setResponse } = useResponse();

  const formatValue = (key: string, value: any): string => {
    const coloredKey = `${COLORS.FG_CYAN}${key}${COLORS.RESET}`;

    if (typeof value === "string") {
      return `${coloredKey}: ${COLORS.FG_GREEN}"${value}"${COLORS.RESET}`;
    } else if (typeof value === "number") {
      return `${coloredKey}: ${COLORS.FG_YELLOW}${value}${COLORS.RESET}`;
    } else if (typeof value === "boolean") {
      return `${coloredKey}: ${value ? COLORS.FG_GREEN : COLORS.FG_RED}${value}${COLORS.RESET}`;
    } else if (value === null) {
      return `${coloredKey}: ${COLORS.DIM}null${COLORS.RESET}`;
    } else {
      return `${coloredKey}: ${value}`;
    }
  };

  const writeFormattedResponse = (responseString: string) => {
    try {
      const { identifier, response } = JSON.parse(responseString);
      const parsedResponse = JSON.parse(response);

      terminalInstance.current?.writeln(
        `\n${COLORS.BRIGHT}${COLORS.FG_BLUE}Identifier: ${identifier}${COLORS.RESET}\n`,
      );
      terminalInstance.current?.writeln(
        `${COLORS.UNDERSCORE}Response:${COLORS.RESET}`,
      );

      const formatObject = (obj: any) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === "object" && item !== null) {
                formatObject(item);
              } else {
                terminalInstance.current?.writeln(
                  formatValue(`${key}[${index}]`, item),
                );
              }
            });
          } else if (typeof value === "object" && value !== null) {
            formatObject(value);
          } else {
            terminalInstance.current?.writeln(formatValue(key, value));
          }
        });
      };

      formatObject(parsedResponse);

      terminalInstance.current?.writeln("");
    } catch (error) {
      console.error("Error parsing or writing response:", error);
      terminalInstance.current?.writeln(
        `${COLORS.FG_RED}Error processing response: ${responseString}${COLORS.RESET}`,
      );
    }
  };
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket("ws://localhost:8765");
    ws.onopen = () => {
      terminalInstance.current?.writeln(
        "Connected to the Griptape Cloud Agent.",
      );
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setResponse(response);
      if (response) {
        writeFormattedResponse(event.data);
      }
    };
    ws.onclose = () => {
      terminalInstance.current?.writeln(
        "Disconnected from the Griptape Cloud Agent. Attempting to reconnect...",
      );
      setTimeout(connectWebSocket, 3000);
    };
    socketRef.current = ws;
  }, [setResponse]);
  const executeCommand = (input: string) => {
    const [commandName, ...args] = input.split(" ");
    const command = commands.find((cmd) => cmd.name === commandName);

    if (command && terminalInstance.current) {
      command.execute(terminalInstance.current, ...args);
    } else {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify({ query: input }));
      } else {
        terminalInstance.current?.writeln(
          "Not connected to the agent. Please wait for reconnection.",
        );
      }
    }
  };
  useEffect(() => {
    if (terminalRef.current) {
      terminalInstance.current = new Terminal({
        cursorBlink: true,
        theme: {
          background: "#293742",
          foreground: "#f5f8fa",
          cursor: "#f5f8fa",
          selection: "rgba(255, 255, 255, 0.3)",
          black: "#293742",
          red: "#ff7373",
          green: "#52bd95",
          yellow: "#ffd180",
          blue: "#66b0ff",
          magenta: "#c678dd",
          cyan: "#56b6c2",
          white: "#d0d0d0",
          brightBlack: "#394b59",
          brightRed: "#ff7373",
          brightGreen: "#52bd95",
          brightYellow: "#ffd180",
          brightBlue: "#66b0ff",
          brightMagenta: "#c678dd",
          brightCyan: "#56b6c2",
          brightWhite: "#ffffff",
        },
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        lineHeight: 1.2,
        rendererType: "canvas",
      });

      const fitAddon = new FitAddon();
      terminalInstance.current.loadAddon(fitAddon);
      terminalInstance.current.open(terminalRef.current);
      fitAddon.fit();

      terminalInstance.current.writeln(
        "Welcome to the Griptape Cloud Agent Terminal!",
      );
      terminalInstance.current.writeln(
        "Type 'help' for a list of available commands or query the database directly.",
      );

      terminalInstance.current.onKey(({ key, domEvent }) => {
        const printable =
          !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) {
          // Enter key
          terminalInstance.current?.writeln("");
          executeCommand(inputBufferRef.current.trim());
          terminalInstance.current?.write("$ ");
          inputBufferRef.current = "";
        } else if (domEvent.keyCode === 8) {
          // Backspace
          if (inputBufferRef.current.length > 0) {
            inputBufferRef.current = inputBufferRef.current.slice(0, -1);
            terminalInstance.current?.write("\b \b");
          }
        } else if (printable) {
          inputBufferRef.current += key;
          terminalInstance.current?.write(key);
        }
      });

      connectWebSocket();
    }

    return () => {
      terminalInstance.current?.dispose();
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  return (
    <div
      ref={terminalRef}
      style={{ ...style, width: "100%", height: "100%" }}
    />
  );
};

export default XTermAgentTerminal;
