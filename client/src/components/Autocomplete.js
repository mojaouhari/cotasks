import React, { useState, useEffect, Fragment } from "react";

const Autocomplete = ({
  suggestions = [],
  relevantAttributeNames,
  valueAttributeName,
  SuggestionsList,
  value,
  name,
  className,
  placeholder,
  onChange,
  onSelect,
}) => {
  const [state, setState] = useState({
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
    // What the user has entered
    userInput: value || "",
  });

  const onInputChange = (e) => {
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter((suggestion) => {
      let predicate = false;
      relevantAttributeNames.map((attributeName) => {
        predicate = predicate || suggestion[attributeName].toLowerCase().indexOf(userInput.toLowerCase()) > -1;
      });
      return predicate;
    });

    setState({
      ...state,
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  const onClick = (e, suggestion) => {
    if (suggestion) onSelect({ target: { name: name, value: suggestion } });
    setState({
      ...state,
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: suggestion[valueAttributeName] || "",
    });
  };

  const onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = state;
    
    // User pressed the enter key
    if (e.keyCode === 13) {
      e.preventDefault();
      if (filteredSuggestions[activeSuggestion]) onSelect({ target: { name: name, value: filteredSuggestions[activeSuggestion] } });
      setState({
        ...state,
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion][valueAttributeName] || "",
      });
    }

    // User pressed the escape key
    if (e.keyCode === 27) {
      setState({
        ...state,
        showSuggestions: false,
      });
    }

    // User pressed the up arrow
    else if (e.keyCode === 38) {
      e.preventDefault();
      if (activeSuggestion === 0) return;
      setState({ ...state, activeSuggestion: activeSuggestion - 1 });
    }

    // User pressed the down arrow
    else if (e.keyCode === 40) {
      e.preventDefault();
      if (filteredSuggestions && activeSuggestion === filteredSuggestions.length - 1) return;
      setState({ ...state, activeSuggestion: activeSuggestion + 1 });
    }
  };

  useEffect(() => {
    onChange({ target: { value: state.userInput } });
  }, [state.userInput]);

  return (
    <div className="position-relative">
      <input
        type="text"
        className={className}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={state.userInput}
        placeholder={placeholder}
      />
      {state.showSuggestions &&
        state.userInput &&
        (SuggestionsList ? (
          <SuggestionsList onClick={onClick} filteredSuggestions={state.filteredSuggestions} activeSuggestion={state.activeSuggestion} />
        ) : (
          <DefaultSuggestionsList onClick={onClick} filteredSuggestions={state.filteredSuggestions} activeSuggestion={state.activeSuggestion} />
        ))}
    </div>
  );
};

const DefaultSuggestionsList = ({ filteredSuggestions, activeSuggestion, onClick }) =>
  filteredSuggestions.length ? (
    <ul className="suggestions">
      {filteredSuggestions.map((suggestion, index) => (
        <li className={`p-2 ${index === activeSuggestion ? "bg-primary text-white" : ""}`} key={index} onClick={(e) => onClick(e, suggestion)}>
          {suggestion.firstname} {suggestion.lastname}
          <div className="font-italic">{suggestion.email}</div>
        </li>
      ))}
    </ul>
  ) : (
    <ul className="suggestions">
      <div className="py-2 px-3 text-muted font-italic">No results found</div>
    </ul>
  );
export default Autocomplete;
