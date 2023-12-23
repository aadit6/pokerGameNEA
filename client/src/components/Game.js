import React, { Component } from 'react';
import styled from 'styled-components';
// import axios from 'axios';
import { io } from 'socket.io-client';

import { SERVER_URL } from '../constants';

const socket = io(SERVER_URL, {
  withCredentials: true,
});

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboard: [],
      hand: [],
      board: {},
    };
  }

  componentDidMount() {
    socket.on('leaderboard', (leaderboard) => {
      this.setState({ leaderboard });
    });

    socket.on('hand', (hand) => {
      this.setState({ hand });
    });

    socket.on('board', (board) => {
      this.setState({ board });
    });

    // Add event listener for joining a room
    socket.on('join_ack', ({ id, name }) => {
      console.log(`Joined room with ID: ${id} and username: ${name}`);
    });

    // Add more socket event listeners if needed
  }

  // Add a function to emit 'joinRoom' event
  joinRoom(roomId) {
    socket.emit('joinRoom', roomId);
  }

  // Add other functions based on your game logic

  render() {
    const { leaderboard, hand} = this.state; // ,board

    return (
      <GameWrapper>
        <Leaderboard>
          <h2>Leaderboard</h2>
          <ul>
            {leaderboard.map((player) => (
              <li key={player.name}>
                {player.name} - Score: {player.score}
              </li>
            ))}
          </ul>
        </Leaderboard>
        <Hand>
          <h2>Your Hand</h2>
          <ul>
            {hand.map((card, index) => (
              <li key={index}>{card}</li>
            ))}
          </ul>
        </Hand>
        <GameContent>
          <button onClick={() => this.joinRoom('yourRoomId')}>
            Join Room
          </button>
          {/* ... Add your main game components and logic here */}
        </GameContent>
      </GameWrapper>
    );
  }
}

const GameWrapper = styled.div`
  /* Add your styling for the game wrapper */
`;

const Leaderboard = styled.div`
  /* Add your styling for the leaderboard */
`;

const Hand = styled.div`
  /* Add your styling for the player's hand */
`;

const GameContent = styled.div`
  /* Add your styling for the main game content */
`;

export default Game;
