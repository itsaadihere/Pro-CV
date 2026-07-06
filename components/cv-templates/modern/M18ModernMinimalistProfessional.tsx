// Auto-generated Pro-CV Template Component
import { CVTemplateProps } from '@/types/cv'


    const SectionHeader = ({ label, scale }: { label: string; scale: number }) => {
      const s = (n: number) => `${n * scale}px`;
  
      const isSidebar = ['SKILLS', 'LANGUAGES', 'INTERESTS', 'CONTACT', 'CERTIFICATIONS'].some(kw => label.toUpperCase().includes(kw));
      return (
        <div style={{ marginBottom: s(10), marginTop: s(14) }}>
          <h2 style={{ fontSize: s(11.5), fontWeight: 700, color: isSidebar ? '#1e3a5f' : '#1e3a5f', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>{label}</h2>
          <div style={{ height: s(1), backgroundColor: '#e5e7eb', marginTop: s(3) }} />
        </div>
      );
    };
    

export default function M18ModernMinimalistProfessional({ data, scale = 1 }: CVTemplateProps) {
  const s = (n: number) => `${n * scale}px`
  const isTwoColumn = true;
  const isLeftSidebar = false;

  return (
    <div style={{
      width: s(794),
      minHeight: s(1123),
      fontFamily: "'Inter', 'Arial', sans-serif",
      backgroundColor: '#ffffff',
      color: '#1e3a5f',
      padding: `${s(48)} ${s(56)}`,
      boxSizing: 'border-box',
      fontSize: s(10.5),
      lineHeight: '1.5',
      position: 'relative'
    }}>
      

      {/* HEADER */}
      
      <div style={{ backgroundColor: '#1e3a5f', color: '#ffffff', padding: `${s(20)} ${s(28)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: s(20), borderRadius: s(4) }}>
        <div>
          <h1 style={{ fontSize: s(22), fontWeight: 800, margin: 0 }}>{data.fullName}</h1>
          <div style={{ fontSize: s(11), opacity: 0.9, marginTop: s(2) }}>{data.jobTitle}</div>
        </div>
        <div style={{ fontSize: s(10), textAlign: 'right', opacity: 0.9, display: 'flex', flexDirection: 'column', gap: s(2) }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>
    

      {/* BODY */}
      
        <div style={{ display: 'flex', minHeight: s(1027), gap: s(24) }}>
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
                <strong style={{ fontSize: s(11), color: '#1e3a5f' }}>{job.title}</strong>
                <span style={{ fontSize: s(9), color: '#4b5563' }}>{job.startDate} – {job.endDate}</span>
              </div>
              <div style={{ fontSize: s(10), color: '#1e3a5f', fontWeight: 600, marginBottom: s(4) }}>{job.company}</div>
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
              <span style={{ color: '#1e3a5f' }}>★</span>
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
              <strong style={{ color: '#1e3a5f' }}>{edu.degree}</strong>
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
            
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(6) }}>
        {Object.values(data.technicalSkills).flat().slice(0, 15).map((skill, i) => (
          <span key={i} style={{ padding: `${s(3)} ${s(8)}`, backgroundColor: '#1e3a5f15', borderRadius: s(4), color: '#1e3a5f', fontSize: s(9.5), fontWeight: 500, borderLeft: `${s(2)} solid #1e3a5f` }}>
            {skill}
          </span>
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

          {/* RIGHT SIDEBAR */}
          <div style={{
            width: s(240),
            backgroundColor: '#f3f4f6',
            color: '#1f2937',
            padding: `${s(24)} ${s(16)}`,
            borderRadius: s(4)
          }}>
            
    {/* Sidebar contact info */}
    <div style={{ marginBottom: s(16) }}>
      <h3 style={{ fontSize: s(10), fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: isLeftSidebar ? '#ffffff' : '#1e3a5f', marginBottom: s(6) }}>Contact</h3>
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
        
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: s(6) }}>
        {Object.values(data.technicalSkills).flat().slice(0, 15).map((skill, i) => (
          <span key={i} style={{ padding: `${s(3)} ${s(8)}`, backgroundColor: '#1e3a5f15', borderRadius: s(4), color: '#1e3a5f', fontSize: s(9.5), fontWeight: 500, borderLeft: `${s(2)} solid #1e3a5f` }}>
            {skill}
          </span>
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
            <strong style={{ color: isLeftSidebar ? '#ffffff' : '#1e3a5f' }}>{edu.degree}</strong>
            <div style={{ color: isLeftSidebar ? '#d1d5db' : '#4b5563' }}>{edu.institution}</div>
            <div style={{ color: isLeftSidebar ? '#9ca3af' : '#94a3b8', fontSize: s(8.5) }}>{edu.startYear} - {edu.endYear}</div>
          </div>
        ))}
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
