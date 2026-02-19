import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleSkillsSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    'Business Analyst',
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
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              style={{
                ...styles.input,
                ...styles.select,
              }}
              required
            >
              <option value="">Choose a role...</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
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
                Skip for Now
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
    padding: '40px 20px',
    background: '#f5f5f5',
    overflow: 'auto',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '800px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
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
    color: '#666',
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
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  },
  select: {
    cursor: 'pointer',
    background: 'white',
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
    color: '#238845',
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
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    background: 'white',
    color: '#333',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  skillButtonActive: {
    background: '#238845',
    color: 'white',
    border: '2px solid #238845',
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
    padding: '14px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    marginTop: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  skipButton: {
    flex: 1,
    padding: '14px',
    background: '#f0f0f0',
    color: '#333',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};

export default RoleSkillsSelectionPage;
