import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminWeeklyActs.css'

export default function AdminWeeklyActs() {
  const [challenges, setChallenges] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    reward: 150,
    options: ['', '', '', ''],
    correctIndex: 0,
    month: new Date().toISOString().slice(0, 7),
  });
  const [editingChallengeId, setEditingChallengeId] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/challenges');
      setChallenges(res.data);
    } catch (err) {
      console.error('❌ Error fetching challenges:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingChallengeId) {
        await axios.put(`http://localhost:5000/api/challenges/${editingChallengeId}`, formData);
        alert('✅ Challenge updated');
      } else {
        await axios.post('http://localhost:5000/api/challenges', formData);
        alert('✅ Challenge created');
      }
      setFormData({
        title: '',
        description: '',
        content: '',
        reward: 150,
        options: ['', '', '', ''],
        correctIndex: 0,
        month: new Date().toISOString().slice(0, 7),
      });
      setEditingChallengeId(null);
      fetchChallenges();
    } catch (err) {
      console.error('❌ Error saving challenge:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/challenges/${id}`);
      alert('✅ Challenge deleted');
      fetchChallenges();
    } catch (err) {
      console.error('❌ Error deleting challenge:', err);
    }
  };

  const handleEdit = (challenge) => {
    setFormData(challenge);
    setEditingChallengeId(challenge._id);
  };

  return (
    <div className="adminweekly-container">
      <h2 className="admin-title-weekly">Weekly Challenges</h2>

      <form className="challenge-form" onSubmit={handleSubmit}>
        <h3>{editingChallengeId ? 'Edit Challenge' : 'Create New Challenge'}</h3>

        <input type="text" placeholder="Title" value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />

        <textarea placeholder="Description" value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />

        <textarea placeholder="Content / Instructions" value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })} required />

        <input type="number" placeholder="Reward" value={formData.reward}
          onChange={(e) => setFormData({ ...formData, reward: Number(e.target.value) })} required />

        <div className="options-grid">
          {formData.options.map((option, index) => (
            <input key={index} type="text" placeholder={`Option ${index + 1}`} value={option}
              onChange={(e) => {
                const updatedOptions = [...formData.options];
                updatedOptions[index] = e.target.value;
                setFormData({ ...formData, options: updatedOptions });
              }} required />
          ))}
        </div>

        <input type="month" value={formData.month}
          onChange={(e) => setFormData({ ...formData, month: e.target.value })} required />

        <select value={formData.correctIndex}
          onChange={(e) => setFormData({ ...formData, correctIndex: Number(e.target.value) })} required>
          {formData.options.map((_, index) => (
            <option key={index} value={index}>Correct: Option {index + 1}</option>
          ))}
        </select>

        <button type="submit">
          {editingChallengeId ? 'Update Challenge' : 'Create Challenge'}
        </button>
      </form>

      <div className="challenge-list">
        <h2>Aviable Weekly Challenges</h2>
        {challenges.map((challenge) => (
          <div key={challenge._id} className="challenge-card">
            <div>
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
              <p>{challenge.content}</p>
            </div>
            <div className="btn-group">
              <button className="edit-btn" onClick={() => handleEdit(challenge)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(challenge._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
