import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// CKEditor 5 Imports
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Heading,
  List,
  Link,
  BlockQuote,
  AutoLink,
  Table, // Add this
  TableToolbar, // Add this
} from "ckeditor5";

// CKEditor Styles
import "ckeditor5/ckeditor5.css";

// Services & Icons
import {
  publishGuide,
  fetchGuideById,
  updateGuide,
} from "../../../services/guideService";
import {
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const GuideForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    readTime: "5 min read",
    content: "",
  });

  const [loadingData, setLoadingData] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // Load data for Edit Mode
  useEffect(() => {
    if (!id) {
      setFormData({
        title: "",
        category: "",
        readTime: "5 min read",
        content: "",
      });
      setLoadingData(false);
      return;
    }

    const getGuideDetails = async () => {
      try {
        setLoadingData(true);
        const res = await fetchGuideById(id);
        const guide = res.data.guide || res.data;
        setFormData({
          title: guide.title || "",
          category: guide.category || "",
          readTime: guide.readTime || "5 min read",
          content: guide.content || "",
        });
      } catch (err) {
        setStatus({ type: "error", text: "Failed to load guide details." });
      } finally {
        setLoadingData(false);
      }
    };

    getGuideDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setStatus({ type: "error", text: "Title and Content are required." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      if (isEdit) {
        await updateGuide(id, formData);
        setStatus({ type: "success", text: "Guide updated successfully!" });
      } else {
        await publishGuide(formData);
        setStatus({ type: "success", text: "Guide published successfully!" });
      }
      setTimeout(() => navigate("/admin/guides"), 1500);
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Failed to save guide.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 gap-4">
        <Loader2 className="animate-spin text-[#d81159]" size={40} />
        <p className="font-medium">Loading guide data...</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header Navigation */}
      <button
        onClick={() => navigate("/admin/guides")}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-6 font-semibold transition-colors"
      >
        <ArrowLeft size={18} /> Back to Guides
      </button>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-bold mb-8">
          {isEdit ? "Edit Guide" : "Create New Guide"}
        </h1>

        {/* Status Messages */}
        {status.text && (
          <div
            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                : "bg-red-50 text-red-800 border border-red-100"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p className="font-semibold">{status.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Guide Title
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-[#d81159] outline-none transition-all"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Cold Press Juicer Review"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-[#d81159] outline-none transition-all"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g. Kitchen Gear"
              />
            </div>
          </div>

          {/* CKEditor Implementation */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Content
            </label>
            <div className="ck-editor-wrapper rounded-2xl border border-gray-200 overflow-hidden shadow-sm min-h-[450px]">
              <CKEditor
                editor={ClassicEditor}
                data={formData.content}
                config={{
                  // Your Commercial License Key
                  licenseKey:
                    "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzM4NzgzOTksImp0aSI6IjQ4YWY1MWVjLWYyZWMtNDg4Yi05YTEyLTgyZmIwZDg3YzVhMSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImUyYTViYjk5In0.qJeLoZgrjDY5RzCNYJ41SPCyjohjzCxUT_VPFXgZeo0fqst_sO2KvNvI0kXj60yxTi_4xysUyP75rzx0w7MWXA",

                  plugins: [
                    Essentials,
                    Paragraph,
                    Bold,
                    Italic,
                    Heading,
                    List,
                    Link,
                    BlockQuote,
                    Mention,
                    AutoLink,
                    Table,
                    TableToolbar, // Add these here
                  ],
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "insertTable",
                    "|", // Add insertTable here
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "|",
                    "undo",
                    "redo",
                  ],
                  table: {
                    // Add this block for better table controls
                    contentToolbar: [
                      "tableColumn",
                      "tableRow",
                      "mergeTableCells",
                    ],
                  },
                  heading: {
                    options: [
                      {
                        model: "paragraph",
                        title: "Paragraph",
                        class: "ck-heading_paragraph",
                      },
                      {
                        model: "heading2",
                        view: "h2",
                        title: "Heading 2",
                        class: "ck-heading_heading2",
                      },
                      {
                        model: "heading3",
                        view: "h3",
                        title: "Heading 3",
                        class: "ck-heading_heading3",
                      },
                    ],
                  },
                  placeholder:
                    "Start writing your expert guide content here...",
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData({ ...formData, content: data });
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black disabled:bg-gray-400 transition-all shadow-lg active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {isEdit ? "Update Guide" : "Publish Guide"}
          </button>
        </form>
      </div>

      {/* Scoped styles to ensure clean UI */}
      <style>{`
        .ck-editor__editable_inline {
          min-height: 400px;
          padding: 0 30px !important;
          font-size: 16px;
          line-height: 1.7;
          color: #1f2937;
        }

        /* --- Link Styling in Editor --- */
        .ck-content a, 
        .ck-content a strong {
          color: #d81159 !important;
          text-decoration: none !important;
          font-weight: 500 !important;
        }
        
        .ck-content a:hover {
          text-decoration: underline !important;
        }
        /* ------------------------------ */

        .ck-toolbar {
          border: none !important;
          border-bottom: 1px solid #f3f4f6 !important;
          background: #f9fafb !important;
          padding: 10px !important;
        }
        .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused) {
          border: none !important;
        }
        .ck-focused {
          border: none !important;
          outline: none !important;
        }
        .ck-content h2 { font-size: 1.5rem; font-weight: 800; margin-top: 1.5rem; }
        .ck-content h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.2rem; }
        .ck-content p { margin-bottom: 1rem; }

        /* Ensuring tables look clean inside editor */
        .ck-content table {
          border: 1px solid #f3f4f6;
          width: 100%;
          margin: 1rem 0;
        }
        .ck-content table td, .ck-content table th {
          padding: 10px;
          border: 1px solid #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default GuideForm;
