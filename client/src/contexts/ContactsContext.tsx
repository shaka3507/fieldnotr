import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

export interface Contact {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  last_contacted: string | null;
  created_at: string;
  updated_at: string;
}

interface ContactsContextType {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  refreshContacts: () => Promise<void>;
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};

interface ContactsProviderProps {
  children: ReactNode;
}

export const ContactsProvider: React.FC<ContactsProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8002/api/contacts');
      setContacts(response.data);
      console.log('Successfully fetched contacts from API:', response.data.length, 'contacts');
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to fetch contacts from server');
      setContacts([]); // Set empty array instead of dummy data
    } finally {
      setLoading(false);
    }
  };

  const refreshContacts = async () => {
    await fetchContacts();
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const value: ContactsContextType = {
    contacts,
    loading,
    error,
    refreshContacts,
    selectedContact,
    setSelectedContact,
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}; 