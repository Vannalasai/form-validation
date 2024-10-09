import React, { useState, useEffect } from 'react';
import './FormComponent.css';


const FormComponent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dob: '',
    hobbies: [],
    email: '',
    additionalInfo: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [storedData, setStoredData] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('formData');
    if (data) {
      setStoredData(JSON.parse(data));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        hobbies: checked
          ? [...prev.hobbies, value]
          : prev.hobbies.filter((hobby) => hobby !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const { firstName, lastName, phoneNumber, dob, email, hobbies } = formData;

    if (!/^[a-zA-Z]+$/.test(firstName)) {
      alert('First name should contain only alphabets');
      return false;
    }

    if (!/^[a-zA-Z]+$/.test(lastName)) {
      alert('Last name should contain only alphabets');
      return false;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      alert('Phone number should contain exactly 10 digits');
      return false;
    }

    if (new Date().getFullYear() - new Date(dob).getFullYear() < 18) {
      alert('You must be at least 18 years old');
      return false;
    }

    if (hobbies.length < 3) {
      alert('Please select at least 3 hobbies');
      return false;
    }

    if (!/^([a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com))$/.test(email)) {
      alert('Email must be from @gmail.com or @outlook.com');
      return false;
    }

    return true;
  };

  const formatTextArea = (text) => {
    return text
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formattedData = {
      ...formData,
      additionalInfo: formatTextArea(formData.additionalInfo),
    };

    const data = [...storedData];

    if (editIndex > -1) {
      data[editIndex] = formattedData;
      setEditIndex(-1);
    } else {
      data.push(formattedData);
    }

    setStoredData(data);
    localStorage.setItem('formData', JSON.stringify(data));
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      gender: '',
      dob: '',
      hobbies: [],
      email: '',
      additionalInfo: '',
    });
  };

  const handleSearch = () => {
    const data = JSON.parse(localStorage.getItem('formData')) || [];
    const filteredData = data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setStoredData(filteredData);
  };

  const handleEdit = (index) => {
    setFormData(storedData[index]);
    setEditIndex(index);
  };

  return (
    <div className="container">
  <h2>Form with Validation</h2>

  <div className="search-group">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
    <button onClick={handleSearch}>Search</button>
  </div>

  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>First Name: </label>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Last Name: </label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Phone Number: </label>
      <input
        type="text"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Gender: </label>
      <input
        type="radio"
        name="gender"
        value="Male"
        checked={formData.gender === 'Male'}
        onChange={handleChange}
      /> Male
      <input
        type="radio"
        name="gender"
        value="Female"
        checked={formData.gender === 'Female'}
        onChange={handleChange}
      /> Female
      <input
        type="radio"
        name="gender"
        value="Transgender"
        checked={formData.gender === 'Transgender'}
        onChange={handleChange}
      /> Transgender
    </div>
    <div className="form-group">
      <label>Date of Birth: </label>
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Hobbies: </label>
      <input
        type="checkbox"
        name="hobbies"
        value="Reading"
        checked={formData.hobbies.includes('Reading')}
        onChange={handleChange}
      /> Reading
      <input
        type="checkbox"
        name="hobbies"
        value="Writing"
        checked={formData.hobbies.includes('Writing')}
        onChange={handleChange}
      /> Writing
      <input
        type="checkbox"
        name="hobbies"
        value="Cricket"
        checked={formData.hobbies.includes('Cricket')}
        onChange={handleChange}
      /> Cricket
      <input
        type="checkbox"
        name="hobbies"
        value="Football"
        checked={formData.hobbies.includes('Football')}
        onChange={handleChange}
      /> Football
      <input
        type="checkbox"
        name="hobbies"
        value="Chess"
        checked={formData.hobbies.includes('Chess')}
        onChange={handleChange}
      /> Chess
    </div>
    <div className="form-group">
      <label>Additional Information: </label>
      <textarea
        name="additionalInfo"
        value={formData.additionalInfo}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Email: </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>
    <div className="button-group">
      <button type="submit">Submit</button>
    </div>
  </form>

  <div className="stored-data">
    <h3>Stored Data</h3>
    {storedData.map((data, index) => (
      <div key={index}>
        <p>
          <strong>Name:</strong> {data.firstName} {data.lastName}
        </p>
        <p>
          <strong>Phone Number:</strong> {data.phoneNumber}
        </p>
        <p>
          <strong>Gender:</strong> {data.gender}
        </p>
        <p>
          <strong>Date of Birth:</strong> {data.dob}
        </p>
        <p>
          <strong>Hobbies:</strong> {data.hobbies.join(', ')}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Additional Information:</strong> {data.additionalInfo}
        </p>
        <button onClick={() => handleEdit(index)}>Edit</button>
      </div>
    ))}
  </div>
</div>

  );
};

export default FormComponent;
