export const STORAGE_KEY = 'eresq_contacts';

export const getContacts = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [
    { id: 'm1', name: '', phone: '', email: '', relation: 'Parent' },
    { id: 'm2', name: '', phone: '', email: '', relation: 'Spouse' },
    { id: 'm3', name: '', phone: '', email: '', relation: 'Sibling' },
    { id: 'm4', name: '', phone: '', email: '', relation: 'Doctor' },
  ];
};

export const saveContacts = (contacts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};
