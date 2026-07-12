// Auto-generated Pro-CV Template Component
import { CVTemplateProps } from '@/types/cv'

const SectionHeader = ({ label, scale, primaryColor = '#f43f5e' }: { label: string; scale: number; primaryColor?: string }) => {
  const s = (n: number) => `${n * scale}px`;

  return (
    <div style={{ marginBottom: s(12), marginTop: s(16), display: 'flex', alignItems: 'center' }}>
      <div style={{ width: s(4), height: s(14), backgroundColor: primaryColor, marginRight: s(8), borderRadius: s(2) }} />
      <h2 style={{ fontSize: s(11), fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</h2>
    </div>
  );
};

export default function M36CreativeCoralModernist({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  // Default is Coral
  let primaryColor = '#f43f5e';
  let accentColor = '#e11d48';
  let badgeBg = '#ffe4e6';

  if (colorTheme === 'blue') {
    primaryColor = '#3b82f6';
    accentColor = '#2563eb';
    badgeBg = '#eff6ff';
  } else if (colorTheme === 'purple') {
    primaryColor = '#7c3aed';
    accentColor = '#6d28d9';
    badgeBg = '#faf5ff';
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#334155',
      padding: `${s(40)} ${s(44)}`,
      boxSizing: 'border-box',
      fontSize: s(10.5),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      
      {/* HEADER SECTION */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: s(16),
        borderBottom: `${s(2)} solid #f1f5f9`,
        marginBottom: s(16)
      }}>
        <div>
          <h1 style={{ fontSize: s(22), fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{data.fullName}</h1>
          <div style={{ fontSize: s(11), color: primaryColor, fontWeight: 700, marginTop: s(2), textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {data.jobTitle}
          </div>
        </div>

        {/* badge initials */}
        <div style={{
          width: s(60),
          height: s(60),
          borderRadius: s(8),
          backgroundColor: badgeBg,
          color: primaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s(18),
          fontWeight: 800,
          boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05)`,
          flexShrink: 0
        }}>
          {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
        </div>
      </div>

      {/* BODY IN TWO-COLUMNS (Left: main, Right: sidebar info) */}
      <div style={{ display: 'flex', gap: s(24), minHeight: s(940) }}>
        
        {/* LEFT COLUMN: Main content */}
        <div style={{ flex: 1.7, display: 'flex', flexDirection: 'column', gap: s(14) }}>
          
          {/* Summary */}
          {data.summary && (
            <section>
              <SectionHeader label="Professional Profile" scale={scale} primaryColor={primaryColor} />
              <p style={{ margin: 0, fontSize: s(9.8), color: '#334155', lineHeight: '1.6', textAlign: 'justify' }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <SectionHeader label="Employment History" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12), marginTop: s(8) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{ borderLeft: `${s(1.5)} solid ${badgeBg}`, paddingLeft: s(12), marginLeft: s(2) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(10.5), color: '#0f172a' }}>{job.title}</strong>
                      <span style={{ fontSize: s(8.5), color: primaryColor, fontWeight: 650 }}>{job.startDate} – {job.endDate}</span>
                    </div>
                    <div style={{ fontSize: s(9.2), color: '#475569', fontWeight: 600, marginBottom: s(4) }}>
                      {job.company} {job.location ? `• ${job.location}` : ''}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: s(12), fontSize: s(9), color: '#334155', listStyleType: 'square' }}>
                      {job.bullets.map((bullet, idx) => (
                        <li key={idx} style={{ marginBottom: s(2.5), lineHeight: '1.4' }}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Achievements */}
          {data.keyAchievements && data.keyAchievements.length > 0 && (
            <section>
              <SectionHeader label="Key Projects & Accomplishments" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), marginTop: s(8) }}>
                {data.keyAchievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(6), fontSize: s(9), color: '#334155', lineHeight: '1.4' }}>
                    <span style={{ color: primaryColor, fontWeight: 'bold' }}>✓</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar info (Contact, Skills, Education, Languages) */}
        <div style={{
          width: s(210),
          backgroundColor: '#f8fafc',
          borderRadius: s(8),
          padding: `${s(20)} ${s(14)}`,
          display: 'flex',
          flexDirection: 'column',
          gap: s(16),
          boxSizing: 'border-box'
        }}>
          
          {/* Contact Details */}
          <div>
            <SectionHeader label="Contact Info" scale={scale} primaryColor={primaryColor} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), fontSize: s(8.8), color: '#475569', marginTop: s(6) }}>
              {data.email && <div style={{ wordBreak: 'break-all' }}>✉ {data.email}</div>}
              {data.phone && <div>☎ {data.phone}</div>}
              {data.location && <div>📍 {data.location}</div>}
              {data.linkedin && <div style={{ wordBreak: 'break-all' }}>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</div>}
              {data.website && <div style={{ wordBreak: 'break-all' }}>🌐 {data.website.replace(/https?:\/\/(www\.)?/, '')}</div>}
            </div>
          </div>

          {/* Skills */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <div>
              <SectionHeader label="Key Skills" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(6) }}>
                {Object.entries(data.technicalSkills).slice(0, 4).map(([cat, skills], i) => (
                  <div key={i}>
                    <div style={{ fontSize: s(8.5), fontWeight: 750, color: '#0f172a', marginBottom: s(2), textTransform: 'uppercase' }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(3) }}>
                      {skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: `${s(2)} ${s(5)}`,
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          borderRadius: s(4),
                          fontSize: s(8),
                          fontWeight: 500,
                          border: `${s(0.5)} solid #e2e8f0`
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <SectionHeader label="Education" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(6) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(8.8) }}>
                    <strong style={{ color: '#0f172a' }}>{edu.degree}</strong>
                    <div style={{ color: '#475569' }}>{edu.institution}</div>
                    <div style={{ color: '#64748b', fontSize: s(7.8) }}>{edu.startYear} - {edu.endYear} {edu.distinction ? `| ${edu.distinction}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <SectionHeader label="Credentials" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), marginTop: s(6) }}>
                {data.certifications.map((cert, i) => (
                  <div key={i} style={{
                    fontSize: s(8.2),
                    color: '#475569',
                    borderBottom: `${s(0.5)} solid #e2e8f0`,
                    paddingBottom: s(2)
                  }}>
                    <strong>{cert.name}</strong>
                    <div style={{ color: '#64748b', fontSize: s(7.5) }}>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <SectionHeader label="Languages" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(3), fontSize: s(8.8), marginTop: s(6) }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <strong>{lang.language}</strong>
                    <span style={{ color: primaryColor, fontWeight: 650 }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div style={{
        marginTop: s(24),
        paddingTop: s(8),
        borderTop: `${s(1)} solid #f1f5f9`,
        fontSize: s(8.5),
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        References available upon request — Generated via Pro-CV
      </div>
    </div>
  )
}
