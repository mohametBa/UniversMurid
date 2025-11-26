// app/api/game-stats/achievements/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Récupérer les achievements du joueur
export async function GET(request: NextRequest) {
  try {
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

    // Récupérer les achievements
    const { data, error } = await supabase
      .from('player_achievements')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error('Erreur GET achievements:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}