import { DocumentReference } from 'firebase-admin/firestore';

export interface CommentPayload {
  author: string;
  content: string;
  post: DocumentReference;
  createdAt: Date;
  updatedAt: Date;
}
