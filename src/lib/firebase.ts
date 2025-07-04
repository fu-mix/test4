// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebaseプロジェクトの設定情報です。
 * 
 * NEXT_PUBLIC_プレフィックスが付いたこれらのキーは、クライアントとサーバーの両方で安全に利用でき、
 * アプリのビルド時に .env ファイルから読み込まれます。
 *
 * ---
 * ### 各キーの確認方法
 * 
 * 以下の手順で、すべてのキーを一度に確認できます。
 * 
 * 1.  **[Firebaseコンソール](https://console.firebase.google.com/)** にアクセスし、あなたのプロジェクト（`alpine-air-460510-k3`）を選択します。
 * 2.  左上のサイドバーにある **歯車アイコン (⚙️)** をクリックし、「**プロジェクトの設定**」を選択します。
 * 3.  「**全般**」タブが開かれていることを確認します。
 * 4.  ページを下にスクロールし、「**マイアプリ**」というカードを探します。
 * 5.  あなたのウェブアプリ（通常はアプリのニックネームやバンドルIDが表示されています）をクリックします。
 * 6.  「**Firebase SDK snippet**」セクションで、「**構成 (Config)**」オプションを選択します。
 * 7.  以下のようなコードが表示されます。この中の値をコピーして、このプロジェクトのルートにある `.env` ファイルに貼り付けてください。
 * 
 * ```javascript
 * const firebaseConfig = {
 *   apiKey: "...",            // -> NEXT_PUBLIC_FIREBASE_API_KEY
 *   authDomain: "...",        // -> NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   projectId: "...",         // -> NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   storageBucket: "...",     // -> NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   messagingSenderId: "...", // -> NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   appId: "..."              // -> NEXT_PUBLIC_FIREBASE_APP_ID
 * };
 * ```
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebaseの初期化
// ホットリロード中にエラーが発生するのを防ぐため、アプリがすでに初期化されているかを確認します。
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
