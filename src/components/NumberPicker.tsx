import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dices, Play, Volume2 } from 'lucide-react';

interface NumberPickerProps {
  onNumberCalled: (number: number) => void;
  calledNumbers: Set<number>;
  currentNumber: number | null;
  isGameActive: boolean;
}

export const NumberPicker: React.FC<NumberPickerProps> = ({
  onNumberCalled,
  calledNumbers,
  currentNumber,
  isGameActive
}) => {
  const [isPickingNumber, setIsPickingNumber] = useState(false);

  const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1)
    .filter(num => !calledNumbers.has(num));

  const pickRandomNumber = useCallback(async () => {
    if (availableNumbers.length === 0 || !isGameActive) return;

    setIsPickingNumber(true);

    // Add dramatic pause for suspense
    await new Promise(resolve => setTimeout(resolve, 1000));

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const pickedNumber = availableNumbers[randomIndex];
    
    onNumberCalled(pickedNumber);
    setIsPickingNumber(false);

    // Optional: Add sound effect here
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Number ${pickedNumber}`);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  }, [availableNumbers, isGameActive, onNumberCalled]);

  const gameProgress = ((90 - availableNumbers.length) / 90) * 100;

  return (
    <div className="space-y-6">
      {/* Current Number Display */}
      <Card className="p-8 shadow-card text-center">
        <h2 className="text-xl font-semibold mb-4">Current Number</h2>
        <div className="relative">
          {currentNumber ? (
            <div className="text-8xl font-bold text-tambola-number tambola-number-reveal shadow-number rounded-full w-32 h-32 mx-auto flex items-center justify-center bg-tambola-number text-white mb-4">
              {currentNumber}
            </div>
          ) : (
            <div className="text-4xl text-muted-foreground w-32 h-32 mx-auto flex items-center justify-center border-2 border-dashed border-muted rounded-full mb-4">
              ?
            </div>
          )}
          
          {currentNumber && (
            <div className="absolute -top-2 -right-2">
              <Volume2 className="h-6 w-6 text-primary animate-pulse" />
            </div>
          )}
        </div>
        
        <Button
          onClick={pickRandomNumber}
          disabled={!isGameActive || isPickingNumber || availableNumbers.length === 0}
          className="gradient-secondary shadow-glow"
          size="lg"
        >
          {isPickingNumber ? (
            <>
              <Dices className="mr-2 h-5 w-5 animate-spin" />
              Picking...
            </>
          ) : availableNumbers.length === 0 ? (
            'All Numbers Called!'
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Call Next Number
            </>
          )}
        </Button>
      </Card>

      {/* Game Progress */}
      <Card className="p-4 shadow-card">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Game Progress</span>
            <span>{Math.round(gameProgress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="gradient-accent h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${gameProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Numbers Called: {calledNumbers.size}</span>
            <span>Remaining: {availableNumbers.length}</span>
          </div>
        </div>
      </Card>

      {/* Game Status */}
      {!isGameActive && (
        <Card className="p-4 shadow-card border-2 border-dashed border-muted">
          <div className="text-center text-muted-foreground">
            <Play className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Game is paused</p>
            <p className="text-sm">Click "Start Game" to begin calling numbers</p>
          </div>
        </Card>
      )}

      {availableNumbers.length === 0 && (
        <Card className="p-4 shadow-card border-2 border-tambola-winner bg-tambola-winner/10">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-bold text-tambola-winner">Game Complete!</p>
            <p className="text-sm text-muted-foreground">All numbers have been called</p>
          </div>
        </Card>
      )}
    </div>
  );
};