import { addDocument, listDocuments } from '../services/documentService.js';

export const getDocuments = (req, res) => res.json({ documents: listDocuments(req.user) });

export const uploadDocumentController = (req, res) => {
  const { title, category, visibility } = req.body;
  const url = req.file ? `/uploads/${req.file.filename}` : req.body.url;
  const doc = addDocument({ title, category, url, visibility });
  return res.status(201).json({ document: doc });
};
