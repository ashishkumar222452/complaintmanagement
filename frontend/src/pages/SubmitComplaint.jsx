import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { complaintApi, categoryApi } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { LoadingSpinner, Alert } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import {
  Send,
  UploadCloud,
  X,
  CheckCircle,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  FileText
} from 'lucide-react';

export const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getActive();
        setCategories(res.data.categories || []);
        if (res.data.categories?.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data.categories[0].name }));
        }
      } catch (err) {
        setError('Failed to fetch complaint categories');
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size exceeds 5MB limit. Please upload a smaller photo.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      return setError('Please fill in all required fields');
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('priority', formData.priority);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await complaintApi.submit(data);
      setSubmittedComplaint(res.data.complaint);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedComplaint?.complaintId) {
      navigator.clipboard.writeText(submittedComplaint.complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <DashboardLayout
      title="Submit a Complaint"
      subtitle="Fill in the details below to lodge an official college grievance"
    >
      <div className="max-w-3xl mx-auto">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {loadingCats ? (
          <LoadingSpinner text="Loading complaint categories..." />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Priority Level *
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="Low">Low - Minor inconvenience</option>
                    <option value="Medium">Medium - Normal attention required</option>
                    <option value="High">High - Impeding daily activities</option>
                    <option value="Urgent">Urgent - Emergency / Safety hazard</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Complaint Subject / Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="e.g. Air conditioning not functioning in CS Lab 3"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Keep it concise and clear ({formData.title.length}/150 characters)
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Provide precise details: location, when the issue began, room number, equipment model, and impact..."
                  className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
                ></textarea>
              </div>

              {/* Photo Evidence Attachment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Image Attachment (Optional)
                </label>

                {!imagePreview ? (
                  <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all">
                    <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-slate-700">
                      Click to upload photo evidence
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      PNG, JPG, JPEG or WEBP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden p-2 bg-slate-50">
                    <img
                      src={imagePreview}
                      alt="Upload Preview"
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-slate-500 mt-1 block text-center truncate w-48">
                      {imageFile?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting Complaint...' : 'Register Complaint'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {submittedComplaint && (
        <Modal
          isOpen={true}
          onClose={() => navigate('/my-complaints')}
          title="Complaint Registered Successfully"
        >
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Your complaint has been lodged!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                An administrator has been notified. Use your unique ID below to monitor updates.
              </p>
            </div>

            <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-between border border-slate-200">
              <span className="font-mono font-extrabold text-blue-700 text-base tracking-wider">
                {submittedComplaint.complaintId}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:text-blue-600 border border-slate-200 rounded-lg text-xs font-bold shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy ID'}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/complaint/${submittedComplaint.complaintId}`)}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm"
              >
                View Complaint Tracking
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedComplaint(null);
                  setFormData({
                    title: '',
                    description: '',
                    category: categories[0]?.name || '',
                    priority: 'Medium'
                  });
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl"
              >
                File Another
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default SubmitComplaint;
