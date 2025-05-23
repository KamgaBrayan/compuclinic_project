import React, { useState } from 'react';
import axios from 'axios';

export const TableIa = () => {
  // État pour stocker les messages précédents
  const [messages, setMessages] = useState([
    { sender: "ia", text: 'Bonjour, je suis votre assistant à la decision médicale: entrez les symptomes du patient ...' }
  ]);
  const [numeroMessage, setNumeroMessage] = useState(1)
  const modNumeroMessage = () =>{
    let newNumero = numeroMessage + 1
    setNumeroMessage(newNumero)
    return newNumero
  }
    // État pour stocker le nouveau message en cours de saisie
    const [newMessage, setNewMessage] = useState('');

  const generateAnswer = async () => {
    if (newMessage.trim() !== '') {
        let newMessageAEnvoyer = newMessage + " sachant que ce qui précède sont des symptomes relevés, sur un patient propose un diagnostique sous forme de liste de diagnostiques possibles ne me pas d'astérisques * dans tes reponses NB à la fin de ton message propose que faire pour eviter ces maladies en une seule phrase"
        try {
            const apiKey = "AIzaSyBmvr56b2-sfsHHVS0yK68PhgyzF5lUtbQ";
            const response = await axios({
              url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
              method: "post",
              data: {
                contents: [{ parts: [{ text: newMessageAEnvoyer }] }],
              },
            });
            const answer = response.data.candidates[0].content.parts[0].text;

            const messageMedecin = {
                sender: "medecin",
                text: newMessage        
              };
            const messageDeIa = {
              sender: "ia",
              text: answer        
            };
            console.log(messageMedecin.text, messageDeIa.text)
            setMessages([...messages, messageMedecin, messageDeIa]);
            setNewMessage('');
          } catch (error) {
            console.log(error);
            // Handle error
          }
      }
  };



  // Fonction pour ajouter un nouveau message
 /*  const handleAddMessage = () => {
    if (newMessage.trim() !== '') {
      const newMessageObj = {
        id: messages.length + 1,
        text: newMessage,
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage('');
    }
  }; */

  return (
    <div>
      {/* Affichage de la liste des messages précédents */}
      <div>
      <div> {messages.map((message) => ( <div key={()=>modNumeroMessage()} className={message.sender === 'ia' ? 'ia00' : 'medecin00'} > <p className='paragraphUseName'>{message.sender === 'ia' ? 'Assistant' : 'Moi'}</p>  {message.text.split('*').map((block) => ( <ul> {block.trim().split('-').map((subBlock) => ( <li>{subBlock.trim()}</li> ))} </ul> ))}  </div> ))} </div>
      {/* <div> {messages.map((message) => ( 
            <div 
                key={()=>modNumeroMessage()}
                className={message.sender === 'ia' ? 'ia00' : 'medecin00'} 
            > 
                <p className='paragraphUseName'>{message.sender === 'ia' ? 'Assistant' : 'Moi'}</p> 
                <ul> 
                    {message.text.split('**').map((block) => ( <li>{block.trim()}</li> ))} 
                </ul> 
            </div> ))} 
        </div> */}
        {/* <div>
            {messages.map((message) => (
            <div
                key={()=>modNumeroMessage()}
                className={message.sender === 'ia' ? 'ia00' : 'medecin00'}
            >
                <p className='paragraphUseName'>{message.sender === 'ia' ? 'Assistant' : 'Moi'}</p>
                {message.text}
            </div>
            ))}
        </div> */}
      </div>

      {/* Champ de saisie et bouton pour envoyer un nouveau message */}
      <div className="input-container">
        <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  generateAnswer();
                }
              }}
            placeholder="Entrez l'ensemble des symptomes"
        />
        <button onClick={generateAnswer}>Envoyer</button>
        </div>
      {/* <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Entrez l'ensemble des symptomes"
        />
        <button onClick={generateAnswer}>Envoyer</button>
      </div> */}
    </div>
  );
};