import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { GameState, Player, Card as CardType } from './types/game'
import { createDeck, calculateScore } from './utils/gameUtils'
import Card from './components/Card'

function App() {
  // Create audio elements with the correct paths
  const winSound = new Audio('/sounds/win.mp3')
  const loseSound = new Audio('/sounds/lose.mp3')

  const initialGameState = (): GameState => {
    const deck = createDeck()
    const initialState = {
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
    
    // Calculate initial scores
    initialState.player.score = calculateScore(initialState.player.hand)
    initialState.dealer.score = calculateScore(initialState.dealer.hand)
    
    return initialState
  }

  const [gameState, setGameState] = useState<GameState>(initialGameState())
  const [animatingCard, setAnimatingCard] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    // Preload sounds
    const sounds = [winSound, loseSound]
    Promise.all(sounds.map(sound => {
      sound.volume = 0.5 // Set volume to 50%
      return new Promise((resolve) => {
        sound.addEventListener('canplaythrough', resolve, { once: true })
        sound.load()
      })
    })).then(() => {
      setSoundEnabled(true)
      console.log('Sounds loaded successfully')
    }).catch(error => {
      console.error('Error loading sounds:', error)
    })

    // Cleanup function
    return () => {
      sounds.forEach(sound => {
        sound.pause()
        sound.currentTime = 0
      })
    }
  }, [])

  const playSound = useCallback(async (result: 'win' | 'lose') => {
    if (!soundEnabled) return

    try {
      const sound = result === 'win' ? winSound : loseSound
      sound.currentTime = 0
      await sound.play()
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }, [soundEnabled])

  const hit = async () => {
    if (gameState.gameOver || animatingCard) return

    setAnimatingCard(true)
    const newState = { ...gameState }
    const card = newState.deck.pop()
    if (!card) return

    newState.player.hand.push(card)
    newState.player.score = calculateScore(newState.player.hand)
    newState.player.busted = newState.player.score > 21

    if (newState.player.busted) {
      newState.gameOver = true
      newState.winner = 'dealer'
      await playSound('lose')
    }

    setGameState(newState)
    setTimeout(() => setAnimatingCard(false), 500)
  }

  const stand = async () => {
    if (gameState.gameOver) return

    const newState = { ...gameState }
    
    // Dealer's turn
    while (calculateScore(newState.dealer.hand) < 17) {
      const card = newState.deck.pop()
      if (!card) break
      newState.dealer.hand.push(card)
    }

    newState.dealer.score = calculateScore(newState.dealer.hand)
    newState.dealer.busted = newState.dealer.score > 21

    if (newState.dealer.busted) {
      newState.winner = 'player'
      await playSound('win')
    } else if (newState.dealer.score > newState.player.score) {
      newState.winner = 'dealer'
      await playSound('lose')
    } else if (newState.dealer.score < newState.player.score) {
      newState.winner = 'player'
      await playSound('win')
    } else {
      newState.winner = 'tie'
    }

    newState.gameOver = true
    setGameState(newState)
  }

  const newGame = () => {
    setGameState(initialGameState())
  }

  return (
    <div className="app">
      <div className="game-container">
        <h1>♠️ Blackjack ♦️</h1>
        
        <div className="dealer-section">
          <h2>Dealer's Hand</h2>
          <div className="score-display">
            {gameState.gameOver && `Score: ${gameState.dealer.score}`}
          </div>
          <div className="card-container">
            {gameState.dealer.hand.map((card, index) => (
              <div key={`${card.suit}-${card.rank}`}>
                {(index === 0 || gameState.gameOver) ? (
                  <Card card={card} index={index} />
                ) : (
                  <div className="card-back" style={{
                    border: '2px solid #000',
                    borderRadius: '12px',
                    margin: '0',
                    animationDelay: `${index * 0.1}s`
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="player-section">
          <h2>Your Hand</h2>
          <div className="score-display">Score: {gameState.player.score}</div>
          <div className="card-container">
            {gameState.player.hand.map((card, index) => (
              <Card 
                key={`${card.suit}-${card.rank}`} 
                card={card}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="controls">
          {!gameState.gameOver ? (
            <>
              <button 
                onClick={hit} 
                disabled={animatingCard}
                style={{ opacity: animatingCard ? 0.7 : 1 }}
              >
                Hit
              </button>
              <button 
                onClick={stand}
                disabled={animatingCard}
                style={{ opacity: animatingCard ? 0.7 : 1 }}
              >
                Stand
              </button>
            </>
          ) : (
            <button onClick={newGame}>New Game</button>
          )}
        </div>

        {gameState.gameOver && (
          <div className="game-result">
            <h2>
              {gameState.winner === 'player' && '🎰 You Win! 🎉'}
              {gameState.winner === 'dealer' && '😢 Dealer Wins! 🎲'}
              {gameState.winner === 'tie' && "🤝 It's a Tie! 🎲"}
            </h2>
          </div>
        )}
      </div>
      <div className="casino-girl" />
    </div>
  )
}

export default App
