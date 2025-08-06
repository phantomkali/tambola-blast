import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TicketGenerator } from './TicketGenerator';
import { NumberPicker } from './NumberPicker';
import { GameHistory } from './GameHistory';
import { Play, Pause, RotateCcw, Ticket } from 'lucide-react';

export interface TambolaTicket {
  id: string;
  grid: (number | null)[][];
  markedNumbers: Set<number>;
}

export const TambolaGame: React.FC = () => {
  const [tickets, setTickets] = useState<TambolaTicket[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<Set<number>>(new Set());
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameHistory, setGameHistory] = useState<number[]>([]);

  const handleTicketsGenerated = useCallback((newTickets: TambolaTicket[]) => {
    setTickets(newTickets);
  }, []);

  const handleNumberCalled = useCallback((number: number) => {
    setCalledNumbers(prev => new Set([...prev, number]));
    setCurrentNumber(number);
    setGameHistory(prev => [...prev, number]);
    
    // Auto-mark the number on all tickets
    setTickets(prev => prev.map(ticket => ({
      ...ticket,
      markedNumbers: new Set([...ticket.markedNumbers, number])
    })));
  }, []);

  const resetGame = useCallback(() => {
    setCalledNumbers(new Set());
    setCurrentNumber(null);
    setIsGameActive(false);
    setGameHistory([]);
    setTickets(prev => prev.map(ticket => ({
      ...ticket,
      markedNumbers: new Set()
    })));
  }, []);

  const toggleGame = useCallback(() => {
    setIsGameActive(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold gradient-primary bg-clip-text text-transparent animate-float">
          TAMBOLA GAME
        </h1>
        <p className="text-lg text-muted-foreground">
          Generate tickets, call numbers, and mark your wins!
        </p>
        
        {/* Game Controls */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button 
            onClick={toggleGame}
            variant={isGameActive ? "destructive" : "default"}
            size="lg"
            className="shadow-glow"
          >
            {isGameActive ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause Game
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start Game
              </>
            )}
          </Button>
          
          <Button 
            onClick={resetGame}
            variant="outline"
            size="lg"
            className="shadow-glow"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset Game
          </Button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Ticket Generator */}
        <div className="lg:col-span-1">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Generate Tickets</h2>
            </div>
            <TicketGenerator onTicketsGenerated={handleTicketsGenerated} />
          </Card>
        </div>

        {/* Middle Column - Number Picker */}
        <div className="lg:col-span-1">
          <NumberPicker
            onNumberCalled={handleNumberCalled}
            calledNumbers={calledNumbers}
            currentNumber={currentNumber}
            isGameActive={isGameActive}
          />
        </div>

        {/* Right Column - Game History */}
        <div className="lg:col-span-1">
          <GameHistory 
            calledNumbers={Array.from(calledNumbers)}
            gameHistory={gameHistory}
          />
        </div>
      </div>

      {/* Tickets Display */}
      {tickets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-center">Your Tickets</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket, index) => (
              <Card 
                key={ticket.id} 
                className="p-4 shadow-card tambola-ticket-appear"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="text-lg font-semibold mb-3 text-center">
                  Ticket {index + 1}
                </h4>
                <div className="grid grid-cols-9 gap-1">
                  {ticket.grid.flat().map((cell, cellIndex) => {
                    const isMarked = cell !== null && ticket.markedNumbers.has(cell);
                    return (
                      <div
                        key={cellIndex}
                        className={`
                          aspect-square flex items-center justify-center text-sm font-medium
                          border-2 border-border rounded-md transition-all duration-300
                          ${cell === null 
                            ? 'bg-muted/30' 
                            : isMarked 
                              ? 'bg-tambola-called text-white shadow-md tambola-cell-mark' 
                              : 'bg-tambola-ticket text-tambola-ticket-foreground hover:scale-105'
                          }
                        `}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};