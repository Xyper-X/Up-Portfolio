import React, { useEffect, useState } from 'react';
import { Plus, Trash2, LogOut, Shield } from 'lucide-react';
import {
  getSkills,
  addSkill,
  deleteSkill,
  getCertificates,
  addCertificate,
  deleteCertificate,
  getAchievements,
  addAchievement,
  deleteAchievement,
  getAllBlogs,
  addBlog,
  deleteBlog,
  getResume,
  updateResume,
  Skill,
  Certificate,
  Achievement,
  Blog,
  Resume,
} from '../lib/supabase';

type TabType = 'skills' | 'certificates' | 'achievements' | 'blogs' | 'resume';

export function AdminContentManager() {
  const [activeTab, setActiveTab] = useState<TabType>('skills');
  const [loading, setLoading] = useState(true);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);

  const [skillForm, setSkillForm] = useState({ name: '', category: '', proficiency: 'Intermediate', order_index: 0 });
  const [certForm, setCertForm] = useState({ title: '', issuer: '', issue_date: '', expiry_date: '', credential_url: '', image_url: '', order_index: 0 });
  const [achieveForm, setAchieveForm] = useState({ title: '', description: '', achievement_date: '', image_url: '', order_index: 0 });
  const [blogForm, setBlogForm] = useState({ title: '', description: '', content: '', image_url: '', published: false, published_date: '', order_index: 0 });
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [skillsData, certsData, achieveData, blogsData, resumeData] = await Promise.all([
        getSkills(),
        getCertificates(),
        getAchievements(),
        getAllBlogs(),
        getResume(),
      ]);
      setSkills(skillsData);
      setCertificates(certsData);
      setAchievements(achieveData);
      setBlogs(blogsData);
      setResume(resumeData);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!skillForm.name || !skillForm.category) return;
    try {
      const newSkill = await addSkill({
        ...skillForm,
        order_index: skills.length,
      });
      setSkills([...skills, newSkill]);
      setSkillForm({ name: '', category: '', proficiency: 'Intermediate', order_index: 0 });
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleAddCertificate = async () => {
    if (!certForm.title || !certForm.issuer || !certForm.issue_date) return;
    try {
      const newCert = await addCertificate({
        ...certForm,
        order_index: certificates.length,
      });
      setCertificates([...certificates, newCert]);
      setCertForm({ title: '', issuer: '', issue_date: '', expiry_date: '', credential_url: '', image_url: '', order_index: 0 });
    } catch (error) {
      console.error('Error adding certificate:', error);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    try {
      await deleteCertificate(id);
      setCertificates(certificates.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const handleAddAchievement = async () => {
    if (!achieveForm.title || !achieveForm.description || !achieveForm.achievement_date) return;
    try {
      const newAchieve = await addAchievement({
        ...achieveForm,
        order_index: achievements.length,
      });
      setAchievements([...achievements, newAchieve]);
      setAchieveForm({ title: '', description: '', achievement_date: '', image_url: '', order_index: 0 });
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    try {
      await deleteAchievement(id);
      setAchievements(achievements.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  const handleAddBlog = async () => {
    if (!blogForm.title || !blogForm.description) return;
    try {
      const newBlog = await addBlog({
        ...blogForm,
        published_date: blogForm.published ? new Date().toISOString().split('T')[0] : '',
        order_index: blogs.length,
      });
      setBlogs([...blogs, newBlog]);
      setBlogForm({ title: '', description: '', content: '', image_url: '', published: false, published_date: '', order_index: 0 });
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleUpdateResume = async () => {
    if (!resumeUrl) return;
    try {
      const newResume = await updateResume({
        id: '',
        file_url: resumeUrl,
        file_name: resumeUrl.split('/').pop() || 'resume.pdf',
      });
      setResume(newResume);
      setResumeUrl('');
    } catch (error) {
      console.error('Error updating resume:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gray-900 border-b border-red-900 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold">Content Manager</h1>
          </div>
          <a
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-300"
          >
            <LogOut className="w-4 h-4" />
            Back to Dashboard
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-2 mb-6 border-b border-gray-700 overflow-x-auto">
          {(['skills', 'certificates', 'achievements', 'blogs', 'resume'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition-colors duration-300 border-b-2 capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-red-600">
              <h2 className="text-2xl font-bold text-red-500 mb-6">Add New Skill</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name</label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="e.g., Python"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="e.g., Programming"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Proficiency</label>
                  <select
                    value={skillForm.proficiency}
                    onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </div>
                <button
                  onClick={handleAddSkill}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Skill
                </button>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Skills List ({skills.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-gray-800 p-4 rounded-lg flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{skill.name}</h3>
                      <p className="text-sm text-gray-400">{skill.category} - {skill.proficiency}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-2 text-red-500 hover:bg-red-600/20 rounded transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-red-600">
              <h2 className="text-2xl font-bold text-red-500 mb-6">Add Certificate</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Certificate title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Issuer</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Issuing organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Issue Date</label>
                  <input
                    type="date"
                    value={certForm.issue_date}
                    onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Credential URL</label>
                  <input
                    type="url"
                    value={certForm.credential_url}
                    onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="https://..."
                  />
                </div>
                <button
                  onClick={handleAddCertificate}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Certificate
                </button>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Certificates ({certificates.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-gray-800 p-4 rounded-lg flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{cert.title}</h3>
                      <p className="text-sm text-gray-400">{cert.issuer} - {cert.issue_date}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCertificate(cert.id)}
                      className="p-2 text-red-500 hover:bg-red-600/20 rounded transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-red-600">
              <h2 className="text-2xl font-bold text-red-500 mb-6">Add Achievement</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={achieveForm.title}
                    onChange={(e) => setAchieveForm({ ...achieveForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Achievement title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={achieveForm.description}
                    onChange={(e) => setAchieveForm({ ...achieveForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Achievement description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={achieveForm.achievement_date}
                    onChange={(e) => setAchieveForm({ ...achieveForm, achievement_date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <button
                  onClick={handleAddAchievement}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Achievement
                </button>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Achievements ({achievements.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {achievements.map((achieve) => (
                  <div key={achieve.id} className="bg-gray-800 p-4 rounded-lg flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{achieve.title}</h3>
                      <p className="text-sm text-gray-400">{achieve.achievement_date}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAchievement(achieve.id)}
                      className="p-2 text-red-500 hover:bg-red-600/20 rounded transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-red-600">
              <h2 className="text-2xl font-bold text-red-500 mb-6">Create Blog Post</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Blog title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={blogForm.description}
                    onChange={(e) => setBlogForm({ ...blogForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Blog description"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                  <textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Blog content"
                    rows={4}
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={blogForm.published}
                    onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-300">Publish this post</span>
                </label>
                <button
                  onClick={handleAddBlog}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Blog Post
                </button>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Blog Posts ({blogs.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {blogs.map((blog) => (
                  <div key={blog.id} className="bg-gray-800 p-4 rounded-lg flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{blog.title}</h3>
                        {blog.published && <span className="text-xs bg-green-600 px-2 py-1 rounded">Published</span>}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{blog.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-2 text-red-500 hover:bg-red-600/20 rounded transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="max-w-2xl">
            <div className="bg-gray-900 p-6 rounded-lg border border-red-600">
              <h2 className="text-2xl font-bold text-red-500 mb-6">Update Resume</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Resume URL</label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  You can use services like Google Drive, Dropbox, or any file hosting service. Get a direct download link and paste it here.
                </p>
                <button
                  onClick={handleUpdateResume}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Update Resume
                </button>
              </div>

              {resume && (
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">Current Resume</h3>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">File: {resume.file_name}</p>
                    <a
                      href={resume.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:text-red-400 transition-colors duration-300"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
