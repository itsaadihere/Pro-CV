// Auto-generated Pro-CV Template Component
import { CVTemplateProps } from '@/types/cv'

const SectionHeader = ({ label, scale, primaryColor = '#6d28d9' }: { label: string; scale: number; primaryColor?: string }) => {
  const s = (n: number) => `${n * scale}px`;

  return (
    <div style={{ marginBottom: s(10), marginTop: s(14) }}>
      <h2 style={{ fontSize: s(11), fontWeight: 800, color: primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</h2>
      <div style={{ height: s(2), background: `linear-gradient(90deg, ${primaryColor} 0%, rgba(0, 0, 0, 0.05) 100%)`, marginTop: s(4), borderRadius: s(1) }} />
    </div>
  );
};

export default function M34CreativeAmethystHeader({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  // Default is Purple
  let primaryColor = '#6d28d9';
  let textAccent = '#7c3aed';
  let secondaryColor = '#faf5ff';
  let borderColor = '#f3e8ff';
  let tagBorderColor = '#ddd6fe';
  let headerGradient = 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)';
  let contactColor = '#ede9fe';
  let jobTitleColor = '#f3e8ff';

  if (colorTheme === 'blue') {
    primaryColor = '#1d4ed8';
    textAccent = '#2563eb';
    secondaryColor = '#eff6ff';
    borderColor = '#dbeafe';
    tagBorderColor = '#bfdbfe';
    headerGradient = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
    contactColor = '#dbeafe';
    jobTitleColor = '#eff6ff';
  } else if (colorTheme === 'gold') {
    primaryColor = '#b45309';
    textAccent = '#d97706';
    secondaryColor = '#fefdf0';
    borderColor = '#fef3c7';
    tagBorderColor = '#fde68a';
    headerGradient = 'linear-gradient(135deg, #78350f 0%, #d97706 100%)';
    contactColor = '#fef3c7';
    jobTitleColor = '#fef9e7';
  }

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#1e293b',
      padding: `${s(40)} ${s(44)}`,
      boxSizing: 'border-box',
      fontSize: s(10.5),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      
      {/* PURPLE/BLUE/GOLD ACCENT BANNER */}
      <div style={{
        background: headerGradient,
        color: '#ffffff',
        borderRadius: s(8),
        padding: `${s(24)} ${s(28)}`,
        marginBottom: s(18),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: s(20),
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: s(22), fontWeight: 850, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>{data.fullName}</h1>
          <div style={{ fontSize: s(11.5), color: jobTitleColor, marginTop: s(4), fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {data.jobTitle}
          </div>
          
          {/* Horizontal list of contact info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${s(4)} ${s(14)}`, fontSize: s(9), color: contactColor, marginTop: s(12) }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.phone && <div>☎ {data.phone}</div>}
            {data.location && <div>📍 {data.location}</div>}
            {data.linkedin && <div>🔗 {data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</div>}
            {data.website && <div>🌐 {data.website.replace(/https?:\/\/(www\.)?/, '')}</div>}
          </div>
        </div>

        {/* Initials avatar badge */}
        <div style={{
          width: s(64),
          height: s(64),
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: `${s(1.5)} solid rgba(255, 255, 255, 0.3)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: s(20),
          fontWeight: 800,
          flexShrink: 0
        }}>
          {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
        </div>
      </div>

      {/* SUMMARY */}
      {data.summary && (
        <section style={{
          backgroundColor: secondaryColor,
          borderLeft: `${s(3)} solid ${textAccent}`,
          padding: `${s(8)} ${s(12)}`,
          borderRadius: `0 ${s(6)} ${s(6)} 0`,
          marginBottom: s(14)
        }}>
          <p style={{ margin: 0, fontSize: s(9.8), color: primaryColor, lineHeight: '1.5', fontWeight: 500, textAlign: 'justify' }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* TWO COLUMN CONTENT */}
      <div style={{ display: 'flex', gap: s(24) }}>
        
        {/* LEFT COLUMN: Experience & Achievements */}
        <div style={{ flex: 1.8, display: 'flex', flexDirection: 'column', gap: s(14) }}>
          
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <SectionHeader label="Experience" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12), marginTop: s(8) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(10.5), color: primaryColor }}>{job.title}</strong>
                      <span style={{ fontSize: s(8.5), color: '#64748b', fontWeight: 600 }}>{job.startDate} – {job.endDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: s(9), color: textAccent, fontWeight: 650, marginBottom: s(4) }}>
                      <span>{job.company}</span>
                      {job.location && <span style={{ color: '#64748b', fontWeight: 'normal' }}>📍 {job.location}</span>}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: s(12), fontSize: s(9), color: '#334155', listStyleType: 'disc' }}>
                      {job.bullets.map((bullet, idx) => (
                        <li key={idx} style={{ marginBottom: s(2.5), lineHeight: '1.4' }}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {data.keyAchievements && data.keyAchievements.length > 0 && (
            <section>
              <SectionHeader label="Key Achievements" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), marginTop: s(8) }}>
                {data.keyAchievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(8), fontSize: s(9), color: '#334155', lineHeight: '1.4' }}>
                    <span style={{ color: textAccent }}>★</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Skills, Education, Certs */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: s(14) }}>
          
          {/* Skills */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <section>
              <SectionHeader label="Key Skills" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(8) }}>
                {Object.entries(data.technicalSkills).slice(0, 4).map(([cat, skills], i) => (
                  <div key={i} style={{
                    backgroundColor: secondaryColor,
                    padding: s(6),
                    borderRadius: s(6),
                    border: `${s(0.5)} solid ${borderColor}`
                  }}>
                    <div style={{ fontSize: s(8.5), fontWeight: 700, color: primaryColor, marginBottom: s(4), textTransform: 'uppercase' }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(4) }}>
                      {skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: `${s(2)} ${s(5)}`,
                          backgroundColor: '#ffffff',
                          color: primaryColor,
                          borderRadius: s(4),
                          fontSize: s(8),
                          fontWeight: 600,
                          border: `${s(0.5)} solid ${tagBorderColor}`
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

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <SectionHeader label="Education" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(8) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(9) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ color: primaryColor, fontSize: s(9.5) }}>{edu.degree}</strong>
                    </div>
                    <div style={{ color: '#334155', fontWeight: 500 }}>{edu.institution}</div>
                    <div style={{ color: '#64748b', fontSize: s(8) }}>{edu.startYear} - {edu.endYear} {edu.distinction ? `| ${edu.distinction}` : ''}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <SectionHeader label="Certifications" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), marginTop: s(8) }}>
                {data.certifications.map((cert, i) => (
                  <div key={i} style={{
                    fontSize: s(8.5),
                    color: '#334155',
                    paddingBottom: s(3),
                    borderBottom: `${s(0.5)} solid ${borderColor}`
                  }}>
                    <strong>{cert.name}</strong>
                    <div style={{ color: '#64748b', fontSize: s(7.8) }}>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <section>
              <SectionHeader label="Languages" scale={scale} primaryColor={primaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(3), fontSize: s(8.8), marginTop: s(8) }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                    <strong>{lang.language}</strong>
                    <span style={{ color: textAccent, fontWeight: 500 }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div style={{
        marginTop: s(30),
        paddingTop: s(8),
        borderTop: `${s(1)} solid ${borderColor}`,
        fontSize: s(8.5),
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        References available upon request — Generated via Pro-CV
      </div>
    </div>
  )
}
