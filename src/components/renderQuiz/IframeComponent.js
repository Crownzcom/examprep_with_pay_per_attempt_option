// // IframeComponent.js
// import React, { useState, useEffect } from "react";
// import Iframe from "react-iframe";
// import { Container, Card } from "react-bootstrap";
// import "../IframeComponent.css";

// const IframeComponent = ({ url, booleanValue, sendData }) => {
//   const [getIframeData, setGetIframeData] = useState(false);

//   const urlWhitelist = [
//     window.location.origin,
//     "http://localhost:5173/",
//     "http://192.168.100.12:5173/",
//     "https://derrickml.com",
//     "http://127.0.0.1:5500/",
//     "http://127.0.0.1:5501/",
//     "http://127.0.0.1:5500/english_ple/",
//     "https://moodle.servers.crownzcom.tech/english_ple_section_B",
//     "https://exampreptutor.com/english_ple_section_B/",
//     "https://www.exampreptutor.com/english_ple_section_B",
//     // Add other URLs here
//   ];

//   const canDisplayUrl = urlWhitelist.includes(url);

//   // SendMessageToIframe to only send message after confirmation
//   const sendMessageToIframe = () => {
//     try {
//       const iframe = document.getElementById("myIframe");
//       if (iframe && iframe.contentWindow) {
//         setGetIframeData(true);
//         console.log("Sending message to iframe");
//         iframe.contentWindow.postMessage("callEvaluateAllAnswers", "*");
//       } else {
//         console.log("Iframe or its contentWindow is not accessible");
//       }
//     } catch (e) {
//       console.log("Error encountered while trying to send message to iframe", e);
//     }
//   };

//   useEffect(() => {
//     if (booleanValue) {
//       console.log("Boolean value changed to true, triggering iframe message");
//       sendMessageToIframe();
//     }
//   }, [booleanValue]);

//   useEffect(() => {
//     const receiveMessage = async (event) => {
//       try {
//         if (getIframeData && event.data && typeof event.data === "object") {
//           const { marksObtained, results } = event.data;

//           console.log("Received message. Marks obtained: ", marksObtained);
//           sendData(event.data);

//         } else {
//           console.log("No response from iframe or button not clicked");
//         }
//       } catch (e) {
//         console.log("Error encountered while communicating with iframe");
//         console.error("Error encountered while communicating with iframe\n", e);
//       }
//     };

//     window.addEventListener("message", receiveMessage);

//     return () => {
//       window.removeEventListener("message", receiveMessage);
//     };
//   }, [getIframeData, sendData]);

//   return (
//     <Container fluid="true" className="iframe-container">
//       {canDisplayUrl ? (
//         <>
//           <Card className="iframe-card">
//             <Iframe src={url ? url : "http://localhost:5173/"} id="myIframe" className="iframe-content" />
//           </Card>
//         </>
//       ) : (
//         <p>URL not allowed for embedding.</p>
//       )}
//     </Container>
//   );
// };

// export default IframeComponent;
