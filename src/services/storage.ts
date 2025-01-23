import { Participant, Prize } from "../types";

// 定义存储的键名
export const STORAGE_KEYS = {
    PARTICIPANTS: "lottery-participants",
    PRIZES: "lottery-prizes",
} as const;

// 存储服务
export const storage = {
    // 保存数据
    save: <T>(key: string, data: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error("保存数据失败:", error);
        }
    },

    // 读取数据
    load: <T extends Prize[] | Participant[]>(key: string, defaultValue: T): T => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error("读取数据失败:", error);
            return defaultValue;
        }
    },
}; 