import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TambolaTicket } from './TambolaGame';
import { Dices, Plus } from 'lucide-react';

interface TicketGeneratorProps {
  onTicketsGenerated: (tickets: TambolaTicket[]) => void;
}

// Tambola ticket generation logic
const generateTambolaTicket = (): TambolaTicket => {
  const grid: (number | null)[][] = Array(3).fill(null).map(() => Array(9).fill(null));
  
  // Column ranges for Tambola
  const columnRanges = [
    [1, 10],   // Column 1: 1-10
    [11, 20],  // Column 2: 11-20
    [21, 30],  // Column 3: 21-30
    [31, 40],  // Column 4: 31-40
    [41, 50],  // Column 5: 41-50
    [51, 60],  // Column 6: 51-60
    [61, 70],  // Column 7: 61-70
    [71, 80],  // Column 8: 71-80
    [81, 90]   // Column 9: 81-90
  ];

  // Generate numbers for each column
  const columnNumbers: number[][] = [];
  for (let col = 0; col < 9; col++) {
    const [min, max] = columnRanges[col];
    const numbers: number[] = [];
    for (let i = min; i <= max; i++) {
      numbers.push(i);
    }
    // Shuffle and take first 3 numbers for the column
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    columnNumbers.push(numbers.slice(0, 3).sort((a, b) => a - b));
  }

  // Fill the grid ensuring each row has exactly 5 numbers
  for (let row = 0; row < 3; row++) {
    // Randomly select 5 columns for this row
    const selectedColumns = new Set<number>();
    while (selectedColumns.size < 5) {
      selectedColumns.add(Math.floor(Math.random() * 9));
    }

    // Place numbers in selected columns
    selectedColumns.forEach(col => {
      if (columnNumbers[col].length > 0) {
        grid[row][col] = columnNumbers[col].shift()!;
      }
    });
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    grid,
    markedNumbers: new Set()
  };
};

export const TicketGenerator: React.FC<TicketGeneratorProps> = ({ onTicketsGenerated }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTickets = async () => {
    setIsGenerating(true);
    
    // Add a small delay for animation effect
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tickets: TambolaTicket[] = [];
    for (let i = 0; i < ticketCount; i++) {
      tickets.push(generateTambolaTicket());
    }
    
    onTicketsGenerated(tickets);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ticket-count">Number of Tickets</Label>
        <Input
          id="ticket-count"
          type="number"
          min="1"
          max="12"
          value={ticketCount}
          onChange={(e) => setTicketCount(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
          className="text-center"
        />
        <p className="text-sm text-muted-foreground">
          Generate 1-12 tickets at once
        </p>
      </div>

      <Button
        onClick={generateTickets}
        disabled={isGenerating}
        className="w-full gradient-primary shadow-glow"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Dices className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-5 w-5" />
            Generate {ticketCount} Ticket{ticketCount > 1 ? 's' : ''}
          </>
        )}
      </Button>

      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
        <h4 className="font-semibold text-sm">Ticket Rules:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• 9 columns × 3 rows grid</li>
          <li>• Each row has exactly 5 numbers</li>
          <li>• Col 1: 1-10, Col 2: 11-20, ..., Col 9: 81-90</li>
          <li>• Numbers are automatically sorted in columns</li>
        </ul>
      </div>
    </div>
  );
};