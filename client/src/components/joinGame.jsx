// Import necessary libraries
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from "axios";
import JoinGameHeader from './JoinGameHeader';
import JoinGameInstructions from './JoinGameInstructions';

// Styled components for styling
const JoinGameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #000;
`;

const JoinGameForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Increase the width */
  max-width: 1000px; /* Set a maximum width */
  margin: 0 auto; /* Center the form horizontally */
`;

// const JoinGameLabel = styled.label`
//   color: #fff;
//   font-size: 18px;
//   margin-bottom: 10px;
// `;

const JoinGameInput = styled.input`
  appearance: none;
  border-radius: 8px;
  padding: 20px;
  border: 2px solid transparent;
  text-align: center;
  transition: border-color 0.25s;
  max-width: 200px;
  font-size: 20px;

  &:focus {
    outline: 0;
    border-color: #2cce9f;
  }
`;

const JoinGameButton = styled.button`
  background: #2cce9f;
  color: #000;
  font-size: 30px;
  border: 0;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.25s;

  &:hover,
  &:focus,
  &:disabled {
    opacity: 0.8;
    outline: 0;
  }
`;

const BackButton = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 35px;
  position: absolute;
  top: 20px;
  left: 40px;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`

// JoinGame component
const JoinGame = ({ onJoin }) => {
    const joinGameInputRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleJoinGame = async (e) => {
      e.preventDefault();
  
      try {
        setLoading(true);
        const response = await axios.post(`http://localhost:3001/api/checkRoom`, {
          roomCode: joinGameInputRef.current.value,
        });
  
        if (response.data.success) {
          onJoin(response.data.room);
        } else {
          setErrorMsg(response.data.message || 'Error joining the game.');
        }
      } catch (error) {
        console.error('Error joining game:', error);
        setErrorMsg('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <JoinGameWrapper>
        <BackButton to={`http://localhost:3001/menu`}>Back to Menu</BackButton>
        <JoinGameHeader />
        <JoinGameInstructions />
        <JoinGameForm onSubmit={handleJoinGame}>
          <JoinGameInput
            type="text"
            id="roomCode"
            ref={joinGameInputRef}
            disabled={loading}
            placeholder="Enter Room Code"
          />
          <JoinGameButton type="submit" disabled={loading}>
            Join Game
          </JoinGameButton>
        </JoinGameForm>
        {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
      </JoinGameWrapper>
    );
  };
  
  export default JoinGame;
