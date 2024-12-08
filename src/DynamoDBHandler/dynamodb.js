"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addArticle = exports.getArticlesByKeyword = exports.getArticlesByDate = exports.getLatestArticles = exports.getArticlesBySpeaker = exports.getArticleById = exports.client = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// Configuration for AWS DynamoDB
var REGION = "us-east-1"; // Replace with your AWS region
var ACCESS_KEY_ID = "local"; // Replace with your AWS Access Key ID
var SECRET_ACCESS_KEY = "local"; // Replace with your AWS Secret Access Key
// DynamoDB Client Configuration
exports.client = new client_dynamodb_1.DynamoDBClient({
    region: REGION,
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});
var ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(exports.client);
var TABLE_NAME = "Articles";
// テーブルが存在しない場合は作成
var createTableIfNotExist = function () { return __awaiter(void 0, void 0, void 0, function () {
    var describeCommand, error_1, createCommand;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 6]);
                describeCommand = new client_dynamodb_1.DescribeTableCommand({
                    TableName: TABLE_NAME,
                });
                return [4 /*yield*/, exports.client.send(describeCommand)];
            case 1:
                _a.sent();
                console.log("Table ".concat(TABLE_NAME, " already exists."));
                return [3 /*break*/, 6];
            case 2:
                error_1 = _a.sent();
                if (!(error_1.name === "ResourceNotFoundException")) return [3 /*break*/, 4];
                console.log("Table ".concat(TABLE_NAME, " not found. Creating table..."));
                createCommand = new client_dynamodb_1.CreateTableCommand({
                    TableName: TABLE_NAME,
                    AttributeDefinitions: [
                        { AttributeName: "id", AttributeType: "N" },
                        { AttributeName: "date", AttributeType: "S" },
                    ],
                    KeySchema: [
                        { AttributeName: "id", KeyType: "HASH" }, // 主キー
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5,
                    },
                    GlobalSecondaryIndexes: [
                        {
                            IndexName: "DateIndex", // GSI2
                            KeySchema: [
                                { AttributeName: "date", KeyType: "HASH" }, // GSIのHASHキー
                            ],
                            Projection: { ProjectionType: "ALL" },
                            ProvisionedThroughput: {
                                ReadCapacityUnits: 3,
                                WriteCapacityUnits: 3,
                            },
                        },
                    ],
                });
                return [4 /*yield*/, exports.client.send(createCommand)];
            case 3:
                _a.sent();
                console.log("Table ".concat(TABLE_NAME, " created successfully."));
                return [3 /*break*/, 5];
            case 4:
                // 他のエラー
                console.error("Error describing table:", error_1);
                _a.label = 5;
            case 5: return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Article idをキーにしてArticleを取得
var getArticleById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new lib_dynamodb_1.GetCommand({
                    TableName: TABLE_NAME,
                    Key: { id: id },
                });
                return [4 /*yield*/, ddbDocClient.send(command)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.Item];
        }
    });
}); };
exports.getArticleById = getArticleById;
// Speaker名で該当Articleを取得
var getArticlesBySpeaker = function (speakerName) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new client_dynamodb_1.QueryCommand({
                    TableName: TABLE_NAME,
                    IndexName: "ParticipantsIndex", // GSI1
                    KeyConditionExpression: "participants.name = :speakerName",
                    ExpressionAttributeValues: {
                        ":speakerName": { S: speakerName },
                    },
                });
                return [4 /*yield*/, ddbDocClient.send(command)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.Items];
        }
    });
}); };
exports.getArticlesBySpeaker = getArticlesBySpeaker;
// 最新のArticleを30個取得
var getLatestArticles = function () { return __awaiter(void 0, void 0, void 0, function () {
    var command, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new client_dynamodb_1.ScanCommand({
                    TableName: TABLE_NAME,
                    Limit: 30,
                });
                return [4 /*yield*/, ddbDocClient.send(command)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.Items];
        }
    });
}); };
exports.getLatestArticles = getLatestArticles;
// 日付別にArticleを取得
var getArticlesByDate = function (date) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new client_dynamodb_1.QueryCommand({
                    TableName: TABLE_NAME,
                    IndexName: "DateIndex", // GSI2
                    KeyConditionExpression: "date = :date",
                    ExpressionAttributeValues: {
                        ":date": { S: date },
                    },
                });
                return [4 /*yield*/, ddbDocClient.send(command)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.Items];
        }
    });
}); };
exports.getArticlesByDate = getArticlesByDate;
// キーワードでArticleを取得
var getArticlesByKeyword = function (keyword) { return __awaiter(void 0, void 0, void 0, function () {
    var command, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new client_dynamodb_1.QueryCommand({
                    TableName: TABLE_NAME,
                    IndexName: "KeywordsIndex", // GSI3
                    KeyConditionExpression: "keywords = :keyword",
                    ExpressionAttributeValues: {
                        ":keyword": { S: keyword },
                    },
                });
                return [4 /*yield*/, ddbDocClient.send(command)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.Items];
        }
    });
}); };
exports.getArticlesByKeyword = getArticlesByKeyword;
// サンプル：Articleの追加
var addArticle = function (article) { return __awaiter(void 0, void 0, void 0, function () {
    var command, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new client_dynamodb_1.PutItemCommand({
                    TableName: TABLE_NAME,
                    Item: {
                        id: { N: article.id.toString() },
                        title: { S: article.title },
                        date: { S: article.date },
                        category: { S: article.category },
                        summary: { S: article.summary },
                        description: { S: article.description },
                        dialogs: { L: article.dialogs.map(function (dialog) { return ({
                                M: {
                                    id: { N: dialog.id.toString() },
                                    speaker: { S: dialog.speaker },
                                    summary: { S: dialog.summary },
                                    response_to: { L: dialog.response_to.map(function (response) { return ({
                                            M: {
                                                dialog_id: { N: response.dialog_id.toString() },
                                                reaction: { S: response.reaction }
                                            }
                                        }); }) }
                                }
                            }); }) },
                        participants: { L: article.participants.map(function (participant) { return ({
                                M: {
                                    name: { S: participant.name },
                                    summary: { S: participant.summary }
                                }
                            }); }) },
                        keywords: { SS: article.keywords }, // Ensure this is an array of strings
                        terms: { L: article.terms.map(function (term) { return ({
                                M: {
                                    term: { S: term.term },
                                    definition: { S: term.definition }
                                }
                            }); }) }
                    }
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ddbDocClient.send(command)];
            case 2:
                _a.sent();
                console.log("Article added successfully.");
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Error adding article:", error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addArticle = addArticle;
console.log("DynamoDB client initialized");
