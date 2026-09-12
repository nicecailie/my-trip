// src/hooks/useStorage.js
import { useContext } from "react";
import { StorageContext } from "../contexts/StorageContext";

export const useStorage = () => {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error("useStorage must be used within StorageProvider");
  return ctx;
};
