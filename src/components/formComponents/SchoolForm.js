import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SchoolForm = ({ formData, setFormData }) => {
  const { schoolUser } = useAuth()

  const handleClassToggle = (cls) => {
    setFormData((prev) => ({
      ...prev,
      classes: prev.classes.includes(cls)
        ? prev.classes.filter((c) => c !== cls)
        : [...prev.classes, cls],
    }))
  }

  const handleStreamChange = (index, value) => {
    const updated = [...formData.streams]
    updated[index] = value
    setFormData((prev) => ({ ...prev, streams: updated }))
  }

  const handleAddStream = () => {
    setFormData((prev) => ({ ...prev, streams: [...prev.streams, ''] }))
  }

  const handleRemoveStream = (index) => {
    setFormData((prev) => ({
      ...prev,
      streams: prev.streams.filter((_, i) => i !== index),
    }))
  }

  const renderClassCheckboxes = () => {
    const levels =
      formData.educationLevel === 'primary level'
        ? [
            'Primary 1',
            'Primary 2',
            'Primary 3',
            'Primary 4',
            'Primary 5',
            'Primary 6',
            'Primary 7',
          ]
        : ['Senior 1', 'Senior 2', 'Senior 3', 'Senior 4']

    return (
      <div className="mt-3">
        <label>Classes</label>
        {levels.map((cls) => (
          <div className="d-flex gap-2" key={cls}>
            <input
              type="checkbox"
              id={cls}
              checked={formData.classes.includes(cls)}
              onChange={() => handleClassToggle(cls)}
            />
            <label htmlFor={cls} className="p-0 m-0">
              {cls}
            </label>
          </div>
        ))}
      </div>
    )
  }

  const renderStreams = () => (
    <div className="mt-3">
      <label>Streams</label>
      {formData.streams.map((stream, index) => (
        <div key={index} className="d-flex align-items-center gap-2 mb-2">
          <input
            type="text"
            value={stream}
            onChange={(e) => handleStreamChange(index, e.target.value)}
            className="form-control"
            placeholder={`Stream ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => handleRemoveStream(index)}
            className="btn btn-danger"
            style={{ height: '38px' }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddStream}
        className="btn btn-secondary"
        style={{ height: '38px' }}
      >
        Add Stream
      </button>
    </div>
  )

  return (
    <div className="d-flex flex-column gap-3 mt-4">
      <div>
        <label htmlFor="schoolName">School Name</label>
        <input
          className="form-control"
          type="text"
          id="schoolName"
          value={formData.schoolName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, schoolName: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label htmlFor="schoolLogo">School Logo</label>
        <input
          type="file"
          id="schoolLogo"
          accept="image/*"
          className="form-control"
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, schoolLogo: e.target.files[0] }))
          }
        />
        {formData.schoolLogo && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(formData.schoolLogo)}
              alt="Preview"
              style={{ maxWidth: '150px', maxHeight: '150px' }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="educationLevel">Educational Level</label>
        <select
          id="educationLevel"
          className="form-select"
          value={formData.educationLevel}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              educationLevel: e.target.value,
              classes: [],
            }))
          }}
          required
        >
          <option value="">Select level ...</option>
          <option value="primary">Primary Level</option>
          <option value="secondary">Secondary Level</option>
        </select>
      </div>

      <div>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          value={formData.schoolAddress}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, schoolAddress: e.target.value }))
          }
          className="form-control"
        />
      </div>

      <div>
        <label htmlFor="schoolPhone">School Phone Number</label>
        <input
          type="tel"
          id="schoolPhone"
          value={formData.schoolPhone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, schoolPhone: e.target.value }))
          }
          className="form-control"
          required
        />
      </div>

      <div>
        <label htmlFor="email">School Email</label>
        <input
          type="email"
          id="email"
          value={formData.schoolEmail}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, schoolEmail: e.target.value }))
          }
          className="form-control"
          required
        />
      </div>

      {formData.educationLevel && renderClassCheckboxes()}
      {formData.educationLevel && renderStreams()}
    </div>
  )
}

export default SchoolForm
