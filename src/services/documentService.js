import { createId, documents } from '../models/dataStore.js';

export const listDocuments = (user) => {
  const isMember = user?.roles?.includes('member') || user?.roles?.includes('admin');
  return documents.filter((doc) => doc.visibility === 'public' || isMember);
};

export const addDocument = ({ title, category, url, visibility }) => {
  const doc = { id: createId(), title, category, url, visibility };
  documents.push(doc);
  return doc;
};
