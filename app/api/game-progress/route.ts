// app/api/game-progress/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Récupérer la progression du jeu
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameType = searchParams.get('gameType');

    if (!gameType) {
      return NextResponse.json(
        { error: 'gameType requis' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur depuis le token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentification invalide' },
        { status: 401 }
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
      // Retourner un état initial si aucune sauvegarde n'existe
      return NextResponse.json(null, { status: 200 });
    }

    // Retourner le gameState directement pour compatibilité avec useGameStats
    return NextResponse.json(data.game_state, { status: 200 });
  } catch (error) {
    console.error('Erreur GET game-progress:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST: Sauvegarder la progression du jeu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameType, ...gameState } = body;

    if (!gameType) {
      return NextResponse.json(
        { error: 'gameType requis' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur depuis le token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentification invalide' },
        { status: 401 }
      );
    }

    // Vérifier si des stats existent déjà
    const { data: existingStats } = await supabase
      .from('game_stats')
      .select('id, total_play_time')
      .eq('user_id', user.id)
      .eq('game_type', gameType)
      .single();

    const statsData = {
      user_id: user.id,
      game_type: gameType,
      game_state: gameState,
      total_play_time: existingStats?.total_play_time || 0,
      session_play_time: 0,
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

    // Retourner le gameState sauvegardé pour compatibilité avec useGameStats
    return NextResponse.json(result?.game_state || gameState, { status: 200 });
  } catch (error) {
    console.error('Erreur POST game-progress:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}