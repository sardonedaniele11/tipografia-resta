"use client";

import React, { useState, useEffect } from "react";
import { Lock, KeyRound, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

interface PinAuthProps {
  onAuthenticated: () => void;
}

export default function PinAuth({ onAuthenticated }: PinAuthProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [remember, setRemember] = useState(true);

  // Il PIN predefinito è 70122 (il CAP di Bari dove ha sede la Tipografia Resta) oppure 1234
  const VALID_PINS = [
    process.env.NEXT_PUBLIC_WAREHOUSE_PIN || "70122",
    "1234",
  ];

  const handleDigit = (digit: string) => {
    if (pin.length < 5) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      if (nextPin.length >= 4) {
        checkPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const checkPin = (codeToVerify: string) => {
    if (VALID_PINS.includes(codeToVerify)) {
      if (remember) {
        localStorage.setItem("resta_warehouse_auth", "true");
        localStorage.setItem("resta_warehouse_auth_time", Date.now().toString());
      } else {
        sessionStorage.setItem("resta_warehouse_auth", "true");
      }
      onAuthenticated();
    } else if (codeToVerify.length >= 5) {
      setError(true);
      setTimeout(() => {
        setPin("");
        setError(false);
      }, 700);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_PINS.includes(pin)) {
      if (remember) {
        localStorage.setItem("resta_warehouse_auth", "true");
        localStorage.setItem("resta_warehouse_auth_time", Date.now().toString());
      } else {
        sessionStorage.setItem("resta_warehouse_auth", "true");
      }
      onAuthenticated();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#111111]/20 shadow-2xl p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Logo / Badge */}
        <div className="w-14 h-14 bg-[#111111] text-white rounded-xl mx-auto flex items-center justify-center mb-4 shadow-md">
          <Lock className="w-7 h-7 text-[#00e5ff]" />
        </div>

        <span className="text-[11px] font-mono uppercase tracking-widest text-[#ff007f] font-bold block mb-1">
          Accesso Riservato Officina
        </span>
        <h1 className="font-serif font-black text-2xl text-[#111111]">
          Nuova Tipolitografia Resta
        </h1>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Inserisci il PIN per consultare o aggiornare le giacenze del magazzino
        </p>

        {/* Indicatori PIN a pallini */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                i < pin.length
                  ? "bg-[#111111] scale-110 shadow-sm"
                  : "bg-gray-200 border border-gray-300"
              } ${error ? "bg-red-600 animate-shake" : ""}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs font-bold text-red-600 mb-4 animate-in fade-in">
            PIN non corretto. Riprova! (Predefinito: 70122 o 1234)
          </p>
        )}

        {/* Tastierino Numerico Touch (perfetto per smartphone con una mano) */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="h-14 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-[#111111] hover:text-white active:scale-95 text-lg font-serif font-bold text-[#111111] shadow-sm transition"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-gray-200 active:scale-95 text-xs font-bold text-gray-600 shadow-sm transition flex items-center justify-center"
          >
            Canc
          </button>
          <button
            type="button"
            onClick={() => handleDigit("0")}
            className="h-14 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-[#111111] hover:text-white active:scale-95 text-lg font-serif font-bold text-[#111111] shadow-sm transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleManualSubmit}
            className="h-14 rounded-xl border border-[#00e5ff] bg-[#00e5ff]/20 hover:bg-[#00e5ff] text-[#006064] active:scale-95 text-xs font-bold shadow-sm transition flex items-center justify-center"
          >
            OK
          </button>
        </div>

        {/* Opzione Ricorda Dispositivo */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
          <input
            type="checkbox"
            id="remember-device"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded text-[#111111] focus:ring-black"
          />
          <label htmlFor="remember-device" className="cursor-pointer">
            Ricorda su questo telefono / PC
          </label>
        </div>

        <div className="mt-4 pt-3 text-[11px] text-gray-400 font-mono">
          PIN rapido Tipografia: <strong>70122</strong> oppure <strong>1234</strong>
        </div>
      </div>
    </div>
  );
}
