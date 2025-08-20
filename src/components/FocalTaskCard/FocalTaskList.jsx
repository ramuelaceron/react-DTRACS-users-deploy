import React from 'react';
import FocalTaskCard from './FocalTaskCard';
import './FocalTaskCard.css';
import { useNavigate } from "react-router-dom"; 


const FocalTaskList = ({ filterTitle, titles }) => {
  const navigate = useNavigate();

  const allCards = [
    { title: 'School Management and Evaluation Section', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Monitoring and Evaluation', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Research', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Planning', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Human Resource Development Section', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Dental', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Medical', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'SBFP', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'GPP', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'WINS', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'NDEP', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'RH', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Education Facilities Section', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Social Mobilization and Networking Section', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Disaster Risk Reduction and Management Unit', focalPerson: 'Focal Name', path: "task-list" },
    { title: 'Youth Formation Section', focalPerson: 'Focal Name', path: "task-list" },
  ];

   let displayedCards;

  if (titles && Array.isArray(titles)) {
    displayedCards = allCards.filter((card) => titles.includes(card.title));
  } else if (filterTitle) {
    displayedCards = allCards.filter((card) =>
      card.title.toLowerCase().includes(filterTitle.toLowerCase())
    );
  } else {
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
            // FocalTaskList.js
            onClick={card.path 
              ? () => navigate(card.path, { 
                  state: { 
                    title: card.title, 
                    focalPerson: card.focalPerson 
                  } 
                }) 
              : undefined
            }
          />
        ))
      ) : (
        <p>No matching focal task found.</p>
      )}
    </div>
  );
};

export default FocalTaskList;