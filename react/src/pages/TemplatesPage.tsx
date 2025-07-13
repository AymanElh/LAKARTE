import React, { useEffect, useState } from 'react';
import templateService, { Template } from '../services/templateService';

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedView, setSelectedView] = useState<'recto' | 'verso' | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        console.log('Fetching templates...');
        const response = await templateService.getTemplates();
        console.log('API response:', response);
        if (response.success) {
          setTemplates(response.data);
        } else {
          setError(response.message || 'Failed to fetch templates');
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const openModal = (template: Template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
    setSelectedView(null);
  };

  const showRecto = (template: Template) => {
    setSelectedTemplate(template);
    setSelectedView('recto');
    setShowModal(true);
  };

  const showVerso = (template: Template) => {
    setSelectedTemplate(template);
    setSelectedView('verso');
    setShowModal(true);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Nos Templates</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                {template.preview_path && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={templateService.getImageUrl(template.preview_path)}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2">{template.name}</h2>
                  {template.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{template.description}</p>
                  )}

                  {template.pack && (
                    <div className="bg-gray-100 rounded p-2 mb-4">
                      <div className="text-sm text-gray-500">Pack</div>
                      <div className="font-medium">{template.pack.name}</div>
                    </div>
                  )}

                  {template.tags && Array.isArray(template.tags) && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs"
                        >
                          {typeof tag === 'string' ? tag : String(tag)}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{template.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mb-3">
                    {template.recto_path && (
                      <button
                        onClick={() => showRecto(template)}
                        className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded text-sm transition-colors"
                      >
                        Voir Recto
                      </button>
                    )}
                    {template.verso_path && (
                      <button
                        onClick={() => showVerso(template)}
                        className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded text-sm transition-colors"
                      >
                        Voir Verso
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => openModal(template)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded transition-colors"
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Details Modal */}
        {showModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {selectedView === 'recto' && selectedTemplate.recto_path ? (
                  <div className="h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={templateService.getImageUrl(selectedTemplate.recto_path)}
                      alt={`${selectedTemplate.name} - Recto`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : selectedView === 'verso' && selectedTemplate.verso_path ? (
                  <div className="h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={templateService.getImageUrl(selectedTemplate.verso_path)}
                      alt={`${selectedTemplate.name} - Verso`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : selectedTemplate.preview_path ? (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={templateService.getImageUrl(selectedTemplate.preview_path)}
                      alt={selectedTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                  {selectedTemplate.pack && (
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {selectedTemplate.pack.type.toUpperCase()}
                    </div>
                  )}
                </div>

                {selectedTemplate.description && (
                  <div className="mb-6">
                    <p className="text-gray-700">{selectedTemplate.description}</p>
                  </div>
                )}

                {selectedTemplate.pack && (
                  <div className="mb-6 bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-500">Pack</div>
                    <div className="font-medium">{selectedTemplate.pack.name}</div>
                  </div>
                )}

                {selectedTemplate.tags && Array.isArray(selectedTemplate.tags) && selectedTemplate.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-600 px-2 py-1 rounded"
                        >
                          {typeof tag === 'string' ? tag : String(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Aperçu</h3>
                  <div className="flex gap-3">
                    {selectedTemplate.recto_path && (
                      <button
                        onClick={() => setSelectedView('recto')}
                        className={`px-4 py-2 rounded transition-colors ${
                          selectedView === 'recto'
                            ? 'bg-primary text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Recto
                      </button>
                    )}
                    {selectedTemplate.verso_path && (
                      <button
                        onClick={() => setSelectedView('verso')}
                        className={`px-4 py-2 rounded transition-colors ${
                          selectedView === 'verso'
                            ? 'bg-primary text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Verso
                      </button>
                    )}
                    {selectedTemplate.preview_path && (
                      <button
                        onClick={() => setSelectedView(null)}
                        className={`px-4 py-2 rounded transition-colors ${
                          selectedView === null
                            ? 'bg-primary text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Aperçu
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      // Here you can add navigation to use this template
                      closeModal();
                    }}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition-colors"
                  >
                    Choisir ce Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
