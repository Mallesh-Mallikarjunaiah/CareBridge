// src/pages/Upload.jsx

// First page user sees after login

// Supports multiple files: PDFs, images, documents

import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

const ACCEPTED_TYPES = [

    "application/pdf",

    "image/jpeg",

    "image/png",

    "image/jpg",

    "image/heic",

];

const MAX_FILE_SIZE_MB = 10;

export default function Upload() {

    const [files, setFiles] = useState([]);       // selected files list

    const [dragging, setDragging] = useState(false);    // drag over state

    const [uploading, setUploading] = useState(false);    // upload in progress

    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    // ── Validate a single file ───────────────────────────────────

    const validateFile = (file) => {

        if (!ACCEPTED_TYPES.includes(file.type)) {

            return "Only PDF and image files are accepted.";

        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {

            return `File must be under ${MAX_FILE_SIZE_MB}MB.`;

        }

        return null;

    };

    // ── Add files to list ────────────────────────────────────────

    const addFiles = (newFiles) => {

        setError("");

        const validated = [];

        for (const file of newFiles) {

            const err = validateFile(file);

            if (err) { setError(err); continue; }

            // Avoid duplicates by checking name + size

            const isDuplicate = files.some(

                f => f.name === file.name && f.size === file.size

            );

            if (!isDuplicate) validated.push(file);

        }

        setFiles(prev => [...prev, ...validated]);

    };

    // ── Remove a file from list ──────────────────────────────────

    const removeFile = (index) => {

        setFiles(prev => prev.filter((_, i) => i !== index));

    };

    // ── Drag and Drop Handlers ───────────────────────────────────

    const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };

    const handleDragLeave = (e) => { e.preventDefault(); setDragging(false); };

    const handleDrop = (e) => {

        e.preventDefault();

        setDragging(false);

        addFiles(Array.from(e.dataTransfer.files));

    };

    // ── File Input Change ────────────────────────────────────────

    const handleFileInput = (e) => {

        addFiles(Array.from(e.target.files));

        // Reset input so same file can be re-selected

        e.target.value = "";

    };

    // ── Format file size ─────────────────────────────────────────

    const formatSize = (bytes) => {

        if (bytes < 1024) return `${bytes} B`;

        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

    };

    // ── Get file icon ────────────────────────────────────────────

    const getFileIcon = (type) => {

        if (type === "application/pdf") return "📄";

        if (type.startsWith("image/")) return "🖼️";

        return "📎";

    };

    // ── Upload Handler ───────────────────────────────────────────

    const handleUpload = async () => {

        if (files.length === 0) {

            setError("Please select at least one file.");

            return;

        }

        setUploading(true);

        setError("");

        try {

            // TODO: Connect to backend API

            // const formData = new FormData();

            // files.forEach(f => formData.append("files", f));

            // await api.post("/documents/upload", formData);

            // Simulate upload delay for now

            await new Promise(res => setTimeout(res, 1500));

            // Navigate to dashboard after successful upload

            navigate("/dashboard");

        } catch {

            setError("Upload failed. Please try again.");

        } finally {

            setUploading(false);

        }

    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">

                        Upload Documents
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">

                        Upload your discharge papers, prescriptions, or medical documents.

                        Our AI will extract and organize everything for you.
                    </p>
                </div>

                {/* Drop Zone */}
                <div

                    onDragOver={handleDragOver}

                    onDragLeave={handleDragLeave}

                    onDrop={handleDrop}

                    onClick={() => fileInputRef.current?.click()}

                    className={`border-2 border-dashed rounded-2xl p-10

                      flex flex-col items-center justify-center

                      cursor-pointer transition-all

                      ${dragging

                            ? "border-blue-500 bg-blue-50"

                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"

                        }`}
                >
                    <div className="text-5xl mb-4">

                        {dragging ? "📂" : "📁"}
                    </div>
                    <p className="text-gray-700 font-medium text-center">

                        {dragging

                            ? "Drop files here"

                            : "Drag & drop files here"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1 text-center">

                        or click to browse
                    </p>
                    <p className="text-gray-300 text-xs mt-3 text-center">

                        Supports PDF, JPG, PNG • Max {MAX_FILE_SIZE_MB}MB per file
                    </p>

                    {/* Hidden file input */}
                    <input

                        ref={fileInputRef}

                        type="file"

                        multiple

                        accept=".pdf,.jpg,.jpeg,.png,.heic"

                        onChange={handleFileInput}

                        className="hidden"

                    />
                </div>

                {/* Error */}

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200

                          text-red-600 rounded-xl px-4 py-3 text-sm">

                        {error}
                    </div>

                )}

                {/* Selected Files List */}

                {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                        <h2 className="text-sm font-semibold text-gray-700">

                            Selected Files ({files.length})
                        </h2>

                        {files.map((file, index) => (
                            <div

                                key={index}

                                className="flex items-center justify-between

                           bg-white border border-gray-100

                           rounded-xl px-4 py-3 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 truncate max-w-xs">

                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-400">

                                            {formatSize(file.size)}
                                        </p>
                                    </div>
                                </div>

                                {/* Remove button */}
                                <button

                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}

                                    className="text-gray-300 hover:text-red-400

                             transition text-lg leading-none"
                                >

                                    ✕
                                </button>
                            </div>

                        ))}
                    </div>

                )}

                {/* Upload Button */}
                <button

                    onClick={handleUpload}

                    disabled={uploading || files.length === 0}

                    className="mt-6 w-full bg-blue-600 text-white py-3.5

                     rounded-xl font-medium hover:bg-blue-700

                     transition disabled:opacity-50 disabled:cursor-not-allowed

                     flex items-center justify-center gap-2"
                >

                    {uploading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white"

                                fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12"

                                    r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor"

                                    d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>

                            Uploading & Extracting...
                        </>

                    ) : (
                        <>📤 Upload & Extract</>

                    )}
                </button>

            </div>
        </Layout>

    );

}
