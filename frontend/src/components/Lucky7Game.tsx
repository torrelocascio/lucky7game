import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox, 
  Typography, 
  Box, 
  Alert,
  Paper,
  Chip,
  Stack,
  Divider,
  Fade,
  CircularProgress
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../reducers';
import { placeBet, getGameStatus } from '../api';
import { fetchUserDataAction } from '../actions/auth';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const Lucky7Game: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const [betAmount, setBetAmount] = useState<string>('');
  const [betOnLucky7, setBetOnLucky7] = useState<boolean>(false);
  const [timeUntilNextRoll, setTimeUntilNextRoll] = useState<number>(0);
  const [canBet, setCanBet] = useState<boolean>(true);
  const [hasCurrentBet, setHasCurrentBet] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [lastGameResult, setLastGameResult] = useState<{
    diceRoll: number;
    betOnLucky7: boolean;
    betAmount: number;
    won: boolean;
    winnings: number;
  } | null>(null);
  
  const user = useSelector((state: RootState) => state.auth.user);

  // Function to reset bet state
  const resetBetState = () => {
    setBetAmount('');
    setBetOnLucky7(false);
    setHasCurrentBet(false);
    setMessage(null);
  };

  useEffect(() => {
    const updateGameStatus = async () => {
      try {
        const response = await getGameStatus();
        const newTimeUntilNextRoll = response.data.timeUntilNextRoll;
        const newCanBet = response.data.canBet;
        
        // If we're transitioning from rolling to betting phase, reset bet state
        if (timeUntilNextRoll <= 5000 && newTimeUntilNextRoll > 5000) {
          resetBetState();
        }
        
        setTimeUntilNextRoll(newTimeUntilNextRoll);
        setCanBet(newCanBet);
        
        // Only update hasCurrentBet if we're in the betting phase
        if (newTimeUntilNextRoll > 5000) {
          setHasCurrentBet(response.data.hasCurrentBet);
        }
        
        // Update last game result if available
        if (response.data.lastGameResult) {
          setLastGameResult(response.data.lastGameResult);
          // Refresh user data to update token count
          dispatch(fetchUserDataAction());
        }
      } catch (error) {
        console.error('Error fetching game status:', error);
      }
    };

    const interval = setInterval(updateGameStatus, 1000);
    return () => clearInterval(interval);
  }, [dispatch, timeUntilNextRoll]);

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
      setHasCurrentBet(true);
      
      // Refresh user data to update token count after placing bet
      dispatch(fetchUserDataAction());
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error placing bet' 
      });
    }
  };

  const getGamePhase = () => {
    if (timeUntilNextRoll > 5000) {
      return { text: 'Taking Bets!', color: 'success' as const };
    } else if (timeUntilNextRoll > 0) {
      return { text: 'Dice Rolling!', color: 'warning' as const };
    } else {
      return { text: 'Waiting for next round', color: 'default' as const };
    }
  };

  const gamePhase = getGamePhase();

  // Calculate time display for betting phase
  const bettingTime = Math.max(0, Math.ceil((timeUntilNextRoll - 5000) / 1000));
  
  // Calculate time display for rolling phase
  const rollingTime = timeUntilNextRoll <= 5000 
    ? Math.ceil(timeUntilNextRoll / 1000)
    : 5;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Lucky 7 Game
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Your Tokens: {user?.tokens || 0}
          </Typography>
          <Chip 
            label={gamePhase.text}
            color={gamePhase.color}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        <Typography 
          variant="h5" 
          align="center" 
          color="primary" 
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          {timeUntilNextRoll > 5000 
            ? hasCurrentBet 
              ? `Bet placed! ${bettingTime}s until roll`
              : `Place your bets! ${bettingTime}s remaining`
            : `Rolling in ${rollingTime}s`}
        </Typography>

        <Fade in={true} timeout={500}>
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ mb: 2 }} />
            {timeUntilNextRoll > 5000 && lastGameResult ? (
              <>
                <Typography variant="h6" align="center" gutterBottom>
                  Last Game Result
                </Typography>
                <Stack spacing={1} alignItems="center">
                  <Typography variant="h4" color="primary">
                    Rolled: {lastGameResult.diceRoll}
                  </Typography>
                  {lastGameResult.betAmount > 0 ? (
                    <>
                      <Typography variant="body1">
                        You {lastGameResult.won ? 'won' : 'lost'} {Math.abs(lastGameResult.winnings)} tokens
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {lastGameResult.betOnLucky7 ? 'Bet on Lucky 7' : 'Bet against Lucky 7'}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      You did not place a bet
                    </Typography>
                  )}
                </Stack>
              </>
            ) : (
              <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
                <CircularProgress size={24} />
                <Typography variant="body1" color="text.secondary">
                  Waiting for next roll...
                </Typography>
              </Stack>
            )}
            <Divider sx={{ mt: 2 }} />
          </Box>
        </Fade>

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
          disabled={!canBet || hasCurrentBet}
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={betOnLucky7}
              onChange={(e) => setBetOnLucky7(e.target.checked)}
              disabled={!canBet || hasCurrentBet}
            />
          }
          label="Bet on Lucky 7"
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleBet}
          disabled={!canBet || !betAmount || hasCurrentBet}
          color={timeUntilNextRoll > 5000 ? "success" : "warning"}
        >
          {timeUntilNextRoll > 5000 
            ? hasCurrentBet 
              ? "Bet Placed"
              : "Place Bet"
            : "Betting Closed"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Lucky7Game; 