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
  RefreshCw,
  Lightbulb
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
    <div className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 sm:p-6 border border-amber-200 dark:border-gray-700 shadow-xl">
      {/* Header de la ferme */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-800 dark:text-amber-300 flex items-center mb-2">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg mr-2 sm:mr-3">
                <Wheat className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              Gestion Agricole - Dahir
            </h2>
            <p className="text-amber-600 dark:text-amber-400 text-sm sm:text-base">Cultivez votre terre, développez votre esprit</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-shrink-0">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 shadow-lg border border-amber-200 dark:border-gray-700">
              <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">Jour de jeu</div>
              <div className="font-bold text-amber-800 dark:text-amber-300 text-lg flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {gameDay}
              </div>
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 shadow-lg border border-amber-200 dark:border-gray-700">
              <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">Saison actuelle</div>
              <div className="font-bold text-amber-800 dark:text-amber-300 text-lg flex items-center">
                {currentSeasonInfo.icon} {currentSeasonInfo.name}
              </div>
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 shadow-lg border border-blue-200 dark:border-blue-700">
              <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Météo</div>
              <div className="font-bold text-blue-800 dark:text-blue-300 text-lg">
                {weather === 'sunny' ? '☀️' : weather === 'rainy' ? '🌧️' : '⛅'}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques de la ferme */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg border border-amber-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group touch-manipulation min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">{cultivatedPlots}/{totalPlots}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Parcelles cultivées</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg border border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300 group touch-manipulation min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                <Wheat className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{readyToHarvest}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Prêtes à récolte</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 group touch-manipulation min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{gameState.inventory.seeds}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Semences disponibles</div>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg border border-cyan-200 dark:border-cyan-800 hover:shadow-xl transition-all duration-300 group touch-manipulation min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
              </div>
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-600 mb-1">{gameState.farm.tools.eau}L</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">Eau disponible</div>
          </div>
        </div>
      </div>

      {/* Grille des parcelles */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
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
              className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl touch-manipulation min-h-[160px] sm:min-h-[180px] ${
                selectedPlot === plot.id 
                  ? 'border-amber-500 shadow-2xl ring-4 ring-amber-200 dark:ring-amber-800' 
                  : isEmpty 
                  ? 'border-dashed border-slate-300 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-600'
                  : 'border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
              onClick={() => setSelectedPlot(plot.id)}
            >
              {/* Indicateur de sélection */}
              {selectedPlot === plot.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-pulse z-10">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                </div>
              )}

              <div className="text-center">
                {/* État de la parcelle */}
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 transform transition-transform group-hover:scale-110">
                  {isEmpty ? '🟫' : plot.isReady ? cropInfo!.icon : '🌱'}
                </div>
                
                <div className={`font-bold text-xs sm:text-sm lg:text-base mb-2 ${
                  isEmpty 
                    ? 'text-slate-500 dark:text-gray-400' 
                    : 'text-slate-800 dark:text-white'
                }`}>
                  {isEmpty ? 'Parcelle vide' : cropInfo!.name}
                </div>
                
                {!isEmpty && (
                  <>
                    <div className={`text-xs sm:text-sm mb-2 sm:mb-3 font-semibold ${
                      plot.isReady 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {plot.isReady ? '🌾 Prête !' : `${daysSincePlanted}/${cropInfo!.plantingTime}j`}
                    </div>
                    
                    {/* Barre de progression */}
                    {!plot.isReady && (
                      <div className="w-full bg-slate-200 dark:bg-gray-600 rounded-full h-2 mb-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {/* Productivité */}
                    <div className="bg-slate-100 dark:bg-gray-700 rounded-lg p-1.5 sm:p-2 mb-2">
                      <div className="text-xs text-slate-600 dark:text-gray-400 mb-1">Prod.</div>
                      <div className="flex items-center justify-center">
                        <div className="text-xs font-bold text-slate-800 dark:text-white">
                          {Math.round(plot.productivity)}%
                        </div>
                        <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 ml-1 text-green-500" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions contextuelles */}
              {selectedPlot === plot.id && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-gray-600">
                  {isEmpty ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPlantingModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 touch-manipulation text-xs sm:text-sm"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      <span className="hidden sm:inline">Planter une culture</span>
                      <span className="sm:hidden">Planter</span>
                    </button>
                  ) : plot.isReady ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        harvestCrop(plot.id);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 touch-manipulation text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">🌾 Récolter maintenant</span>
                      <span className="sm:hidden">🌾 Récolter</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        irrigatePlot(plot.id);
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation text-xs sm:text-sm"
                      disabled={gameState.farm.tools.eau < 10}
                    >
                      <Droplets className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      <span className="hidden sm:inline">{gameState.farm.tools.eau < 10 ? 'Eau insuffisante' : 'Arroser (+10%)'}</span>
                      <span className="sm:hidden">Arroser</span>
                    </button>
                  )}
                </div>
              )}
              
              {/* Indicateur de productivité */}
              {!isEmpty && (
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                    plot.productivity >= 80 ? 'bg-green-500' :
                    plot.productivity >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Outils et améliorations */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-amber-200 dark:border-gray-700 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg mr-3">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300">Outils & Améliorations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl mr-3">
                  <Wrench className="w-6 h-6 text-amber-600" />
                </div>
                <span className="font-bold text-slate-800 dark:text-white text-lg">Houe</span>
              </div>
              <div className={`w-4 h-4 rounded-full ${gameState.farm.tools.houe ? 'bg-green-500 shadow-lg' : 'bg-slate-300'}`}></div>
            </div>
            <div className="text-sm text-slate-600 dark:text-gray-400 mb-3">Outil de base pour cultiver la terre et planter les semences</div>
            <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
              gameState.farm.tools.houe 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-slate-100 dark:bg-gray-600 text-slate-600 dark:text-gray-400'
            }`}>
              {gameState.farm.tools.houe ? '✓ Disponible' : 'Non disponible'}
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl mr-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-bold text-slate-800 dark:text-white text-lg">Tracteur</span>
              </div>
              <div className={`w-4 h-4 rounded-full ${gameState.farm.tools.tracteur ? 'bg-green-500 shadow-lg' : 'bg-slate-300'}`}></div>
            </div>
            <div className="text-sm text-slate-600 dark:text-gray-400 mb-3">Augmente la productivité de 50% (nécessite 100 L'Éveil)</div>
            <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
              gameState.farm.tools.tracteur 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : gameState.player.resources.leveil >= 100
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                : 'bg-slate-100 dark:bg-gray-600 text-slate-600 dark:text-gray-400'
            }`}>
              {gameState.farm.tools.tracteur ? '✓ Activé' : gameState.player.resources.leveil >= 100 ? '🔓 Débloqué' : '🔒 Verrouillé'}
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-xl mr-3">
                  <Droplets className="w-6 h-6 text-cyan-600" />
                </div>
                <span className="font-bold text-slate-800 dark:text-white text-lg">Irrigation</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-slate-300"></div>
            </div>
            <div className="text-sm text-slate-600 dark:text-gray-400 mb-3">Arrosage automatique (coûte 500 Faaïda)</div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-gray-600 text-slate-600 dark:text-gray-400">
              🔒 Verrouillé
            </div>
          </div>
        </div>
        
        {/* Guide d'amélioration */}
        <div className="mt-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold">Guide d'amélioration</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="font-semibold mb-2">🌱 Productivité</div>
              <p>Arrosez régulièrement vos cultures pour maintenir une productivité élevée</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="font-semibold mb-2">💧 Gestion de l'eau</div>
              <p>Surveillez vos réserves d'eau et investissez dans l'irrigation automatique</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de plantation */}
      {showPlantingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-amber-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-2xl inline-flex mb-4">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Choisir une culture</h3>
              <p className="text-slate-600 dark:text-gray-400">Sélectionnez le type de culture à planter sur cette parcelle</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {Object.entries(CROP_TYPES)
                .filter(([key]) => key !== 'empty')
                .map(([key, crop]) => (
                <button
                  key={key}
                  onClick={() => selectedPlot && plantCrop(selectedPlot, key as 'arachide' | 'mais' | 'mil')}
                  className="w-full p-6 bg-slate-50 dark:bg-gray-700/50 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 rounded-2xl border border-slate-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-600 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-4xl mr-4 transform group-hover:scale-110 transition-transform">{crop.icon}</div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-amber-700 dark:group-hover:text-amber-400">{crop.name}</div>
                        <div className="text-sm text-slate-600 dark:text-gray-400 mt-1">{crop.description}</div>
                        <div className="flex items-center mt-2 space-x-4 text-xs">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                            🌱 {crop.plantingTime} jours
                          </span>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                            💰 {crop.yield} rendement
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.floor(crop.faaidaReward * 0.2)} F
                      </div>
                      <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">Coût en Faaïda</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPlantingModal(false)}
                className="flex-1 bg-slate-200 dark:bg-gray-600 hover:bg-slate-300 dark:hover:bg-gray-500 text-slate-800 dark:text-white font-bold py-4 rounded-xl transition-all duration-300"
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