import { useState } from 'react'
import './App.css'
import { GameState, Player, Card as CardType } from './types/game'
import { createDeck, calculateScore } from './utils/gameUtils'
import Card from './components/Card'

function App() {
  const initialGameState = (): GameState => {
    const deck = createDeck()
    return {
      deck,
      player: {
        hand: [deck.pop()!, deck.pop()!],
        score: 0,
        busted: false
      },
      dealer: {
        hand: [deck.pop()!, deck.pop()!],
        score: 0,
        busted: false
      },
      gameOver: false,
      winner: null
    }
  }

  const [gameState, setGameState] = useState<GameState>(initialGameState())

  const updateScores = (state: GameState) => {
    state.player.score = calculateScore(state.player.hand)
    state.dealer.score = calculateScore(state.dealer.hand)
    state.player.busted = state.player.score > 21
    state.dealer.busted = state.dealer.score > 21
  }

  const hit = () => {
    if (gameState.gameOver) return

    const newState = { ...gameState }
    const card = newState.deck.pop()
    if (!card) return

    newState.player.hand.push(card)
    updateScores(newState)

    if (newState.player.busted) {
      newState.gameOver = true
      newState.winner = 'dealer'
    }

    setGameState(newState)
  }

  const stand = () => {
    if (gameState.gameOver) return

    const newState = { ...gameState }
    
    // Dealer's turn
    while (calculateScore(newState.dealer.hand) < 17) {
      const card = newState.deck.pop()
      if (!card) break
      newState.dealer.hand.push(card)
    }

    updateScores(newState)
    newState.gameOver = true

    // Determine winner
    if (newState.dealer.busted) {
      newState.winner = 'player'
    } else if (newState.dealer.score > newState.player.score) {
      newState.winner = 'dealer'
    } else if (newState.dealer.score < newState.player.score) {
      newState.winner = 'player'
    } else {
      newState.winner = 'tie'
    }

    setGameState(newState)
  }

  const newGame = () => {
    setGameState(initialGameState())
  }

  return (
    <div className="app" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Blackjack</h1>
      
      <div className="dealer-section" style={{ marginBottom: '40px' }}>
        <h2>Dealer's Hand {gameState.gameOver && `(Score: ${gameState.dealer.score})`}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {gameState.dealer.hand.map((card, index) => (
            <div key={`${card.suit}-${card.rank}`}>
              {(index === 0 || gameState.gameOver) ? (
                <Card card={card} />
              ) : (
                <div className="card-back" style={{
                  width: '100px',
                  height: '140px',
                  border: '2px solid #000',
                  borderRadius: '10px',
                  backgroundColor: '#b22222',
                  margin: '5px'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="player-section" style={{ marginBottom: '20px' }}>
        <h2>Your Hand (Score: {gameState.player.score})</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {gameState.player.hand.map((card) => (
            <Card key={`${card.suit}-${card.rank}`} card={card} />
          ))}
        </div>
      </div>

      <div className="controls" style={{ marginBottom: '20px' }}>
        {!gameState.gameOver ? (
          <>
            <button onClick={hit} style={{ margin: '0 10px', padding: '10px 20px' }}>Hit</button>
            <button onClick={stand} style={{ margin: '0 10px', padding: '10px 20px' }}>Stand</button>
          </>
        ) : (
          <button onClick={newGame} style={{ padding: '10px 20px' }}>New Game</button>
        )}
      </div>

      {gameState.gameOver && (
        <div className="game-result" style={{ marginTop: '20px' }}>
          <h2>
            {gameState.winner === 'player' && 'You Win! 🎉'}
            {gameState.winner === 'dealer' && 'Dealer Wins! 😢'}
            {gameState.winner === 'tie' && "It's a Tie! 🤝"}
          </h2>
        </div>
      )}
    </div>
  )
}

export default App
