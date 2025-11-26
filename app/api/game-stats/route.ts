// app/api/game-stats/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Récupérer les stats du joueur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameType = searchParams.get('gameType');

    // Récupérer l'utilisateur depuis les headers ajoutés par le middleware ou Supabase
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié - utilisateur non identifié' },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur existe toujours
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Session expirée - veuillez vous reconnecter' },
        { status: 401 }
      );
    }

    if (!gameType) {
      return NextResponse.json(
        { error: 'gameType requis' },
        { status: 400 }
      );
    }

    // Récupérer les stats depuis la table game_stats
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('game_type', gameType)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Aucune sauvegarde trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Erreur GET game-stats:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST: Sauvegarder les stats du joueur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameType, gameState, totalPlayTime, sessionPlayTime } = body;

    // Récupérer l'utilisateur depuis les headers ajoutés par le middleware ou Supabase
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié - utilisateur non identifié' },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur existe toujours
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Session expirée - veuillez vous reconnecter' },
        { status: 401 }
      );
    }

    if (!gameType || !gameState) {
      return NextResponse.json(
        { error: 'gameType et gameState requis' },
        { status: 400 }
      );
    }

    // Vérifier si des stats existent déjà
    const { data: existingStats } = await supabase
      .from('game_stats')
      .select('id, total_play_time')
      .eq('user_id', user.id)
      .eq('game_type', gameType)
      .single();

    const finalTotalPlayTime = existingStats
      ? existingStats.total_play_time + (sessionPlayTime || 0)
      : (totalPlayTime || sessionPlayTime || 0);

    const statsData = {
      user_id: user.id,
      game_type: gameType,
      game_state: gameState,
      total_play_time: finalTotalPlayTime,
      session_play_time: sessionPlayTime || 0,
      last_saved: new Date().toISOString(),
      version: 1
    };

    let result;
    if (existingStats) {
      // Mise à jour
      const { data, error } = await supabase
        .from('game_stats')
        .update(statsData)
        .eq('id', existingStats.id)
        .select();

      if (error) throw error;
      result = data?.[0];
    } else {
      // Création
      const { data, error } = await supabase
        .from('game_stats')
        .insert([statsData])
        .select();

      if (error) throw error;
      result = data?.[0];
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Erreur POST game-stats:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}