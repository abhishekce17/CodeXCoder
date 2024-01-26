"use client"
import React, {useEffect, useState} from 'react';
import styles from '@/Styles/HelpAndFAQ.module.css';
import {SlDrawer, SlQuestion} from "react-icons/sl"
import {TbEdit} from 'react-icons/tb';
import {MdDeleteOutline} from 'react-icons/md';
import {SiAnswer} from 'react-icons/si';
import Loading from '../../../loading';
import {notify} from '@/JS/notify';

const HelpAndFAQ = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editIndex, setEditIndex] = useState({index: -1, faqId: null});
  const [isLoading, setIsLoading] = useState(true)

  const handleAddQuestion = async () => {
    if (newQuestion.trim() === '' || newAnswer.trim() === '') {
      return; // Do not add if either question or answer is empty
    }

    const newFAQ = {question: newQuestion, answer: newAnswer};
    const addResponse = await fetch("/api/FAQ/AddFAQ", {
      method: "POST",
      body: JSON.stringify(newFAQ)
    })
    const result = await addResponse.json()
    if (result.status === 201) {
      setQuestions([...questions, {...newFAQ, faqId: result.faqId}]);
      setNewQuestion('');
      setNewAnswer('');
      notify("FAQ item added successfully", "success")
    }
    else if (result.status === 500) {
      notify(result.error, "error")
    }
  };

  const handleEditQuestion = (index, faqId) => {
    setEditIndex({index: index, faqId: faqId});
    setNewQuestion(questions[index].question);
    setNewAnswer(questions[index].answer);
  };

  const handleUpdateQuestion = async () => {
    if (newQuestion.trim() === '' || newAnswer.trim() === '') {
      return; // Do not update if either question or answer is empty
    }
    const updatedQuestions = [...questions];
    const updateResponse = await fetch("/api/FAQ/UpdateFAQ", {
      method: "POST",
      body: JSON.stringify({question: newQuestion, answer: newAnswer, faqId: editIndex.faqId})
    })
    const result = await updateResponse.json()
    if (result.status === 200) {
      updatedQuestions[editIndex.index] = {...updatedQuestions[editIndex.index], ...{question: newQuestion, answer: newAnswer}};
      setQuestions(updatedQuestions);
      setNewQuestion('');
      setNewAnswer('');
      setEditIndex({index: -1, faqId: null});
    }
  };

  const handleDeleteQuestion = async (index) => {
    const updatedQuestions = [...questions];
    const deleteResponse = await fetch(`/api/FAQ/RemoveFAQ/${updatedQuestions[index].faqId}`, {
      method: "DELETE"
    })
    const result = await deleteResponse.json()
    if (result.status === 200) {
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };



  useEffect(() => {
    const fetchFAQ = async () => {
      const fetchResponse = await fetch("/api/FAQ/FetchFAQ")
      const result = await fetchResponse.json()
      if (result.status === 200) {
        setQuestions(result.data)
        setIsLoading(false)
      }
    }
    fetchFAQ()
  }, [])

  return (
    <div className={styles.help_and_faq_page}>
      <h2>Help And FAQ</h2>
      <div className={styles.add_question_and_answers}>
        <p>Question</p>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter your question"
        />
        <p>Answer</p>
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Enter your answer"
        ></textarea>
        {editIndex.index === -1 ? (
          <button onClick={handleAddQuestion}>Add Question</button>
        ) : (
          <button onClick={handleUpdateQuestion}>Update Question</button>
        )}
      </div>{
        isLoading ? Loading() :
          <div className={styles.added_faq} >
            {questions.length === 0 ? (
              <div>
                <SlDrawer />
              </div>
            ) : (
              <ul>
                {questions.map((faq, index) => (
                  <li key={[faq.faqId, index]} style={{listStyle: "none", borderBottom: "1px solid var(--light-bg-color)", marginTop: "20px"}} >
                    <SlQuestion style={{color: "var(--light-bg-color)", marginRight: "7px", fontSize: "1rem"}} />
                    {faq.question}
                    <br />
                    <SiAnswer style={{color: "var(--light-bg-color)", marginRight: "7px", fontSize: "1rem"}} />
                    {faq.answer}
                    <br />
                    <button onClick={() => handleEditQuestion(index, faq.faqId)}><TbEdit /> </button>
                    <button onClick={() => handleDeleteQuestion(index, faq.faqId)}>
                      <MdDeleteOutline />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
      }
    </div>
  );
};

export default HelpAndFAQ;
