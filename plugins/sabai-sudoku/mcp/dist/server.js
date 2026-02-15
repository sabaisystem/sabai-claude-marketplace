import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
// Works both from source (server.ts) and compiled (dist/server.js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
    ? path.join(import.meta.dirname, "dist")
    : import.meta.dirname;
// In-memory game storage
const games = new Map();
function generateId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
// Check if a number can be placed at position
function isValid(board, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num)
            return false;
    }
    // Check column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num)
            return false;
    }
    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num)
                return false;
        }
    }
    return true;
}
// Solve the sudoku using backtracking
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                // Shuffle numbers for randomization
                const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                shuffleArray(numbers);
                for (const num of numbers) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board))
                            return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// Generate a complete solved board
function generateSolvedBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(board);
    return board;
}
// Create puzzle by removing numbers
function createPuzzle(solution, difficulty) {
    const puzzle = solution.map(row => [...row]);
    // Number of cells to remove based on difficulty
    const removeCount = {
        easy: 35,
        medium: 45,
        hard: 52,
        expert: 58
    };
    const count = removeCount[difficulty];
    const positions = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            positions.push([i, j]);
        }
    }
    shuffleArray(positions);
    for (let i = 0; i < count && i < positions.length; i++) {
        const [row, col] = positions[i];
        puzzle[row][col] = 0;
    }
    return puzzle;
}
// Check if the current board is complete and correct
function checkComplete(current, solution) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (current[i][j] !== solution[i][j])
                return false;
        }
    }
    return true;
}
// Count empty cells
function countEmpty(board) {
    let count = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0)
                count++;
        }
    }
    return count;
}
// Get all candidates for a cell
function getCandidates(board, row, col) {
    if (board[row][col] !== 0)
        return [];
    const candidates = [];
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            candidates.push(num);
        }
    }
    return candidates;
}
function analyzeForHint(game) {
    const board = game.current;
    // First, look for Naked Singles (cells with only one candidate)
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const candidates = getCandidates(board, row, col);
                if (candidates.length === 1) {
                    return {
                        row,
                        col,
                        value: candidates[0],
                        technique: "Naked Single",
                        explanation: `Row ${row + 1}, Column ${col + 1} can only contain ${candidates[0]}. All other numbers (1-9) are already present in this cell's row, column, or 3x3 box.`,
                        candidates
                    };
                }
            }
        }
    }
    // Look for Hidden Singles in rows
    for (let row = 0; row < 9; row++) {
        for (let num = 1; num <= 9; num++) {
            // Check if num is already in this row
            let found = false;
            for (let c = 0; c < 9; c++) {
                if (board[row][c] === num) {
                    found = true;
                    break;
                }
            }
            if (found)
                continue;
            // Find cells where num can go
            const possibleCols = [];
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0 && isValid(board, row, col, num)) {
                    possibleCols.push(col);
                }
            }
            if (possibleCols.length === 1) {
                const col = possibleCols[0];
                return {
                    row,
                    col,
                    value: num,
                    technique: "Hidden Single (Row)",
                    explanation: `In Row ${row + 1}, the number ${num} can only go in Column ${col + 1}. It's blocked in all other cells of this row by existing numbers in their columns or boxes.`,
                    candidates: getCandidates(board, row, col)
                };
            }
        }
    }
    // Look for Hidden Singles in columns
    for (let col = 0; col < 9; col++) {
        for (let num = 1; num <= 9; num++) {
            // Check if num is already in this column
            let found = false;
            for (let r = 0; r < 9; r++) {
                if (board[r][col] === num) {
                    found = true;
                    break;
                }
            }
            if (found)
                continue;
            // Find cells where num can go
            const possibleRows = [];
            for (let row = 0; row < 9; row++) {
                if (board[row][col] === 0 && isValid(board, row, col, num)) {
                    possibleRows.push(row);
                }
            }
            if (possibleRows.length === 1) {
                const row = possibleRows[0];
                return {
                    row,
                    col,
                    value: num,
                    technique: "Hidden Single (Column)",
                    explanation: `In Column ${col + 1}, the number ${num} can only go in Row ${row + 1}. It's blocked in all other cells of this column by existing numbers in their rows or boxes.`,
                    candidates: getCandidates(board, row, col)
                };
            }
        }
    }
    // Look for Hidden Singles in 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            const startRow = boxRow * 3;
            const startCol = boxCol * 3;
            for (let num = 1; num <= 9; num++) {
                // Check if num is already in this box
                let found = false;
                for (let r = startRow; r < startRow + 3; r++) {
                    for (let c = startCol; c < startCol + 3; c++) {
                        if (board[r][c] === num) {
                            found = true;
                            break;
                        }
                    }
                    if (found)
                        break;
                }
                if (found)
                    continue;
                // Find cells where num can go
                const possibleCells = [];
                for (let r = startRow; r < startRow + 3; r++) {
                    for (let c = startCol; c < startCol + 3; c++) {
                        if (board[r][c] === 0 && isValid(board, r, c, num)) {
                            possibleCells.push([r, c]);
                        }
                    }
                }
                if (possibleCells.length === 1) {
                    const [row, col] = possibleCells[0];
                    const boxNumber = boxRow * 3 + boxCol + 1;
                    return {
                        row,
                        col,
                        value: num,
                        technique: "Hidden Single (Box)",
                        explanation: `In Box ${boxNumber}, the number ${num} can only go in Row ${row + 1}, Column ${col + 1}. It's blocked in all other cells of this box by existing numbers in their rows or columns.`,
                        candidates: getCandidates(board, row, col)
                    };
                }
            }
        }
    }
    // Fallback: find cell with fewest candidates
    let minCandidates = 10;
    let bestCell = null;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const candidates = getCandidates(board, row, col);
                if (candidates.length > 0 && candidates.length < minCandidates) {
                    minCandidates = candidates.length;
                    bestCell = { row, col, candidates };
                }
            }
        }
    }
    if (bestCell) {
        return {
            row: bestCell.row,
            col: bestCell.col,
            value: game.solution[bestCell.row][bestCell.col],
            technique: "Elimination",
            explanation: `Row ${bestCell.row + 1}, Column ${bestCell.col + 1} has only ${bestCell.candidates.length} possible candidates: ${bestCell.candidates.join(', ')}. Try to determine which one fits by examining the row, column, and box constraints.`,
            candidates: bestCell.candidates
        };
    }
    return null;
}
// ============ MCP SERVER ============
export function createServer() {
    const server = new McpServer({
        name: "Sabai Sudoku",
        version: "1.0.1",
    });
    const resourceUri = "ui://sudoku/mcp-app.html";
    // Main tool to start/display the Sudoku game
    registerAppTool(server, "play_sudoku", {
        title: "Play Sudoku",
        description: "Start a new Sudoku game. IMPORTANT: Always ask the user which difficulty they want before calling this tool. Available difficulties: Easy, Medium, Hard, Expert.",
        inputSchema: {
            difficulty: z.enum(["easy", "medium", "hard", "expert"]).describe("Difficulty level"),
            game_id: z.string().optional().describe("Resume an existing game by ID"),
        },
        _meta: { ui: { resourceUri } },
    }, async (args) => {
        const { difficulty = "medium", game_id } = args;
        let game;
        if (game_id && games.has(game_id)) {
            game = games.get(game_id);
        }
        else {
            const solution = generateSolvedBoard();
            const diff = difficulty;
            const puzzle = createPuzzle(solution, diff);
            game = {
                id: generateId(),
                puzzle,
                solution,
                current: puzzle.map(row => [...row]),
                difficulty: diff,
                startTime: Date.now(),
                moves: 0
            };
            games.set(game.id, game);
        }
        const remaining = countEmpty(game.current);
        const complete = remaining === 0;
        // Full data for the UI (will be parsed by ontoolresult)
        const gameData = {
            game_id: game.id,
            difficulty: game.difficulty,
            puzzle: game.puzzle,
            current: game.current,
            remaining_cells: remaining,
            moves: game.moves,
            complete,
            elapsed_seconds: Math.floor((Date.now() - game.startTime) / 1000)
        };
        return {
            content: [
                {
                    type: "text",
                    text: `${game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)} Sudoku ready! Good luck! The interactive board is displayed above - do not render the board as text.`
                },
                {
                    type: "text",
                    text: JSON.stringify(gameData)
                }
            ]
        };
    });
    // Tool to make a move
    registerAppTool(server, "sudoku_move", {
        title: "Make Move",
        description: "Place a number on the Sudoku board",
        inputSchema: {
            game_id: z.string().describe("The game ID"),
            row: z.number().describe("Row (0-8)"),
            col: z.number().describe("Column (0-8)"),
            value: z.number().describe("Number to place (1-9, or 0 to clear)"),
        },
        _meta: { ui: { resourceUri, visibility: ["app"] } }, // UI-only tool
    }, async (args) => {
        const game = games.get(args.game_id);
        if (!game) {
            return { content: [{ type: "text", text: JSON.stringify({ error: "Game not found" }) }], isError: true };
        }
        const { row, col, value } = args;
        // Validate input
        if (row < 0 || row > 8 || col < 0 || col > 8) {
            return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid position" }) }], isError: true };
        }
        if (value < 0 || value > 9) {
            return { content: [{ type: "text", text: JSON.stringify({ error: "Invalid value (must be 0-9)" }) }], isError: true };
        }
        // Can't modify original puzzle cells
        if (game.puzzle[row][col] !== 0) {
            return { content: [{ type: "text", text: JSON.stringify({ error: "Cannot modify original puzzle cell" }) }], isError: true };
        }
        // Make the move
        game.current[row][col] = value;
        if (value !== 0)
            game.moves++;
        const remaining = countEmpty(game.current);
        const complete = checkComplete(game.current, game.solution);
        const correct = value === 0 || value === game.solution[row][col];
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        game_id: game.id,
                        row,
                        col,
                        value,
                        correct,
                        current: game.current,
                        remaining_cells: remaining,
                        moves: game.moves,
                        complete,
                        elapsed_seconds: Math.floor((Date.now() - game.startTime) / 1000)
                    })
                }]
        };
    });
    // Tool to get a hint with analysis
    registerAppTool(server, "sudoku_hint", {
        title: "Get Hint",
        description: "Analyze the board and get a hint with explanation",
        inputSchema: {
            game_id: z.string().describe("The game ID"),
            reveal_number: z.boolean().optional().describe("Whether to reveal the number (default: false, only shows cell and technique)"),
        },
        _meta: { ui: { resourceUri, visibility: ["app"] } },
    }, async (args) => {
        const game = games.get(args.game_id);
        if (!game) {
            return { content: [{ type: "text", text: JSON.stringify({ error: "Game not found" }) }], isError: true };
        }
        const analysis = analyzeForHint(game);
        if (!analysis) {
            return { content: [{ type: "text", text: JSON.stringify({ message: "Puzzle is complete!" }) }] };
        }
        // By default, don't reveal the number - just the cell and technique
        const response = {
            row: analysis.row,
            col: analysis.col,
            technique: analysis.technique,
            explanation: analysis.explanation,
            candidates: analysis.candidates,
            ...(args.reveal_number ? { value: analysis.value } : {})
        };
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(response)
                }]
        };
    });
    // Tool to check the board
    registerAppTool(server, "sudoku_check", {
        title: "Check Board",
        description: "Check current board for errors",
        inputSchema: {
            game_id: z.string().describe("The game ID"),
        },
        _meta: { ui: { resourceUri, visibility: ["app"] } },
    }, async (args) => {
        const game = games.get(args.game_id);
        if (!game) {
            return { content: [{ type: "text", text: JSON.stringify({ error: "Game not found" }) }], isError: true };
        }
        const errors = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (game.current[i][j] !== 0 && game.current[i][j] !== game.solution[i][j]) {
                    errors.push({ row: i, col: j, current: game.current[i][j], expected: game.solution[i][j] });
                }
            }
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        has_errors: errors.length > 0,
                        error_count: errors.length,
                        errors: errors.slice(0, 5), // Show first 5 errors
                        message: errors.length === 0
                            ? "No errors found! Keep going!"
                            : `Found ${errors.length} error(s)`
                    })
                }]
        };
    });
    // Register the HTML resource
    registerAppResource(server, resourceUri, resourceUri, { mimeType: RESOURCE_MIME_TYPE }, async () => {
        const html = await fs.readFile(path.join(DIST_DIR, "mcp-app.html"), "utf-8");
        return {
            contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
        };
    });
    return server;
}
