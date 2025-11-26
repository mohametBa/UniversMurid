'use client';

import { useState, useEffect } from 'react';
import { 
  Sprout, 
  Droplets, 
  Sun, 
  Calendar,
  Wrench,
  Wheat,
  TrendingUp,
  Clock,
  MapPin,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';
import { FarmPlot, KhidmaGameState, GameResources } from '../types';
import { CROP_TYPES, SEASONS } from '../constants';

interface FarmManagementProps {
  gameState: KhidmaGameState;
  onGameStateUpdate: (newState: KhidmaGameState) => void;
}



export default function FarmManagement({ gameState, onGameStateUpdate }: FarmManagementProps) {
  const [currentSeason, setCurrentSeason] = useState<'planting' | 'growing' | 'harvest'>('planting');
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [showPlantingModal, setShowPlantingModal] = useState(false);
  const [gameDay, setGameDay] = useState(1);
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'cloudy'>('sunny');

  // Simuler le passage des jours
  useEffect(() => {
    const timer = setInterval(() => {
      setGameDay(prev => {
        const nextDay = prev + 1;
        // Changer de saison tous les 30 jours
        const seasonIndex = Math.floor((nextDay - 1) / 30) % 3;
        const seasons = ['planting', 'growing', 'harvest'] as const;
        setCurrentSeason(seasons[seasonIndex]);
        
        // Chance de pluie (25%)
        const random = Math.random();
        if (random < 0.25) setWeather('rainy');
        else if (random < 0.75) setWeather('sunny');
        else setWeather('cloudy');
        
        return nextDay;
      });
    }, 5000); // Augmenter à 5 secondes pour éviter les mises à jour trop fréquentes

    return () => clearInterval(timer);
  }, []);

  // Mettre à jour les parcelles (croissance automatique)
  useEffect(() => {
    const updatedPlots = gameState.farm.plots.map(plot => {
      if (plot.cropType === 'empty' || !plot.plantedDate) return plot;
      
      const daysSincePlanted = Math.floor((gameDay - new Date(plot.plantedDate).getTime() / (1000 * 60 * 60 * 24)));
      const cropInfo = CROP_TYPES[plot.cropType as keyof typeof CROP_TYPES];
      
      if (daysSincePlanted >= cropInfo.plantingTime && !plot.isReady) {
        return { ...plot, isReady: true, harvestDate: new Date() };
      }
      
      return plot;
    });
    
    // Vérifier s'il y a des changements réels à appliquer
    const hasChanges = updatedPlots.some((plot, index) => {
      const originalPlot = gameState.farm.plots[index];
      return plot.isReady !== originalPlot.isReady || 
             plot.harvestDate !== originalPlot.harvestDate;
    });
    
    if (hasChanges) {
      updateGameState({
        ...gameState,
        farm: {
          ...gameState.farm,
          plots: updatedPlots
        }
      });
    }
  }, [gameDay]);

  const updateGameState = (newState: KhidmaGameState) => {
    onGameStateUpdate(newState);
  };

  const plantCrop = (plotId: string, cropType: 'arachide' | 'mais' | 'mil') => {
    const plot = gameState.farm.plots.find(p => p.id === plotId);
    if (!plot || plot.cropType !== 'empty') return;
    
    const cropInfo = CROP_TYPES[cropType];
    if (gameState.inventory.seeds < 1 || gameState.farm.tools.eau < cropInfo.waterNeeded) {
      alert('Ressources insuffisantes !');
      return;
    }

    const updatedPlots: FarmPlot[] = gameState.farm.plots.map(p =>
      p.id === plotId
        ? {
            ...p,
            cropType: cropType,
            plantedDate: new Date(),
            harvestDate: null,
            isReady: false,
            productivity: 50 + Math.random() * 30
          }
        : p
    );

    // Calculer le coût en semences (utilisation de faaidaReward comme base de coût)
    const seedCost = Math.floor(cropInfo.faaidaReward * 0.2);
    
    const newResources = {
      ...gameState.player.resources,
      faaida: gameState.player.resources.faaida - seedCost
    };

    updateGameState({
      ...gameState,
      player: {
        ...gameState.player,
        resources: newResources
      },
      farm: {
        ...gameState.farm,
        plots: updatedPlots,
        tools: {
          ...gameState.farm.tools,
          eau: gameState.farm.tools.eau - cropInfo.waterNeeded,
          semences: gameState.inventory.seeds - 1
        }
      },
      inventory: {
        ...gameState.inventory,
        seeds: gameState.inventory.seeds - 1
      }
    });

    setShowPlantingModal(false);
  };

  const harvestCrop = (plotId: string) => {
    const plot = gameState.farm.plots.find(p => p.id === plotId);
    if (!plot || !plot.isReady || plot.cropType === 'empty') return;
    
    const cropInfo = CROP_TYPES[plot.cropType as keyof typeof CROP_TYPES];
    const yieldAmount = Math.floor(plot.productivity / 100 * cropInfo.yield);
    
    // Calcul des gains
    const faaidaGain = yieldAmount * 2;
    const barakaGain = Math.floor(yieldAmount / 5);
    const experienceGain = yieldAmount;
    
    const updatedPlots: FarmPlot[] = gameState.farm.plots.map(p =>
      p.id === plotId
        ? {
            ...p,
            cropType: 'empty',
            plantedDate: new Date(),
            harvestDate: null,
            isReady: false,
            productivity: 50
          }
        : p
    );

    const newResources = {
      ...gameState.player.resources,
      faaida: gameState.player.resources.faaida + faaidaGain,
      baraka: gameState.player.resources.baraka + barakaGain
    };

    updateGameState({
      ...gameState,
      player: {
        ...gameState.player,
        resources: newResources,
        experience: gameState.player.experience + experienceGain
      },
      farm: {
        ...gameState.farm,
        plots: updatedPlots
      }
    });
  };

  const irrigatePlot = (plotId: string) => {
    if (gameState.farm.tools.eau < 10) {
      alert('Pas assez d\'eau pour irriguer !');
      return;
    }

    const updatedPlots = gameState.farm.plots.map(p =>
      p.id === plotId
        ? { ...p, productivity: Math.min(p.productivity + 10, 100) }
        : p
    );

    updateGameState({
      ...gameState,
      farm: {
        ...gameState.farm,
        plots: updatedPlots,
        tools: {
          ...gameState.farm.tools,
          eau: gameState.farm.tools.eau - 10
        }
      }
    });
  };

  const currentSeasonInfo = SEASONS[currentSeason];
  const readyToHarvest = gameState.farm.plots.filter(p => p.isReady).length;
  const totalPlots = gameState.farm.plots.length;
  const cultivatedPlots = gameState.farm.plots.filter(p => p.cropType !== 'empty').length;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-amber-200 dark:border-gray-700">
      {/* Header de la ferme */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-800 flex items-center">
            <Wheat className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3" />
            Gestion Agricole - Dahir
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="bg-white rounded-lg px-3 sm:px-4 py-2 shadow w-full sm:w-auto">
              <div className="text-xs sm:text-sm text-slate-600">Jour {gameDay}</div>
              <div className="font-semibold text-slate-800 text-sm sm:text-base">{currentSeasonInfo.icon} {currentSeasonInfo.name}</div>
            </div>
            <div className="bg-white rounded-lg px-3 sm:px-4 py-2 shadow w-full sm:w-auto">
              <div className="text-xs sm:text-sm text-slate-600">Temps</div>
              <div className="font-semibold text-slate-800 text-sm sm:text-base">
                {weather === 'sunny' ? '☀️ Ensoleillé' : weather === 'rainy' ? '🌧️ Pluvieux' : '⛅ Nuageux'}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques de la ferme */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-amber-200">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{cultivatedPlots}/{totalPlots}</div>
            <div className="text-xs sm:text-sm text-slate-600">Parcelles cultivées</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-amber-200">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{readyToHarvest}</div>
            <div className="text-xs sm:text-sm text-slate-600">Prêtes à récolte</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-amber-200">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{gameState.inventory.seeds}</div>
            <div className="text-xs sm:text-sm text-slate-600">Semences disponibles</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-amber-200">
            <div className="text-xl sm:text-2xl font-bold text-cyan-600">{gameState.farm.tools.eau}L</div>
            <div className="text-xs sm:text-sm text-slate-600">Eau disponible</div>
          </div>
        </div>
      </div>

      {/* Grille des parcelles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {gameState.farm.plots.map((plot, index) => {
          const isEmpty = plot.cropType === 'empty';
          const cropInfo = !isEmpty ? CROP_TYPES[plot.cropType as keyof typeof CROP_TYPES] : null;
          const daysSincePlanted = !isEmpty && plot.plantedDate ? 
            Math.floor(gameDay - (new Date(plot.plantedDate).getTime() / (1000 * 60 * 60 * 24))) : 0;
          const progress = !isEmpty && cropInfo ? 
            Math.min((daysSincePlanted / cropInfo.plantingTime) * 100, 100) : 0;

          return (
            <div
              key={plot.id}
              className={`relative bg-white rounded-xl p-4 border-2 transition-all cursor-pointer hover:shadow-lg ${
                selectedPlot === plot.id 
                  ? 'border-amber-500 shadow-lg' 
                  : isEmpty 
                  ? 'border-dashed border-slate-300 hover:border-amber-300'
                  : 'border-amber-200 hover:border-amber-400'
              }`}
              onClick={() => setSelectedPlot(plot.id)}
            >
              {/* Indicateur de sélection */}
              {selectedPlot === plot.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}

              <div className="text-center">
                {/* État de la parcelle */}
                <div className="text-4xl mb-2">
                  {isEmpty ? '🟫' : plot.isReady ? cropInfo!.icon : '🌱'}
                </div>
                
                <div className="font-semibold text-slate-800 text-sm mb-1">
                  {isEmpty ? 'Parcelle vide' : cropInfo!.name}
                </div>
                
                {!isEmpty && (
                  <>
                    <div className="text-xs text-slate-600 mb-2">
                      {plot.isReady ? '🌾 Prête !' : `${daysSincePlanted}/${cropInfo!.plantingTime} jours`}
                    </div>
                    
                    {/* Barre de progression */}
                    {!plot.isReady && (
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {/* Productivité */}
                    <div className="text-xs text-slate-500">
                      Productivité: {Math.round(plot.productivity)}%
                    </div>
                  </>
                )}
              </div>

              {/* Actions contextuelles */}
              {selectedPlot === plot.id && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  {isEmpty ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPlantingModal(true);
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs py-2 px-3 rounded-lg flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Planter
                    </button>
                  ) : plot.isReady ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        harvestCrop(plot.id);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs py-2 px-3 rounded-lg flex items-center justify-center"
                    >
                      🌾 Récolter
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        irrigatePlot(plot.id);
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-lg flex items-center justify-center"
                      disabled={gameState.farm.tools.eau < 10}
                    >
                      <Droplets className="w-3 h-3 mr-1" />
                      Arroser
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Outils et améliorations */}
      <div className="bg-white rounded-xl p-6 border border-amber-200">
        <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
          <Wrench className="w-5 h-5 mr-2" />
          Outils & Améliorations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">Houe</span>
              <div className={`w-3 h-3 rounded-full ${gameState.farm.tools.houe ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
            </div>
            <div className="text-sm text-slate-600">Outil de base pour cultiver</div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">Tracteur</span>
              <div className={`w-3 h-3 rounded-full ${gameState.farm.tools.tracteur ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
            </div>
            <div className="text-sm text-slate-600">+50% productivité (nécessite L'Éveil)</div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">Système d'irrigation</span>
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            </div>
            <div className="text-sm text-slate-600">Arrosage automatique (coûteux)</div>
          </div>
        </div>
      </div>

      {/* Modal de plantation */}
      {showPlantingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Choisir une culture</h3>
            
            <div className="space-y-3 mb-6">
              {Object.entries(CROP_TYPES)
                .filter(([key]) => key !== 'empty')
                .map(([key, crop]) => (
                <button
                  key={key}
                  onClick={() => selectedPlot && plantCrop(selectedPlot, key as 'arachide' | 'mais' | 'mil')}
                  className="w-full p-4 bg-slate-50 hover:bg-green-50 rounded-lg border border-slate-200 hover:border-green-300 text-left transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{crop.icon}</div>
                      <div>
                        <div className="font-semibold text-slate-800">{crop.name}</div>
                        <div className="text-sm text-slate-600">{crop.description}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-slate-800">{Math.floor(crop.faaidaReward * 0.2)} Faaïda</div>
                      <div className="text-slate-600">{crop.plantingTime} jours</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPlantingModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-lg font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}