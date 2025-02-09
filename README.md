# **♟ Faceoff**  

A decentralized chess wagering platform built on **Solana**, enabling users to stake funds in a smart contract and automatically settle wagers based on game results fetched from the Chess.com API.

---

## 📌 **Overview**  
Faceoff is a trustless system that allows players to bet on chess matches. It integrates **on-chain smart contracts**, **zero-knowledge proofs (ZKPs)** for fair validation, and **real-time game result fetching** via the Chess.com API.

---

## 📸 **Screenshots & Architecture**  
![HERO section](https://res.cloudinary.com/dxyexbgt6/image/upload/v1739134686/Screenshot_From_2025-02-10_02-20-23_e2sngv.png)

![Join Public/private challenge!](https://res.cloudinary.com/dxyexbgt6/image/upload/v1739134683/Screenshot_From_2025-02-10_02-23-27_n4ivcl.png)

---

## ⚙️ **Core Features**  

### ✅ **On-Chain Wagering System**  
- Users can **create**, **join**, and **cancel** chess wagers.  
- Funds are **escrowed in a Solana smart contract** until game completion.  

### 🔍 **Game Verification & Settlement**  
- Game results are **fetched from Chess.com API** in real time.  
- **ZKPs (Zero-Knowledge Proofs)** ensure fair and transparent verification.  
- The smart contract **automatically distributes** funds to the winner.    

### 🎮 **Web2 Integration**  
- Users **log in using Chess.com accounts**.  
- Game results are **verified off-chain and validated on-chain**.  

---

## 🚀 **Getting Started**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/Naman-45/Faceoff-client.git
cd Faceoff-client
```

### **2️⃣ Install Dependencies**  
```sh
npm install
```

### **3️⃣ Setup Environment Variables**  
Create a `.env` file in the root directory and configure the following variables:

```ini
DATABASE_URL=
DEVNET_RPC_URL=
baseHref=
Private_Key=
RECLAIM_APP_ID=
RECLAIM_APP_SECRET=
TWILIO_PHONE_NUMBER=
TWILIO_AUTH_TOKEN=
TWILIO_ACCOUNT_SID=
```

### **4️⃣ Run the Development Server**  
```sh
npm run dev
```

---

## 🔗 **Tech Stack**  
- **Blockchain:** Solana (Rust, Anchor)  
- **Frontend:** Next.js, TailwindCSS  
- **Smart Contracts:** Solana Programs (Anchor Framework)  
- **ZKP Integration:** Reclaim Protocol (zkFetch)  
- **APIs:** Chess.com API, Twilio (notifications)  

---

## 🤝 **Contributing**  
We welcome contributions! Please follow these steps:  
1. Fork the repository  
2. Create a feature branch (`git checkout -b feature-name`)  
3. Commit your changes (`git commit -m 'Add feature'`)  
4. Push to your branch (`git push origin feature-name`)  
5. Open a Pull Request  

---

## 📜 **License**  
This project is licensed under the MIT License.  

---

## 📧 **Contact**  
For any inquiries, reach out at: [namandevv45@gmail.com](mailto:namandevv45@gmail.com)  

---

Happy gaming! 🏆
