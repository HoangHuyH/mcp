import { Card as CardType } from '../types/game';

interface CardProps {
  card: CardType;
  index?: number;
}

const Card: React.FC<CardProps> = ({ card, index = 0 }) => {
  const getColor = () => {
    return card.suit === 'hearts' || card.suit === 'diamonds' ? '#e31b23' : '#000000';
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
    <div 
      className="card" 
      style={{
        width: '120px',
        height: '168px',
        border: '2px solid #000',
        borderRadius: '12px',
        padding: '12px',
        backgroundColor: 'white',
        color: getColor(),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontSize: '1.8rem',
        position: 'relative',
        animationDelay: `${index * 0.1}s`,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transform: 'perspective(1000px)',
        transition: 'transform 0.3s ease',
        margin: '0',
        userSelect: 'none'
      }}
    >
      <div style={{ 
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontWeight: 'bold',
        lineHeight: '1'
      }}>
        <div style={{ fontSize: '1.8rem' }}>{card.rank}</div>
        <div style={{ fontSize: '2rem', marginTop: '-4px' }}>{getSuitSymbol()}</div>
      </div>
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        transform: 'rotate(180deg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontWeight: 'bold',
        lineHeight: '1'
      }}>
        <div style={{ fontSize: '1.8rem' }}>{card.rank}</div>
        <div style={{ fontSize: '2rem', marginTop: '-4px' }}>{getSuitSymbol()}</div>
      </div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '3.5rem',
        opacity: 0.15
      }}>
        {getSuitSymbol()}
      </div>
    </div>
  );
};

export default Card; 