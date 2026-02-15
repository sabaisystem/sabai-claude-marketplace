/**
 * Sudoku MCP App - Interactive Sudoku game in Claude
 */
import type { McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import styles from "./mcp-app.module.css";

// Sabai System Logo Icon
function SabaiLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sabaiGradient" x1="125" y1="2" x2="125" y2="248" gradientUnits="userSpaceOnUse">
          <stop offset=".458" stopColor="#F26A2C"/>
          <stop offset=".77" stopColor="#E95A19"/>
          <stop offset="1" stopColor="#E55310"/>
        </linearGradient>
      </defs>
      <circle cx="125" cy="125" r="124" fill="url(#sabaiGradient)"/>
      <path fill="#fff" d="M213.7 162l-9.5-31.7c-.1-.3-.2-.7-.4-1-1.6-3.2-5.5-4.6-8.8-3L165.3 141c-4.7 2.4-1.9 9.4 3.2 8l16-4.8c-.3.5-.6 1-.8 1.6C173.1 178 136.5 198 104 186.4c-10.6-3.6-20.2-10.2-28.3-18.4-2-2.1-5.3-2.2-7.5-.3-2.2 2-2.4 5.4-.4 7.6 4.4 4.8 9.2 9.2 14.6 13.1 41.2 30.2 98.7 9.9 116.4-36.9 3.5 7 6.8 13.7 6.8 13.7C208.1 169.8 215.1 167.1 213.7 162z"/>
    </svg>
  );
}

interface GameState {
  game_id: string;
  difficulty: string;
  puzzle: number[][];
  current: number[][];
  remaining_cells: number;
  moves: number;
  complete: boolean;
  elapsed_seconds: number;
}

type Notes = Map<string, Set<number>>;

interface MoveResult {
  game_id: string;
  row: number;
  col: number;
  value: number;
  correct: boolean;
  current: number[][];
  remaining_cells: number;
  moves: number;
  complete: boolean;
}

interface HintResult {
  row: number;
  col: number;
  technique: string;
  explanation: string;
  candidates: number[];
  value?: number;
  message?: string;
}


function extractResult<T>(result: CallToolResult): T | null {
  // Find the first text content that parses as valid JSON
  const textContents = result.content?.filter((c) => c.type === "text") || [];
  for (const content of textContents) {
    if ("text" in content) {
      try {
        return JSON.parse(content.text) as T;
      } catch {
        // Not valid JSON, try next content
      }
    }
  }
  return null;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Confetti animation component
function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f26a2c', '#e55310', '#013b2d', '#fef2ec', '#fbbf24', '#34d399'];
    const confettiCount = 150;
    const confetti: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
      });
    }

    let animationId: number;
    let startTime = Date.now();
    const duration = 4000;

    function animate() {
      if (!ctx || !canvas) return;

      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach(c => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();

        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.1;
        c.rotation += c.rotationSpeed;

        if (c.y > canvas.height) {
          c.y = -10;
          c.x = Math.random() * canvas.width;
          c.vy = Math.random() * 3 + 2;
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  );
}

function SudokuApp() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();
  const [message, setMessage] = useState<string>("");
  const [notes, setNotes] = useState<Notes>(new Map());
  const [notesMode, setNotesMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hint, setHint] = useState<{ row: number; col: number } | null>(null);

  const { app, error } = useApp({
    appInfo: { name: "Sabai Sudoku", version: "1.0.1" },
    capabilities: {},
    onAppCreated: (app) => {
      app.onteardown = async () => ({ });

      app.ontoolinput = async (input) => {
        console.info("Tool input:", input);
      };

      app.ontoolresult = async (result) => {
        console.info("Tool result:", result);
        const data = extractResult<GameState>(result);
        if (data && data.game_id && data.puzzle) {
          setGameState(data);
          setErrors(new Set());
          if (data.complete) {
            setMessage("Congratulations! Puzzle completed!");
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4500);
          }
        }
      };

      app.ontoolcancelled = () => {
        console.info("Tool cancelled");
      };

      app.onerror = console.error;

      app.onhostcontextchanged = (params) => {
        setHostContext((prev) => ({ ...prev, ...params }));
      };
    },
  });

  useHostStyles(app);

  useEffect(() => {
    if (app) {
      setHostContext(app.getHostContext());
    }
  }, [app]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning && !gameState?.complete) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, gameState?.complete]);

  // Count how many of each number are placed
  const numberCounts = useCallback(() => {
    if (!gameState) return new Map<number, number>();
    const counts = new Map<number, number>();
    for (let i = 1; i <= 9; i++) counts.set(i, 0);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = gameState.current[r][c];
        if (val > 0) counts.set(val, (counts.get(val) || 0) + 1);
      }
    }
    return counts;
  }, [gameState]);

  // Handle number input
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!gameState) return;
    // Can only select empty cells (cells not in original puzzle)
    if (gameState.puzzle[row][col] !== 0) return;
    setSelectedCell([row, col]);
    setHint(null); // Clear hint when selecting a cell
  }, [gameState]);

  const handleNumberInput = useCallback(async (num: number) => {
    if (!app || !gameState || !selectedCell) return;

    const [row, col] = selectedCell;
    const cellKey = `${row}-${col}`;

    // Notes mode: toggle note instead of placing number
    if (notesMode && num !== 0) {
      setNotes(prev => {
        const next = new Map(prev);
        const cellNotes = new Set(prev.get(cellKey) || []);
        if (cellNotes.has(num)) {
          cellNotes.delete(num);
        } else {
          cellNotes.add(num);
        }
        if (cellNotes.size === 0) {
          next.delete(cellKey);
        } else {
          next.set(cellKey, cellNotes);
        }
        return next;
      });
      return;
    }

    // Clear notes when placing a number
    if (num !== 0) {
      setNotes(prev => {
        const next = new Map(prev);
        next.delete(cellKey);
        return next;
      });
    }

    try {
      const result = await app.callServerTool({
        name: "sudoku_move",
        arguments: {
          game_id: gameState.game_id,
          row,
          col,
          value: num
        }
      });

      const moveResult = extractResult<MoveResult>(result);
      if (!moveResult) return;

      setGameState(prev => prev ? {
        ...prev,
        current: moveResult.current,
        remaining_cells: moveResult.remaining_cells,
        moves: moveResult.moves,
        complete: moveResult.complete
      } : null);

      // Track errors
      if (!moveResult.correct && num !== 0) {
        setErrors(prev => new Set(prev).add(`${row}-${col}`));
      } else {
        setErrors(prev => {
          const next = new Set(prev);
          next.delete(`${row}-${col}`);
          return next;
        });
      }

      if (moveResult.complete) {
        setMessage("Congratulations! Puzzle completed!");
        setSelectedCell(null);
        setTimerRunning(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4500);
      }
    } catch (e) {
      console.error("Move failed:", e);
    }
  }, [app, gameState, selectedCell, notesMode]);

  const handleGetHint = useCallback(async (revealNumber = false) => {
    if (!app || !gameState) return;

    try {
      const result = await app.callServerTool({
        name: "sudoku_hint",
        arguments: {
          game_id: gameState.game_id,
          reveal_number: revealNumber
        }
      });

      const hintResult = extractResult<HintResult>(result);
      if (!hintResult) return;

      if (hintResult.message) {
        setMessage(hintResult.message);
        return;
      }

      // Highlight the cell
      setHint({ row: hintResult.row, col: hintResult.col });

      // Build message
      let msg = `${hintResult.technique}: Row ${hintResult.row + 1}, Column ${hintResult.col + 1}`;
      if (revealNumber && hintResult.value) {
        msg += ` → ${hintResult.value}`;
      }
      setMessage(msg);

      // Send explanation to Claude for a nice response
      await app.sendMessage({
        role: "user",
        content: [{
          type: "text",
          text: revealNumber
            ? `Explain this Sudoku hint briefly: ${hintResult.explanation} The answer is ${hintResult.value}.`
            : `Explain this Sudoku hint briefly (don't reveal the number): ${hintResult.explanation}`
        }]
      });
    } catch (e) {
      console.error("Hint failed:", e);
    }
  }, [app, gameState]);

  const handleShowRules = useCallback(async () => {
    if (!app) return;
    await app.sendMessage({
      role: "user",
      content: [{ type: "text", text: "Please explain the rules of Sudoku briefly." }]
    });
  }, [app]);

  const handleNewGame = useCallback(async (difficulty: string) => {
    if (!app) return;

    setMessage("");
    setSelectedCell(null);
    setErrors(new Set());
    setHint(null);
    setNotes(new Map());
    setNotesMode(false);
    setTimer(0);

    try {
      const result = await app.callServerTool({
        name: "play_sudoku",
        arguments: { difficulty }
      });

      const data = extractResult<GameState>(result);
      if (data) {
        setGameState(data);
        setTimerRunning(true);
      }
    } catch (e) {
      console.error("New game failed:", e);
    }
  }, [app]);

  // Keyboard input and arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number input (works only when a cell is selected)
      if (selectedCell) {
        if (e.key >= "1" && e.key <= "9") {
          e.preventDefault();
          handleNumberInput(parseInt(e.key, 10));
          return;
        } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
          e.preventDefault();
          handleNumberInput(0);
          return;
        } else if (e.key === "Escape") {
          setSelectedCell(null);
          return;
        } else if (e.key === "n" || e.key === "N") {
          setNotesMode(prev => !prev);
          return;
        }
      }

      // Arrow key navigation
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        setSelectedCell(prev => {
          const [row, col] = prev || [4, 4]; // Start from center if no cell selected
          let newRow = row;
          let newCol = col;

          switch (e.key) {
            case "ArrowUp": newRow = Math.max(0, row - 1); break;
            case "ArrowDown": newRow = Math.min(8, row + 1); break;
            case "ArrowLeft": newCol = Math.max(0, col - 1); break;
            case "ArrowRight": newCol = Math.min(8, col + 1); break;
          }

          return [newRow, newCol];
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, handleNumberInput]);

  if (error) return <div className={styles.error}>Error: {error.message}</div>;
  if (!app) return <div className={styles.loading}>Connecting...</div>;

  return (
    <>
    <Confetti active={showConfetti} />
    <main
      className={styles.main}
      style={{
        paddingTop: hostContext?.safeAreaInsets?.top,
        paddingRight: hostContext?.safeAreaInsets?.right,
        paddingBottom: hostContext?.safeAreaInsets?.bottom,
        paddingLeft: hostContext?.safeAreaInsets?.left,
      }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Sabai Sudoku</h1>
      </div>

      {!gameState ? (
        <div className={styles.newGamePanel}>
          <p>Select difficulty to start:</p>
          <div className={styles.difficultyButtons}>
            {["easy", "medium", "hard", "expert"].map(diff => (
              <button key={diff} onClick={() => handleNewGame(diff)} className={styles.diffButton}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.info}>
            <span>{gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1)}</span>
            <span className={styles.timer}>{formatTime(timer)}</span>
          </div>

          <div className={styles.gameArea}>
            <div className={styles.board}>
              {gameState.current.map((row, rowIdx) => (
                <div key={rowIdx} className={styles.row}>
                  {row.map((cell, colIdx) => {
                    const isOriginal = gameState.puzzle[rowIdx][colIdx] !== 0;
                    const isSelected = selectedCell?.[0] === rowIdx && selectedCell?.[1] === colIdx;
                    const isError = errors.has(`${rowIdx}-${colIdx}`);
                    const isHint = hint?.row === rowIdx && hint?.col === colIdx;
                    const cellNotes = notes.get(`${rowIdx}-${colIdx}`);

                    const boxRow = Math.floor(rowIdx / 3);
                    const boxCol = Math.floor(colIdx / 3);
                    const isEvenBox = (boxRow + boxCol) % 2 === 0;

                    return (
                      <button
                        key={colIdx}
                        className={`${styles.cell}
                          ${isOriginal ? styles.original : styles.editable}
                          ${isSelected ? styles.selected : ""}
                          ${isError ? styles.error : ""}
                          ${isHint ? styles.hint : ""}
                          ${isEvenBox ? styles.evenBox : ""}
                          ${colIdx % 3 === 2 && colIdx !== 8 ? styles.rightBorder : ""}
                          ${rowIdx % 3 === 2 && rowIdx !== 8 ? styles.bottomBorder : ""}
                        `}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                      >
                        {cell !== 0 ? (
                          cell
                        ) : cellNotes && cellNotes.size > 0 ? (
                          <span className={styles.notes}>
                            {[1,2,3,4,5,6,7,8,9].map(n => (
                              <span key={n} className={cellNotes.has(n) ? styles.noteVisible : styles.noteHidden}>
                                {n}
                              </span>
                            ))}
                          </span>
                        ) : ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className={styles.sidePanel}>
              <div className={styles.numberPad}>
                {[[1,2,3],[4,5,6],[7,8,9]].map((row, rowIdx) => (
                  <div key={rowIdx} className={styles.numRow}>
                    {row.map(num => {
                      const count = numberCounts().get(num) || 0;
                      const isComplete = count >= 9;
                      return (
                        <button
                          key={num}
                          className={`${styles.numButton} ${isComplete ? styles.numComplete : ""}`}
                          onClick={() => handleNumberInput(num)}
                          disabled={!selectedCell || isComplete}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <button
                className={`${styles.actionButton} ${styles.notesButton} ${notesMode ? styles.notesActive : ""}`}
                onClick={() => setNotesMode(prev => !prev)}
              >
                Notes {notesMode ? "ON" : "OFF"}
              </button>

              <button
                className={`${styles.actionButton} ${styles.clearCellButton}`}
                onClick={() => handleNumberInput(0)}
                disabled={!selectedCell}
              >
                Clear
              </button>

              <button onClick={() => handleGetHint(false)} className={`${styles.actionButton} ${styles.sidePanelButton}`}>
                Hint
              </button>
              {hint && (
                <button onClick={() => handleGetHint(true)} className={`${styles.actionButton} ${styles.sidePanelButton} ${styles.revealButton}`}>
                  Reveal
                </button>
              )}
              <button
                onClick={() => {
                  if (window.confirm("Start a new game? Current progress will be lost.")) {
                    setGameState(null);
                    setTimerRunning(false);
                    setHint(null);
                  }
                }}
                className={`${styles.actionButton} ${styles.sidePanelButton}`}
              >
                New Game
              </button>
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={handleShowRules} className={styles.actionButton}>
              Rules
            </button>
          </div>

          {message && <p className={styles.message}>{message}</p>}
        </>
      )}

      <footer className={styles.footer}>
        <a href="https://sabaisystem.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          <SabaiLogo className={styles.footerLogo} />
          <span>Sabai System</span>
        </a>
      </footer>
    </main>
    </>
  );
}

// Global error handler to prevent crashes
window.onerror = (msg, _url, _line, _col, error) => {
  console.error("Global error:", msg, error);
  return true; // Prevent default handling
};

window.onunhandledrejection = (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SudokuApp />
  </StrictMode>,
);
