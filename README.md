<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Hillkoff Zero Waste Platform</title>

<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;700;800;900&display=swap" rel="stylesheet">

<style>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family:'Sarabun',sans-serif;
  background:#f0f7f2;
  color:#1a3a2a;
  min-height:100vh;
  padding-bottom:90px;
}

.bgMesh{
  position:fixed;
  inset:0;
  z-index:-1;
  background:
    radial-gradient(circle at top left,#d5f5e3,transparent 40%),
    radial-gradient(circle at bottom right,#d1f2eb,transparent 40%);
}

header{
  position:sticky;
  top:0;
  z-index:100;
  background:#145a32;
  color:white;
  padding:14px 18px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.logo{
  display:flex;
  align-items:center;
  gap:10px;
}

.logo h1{
  font-size:18px;
  font-weight:900;
}

.logo small{
  font-size:10px;
  color:#82e0aa;
}

.co2{
  text-align:right;
}

.co2 .num{
  font-size:20px;
  font-weight:800;
}

main{
  padding:18px;
  display:flex;
  flex-direction:column;
  gap:18px;
}

.card{
  background:white;
  border-radius:18px;
  padding:18px;
  box-shadow:0 4px 12px rgba(0,0,0,0.05);
}

.hero{
  background:linear-gradient(135deg,#145a32,#1e8449);
  color:white;
  text-align:center;
}

.hero h2{
  font-size:42px;
  font-weight:900;
  margin-top:10px;
}

.hero p{
  opacity:0.8;
}

.stats{
  display:flex;
  margin-top:16px;
  background:rgba(255,255,255,0.15);
  border-radius:12px;
  overflow:hidden;
}

.stat{
  flex:1;
  padding:12px;
}

.stat h3{
  font-size:18px;
}

.stat span{
  font-size:10px;
}

.divider{
  width:1px;
  background:rgba(255,255,255,0.2);
}

button{
  border:none;
  cursor:pointer;
  font-family:inherit;
}

.primaryBtn{
  margin-top:16px;
  background:white;
  color:#145a32;
  padding:12px 20px;
  border-radius:12px;
  font-weight:800;
}

.sectionTitle{
  font-size:13px;
  font-weight:800;
  color:#145a32;
  margin-bottom:10px;
}

.grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
}

.branch{
  background:white;
  border-radius:14px;
  padding:14px;
  text-align:center;
}

.branch h4{
  font-size:12px;
}

.branch p{
  font-size:10px;
  color:#888;
}

.branch strong{
  color:#145a32;
}

.record{
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px;
  border-radius:14px;
  background:white;
  margin-bottom:10px;
}

.record .icon{
  font-size:24px;
}

.record .info{
  flex:1;
}

.record .title{
  font-size:12px;
  font-weight:700;
}

.record .time{
  font-size:10px;
  color:#888;
}

.badge{
  background:#e8f5e9;
  color:#145a32;
  font-size:9px;
  border-radius:20px;
  padding:2px 7px;
  margin-top:4px;
  display:inline-block;
}

.bottomNav{
  position:fixed;
  bottom:0;
  left:0;
  right:0;
  background:white;
  display:flex;
  border-top:1px solid #ddd;
}

.navBtn{
  flex:1;
  padding:10px 0;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
  color:#888;
  font-size:10px;
}

.navBtn.active{
  color:#145a32;
  border-top:3px solid #145a32;
}

.formBox{
  display:none;
  flex-direction:column;
  gap:14px;
}

select,input{
  width:100%;
  padding:12px;
  border-radius:12px;
  border:2px solid #d5e8d4;
  font-family:inherit;
}

.submitBtn{
  background:#145a32;
  color:white;
  padding:14px;
  border-radius:12px;
  font-weight:800;
}

</style>
</head>

<body>

<div class="bgMesh"></div>

<header>

  <div class="logo">
    <div style="font-size:28px;">☕</div>

    <div>
      <h1>Hillkoff</h1>
      <small>Zero Waste · ESG Platform</small>
    </div>
  </div>

  <div class="co2">
    <div style="font-size:10px;">CO₂e รวม</div>
    <div class="num" id="totalCO2">0.00 kg</div>
  </div>

</header>

<main>

  <div class="card hero">

    <p>🌍 Carbon Footprint — องค์กร</p>

    <h2 id="heroCO2">0.00</h2>

    <div>kg CO₂e</div>

    <div class="stats">

      <div class="stat">
        <h3 id="todayCount">0</h3>
        <span>รายการวันนี้</span>
      </div>

      <div class="divider"></div>

      <div class="stat">
        <h3 id="monthCount">0</h3>
        <span>เดือนนี้</span>
      </div>

      <div class="divider"></div>

      <div class="stat">
        <h3 id="recordCount">0</h3>
        <span>ทั้งหมด</span>
      </div>

    </div>

    <button class="primaryBtn" onclick="toggleForm()">
      📝 บันทึกขยะใหม่
    </button>

  </div>

  <div class="card formBox" id="formBox">

    <div class="sectionTitle">
      เพิ่มรายการขยะ
    </div>

    <select id="branch">
      <option>สำนักงานใหญ่</option>
      <option>ช้างเผือก</option>
      <option>มหิดล</option>
      <option>ป่าแพง</option>
      <option>ทับเดื่อ</option>
      <option>ราติก้า</option>
    </select>

    <select id="waste">
      <option value="0.49">☕ กากกาแฟ</option>
      <option value="2.53">🧴 พลาสติก</option>
      <option value="0.91">🍃 เศษอาหาร</option>
      <option value="1.09">📄 กระดาษ</option>
    </select>

    <input type="number" id="qty" placeholder="น้ำหนัก (kg)" />

    <button class="submitBtn" onclick="saveRecord()">
      ✅ บันทึกข้อมูล
    </button>

  </div>

  <div>

    <div class="sectionTitle">
      สรุปล่าสุด
    </div>

    <div id="records"></div>

  </div>

</main>

<nav class="bottomNav">

  <button class="navBtn active">
    🏠
    <span>หน้าหลัก</span>
  </button>

  <button class="navBtn">
    📊
    <span>Analytics</span>
  </button>

  <button class="navBtn">
    💬
    <span>Chat</span>
  </button>

  <button class="navBtn">
    📋
    <span>Report</span>
  </button>

</nav>

<script>

let records = JSON.parse(localStorage.getItem("records") || "[]");

function toggleForm(){

  const box = document.getElementById("formBox");

  box.style.display =
    box.style.display === "flex"
      ? "none"
      : "flex";
}

function saveRecord(){

  const branch = document.getElementById("branch").value;
  const waste = document.getElementById("waste");
  const factor = Number(waste.value);
  const wasteName = waste.options[waste.selectedIndex].text;
  const qty = Number(document.getElementById("qty").value);

  if(!qty){
    alert("กรุณากรอกน้ำหนัก");
    return;
  }

  const co2 = (factor * qty).toFixed(2);

  const item = {
    branch,
    waste:wasteName,
    qty,
    co2,
    time:new Date().toLocaleString("th-TH")
  };

  records.unshift(item);

  localStorage.setItem("records",JSON.stringify(records));

  render();

  document.getElementById("qty").value="";

  alert("บันทึกสำเร็จ ✅");
}

function render(){

  const wrap = document.getElementById("records");

  wrap.innerHTML = "";

  let total = 0;

  records.forEach(r=>{

    total += Number(r.co2);

    wrap.innerHTML += `

      <div class="record">

        <div class="icon">
          ${r.waste.includes("☕") ? "☕" : "♻️"}
        </div>

        <div class="info">

          <div class="title">
            ${r.branch} · ${r.waste}
          </div>

          <div class="time">
            ${r.time}
          </div>

        </div>

        <div>

          <div style="font-weight:800;color:#145a32;">
            ${r.co2} kg
          </div>

          <div class="badge">
            ✅ ESG
          </div>

        </div>

      </div>

    `;
  });

  document.getElementById("heroCO2").innerText = total.toFixed(2);
  document.getElementById("totalCO2").innerText = total.toFixed(2)+" kg";
  document.getElementById("recordCount").innerText = records.length;
  document.getElementById("todayCount").innerText = records.length;
  document.getElementById("monthCount").innerText = records.length;
}

render();

</script>

</body>
</html>
