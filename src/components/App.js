import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { v4 as uuid } from "uuid";
import api from "../api/contact";
import "./App.css";
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import ContactDetail from "./ContactDetail";
import EditContact from "./EditContact";

function App() {
  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  //Retrieve contacts from server and store in state
  const retrieveContacts = async () => {
    const response = await api.get("/contacts");
    setContacts(response.data);
    return response.data;
  };
  const addContactHandler = async (contact) => {
    console.log(contact);
    const request = {
      id: uuid(),
      ...contact,
    };
    const response = await api.post("/contacts", request);
    setContacts([...contacts, response.data]);
  };
  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    const updatedContacts = contacts.map((c) =>
      c.id === contact.id ? response.data : c
    );
    setContacts(updatedContacts);
  };
  const deleteContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`);
    const newContacts = contacts.filter((contact) => {
      return contact.id !== id;
    });
    setContacts(newContacts);
  };

  const searchHandler = (search) => {
    setSearchTerm(search);
    if (searchTerm !== "") {
      const result = contacts.filter((contact) => {
        return Object.values(contact)
          .join("")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResult(result);
    } else {
      setSearchResult([contacts]);
    }
  };

  useEffect(() => {
    // const contactsLS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    // if (contactsLS) setContacts(contactsLS);
    const getAllContacts = async () => {
      const allContacts = await retrieveContacts();
      if (allContacts) setContacts(allContacts);
    };
    getAllContacts();
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  return (
    <div>
      <Router>
        <Header />
        <Switch>
          <div className="ui container">
            <Route
              path="/"
              exact
              render={(props) => (
                <ContactList
                  {...props}
                  contacts={searchTerm.length < 1 ? contacts : searchResult}
                  getContactId={deleteContactHandler}
                  term={searchTerm}
                  searchWord={searchHandler}
                />
              )}
            />
            <Route
              path="/add"
              render={(props) => (
                <AddContact {...props} addContactHandler={addContactHandler} />
              )}
            />
            <Route
              path="/edit"
              render={(props) => (
                <EditContact
                  {...props}
                  updateContactHandler={updateContactHandler}
                />
              )}
            />
            <Route path="/contact/:id" component={ContactDetail} />
          </div>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
