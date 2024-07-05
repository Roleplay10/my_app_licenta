// src/components/Announcements/AddAnnouncement.tsx

import React, { useState } from 'react';
import CreateAxiosInstance from '../../services/axiosService';
import './AdminAnnouncement.css';

interface Link {
  url: string;
  label: string;
}

const AddAnnouncement: React.FC = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [links, setLinks] = useState<Link[]>([{ url: '', label: '' }]);
  const axiosInstance = CreateAxiosInstance();

  const handleAddLink = () => {
    setLinks([...links, { url: '', label: '' }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, idx) => idx !== index));
  };

  const handleLinkChange = (index: number, key: keyof Link, value: string) => {
    const newLinks = [...links];
    newLinks[index][key] = value;
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const announcement = { title, date, content, links };
    try {
      await axiosInstance.post('http://localhost:5270/api/Announcement', announcement, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Announcement added successfully!');
    } catch (error) {
      console.error('Error adding announcement:', error);
      alert('Failed to add announcement.');
    }
  };

  return (
    <div className="add-announcement-container">
      <h1>Add Announcement</h1>
      <form onSubmit={handleSubmit} className="announcement-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Links</label>
          {links.map((link, index) => (
            <div key={index} className="link-group">
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                required
              />
              <button type="button" onClick={() => handleRemoveLink(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddLink}>Add Link</button>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddAnnouncement;
