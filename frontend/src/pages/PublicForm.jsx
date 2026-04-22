import { useState } from 'react';
import axios from 'axios';
import {
  UploadCloud, CheckCircle, User, Phone, MapPin,
  Tag, AlertTriangle, FileText, ArrowRight, X
} from 'lucide-react';

const CATEGORY_MAP = {
  'Road & Transport Issues': [
    'Potholes (road holes)',
    'Road cracks / damaged roads',
    'Waterlogging (mazhai water nikkaradhu)',
    'Missing road markings',
    'Traffic congestion hotspots',
    'Broken speed breakers'
  ],
  'Sanitation & Waste Issues': [
    'Garbage overflow',
    'Illegal dumping',
    'Uncollected waste',
    'Open drainage',
    'Blocked sewage system',
    'Public toilet unclean'
  ],
  'Electricity & Street Infrastructure': [
    'Streetlight not working',
    'Flickering lights',
    'Broken electric poles',
    'Hanging wires (danger)',
    'Transformer issues'
  ],
  'Water Supply Issues': [
    'Water leakage',
    'Burst pipelines',
    'No water supply',
    'Contaminated water',
    'Low pressure supply'
  ],
  'Public Safety & Environment': [
    'Fallen trees blocking road',
    'Stray animals (dogs, cattle)',
    'Construction debris',
    'Air pollution complaints',
    'Noise pollution'
  ],
  'Public Infrastructure Issues': [
    'Broken bus stops',
    'Damaged public buildings',
    'Park maintenance issues',
    'Broken benches / public assets',
    'Missing sign boards'
  ]
};

const CATEGORIES = Object.keys(CATEGORY_MAP);

function PublicForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    category: CATEGORIES[0],
    problemType: CATEGORY_MAP[CATEGORIES[0]][0],
    issue: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData({ ...formData, category: value, problemType: CATEGORY_MAP[value][0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    if (image) submitData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/reports', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setFormData({
        name: '',
        mobile: '',
        location: '',
        category: CATEGORIES[0],
        problemType: CATEGORY_MAP[CATEGORIES[0]][0],
        issue: ''
      });
      setImage(null);
      setPreview('');
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Failed to submit report. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Success screen ─────────────────────────── */
  if (success) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div className="card animate-in text-center" style={{ maxWidth: 480, width: '100%', padding: '3rem 2.5rem' }}>
          <div style={{
            width: 72, height: 72,
            background: 'var(--success-bg)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '2px solid #a7f3d0'
          }}>
            <CheckCircle size={36} color="var(--success)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Report Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
            Thank you for contributing to your community. Our team will review and resolve the issue shortly.
          </p>
          <button onClick={() => setSuccess(false)} className="btn btn-primary btn-lg w-full">
            Submit Another Report
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  /* ─── Form ───────────────────────────────────── */
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>

      {/* Hero strip */}
      <div style={{
        background: 'var(--gradient)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem 2rem',
        marginBottom: '1.5rem',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: 48, height: 48,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <h1 style={{ color: '#fff', marginBottom: '0.2rem', fontSize: '1.375rem' }}>Report a Civic Issue</h1>
          <p style={{ opacity: 0.85, fontSize: '0.875rem', margin: 0 }}>Help us keep the city clean, safe &amp; functional</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="card" style={{ padding: '2rem' }}>

        <form onSubmit={handleSubmit}>
          {/* Row: Name + Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <User size={13} /> Full Name
                </span>
              </label>
              <input
                type="text" name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Phone size={13} /> Mobile Number
                </span>
              </label>
              <input
                type="tel" name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="9876543210"
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} /> Location
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          setFormData(prev => ({ ...prev, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
                        },
                        (error) => {
                          console.error("Error getting location", error);
                          alert("Unable to retrieve your location. Please enter it manually.");
                        }
                      );
                    } else {
                      alert("Geolocation is not supported by your browser.");
                    }
                  }}
                  style={{
                    background: 'none', border: 'none', color: 'var(--accent)',
                    fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.2rem',
                    padding: '0.2rem 0.5rem', borderRadius: '4px',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--accent-light)'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  <MapPin size={12} /> Get Live Location
                </button>
              </div>
            </label>
            <input
              type="text" name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter address or landmark..."
            />
          </div>

          {/* Row: Category + Problem Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Tag size={13} /> Category
                </span>
              </label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangle size={13} /> Problem Type
                </span>
              </label>
              <select name="problemType" value={formData.problemType} onChange={handleChange} className="form-control">
                {CATEGORY_MAP[formData.category].map(prob => (
                  <option key={prob} value={prob}>{prob}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Comments */}
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FileText size={13} /> Additional Comments
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
              </span>
            </label>
            <textarea
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Describe any additional details about the issue..."
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <UploadCloud size={13} /> Upload Evidence
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
              </span>
            </label>

            {preview ? (
              <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border)'
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 28, height: 28,
                    background: 'rgba(15,23,42,0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'white'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-upload-input"
                />
                <div className="file-upload-icon">
                  <UploadCloud size={22} />
                </div>
                <div className="file-upload-label">
                  <strong>Click to upload</strong> or drag &amp; drop
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                    PNG, JPG, JPEG up to 10MB
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="divider" />

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Submitting Report...
              </>
            ) : (
              <>
                Submit Report
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublicForm;
