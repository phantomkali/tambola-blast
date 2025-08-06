import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Hash } from 'lucide-react';

interface GameHistoryProps {
  calledNumbers: number[];
  gameHistory: number[];
}

export const GameHistory: React.FC<GameHistoryProps> = ({ calledNumbers, gameHistory }) => {
  // Create a grid of all numbers 1-90 for visual reference
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  const calledSet = new Set(calledNumbers);

  // Group numbers by tens for better organization
  const numberGroups = [];
  for (let i = 0; i < 90; i += 10) {
    numberGroups.push(allNumbers.slice(i, i + 10));
  }

  return (
    <div className="space-y-6">
      {/* Recent Numbers */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Recent Numbers</h3>
        </div>
        
        {gameHistory.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Hash className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No numbers called yet</p>
            <p className="text-sm">Start the game to see called numbers here</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {gameHistory.slice(-10).reverse().map((number, index) => (
                <Badge
                  key={`${number}-${gameHistory.length - index}`}
                  variant="secondary"
                  className={`
                    text-lg px-3 py-2 animate-bounce-in
                    ${index === 0 ? 'bg-tambola-number text-white shadow-number' : ''}
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {number}
                </Badge>
              ))}
            </div>
            
            {gameHistory.length > 10 && (
              <p className="text-sm text-muted-foreground">
                Showing last 10 numbers • Total called: {gameHistory.length}
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Number Grid */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Number Board</h3>
        </div>
        
        <div className="space-y-3">
          {numberGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="grid grid-cols-10 gap-1">
              {group.map(number => {
                const isCalled = calledSet.has(number);
                const callOrder = gameHistory.indexOf(number);
                
                return (
                  <div
                    key={number}
                    className={`
                      aspect-square flex items-center justify-center text-sm font-medium
                      rounded-md border transition-all duration-300 relative
                      ${isCalled 
                        ? 'bg-tambola-called text-white shadow-md scale-95' 
                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    {number}
                    {isCalled && callOrder !== -1 && (
                      <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {callOrder + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-tambola-called rounded"></div>
            <span>Called</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted/30 rounded"></div>
            <span>Not Called</span>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      {calledNumbers.length > 0 && (
        <Card className="p-4 shadow-card">
          <h4 className="font-semibold mb-3">Game Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-primary">{calledNumbers.length}</div>
              <div className="text-muted-foreground">Numbers Called</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-tambola-number">{90 - calledNumbers.length}</div>
              <div className="text-muted-foreground">Remaining</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};