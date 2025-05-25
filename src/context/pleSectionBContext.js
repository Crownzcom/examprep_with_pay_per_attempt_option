import { createContext, useContext, useState } from "react";

const SectionBContext = createContext()

// create custom hook
export const useSectionB = () => {
    return useContext(SectionBContext)
}

export const SectionBProvider = ({ children }) => {
    const [sectionBAnswers, setSectionBAnswers] = useState([])    
    
    const updateSectionBAnswer = (category, story, mark) => {
      setSectionBAnswers(prev => {
        const updatedAnswers = prev.filter(ans => ans.category !== category);
        const newState = [...updatedAnswers, { category, story, mark }];
        return newState
      });
  };

  const clearSectionBAnswers = () => {
    setSectionBAnswers([])
  }
    
      return (
        <SectionBContext.Provider value={{ sectionBAnswers, updateSectionBAnswer, clearSectionBAnswers }}>
          {children}
        </SectionBContext.Provider>
      );

}