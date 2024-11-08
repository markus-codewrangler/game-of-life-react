import { memo, useEffect, useState } from 'react';

// Configurable sizes
const COLS = 50;
const ROWS = 50;

const CELL_SIZE = 10; // px

export function Grid() {
  const [gridState, setGridState] = useState(getInitialState());
  const [isRunning, setRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    // Timeout to visual generation
    setTimeout(() => {
      setGridState(generateNext(gridState));
    }, 100);

    // Recursively call effect to continue generations
  }, [isRunning, gridState]);

  return (
    <>
      <div
        className="Grid"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {gridState.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {row.map((cellValue, cellIndex) => (
              <Cell
                key={`${rowIndex}-${cellIndex}`}
                row={rowIndex}
                col={cellIndex}
                isAlive={!!cellValue}
                onToggle={toggleCell}
              />
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={start}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
    </>
  );

  function toggleCell(row: number, col: number) {
    const nextState = JSON.parse(JSON.stringify(gridState));
    nextState[row][col] = +!nextState[row][col]; // Flip 0/1

    setGridState(nextState);
  }

  function generateNext(state: number[][]): number[][] {
    // Game rules:
    // 1. Any live cell < 2 neighbors  -> die
    // 2. Any live cell 2-3 neighbors -> lives
    // 3. Any live cell > 3 neighbors -> die
    // 4. Any dead cell with 3 neighbors -> live

    return state.map((row, rowIndex) => {
      return row.map((_, colIndex) => {
        return getNextCellState(rowIndex, colIndex);
      });
    });
  }

  function getNextCellState(row: number, col: number): number {
    const neighbors = countNeighbors(row, col);

    if (gridState[row][col]) {
      if (neighbors < 2 || neighbors > 3) {
        return 0; // Die
      }

      return 1; // Live
    } else {
      if (neighbors === 3) {
        return 1; // Live
      }

      return 0; // Dead
    }
  }

  function countNeighbors(row: number, col: number): number {
    let count = 0;

    if (row > 0) {
      count += gridState[row - 1][col];

      if (col > 0) {
        count += gridState[row - 1][col - 1];
      }

      if (col < COLS - 1) {
        count += gridState[row - 1][col + 1];
      }
    }

    if (row < ROWS - 1) {
      count += gridState[row + 1][col];

      if (col > 0) {
        count += gridState[row + 1][col - 1];
      }

      if (col < COLS - 1) {
        count += gridState[row + 1][col + 1];
      }
    }

    if (col > 0) {
      count += gridState[row][col - 1];
    }

    if (col < COLS - 1) {
      count += gridState[row][col + 1];
    }

    return count;
  }

  function start() {
    setRunning(true);
  }

  function stop() {
    setRunning(false);
  }

  function reset() {
    setGridState(getInitialState());
  }

  function getInitialState() {
    const initial: number[][] = [];

    for (let row = 0; row < ROWS; row++) {
      initial.push(Array(COLS).fill(0));
    }

    return initial;
  }
}

// Cell only re-renders if states change
const Cell = memo(function Cell({
  row,
  col,
  isAlive,
  onToggle,
}: {
  row: number;
  col: number;
  isAlive: boolean;
  onToggle: (row: number, col: number) => void;
}) {
  return (
    <div
      className="Cell"
      onClick={handleClick}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        border: '1px dotted darksalmon',
        backgroundColor: isAlive ? 'darkblue' : 'bisque',
      }}
    ></div>
  );

  function handleClick() {
    onToggle(row, col); // Call parent callback
  }
});
