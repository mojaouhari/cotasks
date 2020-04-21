import React, { useState, useEffect, Fragment } from "react";

const Autocomplete = ({ suggestions = [], relevantAttributes = [], value, className, placeholder, onChange, onSelect }) => {
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
    // TODO uses relevantattributes here
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.firstname.toLowerCase().indexOf(userInput.toLowerCase()) > -1 ||
        suggestion.lastname.toLowerCase().indexOf(userInput.toLowerCase()) > -1 ||
        suggestion.email.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  const onClick = (e, suggestion) => {
    if (suggestion) onSelect({ target: { value: suggestion } });
    setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.getAttribute("value"),
    });
  };

  const onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      e.preventDefault();

      if (filteredSuggestions[activeSuggestion]) onSelect({ target: { value: filteredSuggestions[activeSuggestion] } });

      const userInput = filteredSuggestions[activeSuggestion] ? filteredSuggestions[activeSuggestion]._id : "";
      setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: userInput,
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion === filteredSuggestions.length - 1) {
        return;
      }

      setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  useEffect(() => {
    onChange({ target: { value: state.userInput } });
  }, [state.userInput]);

  return (
    <Fragment>
      <input
        type="text"
        className={className}
        style={{ position: "relative" }}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={state.userInput}
        placeholder={placeholder}
      />
      {state.showSuggestions && state.userInput && (
        <SuggestionsList onClick={onClick} filteredSuggestions={state.filteredSuggestions} activeSuggestion={state.activeSuggestion} />
      )}
    </Fragment>
  );
};

const SuggestionsList = ({ filteredSuggestions, activeSuggestion, onClick }) => {
  return filteredSuggestions.length ? (
    <ul className="suggestions">
      {filteredSuggestions.map((suggestion, index) => (
        <li className={`p-2 ${index === activeSuggestion ? "bg-primary text-white" : ""}`} key={index} onClick={(e) => onClick(e, suggestion)}>
          {suggestion.firstname} {suggestion.lastname}
          <div className="font-italic">{suggestion.email}</div>
        </li>
      ))}
    </ul>
  ) : (
    <ul className="suggestions rounded-bottom shadow">
      <div className="py-2 px-3 text-muted font-italic">No results found</div>
    </ul>
  );
};

export default Autocomplete;
