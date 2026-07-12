// Auto-generated Pro-CV Template Component
import { CVTemplateProps } from '@/types/cv'

const SectionHeader = ({ label, scale, primaryColor = '#d97706' }: { label: string; scale: number; primaryColor?: string }) => {
  const s = (n: number) => `${n * scale}px`;

  return (
    <div style={{ marginBottom: s(12), marginTop: s(16), display: 'flex', alignItems: 'center', gap: s(8) }}>
      <div style={{
        width: s(12),
        height: s(12),
        backgroundColor: primaryColor,
        transform: 'rotate(45deg)',
        flexShrink: 0
      }} />
      <h2 style={{ fontSize: s(11), fontWeight: 800, color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</h2>
      <div style={{ flex: 1, height: s(1), backgroundColor: '#e7e5e4', marginLeft: s(4) }} />
    </div>
  );
};

export default function M35CreativeAmberGeometric({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  // Default is Amber/Gold
  let primaryColor = '#d97706';
  let accentColor = '#b45309';
  let badgeBg = '#f5f5f4';
  let secondaryBg = '#e7e5e4';

  if (colorTheme === 'blue') {
    primaryColor = '#2563eb';
    accentColor = '#1d4ed8';
    badgeBg = '#f0f9ff';
    secondaryBg = '#e0f2fe';
  } else if (colorTheme === 'purple') {
    primaryColor = '#7c3aed';
    accentColor = '#6d28d9';
    badgeBg = '#faf5ff';
    secondaryBg = '#f3e8ff';
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#fafaf9',
      color: '#292524',
      padding: `${s(44)} ${s(48)}`,
      boxSizing: 'border-box',
      fontSize: s(10.5),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      
      {/* GEOMETRIC TOP ACCENT BAR */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: s(6),
        backgroundColor: primaryColor
      }} />

      {/* HEADER SECTION */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        borderBottom: `${s(2)} solid #1e293b`,
        paddingBottom: s(14),
        marginBottom: s(16)
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: s(24), fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>{data.fullName}</h1>
            <div style={{ fontSize: s(12), color: primaryColor, fontWeight: 700, marginTop: s(2), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {data.jobTitle}
            </div>
          </div>
          
          {/* Top Contact Block */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: `${s(3)} ${s(12)}`,
            fontSize: s(8.8),
            color: '#44403c',
            textAlign: 'right',
            maxWidth: s(320)
          }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.phone && <div>☎ {data.phone}</div>}
            {data.location && <div>📍 {data.location}</div>}
            {data.linkedin && <div>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</div>}
            {data.website && <div style={{ gridColumn: 'span 2' }}>🌐 {data.website.replace(/https?:\/\/(www\.)?/, '')}</div>}
          </div>
        </div>
      </div>

      {/* ASYMMETRICAL 2-COLUMN LAYOUT */}
      <div style={{ display: 'flex', gap: s(28) }}>
        
        {/* LEFT COLUMN: Summary & Experience */}
        <div style={{ flex: 1.7, display: 'flex', flexDirection: 'column', gap: s(12) }}>
          
          {/* Summary */}
          {data.summary && (
            <section style={{ marginBottom: s(6) }}>
              <SectionHeader label="Professional Profile" scale={scale} primaryColor={primaryColor} />
              <p style={{ margin: 0, fontSize: s(9.8), color: '#44403c', lineHeight: '1.6', textAlign: 'justify' }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <SectionHeader label="Experience & History" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12), marginTop: s(8) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{ borderLeft: `${s(2)} solid ${primaryColor}`, paddingLeft: s(12), marginLeft: s(4) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(10.5), color: '#1e293b' }}>{job.title}</strong>
                      <span style={{ fontSize: s(8.5), color: primaryColor, fontWeight: 700 }}>{job.startDate} – {job.endDate}</span>
                    </div>
                    <div style={{ fontSize: s(9.2), color: '#78716c', fontWeight: 600, marginBottom: s(4) }}>
                      {job.company} {job.location ? `• ${job.location}` : ''}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: s(10), fontSize: s(9), color: '#44403c', listStyleType: 'circle' }}>
                      {job.bullets.map((bullet, idx) => (
                        <li key={idx} style={{ marginBottom: s(2), lineHeight: '1.4' }}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Skills, Education, Achievements, Certs */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: s(12) }}>
          
          {/* Skills */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <section>
              <SectionHeader label="Competencies" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(8) }}>
                {Object.entries(data.technicalSkills).slice(0, 4).map(([cat, skills], i) => (
                  <div key={i}>
                    <div style={{ fontSize: s(8.5), fontWeight: 750, color: '#1e293b', marginBottom: s(2), textTransform: 'uppercase' }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(4) }}>
                      {skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: `${s(2)} ${s(5)}`,
                          backgroundColor: badgeBg,
                          color: '#292524',
                          border: `${s(1)} solid ${primaryColor}`,
                          borderRadius: s(4),
                          fontSize: s(8.2),
                          fontWeight: 550
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Achievements */}
          {data.keyAchievements && data.keyAchievements.length > 0 && (
            <section>
              <SectionHeader label="Achievements" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), marginTop: s(8) }}>
                {data.keyAchievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(6), fontSize: s(9), color: '#44403c', lineHeight: '1.3' }}>
                    <span style={{ color: primaryColor }}>◆</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <SectionHeader label="Education" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(8) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(9) }}>
                    <strong>{edu.degree}</strong>
                    <div style={{ color: '#44403c' }}>{edu.institution}</div>
                    <div style={{ color: '#78716c', fontSize: s(8) }}>{edu.startYear} - {edu.endYear} {edu.distinction ? `(${edu.distinction})` : ''}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <SectionHeader label="Credentials" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), marginTop: s(8) }}>
                {data.certifications.map((cert, i) => (
                  <div key={i} style={{ fontSize: s(8.5), color: '#44403c' }}>
                    <strong>{cert.name}</strong>
                    <div style={{ color: '#78716c', fontSize: s(7.8) }}>{cert.issuer} — {cert.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section>
              <SectionHeader label="Languages" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(6), marginTop: s(8) }}>
                {data.languages.map((lang, i) => (
                  <span key={i} style={{
                    padding: `${s(2)} ${s(6)}`,
                    backgroundColor: secondaryBg,
                    borderRadius: s(4),
                    fontSize: s(8.2),
                    color: '#292524'
                  }}>
                    <strong>{lang.language}</strong> ({lang.level})
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div style={{
        marginTop: s(28),
        paddingTop: s(8),
        borderTop: `${s(1)} solid #e7e5e4`,
        fontSize: s(8.5),
        color: '#a8a29e',
        textAlign: 'center'
      }}>
        References available upon request — Generated via Pro-CV
      </div>
    </div>
  )
}
