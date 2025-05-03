import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, ProgressBar, Alert } from 'react-bootstrap';

// Import question data
import { questionData } from './questionData';

const Assessment = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  
  const sections = [
    { title: 'Software Development', questions: questionData.softwareDev },
    { title: 'Data Science', questions: questionData.dataScience },
    { title: 'Cybersecurity', questions: questionData.cybersecurity }
  ];
  
  // Calculate total questions for progress bar
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  
  useEffect(() => {
    // Update progress whenever answers change
    setProgress((answeredQuestions / totalQuestions) * 100);
  }, [answers, totalQuestions, answeredQuestions]);
  
  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value === 'true' ? 1 : 0 });
  };
  
  const handleNextSection = () => {
    // Validate that all questions in current section are answered
    const currentQuestions = sections[currentSection].questions;
    const unansweredQuestions = currentQuestions.filter(q => 
      answers[q.id] === undefined
    );
    
    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before proceeding.');
      return;
    }
    
    setError('');
    
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Convert answers to array format for backend
      const answersArray = [];
      for (let i = 0; i < totalQuestions; i++) {
        answersArray[i] = answers[`q${i+1}`] || 0;
      }
      
      const res = await axios.post('/api/recommendations/submit-assessment', {
        answers: answersArray
      });
      
      // Navigate to results page
      navigate('/results', { state: { results: res.data } });
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError(err.response?.data?.msg || 'Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const currentSectionData = sections[currentSection];
  
  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h2>Career Assessment</h2>
          <ProgressBar 
            now={progress} 
            label={`${Math.round(progress)}%`} 
            variant="success" 
            className="mt-2"
          />
        </Card.Header>
        <Card.Body>
          <h3 className="mb-4">{currentSectionData.title}</h3>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form>
            {currentSectionData.questions.map((question, index) => (
              <Form.Group key={question.id} className="mb-4">
                <Form.Label><strong>Question {index + 1}:</strong> {question.text}</Form.Label>
                <div className="d-flex flex-column flex-md-row">
                  <Form.Check
                    type="radio"
                    name={`question_${question.id}`}
                    id={`yes_${question.id}`}
                    label="Yes"
                    value="true"
                    checked={answers[question.id] === 1}
                    onChange={() => handleAnswerChange(question.id, 'true')}
                    className="me-3 mb-2"
                  />
                  <Form.Check
                    type="radio"
                    name={`question_${question.id}`}
                    id={`no_${question.id}`}
                    label="No"
                    value="false"
                    checked={answers[question.id] === 0}
                    onChange={() => handleAnswerChange(question.id, 'false')}
                    className="me-3"
                  />
                </div>
              </Form.Group>
            ))}
            
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={handlePrevSection}
                disabled={currentSection === 0 || loading}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                onClick={handleNextSection}
                disabled={loading}
              >
                {currentSection < sections.length - 1 ? 'Next' : 'Submit'}
                {loading && <span className="spinner-border spinner-border-sm ms-2" />}
              </Button>
            </div>
          </Form>
        </Card.Body>
        <Card.Footer className="text-muted">
          Section {currentSection + 1} of {sections.length}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Assessment;