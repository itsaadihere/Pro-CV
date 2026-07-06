// Auto-generated Pro-CV Template Component
import { CVTemplateProps } from '@/types/cv'


    const SectionHeader = ({ label, scale }: { label: string; scale: number }) => {
      const s = (n: number) => `${n * scale}px`;
  
      const isSidebar = ['SKILLS', 'LANGUAGES', 'INTERESTS', 'CONTACT', 'CERTIFICATIONS'].some(kw => label.toUpperCase().includes(kw));
      if (isSidebar) {
        return (
          <div style={{ marginBottom: s(12), marginTop: s(12) }}>
            <h2 style={{ fontSize: s(11), fontWeight: 700, color: '#ffffff', letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>{label}</h2>
          </div>
        );
      }
      return (
        <div style={{ marginBottom: s(12), marginTop: s(16) }}>
          <h2 style={{ fontSize: s(12), fontWeight: 800, color: '#000000', margin: 0, textTransform: 'uppercase', borderBottom: `${s(1.5)} solid #000000`, paddingBottom: s(3) }}>{label}</h2>
        </div>
      );
    };
    

export default function M01BlackModernProfessional({ data, scale = 1 }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`
  const isTwoColumn = true;
  const isLeftSidebar = true;

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      padding: `${s(48)} ${s(56)}`,
      boxSizing: 'border-box',
      fontSize: s(10.5),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      

      {/* HEADER */}
      
      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        padding: `${s(24)} ${s(32)}`,
        marginBottom: s(20),
        borderRadius: s(4)
      }}>
        <h1 style={{ fontSize: s(26), fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{data.fullName}</h1>
        <div style={{ fontSize: s(13), opacity: 0.9, marginTop: s(4), fontWeight: 500 }}>{data.jobTitle}</div>
      </div>
    

      {/* BODY */}
      
        <div style={{ display: 'flex', minHeight: s(1027), gap: s(24) }}>
          {/* LEFT SIDEBAR */}
          <div style={{
            width: s(220),
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            padding: `${s(24)} ${s(16)}`,
            borderRadius: s(4)
          }}>
            
    {/* Sidebar contact info */}
    <div style={{ marginBottom: s(16) }}>
      <h3 style={{ fontSize: s(10), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: isLeftSidebar ? '#ffffff' : '#1a1a1a', marginBottom: s(6) }}>Contact</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(9.5), color: isLeftSidebar ? '#d1d5db' : '#4b5563' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: s(9.5), fontWeight: 600, color: isTwoColumn ? '#ffffff' : '#1a1a1a', marginBottom: s(2) }}>
              <span>{cat}</span>
            </div>
            <div style={{ height: s(5), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: s(2.5), overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: '#000000' }} />
            </div>
            <div style={{ fontSize: s(8.5), color: isTwoColumn ? '#d1d5db' : '#4b5563', marginTop: s(2) }}>{skills.join(', ')}</div>
          </div>
        ))}
      </div>
    
      </div>
    )}

    {/* Sidebar languages */}
    {data.languages.length > 0 && (
      <div style={{ marginBottom: s(16) }}>
        <SectionHeader label="Languages" scale={scale} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: s(4), fontSize: s(9.5), color: isLeftSidebar ? '#d1d5db' : '#4b5563' }}>
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
            <strong style={{ color: isLeftSidebar ? '#ffffff' : '#1a1a1a' }}>{edu.degree}</strong>
            <div style={{ color: isLeftSidebar ? '#d1d5db' : '#4b5563' }}>{edu.institution}</div>
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
                <strong style={{ fontSize: s(11), color: '#1a1a1a' }}>{job.title}</strong>
                <span style={{ fontSize: s(9), color: '#4b5563' }}>{job.startDate} – {job.endDate}</span>
              </div>
              <div style={{ fontSize: s(10), color: '#000000', fontWeight: 600, marginBottom: s(4) }}>{job.company}</div>
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
              <span style={{ color: '#000000' }}>★</span>
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
            <span style={{ color: '#4b5563', fontSize: s(8.5) }}>{cert.year}</span>
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
              <strong style={{ color: '#1a1a1a' }}>{edu.degree}</strong>
              <span style={{ color: '#4b5563', fontSize: s(9) }}>{edu.startYear} - {edu.endYear}</span>
            </div>
            <div style={{ color: '#4b5563' }}>{edu.institution}</div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: s(9.5), fontWeight: 600, color: isTwoColumn ? '#ffffff' : '#1a1a1a', marginBottom: s(2) }}>
              <span>{cat}</span>
            </div>
            <div style={{ height: s(5), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: s(2.5), overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: '#000000' }} />
            </div>
            <div style={{ fontSize: s(8.5), color: isTwoColumn ? '#d1d5db' : '#4b5563', marginTop: s(2) }}>{skills.join(', ')}</div>
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
