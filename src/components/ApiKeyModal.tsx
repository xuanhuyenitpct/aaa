
import React, { useState } from "react";

export const ApiKeyModal = ({ onSave, onClose }) => {
  const [key, setKey] = useState('');
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/90 border-2 border-purple-400 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition"
            title="Đóng"
        >
            ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🔑 Cài đặt API Key
        </h2>
        <p className="text-sm opacity-80 mb-4 leading-relaxed">
          Ứng dụng hoạt động trên nền tảng GitHub/Web cần <b>Google Gemini API Key</b> riêng của bạn để đảm bảo tốc độ và không bị giới hạn.
        </p>
        
        <div className="mb-6">
             <div className="flex justify-between items-end mb-2">
                <label className="text-xs uppercase font-bold text-white/60 tracking-wider">Nhập Key của bạn:</label>
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline bg-white/5 px-2 py-1 rounded-lg border border-cyan-400/30 transition-colors"
                >
                    👉 Lấy API Key tại đây
                </a>
            </div>
            <input 
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Dán key vào đây (bắt đầu bằng AIza...)"
              className="w-full rounded-xl bg-black/40 border-2 border-purple-400/50 p-3 placeholder-white/40 focus:outline-none focus:ring-4 focus:ring-purple-400/30 text-white transition-all"
            />
        </div>

        <div className="flex gap-3">
             <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition text-white/80"
            >
              Hủy
            </button>
            <button
              onClick={() => onSave(key)}
              disabled={!key.trim()}
              className="flex-[2] px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-50 hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              Lưu & Sẵn sàng
            </button>
        </div>
        <p className="text-xs text-center mt-4 opacity-50">
          Key được lưu an toàn trên trình duyệt của bạn và dùng để gọi trực tiếp tới Google AI.
        </p>
      </div>
    </div>
  );
};
