import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const getColor = () => {
    return card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black';
  };

  const getSuitSymbol = () => {
    switch (card.suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
    }
  };

  return (
    <div className="card" style={{
      width: '100px',
      height: '140px',
      border: '2px solid #000',
      borderRadius: '10px',
      padding: '10px',
      margin: '5px',
      backgroundColor: 'white',
      color: getColor(),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontSize: '1.5rem',
      position: 'relative',
    }}>
      <div style={{ textAlign: 'left' }}>
        {card.rank}
        <div>{getSuitSymbol()}</div>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        transform: 'rotate(180deg)',
      }}>
        {card.rank}
        <div>{getSuitSymbol()}</div>
      </div>
    </div>
  );
};

export default Card; 