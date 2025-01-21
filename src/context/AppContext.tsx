import React, { createContext, useState, useContext, useEffect } from "react";
import { Participant, Prize } from "../types";
import { storage, STORAGE_KEYS } from "../services/storage";

interface AppContextType {
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
  remainingPrizes: number;
  setRemainingPrizes: (count: number | ((prev: number) => number)) => void;
  prizes: Prize[];
  setPrizes: (prizes: Prize[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 从存储中加载初始数据
  const [participants, setParticipants] = useState<Participant[]>(() =>
    storage.load(STORAGE_KEYS.PARTICIPANTS, [])
  );
  const [prizes, setPrizes] = useState<Prize[]>(() =>
    storage.load(STORAGE_KEYS.PRIZES, [])
  );
  const [remainingPrizes, setRemainingPrizes] = useState(() => {
    const savedPrizes = storage.load<Prize[]>(STORAGE_KEYS.PRIZES, []);
    return savedPrizes.reduce((sum, prize) => sum + prize.count, 0);
  });

  // 当数据变化时保存
  useEffect(() => {
    storage.save(STORAGE_KEYS.PARTICIPANTS, participants);
  }, [participants]);

  useEffect(() => {
    storage.save(STORAGE_KEYS.PRIZES, prizes);
  }, [prizes]);

  return (
    <AppContext.Provider
      value={{
        participants,
        setParticipants,
        remainingPrizes,
        setRemainingPrizes,
        prizes,
        setPrizes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
