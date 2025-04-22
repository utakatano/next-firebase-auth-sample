import { db } from "@/lib/firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// プロフィール情報の型定義
export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  occupation?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: unknown; // Firestoreのタイムスタンプ型
  updatedAt: unknown; // Firestoreのタイムスタンプ型
}

// 新規ユーザー登録時のプロフィール初期化
export async function createUserProfile(
  userId: string,
  email: string,
  displayName: string = "",
  photoURL: string = ""
) {
  const userProfile: Partial<UserProfile> = {
    userId,
    email,
    displayName,
    photoURL,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, "userProfiles", userId), userProfile);
    return userProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

// プロフィール情報の取得（存在しない場合は作成）
export async function getUserProfile(
  userId: string,
  email: string = "",
  displayName: string = "",
  photoURL: string = ""
): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "userProfiles", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      console.log("No profile found for user, creating new profile:", userId);
      // プロフィールが存在しない場合は新規作成
      const newProfile = await createUserProfile(
        userId,
        email,
        displayName,
        photoURL
      );
      return newProfile as UserProfile;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// プロフィール情報の更新
export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>
) {
  try {
    const userRef = doc(db, "userProfiles", userId);

    // ドキュメントの存在チェック
    const docSnap = await getDoc(userRef);

    // 更新日時を自動的に追加
    const dataWithTimestamp = {
      ...profileData,
      updatedAt: serverTimestamp(),
    };

    if (docSnap.exists()) {
      // 既存のドキュメントを更新
      await updateDoc(userRef, dataWithTimestamp);
    } else {
      // ドキュメントが存在しない場合は新規作成
      await setDoc(userRef, {
        ...dataWithTimestamp,
        userId,
        createdAt: serverTimestamp(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
