import React, { useState } from 'react';
import { evaluateCalculator } from '../../os/systemLogic';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/' | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [historyLine, setHistoryLine] = useState('');

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setHistoryLine('');
  };

  const performOperation = (nextOperator: '+' | '-' | '*' | '/' | '=') => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      if (nextOperator !== '=') {
        setOperator(nextOperator);
        setHistoryLine(`${inputValue} ${nextOperator}`);
      }
    } else if (operator) {
      const result = evaluateCalculator(previousValue, inputValue, operator);
      if (result.error || result.value === null) {
        setDisplay(result.error ?? 'Błąd');
        setPreviousValue(null);
        setOperator(null);
        setHistoryLine('');
      } else {
        setDisplay(String(result.value));
        setPreviousValue(nextOperator === '=' ? null : result.value);
        setHistoryLine(
          nextOperator === '='
            ? `${previousValue} ${operator} ${inputValue} =`
            : `${result.value} ${nextOperator}`
        );
        setOperator(nextOperator === '=' ? null : nextOperator);
      }
    }

    setWaitingForOperand(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#f2f2f2] text-slate-900 p-3 select-none">
      <div className="text-xs font-semibold text-slate-600 mb-1">Standardowy</div>

      {/* Display */}
      <div className="bg-white border border-slate-200 rounded p-3 mb-3 text-right">
        <div className="text-xs text-slate-400 font-mono h-4 tabular-nums">
          {historyLine}
        </div>
        <div
          aria-label="Wynik kalkulatora"
          className="text-2xl font-bold font-mono text-slate-900 truncate tabular-nums"
        >
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="flex-1 grid grid-cols-4 gap-1.5 text-sm font-semibold">
        <button
          type="button"
          onClick={clearAll}
          className="col-span-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded py-2"
        >
          C (Wyczyść)
        </button>
        <button
          type="button"
          onClick={() => setDisplay(String(parseFloat(display || '0') * -1))}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded py-2"
        >
          ±
        </button>
        <button
          type="button"
          onClick={() => performOperation('/')}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded py-2"
        >
          ÷
        </button>

        {['7', '8', '9'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => inputDigit(d)}
            className="bg-white hover:bg-slate-100 border border-slate-200 rounded py-2 tabular-nums"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => performOperation('*')}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded py-2"
        >
          ×
        </button>

        {['4', '5', '6'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => inputDigit(d)}
            className="bg-white hover:bg-slate-100 border border-slate-200 rounded py-2 tabular-nums"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => performOperation('-')}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded py-2"
        >
          −
        </button>

        {['1', '2', '3'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => inputDigit(d)}
            className="bg-white hover:bg-slate-100 border border-slate-200 rounded py-2 tabular-nums"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => performOperation('+')}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded py-2"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => inputDigit('0')}
          className="col-span-2 bg-white hover:bg-slate-100 border border-slate-200 rounded py-2 tabular-nums"
        >
          0
        </button>
        <button
          type="button"
          onClick={inputDecimal}
          className="bg-white hover:bg-slate-100 border border-slate-200 rounded py-2"
        >
          .
        </button>
        <button
          type="button"
          onClick={() => performOperation('=')}
          className="bg-[#0078d7] hover:bg-[#106ebe] text-white rounded py-2"
        >
          =
        </button>
      </div>
    </div>
  );
};
