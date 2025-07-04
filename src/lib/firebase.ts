// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebaseプロジェクトの設定情報です。
 * 
 * 重要：これらのキーはクライアント側でFirebaseプロジェクトを識別するためのもので、公開されることを意図しています。
 * アプリのビルド時やサーバーサイドのコード（actions.tsなど）が実行される際に、これらの値が利用可能である必要があります。
 * 
 * そのため、プロジェクトのルートにある .env ファイルに NEXT_PUBLIC_ というプレフィックスを付けて保存する必要があります。
 * これがNext.jsアプリケーションでこの種の設定を扱うための、標準的で安全な方法です。
 *
 * ---
 * 
 * これらの値はFirebaseプロジェクトのコンソールで見つけることができます。
 * 1. プロジェクト設定（⚙️歯車アイコン）> 全般 タブに移動します。
 * 2. 「マイアプリ」カードで、ウェブアプリを選択します。
 * 3. 「Firebase SDK snippet」セクションで「構成」を選ぶと、以下のキーが表示されます。
 *    - apiKey
 *    - authDomain
 *    - storageBucket
 *    - messagingSenderId
 *    - appId
 * 4. 「プロジェクトID」は、「プロジェクト」カードにも記載されています。
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
