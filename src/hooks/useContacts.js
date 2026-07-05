import { useState, useEffect } from 'react';
import { loadContacts, saveContacts } from '../services/storage';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await loadContacts();
      setContacts(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact) => {
    const newContacts = [...contacts, { ...contact, id: Date.now().toString() }];
    await saveContacts(newContacts);
    setContacts(newContacts);
  };

  const updateContact = async (id, updatedData) => {
    let exists = false;
    let newContacts = contacts.map(c => {
      if (c.id === id) {
        exists = true;
        return { ...c, ...updatedData };
      }
      return c;
    });
    if (!exists) {
      newContacts = [...contacts, { ...updatedData, id }];
    }
    await saveContacts(newContacts);
    setContacts(newContacts);
  };

  const deleteContact = async (id) => {
    const newContacts = contacts.filter(c => c.id !== id);
    await saveContacts(newContacts);
    setContacts(newContacts);
  };

  return { contacts, loading, error, addContact, updateContact, deleteContact };
};
