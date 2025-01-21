import { BadRequestException, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { firestore } from 'firebase-admin';
import DocumentReference = firestore.DocumentReference;
import { queryCondition } from './firestore.schema';
import { deleteQueryBatch } from '../../functions/firestore';
import DocumentSnapshot = firestore.DocumentSnapshot;
import { CollectionReference } from 'firebase-admin/firestore';
import { PostQuery } from './types';

@Injectable()
export class FirestoreService {
  async getDocument(collection: string, conditions: queryCondition[] = []) {
    let doc;

    const ref = this.createReference(collection, conditions);

    const docs = await ref.get();
    docs.forEach((d) => {
      doc = {
        id: d.id,
        ...d.data(),
      };
    });

    return doc;
  }

  async deleteById(
    collection: string,
    id: string,
  ): Promise<firestore.WriteResult> {
    const ref = this.createReferenceByID(collection, id);

    return await ref.delete();
  }

  getFirestore() {
    return admin.firestore();
  }

  createReference(
    collection: string,
    conditions: queryCondition[] = [],
    limit?: number,
    group?: boolean,
  ): firestore.Query<firestore.DocumentData> {
    const db = admin.firestore();

    let ref: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = group
      ? db.collectionGroup(collection)
      : db.collection(collection);

    conditions.map((c) => {
      ref = ref.where(c.field, c.opStr, c.value);

      return;
    });

    if (typeof limit === 'number') ref.limit(limit);

    return ref;
  }

  createReferenceByID(collection: string, id: string) {
    const db = admin.firestore();

    return db.collection(collection).doc(id);
  }

  createCollectionReference(collection: string, doc: DocumentReference) {
    const db = doc || admin.firestore();

    return db.collection(collection);
  }

  async getDocumentsList(
    collection: string,
    conditions?: queryCondition[],
    limit?: number,
  ): Promise<Array<any>> {
    const ref = this.createReference(collection, conditions, limit);

    const docs = await ref.get();

    return docs.docs.map((d) => {
      return {
        id: d.id,
        ...d.data(),
      };
    });
  }

  async getDocumentsListByRef(ref: CollectionReference): Promise<Array<any>> {
    const docs = await ref.get();

    return docs.docs.map((d) => {
      return {
        id: d.id,
        ...d.data(),
      };
    });
  }

  async isDocumentExist(
    collection: string,
    id: string,
    snapshot?: DocumentSnapshot,
  ) {
    const ref = this.createReferenceByID(collection, id);
    const _snapshot = snapshot || (await ref.get());

    if (_snapshot.exists) {
      return true;
    } else {
      throw new BadRequestException({
        message: `${id} document in ${collection} not found`,
        code: 'firestore/document-not-found',
      });
    }
  }

  async getCollectionGroupDocuments(
    collection: string,
    conditions: queryCondition[] = [],
    limit?: number,
  ): Promise<any[]> {
    const docs = await this.createReference(
      collection,
      conditions,
      limit,
      true,
    ).get();

    return docs.docs.map((d) => {
      return {
        id: d.id,
        ...d.data(),
      };
    });
  }

  async getDocumentById<T>(collection: string, id: string): Promise<T> {
    const db = admin.firestore();
    const ref = db.collection(collection).doc(id);
    const d = await ref.get();

    if (!d.exists)
      throw new BadRequestException({
        message: `${id} document in ${collection} not found`,
        code: 'firestore/document-not-found',
      });

    return {
      id: d.id,
      ...d.data(),
    } as T;
  }

  async addDocuments(collection: string, payload: any[]): Promise<any[]> {
    const result = [];
    const db = admin.firestore();

    const batch = db.batch();
    payload.forEach((p) => {
      const ref = db.collection(collection).doc();
      result.push({ id: ref.id, ...p });

      batch.set(ref, p);
    });

    await batch.commit();

    return result;
  }

  async updateDocuments(
    refs: DocumentReference[],
    payload: any[],
  ): Promise<any[]> {
    const result = [];
    const db = admin.firestore();

    const batch = db.batch();
    payload.forEach((p, i) => {
      result.push({ id: refs[i].id, ...p });

      batch.update(refs[i], p);
    });

    await batch.commit();

    return result;
  }

  async getDocumentByRef(
    ref: DocumentReference,
    errorOnNotExist = true,
  ): Promise<any> {
    const doc = await ref.get();

    if (!doc.exists) {
      if (errorOnNotExist) {
        throw new BadRequestException('Document does not exists');
      } else {
        return undefined;
      }
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  async setDocumentById(collection, id, payload) {
    const ref = this.createReferenceByID(collection, id);

    return await ref.set(payload, { merge: true });
  }

  async setDocumentByRef(ref, payload) {
    return await ref.set(payload, { merge: true });
  }

  async updateDocumentByRef(ref, payload) {
    return await ref.update(payload);
  }

  async addDocument<T>(collection: string, payload: T) {
    const db = admin.firestore();
    const ref = db.collection(collection).doc();

    await ref.create(payload);

    return { id: ref.id, ...payload };
  }

  async updateDocumentById<T extends Record<string, any>>(
    collection: string,
    id: string,
    payload: T,
  ): Promise<firestore.WriteResult> {
    const ref = this.createReferenceByID(collection, id);

    await this.isDocumentExist(collection, id);

    return await ref.update(payload);
  }

  async deleteCollection(collection, doc) {
    const collectionRef = this.createCollectionReference(collection, doc);
    const query = collectionRef.orderBy('__name__');

    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, resolve).catch(reject);
    });
  }

  deleteDocuments(query) {
    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, resolve).catch(reject);
    });
  }

  async deleteSubCollection(path: string): Promise<void> {
    const parts = path.split('/');

    if (parts.length !== 3) {
      throw new Error(
        'Path must be in the format "collection/documentId/subCollection"',
      );
    }

    const [collection, documentId, subCollection] = parts;
    const db = admin.firestore();
    const docRef = db.collection(collection).doc(documentId);
    const subCollectionRef = docRef.collection(subCollection);

    return this.deleteDocumentsInCollection(subCollectionRef);
  }

  private async deleteDocumentsInCollection(
    collectionRef: firestore.CollectionReference,
  ): Promise<void> {
    const query = collectionRef.orderBy('__name__');

    return new Promise<void>((resolve, reject) => {
      this.deleteQueryBatch(query, resolve).catch(reject);
    });
  }

  async deleteDocumentsByQuery(
    collection: string,
    conditions: queryCondition[],
  ) {
    const ref = this.createReference(collection, conditions);

    return this.deleteDocuments(ref);
  }

  async deleteQueryBatch(query, resolve) {
    await deleteQueryBatch(query, resolve);
  }

  async deleteDocumentByRef(ref: DocumentReference) {
    return await ref.delete();
  }

  async getDocumentsSize(ref: CollectionReference) {
    const docs = await ref.get();

    return docs.size;
  }

  async paginateCollection<T>({
    collection,
    limit,
    startAfterId,
    sortBy,
    sortOrder = 'asc',
    searchField,
    searchValue,
    queryConditions = [],
  }: PostQuery): Promise<T[]> {
    const db = admin.firestore();

    // Create a reference to the collection
    let ref: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      db.collection(collection);

    // Apply sorting if a sortBy field is provided
    if (sortBy) {
      ref = ref.orderBy(sortBy, sortOrder);
    }

    // Apply query conditions
    queryConditions.forEach((condition) => {
      ref = ref.where(condition.field, condition.opStr, condition.value);
    });

    // Apply search condition if searchField and searchValue are provided
    if (searchField && searchValue) {
      const startSearch = searchValue;
      const endSearch = searchValue + '\uf8ff'; // Firestore's technique to query strings that start with searchValue
      console.log({
        startSearch,
        endSearch,
      });
      ref = ref
        .where(searchField, '>=', startSearch)
        .where(searchField, '<=', endSearch);
    }

    // Use startAfter if startAfterId is provided
    if (startAfterId) {
      // Fetch the document to start after
      const startAfterDoc = await db
        .collection(collection)
        .doc(startAfterId)
        .get();
      if (!startAfterDoc.exists) {
        throw new Error(`Document with ID ${startAfterId} does not exist.`);
      }
      ref = ref.startAfter(startAfterDoc);
    }

    // Apply limit
    const docs = await ref.limit(limit).get();

    // Map documents to a response format
    return docs.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as T,
    );
  }
}
