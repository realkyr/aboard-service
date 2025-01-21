"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreService = void 0;
var common_1 = require("@nestjs/common");
var admin = require("firebase-admin");
var firestore_1 = require("../../functions/firestore");
var FirestoreService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FirestoreService = _classThis = /** @class */ (function () {
        function FirestoreService_1() {
        }
        FirestoreService_1.prototype.getDocument = function (collection_1) {
            return __awaiter(this, arguments, void 0, function (collection, conditions) {
                var doc, ref, docs;
                if (conditions === void 0) { conditions = []; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ref = this.createReference(collection, conditions);
                            return [4 /*yield*/, ref.get()];
                        case 1:
                            docs = _a.sent();
                            docs.forEach(function (d) {
                                doc = __assign({ id: d.id }, d.data());
                            });
                            return [2 /*return*/, doc];
                    }
                });
            });
        };
        FirestoreService_1.prototype.deleteById = function (collection, id) {
            return __awaiter(this, void 0, void 0, function () {
                var ref;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ref = this.createReferenceByID(collection, id);
                            return [4 /*yield*/, ref.delete()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        FirestoreService_1.prototype.getFirestore = function () {
            return admin.firestore();
        };
        FirestoreService_1.prototype.createReference = function (collection, conditions, limit, group) {
            if (conditions === void 0) { conditions = []; }
            var db = admin.firestore();
            var ref = group
                ? db.collectionGroup(collection)
                : db.collection(collection);
            conditions.map(function (c) {
                ref = ref.where(c.field, c.opStr, c.value);
                return;
            });
            if (typeof limit === 'number')
                ref.limit(limit);
            return ref;
        };
        FirestoreService_1.prototype.createReferenceByID = function (collection, id) {
            var db = admin.firestore();
            return db.collection(collection).doc(id);
        };
        FirestoreService_1.prototype.createCollectionReference = function (collection, doc) {
            var db = doc || admin.firestore();
            return db.collection(collection);
        };
        FirestoreService_1.prototype.getDocumentsList = function (collection, conditions, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var ref, docs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ref = this.createReference(collection, conditions, limit);
                            return [4 /*yield*/, ref.get()];
                        case 1:
                            docs = _a.sent();
                            return [2 /*return*/, docs.docs.map(function (d) {
                                    return __assign({ id: d.id }, d.data());
                                })];
                    }
                });
            });
        };
        FirestoreService_1.prototype.getDocumentsListByRef = function (ref) {
            return __awaiter(this, void 0, void 0, function () {
                var docs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ref.get()];
                        case 1:
                            docs = _a.sent();
                            return [2 /*return*/, docs.docs.map(function (d) {
                                    return __assign({ id: d.id }, d.data());
                                })];
                    }
                });
            });
        };
        FirestoreService_1.prototype.isDocumentExist = function (collection, id) {
            return __awaiter(this, void 0, void 0, function () {
                var ref;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ref = this.createReferenceByID(collection, id);
                            return [4 /*yield*/, ref.get()];
                        case 1:
                            if ((_a.sent()).exists) {
                                return [2 /*return*/, true];
                            }
                            else {
                                throw new common_1.BadRequestException("id: ".concat(id, " is not exist in ").concat(collection, " collection"));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        FirestoreService_1.prototype.getCollectionGroupDocuments = function (collection_1) {
            return __awaiter(this, arguments, void 0, function (collection, conditions, limit) {
                var docs;
                if (conditions === void 0) { conditions = []; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.createReference(collection, conditions, limit, true).get()];
                        case 1:
                            docs = _a.sent();
                            return [2 /*return*/, docs.docs.map(function (d) {
                                    return __assign({ id: d.id }, d.data());
                                })];
                    }
                });
            });
        };
        FirestoreService_1.prototype.getDocumentById = function (collection, id) {
            return __awaiter(this, void 0, void 0, function () {
                var db, ref, d;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = admin.firestore();
                            ref = db.collection(collection).doc(id);
                            return [4 /*yield*/, ref.get()];
                        case 1:
                            d = _a.sent();
                            if (!d.exists)
                                throw new common_1.BadRequestException({
                                    message: "".concat(id, " document in ").concat(collection, " not found"),
                                    code: 'firestore/document-not-found'
                                });
                            return [2 /*return*/, __assign({ id: d.id }, d.data())];
                    }
                });
            });
        };
        FirestoreService_1.prototype.addDocuments = function (collection, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var result, db, batch;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            result = [];
                            db = admin.firestore();
                            batch = db.batch();
                            payload.forEach(function (p) {
                                var ref = db.collection(collection).doc();
                                result.push(__assign({ id: ref.id }, p));
                                batch.set(ref, p);
                            });
                            return [4 /*yield*/, batch.commit()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        FirestoreService_1.prototype.updateDocuments = function (refs, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var result, db, batch;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            result = [];
                            db = admin.firestore();
                            batch = db.batch();
                            payload.forEach(function (p, i) {
                                result.push(__assign({ id: refs[i].id }, p));
                                batch.update(refs[i], p);
                            });
                            return [4 /*yield*/, batch.commit()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        FirestoreService_1.prototype.getDocumentByRef = function (ref_1) {
            return __awaiter(this, arguments, void 0, function (ref, errorOnNotExist) {
                var doc;
                if (errorOnNotExist === void 0) { errorOnNotExist = true; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ref.get()];
                        case 1:
                            doc = _a.sent();
                            if (!doc.exists) {
                                if (errorOnNotExist) {
                                    throw new common_1.BadRequestException('Document does not exists');
                                }
                                else {
                                    return [2 /*return*/, undefined];
                                }
                            }
                            return [2 /*return*/, __assign({ id: doc.id }, doc.data())];
                    }
                });
            });
        };
        FirestoreService_1.prototype.setDocumentById = function (collection, id, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var ref;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ref = this.createReferenceByID(collection, id);
                            return [4 /*yield*/, ref.set(payload, { merge: true })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        FirestoreService_1.prototype.setDocumentByRef = function (ref, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ref.set(payload, { merge: true })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        FirestoreService_1.prototype.updateDocumentByRef = function (ref, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ref.update(payload)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        FirestoreService_1.prototype.addDocument = function (collection, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var db, ref;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = admin.firestore();
                            ref = db.collection(collection).doc();
                            return [4 /*yield*/, ref.create(payload)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, __assign({ id: ref.id }, payload)];
                    }
                });
            });
        };
        FirestoreService_1.prototype.updateDocumentByID = function (collection, id, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var ref;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ref = this.createReferenceByID(collection, id);
                            return [4 /*yield*/, ref.update(payload)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        FirestoreService_1.prototype.deleteCollection = function (collection, doc) {
            return __awaiter(this, void 0, void 0, function () {
                var collectionRef, query;
                var _this = this;
                return __generator(this, function (_a) {
                    collectionRef = this.createCollectionReference(collection, doc);
                    query = collectionRef.orderBy('__name__');
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.deleteQueryBatch(query, resolve).catch(reject);
                        })];
                });
            });
        };
        FirestoreService_1.prototype.deleteDocuments = function (query) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.deleteQueryBatch(query, resolve).catch(reject);
            });
        };
        FirestoreService_1.prototype.deleteSubCollection = function (path) {
            return __awaiter(this, void 0, void 0, function () {
                var parts, collection, documentId, subCollection, db, docRef, subCollectionRef;
                return __generator(this, function (_a) {
                    parts = path.split('/');
                    if (parts.length !== 3) {
                        throw new Error('Path must be in the format "collection/documentId/subCollection"');
                    }
                    collection = parts[0], documentId = parts[1], subCollection = parts[2];
                    db = admin.firestore();
                    docRef = db.collection(collection).doc(documentId);
                    subCollectionRef = docRef.collection(subCollection);
                    return [2 /*return*/, this.deleteDocumentsInCollection(subCollectionRef)];
                });
            });
        };
        FirestoreService_1.prototype.deleteDocumentsInCollection = function (collectionRef) {
            return __awaiter(this, void 0, void 0, function () {
                var query;
                var _this = this;
                return __generator(this, function (_a) {
                    query = collectionRef.orderBy('__name__');
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.deleteQueryBatch(query, resolve).catch(reject);
                        })];
                });
            });
        };
        FirestoreService_1.prototype.deleteQueryBatch = function (query, resolve) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, firestore_1.deleteQueryBatch)(query, resolve)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        FirestoreService_1.prototype.deleteDocumentByRef = function (ref) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ref.delete()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        FirestoreService_1.prototype.getDocumentsSize = function (ref) {
            return __awaiter(this, void 0, void 0, function () {
                var docs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ref.get()];
                        case 1:
                            docs = _a.sent();
                            return [2 /*return*/, docs.size];
                    }
                });
            });
        };
        FirestoreService_1.prototype.paginateCollection = function (collection_1, limit_1, offset_1, sortBy_1) {
            return __awaiter(this, arguments, void 0, function (collection, limit, offset, sortBy, sortOrder) {
                var db, ref, docs;
                if (sortOrder === void 0) { sortOrder = 'asc'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            db = admin.firestore();
                            ref = db.collection(collection);
                            // Apply sorting if a sortBy field is provided
                            if (sortBy) {
                                ref = ref.orderBy(sortBy, sortOrder);
                            }
                            return [4 /*yield*/, ref.offset(offset).limit(limit).get()];
                        case 1:
                            docs = _a.sent();
                            // Map documents to a response format
                            return [2 /*return*/, docs.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })];
                    }
                });
            });
        };
        return FirestoreService_1;
    }());
    __setFunctionName(_classThis, "FirestoreService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FirestoreService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FirestoreService = _classThis;
}();
exports.FirestoreService = FirestoreService;
