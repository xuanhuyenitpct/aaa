
import React, { createContext, useContext, PropsWithChildren, useState } from "react";
import { ApiKeyModal } from "../components/ApiKeyModal";

interface ApiContextType {
  apiKey: string;
  isReady: boolean;
  runWithApiKey: (callback: () => Promise<any>) => Promise<any>;
  handleError: (err: any) => boolean; // Returns true if error was handled (e.g. quota limit)
  openKeyModal: () => void;
}

const ApiContext = createContext<ApiContextType | null>(null);

export const ApiProvider = ({ children }: PropsWithChildren<{}>) => {
  // Tích hợp API Key mới vào sẵn luôn
  const DEFAULT_API_KEY = "AIzaSyD9k0TN-dSZGsNPPXJGS_my_0MIcgven7M";

  // Sử dụng key từ localStorage nếu có (do người dùng tự nhập khi hết quota), 
  // nếu không thì dùng key mặc định cứng đã cung cấp.
  const [apiKey, setApiKey] = useState(() => {
      return localStorage.getItem("gemini_api_key") || DEFAULT_API_KEY;
  });
  const [showModal, setShowModal] = useState(false);

  // Hàm kiểm tra và xử lý lỗi Quota tập trung
  const checkAndHandleQuotaError = (err: any): boolean => {
      console.error("Checking API Error:", err);
      
      let errorString = "";
      
      // Ưu tiên lấy message nếu có
      if (err?.message) {
          errorString += err.message;
      }
      
      // Thử stringify object để bắt các lỗi JSON trả về từ API
      if (typeof err === "object") {
          try {
              errorString += " " + JSON.stringify(err);
          } catch (e) {
              // Ignore circular reference or other stringify errors
          }
      } else {
          errorString += " " + String(err);
      }
      
      // Kiểm tra các từ khóa lỗi 429 phổ biến (Hết Quota) và 403 (Key lỗi/Quyền truy cập)
      const isQuotaError = 
          errorString.includes("429") || 
          errorString.includes("Quota exceeded") || 
          errorString.includes("RESOURCE_EXHAUSTED") ||
          errorString.includes("quota") ||
          errorString.includes("403") ||
          errorString.includes("API_KEY_INVALID") ||
          errorString.includes("permission denied");

      if (isQuotaError) {
          setShowModal(true);
          return true;
      }
      return false;
  };

  const handleError = (err: any) => {
      return checkAndHandleQuotaError(err);
  };

  const runWithApiKey = async (callback: () => Promise<any>) => {
    try {
      return await callback();
    } catch (err: any) {
      if (checkAndHandleQuotaError(err)) {
        // Nếu đã xử lý lỗi quota, ném ra lỗi thân thiện để component dừng lại
        throw new Error("Hệ thống đang quá tải hoặc Key không hợp lệ. Vui lòng kiểm tra lại.");
      }
      // Ném lại các lỗi khác để component xử lý
      throw err;
    }
  };

  const handleSaveKey = (newKey: string) => {
      if (newKey && newKey.trim().length > 0) {
          setApiKey(newKey);
          localStorage.setItem("gemini_api_key", newKey);
          setShowModal(false);
          
          // Show toast notification using a temporary DOM element (simple solution)
          const toast = document.createElement('div');
          toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-fade-in font-bold flex items-center gap-2';
          toast.innerHTML = '<span>✅</span> Đã lưu Key! Hãy thử lại thao tác vừa rồi.';
          document.body.appendChild(toast);
          setTimeout(() => {
              toast.style.opacity = '0';
              setTimeout(() => document.body.removeChild(toast), 500);
          }, 3000);
      }
  };

  const openKeyModal = () => {
      setShowModal(true);
  };

  return (
    <ApiContext.Provider value={{ apiKey, isReady: !!apiKey, runWithApiKey, handleError, openKeyModal }}>
      {children}
      {showModal && <ApiKeyModal onSave={handleSaveKey} onClose={() => setShowModal(false)} />}
    </ApiContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiKey must be used within an ApiProvider");
  }
  return context;
};
