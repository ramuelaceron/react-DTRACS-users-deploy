// FocalTaskList.js
import React from 'react';
import FocalTaskCard from './FocalTaskCard';
import './FocalTaskCard.css'; // Styles are reused

const FocalTaskList = ({ filterTitle, titles }) => {
  const allCards = [
    { title: 'School Management and Evaluation Section', focalPerson: 'Focal Name' },
    { title: 'Monitoring and Evaluation', focalPerson: 'Focal Name' },
    { title: 'Research', focalPerson: 'Focal Name' },
    { title: 'Planning', focalPerson: 'Focal Name' },
    { title: 'Human Resource Development Section', focalPerson: 'Focal Name' },
    { title: 'School Health Section', focalPerson: 'Focal Name' },
    { title: 'Education Facilities Section', focalPerson: 'Focal Name' },
    { title: 'Social Mobilization and Networking Section', focalPerson: 'Focal Name' },
    { title: 'Disaster Risk Reduction and Management Unit', focalPerson: 'Focal Name' },
    { title: 'Youth Formation Section', focalPerson: 'Focal Name' },
  ];

  let displayedCards;

  if (titles && Array.isArray(titles)) {
    // Show only the cards whose titles are in the `titles` array
    displayedCards = allCards.filter((card) => titles.includes(card.title));
  } else if (filterTitle) {
    // Backward compatibility: filter by partial match
    displayedCards = allCards.filter((card) =>
      card.title.toLowerCase().includes(filterTitle.toLowerCase())
    );
  } else {
    // Show all
    displayedCards = allCards;
  }


  return (
   <div className="focal-task-list">
      {displayedCards.length > 0 ? (
        displayedCards.map((card, index) => (
          <FocalTaskCard
            key={index}
            title={card.title}
            focalPerson={card.focalPerson}
          />
        ))
      ) : (
        <p>No matching focal task found.</p>
      )}
    </div>
  );
};

export default FocalTaskList;