"use client";

import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Upload, Image, Video, FileText, Download, Trash2, Eye, Search, Grid, List, Plus } from "lucide-react";
import { useGetUserUploadsQuery, useUploadMediaMutation } from "../../../store/shipmentApi";

const AdminMedia = () => {
  const { data: uploads = [], isLoading } = useGetUserUploadsQuery();
  const [uploadMedia, { isLoading: uploadingMedia }] = useUploadMediaMutation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const mediaFiles = useMemo(() => uploads.map(upload => ({
    id: upload.id,
    name: upload.mediaUrl?.split('/').pop() || 'File',
    type: (upload.mediaType || 'document').toLowerCase(),
    category: (upload.mediaType || 'Library').toString(),
    size: "",
    uploadedBy: upload.uploadedBy || 'Me',
    uploadedAt: upload.createdAt,
    url: upload.mediaUrl || "",
    thumbnail: upload.mediaType === 'image' ? upload.mediaUrl : null
  })), [uploads]);

  const categories = useMemo(() => {
    const allCats = new Set<string>(['all']);
    mediaFiles.forEach(file => allCats.add(file.category));
    return Array.from(allCats);
  }, [mediaFiles]);

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-8 w-8 text-blue-500" />;
      case 'video': return <Video className="h-8 w-8 text-red-500" />;
      case 'document': return <FileText className="h-8 w-8 text-green-500" />;
      default: return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const list = Array.from(files);
      let completed = 0;
      for (const file of list) {
        const mediaType = file.type.startsWith('image')
          ? 'image'
          : file.type.startsWith('video')
            ? 'video'
            : 'document';
        await uploadMedia({ file, mediaType }).unwrap();
        completed += 1;
        setUploadProgress(Math.round((completed / list.length) * 100));
      }
      setFeedback(`Successfully uploaded ${list.length} file(s).`);
    } catch (error: any) {
      setFeedback(error?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDownload = (fileId: string) => {
    const file = mediaFiles.find(f => f.id === fileId);
    if (file?.url) {
      window.open(file.url, "_blank");
    } else {
      setFeedback("Download link not available yet.");
    }
  };

  const handleDelete = (fileId: string) => {
    setFeedback("Delete is not supported for uploads yet.");
  };

  const handleView = (file: any) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  if (isLoading && mediaFiles.length === 0) {
    return <div className="p-8 text-center text-gray-600">Loading media...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600">Manage images, videos, and documents for your website and reports.</p>
            {feedback && <p className="text-sm text-green-700 mt-1">{feedback}</p>}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || uploadingMedia}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Upload size={16} />
            Upload Files
          </button>
        </div>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
      </div>

      {/* Upload Progress */}
      {(uploading || uploadingMedia) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="flex items-center gap-4">
            <Upload className="h-8 w-8 text-blue-500 animate-pulse" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Uploading files...</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{uploadProgress}% complete</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{mediaFiles.length}</p>
            </div>
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Images</p>
              <p className="text-2xl font-bold text-gray-900">{mediaFiles.filter(f => f.type === 'image').length}</p>
            </div>
            <Image className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Videos</p>
              <p className="text-2xl font-bold text-gray-900">{mediaFiles.filter(f => f.type === 'video').length}</p>
            </div>
            <Video className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">{mediaFiles.filter(f => f.type === 'document').length}</p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Media Files */}
      {viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 relative">
                {file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleView(file)}
                    className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100 transition-colors"
                    title="View file"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{file.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{file.size}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDownload(file.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {file.thumbnail ? (
                            <img
                              src={file.thumbnail}
                              alt={file.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                              {getFileIcon(file.type)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-sm text-gray-500">by {file.uploadedBy}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {file.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(file)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View file"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(file.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || selectedCategory !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by uploading your first file.'}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Upload Files
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
