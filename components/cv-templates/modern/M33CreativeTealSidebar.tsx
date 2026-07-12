// Auto-generated Pro-CV Template Component
import { CVTemplateProps } from '@/types/cv'

const SectionHeader = ({ label, scale, dark = false, primaryColor = '#0f766e', secondaryColor = '#f0fdfa' }: { label: string; scale: number; dark?: boolean; primaryColor?: string; secondaryColor?: string }) => {
  const s = (n: number) => `${n * scale}px`;

  return (
    <div style={{ marginBottom: s(12), marginTop: s(16), borderLeft: `${s(4)} solid ${dark ? secondaryColor : primaryColor}`, paddingLeft: s(8) }}>
      <h2 style={{ fontSize: s(11.5), fontWeight: 800, color: dark ? '#ffffff' : primaryColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</h2>
    </div>
  );
};

export default function M33CreativeTealSidebar({ data, scale = 1, colorTheme }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`

  // Default is Teal
  let primaryColor = '#0f766e'; // teal-700
  let secondaryColor = '#f0fdfa'; // teal-50
  let textAccent = '#0d9488'; // teal-600
  let avatarColor = '#ccfbf1'; // teal-100

  if (colorTheme === 'blue') {
    primaryColor = '#1e3a8a'; // blue-900
    secondaryColor = '#eff6ff'; // blue-50
    textAccent = '#2563eb'; // blue-600
    avatarColor = '#dbeafe'; // blue-100
  } else if (colorTheme === 'gold') {
    primaryColor = '#78350f'; // amber-900
    secondaryColor = '#fef3c7'; // amber-50
    textAccent = '#d97706'; // amber-600
    avatarColor = '#fef3c7'; // amber-100
  } else if (colorTheme === 'purple') {
    primaryColor = '#4c1d95'; // purple-900
    secondaryColor = '#f5f3ff'; // purple-50
    textAccent = '#7c3aed'; // purple-600
    avatarColor = '#ddd6fe'; // purple-100
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
      <div style={{ display: 'flex', minHeight: s(1043), gap: s(28) }}>
        
        {/* LEFT SIDEBAR (Dynamic Color panel) */}
        <div style={{
          width: s(220),
          backgroundColor: primaryColor,
          color: '#ffffff',
          padding: `${s(28)} ${s(18)}`,
          borderRadius: s(8),
          display: 'flex',
          flexDirection: 'column',
          gap: s(20),
          boxSizing: 'border-box'
        }}>
          {/* Avatar Initials block */}
          <div style={{ textAlign: 'center', marginBottom: s(10) }}>
            <div style={{
              width: s(70),
              height: s(70),
              borderRadius: '50%',
              backgroundColor: secondaryColor,
              color: primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto ' + s(12),
              fontSize: s(22),
              fontWeight: 800,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              lineHeight: s(70),
              textAlign: 'center'
            }}>
              {data.fullName ? data.fullName.substring(0, 2).toUpperCase() : 'CV'}
            </div>
            <h1 style={{ fontSize: s(16), fontWeight: 850, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>{data.fullName}</h1>
            <div style={{ fontSize: s(9.5), color: avatarColor, marginTop: s(4), fontWeight: 500, letterSpacing: '0.02em' }}>{data.jobTitle}</div>
          </div>

          {/* Contact Details */}
          <div>
            <SectionHeader label="Contact" scale={scale} dark={true} primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), fontSize: s(9), color: secondaryColor, marginTop: s(6) }}>
              {data.email && <div style={{ display: 'flex', alignItems: 'center', gap: s(6) }}><span style={{ opacity: 0.85 }}>✉</span> <span style={{ wordBreak: 'break-all' }}>{data.email}</span></div>}
              {data.phone && <div style={{ display: 'flex', alignItems: 'center', gap: s(6) }}><span style={{ opacity: 0.85 }}>☎</span> <span>{data.phone}</span></div>}
              {data.location && <div style={{ display: 'flex', alignItems: 'center', gap: s(6) }}><span style={{ opacity: 0.85 }}>📍</span> <span>{data.location}</span></div>}
              {data.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: s(6) }}><span style={{ opacity: 0.85 }}>🔗</span> <span style={{ wordBreak: 'break-all' }}>{data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span></div>}
              {data.website && <div style={{ display: 'flex', alignItems: 'center', gap: s(6) }}><span style={{ opacity: 0.85 }}>🌐</span> <span style={{ wordBreak: 'break-all' }}>{data.website.replace(/https?:\/\/(www\.)?/, '')}</span></div>}
            </div>
          </div>

          {/* Technical Skills */}
          {Object.keys(data.technicalSkills).length > 0 && (
            <div>
              <SectionHeader label="Skills" scale={scale} dark={true} primaryColor={primaryColor} secondaryColor={secondaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(6) }}>
                {Object.entries(data.technicalSkills).slice(0, 5).map(([cat, skills], i) => (
                  <div key={i}>
                    <div style={{ fontSize: s(9), fontWeight: 700, color: avatarColor, marginBottom: s(2), textTransform: 'uppercase', letterSpacing: '0.02em' }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(4) }}>
                      {skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: `${s(2.5)} ${s(6)}`,
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          borderRadius: s(4),
                          fontSize: s(8.5),
                          fontWeight: 500,
                          border: `${s(0.5)} solid rgba(255, 255, 255, 0.2)`
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

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <SectionHeader label="Languages" scale={scale} dark={true} primaryColor={primaryColor} secondaryColor={secondaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(9), color: secondaryColor, marginTop: s(6) }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `${s(0.5)} solid rgba(255,255,255,0.1)`, paddingBottom: s(2) }}>
                    <strong style={{ color: '#ffffff' }}>{lang.language}</strong>
                    <span style={{ fontSize: s(8.5), opacity: 0.9 }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Main Content) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: s(16) }}>
          
          {/* Summary */}
          {data.summary && (
            <section>
              <SectionHeader label="About Me" scale={scale} primaryColor={primaryColor} secondaryColor={secondaryColor} />
              <p style={{ margin: 0, fontSize: s(10), color: '#334155', lineHeight: '1.6', textAlign: 'justify' }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <SectionHeader label="Professional History" scale={scale} primaryColor={primaryColor} secondaryColor={secondaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(12), marginTop: s(8) }}>
                {data.experience.map((job, i) => (
                  <div key={i} style={{ position: 'relative', borderLeft: `${s(1.5)} solid ${avatarColor}`, paddingLeft: s(14), marginLeft: s(6) }}>
                    {/* Timeline Node dot */}
                    <div style={{
                      position: 'absolute',
                      left: s(-4),
                      top: s(2),
                      width: s(7),
                      height: s(7),
                      borderRadius: '50%',
                      backgroundColor: primaryColor,
                      border: `${s(1.5)} solid #ffffff`
                    }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: s(2) }}>
                      <strong style={{ fontSize: s(11), color: primaryColor }}>{job.title}</strong>
                      <span style={{ fontSize: s(9), color: '#64748b', fontWeight: 550 }}>{job.startDate} – {job.endDate}</span>
                    </div>
                    <div style={{ fontSize: s(9.5), color: '#334155', fontWeight: 650, marginBottom: s(4) }}>
                      {job.company} {job.location ? `| ${job.location}` : ''}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: s(12), fontSize: s(9.2), color: '#475569', listStyleType: 'square' }}>
                      {job.bullets.map((bullet, idx) => (
                        <li key={idx} style={{ marginBottom: s(3), lineHeight: '1.4' }}>{bullet}</li>
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
              <SectionHeader label="Key Accomplishments" scale={scale} primaryColor={primaryColor} secondaryColor={secondaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), marginTop: s(8) }}>
                {data.keyAchievements.map((ach, i) => (
                  <div key={i} style={{ display: 'flex', gap: s(8), fontSize: s(9.5), color: '#475569', lineHeight: '1.4' }}>
                    <span style={{ color: primaryColor, fontWeight: 'bold' }}>✦</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <SectionHeader label="Education" scale={scale} primaryColor={primaryColor} secondaryColor={secondaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(8), marginTop: s(8) }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ fontSize: s(9.5) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ color: primaryColor, fontSize: s(10) }}>{edu.degree}</strong>
                      <span style={{ color: '#64748b', fontSize: s(8.5), fontWeight: 550 }}>{edu.startYear} - {edu.endYear}</span>
                    </div>
                    <div style={{ color: '#334155', fontWeight: 500 }}>{edu.institution}</div>
                    {edu.distinction && <div style={{ color: textAccent, fontSize: s(8.5), fontStyle: 'italic' }}>{edu.distinction}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <SectionHeader label="Credentials" scale={scale} primaryColor={primaryColor} secondaryColor={secondaryColor} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(8), marginTop: s(8) }}>
                {data.certifications.map((cert, i) => (
                  <div key={i} style={{
                    padding: `${s(4)} ${s(8)}`,
                    backgroundColor: secondaryColor,
                    border: `${s(0.5)} solid ${avatarColor}`,
                    borderRadius: s(4),
                    fontSize: s(9),
                    color: primaryColor,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: s(120),
                    flex: '1 1 auto'
                  }}>
                    <strong>{cert.name}</strong>
                    <span style={{ color: '#475569', fontSize: s(8) }}>{cert.issuer} ({cert.year})</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Volunteer Work (Optional) */}
          {data.volunteerWork && data.volunteerWork.length > 0 && (
            <section>
              <SectionHeader label="Community Involvement" scale={scale} primaryColor={primaryColor} secondaryColor={secondaryColor} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: s(6), marginTop: s(8) }}>
                {data.volunteerWork.map((vol, i) => (
                  <div key={i} style={{ fontSize: s(9.5) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ color: primaryColor }}>{vol.role}</strong>
                      <span style={{ color: '#64748b', fontSize: s(8.5) }}>{vol.period}</span>
                    </div>
                    <div style={{ color: '#334155', fontStyle: 'italic', fontSize: s(9) }}>{vol.org}</div>
                    {vol.description && <p style={{ margin: `${s(2)} 0 0 0`, fontSize: s(8.5), color: '#475569' }}>{vol.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div style={{
        marginTop: s(24),
        paddingTop: s(8),
        borderTop: `${s(1)} solid ${secondaryColor}`,
        fontSize: s(8.5),
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        References available upon request — Generated via Pro-CV
      </div>
    </div>
  )
}
