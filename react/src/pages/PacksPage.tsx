import React, { useEffect, useState } from 'react';
import { packService, packOfferService, Pack, PackOffer } from '../services/packService';

const PacksPage: React.FC = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packOffers, setPackOffers] = useState<Record<number, PackOffer[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching packs and offers...');

        // Fetch packs
        const packsResponse = await packService.getAllPacks();
        console.log('Packs API response:', packsResponse);

        if (packsResponse.success) {
          setPacks(packsResponse.data);

          // Fetch offers for each pack
          const offersData: Record<number, PackOffer[]> = {};
          for (const pack of packsResponse.data) {
            try {
              const offersResponse = await packOfferService.getPackOffers(pack.id);
              offersData[pack.id] = offersResponse;
            } catch (offerError) {
              console.error(`Error fetching offers for pack ${pack.id}:`, offerError);
            }
          }
          setPackOffers(offersData);
        } else {
          setError(packsResponse.message || 'Failed to fetch packs');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch packs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (pack: Pack) => {
    setSelectedPack(pack);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPack(null);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Nos Packs</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {packs.map((pack) => (
              <div
                key={pack.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full group ${
                  pack.highlight ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                {/* Header with highlight badge */}
                {pack.highlight && (
                  <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-2 px-4 text-center text-sm font-semibold relative">
                    <span className="relative z-10">⭐ Pack Recommandé</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"></div>
                  </div>
                )}

                {/* Image with overlay effects */}
                <div className="relative h-52 overflow-hidden">
                  {pack.image_path ? (
                    <div className="relative h-full">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${pack.image_path}`}
                        alt={pack.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <div className="text-primary/40 text-6xl">📦</div>
                    </div>
                  )}

                  {/* Pack type badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {pack.type}
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-primary transition-colors duration-200">
                      {pack.name}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {pack.description}
                    </p>
                  </div>

                  {/* Special offer preview */}
                  {packOffers[pack.id]?.length > 0 && (
                    <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm">🎉</span>
                        <div className="text-green-700 font-medium text-sm">
                          {packOffers[pack.id][0].title}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price and delivery section */}
                  <div className="space-y-4 mt-auto">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {pack.price.toLocaleString('fr-MA')}
                          <span className="text-lg text-gray-600 ml-1">MAD</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Livraison</div>
                        <div className="text-sm font-semibold text-gray-700">
                          {pack.delivery_time_days} jours
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => openModal(pack)}
                      className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shadow-md"
                    >
                      <span className="flex items-center justify-center gap-2 text-black">
                        <span>Voir détails</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pack Details Modal */}
        {showModal && selectedPack && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {selectedPack.image_path && (
                  <div className="h-64 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${selectedPack.image_path}`}
                      alt={selectedPack.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
                  <h2 className="text-2xl font-bold">{selectedPack.name}</h2>
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {selectedPack.type.toUpperCase()}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700">{selectedPack.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-500">Prix</div>
                    <div className="text-xl font-bold text-primary">{selectedPack.price.toLocaleString('fr-MA')} MAD</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-500">Délai de livraison</div>
                    <div className="text-xl font-bold">{selectedPack.delivery_time_days} jours</div>
                  </div>
                </div>

                {selectedPack.features && Array.isArray(selectedPack.features) && selectedPack.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Caractéristiques</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {selectedPack.features.map((feature, idx) => {
                        const getFeatureText = (feature: string | number | boolean | Record<string, unknown>): string => {
                          if (typeof feature === 'string') return feature;
                          if (typeof feature === 'number' || typeof feature === 'boolean') return String(feature);
                          if (typeof feature === 'object' && feature !== null) {
                            const obj = feature as Record<string, unknown>;
                            return String(obj.name || obj.title || JSON.stringify(feature));
                          }
                          return String(feature);
                        };

                        return (
                          <li key={idx}>
                            {getFeatureText(feature)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {packOffers[selectedPack.id]?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Offres Spéciales</h3>
                    <div className="space-y-3">
                      {packOffers[selectedPack.id].map((offer) => (
                        <div key={offer.id} className="bg-green-50 border border-green-100 rounded-md p-3">
                          <div className="font-semibold text-green-700">{offer.title}</div>
                          <p className="text-sm text-gray-600">{offer.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {packOfferService.formatDiscount(offer.value, offer.type)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Valable jusqu'au {new Date(offer.ends_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      // Here you can add navigation to order with this pack
                      closeModal();
                    }}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded shadow-md transition-colors"
                  >
                    Commander
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

export default PacksPage;
