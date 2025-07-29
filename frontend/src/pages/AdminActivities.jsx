import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    month: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    reward: 150,
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/challenges/${editId}`, formData);
      } else {
        await axios.post('/api/challenges', formData);
      }
      fetchActivities();
      setFormData({ title: '', description: '', content: '', month: '', options: ['', '', '', ''], correctIndex: 0, reward: 150 });
      setEditId(null);
    } catch (err) {
      console.error('Error saving challenge', err);
    }
  };

  const handleEdit = (activity) => {
    setFormData(activity);
    setEditId(activity._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      await axios.delete(`/api/challenges/${id}`);
      fetchActivities();
    }
  };

  return (
    <div className="admin-activities">
      <h2>Manage Activities</h2>

      <form onSubmit={handleSubmit} className="activity-form">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Short description" required />
        <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Main content or reading" required />
        <input name="month" value={formData.month} onChange={handleChange} placeholder="YYYY-MM" required />
        <input type="number" name="reward" value={formData.reward} onChange={handleChange} placeholder="Reward Points" />

        <div className="options">
          {formData.options.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              required
            />
          ))}
        </div>

        <label>
          Correct Option Index (0-3):
          <input type="number" name="correctIndex" value={formData.correctIndex} onChange={handleChange} min="0" max="3" />
        </label>

        <button type="submit">{editId ? 'Update' : 'Create'} Activity</button>
      </form>

      <table className="activities-table">
        <thead>
          <tr>
            <th>Title</th>
  
            <th>Reward</th>
    
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(act => (
            <tr key={act._id}>
              <td>{act.title}</td>
              <td>{act.reward}</td>
              <td>
                <button onClick={() => handleEdit(act)}>Edit</button>
                <button onClick={() => handleDelete(act._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminActivities;
