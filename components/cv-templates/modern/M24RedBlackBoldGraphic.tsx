// Auto-generated Pro-CV Template Component
import { CVTemplateProps } from '@/types/cv'


    const SectionHeader = ({ label, scale }: { label: string; scale: number }) => {
      const s = (n: number) => `${n * scale}px`;
  
      return (
        <div style={{ marginBottom: s(10), marginTop: s(14) }}>
          <h2 style={{ fontSize: s(12), fontWeight: 800, color: '#dc2626', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>{label}</h2>
          <div style={{ height: s(1.5), backgroundColor: '#dc2626', marginTop: s(3) }} />
        </div>
      );
    };
    

export default function M24RedBlackBoldGraphic({ data, scale = 1 }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`
  const isTwoColumn = true;
  const isLeftSidebar = true;

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#ffffff',
      padding: `${s(48)} ${s(56)}`,
      boxSizing: 'border-box',
      fontSize: s(10.5),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      

      {/* HEADER */}
      

      {/* BODY */}
      
        <div style={{ display: 'flex', minHeight: s(1027), gap: s(24) }}>
          {/* LEFT SIDEBAR */}
          <div style={{
            width: s(220),
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: `${s(24)} ${s(16)}`,
            borderRadius: s(4)
          }}>
            
      <div style={{ marginBottom: s(20), textAlign: 'center' }}>
        <h1 style={{ fontSize: s(22), fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>{data.fullName}</h1>
        <div style={{ height: s(2), backgroundColor: '#dc2626', width: s(40), margin: `${s(8)} auto` }} />
        <div style={{ fontSize: s(10), color: '#dc2626', fontWeight: 700 }}>{data.jobTitle}</div>
      </div>
    
            
    {/* Sidebar contact info */}
    <div style={{ marginBottom: s(16) }}>
      <h3 style={{ fontSize: s(10), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: isLeftSidebar ? '#ffffff' : '#ffffff', marginBottom: s(6) }}>Contact</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(9.5), color: isLeftSidebar ? '#d1d5db' : '#9ca3af' }}>
        {data.email && <span>✉ {data.email}</span>}
        {data.phone && <span>☎ {data.phone}</span>}
        {data.location && <span>📍 {data.location}</span>}
        {data.linkedin && <span style={{ wordBreak: 'break-all' }}>🔗 {data.linkedin}</span>}
      </div>
    </div>

    {/* Sidebar skills */}
    {Object.keys(data.technicalSkills).length > 0 && (
      <div style={{ marginBottom: s(16) }}>
        <SectionHeader label="Skills" scale={scale} />
        
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
        {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
          <div key={i} style={{ marginBottom: s(2) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: s(9.5), fontWeight: 600, color: isTwoColumn ? '#ffffff' : '#ffffff', marginBottom: s(2) }}>
              <span>{cat}</span>
            </div>
            <div style={{ height: s(5), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: s(2.5), overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: '#dc2626' }} />
            </div>
            <div style={{ fontSize: s(8.5), color: isTwoColumn ? '#d1d5db' : '#9ca3af', marginTop: s(2) }}>{skills.join(', ')}</div>
          </div>
        ))}
      </div>
    
      </div>
    )}

    {/* Sidebar languages */}
    {data.languages.length > 0 && (
      <div style={{ marginBottom: s(16) }}>
        <SectionHeader label="Languages" scale={scale} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(9.5), color: isLeftSidebar ? '#d1d5db' : '#9ca3af' }}>
          {data.languages.map((lang, i) => (
            <div key={i}>
              <strong>{lang.language}</strong> — {lang.level}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Sidebar education summary (if two-column) */}
    {data.education.length > 0 && (
      <div style={{ marginBottom: s(16) }}>
        <SectionHeader label="Education" scale={scale} />
        {data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: s(8), fontSize: s(9.5) }}>
            <strong style={{ color: isLeftSidebar ? '#ffffff' : '#ffffff' }}>{edu.degree}</strong>
            <div style={{ color: isLeftSidebar ? '#d1d5db' : '#9ca3af' }}>{edu.institution}</div>
            <div style={{ color: isLeftSidebar ? '#9ca3af' : '#94a3b8', fontSize: s(8.5) }}>{edu.startYear} - {edu.endYear}</div>
          </div>
        ))}
      </div>
    )}
  
          </div>

          {/* MAIN */}
          <div style={{ flex: 1 }}>
            
    {/* Summary */}
    {data.summary && (
      <section style={{ marginBottom: s(16) }}>
        <SectionHeader label="Professional Summary" scale={scale} />
        <p style={{ margin: 0, fontSize: s(10), color: '#374151', lineHeight: '1.6', textAlign: 'justify' }}>{data.summary}</p>
      </section>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <section style={{ marginBottom: s(16) }}>
        <SectionHeader label="Professional Experience" scale={scale} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: s(12) }}>
          {data.experience.map((job, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: s(11), color: '#ffffff' }}>{job.title}</strong>
                <span style={{ fontSize: s(9), color: '#9ca3af' }}>{job.startDate} – {job.endDate}</span>
              </div>
              <div style={{ fontSize: s(10), color: '#dc2626', fontWeight: 600, marginBottom: s(4) }}>{job.company}</div>
              <ul style={{ margin: 0, paddingLeft: s(14), fontSize: s(9.5), color: '#374151', listStyleType: 'disc' }}>
                {job.bullets.map((bullet, idx) => (
                  <li key={idx} style={{ marginBottom: s(2), lineHeight: '1.4' }}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Achievements */}
    {data.keyAchievements.length > 0 && (
      <section style={{ marginBottom: s(16) }}>
        <SectionHeader label="Key Achievements" scale={scale} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: s(6) }}>
          {data.keyAchievements.map((ach, i) => (
            <div key={i} style={{ display: 'flex', gap: s(8), fontSize: s(9.5), color: '#374151' }}>
              <span style={{ color: '#dc2626' }}>★</span>
              <span>{ach}</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Certifications (if single column or not listed in sidebar) */}
    {!isTwoColumn && data.certifications.length > 0 && (
      <section style={{ marginBottom: s(16) }}>
        <SectionHeader label="Certifications" scale={scale} />
        {data.certifications.map((cert, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: s(9.5), marginBottom: s(4), color: '#374151' }}>
            <span>✔ <strong>{cert.name}</strong> — {cert.issuer}</span>
            <span style={{ color: '#9ca3af', fontSize: s(8.5) }}>{cert.year}</span>
          </div>
        ))}
      </section>
    )}

    {/* Education (if single column) */}
    {!isTwoColumn && data.education.length > 0 && (
      <section style={{ marginBottom: s(16) }}>
        <SectionHeader label="Education" scale={scale} />
        {data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: s(8), fontSize: s(9.5) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: '#ffffff' }}>{edu.degree}</strong>
              <span style={{ color: '#9ca3af', fontSize: s(9) }}>{edu.startYear} - {edu.endYear}</span>
            </div>
            <div style={{ color: '#9ca3af' }}>{edu.institution}</div>
          </div>
        ))}
      </section>
    )}

    {/* Skills & Languages (if single column) */}
    {!isTwoColumn && (
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: s(16), marginBottom: s(16) }}>
        {Object.keys(data.technicalSkills).length > 0 && (
          <div>
            <SectionHeader label="Technical Skills" scale={scale} />
            
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(8) }}>
        {Object.entries(data.technicalSkills).map(([cat, skills], i) => (
          <div key={i} style={{ marginBottom: s(2) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: s(9.5), fontWeight: 600, color: isTwoColumn ? '#ffffff' : '#ffffff', marginBottom: s(2) }}>
              <span>{cat}</span>
            </div>
            <div style={{ height: s(5), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: s(2.5), overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: '#dc2626' }} />
            </div>
            <div style={{ fontSize: s(8.5), color: isTwoColumn ? '#d1d5db' : '#9ca3af', marginTop: s(2) }}>{skills.join(', ')}</div>
          </div>
        ))}
      </div>
    
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <SectionHeader label="Languages" scale={scale} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(8), fontSize: s(9.5), color: '#374151' }}>
              {data.languages.map((lang, i) => (
                <span key={i} style={{ padding: `${s(2)} ${s(6)}`, backgroundColor: '#f3f4f6', borderRadius: s(4) }}>
                  <strong>{lang.language}</strong> ({lang.level})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  
          </div>
        </div>
      

      {/* FOOTER */}
      <div style={{
        marginTop: s(20),
        paddingTop: s(8),
        borderTop: `${s(1)} solid #e2e8f0`,
        fontSize: s(8.5),
        color: '#94a3b8',
        textAlign: 'center'
      }}>
        References available upon request — Generated via ProCV
      </div>
    </div>
  )
}
