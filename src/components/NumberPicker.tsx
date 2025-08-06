import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dices, Play, Volume2, VolumeX, Settings } from 'lucide-react';

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
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState([0.8]);
  const [speechPitch, setSpeechPitch] = useState([1.2]);
  const [speechVolume, setSpeechVolume] = useState([1]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Try to find an English voice as default
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.localService
      );
      if (englishVoice && !selectedVoice) {
        setSelectedVoice(englishVoice.name);
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const speakNumber = useCallback((number: number) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(`Number ${number}`);
    utterance.rate = speechRate[0];
    utterance.pitch = speechPitch[0];
    utterance.volume = speechVolume[0];

    // Set voice if selected
    if (selectedVoice) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
    }

    // Add some excitement for milestone numbers
    if (number % 10 === 0 || number === 1 || number === 90) {
      utterance.text = `Special number ${number}!`;
      utterance.rate = speechRate[0] * 0.9; // Slightly slower for emphasis
    }

    speechSynthesis.speak(utterance);
  }, [speechEnabled, speechRate, speechPitch, speechVolume, selectedVoice, availableVoices]);

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
    
    // Speak the number after a short delay for better timing
    setTimeout(() => {
      speakNumber(pickedNumber);
    }, 300);
    
    setIsPickingNumber(false);
  }, [availableNumbers, isGameActive, onNumberCalled, speakNumber]);

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

      {/* Voice Settings */}
      <Card className="p-4 shadow-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Voice Settings
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            >
              {showVoiceSettings ? 'Hide' : 'Show'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={speechEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className="flex items-center gap-2"
            >
              {speechEnabled ? (
                <>
                  <Volume2 className="h-4 w-4" />
                  Speech On
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" />
                  Speech Off
                </>
              )}
            </Button>
            
            {speechEnabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakNumber(Math.floor(Math.random() * 90) + 1)}
                className="text-primary"
              >
                Test Voice
              </Button>
            )}
          </div>

          {showVoiceSettings && speechEnabled && (
            <div className="space-y-4 pt-2 border-t">
              {/* Voice Selection */}
              {availableVoices.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Voice</label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices
                        .filter(voice => voice.lang.startsWith('en'))
                        .map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Speech Rate */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Speech Rate: {speechRate[0].toFixed(1)}x
                </label>
                <Slider
                  value={speechRate}
                  onValueChange={setSpeechRate}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Speech Pitch */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Speech Pitch: {speechPitch[0].toFixed(1)}
                </label>
                <Slider
                  value={speechPitch}
                  onValueChange={setSpeechPitch}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Speech Volume */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Volume: {Math.round(speechVolume[0] * 100)}%
                </label>
                <Slider
                  value={speechVolume}
                  onValueChange={setSpeechVolume}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {!('speechSynthesis' in window) && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              ⚠️ Speech synthesis is not supported in this browser.
            </div>
          )}
        </div>
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