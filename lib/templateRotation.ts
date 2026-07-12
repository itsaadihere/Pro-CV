import { getServiceSupabase } from '@/lib/supabase-server'

export class TemplateRotationEngine {
  private readonly MODERN_TEMPLATES = [
    'm-01-black-modern-professional',
    'm-02-black-white-minimalist',
    'm-03-black-grey-infographic',
    'm-04-blue-light-blue-color-blocks',
    'm-05-blue-simple-professional-2',
    'm-06-blue-simple-professional',
    'm-07-blue-gray-simple-professional',
    'm-08-blue-white-modern-professional',
    'm-09-blue-white-simple-professional',
    'm-10-deep-purple-college-student',
    'm-11-green-elegant-professional',
    'm-12-minimalist-cv',
    'm-13-modern-minimalist-1',
    'm-14-modern-minimalist',
    'm-15-modern-minimalist-professional-1',
    'm-16-modern-minimalist-professional-2',
    'm-17-modern-minimalist-professional-3',
    'm-18-modern-minimalist-professional',
    'm-19-modern-professional',
    'm-20-professional-cv',
    'm-21-professional-modern-1',
    'm-22-professional-modern-2',
    'm-23-professional-modern',
    'm-24-red-black-bold-graphic',
    'm-25-white-black-elegant-corporate',
    'm-26-white-cream-beige-geometric',
    'm-27-white-simple-sales',
    'm-28-white-simple-student',
    'm-29-white-beige-minimalist-graphic',
    'm-30-white-green-simple-student',
    'm-31-white-simple-student-3',
    'm-32-blue-minimalist-modern',
    'm-33-creative-teal-sidebar',
    'm-34-creative-amethyst-header',
    'm-35-creative-amber-geometric',
    'm-36-creative-coral-modernist',
  ]

  private readonly MINIMALIST_TEMPLATES = [
    'min-01-black-white-minimalist-accountant',
    'min-02-black-white-simple-infographic',
    'min-03-black-white-simple-minimalist',
    'min-04-blue-simple-professional-1',
    'min-05-gray-white-simple-clean',
    'min-06-gray-white-simple-professional',
    'min-07-minimalist-white-grey-professional',
    'min-08-professional-modern-3',
    'min-09-science-engineering-green',
    'min-10-science-engineering-white',
    'min-11-simple-elegant-clean-classic',
    'min-12-white-clean-minimalist-business',
    'min-13-white-modern-business-admin',
    'min-14-white-blue-minimalist-corporate-ats',
    'min-15-grey-white-cv',
    'min-16-white-simple-student-1',
    'min-17-white-simple-student-2',
  ]

  async getNextTemplate(
    userId: string,
    preferredStyle: 'modern' | 'minimalist' | 'random'
  ): Promise<string> {
    const supabase = getServiceSupabase()

    // 1. Fetch this user's template history from Supabase
    const { data } = await supabase
      .from('template_history')
      .select('template_id, used_at')
      .eq('user_id', userId)
      .order('used_at', { ascending: false })

    const usedIds = data?.map(r => r.template_id) ?? []

    // 2. Determine pool based on style preference (Force Modern templates only)
    const pool = this.MODERN_TEMPLATES

    // 3. Shuffle pool once at start using Fisher-Yates
    const shuffled = this.shuffleArray([...pool])

    // 4. Find first unused template in shuffled order
    let candidate = shuffled.find(t => !usedIds.includes(t))

    // 5. If all used (full cycle complete) → reset and start new cycle
    if (!candidate) {
      await supabase
        .from('template_history')
        .delete()
        .eq('user_id', userId)
      candidate = shuffled[0]
    }

    // 6. Ensure no consecutive repeat (extra safety check)
    const lastUsed = usedIds[0]
    if (candidate === lastUsed && shuffled.length > 1) {
      candidate = shuffled.find(t => t !== lastUsed && !usedIds.includes(t))
        ?? shuffled.find(t => t !== lastUsed)
        ?? shuffled[0]
    }

    // 7. Record selection
    await supabase.from('template_history').insert({
      user_id: userId,
      template_id: candidate,
      used_at: new Date().toISOString()
    })

    return candidate!
  }

  private shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }
}
