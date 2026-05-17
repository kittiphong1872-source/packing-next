"use client";

import { useState, useEffect, useRef } from "react";

const MOCK_ORDERS = [
  { id: "HC-20240517-001", customer: "คุณสมชาย ใจดี", items: [{ sku: "HC-ESPRESSO-250", name: "เมล็ดกาแฟเอสเปรสโซ่ 250g", qty: 2, packed: 0 }, { sku: "HC-DRIP-100", name: "กาแฟดริป 100g", qty: 1, packed: 0 }], priority: "ด่วน", status: "รอแพ็ค", channel: "Shopee", created: "08:12" },
  { id: "HC-20240517-002", customer: "คุณมาลี รักกาแฟ", items: [{ sku: "HC-LATTE-500", name: "กาแฟลาเต้ 500g", qty: 1, packed: 0 }], priority: "ปกติ", status: "รอแพ็ค", channel: "Lazada", created: "08:45" },
  { id: "HC-20240517-003", customer: "คุณวิชัย กาแฟหอม", items: [{ sku: "HC-COLD-BREW-250", name: "Cold Brew เข้มข้น 250ml", qty: 3, packed: 0 }, { sku: "HC-SUGAR-FREE", name: "กาแฟไม่มีน้ำตาล 200g", qty: 2, packed: 0 }], priority: "ด่วนมาก", status: "รอแพ็ค", channel: "TikTok Shop", created: "09:02" },
  { id: "HC-20240517-004", customer: "คุณนภา เช้าตรู่", items: [{ sku: "HC-ESPRESSO-250", name: "เมล็ดกาแฟเอสเปรสโซ่ 250g", qty: 1, packed: 0 }], priority: "ปกติ", status: "รอแพ็ค", channel: "Line", created: "09:15" },
  { id: "HC-20240517-005", customer: "คุณเกียรติ อาราเบีย", items: [{ sku: "HC-ARABICA-1KG", name: "อาราบิก้า 1kg", qty: 2, packed: 0 }, { sku: "HC-FILTER-50", name: "กระดาษกรอง 50 แผ่น", qty: 1, packed: 0 }], priority: "ด่วน", status: "รอแพ็ค", channel: "Shopee", created: "09:30" },
];

const MOCK_SKU_DB = {
  "HC-ESPRESSO-250": { name: "เมล็ดกาแฟเอสเปรสโซ่ 250g", stock: 48, unit: "ถุง" },
  "HC-DRIP-100": { name: "กาแฟดริป 100g", stock: 5, unit: "กล่อง" },
  "HC-LATTE-500": { name: "กาแฟลาเต้ 500g", stock: 22, unit: "ถุง" },
  "HC-COLD-BREW-250": { name: "Cold Brew เข้มข้น 250ml", stock: 3, unit: "ขวด" },
  "HC-SUGAR-FREE": { name: "กาแฟไม่มีน้ำตาล 200g", stock: 31, unit: "ถุง" },
  "HC-ARABICA-1KG": { name: "อาราบิก้า 1kg", stock: 15, unit: "ถุง" },
  "HC-FILTER-50": { name: "กระดาษกรอง 50 แผ่น", stock: 2, unit: "ชุด" },
};

const STAFF = [
  { id: 1, name: "น้องแนน", avatar: "น", status: "กำลังแพ็ค", packedToday: 34, current: "HC-20240517-001" },
  { id: 2, name: "พี่ตั้ม", avatar: "ต", status: "พัก", packedToday: 28, current: null },
  { id: 3, name: "น้องเม", avatar: "ม", status: "กำลังแพ็ค", packedToday: 41, current: "HC-20240517-003" },
];

const ALERTS = [
  { id: 1, type: "stock", msg: "HC-DRIP-100 เหลือแค่ 5 ชิ้น!", time: "09:01", icon: "⚠️" },
  { id: 2, type: "stock", msg: "HC-COLD-BREW-250 เหลือ 3 ขวด – ต่ำกว่า Min!", time: "09:05", icon: "🔴" },
  { id: 3, type: "stock", msg: "HC-FILTER-50 เหลือ 2 ชุด!", time: "09:18", icon: "🔴" },
  { id: 4, type: "order", msg: "ออเดอร์ด่วนมาก HC-003 รอเกิน 30 นาที", time: "09:32", icon: "🚨" },
];

const PRIORITY_CONFIG = {
  "ด่วนมาก": { color: "bg-red-500", text: "text-white", border: "border-red-500", badge: "bg-red-500 text-white" },
  "ด่วน": { color: "bg-amber-400", text: "text-black", border: "border-amber-400", badge: "bg-amber-400 text-black" },
  "ปกติ": { color: "bg-slate-600", text: "text-white", border: "border-slate-600", badge: "bg-slate-600 text-white" },
};

const CHANNEL_CONFIG = {
  "Shopee": { bg: "bg-orange-500", text: "text-white" },
  "Lazada": { bg: "bg-blue-600", text: "text-white" },
  "TikTok Shop": { bg: "bg-black", text: "text-white" },
  "Line": { bg: "bg-green-500", text: "text-white" },
};

export default function HillCoffPackingSystem() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeOrder, setActiveOrder] = useState(null);
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [alerts, setAlerts] = useState(ALERTS);
  const [clock, setClock] = useState(new Date());
  const [packedToday] = useState(103);
  const [activeTab, setActiveTab] = useState("queue");
  const scanRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = clock.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = clock.toLocaleDateString("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const handleScan = (e) => {
    e.preventDefault();
    const sku = scanInput.trim().toUpperCase();
    if (!sku) return;
    const product = MOCK_SKU_DB[sku];
    if (product) {
      setScanResult({ ok: true, sku, ...product });
      if (activeOrder) {
        setOrders(prev => prev.map(o => {
          if (o.id !== activeOrder.id) return o;
          const updatedItems = o.items.map(item => {
            if (item.sku === sku && item.packed < item.qty) {
              return { ...item, packed: item.packed + 1 };
            }
            return item;
          });
          return { ...o, items: updatedItems };
        }));
        setActiveOrder(prev => ({
          ...prev,
          items: prev.items.map(item =>
            item.sku === sku && item.packed < item.qty
              ? { ...item, packed: item.packed + 1 }
              : item
          )
        }));
      }
    } else {
      setScanResult({ ok: false, sku, msg: "ไม่พบ SKU นี้ในระบบ!" });
    }
    setScanInput("");
    setTimeout(() => setScanResult(null), 3000);
    setTimeout(() => scanRef.current?.focus(), 50);
  };

  const selectOrder = (order) => {
    setActiveOrder(order);
    setActiveTab("scan");
    setTimeout(() => scanRef.current?.focus(), 100);
  };

  const completeOrder = () => {
    if (!activeOrder) return;
    setOrders(prev => prev.filter(o => o.id !== activeOrder.id));
    setActiveOrder(null);
    setActiveTab("queue");
  };

  const dismissAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const pendingUrgent = orders.filter(o => o.priority === "ด่วนมาก" || o.priority === "ด่วน").length;
  const allDone = activeOrder?.items.every(i => i.packed >= i.qty);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono flex flex-col" style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>
      
      {/* ── TOP STATUS BAR ── */}
      <div className="bg-zinc-900 border-b-2 border-amber-400 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center">
            <span className="text-black font-black text-xs">HC</span>
          </div>
          <div>
            <div className="text-amber-400 font-bold text-sm tracking-widest uppercase">Hill Coff · ห้องแพ็คสินค้า</div>
            <div className="text-zinc-400 text-xs">{dateStr}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs flex-wrap">
          <div className="text-center">
            <div className="text-zinc-400">แพ็ควันนี้</div>
            <div className="text-amber-400 font-black text-xl leading-none">{packedToday}</div>
          </div>
          <div className="w-px h-8 bg-zinc-700" />
          <div className="text-center">
            <div className="text-zinc-400">รอแพ็ค</div>
            <div className="text-white font-black text-xl leading-none">{orders.length}</div>
          </div>
          <div className="w-px h-8 bg-zinc-700" />
          <div className="text-center">
            <div className="text-zinc-400">ด่วน/ด่วนมาก</div>
            <div className="text-red-400 font-black text-xl leading-none">{pendingUrgent}</div>
          </div>
          <div className="w-px h-8 bg-zinc-700" />
          <div className="text-right">
            <div className="text-zinc-400 text-xs">เวลาปัจจุบัน</div>
            <div className="text-green-400 font-black text-lg leading-none tabular-nums">{timeStr}</div>
          </div>
        </div>
      </div>

      {/* ── ALERT STRIP ── */}
      {alerts.length > 0 && (
        <div className="bg-red-950 border-b border-red-800 px-4 py-1 flex items-center gap-2 overflow-x-auto">
          <span className="text-red-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap">⚡ แจ้งเตือน</span>
          {alerts.map(a => (
            <div key={a.id} className="flex items-center gap-1 bg-red-900 border border-red-700 rounded px-2 py-0.5 text-xs whitespace-nowrap">
              <span>{a.icon}</span>
              <span className="text-red-200">{a.msg}</span>
              <span className="text-red-500">[{a.time}]</span>
              <button onClick={() => dismissAlert(a.id)} className="text-red-400 hover:text-white ml-1 font-bold">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: STAFF STATUS ── */}
        <div className="hidden lg:flex flex-col w-48 bg-zinc-900 border-r border-zinc-800 p-3 gap-3">
          <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold border-b border-zinc-700 pb-2">พนักงาน</div>
          {STAFF.map(s => (
            <div key={s.id} className={`rounded-lg p-2 border ${s.status === "กำลังแพ็ค" ? "border-green-600 bg-green-950" : "border-zinc-700 bg-zinc-800"}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${s.status === "กำลังแพ็ค" ? "bg-green-500 text-black" : "bg-zinc-600 text-zinc-300"}`}>
                  {s.avatar}
                </div>
                <div>
                  <div className="text-white text-xs font-bold">{s.name}</div>
                  <div className={`text-xs ${s.status === "กำลังแพ็ค" ? "text-green-400" : "text-zinc-500"}`}>
                    {s.status === "กำลังแพ็ค" ? "🟢 แพ็คอยู่" : "🟡 พัก"}
                  </div>
                </div>
              </div>
              <div className="text-zinc-400 text-xs">วันนี้: <span className="text-amber-400 font-bold">{s.packedToday} ออเดอร์</span></div>
              {s.current && <div className="text-zinc-500 text-xs mt-0.5 truncate">{s.current}</div>}
            </div>
          ))}

          {/* Low Stock Warnings */}
          <div className="mt-2">
            <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold border-b border-zinc-700 pb-2 mb-2">Stock ใกล้หมด</div>
            {Object.entries(MOCK_SKU_DB).filter(([, v]) => v.stock <= 5).map(([sku, val]) => (
              <div key={sku} className="mb-1 bg-red-950 border border-red-800 rounded p-1.5">
                <div className="text-red-300 text-xs font-bold truncate">{sku}</div>
                <div className="text-red-400 text-xs">{val.stock} {val.unit} ⚠️</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER CONTENT ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tab Bar (mobile) */}
          <div className="flex bg-zinc-900 border-b border-zinc-800">
            {[{ key: "queue", label: `คิวแพ็ค (${orders.length})` }, { key: "scan", label: "สแกน SKU" }].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-sm font-bold tracking-wide transition-all ${activeTab === tab.key ? "bg-amber-400 text-black" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── ORDER QUEUE TAB ── */}
          {activeTab === "queue" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                  <div className="text-6xl mb-4">✅</div>
                  <div className="text-xl font-bold text-green-400">แพ็คหมดแล้ว!</div>
                  <div className="text-sm mt-1">ไม่มีออเดอร์รอแพ็ค</div>
                </div>
              )}
              {/* Priority sort */}
              {["ด่วนมาก", "ด่วน", "ปกติ"].map(pri => {
                const grp = orders.filter(o => o.priority === pri);
                if (!grp.length) return null;
                const cfg = PRIORITY_CONFIG[pri];
                return (
                  <div key={pri}>
                    <div className={`text-xs font-bold uppercase tracking-widest mb-2 px-1 ${pri === "ด่วนมาก" ? "text-red-400" : pri === "ด่วน" ? "text-amber-400" : "text-zinc-400"}`}>
                      {pri === "ด่วนมาก" ? "🚨" : pri === "ด่วน" ? "⚡" : "📦"} {pri} ({grp.length})
                    </div>
                    {grp.map(order => {
                      const chCfg = CHANNEL_CONFIG[order.channel] || { bg: "bg-zinc-700", text: "text-white" };
                      const isActive = activeOrder?.id === order.id;
                      return (
                        <div
                          key={order.id}
                          onClick={() => selectOrder(order)}
                          className={`rounded-xl border-2 p-3 mb-2 cursor-pointer transition-all active:scale-95 ${isActive ? "border-amber-400 bg-amber-950" : `${cfg.border} bg-zinc-900 hover:bg-zinc-800`}`}
                        >
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-black px-2 py-0.5 rounded ${cfg.badge}`}>{order.priority}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${chCfg.bg} ${chCfg.text}`}>{order.channel}</span>
                            </div>
                            <span className="text-zinc-500 text-xs">{order.created} น.</span>
                          </div>
                          <div className="font-bold text-white text-sm mb-0.5">{order.id}</div>
                          <div className="text-zinc-400 text-xs mb-2">{order.customer}</div>
                          <div className="space-y-1">
                            {order.items.map((item, i) => {
                              const done = item.packed >= item.qty;
                              const stockInfo = MOCK_SKU_DB[item.sku];
                              const lowStock = stockInfo && stockInfo.stock <= 5;
                              return (
                                <div key={i} className={`flex items-center justify-between text-xs rounded px-2 py-1 ${done ? "bg-green-900/40 text-green-400" : "bg-zinc-800 text-zinc-300"}`}>
                                  <div className="flex items-center gap-1 flex-1 min-w-0">
                                    <span>{done ? "✅" : "⬜"}</span>
                                    <span className="font-mono text-zinc-500 truncate">{item.sku}</span>
                                    {lowStock && <span className="text-red-400">⚠️</span>}
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    <span className="text-zinc-400 truncate max-w-[100px]">{item.name}</span>
                                    <span className={`font-black ${done ? "text-green-400" : "text-white"}`}>{item.packed}/{item.qty}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); selectOrder(order); }}
                              className="w-full py-2 rounded-lg bg-amber-400 text-black font-black text-sm active:bg-amber-500 transition"
                            >
                              เริ่มแพ็ค →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── SCAN TAB ── */}
          {activeTab === "scan" && (
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">

              {/* Active Order Header */}
              {activeOrder ? (
                <div className="bg-zinc-900 border-2 border-amber-400 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2 py-0.5 rounded ${PRIORITY_CONFIG[activeOrder.priority]?.badge}`}>{activeOrder.priority}</span>
                      <span className="text-amber-400 font-bold text-sm">{activeOrder.id}</span>
                    </div>
                    <button onClick={() => { setActiveOrder(null); setActiveTab("queue"); }} className="text-zinc-500 hover:text-white text-xs">← กลับ</button>
                  </div>
                  <div className="text-white font-bold">{activeOrder.customer}</div>
                  <div className="text-zinc-400 text-xs">{activeOrder.channel} · {activeOrder.created} น.</div>

                  <div className="mt-2 space-y-1">
                    {activeOrder.items.map((item, i) => {
                      const done = item.packed >= item.qty;
                      const stockInfo = MOCK_SKU_DB[item.sku];
                      const lowStock = stockInfo && stockInfo.stock <= 5;
                      return (
                        <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm border ${done ? "bg-green-900 border-green-600" : "bg-zinc-800 border-zinc-700"}`}>
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-lg">{done ? "✅" : "⬜"}</span>
                            <div className="min-w-0">
                              <div className="font-mono text-xs text-zinc-400">{item.sku}</div>
                              <div className="text-white text-xs truncate">{item.name}</div>
                              {lowStock && <div className="text-red-400 text-xs">⚠️ stock เหลือน้อย</div>}
                            </div>
                          </div>
                          <div className={`font-black text-lg ml-2 ${done ? "text-green-400" : item.packed > 0 ? "text-amber-400" : "text-white"}`}>
                            {item.packed}/{item.qty}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {allDone && (
                    <button
                      onClick={completeOrder}
                      className="mt-3 w-full py-4 rounded-xl bg-green-500 text-black font-black text-lg active:bg-green-600 transition animate-pulse"
                    >
                      ✅ แพ็คเสร็จ! ยืนยันออเดอร์
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center text-zinc-500">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-sm">เลือกออเดอร์จากคิวก่อนสแกน</div>
                  <button onClick={() => setActiveTab("queue")} className="mt-2 px-4 py-2 bg-amber-400 text-black rounded-lg font-bold text-sm">ดูคิว →</button>
                </div>
              )}

              {/* SCAN BOX */}
              <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-4">
                <div className="text-zinc-400 text-xs uppercase tracking-widest mb-3 font-bold">📷 สแกน Barcode / กรอก SKU</div>
                <form onSubmit={handleScan} className="flex gap-2">
                  <input
                    ref={scanRef}
                    type="text"
                    value={scanInput}
                    onChange={e => setScanInput(e.target.value.toUpperCase())}
                    placeholder="สแกนหรือพิมพ์ SKU..."
                    className="flex-1 bg-black border-2 border-zinc-600 focus:border-amber-400 rounded-lg px-4 py-3 text-white text-lg font-mono outline-none placeholder-zinc-600 transition"
                    autoComplete="off"
                    autoFocus
                  />
                  <button type="submit" className="px-5 py-3 bg-amber-400 text-black font-black text-lg rounded-lg active:bg-amber-500 transition whitespace-nowrap">
                    ✓ ตรวจ
                  </button>
                </form>

                {/* Scan Result */}
                {scanResult && (
                  <div className={`mt-3 rounded-xl p-4 border-2 ${scanResult.ok ? "bg-green-900 border-green-500" : "bg-red-900 border-red-500"}`}>
                    {scanResult.ok ? (
                      <div>
                        <div className="text-green-400 font-black text-lg">✅ พบสินค้า!</div>
                        <div className="text-white font-bold mt-1">{scanResult.name}</div>
                        <div className="text-zinc-300 text-sm font-mono">{scanResult.sku}</div>
                        <div className={`text-sm mt-1 ${scanResult.stock <= 5 ? "text-red-400 font-bold" : "text-green-300"}`}>
                          Stock: {scanResult.stock} {scanResult.unit} {scanResult.stock <= 5 ? "⚠️ ใกล้หมด!" : ""}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-400 font-black text-lg">❌ ไม่พบ SKU!</div>
                        <div className="text-zinc-300 font-mono text-sm mt-1">{scanResult.sku}</div>
                        <div className="text-red-300 text-sm mt-1">{scanResult.msg}</div>
                        <div className="text-zinc-400 text-xs mt-1">กรุณาตรวจสอบสินค้าอีกครั้ง</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick SKU Buttons */}
                <div className="mt-3">
                  <div className="text-zinc-500 text-xs mb-2">กด SKU ด่วน:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(MOCK_SKU_DB).map(sku => (
                      <button
                        key={sku}
                        onClick={() => { setScanInput(sku); setTimeout(() => scanRef.current?.focus(), 50); }}
                        className="text-xs font-mono bg-zinc-800 border border-zinc-700 hover:border-amber-400 hover:text-amber-400 text-zinc-400 px-2 py-1 rounded transition"
                      >
                        {sku}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SKU Lookup Table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold p-3 border-b border-zinc-800 flex justify-between">
                  <span>รายการ SKU ทั้งหมด</span>
                  <span className="text-zinc-600">stock ปัจจุบัน</span>
                </div>
                {Object.entries(MOCK_SKU_DB).map(([sku, val], i) => {
                  const low = val.stock <= 5;
                  return (
                    <div key={sku} className={`flex items-center justify-between px-3 py-2 text-sm ${i % 2 === 0 ? "bg-zinc-900" : "bg-zinc-950"} ${low ? "border-l-4 border-red-500" : "border-l-4 border-transparent"}`}>
                      <div>
                        <div className="font-mono text-xs text-zinc-400">{sku}</div>
                        <div className="text-white text-xs">{val.name}</div>
                      </div>
                      <div className={`font-black text-base ${low ? "text-red-400" : "text-green-400"}`}>
                        {val.stock} <span className="text-xs font-normal text-zinc-500">{val.unit}</span>
                        {low && <span className="text-red-400 ml-1">⚠️</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: REALTIME ALERTS ── */}
        <div className="hidden xl:flex flex-col w-56 bg-zinc-900 border-l border-zinc-800 p-3">
          <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold border-b border-zinc-700 pb-2 mb-3">แจ้งเตือน Realtime</div>
          <div className="space-y-2 flex-1">
            {alerts.map(a => (
              <div key={a.id} className={`rounded-lg p-2 border text-xs ${a.type === "stock" ? "border-red-800 bg-red-950" : "border-orange-800 bg-orange-950"}`}>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-base">{a.icon}</span>
                  <button onClick={() => dismissAlert(a.id)} className="text-zinc-600 hover:text-white ml-auto">✕</button>
                </div>
                <div className={`mt-1 font-bold ${a.type === "stock" ? "text-red-300" : "text-orange-300"}`}>{a.msg}</div>
                <div className="text-zinc-500 mt-1">{a.time} น.</div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-zinc-600 text-center text-xs mt-8">
                <div className="text-2xl mb-2">✅</div>
                ไม่มีแจ้งเตือน
              </div>
            )}
          </div>

          {/* Today Summary */}
          <div className="border-t border-zinc-800 pt-3 mt-3">
            <div className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">สรุปวันนี้</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">แพ็คแล้ว</span>
                <span className="text-amber-400 font-black">{packedToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">รอแพ็ค</span>
                <span className="text-white font-black">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">ออเดอร์ด่วน</span>
                <span className="text-red-400 font-black">{pendingUrgent}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all"
                  style={{ width: `${Math.round((packedToday / (packedToday + orders.length)) * 100)}%` }}
                />
              </div>
              <div className="text-zinc-500 text-center">
                {Math.round((packedToday / (packedToday + orders.length)) * 100)}% เสร็จแล้ว
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM NAV (Mobile) ── */}
      <div className="lg:hidden bg-zinc-900 border-t-2 border-zinc-800 flex">
        <div className="flex-1 p-2 text-center text-xs text-zinc-400">
          <div className="text-xl">👥</div>
          <div>{STAFF.filter(s => s.status === "กำลังแพ็ค").length}/{STAFF.length} คน</div>
        </div>
        <div className="flex-1 p-2 text-center text-xs text-amber-400">
          <div className="text-xl">📦</div>
          <div>{packedToday} ออเดอร์วันนี้</div>
        </div>
        <div className="flex-1 p-2 text-center text-xs text-red-400">
          <div className="text-xl">⚠️</div>
          <div>{alerts.length} แจ้งเตือน</div>
        </div>
      </div>
    </div>
  );
}
