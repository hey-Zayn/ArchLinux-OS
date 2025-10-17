"use client";
import React, { useState } from 'react';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      default: return secondValue;
    }
  };

  const handleEqual = () => {
    const inputValue = parseFloat(display);
    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  return (
    <div className="p-4 bg-gray-800 text-white h-full">
      <div className="text-2xl font-mono text-right mb-4 p-2 bg-gray-700 rounded">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className="col-span-2 bg-red-500 p-3 rounded hover:bg-red-600">C</button>
        <button onClick={() => inputOperation('÷')} className="bg-gray-600 p-3 rounded hover:bg-gray-500">÷</button>
        <button onClick={() => inputOperation('×')} className="bg-gray-600 p-3 rounded hover:bg-gray-500">×</button>
        
        <button onClick={() => inputNumber('7')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">7</button>
        <button onClick={() => inputNumber('8')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">8</button>
        <button onClick={() => inputNumber('9')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">9</button>
        <button onClick={() => inputOperation('-')} className="bg-gray-600 p-3 rounded hover:bg-gray-500">-</button>
        
        <button onClick={() => inputNumber('4')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">4</button>
        <button onClick={() => inputNumber('5')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">5</button>
        <button onClick={() => inputNumber('6')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">6</button>
        <button onClick={() => inputOperation('+')} className="bg-gray-600 p-3 rounded hover:bg-gray-500">+</button>
        
        <button onClick={() => inputNumber('1')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">1</button>
        <button onClick={() => inputNumber('2')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">2</button>
        <button onClick={() => inputNumber('3')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">3</button>
        <button onClick={handleEqual} className="row-span-2 bg-blue-500 p-3 rounded hover:bg-blue-600">=</button>
        
        <button onClick={() => inputNumber('0')} className="col-span-2 bg-gray-700 p-3 rounded hover:bg-gray-600">0</button>
        <button onClick={() => inputNumber('.')} className="bg-gray-700 p-3 rounded hover:bg-gray-600">.</button>
      </div>
    </div>
  );
}