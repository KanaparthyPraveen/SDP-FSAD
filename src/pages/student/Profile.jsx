import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import {
    User, Mail, Phone, BookOpen, Hash, Award, Code,
    Github, Linkedin, FileText, Upload, X, Save, CheckCircle
} from 'lucide-react';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        cgpa: user?.cgpa || 0,
        backlogs: user?.backlogs || 0,
        skills: user?.skills?.join(', ') || '',
        linkedIn: user?.linkedIn || '',
        github: user?.github || '',
    });
    const [resume, setResume] = useState(user?.resume || null);
    const [resumeName, setResumeName] = useState(user?.resumeName || '');

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setResume(reader.result);
                setResumeName(file.name);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
    });

    const handleSave = () => {
        const result = updateProfile({
            name: form.name,
            phone: form.phone,
            bio: form.bio,
            cgpa: parseFloat(form.cgpa) || 0,
            backlogs: parseInt(form.backlogs) || 0,
            skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
            linkedIn: form.linkedIn,
            github: form.github,
            resume,
            resumeName,
        });
        if (result.success) {
            setSaved(true);
            setEditing(false);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const removeResume = () => {
        setResume(null);
        setResumeName('');
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-mono text-2xl font-bold text-white">Profile</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your placement profile</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {saved && (
                            <span className="flex items-center gap-1 text-green-400 text-sm">
                                <CheckCircle size={14} /> Saved
                            </span>
                        )}
                        {editing ? (
                            <div className="flex gap-2">
                                <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
                                <button onClick={handleSave} className="btn-primary text-sm py-2 px-4 flex items-center gap-1">
                                    <Save size={14} /> Save
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 px-4">Edit Profile</button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Profile header card */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-2xl font-bold font-mono">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                            <span>{user?.department}</span>
                            <span>·</span>
                            <span>{user?.rollNo || 'No Roll No'}</span>
                            <span>·</span>
                            <span>Year {user?.year || 4}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Upload */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6">
                <h3 className="font-mono text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-accent" /> Resume
                </h3>

                {resume ? (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center">
                                <FileText size={18} className="text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{resumeName || 'Resume'}</p>
                                <p className="text-xs text-gray-600">PDF document</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {resume.startsWith('data:') && (
                                <a href={resume} download={resumeName || 'resume.pdf'}
                                    className="text-xs text-accent hover:text-accent-hover font-medium transition-colors">
                                    Download
                                </a>
                            )}
                            {editing && (
                                <button onClick={removeResume} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div {...getRootProps()}
                        className={`p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${isDragActive
                                ? 'border-accent/50 bg-accent/5'
                                : 'border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]'
                            }`}>
                        <input {...getInputProps()} />
                        <Upload size={32} className="mx-auto text-gray-600 mb-3" />
                        <p className="text-sm text-gray-400 mb-1">
                            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                        </p>
                        <p className="text-xs text-gray-600">PDF, DOC, DOCX — Max 5MB</p>
                    </div>
                )}
            </div>

            {/* Personal Info */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6">
                <h3 className="font-mono text-sm font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                        <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                            disabled={!editing} className="input-dark disabled:opacity-60" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
                        <input type="text" value={form.phone} onChange={e => update('phone', e.target.value)}
                            disabled={!editing} placeholder="9876543210" className="input-dark disabled:opacity-60" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Bio</label>
                        <textarea value={form.bio} onChange={e => update('bio', e.target.value)}
                            disabled={!editing} rows={2} placeholder="Tell recruiters about yourself..."
                            className="input-dark resize-none disabled:opacity-60" />
                    </div>
                </div>
            </div>

            {/* Academic Info */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6">
                <h3 className="font-mono text-sm font-semibold text-white mb-4">Academic Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">CGPA</label>
                        <input type="number" step="0.1" min="0" max="10" value={form.cgpa}
                            onChange={e => update('cgpa', e.target.value)}
                            disabled={!editing} className="input-dark disabled:opacity-60" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Active Backlogs</label>
                        <input type="number" min="0" value={form.backlogs}
                            onChange={e => update('backlogs', e.target.value)}
                            disabled={!editing} className="input-dark disabled:opacity-60" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Skills (comma-separated)</label>
                        <input type="text" value={form.skills} onChange={e => update('skills', e.target.value)}
                            disabled={!editing} placeholder="React, Node.js, Java, Python"
                            className="input-dark disabled:opacity-60" />
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6">
                <h3 className="font-mono text-sm font-semibold text-white mb-4">Social Links</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">LinkedIn</label>
                        <input type="text" value={form.linkedIn} onChange={e => update('linkedIn', e.target.value)}
                            disabled={!editing} placeholder="linkedin.com/in/your-profile"
                            className="input-dark disabled:opacity-60" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">GitHub</label>
                        <input type="text" value={form.github} onChange={e => update('github', e.target.value)}
                            disabled={!editing} placeholder="github.com/your-profile"
                            className="input-dark disabled:opacity-60" />
                    </div>
                </div>
            </div>
        </div>
    );
}
