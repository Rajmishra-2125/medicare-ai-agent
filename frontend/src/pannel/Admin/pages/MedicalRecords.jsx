import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  UploadCloud, 
  Download, 
  Trash2, 
  FileImage, 
  FileArchive, 
  MoreVertical,
  Filter,
  Eye,
  Loader2
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import adminService from "../../../services/adminService";
import toast from "react-hot-toast";

const MedicalRecords = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [patientIdentifier, setPatientIdentifier] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllMedicalRecords();
      setRecords(response.data);
    } catch (error) {
       toast.error("Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!patientIdentifier || !documentTitle || !selectedFile) {
      toast.error("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("userIdentifier", patientIdentifier);
    formData.append("title", documentTitle);
    formData.append("file", selectedFile);

    setIsUploading(true);
    try {
      await adminService.uploadMedicalRecord(formData);
      toast.success("Medical record uploaded securely.");
      setIsUploadModalOpen(false);
      
      // Reset Modal States
      setPatientIdentifier("");
      setDocumentTitle("");
      setSelectedFile(null);
      
      // Refresh Data
      fetchRecords();
    } catch (error) {
       const errorMsg = error.response?.data?.message || "Failed to upload medical record";
       toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "PDF": return <FileText className="w-8 h-8 text-rose-500" />;
      case "IMG": return <FileImage className="w-8 h-8 text-blue-500" />;
      case "ZIP": return <FileArchive className="w-8 h-8 text-amber-500" />;
      default: return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-400 mx-auto animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Medical Records</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage and securely store patient medical documents.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" /> Upload Record
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by patient name, document title or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
              <Filter className="w-4 h-4" /> Filter By Type
            </button>
          </div>
        </div>

        {/* Directory Grid/List */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {records.map((record) => (
              <div key={record._id} className="group relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/30 dark:hover:border-indigo-500/50 hover:shadow-md transition-all">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {getFileIcon(record.fileType)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate" title={record.title}>{record.title}</h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mt-1">{record.patientId?.fullname}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-bold px-2 py-0.5 rounded flex items-center bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                        {record.fileType}
                      </span>
                      <span className="text-[11px] text-gray-400">{(record.fileSizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800/50 mt-4">
                  <span className="text-[11px] font-medium text-gray-400">{new Date(record.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 dark:text-slate-400">
                <FileArchive className="w-12 h-12 mb-3 opacity-20" />
                <p>No medical records found.</p>
              </div>
            )}
            {loading && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 dark:text-slate-400">
                 <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Upload Modal Placeholder */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 dark:bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Medical Record</h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="flex flex-col h-full">
              <div className="p-6">
                <label className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    {selectedFile ? selectedFile.name : "Click to select a file"}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xs">{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "PDF, JPG, PNG or ZIP files allowed. Maximum file size 50 MB."}</p>
                  <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png,.zip" required />
                </label>
                
                <div className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Patient Identifier (ID or Full Name)</label>
                    <input 
                      type="text" 
                      placeholder="e.g Rahul Sharma or 642abc..." 
                      value={patientIdentifier}
                      onChange={(e) => setPatientIdentifier(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" 
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Document Title</label>
                    <input 
                      type="text" 
                      placeholder="E.g., Blood Test Results" 
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none" 
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/80 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 mt-auto">
                <button 
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? "Uploading Securely..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;

