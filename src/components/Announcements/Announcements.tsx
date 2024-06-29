// src/components/Announcements/Announcements.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Announcements.css';

interface Link {
  url: string;
  label: string;
}

interface Announcement {
  title: string;
  date: string;
  content: string;
  links?: Link[];
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5270/api/Announcement', {
          headers: { 'accept': 'text/plain' }
        });
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="announcements-container">
      <h1>Anunțuri</h1>
      <ul className="announcement-list">
        {announcements.map((announcement, index) => (
          <li key={index} className="announcement-item">
            <h2 onClick={() => handleExpand(index)} className="announcement-title">{announcement.title}</h2>
            <p className="announcement-date">{`Posted: ${announcement.date}`}</p>
            {expandedIndex === index && (
              <>
                <p className="announcement-content">{announcement.content}</p>
                {announcement.links && announcement.links.length > 0 && (
                  <ul className="announcement-links">
                    {announcement.links.map((link, idx) => (
                      <li key={idx}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
