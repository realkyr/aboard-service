import * as admin from 'firebase-admin'

export const deleteQueryBatch = async (query, resolve) => {
  const db = admin.firestore()
  const snapshot = await query.get()

  const batchSize = snapshot.size
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve()
    return
  }

  // Delete documents in a batch
  const batch = db.batch()
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })
  await batch.commit()

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(query, resolve)
  })
}

export const deleteCollection = async (collectionPath) => {
  const db = admin.firestore()
  const collectionRef = db.collection(collectionPath)

  const query = collectionRef.orderBy('__name__')

  return new Promise<void>((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject)
  })
}
