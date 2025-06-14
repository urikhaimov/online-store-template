"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const dotenv = __importStar(require("dotenv"));
const serviceAccountKey_json_1 = __importDefault(require("../src/serviceAccountKey.json"));
dotenv.config();
const serviceAccount = serviceAccountKey_json_1.default;
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount)
});
const email = process.argv[2];
if (!email) {
    console.error('❌ Please provide an email: npm run setRole your@email.com');
    process.exit(1);
}
(async () => {
    try {
        const user = await (0, auth_1.getAuth)().getUserByEmail(email);
        await (0, auth_1.getAuth)().setCustomUserClaims(user.uid, { role: 'admin' });
        console.log(`✅ ${email} is now an admin`);
    }
    catch (error) {
        console.error('❌ Failed to set role:', error);
    }
})();
