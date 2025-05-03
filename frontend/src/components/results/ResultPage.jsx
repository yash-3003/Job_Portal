import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { Radar, Bar } from 'react-chartjs-2';
import axios from 'axios';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // If results are passed through navigation state, use them
        if (location.state?.results) {
          setResults(location.state.results);
          setLoading(false);
          return;
        }
        
        // Otherwise, fetch from API
        const res = await axios.get('/api/recommendations/my-recommendation');
        setResults(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        // If no results found, redirect to assessment
        navigate('/assessment', { replace: true });
      }
    };
    
    fetchResults();
  }, [location.state, navigate]);
  
  // Prepare data for Radar chart
  const radarData = {
    labels: ['Software Development', 'Data Science', 'Cybersecurity'],
    datasets: [
      {
        label: 'Your Skills',
        data: results ? [
          results.scores.softwareDev.percentage,
          results.scores.dataScience.percentage,
          results.scores.cybersecurity.percentage
        ] : [0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      }
    ]
  };
  
  // Chart options
  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };
  
  // Bar chart data for score comparison
  const barData = {
    labels: ['Software Development', 'Data Science', 'Cybersecurity', 'Overall'],
    datasets: [
      {
        label: 'Skill Percentages',
        data: results ? [
          results.scores.softwareDev.percentage,
          results.scores.dataScience.percentage,
          results.scores.cybersecurity.percentage,
          results.scores.scorePercentage
        ] : [0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };
  
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your results...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="mt-5 mb-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Your Career Assessment Results</h1>
          <p className="text-center lead">
            Based on your responses, we've analyzed your skills and preferences.
          </p>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center py-5">
              <h2 className="mb-4">Recommended Career Path</h2>
              <div className="d-flex justify-content-center">
                <div className="display-2 fw-bold text-primary mb-4">
                  {results.jobRecommendation}
                </div>
              </div>
              <p className="lead mb-0">
                This recommendation is based on your unique skill profile and assessment results.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col lg={6} className="mb-4 mb-lg-0">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-light">
              <h3 className="mb-0">Your Skill Radar</h3>
            </Card.Header>
            <Card.Body>
              <Radar data={radarData} options={radarOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-light">
              <h3 className="mb-0">Skill Breakdown</h3>
            </Card.Header>
            <Card.Body>
              <Bar data={barData} options={barOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h3 className="mb-0">Detailed Scores</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-4">
                  <h4>Software Development</h4>
                  <ProgressBar 
                    now={results.scores.softwareDev.percentage} 
                    label={`${Math.round(results.scores.softwareDev.percentage)}%`}
                    variant="danger"
                    className="mb-2"
                  />
                  <p className="text-muted">
                    Score: {results.scores.softwareDev.score}/{questionData.softwareDev.length}
                  </p>
                </Col>
                <Col md={4} className="mb-4">
                  <h4>Data Science</h4>
                  <ProgressBar 
                    now={results.scores.dataScience.percentage} 
                    label={`${Math.round(results.scores.dataScience.percentage)}%`}
                    variant="info"
                    className="mb-2"
                  />
                  <p className="text-muted">
                    Score: {results.scores.dataScience.score}/{questionData.dataScience.length}
                  </p>
                </Col>
                <Col md={4} className="mb-4">
                  <h4>Cybersecurity</h4>
                  <ProgressBar 
                    now={results.scores.cybersecurity.percentage} 
                    label={`${Math.round(results.scores.cybersecurity.percentage)}%`}
                    variant="warning"
                    className="mb-2"
                  />
                  <p className="text-muted">
                    Score: {results.scores.cybersecurity.score}/{questionData.cybersecurity.length}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className="mt-3">Overall Performance</h4>
                  <ProgressBar 
                    now={results.scores.scorePercentage} 
                    label={`${Math.round(results.scores.scorePercentage)}%`}
                    variant="success"
                    className="mb-2"
                  />
                  <p className="text-muted">
                    Total Score: {results.scores.totalScore}/{Object.keys(questionData).reduce((sum, key) => sum + questionData[key].length, 0)}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h3 className="mb-0">Career Path Information</h3>
            </Card.Header>
            <Card.Body>
              <h4 className="mb-3">{results.jobRecommendation}</h4>
              <CareerDescription jobTitle={results.jobRecommendation} />
              
              <h5 className="mt-4">Next Steps</h5>
              <ul className="mt-3">
                <li>Review the resources and learning paths related to your recommended career</li>
                <li>Consider skill-building opportunities in areas where your scores are lower</li>
                <li>Explore job listings for this role to understand market requirements</li>
                <li>Connect with professionals in this field through networking platforms</li>
              </ul>
              
              <div className="text-center mt-4">
                <Button variant="primary" onClick={() => navigate('/learning-paths')}>
                  Explore Learning Paths
                </Button>
                <Button variant="outline-secondary" className="ms-3" onClick={() => navigate('/assessment')}>
                  Retake Assessment
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Component to display career description based on job title
const CareerDescription = ({ jobTitle }) => {
  // Career descriptions lookup
  const careerDescriptions = {
    "Senior Software Engineer": 
      "Senior Software Engineers lead development teams, architect software solutions, and mentor junior developers. They have deep technical expertise in software design principles, multiple programming languages, and complex system integration.",
    
    "Software Developer": 
      "Software Developers create, test, and maintain applications across various platforms. This role requires strong programming skills, problem-solving abilities, and knowledge of software development methodologies.",
    
    "Junior Software Developer": 
      "Junior Software Developers work under the guidance of more experienced team members to build and test software components. This entry-level position focuses on coding, debugging, and learning software development practices.",
    
    "Data Scientist": 
      "Data Scientists use advanced statistical methods, machine learning, and programming to extract insights from data. They build predictive models and create data-driven solutions to complex business problems.",
    
    "Data Analyst": 
      "Data Analysts collect, process, and perform statistical analyses on datasets. They create visualizations, identify patterns, and translate data into valuable business insights to guide strategic decisions.",
    
    "Junior Data Analyst": 
      "Junior Data Analysts assist in collecting and analyzing data under supervision. They help prepare reports, create basic visualizations, and learn data analysis methodologies while developing their technical skills.",
    
    "Cybersecurity Engineer": 
      "Cybersecurity Engineers design and implement security systems to protect network infrastructure and digital assets. They conduct security assessments, respond to incidents, and develop security protocols and best practices.",
    
    "Information Security Analyst": 
      "Information Security Analysts monitor networks for security breaches, implement security measures, and develop security standards. They analyze security systems and recommend enhancements to protect digital information.",
    
    "Junior Security Analyst": 
      "Junior Security Analysts assist in monitoring security systems, documenting security processes, and responding to basic security alerts. They learn to identify vulnerabilities and implement security measures under guidance.",
    
    "Machine Learning Engineer": 
      "Machine Learning Engineers develop and deploy machine learning models into production environments. They combine software engineering skills with data science expertise to create scalable AI solutions.",
    
    "Security Developer": 
      "Security Developers focus on building secure software systems by implementing security principles throughout the development lifecycle. They conduct security code reviews and create security-focused solutions.",
    
    "Security Data Analyst": 
      "Security Data Analysts use data analysis techniques to identify security threats and vulnerabilities. They analyze security logs, detect anomalies, and provide insights to improve security posture.",
    
    "Full Stack Developer with Security Focus": 
      "Full Stack Developers with Security Focus have comprehensive skills across front-end, back-end, and security domains. They build complete applications with security considerations integrated at every layer.",
    
    "IT Support Specialist": 
      "IT Support Specialists provide technical assistance to users, troubleshoot hardware and software issues, and help maintain computer systems. This role requires good problem-solving skills and customer service abilities.",
    
    "Consider additional training": 
      "Based on your assessment results, we recommend additional training to strengthen your technical foundation. Consider exploring introductory courses in programming, data analysis, or cybersecurity to discover which path aligns best with your interests."
  };
  
  return (
    <div>
      <p>{careerDescriptions[jobTitle] || 
        "This career path combines technical expertise with specialized knowledge in your strongest skill areas. Focus on developing both breadth and depth of skills to excel in this role."}</p>
    </div>
  );
};

export default ResultsPage;