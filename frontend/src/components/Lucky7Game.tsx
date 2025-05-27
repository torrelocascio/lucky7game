import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControlLabel, Checkbox, Typography, Box, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../reducers';
import { placeBet, getGameStatus } from '../api';

const Lucky7Game: React.FC = () => {
  const [betAmount, setBetAmount] = useState<string>('');
  const [betOnLucky7, setBetOnLucky7] = useState<boolean>(false);
  const [timeUntilNextRoll, setTimeUntilNextRoll] = useState<number>(0);
  const [canBet, setCanBet] = useState<boolean>(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const updateGameStatus = async () => {
      try {
        const response = await getGameStatus();
        setTimeUntilNextRoll(response.data.timeUntilNextRoll);
        setCanBet(response.data.canBet);
      } catch (error) {
        console.error('Error fetching game status:', error);
      }
    };

    const interval = setInterval(updateGameStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBet = async () => {
    try {
      const amount = parseInt(betAmount);
      if (isNaN(amount) || amount <= 0) {
        setMessage({ type: 'error', text: 'Please enter a valid bet amount' });
        return;
      }

      const response = await placeBet({ betAmount: amount, betOnLucky7 });
      setMessage({ type: 'success', text: response.data.message });
      setBetAmount('');
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error placing bet' 
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Lucky 7 Game
      </Typography>
      
      <Typography variant="h6" gutterBottom>
        Your Tokens: {user?.tokens || 0}
      </Typography>

      <Typography variant="body1" gutterBottom>
        Time until next roll: {Math.ceil(timeUntilNextRoll / 1000)}s
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Bet Amount"
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        disabled={!canBet}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={betOnLucky7}
            onChange={(e) => setBetOnLucky7(e.target.checked)}
            disabled={!canBet}
          />
        }
        label="Bet on Lucky 7"
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleBet}
        disabled={!canBet || !betAmount}
      >
        Place Bet
      </Button>
    </Box>
  );
};

export default Lucky7Game; 