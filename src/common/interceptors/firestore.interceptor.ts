import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs';

import {
  Timestamp,
  CollectionReference,
  DocumentReference,
} from 'firebase-admin/firestore';
import dayjs from 'dayjs';

const objectProcess = (data: Record<string, any>) => {
  const result = { ...data };

  // Iterate over keys to process data
  Object.keys(result).forEach((key) => {
    const value = result[key];

    if (value instanceof Timestamp) {
      // Convert Firebase Timestamp to ISO string
      result[key] = dayjs(value.toDate()).format();
    } else if (
      value instanceof DocumentReference ||
      value instanceof CollectionReference
    ) {
      // Convert Firestore references to their path
      result[key] = value.path;
    } else if (Array.isArray(value)) {
      // Filter non-truthy values from arrays
      result[key] = value
        .filter(Boolean)
        .map((item) => (typeof item === 'object' ? objectProcess(item) : item));
    } else if (value && typeof value === 'object') {
      // Recursively process nested objects
      result[key] = objectProcess(value);
    }
  });

  return result;
};

@Injectable()
export class FirestoreInterceptor implements NestInterceptor {
  private dataPostProcess(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) =>
        typeof item === 'object' ? objectProcess(item) : item,
      );
    } else if (data && typeof data === 'object') {
      return objectProcess(data);
    }
    return data;
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => this.dataPostProcess(data)));
  }
}
