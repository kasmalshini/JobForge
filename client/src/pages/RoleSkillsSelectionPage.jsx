import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleSkillsSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [hoveredRole, setHoveredRole] = useState(null);
  const roleDropdownRef = useRef(null);
  const { updateRoleAndSkills, user } = useAuth();
  const navigate = useNavigate();

  // Predefined roles and skills structure
  const roles = [
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'QA Engineer',
    'Project Manager',
  ];

  const skillsByCategory = {
    'Languages': ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Ruby', 'PHP', 'TypeScript', 'Swift'],
    'Frontend': ['React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Next.js', 'Svelte', 'WebGL'],
    'Backend': ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'FastAPI', 'ASP.NET', 'Ruby on Rails', 'NestJS', 'Fastify'],
    'Databases': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'DynamoDB', 'Elasticsearch', 'Oracle', 'SQL Server', 'Cassandra'],
    'DevOps': ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Terraform', 'Ansible', 'CloudFormation', 'Helm'],
    'Cloud': ['AWS', 'Azure', 'Google Cloud', 'Heroku', 'DigitalOcean', 'Vercel', 'Netlify', 'AWS Lambda', 'Google App Engine', 'Azure Functions'],
    'Tools': ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Slack', 'Linux', 'Windows Server', 'macOS', 'Vim'],
    'Machine Learning': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Pandas', 'NumPy', 'Matplotlib', 'OpenAI', 'Hugging Face', 'XGBoost'],
    'Methodologies': ['Agile', 'Scrum', 'Kanban', 'Waterfall', 'DevOps', 'Microservices', 'REST API', 'GraphQL', 'TDD', 'DDD'],
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setError('');
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    if (selectedSkills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setLoading(true);
    const result = await updateRoleAndSkills(selectedRole, selectedSkills);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Failed to update role and skills');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={styles.headerBackButton}
        >
          ← Back to Dashboard
        </button>
      </div>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {user?.role ? 'Update Your Role & Skills' : 'Set Up Your Profile'}
        </h1>
        <p style={styles.subtitle}>
          {user?.role
            ? 'Change your role and skills anytime to get personalized interview questions'
            : 'Select your role and relevant skills to get started'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Role Selection */}
          <div style={styles.section}>
            <label style={styles.label}>Select Your Role</label>
            <div style={styles.dropdownContainer} ref={roleDropdownRef}>
              <button
                type="button"
                style={styles.dropdownTrigger}
                onClick={() => setIsRoleOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isRoleOpen}
              >
                <span>{selectedRole || 'Choose a role...'}</span>
                <span style={styles.dropdownArrow}>{isRoleOpen ? '▲' : '▼'}</span>
              </button>
              {isRoleOpen && (
                <div className="role-dropdown-menu" style={styles.dropdownMenu} role="listbox">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role;
                    const isHovered = hoveredRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setHoveredRole(role)}
                        onMouseLeave={() => setHoveredRole(null)}
                        onClick={() => {
                          setSelectedRole(role);
                          setIsRoleOpen(false);
                          setHoveredRole(null);
                          setError('');
                        }}
                        style={{
                          ...styles.dropdownItem,
                          ...(isHovered ? styles.dropdownItemHover : {}),
                          ...(isSelected ? styles.dropdownItemSelected : {}),
                        }}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Skills Selection */}
          <div style={styles.section}>
            <label style={styles.label}>Select Your Skills</label>
            <p style={styles.skillsHint}>Choose at least one skill (you can update this later)</p>

            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} style={styles.categoryGroup}>
                <h3 style={styles.categoryTitle}>{category}</h3>
                <div style={styles.skillsGrid}>
                  {skills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      style={{
                        ...styles.skillButton,
                        ...(selectedSkills.includes(skill) ? styles.skillButtonActive : {}),
                      }}
                    >
                      {skill}
                      {selectedSkills.includes(skill) && (
                        <span style={styles.checkmark}> ✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.buttonGroup}>
            {!user?.role && (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={styles.skipButton}
              >
                ← Skip for Now
              </button>
            )}
            {user?.role && (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : user?.role ? 'Update Profile' : 'Continue to Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    padding: '24px 20px 40px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    overflow: 'auto',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: '12px',
    left: '20px',
    right: '20px',
    display: 'flex',
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  headerBackButton: {
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  card: {
    background: 'rgba(255,255,255,0.96)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '800px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
    marginTop: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: '30px',
    fontSize: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1f2937',
  },
  input: {
    padding: '12px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  },
  select: {
    cursor: 'pointer',
    background: 'white',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownTrigger: {
    width: '100%',
    padding: '12px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    background: 'white',
    color: '#1f2937',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    textAlign: 'left',
  },
  dropdownArrow: {
    fontSize: '12px',
    color: '#4b5563',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    background: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
    maxHeight: '260px',
    overflowY: 'auto',
    zIndex: 20,
    scrollbarWidth: 'thin',
    scrollbarColor: '#238845 #e5e7eb',
  },
  dropdownItem: {
    width: '100%',
    textAlign: 'left',
    border: 'none',
    background: 'white',
    color: '#1f2937',
    padding: '10px 12px',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background 0.15s ease, color 0.15s ease',
  },
  dropdownItemHover: {
    background: '#f3f4f6',
    color: '#111827',
  },
  dropdownItemSelected: {
    background: '#ecfdf3',
    color: '#166534',
    fontWeight: 'bold',
  },
  skillsHint: {
    fontSize: '14px',
    color: '#999',
    marginBottom: '15px',
    marginTop: '-8px',
  },
  categoryGroup: {
    marginBottom: '20px',
  },
  categoryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#166534',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px',
  },
  skillButton: {
    padding: '10px 12px',
    border: '2px solid #d1d5db',
    borderRadius: '6px',
    background: '#f9fafb',
    color: '#1f2937',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  skillButtonActive: {
    background: 'linear-gradient(135deg, #238845 0%, #14532d 100%)',
    color: 'white',
    border: '2px solid #166534',
    boxShadow: '0 2px 8px rgba(35, 136, 69, 0.3)',
  },
  checkmark: {
    marginLeft: '4px',
    fontWeight: 'bold',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    padding: '12px',
    background: '#fee',
    borderRadius: '6px',
    border: '1px solid #fcc',
    textAlign: 'center',
  },
  submitButton: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  skipButton: {
    flex: 1,
    padding: '14px',
    background: '#f3f4f6',
    color: '#1f2937',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    background: '#f3f4f6',
    color: '#1f2937',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

const roleDropdownScrollStyle = document.createElement('style');
roleDropdownScrollStyle.textContent = `
  .role-dropdown-menu::-webkit-scrollbar {
    width: 10px;
  }
  .role-dropdown-menu::-webkit-scrollbar-track {
    background: #e5e7eb;
    border-radius: 10px;
  }
  .role-dropdown-menu::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #34d399 0%, #238845 100%);
    border-radius: 10px;
    border: 2px solid #e5e7eb;
  }
  .role-dropdown-menu::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #238845 0%, #166534 100%);
  }
`;
if (!document.head.querySelector('style[data-role-dropdown-scroll]')) {
  roleDropdownScrollStyle.setAttribute('data-role-dropdown-scroll', 'true');
  document.head.appendChild(roleDropdownScrollStyle);
}

export default RoleSkillsSelectionPage;
